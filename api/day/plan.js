const {
  readEnv,
  missingGoogleConfig,
  readBearer,
  sendJson,
  readBody,
  getSupabaseUser,
  getMembership,
  supabaseServiceRest,
  encryptToken,
  decryptToken,
  publicError,
} = require("../../lib/calendar-oauth");

const defaultTimeZone = "Asia/Kolkata";
const minimumUsefulWindowMinutes = 25;

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Cache-Control": "no-store",
    });
    res.end();
    return;
  }

  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Use POST." });
    return;
  }

  try {
    const env = readEnv();
    const missing = missingGoogleConfig(env);
    if (missing.length) {
      sendJson(res, 503, {
        error: "Google Calendar is not fully configured yet.",
        missing,
      });
      return;
    }

    const authToken = readBearer(req.headers.authorization);
    if (!authToken) throw publicError(401, "Missing Supabase session.");

    const body = await readBody(req);
    const user = await getSupabaseUser(env, authToken);
    const membership = await getMembership(env, authToken, user.id);
    if (!membership) throw publicError(403, "Join the Gensync workspace first.");

    const timeZone = sanitizeTimeZone(body.timeZone);
    const date = sanitizeDate(body.date, timeZone);
    const dayStart = sanitizeClock(body.dayStart, "12:00");
    const dayEnd = sanitizeClock(body.dayEnd, "02:30");
    const protectedAvailabilityMinutes = clamp(roundTo15(Number(body.protectedAvailabilityMinutes) || 240), 0, 480);
    const requestedWorkStart = zonedTimeToUtc(date, dayStart, timeZone);
    let workStart = requestedWorkStart;
    let workEnd = zonedTimeToUtc(date, dayEnd, timeZone);
    if (workEnd <= requestedWorkStart) {
      workEnd = zonedTimeToUtc(addDays(date, 1), dayEnd, timeZone);
    }
    let lateStart = false;
    if (date === todayInZone(timeZone)) {
      const startFromNow = roundDateUp(addMinutes(new Date(), 10), 15);
      if (startFromNow > workStart) {
        workStart = startFromNow;
        lateStart = true;
      }
      if (workStart >= workEnd) {
        workEnd = addMinutes(workStart, 4 * 60);
      }
    }

    const connection = await readCalendarConnection(env, membership.team_id, user.id);
    if (!connection) {
      throw publicError(409, "Connect Google Calendar first in Vault, then run the day planner.");
    }

    const accessToken = await getValidAccessToken(env, connection);
    const [events, tasks] = await Promise.all([
      fetchGoogleEvents(accessToken, date, timeZone, workEnd),
      readOpenTasks(env, membership.team_id, user.id),
    ]);

    const normalizedEvents = normalizeGoogleEvents(events, timeZone);
    const plan = buildDayPlan({
      accountEmail: connection.account_email,
      date,
      timeZone,
      dayStart,
      dayEnd,
      requestedWorkStart,
      workStart,
      workEnd,
      lateStart,
      protectedAvailabilityMinutes,
      events: normalizedEvents,
      tasks,
      user,
      membership,
    });

    sendJson(res, 200, plan);
  } catch (error) {
    console.error(error);
    sendJson(res, error.statusCode || 500, {
      error: error.publicMessage || "Could not plan the day from Google Calendar.",
    });
  }
};

async function readCalendarConnection(env, teamId, userId) {
  const rows = await supabaseServiceRest(
    env,
    `/calendar_connections?team_id=eq.${encodeURIComponent(teamId)}&user_id=eq.${encodeURIComponent(userId)}&provider=eq.google&select=id,account_email,access_token_enc,refresh_token_enc,expiry_date,scopes,updated_at&order=updated_at.desc&limit=1`,
  );
  return rows[0] || null;
}

async function getValidAccessToken(env, connection) {
  const expiry = connection.expiry_date ? Date.parse(connection.expiry_date) : 0;
  if (connection.access_token_enc && (!expiry || expiry > Date.now() + 2 * 60 * 1000)) {
    return decryptToken(env, connection.access_token_enc);
  }

  const refreshToken = decryptToken(env, connection.refresh_token_enc);
  if (!refreshToken) {
    throw publicError(409, "Google Calendar needs to be reconnected so Gensync OS can refresh access.");
  }

  const body = new URLSearchParams({
    client_id: env.googleClientId,
    client_secret: env.googleClientSecret,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.access_token) {
    console.error("Google token refresh failed", response.status, payload.error || payload.error_description || "");
    throw publicError(409, "Google Calendar access expired. Reconnect the account from Vault.");
  }

  await supabaseServiceRest(env, `/calendar_connections?id=eq.${encodeURIComponent(connection.id)}`, {
    method: "PATCH",
    prefer: "return=minimal",
    body: {
      access_token_enc: encryptToken(env, payload.access_token),
      expiry_date: Number(payload.expires_in)
        ? new Date(Date.now() + Number(payload.expires_in) * 1000).toISOString()
        : connection.expiry_date || null,
      scopes: payload.scope || connection.scopes || "",
      updated_at: new Date().toISOString(),
    },
  });

  return payload.access_token;
}

async function fetchGoogleEvents(accessToken, date, timeZone, workEnd) {
  const timeMin = zonedTimeToUtc(date, "00:00", timeZone).toISOString();
  const nextMidnight = zonedTimeToUtc(addDays(date, 1), "00:00", timeZone);
  const timeMax = new Date(Math.max(nextMidnight.getTime(), new Date(workEnd).getTime())).toISOString();
  const url = new URL("https://www.googleapis.com/calendar/v3/calendars/primary/events");
  url.searchParams.set("timeMin", timeMin);
  url.searchParams.set("timeMax", timeMax);
  url.searchParams.set("singleEvents", "true");
  url.searchParams.set("orderBy", "startTime");
  url.searchParams.set("maxResults", "80");

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    console.error("Google Calendar events failed", response.status, payload.error?.message || payload.error || "");
    throw publicError(409, "Could not read Google Calendar events. Reconnect Calendar if this keeps happening.");
  }
  return payload.items || [];
}

async function readOpenTasks(env, teamId, userId) {
  const rows = await supabaseServiceRest(
    env,
    `/tasks?team_id=eq.${encodeURIComponent(teamId)}&status=neq.Done&select=id,client_id,title,owner_label,owner_user_id,visibility,status,priority,due_label,review_gate,notes,created_at,updated_at&order=created_at.asc`,
  );
  return rows.filter((task) => (task.visibility || "team") === "team" || task.owner_user_id === userId);
}

function buildDayPlan({
  accountEmail,
  date,
  timeZone,
  dayStart,
  dayEnd,
  requestedWorkStart,
  workStart,
  workEnd,
  lateStart,
  protectedAvailabilityMinutes,
  events,
  tasks,
  user,
  membership,
}) {
  const busyIntervals = mergeIntervals(
    events
      .filter((event) => event.busy)
      .map((event) => clampInterval(event, workStart, workEnd))
      .filter((event) => minutesBetween(event.start, event.end) > 0),
  );
  const visibleEvents = events
    .filter((event) => event.end > workStart && event.start < workEnd)
    .map((event) => clampInterval(event, workStart, workEnd));
  const freeWindows = invertIntervals(busyIntervals, workStart, workEnd);
  const { protectedWindows, taskWindows } = reserveAvailability(freeWindows, protectedAvailabilityMinutes);
  const candidateTasks = chooseTasksForUser(tasks, user, membership, date);
  const scheduled = scheduleCandidates(buildCandidates(candidateTasks), taskWindows);
  const protectedActual = protectedWindows.reduce((sum, item) => sum + item.minutes, 0);

  return {
    accountEmail,
    date,
    timeZone,
    dayStart,
    dayEnd,
    requestedStart: requestedWorkStart.toISOString(),
    effectiveStart: workStart.toISOString(),
    effectiveEnd: workEnd.toISOString(),
    lateStart,
    protectedAvailabilityMinutes,
    protectedAvailabilityActualMinutes: protectedActual,
    events: visibleEvents.map(serializeInterval),
    busyWindows: busyIntervals.map(serializeInterval),
    freeWindows: freeWindows.map((item) => ({ ...serializeInterval(item), minutes: minutesBetween(item.start, item.end) })),
    protectedWindows: protectedWindows.map((item) => ({
      ...serializeInterval(item),
      minutes: item.minutes,
      label: item.label,
      type: "protected_availability",
    })),
    scheduledBlocks: scheduled.blocks.map((block) => ({
      ...serializeInterval(block),
      id: block.id,
      title: block.title,
      taskId: block.taskId || "",
      priority: block.priority,
      status: block.status || "Next",
      reviewGate: block.reviewGate || "Time block",
      type: block.type,
      minutes: block.minutes,
      notes: block.notes || "",
    })),
    unscheduledTasks: scheduled.unscheduled.map((task) => ({
      id: task.taskId || task.id,
      title: task.title,
      priority: task.priority,
      reason: "No non-booking window was long enough today.",
    })),
    reminders: buildReminders(date, timeZone, workStart, workEnd, scheduled.blocks, protectedActual),
    summary: buildSummary(visibleEvents, protectedActual, scheduled.blocks, scheduled.unscheduled, lateStart, workStart, timeZone),
  };
}

function normalizeGoogleEvents(items, timeZone) {
  return items
    .filter((event) => event.status !== "cancelled")
    .map((event) => {
      const allDay = Boolean(event.start?.date);
      const start = allDay
        ? zonedTimeToUtc(event.start.date, "00:00", timeZone)
        : new Date(event.start?.dateTime || event.created || Date.now());
      const end = allDay
        ? zonedTimeToUtc(event.end?.date || event.start.date, "00:00", timeZone)
        : new Date(event.end?.dateTime || event.start?.dateTime || start);
      return {
        id: event.id || "",
        title: event.summary || "Busy",
        start,
        end: end > start ? end : addMinutes(start, 30),
        allDay,
        busy: event.transparency !== "transparent",
        htmlLink: event.htmlLink || "",
        source: "google",
      };
    });
}

function chooseTasksForUser(tasks, user, membership, date) {
  const owner = ownerDisplayName(membership.display_name || user.email || "");
  const usefulOwners = new Set([owner, "Manish", "Codex", "Team"].filter(Boolean));
  const dueSignals = ["today", date, "overdue", "this week"];

  return tasks
    .filter((task) => task.status !== "Done" && task.status !== "Hold")
    .filter((task) => {
      const owners = parseOwners(task.owner_label);
      const ownerMatch = owners.some((item) => usefulOwners.has(item));
      const ownedByUser = task.owner_user_id === user.id;
      const dueMatch = dueSignals.some((signal) => String(task.due_label || "").toLowerCase().includes(signal));
      return ownerMatch || ownedByUser || task.priority === "P0" || dueMatch;
    })
    .sort(compareTasks)
    .slice(0, 10);
}

function buildCandidates(tasks) {
  const p0 = tasks.filter((task) => task.priority === "P0").slice(0, 4).map(taskToCandidate);
  const rest = tasks.filter((task) => task.priority !== "P0").slice(0, 6).map(taskToCandidate);
  const stateBlocks = [
    {
      id: "state-meal",
      title: "One real meal",
      priority: "P1",
      minutes: 30,
      reviewGate: "State",
      type: "state",
      notes: "Non-negotiable maintenance. Energy is an execution dependency.",
    },
    {
      id: "state-body",
      title: "20 minutes walking or gym",
      priority: "P1",
      minutes: 25,
      reviewGate: "State",
      type: "state",
      notes: "Physical state reset. Keep it small enough that it actually happens.",
    },
    {
      id: "shutdown",
      title: "Board review + shutdown",
      priority: "P1",
      minutes: 20,
      reviewGate: "Internal",
      type: "ritual",
      notes: "Mark Done/Waiting/Review, capture blockers, and decide tomorrow's first block.",
    },
  ];

  return [...p0.slice(0, 2), stateBlocks[0], stateBlocks[1], ...p0.slice(2), ...rest, stateBlocks[2]];
}

function taskToCandidate(task) {
  return {
    id: task.id,
    taskId: task.id,
    title: task.title,
    priority: task.priority || "P1",
    status: task.status,
    minutes: estimateTaskMinutes(task),
    reviewGate: task.review_gate || "Time block",
    type: "task",
    notes: task.notes || "",
  };
}

function scheduleCandidates(candidates, windows) {
  const mutableWindows = windows
    .map((window) => ({ start: new Date(window.start), end: new Date(window.end) }))
    .filter((window) => minutesBetween(window.start, window.end) >= minimumUsefulWindowMinutes);
  const blocks = [];
  const unscheduled = [];

  candidates.forEach((candidate) => {
    const index = mutableWindows.findIndex((window) => minutesBetween(window.start, window.end) >= candidate.minutes);
    if (index === -1) {
      unscheduled.push(candidate);
      return;
    }

    const window = mutableWindows[index];
    const start = new Date(window.start);
    const end = addMinutes(start, candidate.minutes);
    blocks.push({
      ...candidate,
      start,
      end,
    });

    window.start = addMinutes(end, 5);
    if (minutesBetween(window.start, window.end) < minimumUsefulWindowMinutes) {
      mutableWindows.splice(index, 1);
    }
  });

  return { blocks, unscheduled };
}

function reserveAvailability(freeWindows, targetMinutes) {
  let remaining = Number(targetMinutes || 0);
  const protectedWindows = [];
  const taskWindows = [];

  freeWindows.forEach((window) => {
    const duration = minutesBetween(window.start, window.end);
    if (remaining <= 0 || duration < 45) {
      taskWindows.push(window);
      return;
    }

    let reserve = Math.min(remaining, duration);
    reserve = duration - reserve >= 45 ? roundDownTo15(reserve) : duration;
    if (reserve <= 0) {
      taskWindows.push(window);
      return;
    }

    const protectedStart = addMinutes(window.end, -reserve);
    if (minutesBetween(window.start, protectedStart) >= minimumUsefulWindowMinutes) {
      taskWindows.push({ start: window.start, end: protectedStart });
    }
    protectedWindows.push({
      start: protectedStart,
      end: window.end,
      minutes: minutesBetween(protectedStart, window.end),
      label: "Calendly / booking availability",
    });
    remaining -= reserve;
  });

  return { protectedWindows, taskWindows };
}

function buildReminders(date, timeZone, workStart, workEnd, blocks, protectedMinutes) {
  const firstBlock = blocks[0];
  const reminders = [
    {
      id: "reminder-start",
      title: firstBlock ? `Start: ${firstBlock.title}` : "Open board and choose one P0",
      due: firstBlock ? firstBlock.start.toISOString() : addMinutes(workStart, 5).toISOString(),
      notes: "Start with the first real block before checking random inputs.",
    },
    {
      id: "reminder-availability",
      title: "Keep booking windows open",
      due: addMinutes(workStart, 15).toISOString(),
      notes: `${protectedMinutes} minutes are protected for Calendly-style availability. Do not fill them unless revenue urgency beats meetings.`,
    },
    {
      id: "reminder-shutdown",
      title: "Shutdown: update board and tomorrow's first move",
      due: addMinutes(workEnd, -20).toISOString(),
      notes: "Mark what shipped, what is waiting, and what needs review so tomorrow starts clean.",
    },
  ];

  return reminders.map((item) => ({
    ...item,
    date,
    timeZone,
  }));
}

function buildSummary(events, protectedMinutes, blocks, unscheduled, lateStart, workStart, timeZone) {
  const busyCount = events.filter((event) => event.busy).length;
  const p0Blocks = blocks.filter((block) => block.priority === "P0").length;
  const unscheduledP0 = unscheduled.filter((block) => block.priority === "P0").length;
  return [
    lateStart ? `late start from ${formatClock(workStart, timeZone)}` : "",
    `${busyCount} calendar event${busyCount === 1 ? "" : "s"} checked`,
    `${protectedMinutes} minutes protected for booking`,
    `${blocks.length} block${blocks.length === 1 ? "" : "s"} planned`,
    `${p0Blocks} P0 block${p0Blocks === 1 ? "" : "s"} placed`,
    unscheduledP0 ? `${unscheduledP0} P0 task${unscheduledP0 === 1 ? "" : "s"} still need a slot` : "",
  ].filter(Boolean).join(" · ");
}

function estimateTaskMinutes(task) {
  const text = `${task.title || ""} ${task.notes || ""}`.toLowerCase();
  if (/(video|edit|render|motion|export|animation)/.test(text)) return task.priority === "P0" ? 120 : 90;
  if (/(message|email|brevo|reply|quote|call|ask)/.test(text)) return 30;
  if (/(review|qc|check|proof)/.test(text)) return 45;
  if (task.priority === "P0") return 90;
  if (task.priority === "P1") return 60;
  return 45;
}

function compareTasks(a, b) {
  return priorityRank(a.priority) - priorityRank(b.priority)
    || dueRank(a.due_label) - dueRank(b.due_label)
    || statusRank(a.status) - statusRank(b.status)
    || String(a.title || "").localeCompare(String(b.title || ""));
}

function priorityRank(priority) {
  return { P0: 0, P1: 1, P2: 2 }[priority] ?? 3;
}

function statusRank(status) {
  return {
    Doing: 0,
    Next: 1,
    Review: 2,
    Waiting: 3,
    Hold: 4,
    Done: 99,
  }[status] ?? 5;
}

function dueRank(due) {
  const text = String(due || "").trim().toLowerCase();
  if (!text || text === "open") return 50;
  if (text.includes("overdue")) return -2;
  if (text.includes("today")) return 0;
  if (text.includes("tomorrow")) return 1;
  if (text.includes("this week")) return 3;
  return 20;
}

function parseOwners(value) {
  return String(value || "")
    .split(/\s*(?:,|\+|&|\/)\s*/)
    .map(ownerDisplayName)
    .filter(Boolean);
}

function ownerDisplayName(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const base = raw.includes("@") ? raw.split("@")[0] : raw;
  const normalized = base.trim().toLowerCase();
  if (normalized.includes("manish")) return "Manish";
  if (normalized.includes("mohit")) return "Mohit";
  if (normalized.includes("codex")) return "Codex";
  if (normalized === "team") return "Team";
  return base.trim();
}

function invertIntervals(busyIntervals, start, end) {
  let cursor = new Date(start);
  const windows = [];

  busyIntervals.forEach((busy) => {
    if (busy.start > cursor && minutesBetween(cursor, busy.start) >= minimumUsefulWindowMinutes) {
      windows.push({ start: new Date(cursor), end: new Date(busy.start) });
    }
    if (busy.end > cursor) cursor = new Date(busy.end);
  });

  if (end > cursor && minutesBetween(cursor, end) >= minimumUsefulWindowMinutes) {
    windows.push({ start: new Date(cursor), end: new Date(end) });
  }

  return windows;
}

function mergeIntervals(intervals) {
  const sorted = intervals
    .map((item) => ({ ...item, start: new Date(item.start), end: new Date(item.end) }))
    .filter((item) => item.end > item.start)
    .sort((a, b) => a.start - b.start);
  const merged = [];

  sorted.forEach((item) => {
    const last = merged[merged.length - 1];
    if (!last || item.start > last.end) {
      merged.push(item);
      return;
    }
    if (item.end > last.end) last.end = item.end;
  });

  return merged;
}

function clampInterval(interval, start, end) {
  return {
    ...interval,
    start: new Date(Math.max(new Date(interval.start).getTime(), start.getTime())),
    end: new Date(Math.min(new Date(interval.end).getTime(), end.getTime())),
  };
}

function serializeInterval(item) {
  return {
    ...item,
    start: new Date(item.start).toISOString(),
    end: new Date(item.end).toISOString(),
  };
}

function zonedTimeToUtc(dateKey, clock, timeZone) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const [hour, minute] = clock.split(":").map(Number);
  const targetAsUtc = Date.UTC(year, month - 1, day, hour, minute || 0, 0);
  let utc = new Date(targetAsUtc);

  for (let index = 0; index < 3; index += 1) {
    const parts = zonedParts(utc, timeZone);
    const shownAsUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, 0);
    utc = new Date(utc.getTime() + targetAsUtc - shownAsUtc);
  }

  return utc;
}

function zonedParts(date, timeZone) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const parts = Object.fromEntries(formatter.formatToParts(date).map((part) => [part.type, part.value]));
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
  };
}

function todayInZone(timeZone) {
  const parts = zonedParts(new Date(), timeZone);
  return `${parts.year}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`;
}

function addDays(dateKey, days) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days, 0, 0, 0));
  return date.toISOString().slice(0, 10);
}

function addMinutes(date, minutes) {
  return new Date(new Date(date).getTime() + minutes * 60 * 1000);
}

function minutesBetween(start, end) {
  return Math.max(0, Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000));
}

function sanitizeTimeZone(value) {
  const zone = String(value || defaultTimeZone).slice(0, 80);
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: zone }).format(new Date());
    return zone;
  } catch {
    return defaultTimeZone;
  }
}

function sanitizeDate(value, timeZone) {
  const date = String(value || "");
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  return todayInZone(timeZone);
}

function sanitizeClock(value, fallback) {
  const match = String(value || "").match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return fallback;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return fallback;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function roundTo15(value) {
  return Math.round(value / 15) * 15;
}

function roundDownTo15(value) {
  return Math.floor(value / 15) * 15;
}

function roundDateUp(date, stepMinutes) {
  const stepMs = stepMinutes * 60 * 1000;
  return new Date(Math.ceil(new Date(date).getTime() / stepMs) * stepMs);
}

function formatClock(value, timeZone) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(value));
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
