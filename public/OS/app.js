const DATA_KEY = "gensync.os.data.v1";
const AUTH_KEY = "gensync.os.auth.v1";
const SESSION_KEY = "gensync.os.session.v1";
const TOUR_KEY = "gensync.os.tour.v1";
const DAY_RHYTHM_KEY = "gensync.os.day.rhythm.v1";
const CHAT_UI_KEY = "gensync.os.chat.ui.v1";
const CHAT_DRAFTS_KEY = "gensync.os.chat.drafts.v1";
const TEAM_NAME = "Gensync";
const TARGET_COLLECTED_USD = 50000;
const BASELINE_COLLECTED_USD = 2800;
const MAX_AGENT_ATTACHMENTS = 4;
const MAX_AGENT_ATTACHMENT_BYTES = 3 * 1024 * 1024;
const MAX_DRAFT_ATTACHMENT_STORAGE_BYTES = 900 * 1024;
const CHAT_DEFAULT_VISIBILITY = "private";
const supabaseConfig = window.GENSYNC_SUPABASE;
const supabaseClient =
  supabaseConfig && window.supabase
    ? window.supabase.createClient(supabaseConfig.url, supabaseConfig.anonKey)
    : null;

const stateOptions = ["Next", "Doing", "Waiting", "Review", "Done", "Hold"];
const leadStageOptions = [
  "Research",
  "Build list",
  "Contacted",
  "Replied",
  "Call booked",
  "Proposal sent",
  "Closed won",
  "Collected",
  "Lost",
];
const navItems = [
  ["command", "Command", "C"],
  ["work", "Work", "W"],
  ["context", "Library", "L"],
  ["pipeline", "Pipeline", "P"],
  ["team", "Team", "M"],
];
const dayRhythms = [
  {
    id: "night",
    label: "Night rhythm",
    start: "12:00",
    end: "02:30",
    protectedAvailabilityMinutes: 240,
    description: "Sleep around 3/4 AM, start real work around noon, finish after midnight.",
  },
  {
    id: "standard",
    label: "Standard",
    start: "09:30",
    end: "22:00",
    protectedAvailabilityMinutes: 240,
    description: "Normal office-style day.",
  },
  {
    id: "recovery",
    label: "Recovery",
    start: "14:00",
    end: "00:30",
    protectedAvailabilityMinutes: 120,
    description: "Late wake-up, lower ambition, protect the mission-critical work.",
  },
  {
    id: "custom",
    label: "Custom",
    start: "12:00",
    end: "02:30",
    protectedAvailabilityMinutes: 240,
    description: "Use the exact times below.",
  },
];
const tourSteps = [
  {
    view: "command",
    selector: '[data-tour="intake"]',
    title: "Start with the raw thing",
    body: "Drop a voice note, screenshot, PDF, referral, or messy thought here. The teammate turns it into context and proposed work.",
  },
  {
    view: "command",
    selector: '[data-tour="review"]',
    title: "Review before writes",
    body: "The agent can suggest tasks, reminders, and vault items, but board changes wait for your confirmation.",
  },
  {
    view: "command",
    selector: '[data-tour="revenue"]',
    title: "Watch collected cash",
    body: "This is now a scoreboard. Mark deals as collected in CRM and the north-star number moves.",
  },
  {
    view: "day",
    selector: '[data-tour="day-plan"]',
    title: "Make the day real",
    body: "Plan around calendar events, protect booking space, then confirm time blocks and reminders onto the board.",
  },
  {
    view: "tasks",
    selector: '[data-tour="board"]',
    title: "Control execution",
    body: "Use the board to see what is owed, blocked, in review, or done across Manish, Mohit, and Codex.",
  },
  {
    view: "context",
    selector: '[data-tour="vault"]',
    title: "Context is the guardrail",
    body: "Upload docs, transcripts, contracts, invoices, and links so the teammate asks for missing truth instead of hallucinating.",
  },
  {
    view: "team",
    selector: '[data-tour="invite"]',
    title: "Invite real teammates",
    body: "Mohit joins with this code after signing up. The system does not trust names alone.",
  },
];

const seedData = {
  clients: [
    {
      id: "geodo",
      name: "Geodo",
      owner: "Manish",
      retainer: "$2,000/mo",
      status: "Active",
      health: 74,
      next: "Finish Video 3 for X, then FAQ 03 Human Voice.",
      notes:
        "FAQ 04 Low Response is posted. Vlog 2 hybrid is done/exported. FAQ 02 Safety is held for audience comments.",
      proof:
        "Nadav reported semi-viral X/LinkedIn performance and paying users from recent videos.",
    },
    {
      id: "connectme",
      name: "ConnectME",
      owner: "Manish + Mohit",
      retainer: "INR 75,000/mo",
      status: "Active",
      health: 62,
      next:
        "Wait for Mohit answers, then move approved emailer into Brevo test send.",
      notes:
        "Monthly schedule: 1 emailer, 2 LinkedIn pieces, 4 videos/ad videos.",
      proof: "Shared GitHub repo created for ConnectME work context.",
    },
  ],
  tasks: [
    {
      id: createId(),
      title: "Geodo Video 3 for X",
      client: "Geodo",
      owner: "Manish",
      status: "Next",
      priority: "P0",
      due: "Today",
      review: "Client asset",
      notes:
        "Main proof/demo. Use screen recording as proof: website -> ICP -> contacts -> emails -> channels.",
    },
    {
      id: createId(),
      title: "Geodo FAQ 03 Human Voice",
      client: "Geodo",
      owner: "Manish",
      status: "Next",
      priority: "P0",
      due: "After Video 3",
      review: "Client asset",
      notes:
        "Frame as approved context -> writing style. Do not repeat the AI-bad angle.",
    },
    {
      id: createId(),
      title: "ConnectME Brevo answer capture",
      client: "ConnectME",
      owner: "Mohit",
      status: "Waiting",
      priority: "P1",
      due: "Today",
      review: "Client message",
      notes:
        "Need Brevo access, list, sender, CTA, subject/preview, test send, launch time.",
    },
    {
      id: createId(),
      title: "Record Manish raw clip",
      client: "Gensync",
      owner: "Manish",
      status: "Next",
      priority: "P1",
      due: "This week",
      review: "Personal post",
      visibility: "private",
      notes:
        "Angle: AI made me faster and less creative. Do not publish without review.",
    },
    {
      id: createId(),
      title: "Rotate exposed GitHub PATs",
      client: "Ops",
      owner: "Manish",
      status: "Next",
      priority: "P0",
      due: "Today",
      review: "Security",
      notes:
        "Tokens were pasted into chat. Treat as burned and rotate from GitHub.",
    },
  ],
  leads: [
    {
      id: createId(),
      company: "AI / technical founder targets",
      stage: "Research",
      value: 5000,
      owner: "Manish",
      next: "Create 20 high-quality lead packets from public proof.",
      source: "Personal brand + proof gifts",
    },
    {
      id: createId(),
      company: "Warm intros from existing network",
      stage: "Build list",
      value: 10000,
      owner: "Manish",
      next: "Ask for five specific warm intros after Geodo exports are done.",
      source: "Nadav / existing clients / founder circles",
    },
  ],
  evidence: [
    {
      id: createId(),
      title: "Geodo active edit truth",
      type: "Local file",
      confidence: "Verified",
      link:
        "/Users/manishsampatirao/Documents/ANTI_GRAVITY/Geodo/GEODO_ACTIVE_EDIT_BOARD.md",
      note:
        "FAQ 04 posted. Vlog 2 done/exported. Video 3 next. FAQ 03 second.",
    },
    {
      id: createId(),
      title: "ConnectME shared repo",
      type: "GitHub",
      confidence: "Verified",
      link: "https://github.com/spunkykiller/CME_CONTEXT_GenSync",
      note: "Pushed commit a22f7bc with delivery context and Brevo handoff.",
    },
    {
      id: createId(),
      title: "Nadav performance signal",
      type: "WhatsApp log",
      confidence: "Reported",
      link:
        "/Users/manishsampatirao/Documents/ANTI_GRAVITY/Geodo/April_month/Whatsapp Chat Log",
      note:
        "Nadav said recent videos went semi-viral and brought paying users.",
    },
  ],
  contexts: [
    {
      id: createId(),
      title: "Geodo WhatsApp log",
      category: "Transcript",
      sourceUrl:
        "/Users/manishsampatirao/Documents/ANTI_GRAVITY/Geodo/April_month/Whatsapp Chat Log",
      summary: "Client working context and performance signal source.",
      content: "",
      confidence: "Reported",
      visibility: "team",
    },
    {
      id: createId(),
      title: "ConnectME GitHub context repo",
      category: "GitHub",
      sourceUrl: "https://github.com/spunkykiller/CME_CONTEXT_GenSync",
      summary: "Shared ConnectME delivery context and Brevo handoff.",
      content: "",
      confidence: "Verified",
      visibility: "team",
    },
  ],
  calendarSources: [],
  projectSpaces: [],
  chatThreads: [],
  chatMessages: [],
  self: dailySelfTemplate(),
};

let data = clone(seedData);
let session = null;
let activeTeamId = null;
let workspace = { team: null, role: "", members: [] };
let needsWorkspace = false;
let booting = true;
let authNotice = "";
let workspaceError = "";
let view = "command";
let workView = "board";
let pipelineView = "deals";
let contextFolderId = "";
let taskView = "active";
let filter = "all";
let ownerFilter = "all";
let scopeFilter = "all";
let editingTaskId = "";
let agentState = {
  mode: "operator",
  prompt: "",
  attachments: [],
  loading: false,
  result: null,
  error: "",
  activeThreadId: "",
  projectId: "",
  visibility: CHAT_DEFAULT_VISIBILITY,
  threadKind: "private",
  recipientUserId: "",
};
let voiceState = {
  listening: false,
  message: "",
};
let voiceRecognition = null;
let voiceRestartTimer = null;
let voiceManualStop = false;
let voiceTranscriptBase = "";
let voiceFinalTranscript = "";
let dayState = loadDayState();
let calendarNotice = "";
let calendarConnecting = false;
let cloudSyncing = false;
let lastCloudRefreshAt = 0;
let tourOpen = false;
let tourStep = 0;
let celebrationState = null;
let celebrationTimer = null;
let chatDraftTimer = null;

const app = document.getElementById("app");

installFatalHandlers();
window.addEventListener("resize", () => {
  if (tourOpen) window.requestAnimationFrame(positionTour);
});
window.addEventListener("focus", () => {
  refreshCloudData("focus");
});
window.addEventListener("beforeunload", () => {
  saveCurrentChatDraft();
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    saveCurrentChatDraft();
    return;
  }
  refreshCloudData("visible");
});
consumeUrlState();
render();
init();

async function init() {
  try {
    if (supabaseClient) {
      const result = await withTimeout(
        supabaseClient.auth.getSession(),
        8000,
        "Supabase session check timed out.",
      );
      const authSession = result.data.session;
      if (authSession) {
        setCloudSession(authSession);
        await withTimeout(loadCloudWorkspace(), 20000, "Workspace load timed out.");
      }
    } else {
      data = loadData();
      session = loadSession();
    }
    restoreChatUiState();
  } catch (error) {
    console.error(error);
    if (session) {
      workspaceError = `Could not load workspace: ${error.message || "unknown Supabase error"}`;
    } else {
      authNotice = `Could not load workspace: ${error.message || "unknown Supabase error"}`;
      session = null;
    }
  }

  booting = false;
  tourOpen = Boolean(session) && !localStorage.getItem(tourStorageKey());
  render();
}

function installFatalHandlers() {
  window.addEventListener("error", (event) => {
    showFatalError(event.error?.message || event.message || "Unknown browser error.");
  });

  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason;
    showFatalError(reason?.message || String(reason || "Unknown async error."));
  });
}

function showFatalError(message) {
  if (!app) return;
  booting = false;
  app.innerHTML = `
    <section class="auth-screen">
      <div class="auth-panel">
        <p class="eyebrow">Crash Guard</p>
        <h1>Gensync OS hit a browser error</h1>
        <p class="muted">${escapeHtml(message)}</p>
        <button class="primary-button" type="button" onclick="window.location.reload()">Reload</button>
      </div>
    </section>
  `;
}

function withTimeout(promise, timeoutMs, message) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      window.setTimeout(() => reject(new Error(message)), timeoutMs);
    }),
  ]);
}

function consumeUrlState() {
  const params = new URLSearchParams(window.location.search || "");
  const requestedView = params.get("view");
  if (requestedView && navItems.some(([id]) => id === requestedView)) {
    view = requestedView;
  }

  const calendarState = params.get("calendar");
  if (calendarState === "connected") {
    view = requestedView && navItems.some(([id]) => id === requestedView) ? requestedView : "context";
    calendarNotice = `Google Calendar connected: ${params.get("account") || "account ready"}.`;
  } else if (calendarState === "error") {
    view = requestedView && navItems.some(([id]) => id === requestedView) ? requestedView : "context";
    calendarNotice = `Calendar connection failed: ${params.get("message") || "try again"}.`;
  }

  if (requestedView || calendarState) {
    const cleanUrl = `${window.location.pathname}${window.location.hash || ""}`;
    window.history.replaceState({}, "", cleanUrl);
  }
}

function getTodayKey() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function roundDateUp(date, stepMinutes) {
  const stepMs = stepMinutes * 60 * 1000;
  return new Date(Math.ceil(new Date(date).getTime() / stepMs) * stepMs);
}

function clockFromDate(date) {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function loadDayState() {
  const fallback = {
    rhythm: "night",
    date: getTodayKey(),
    dayStart: "12:00",
    dayEnd: "02:30",
    protectedAvailabilityMinutes: 240,
    loading: false,
    error: "",
    plan: null,
  };

  try {
    const stored = JSON.parse(localStorage.getItem(DAY_RHYTHM_KEY) || "{}");
    return {
      ...fallback,
      ...stored,
      date: getTodayKey(),
      loading: false,
      error: "",
      plan: null,
    };
  } catch {
    return fallback;
  }
}

function saveDayRhythm() {
  localStorage.setItem(DAY_RHYTHM_KEY, JSON.stringify({
    rhythm: dayState.rhythm,
    dayStart: dayState.dayStart,
    dayEnd: dayState.dayEnd,
    protectedAvailabilityMinutes: dayState.protectedAvailabilityMinutes,
  }));
}

function dailySelfTemplate(previous = {}) {
  return {
    date: getTodayKey(),
    sleep: "",
    energy: "",
    mood: "",
    body: false,
    water: false,
    meal: false,
    artifact: false,
    connection: false,
    why: previous.why || "Client trust, a healthier body, better rooms, and proof that compounds.",
    nextSmallWin: previous.nextSmallWin || "Open Video 3 preview and decide if it needs QC/export or edits.",
  };
}

function ensureTodaySelf(nextData) {
  const previous = nextData.self || {};
  if (previous.date === getTodayKey()) {
    return {
      ...nextData,
      self: {
        ...dailySelfTemplate(previous),
        ...previous,
        date: getTodayKey(),
      },
    };
  }

  return {
    ...nextData,
    self: dailySelfTemplate(previous),
  };
}

function tourStorageKey() {
  return `${TOUR_KEY}.${session?.uid || session?.user || "local"}`;
}

function storageScope() {
  const teamScope = activeTeamId || "local-team";
  const userScope = session?.uid || session?.user || "local-user";
  return `${teamScope}.${userScope}`;
}

function scopedStorageKey(key) {
  return `${key}.${storageScope()}`;
}

function readStoredJson(key, fallback) {
  try {
    const stored = localStorage.getItem(scopedStorageKey(key));
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function writeStoredJson(key, value) {
  try {
    localStorage.setItem(scopedStorageKey(key), JSON.stringify(value));
  } catch (error) {
    console.warn("Could not persist local chat state.", error);
  }
}

function getChatDraftKey(threadId = agentState.activeThreadId, projectId = agentState.projectId || getCurrentProjectId()) {
  if (threadId) return `thread:${threadId}`;
  return `new:${projectId || getDefaultProjectId() || "default"}`;
}

function getChatDrafts() {
  return readStoredJson(CHAT_DRAFTS_KEY, {});
}

function setChatDrafts(drafts) {
  writeStoredJson(CHAT_DRAFTS_KEY, drafts);
}

function persistChatUiState() {
  writeStoredJson(CHAT_UI_KEY, {
    activeThreadId: agentState.activeThreadId || "",
    projectId: agentState.projectId || getCurrentProjectId(),
    mode: agentState.mode || "operator",
    visibility: getCurrentChatVisibility(),
    threadKind: getCurrentThreadKind(),
    recipientUserId: getCurrentRecipientUserId(),
    view,
    workView,
    pipelineView,
    contextFolderId,
    updatedAt: new Date().toISOString(),
  });
}

function restoreChatUiState() {
  const stored = readStoredJson(CHAT_UI_KEY, {});
  const savedThread = stored.activeThreadId
    ? data.chatThreads.find((thread) => thread.id === stored.activeThreadId)
    : null;
  const savedThreadExists = Boolean(savedThread);
  const savedProjectExists = stored.projectId && getProjectById(stored.projectId);

  if (savedThreadExists) {
    agentState.activeThreadId = savedThread.id;
  }

  agentState.projectId = savedProjectExists
    ? stored.projectId
    : getCurrentProjectId();
  agentState.mode = stored.mode || agentState.mode || "operator";
  agentState.threadKind = savedThread
    ? normalizeThreadKind(savedThread.threadKind || savedThread.visibility)
    : normalizeThreadKind(stored.threadKind || stored.visibility || "private");
  agentState.recipientUserId = savedThread?.recipientUserId || stored.recipientUserId || "";
  agentState.visibility = chatVisibilityFromKind(agentState.threadKind);
  restoreDraftForCurrentChat();
}

function captureChatPromptFromDom() {
  const textarea = document.querySelector(".agent-prompt");
  if (textarea) agentState.prompt = textarea.value;
}

function serializeDraftAttachments(attachments = []) {
  const compact = attachments.map((attachment) => ({
    id: attachment.id || createId(),
    name: attachment.name || "attachment",
    type: attachment.type || "application/octet-stream",
    size: Number(attachment.size || 0),
    kind: attachment.kind || "file",
    text: attachment.text ? String(attachment.text).slice(0, 12000) : "",
    dataUrl: attachment.dataUrl || "",
  }));

  const serializedSize = JSON.stringify(compact).length;
  if (serializedSize <= MAX_DRAFT_ATTACHMENT_STORAGE_BYTES) return compact;

  return compact.map((attachment) => ({
    ...attachment,
    dataUrl: "",
    needsReattach: Boolean(attachment.dataUrl),
  }));
}

function saveCurrentChatDraft({ includeTextarea = true } = {}) {
  if (includeTextarea) captureChatPromptFromDom();

  const draftKey = getChatDraftKey();
  const drafts = getChatDrafts();
  const prompt = agentState.prompt || "";
  const attachments = serializeDraftAttachments(agentState.attachments || []);

  if (!prompt && !attachments.length) {
    delete drafts[draftKey];
  } else {
    drafts[draftKey] = {
      prompt,
      attachments,
      mode: agentState.mode || "operator",
      visibility: getCurrentChatVisibility(),
      threadKind: getCurrentThreadKind(),
      recipientUserId: getCurrentRecipientUserId(),
      projectId: agentState.projectId || getCurrentProjectId(),
      threadId: agentState.activeThreadId || "",
      updatedAt: new Date().toISOString(),
    };
  }

  setChatDrafts(drafts);
  persistChatUiState();
}

function scheduleChatDraftSave() {
  window.clearTimeout(chatDraftTimer);
  chatDraftTimer = window.setTimeout(() => saveCurrentChatDraft(), 250);
}

function restoreDraftForCurrentChat() {
  const draft = getChatDrafts()[getChatDraftKey()];
  agentState.prompt = draft?.prompt || "";
  agentState.attachments = Array.isArray(draft?.attachments)
    ? draft.attachments.slice(0, MAX_AGENT_ATTACHMENTS)
    : [];
  if (draft?.mode) agentState.mode = draft.mode;
  if (!getActiveThread()) {
    if (draft?.threadKind || draft?.visibility) {
      agentState.threadKind = normalizeThreadKind(draft.threadKind || draft.visibility);
      agentState.visibility = chatVisibilityFromKind(agentState.threadKind);
    }
    if (draft?.recipientUserId) {
      agentState.recipientUserId = draft.recipientUserId;
    }
  }
}

function clearCurrentChatDraft() {
  clearChatDraftByKey(getChatDraftKey());
}

function clearChatDraftByKey(draftKey) {
  const drafts = getChatDrafts();
  delete drafts[draftKey];
  setChatDrafts(drafts);
  persistChatUiState();
}

function createId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function setCloudSession(authSession) {
  session = {
    user: authSession.user.email || "Authenticated user",
    uid: authSession.user.id,
    cloud: true,
    at: new Date().toISOString(),
  };
}

function loadData() {
  const stored = localStorage.getItem(DATA_KEY);
  if (!stored) return clone(seedData);
  try {
    return ensureTodaySelf({ ...clone(seedData), ...JSON.parse(stored) });
  } catch {
    return clone(seedData);
  }
}

function saveData() {
  if (!supabaseClient) {
    localStorage.setItem(DATA_KEY, JSON.stringify(data));
  }
}

async function loadCloudWorkspace() {
  workspaceError = "";
  const membership = await getMembership();
  if (!membership) {
    activeTeamId = null;
    needsWorkspace = true;
    workspace = { team: null, role: "", members: [] };
    data = clone(seedData);
    return;
  }

  needsWorkspace = false;
  activeTeamId = membership.team_id;
  workspace = {
    team: membership.teams || { id: membership.team_id, name: TEAM_NAME, join_code: "" },
    role: membership.role,
    members: [],
  };
  await loadCloudData();
}

async function getMembership() {
  const membership = await supabaseClient
    .from("team_members")
    .select("team_id, role, email, display_name, teams(id, name, join_code)")
    .order("created_at")
    .limit(1)
    .maybeSingle();

  if (membership.error) throw membership.error;
  return membership.data;
}

async function createWorkspace() {
  const teamId = crypto.randomUUID();
  const team = await supabaseClient
    .from("teams")
    .insert({
      id: teamId,
      name: TEAM_NAME,
      created_by: session.uid,
      join_code: createJoinCode(),
    });

  if (team.error) throw team.error;
  await loadCloudWorkspace();
}

async function joinWorkspace(code) {
  const result = await supabaseClient.rpc("join_team_with_code", {
    raw_code: normalizeJoinCode(code),
  });
  if (result.error) throw result.error;
  await loadCloudWorkspace();
}

function createJoinCode() {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("").toUpperCase();
}

function normalizeJoinCode(code) {
  return String(code || "").replace(/\s+/g, "").toUpperCase();
}

async function loadCloudData() {
  if (!activeTeamId) return;

  const [clients, tasks, leads, evidence, checkins, members, contexts, calendarSources, projectSpaces, chatThreads, chatMessages] = await Promise.all([
    supabaseClient.from("clients").select("*").eq("team_id", activeTeamId).order("created_at"),
    supabaseClient.from("tasks").select("*").eq("team_id", activeTeamId).order("created_at"),
    supabaseClient.from("leads").select("*").eq("team_id", activeTeamId).order("created_at"),
    supabaseClient.from("evidence").select("*").eq("team_id", activeTeamId).order("created_at"),
    supabaseClient
      .from("self_checkins")
      .select("*")
      .eq("team_id", activeTeamId)
      .eq("user_id", session.uid)
      .eq("checkin_date", getTodayKey())
      .order("created_at", { ascending: false })
      .limit(1),
    supabaseClient.from("team_members").select("*").eq("team_id", activeTeamId).order("created_at"),
    supabaseClient.from("context_items").select("*").eq("team_id", activeTeamId).order("created_at", { ascending: false }),
    supabaseClient.from("calendar_sources").select("*").eq("team_id", activeTeamId).order("created_at", { ascending: false }),
    supabaseClient.from("project_spaces").select("*").eq("team_id", activeTeamId).order("created_at"),
    supabaseClient.from("chat_threads").select("*").eq("team_id", activeTeamId).eq("status", "active").order("last_message_at", { ascending: false }),
    supabaseClient.from("chat_messages").select("*").eq("team_id", activeTeamId).order("created_at", { ascending: true }).limit(300),
  ]);

  for (const result of [clients, tasks, leads, evidence, checkins, members, contexts, calendarSources, projectSpaces, chatThreads, chatMessages]) {
    if (result.error) throw result.error;
  }

  workspace.members = members.data.map(fromCloudMember);

  if (!clients.data.length && !tasks.data.length && !leads.data.length) {
    await seedCloudData();
    return loadCloudData();
  }

  if (!projectSpaces.data.length && clients.data.length) {
    await seedProjectSpaces(clients.data);
    return loadCloudData();
  }

  const mappedClients = clients.data.map(fromCloudClient);
  data = {
    clients: mappedClients,
    tasks: tasks.data.map((task) => fromCloudTask(task, mappedClients)),
    leads: leads.data.map(fromCloudLead),
    evidence: evidence.data.map(fromCloudEvidence),
    projectSpaces: projectSpaces.data.map(fromCloudProjectSpace),
    contexts: contexts.data.map(fromCloudContext),
    calendarSources: calendarSources.data.map(fromCloudCalendarSource),
    chatThreads: chatThreads.data.map(fromCloudChatThread),
    chatMessages: chatMessages.data.map(fromCloudChatMessage),
    self: checkins.data[0] ? fromCloudSelf(checkins.data[0]) : dailySelfTemplate(),
  };

  if (!agentState.activeThreadId || !data.chatThreads.some((thread) => thread.id === agentState.activeThreadId)) {
    const fallbackThread = getPreferredChatThread();
    agentState.activeThreadId = fallbackThread?.id || "";
    agentState.threadKind = fallbackThread ? getCurrentThreadKind(fallbackThread) : "private";
    agentState.recipientUserId = fallbackThread?.recipientUserId || "";
    agentState.visibility = chatVisibilityFromKind(agentState.threadKind);
  } else {
    const activeThread = data.chatThreads.find((thread) => thread.id === agentState.activeThreadId);
    agentState.threadKind = getCurrentThreadKind(activeThread);
    agentState.recipientUserId = activeThread?.recipientUserId || "";
    agentState.visibility = chatVisibilityFromKind(agentState.threadKind);
  }
  if (!agentState.projectId) {
    agentState.projectId = data.projectSpaces.find((project) => project.name === "Gensync")?.id || data.projectSpaces[0]?.id || "";
  }
}

async function refreshCloudData(reason = "manual") {
  if (!supabaseClient || !session?.cloud || !activeTeamId || booting || cloudSyncing) return;
  const now = Date.now();
  if (reason !== "manual" && now - lastCloudRefreshAt < 30000) return;

  try {
    cloudSyncing = true;
    lastCloudRefreshAt = now;
    if (reason === "manual") render();
    await loadCloudData();
    cloudSyncing = false;
    render();
  } catch (error) {
    console.error(error);
    cloudSyncing = false;
    workspaceError = `Could not sync workspace: ${error.message || "unknown Supabase error"}`;
    render();
  }
}

async function seedCloudData() {
  const clients = await supabaseClient
    .from("clients")
    .insert(seedData.clients.map(toCloudClient))
    .select("id, name");

  if (clients.error) throw clients.error;

  const clientIdByName = Object.fromEntries(clients.data.map((client) => [client.name, client.id]));

  const [tasks, leads, evidence, contexts] = await Promise.all([
    supabaseClient.from("tasks").insert(seedData.tasks.map((task) => toCloudTask(task, clientIdByName))),
    supabaseClient.from("leads").insert(seedData.leads.map(toCloudLead)),
    supabaseClient.from("evidence").insert(seedData.evidence.map(toCloudEvidence)),
    supabaseClient.from("context_items").insert(seedData.contexts.map(toCloudContext)),
  ]);

  for (const result of [tasks, leads, evidence, contexts]) {
    if (result.error) throw result.error;
  }
}

async function seedProjectSpaces(cloudClients = []) {
  const rows = [
    {
      team_id: activeTeamId,
      owner_user_id: session?.uid || null,
      name: "Gensync",
      slug: "gensync",
      description: "Internal operating system, company growth, personal brand, and team execution context.",
      visibility: "team",
    },
    ...cloudClients.map((client) => ({
      team_id: activeTeamId,
      client_id: client.id,
      owner_user_id: session?.uid || null,
      name: client.name,
      slug: slugify(client.name),
      description: `${client.name} project context, deliverables, references, proof, chats, and decisions.`,
      visibility: "team",
    })),
  ];

  const result = await supabaseClient.from("project_spaces").insert(rows);
  if (result.error) throw result.error;
}

function toCloudClient(client) {
  return {
    team_id: activeTeamId,
    name: client.name,
    owner_label: client.owner,
    retainer_label: client.retainer,
    status: client.status,
    health: Number(client.health || 60),
    next_action: client.next,
    notes: client.notes,
    proof: client.proof,
  };
}

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || createId();
}

function fromCloudClient(client) {
  return {
    id: client.id,
    name: client.name,
    owner: client.owner_label,
    retainer: client.retainer_label,
    status: client.status,
    health: client.health,
    next: client.next_action,
    notes: client.notes,
    proof: client.proof,
  };
}

function toCloudTask(task, clientIdByName = {}) {
  const clientName = String(task.client || "");
  const visibility = task.visibility || "team";
  return {
    team_id: activeTeamId,
    client_id: clientIdByName[clientName] || clientIdByName[clientName.toLowerCase()] || null,
    owner_user_id: task.ownerUserId || session?.uid || null,
    visibility,
    title: task.title,
    owner_label: parseOwners(task.owner).join(", ") || defaultTaskOwner(),
    status: task.status,
    priority: task.priority,
    due_label: task.due,
    review_gate: task.review,
    notes: task.notes,
  };
}

function fromCloudTask(task, clients = data.clients) {
  return {
    id: task.id,
    title: task.title,
    client: task.client_id ? clients.find((client) => client.id === task.client_id)?.name || "Client" : "Gensync",
    owner: parseOwners(task.owner_label).join(", ") || "Unassigned",
    ownerUserId: task.owner_user_id,
    visibility: task.visibility || "team",
    status: task.status,
    priority: task.priority,
    due: task.due_label,
    review: task.review_gate,
    notes: task.notes,
  };
}

function toCloudLead(lead) {
  return {
    team_id: activeTeamId,
    company: lead.company,
    stage: lead.stage,
    value_usd: Number(lead.value || 0),
    owner_label: lead.owner,
    next_action: lead.next,
    source: lead.source,
  };
}

function fromCloudLead(lead) {
  return {
    id: lead.id,
    company: lead.company,
    stage: lead.stage,
    value: lead.value_usd,
    owner: lead.owner_label,
    next: lead.next_action,
    source: lead.source,
  };
}

function toCloudEvidence(item) {
  return {
    team_id: activeTeamId,
    title: item.title,
    evidence_type: item.type,
    confidence: item.confidence,
    link: item.link,
    note: item.note,
  };
}

function fromCloudEvidence(item) {
  return {
    id: item.id,
    title: item.title,
    type: item.evidence_type,
    confidence: item.confidence,
    link: item.link,
    note: item.note,
  };
}

function toCloudContext(item) {
  return {
    team_id: activeTeamId,
    owner_user_id: item.ownerUserId || session?.uid || null,
    created_by: session?.uid || null,
    project_id: item.projectId || null,
    client_id: item.clientId || null,
    visibility: item.visibility || "team",
    category: item.category || "Note",
    title: item.title,
    source_url: item.sourceUrl || "",
    summary: item.summary || "",
    content: item.content || "",
    confidence: item.confidence || "Unverified",
  };
}

function fromCloudContext(item) {
  return {
    id: item.id,
    ownerUserId: item.owner_user_id,
    projectId: item.project_id,
    clientId: item.client_id,
    visibility: item.visibility || "team",
    category: item.category,
    title: item.title,
    sourceUrl: item.source_url,
    summary: item.summary,
    content: item.content,
    confidence: item.confidence,
  };
}

function fromCloudProjectSpace(item) {
  return {
    id: item.id,
    clientId: item.client_id,
    ownerUserId: item.owner_user_id,
    name: item.name,
    slug: item.slug,
    description: item.description,
    visibility: item.visibility || "team",
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
}

function toCloudChatThread(thread) {
  const project = data.projectSpaces.find((item) => item.id === thread.projectId);
  return {
    team_id: activeTeamId,
    project_id: thread.projectId || null,
    client_id: project?.clientId || null,
    created_by: thread.createdBy || session?.uid || null,
    title: thread.title || "New chat",
    mode: thread.mode || "operator",
    visibility: chatVisibilityFromKind(thread.threadKind || thread.visibility),
    thread_kind: normalizeThreadKind(thread.threadKind || thread.visibility),
    recipient_user_id: thread.recipientUserId || null,
    status: thread.status || "active",
    last_message_at: thread.lastMessageAt || new Date().toISOString(),
  };
}

function fromCloudChatThread(thread) {
  return {
    id: thread.id,
    projectId: thread.project_id,
    clientId: thread.client_id,
    createdBy: thread.created_by,
    title: thread.title,
    mode: thread.mode || "operator",
    visibility: normalizeChatVisibility(thread.visibility),
    threadKind: normalizeThreadKind(thread.thread_kind || thread.visibility),
    recipientUserId: thread.recipient_user_id || "",
    status: thread.status || "active",
    lastMessageAt: thread.last_message_at,
    createdAt: thread.created_at,
    updatedAt: thread.updated_at,
  };
}

function toCloudChatMessage(message) {
  return {
    team_id: activeTeamId,
    thread_id: message.threadId,
    user_id: message.userId || session?.uid || null,
    role: message.role,
    content: message.content || "",
    result: message.result || null,
    attachments: message.attachments || [],
  };
}

function fromCloudChatMessage(message) {
  return {
    id: message.id,
    threadId: message.thread_id,
    userId: message.user_id,
    role: message.role,
    content: message.content || "",
    result: message.result || null,
    attachments: Array.isArray(message.attachments) ? message.attachments : [],
    createdAt: message.created_at,
  };
}

function toCloudCalendarSource(item) {
  return {
    team_id: activeTeamId,
    owner_user_id: item.ownerUserId || session?.uid || null,
    owner_label: item.owner || session?.user || "",
    provider: "google",
    account_email: item.accountEmail || "",
    status: item.status || "needs_oauth",
    source_url: item.sourceUrl || "",
    notes: item.notes || "",
  };
}

function fromCloudCalendarSource(item) {
  return {
    id: item.id,
    ownerUserId: item.owner_user_id,
    owner: item.owner_label,
    accountEmail: item.account_email,
    status: item.status,
    sourceUrl: item.source_url,
    notes: item.notes,
  };
}

function toCloudSelf() {
  return {
    team_id: activeTeamId,
    user_id: session?.uid || null,
    checkin_date: data.self.date,
    sleep: data.self.sleep,
    energy: data.self.energy,
    mood: data.self.mood,
    body_done: data.self.body,
    water_done: data.self.water,
    meal_done: data.self.meal,
    artifact_done: data.self.artifact,
    connection_done: data.self.connection,
    why: data.self.why,
    next_small_win: data.self.nextSmallWin,
  };
}

function fromCloudSelf(item) {
  return {
    date: item.checkin_date,
    sleep: item.sleep,
    energy: item.energy,
    mood: item.mood,
    body: item.body_done,
    water: item.water_done,
    meal: item.meal_done,
    artifact: item.artifact_done,
    connection: item.connection_done,
    why: item.why,
    nextSmallWin: item.next_small_win,
  };
}

function fromCloudMember(member) {
  return {
    id: member.user_id,
    role: member.role,
    email: member.email,
    name: member.display_name || member.email || "Member",
    joined: member.created_at,
  };
}

function cloudClientIdByName() {
  const entries = [];
  data.clients.forEach((client) => {
    entries.push([client.name, client.id]);
    entries.push([String(client.name).toLowerCase(), client.id]);
  });
  return Object.fromEntries(entries);
}

async function writeCloud(action) {
  try {
    await action();
    await loadCloudData();
    render();
  } catch (error) {
    console.error(error);
    alert(`Could not save to Supabase: ${error.message || error}`);
    render();
  }
}

async function insertSelfCheckin() {
  const result = await supabaseClient.from("self_checkins").insert(toCloudSelf());
  if (result.error) throw result.error;
}

async function replaceCloudData(imported) {
  const normalized = {
    ...clone(seedData),
    ...imported,
    self: { ...clone(seedData.self), ...(imported.self || {}) },
  };

  data = normalized;

  const firstDeletions = await Promise.all([
    supabaseClient.from("tasks").delete().eq("team_id", activeTeamId),
    supabaseClient.from("leads").delete().eq("team_id", activeTeamId),
    supabaseClient.from("evidence").delete().eq("team_id", activeTeamId),
    supabaseClient.from("context_items").delete().eq("team_id", activeTeamId),
    supabaseClient.from("calendar_sources").delete().eq("team_id", activeTeamId).eq("owner_user_id", session.uid),
    supabaseClient.from("self_checkins").delete().eq("team_id", activeTeamId).eq("user_id", session.uid),
  ]);
  for (const result of firstDeletions) {
    if (result.error) throw result.error;
  }

  const clientDeletion = await supabaseClient.from("clients").delete().eq("team_id", activeTeamId);
  if (clientDeletion.error) throw clientDeletion.error;

  const clients = normalized.clients.length
    ? await supabaseClient
        .from("clients")
        .insert(normalized.clients.map(toCloudClient))
        .select("id, name")
    : { data: [], error: null };
  if (clients.error) throw clients.error;

  const clientIdByName = Object.fromEntries(clients.data.flatMap((client) => [
    [client.name, client.id],
    [String(client.name).toLowerCase(), client.id],
  ]));

  const writes = await Promise.all([
    normalized.tasks.length
      ? supabaseClient.from("tasks").insert(normalized.tasks.map((task) => toCloudTask(task, clientIdByName)))
      : Promise.resolve({ error: null }),
    normalized.leads.length
      ? supabaseClient.from("leads").insert(normalized.leads.map(toCloudLead))
      : Promise.resolve({ error: null }),
    normalized.evidence.length
      ? supabaseClient.from("evidence").insert(normalized.evidence.map(toCloudEvidence))
      : Promise.resolve({ error: null }),
    normalized.contexts?.length
      ? supabaseClient.from("context_items").insert(normalized.contexts.map(toCloudContext))
      : Promise.resolve({ error: null }),
    normalized.calendarSources?.length
      ? supabaseClient.from("calendar_sources").insert(normalized.calendarSources.map(toCloudCalendarSource))
      : Promise.resolve({ error: null }),
    supabaseClient.from("self_checkins").insert(toCloudSelf()),
  ]);

  for (const result of writes) {
    if (result.error) throw result.error;
  }
}

function loadSession() {
  const stored = localStorage.getItem(SESSION_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

function saveSession(user) {
  session = { user, at: new Date().toISOString() };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function getAuth() {
  const stored = localStorage.getItem(AUTH_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

function saveAuth(auth) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
}

function render() {
  if (booting) {
    app.innerHTML = `<section class="auth-screen"><div class="auth-panel"><p class="eyebrow">Loading</p><h1>Gensync OS</h1><p class="muted">Checking workspace access.</p></div></section>`;
    return;
  }

  if (!session) {
    renderAuth();
    return;
  }

  if (supabaseClient && workspaceError) {
    renderWorkspaceError();
    return;
  }

  if (supabaseClient && needsWorkspace) {
    renderWorkspaceGate();
    return;
  }

  app.innerHTML = `
    <div class="shell view-${escapeAttr(view)}">
      <aside class="sidebar">
        <div class="brand">
          <div class="mark">G</div>
          <div>
            <h1>Gensync OS</h1>
            <p>${session.cloud ? "Shared command surface" : "Local command surface"}</p>
          </div>
        </div>
        <nav class="nav">
          ${navItems
            .map(
              ([id, label, icon]) => `
                <button class="${view === id ? "active" : ""}" data-view="${id}">
                  <span class="nav-icon">${icon}</span>
                  <span>${label}</span>
                </button>
              `,
            )
            .join("")}
        </nav>
        <div class="side-footer">
          <div class="user-chip">
            <strong>${escapeHtml(session.user)}</strong>
            <span>${session.cloud ? "Supabase auth active" : "Local gate active"}</span>
          </div>
          <button class="ghost-button" data-action="logout">Sign out</button>
        </div>
      </aside>
      <section class="main">
        ${renderTopbar()}
        ${renderView()}
      </section>
    </div>
    ${renderCelebration()}
    ${tourOpen ? renderTour() : ""}
  `;

  bindGlobalEvents();
  bindViewEvents();
  if (tourOpen) window.requestAnimationFrame(positionTour);
}

function renderAuth() {
  if (supabaseClient) {
    app.innerHTML = `
      <section class="auth-screen">
        <div class="auth-panel">
          <p class="eyebrow">Team Access</p>
          <h1>Gensync OS</h1>
          <p class="muted">Shared Supabase workspace for client delivery, tasks, leads, proof, and state.</p>
          <form id="auth-form" class="form">
            <label>
              Email
              <input name="email" type="email" autocomplete="email" required />
            </label>
            <label>
              Password
              <input name="password" type="password" autocomplete="current-password" minlength="6" required />
            </label>
            <div class="form-row">
              <button class="primary-button" type="submit" data-auth-mode="signin">Sign in</button>
              <button class="ghost-button" type="submit" data-auth-mode="signup">Create account</button>
            </div>
            <div class="notice">${escapeHtml(authNotice || "Sign in, then create the Gensync workspace or join it with an invite code.")}</div>
          </form>
        </div>
      </section>
    `;

    document.getElementById("auth-form").addEventListener("submit", async (event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const email = String(form.get("email")).trim();
      const password = String(form.get("password"));
      const mode = event.submitter?.dataset.authMode || "signin";
      if (event.submitter) event.submitter.disabled = true;

      try {
        const result =
          mode === "signup"
            ? await supabaseClient.auth.signUp({ email, password })
            : await supabaseClient.auth.signInWithPassword({ email, password });

        if (result.error) throw result.error;

        const authSession = result.data.session || (await supabaseClient.auth.getSession()).data.session;
        if (!authSession) {
          authNotice = "Account created. Check email if Supabase asks for confirmation, then sign in.";
          renderAuth();
          return;
        }

        authNotice = "";
        setCloudSession(authSession);
        await loadCloudWorkspace();
        render();
      } catch (error) {
        console.error(error);
        authNotice = error.message || "Supabase auth failed.";
        renderAuth();
      }
    });

    return;
  }

  const auth = getAuth();
  const isSetup = !auth;
  app.innerHTML = `
    <section class="auth-screen">
      <div class="auth-panel">
        <p class="eyebrow">${isSetup ? "First Run" : "Local Gate"}</p>
        <h1>Gensync OS</h1>
        <p class="muted">$50K sprint, client trust, task control, and proof. Supabase auth comes next.</p>
        <form id="auth-form" class="form">
          <label>
            User
            <select name="user">
              <option>Manish</option>
              <option>Mohit</option>
            </select>
          </label>
          <label>
            ${isSetup ? "Create local passcode" : "Passcode"}
            <input name="passcode" type="password" minlength="4" required />
          </label>
          <button class="primary-button" type="submit">${isSetup ? "Create gate" : "Enter"}</button>
          ${
            isSetup
              ? `<div class="notice">This is a local gate for this Mac, not production security. Supabase will replace it.</div>`
              : `<button class="text-button" type="button" data-action="reset-auth">Reset local gate</button>`
          }
        </form>
      </div>
    </section>
  `;

  document.getElementById("auth-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const user = String(form.get("user"));
    const passcode = String(form.get("passcode"));
    const currentAuth = getAuth();

    if (!currentAuth) {
      saveAuth({ passcode, users: ["Manish", "Mohit"], createdAt: new Date().toISOString() });
      saveSession(user);
      render();
      return;
    }

    if (currentAuth.passcode !== passcode) {
      alert("Wrong passcode.");
      return;
    }

    saveSession(user);
    render();
  });

  const reset = document.querySelector('[data-action="reset-auth"]');
  if (reset) {
    reset.addEventListener("click", () => {
      localStorage.removeItem(AUTH_KEY);
      localStorage.removeItem(SESSION_KEY);
      session = null;
      render();
    });
  }
}

function renderWorkspaceGate() {
  app.innerHTML = `
    <section class="auth-screen">
      <div class="auth-panel">
        <p class="eyebrow">Workspace</p>
        <h1>Join Gensync</h1>
        <p class="muted">Use the shared team workspace for Manish and Mohit tasks. Private items stay attached to your login.</p>
        <form id="join-workspace-form" class="form">
          <label>
            Invite code
            <input name="code" autocomplete="off" placeholder="Paste team code" required />
          </label>
          <button class="primary-button" type="submit">Join workspace</button>
          <div class="notice">${escapeHtml(authNotice || "If this is the first real login, create the Gensync workspace instead.")}</div>
        </form>
        <div class="divider"></div>
        <button class="ghost-button full-button" data-action="create-workspace">Create Gensync workspace</button>
        <button class="text-button" data-action="logout">Sign out</button>
      </div>
    </section>
  `;

  document.getElementById("join-workspace-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      authNotice = "";
      await joinWorkspace(form.get("code"));
      render();
    } catch (error) {
      console.error(error);
      authNotice = error.message || "Could not join workspace.";
      renderWorkspaceGate();
    }
  });

  document.querySelector('[data-action="create-workspace"]').addEventListener("click", async () => {
    try {
      authNotice = "";
      await createWorkspace();
      render();
    } catch (error) {
      console.error(error);
      authNotice = error.message || "Could not create workspace.";
      renderWorkspaceGate();
    }
  });

  document.querySelector('[data-action="logout"]').addEventListener("click", async () => {
    await supabaseClient.auth.signOut();
    session = null;
    needsWorkspace = false;
    activeTeamId = null;
    workspaceError = "";
    workspace = { team: null, role: "", members: [] };
    render();
  });
}

function renderWorkspaceError() {
  app.innerHTML = `
    <section class="auth-screen">
      <div class="auth-panel">
        <p class="eyebrow">Workspace</p>
        <h1>Retry workspace load</h1>
        <p class="muted">${escapeHtml(workspaceError)}</p>
        <button class="primary-button full-button" type="button" data-action="retry-workspace">Retry</button>
        <button class="text-button" type="button" data-action="logout">Sign out</button>
      </div>
    </section>
  `;

  document.querySelector('[data-action="retry-workspace"]').addEventListener("click", async () => {
    try {
      booting = true;
      workspaceError = "";
      render();
      await withTimeout(loadCloudWorkspace(), 20000, "Workspace load timed out.");
      booting = false;
      render();
    } catch (error) {
      console.error(error);
      booting = false;
      workspaceError = `Could not load workspace: ${error.message || "unknown Supabase error"}`;
      renderWorkspaceError();
    }
  });

  document.querySelector('[data-action="logout"]').addEventListener("click", async () => {
    await supabaseClient.auth.signOut();
    session = null;
    needsWorkspace = false;
    activeTeamId = null;
    workspaceError = "";
    workspace = { team: null, role: "", members: [] };
    render();
  });
}

function renderTopbar() {
  const labels = {
    command: ["Command", "Talk to the teammate. It decides the right surface and proposes writes only after review."],
    work: ["Work", "Tasks, day planning, reminders, and completed archives."],
    pipeline: ["Pipeline", "Revenue, clients, proof, and lead packets."],
    day: ["Day", "Calendar, tasks, reminders, and protected booking space."],
    clients: ["Clients", "Active fulfillment and dependency map."],
    tasks: ["Board", "What is owed, blocked, and shipped."],
    agent: ["Agent", "Use GPT-5.5 for plans, QA, lead-gen, and internal execution."],
    context: ["Library", "Finder-style project folders for docs, calls, links, contracts, invoices, calendars, and proof."],
    crm: ["CRM", "Revenue targets, proof gifts, and lead packets."],
    self: ["Self", "Physical state, mood risk, and the next small artifact."],
    evidence: ["Evidence", "Claims, source links, and confidence labels."],
    team: ["Team", "Workspace access, teammates, and invite code."],
  };
  const [title, sub] = labels[view] || labels.command;
  return `
    <header class="topbar">
      <div>
        <p class="eyebrow">Gensync / ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</p>
        <h2>${title}</h2>
        <p class="muted">${sub}</p>
      </div>
      <div class="actions">
        ${session?.cloud ? `<button class="ghost-button" type="button" data-action="sync-cloud" ${cloudSyncing ? "disabled" : ""}>${cloudSyncing ? "Syncing..." : "Sync"}</button>` : ""}
        <button class="ghost-button" type="button" data-action="open-tour">Tour</button>
      </div>
    </header>
  `;
}

function renderView() {
  if (view === "work") return renderWork();
  if (view === "pipeline") return renderPipeline();
  if (view === "clients") return renderClients();
  if (view === "day") return renderDay();
  if (view === "tasks") return renderTasks();
  if (view === "agent") return renderAgent();
  if (view === "context") return renderContext();
  if (view === "crm") return renderCrm();
  if (view === "self") return renderSelf();
  if (view === "evidence") return renderEvidence();
  if (view === "team") return renderTeam();
  return renderCommand();
}

function renderCommand() {
  return `
    <div class="command-home">
      ${renderChatWorkspace({ compact: true })}
    </div>
  `;
}

function renderCommandPulse({ revenue, open, p0, review, next }) {
  return `
    <section class="command-pulse" aria-label="System pulse">
      <button class="pulse-chip" type="button" data-view="pipeline">
        <span>Collected</span>
        <strong>${formatCompactMoney(revenue.collected)} / ${formatCompactMoney(revenue.target)}</strong>
      </button>
      <button class="pulse-chip" type="button" data-view="work">
        <span>Do Now</span>
        <strong>${next ? escapeHtml(next.title) : "Clear"}</strong>
      </button>
      <button class="pulse-chip" type="button" data-view="context">
        <span>Memory</span>
        <strong>${data.contexts.length} files</strong>
      </button>
      <button class="pulse-chip" type="button" data-view="work" data-work-shortcut="day">
        <span>State</span>
        <strong>${[data.self.body, data.self.water, data.self.meal, data.self.artifact, data.self.connection].filter(Boolean).length}/5</strong>
      </button>
    </section>
  `;
}

function renderClients() {
  return `
    <div class="grid client-strip">
      ${data.clients.map(renderClientCard).join("")}
    </div>
  `;
}

function renderWork() {
  return `
    <div class="surface-tabs">
      ${[
        ["board", "Board"],
        ["day", "Day planner"],
        ["completed", "Completed"],
      ]
        .map(([id, label]) => `<button class="${workView === id ? "active" : ""}" type="button" data-work-view="${id}">${label}</button>`)
        .join("")}
    </div>
    ${
      workView === "day"
        ? renderDay()
        : renderTasks({ forcedTaskView: workView === "completed" ? "completed" : "" })
    }
  `;
}

function renderPipeline() {
  return `
    <div class="surface-tabs">
      ${[
        ["deals", "Revenue"],
        ["clients", "Clients"],
        ["evidence", "Proof"],
      ]
        .map(([id, label]) => `<button class="${pipelineView === id ? "active" : ""}" type="button" data-pipeline-view="${id}">${label}</button>`)
        .join("")}
    </div>
    ${
      pipelineView === "clients"
        ? renderClients()
        : pipelineView === "evidence"
          ? renderEvidence()
          : renderCrm()
    }
  `;
}

function renderDay() {
  const plan = dayState.plan;
  const connectedCalendar = data.calendarSources.some((item) => item.status === "connected");
  const scheduledCount = plan?.scheduledBlocks?.length || 0;
  const protectedActual = plan?.protectedAvailabilityActualMinutes ?? dayState.protectedAvailabilityMinutes;
  const busyCount = plan?.events?.filter((event) => event.busy).length || 0;
  const unscheduledP0 = plan?.unscheduledTasks?.filter((task) => task.priority === "P0").length || 0;
  const activeRhythm = dayRhythms.find((item) => item.id === dayState.rhythm) || dayRhythms[0];

  return `
    <div class="grid metrics-grid compact-dashboard">
      ${metric(scheduledCount || "Ready", "Time blocks", plan ? "Generated from board + calendar" : "Run the planner")}
      ${metric(`${protectedActual}m`, "Booking space", "Kept open for Calendly-style calls")}
      ${metric(busyCount, "Calendar events", connectedCalendar ? "Read-only Google scan" : "Connect Calendar first")}
      ${metric(unscheduledP0, "Unslotted P0", unscheduledP0 ? "Needs manual slot" : "No P0 spillover")}
    </div>

    <div class="grid two-grid compact-dashboard">
      <section class="panel" data-tour="day-plan">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Day Manager</p>
            <h3>Plan tasks without killing booking availability</h3>
          </div>
          ${badge(connectedCalendar ? "Calendar connected" : "Needs Calendar", connectedCalendar ? "green" : "amber")}
        </div>
        <form id="day-plan-form" class="form day-controls">
          <div>
            <p class="field-label">Work rhythm</p>
            <div class="rhythm-grid">
              ${dayRhythms
                .map((rhythm) => `
                  <button class="${dayState.rhythm === rhythm.id ? "active" : ""}" type="button" data-day-rhythm="${rhythm.id}">
                    <strong>${escapeHtml(rhythm.label)}</strong>
                    <span>${escapeHtml(rhythm.start)} -> ${escapeHtml(rhythm.end)}</span>
                  </button>
                `)
                .join("")}
            </div>
            <p class="muted rhythm-help">${escapeHtml(activeRhythm.description)}</p>
          </div>
          <div class="form-row">
            <label>Date <input name="date" type="date" value="${escapeAttr(dayState.date)}" /></label>
            <label>Protected booking time
              <select name="protectedAvailabilityMinutes">
                ${[60, 120, 180, 240, 300, 360]
                  .map((minutes) => `<option value="${minutes}" ${Number(dayState.protectedAvailabilityMinutes) === minutes ? "selected" : ""}>${minutes / 60}h open</option>`)
                  .join("")}
              </select>
            </label>
          </div>
          <div class="form-row">
            <label>Work starts <input name="dayStart" type="time" value="${escapeAttr(dayState.dayStart)}" /></label>
            <label>Work ends <input name="dayEnd" type="time" value="${escapeAttr(dayState.dayEnd)}" /></label>
          </div>
          <div class="form-actions day-form-actions">
            <button class="ghost-button" type="button" data-action="late-start-now">I woke up late</button>
            <button class="primary-button" type="submit" ${dayState.loading ? "disabled" : ""}>
              ${dayState.loading ? "Planning..." : "Plan my day"}
            </button>
          </div>
        </form>
        ${
          connectedCalendar
            ? `<div class="notice quiet-notice">Calendar is read-only. Time blocks and reminders are added to the board only after a confirm popup.</div>`
            : `<div class="notice">Connect Google Calendar first so the planner can avoid real meetings. <button class="ghost-button compact-button" type="button" data-action="connect-google-calendar">Connect Google</button></div>`
        }
        ${dayState.error ? `<div class="notice red-notice">${escapeHtml(dayState.error)}</div>` : ""}
      </section>

      <section class="panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Rules</p>
            <h3>How it decides</h3>
          </div>
          ${badge("P0 first", "red")}
        </div>
        <div class="stack">
          <div class="mini-row">Reads today's Google Calendar events, then treats busy events as unavailable.</div>
          <div class="mini-row">Protects booking windows first so Calendly has room for calls.</div>
          <div class="mini-row">Schedules P0 tasks before P1/P2, with meal, body, and shutdown blocks included.</div>
          <div class="mini-row">Google Calendar event creation is intentionally off until write scope and a confirm step are added.</div>
        </div>
      </section>
    </div>

    ${plan ? renderDayPlan(plan) : `<section class="panel compact-dashboard"><div class="empty">Run the planner to get a timeline, reminders, and one-click board writes.</div></section>`}
  `;
}

function renderDayPlan(plan) {
  return `
    <div class="grid two-grid compact-dashboard">
      <section class="panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Timeline</p>
            <h3>${escapeHtml(plan.date)} plan</h3>
            <p class="muted">${escapeHtml(plan.summary || "Calendar-aware plan ready.")}</p>
          </div>
          <div class="actions">
            <button class="primary-button compact-button" type="button" data-day-add="blocks">Add blocks</button>
            <button class="ghost-button compact-button" type="button" data-day-add="reminders">Add reminders</button>
          </div>
        </div>
        ${
          plan.lateStart
            ? `<div class="notice green-notice">Late start mode: today begins from ${escapeHtml(formatPlanTime(plan.effectiveStart))}. Dead time is ignored; remaining blocks are re-ranked from here.</div>`
            : ""
        }
        ${renderDayTimeline(plan)}
      </section>

      <section class="panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Reminders + Spillover</p>
            <h3>Do not lose the loose ends</h3>
          </div>
          ${badge(`${plan.protectedAvailabilityActualMinutes || 0}m open`, "green")}
        </div>
        <div class="stack">
          ${(plan.reminders || []).map(renderDayReminder).join("")}
          ${
            plan.unscheduledTasks?.length
              ? `
                <div>
                  <p class="eyebrow">Needs manual slot</p>
                  <div class="stack">
                    ${plan.unscheduledTasks.map(renderDayUnscheduledTask).join("")}
                  </div>
                </div>
              `
              : `<div class="empty">No unscheduled task spillover.</div>`
          }
        </div>
      </section>
    </div>
  `;
}

function renderDayTimeline(plan) {
  const rows = [
    ...(plan.events || [])
      .filter((event) => event.busy)
      .map((event) => ({ ...event, kind: "busy", label: event.allDay ? "All-day calendar" : "Calendar" })),
    ...(plan.protectedWindows || [])
      .map((item) => ({ ...item, kind: "protected", title: item.label || "Booking availability", label: "Protected" })),
    ...(plan.scheduledBlocks || [])
      .map((item) => ({ ...item, kind: "block", label: item.type === "state" ? "State block" : "Time block" })),
  ].sort((left, right) => Date.parse(left.start) - Date.parse(right.start));

  if (!rows.length) return `<div class="empty">No calendar events or blocks in this window.</div>`;
  return `<div class="timeline">${rows.map(renderDayTimelineRow).join("")}</div>`;
}

function renderDayTimelineRow(row) {
  const minutes = row.minutes || minutesBetweenIso(row.start, row.end);
  const button = row.kind === "block"
    ? `<button class="ghost-button compact-button" type="button" data-day-add-block="${escapeAttr(row.id)}">Add</button>`
    : "";
  const tone = row.kind === "busy" ? "blue" : row.kind === "protected" ? "green" : priorityTone(row.priority);
  return `
    <article class="time-row ${row.kind}">
      <div class="time-stamp">
        <strong>${escapeHtml(formatPlanTime(row.start))}</strong>
        <span>${escapeHtml(formatPlanTime(row.end))}</span>
      </div>
      <div class="time-card">
        <div class="item-header">
          <div>
            <h4>${escapeHtml(row.title || "Block")}</h4>
            <p class="task-meta">${escapeHtml(row.label || "Plan")} · ${minutes}m</p>
          </div>
          <div class="item-actions">
            ${badge(row.kind === "protected" ? "Open" : row.priority || row.label, tone)}
            ${button}
          </div>
        </div>
        ${row.notes ? `<p class="muted" style="margin-top: 8px;">${escapeHtml(row.notes)}</p>` : ""}
      </div>
    </article>
  `;
}

function renderDayReminder(reminder) {
  return `
    <article class="mini-row reminder-row">
      <div>
        <strong>${escapeHtml(reminder.title)}</strong>
        <span>${escapeHtml(formatPlanTime(reminder.due))} · Reminder</span>
      </div>
      <button class="ghost-button compact-button" type="button" data-day-add-reminder="${escapeAttr(reminder.id)}">Add</button>
    </article>
  `;
}

function renderDayUnscheduledTask(task) {
  return `
    <article class="mini-row">
      <strong>${escapeHtml(task.title)}</strong>
      <span>${escapeHtml(task.priority || "P1")} · ${escapeHtml(task.reason || "Needs a slot")}</span>
    </article>
  `;
}

function renderTasks({ forcedTaskView = "" } = {}) {
  const owners = getOwnerOptions(data.tasks.flatMap((task) => parseOwners(task.owner)));
  const activeCount = data.tasks.filter((task) => task.status !== "Done").length;
  const completedCount = data.tasks.filter((task) => task.status === "Done").length;
  const activeTaskView = forcedTaskView || taskView;
  const statusFilter = activeTaskView === "completed" || filter === "Done" ? "all" : filter;
  const statusOptions = ["all", ...stateOptions.filter((status) => activeTaskView === "all" || status !== "Done")];
  const viewOptions = [
    ["active", "Active work"],
    ["all", "All work"],
  ];
  const tasks = sortTasksForExecution(
    data.tasks.filter((task) => {
      const viewMatch =
        activeTaskView === "active"
          ? task.status !== "Done"
          : activeTaskView === "completed"
            ? task.status === "Done"
            : true;
      const statusMatch = statusFilter === "all" || task.status === statusFilter;
      const ownerMatch = ownerFilter === "all" || parseOwners(task.owner).includes(ownerFilter);
      const scopeMatch = scopeFilter === "all" || (task.visibility || "team") === scopeFilter;
      return viewMatch && statusMatch && ownerMatch && scopeMatch;
    }),
  );
  const boardTitle = activeTaskView === "completed" ? "Completed" : activeTaskView === "all" ? "All Tasks" : "Active Board";
  const boardHelp =
    activeTaskView === "completed"
      ? "Shipped work is grouped by client so it stays searchable without cluttering execution."
      : activeTaskView === "all"
        ? "Everything, including completed tasks. Use this when you need a full audit trail."
        : "Active work only. Done tasks move into Completed.";
  return `
    <div class="board-toolbar">
      <div class="board-stat-strip" aria-label="Task counts">
        <span class="${activeTaskView === "active" ? "active" : ""}"><strong>${activeCount}</strong> active</span>
        <span class="${activeTaskView === "completed" ? "active" : ""}"><strong>${completedCount}</strong> done</span>
        <span class="${activeTaskView === "all" ? "active" : ""}"><strong>${data.tasks.length}</strong> total</span>
      </div>
      <div class="board-filter-grid">
        ${
          forcedTaskView
            ? ""
            : `
              <label class="filter-field">View
                <select data-task-view-select>
                  ${viewOptions
                    .map(([id, label]) => `<option value="${id}" ${activeTaskView === id ? "selected" : ""}>${escapeHtml(label)}</option>`)
                    .join("")}
                </select>
              </label>
            `
        }
        ${
          activeTaskView !== "completed"
            ? `
              <label class="filter-field">Status
                <select data-filter-select>
                  ${statusOptions
                    .map((status) => `<option value="${escapeAttr(status)}" ${statusFilter === status ? "selected" : ""}>${status === "all" ? "Any status" : escapeHtml(status)}</option>`)
                    .join("")}
                </select>
              </label>
            `
            : ""
        }
        <label class="filter-field">Owner
          <select data-owner-filter-select>
            ${["all", ...owners]
              .map((owner) => `<option value="${escapeAttr(owner)}" ${ownerFilter === owner ? "selected" : ""}>${owner === "all" ? "Any owner" : escapeHtml(owner)}</option>`)
              .join("")}
          </select>
        </label>
        <label class="filter-field">Visibility
          <select data-scope-filter-select>
            ${["all", "team", "private"]
              .map((scope) => `<option value="${scope}" ${scopeFilter === scope ? "selected" : ""}>${scope === "all" ? "Any visibility" : scope === "team" ? "Team" : "Private"}</option>`)
              .join("")}
          </select>
        </label>
      </div>
    </div>
    <div class="grid ${activeTaskView === "completed" ? "" : "two-grid"}">
      <section class="panel" data-tour="board">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Board</p>
            <h3>${escapeHtml(boardTitle)} · ${tasks.length} task${tasks.length === 1 ? "" : "s"}</h3>
            <p class="muted">${escapeHtml(boardHelp)}</p>
          </div>
        </div>
        ${activeTaskView === "completed" ? renderCompletedTaskGroups(tasks) : `<div class="stack">${tasks.length ? tasks.map(renderTask).join("") : `<div class="empty">No tasks in this lane.</div>`}</div>`}
      </section>
      ${
        activeTaskView === "completed"
          ? ""
          : `
            <section class="panel">
              <div class="panel-header">
                <div>
                  <p class="eyebrow">Add</p>
                  <h3>New Task</h3>
                </div>
              </div>
              ${renderTaskForm()}
            </section>
          `
      }
    </div>
  `;
}

function renderAgent() {
  return renderChatWorkspace({ compact: false });
}

function renderChatWorkspace({ compact = false } = {}) {
  const thread = getActiveThread();
  const messages = getActiveThreadMessages();
  const projectId = getCurrentProjectId();

  return `
    <section class="panel command-chat-panel simple-command-chat ${compact ? "home-chat" : ""}" data-tour="intake">
      <div class="chat-command-header">
        <div>
          <p class="eyebrow">Teammate</p>
          <h3>${thread ? escapeHtml(thread.title || "Active thread") : "What should happen?"}</h3>
        </div>
        <div class="chat-header-actions">
          ${renderChatThreadSelect()}
          ${renderChatAudienceSelect(thread)}
          <select class="compact-select" name="projectId" data-chat-project>
            ${getProjectSpaces()
              .map((item) => `<option value="${escapeAttr(item.id)}" ${projectId === item.id ? "selected" : ""}>${escapeHtml(item.name)}</option>`)
              .join("")}
          </select>
          <button class="ghost-button compact-button" type="button" data-action="new-chat">New</button>
          <button class="ghost-button compact-button" type="button" data-open-context-folder="${escapeAttr(projectId)}">Folder</button>
        </div>
      </div>
      ${renderChatThreadStrip(compact)}
      <div class="chat-main simple-chat-main">
        ${agentState.error ? `<div class="notice red-notice">${escapeHtml(agentState.error)}</div>` : ""}
        <div class="chat-messages simple-chat-messages" id="chat-messages">
          ${renderChatMessages(messages)}
          ${agentState.loading ? renderThinkingMessage() : ""}
        </div>
        ${renderChatComposer({ simple: true })}
      </div>
    </section>
  `;
}

function renderChatThreadSelect() {
  const threads = getSortedChatThreads();
  if (!threads.length) return "";
  return `
    <select class="compact-select thread-select" data-chat-thread-select aria-label="Switch thread">
      <option value="" ${agentState.activeThreadId ? "" : "selected"}>New thread</option>
      ${threads
        .map((thread) => {
          const project = getProjectById(thread.projectId);
          const label = `${threadAudienceLabel(thread)} · ${thread.title || "Untitled"} · ${project?.name || "Gensync"}`;
          return `<option value="${escapeAttr(thread.id)}" ${thread.id === agentState.activeThreadId ? "selected" : ""}>${escapeHtml(label)}</option>`;
        })
        .join("")}
    </select>
  `;
}

function renderChatAudienceSelect(thread) {
  const value = getCurrentAudienceValue(thread);
  const dmOptions = (workspace.members || [])
    .filter((member) => member.id && member.id !== session?.uid)
    .map((member) => {
      const memberName = memberDisplayName(member);
      return `<option value="dm:${escapeAttr(member.id)}" ${value === `dm:${member.id}` ? "selected" : ""}>DM ${escapeHtml(memberName)}</option>`;
    })
    .join("");
  return `
    <select class="compact-select visibility-select" data-chat-audience aria-label="Chat audience">
      <option value="private" ${value === "private" ? "selected" : ""}>Private to me</option>
      <option value="team" ${value === "team" ? "selected" : ""}>Team thread</option>
      ${dmOptions}
    </select>
  `;
}

function renderChatThreadStrip(compact = false) {
  const threads = getSortedChatThreads().slice(0, compact ? 6 : 12);
  if (!threads.length) return "";
  return `
    <div class="thread-strip" aria-label="Recent threads">
      ${threads.map(renderThreadPill).join("")}
    </div>
  `;
}

function renderThreadPill(thread) {
  const project = getProjectById(thread.projectId);
  return `
    <button class="thread-pill ${thread.id === agentState.activeThreadId ? "active" : ""}" type="button" data-chat-thread="${escapeAttr(thread.id)}">
      <span>${escapeHtml(thread.title || "Untitled")}</span>
      <small>${escapeHtml(`${project?.name || "Gensync"} · ${threadAudienceLabel(thread)}`)}</small>
    </button>
  `;
}

function renderChatThreadRail(compact = false) {
  const threads = getSortedChatThreads().slice(0, compact ? 8 : 20);
  return `
    <aside class="thread-rail">
      <button class="primary-button full-button" type="button" data-action="new-chat">New chat</button>
      <div class="thread-list">
        ${
          threads.length
            ? threads.map(renderThreadButton).join("")
            : `<div class="empty thread-empty">No threads yet.</div>`
        }
      </div>
    </aside>
  `;
}

function renderThreadButton(thread) {
  const project = getProjectById(thread.projectId);
  const messageCount = data.chatMessages.filter((message) => message.threadId === thread.id).length;
  return `
    <button class="thread-button ${thread.id === agentState.activeThreadId ? "active" : ""}" type="button" data-chat-thread="${escapeAttr(thread.id)}">
      <strong>${escapeHtml(thread.title || "Untitled thread")}</strong>
      <span>${escapeHtml(project?.name || "Gensync")} · ${threadAudienceLabel(thread)} · ${messageCount} msg${messageCount === 1 ? "" : "s"}</span>
    </button>
  `;
}

function renderChatMessages(messages) {
  if (!messages.length) {
    return `
      <div class="chat-empty">
        <div class="chat-empty-mark">G</div>
        <strong>Hey, I am your operator.</strong>
        <span>This chat is private to you by default. Drop a voice note, screenshot, PDF, client problem, referral, quote question, or “plan my day”. I will decide whether it becomes tasks, reminders, context, proof, or a plan.</span>
      </div>
    `;
  }

  return messages.map(renderChatMessage).join("");
}

function renderChatMessage(message) {
  const isUser = message.role === "user";
  const isOwnUser = isUser && (!message.userId || message.userId === session?.uid);
  const author = isUser ? messageAuthorName(message) : "Gensync teammate · Agent";
  const className = isUser
    ? `chat-message ${isOwnUser ? "user-message own-user-message" : "other-user-message"}`
    : "chat-message assistant-message";
  return `
    <article class="${className}">
      <div class="message-author">${escapeHtml(author)}</div>
      <div class="chat-bubble">
        ${
          message.result
            ? renderAssistantResult(message.result, message.id)
            : `<div class="message-text">${escapeHtml(message.content || "")}</div>${renderStoredAttachments(message.attachments)}`
        }
      </div>
    </article>
  `;
}

function renderStoredAttachments(attachments = []) {
  if (!attachments.length) return "";
  return `
    <div class="stored-attachments">
      ${attachments
        .map((attachment) => `
          <span>${escapeHtml(attachment.name || "attachment")} · ${escapeHtml(attachment.kind || "file")}</span>
        `)
        .join("")}
    </div>
  `;
}

function renderThinkingMessage() {
  return `
    <article class="chat-message assistant-message">
      <div class="message-author">Gensync teammate</div>
      <div class="chat-bubble thinking-bubble">
        <span></span><span></span><span></span>
      </div>
    </article>
  `;
}

function renderAssistantResult(result, messageId) {
  const hasWrites = (result.suggestedContexts?.length || result.suggestedReminders?.length || result.suggestedTasks?.length);
  return `
    <div class="assistant-result">
      <div class="agent-answer">${escapeHtml(result.answer || "No answer returned.")}</div>
      ${result.intent ? `<div class="badges no-margin">${badge(result.intent, "blue")}${badge(result.confidence || "Needs review", "amber")}</div>` : ""}
      ${renderAgentList("Assumptions", result.assumptions)}
      ${renderRelevantContext(result.relevantContext)}
      ${renderAgentList("Context Needed", result.contextNeeded)}
      ${renderAgentList("Risks", result.risks)}
      ${result.nextQuestion ? `<div class="notice"><strong>Question:</strong> ${escapeHtml(result.nextQuestion)}</div>` : ""}
      <div class="stack">
        ${(result.suggestedContexts || []).map((item, index) => renderChatContextSuggestion(item, messageId, index)).join("")}
        ${(result.suggestedReminders || []).map((item, index) => renderChatReminderSuggestion(item, messageId, index)).join("")}
        ${(result.suggestedTasks || []).map((task, index) => renderChatTaskSuggestion(task, messageId, index)).join("")}
        ${hasWrites ? "" : `<div class="empty">No board writes proposed. Use the answer/context above.</div>`}
      </div>
    </div>
  `;
}

function renderChatTaskSuggestion(task, messageId, index) {
  return `
    <article class="item chat-proposal">
      <div class="item-header">
        <div>
          <h4>${escapeHtml(task.title)}</h4>
          <p class="task-meta">${escapeHtml(task.client)} · ${escapeHtml(task.owner)} · ${escapeHtml(task.review)}</p>
        </div>
        ${badge(task.priority, priorityTone(task.priority))}
      </div>
      <p class="muted" style="margin-top: 8px;">${escapeHtml(task.notes)}</p>
      ${task.blockedBy ? `<p class="muted" style="margin-top: 8px;"><strong>Blocked:</strong> ${escapeHtml(task.blockedBy)}</p>` : ""}
      <div class="badges">
        ${badge(task.visibility === "private" ? "Private" : "Team", task.visibility === "private" ? "red" : "blue")}
        ${(task.evidenceRefs || []).slice(0, 2).map((ref) => badge(ref, "green")).join("")}
        <button class="ghost-button compact-button" type="button" data-chat-task="${escapeAttr(`${messageId}:${index}`)}">Add task</button>
      </div>
    </article>
  `;
}

function renderChatContextSuggestion(item, messageId, index) {
  return `
    <article class="item chat-proposal">
      <div class="item-header">
        <div>
          <h4>${escapeHtml(item.title)}</h4>
          <p class="task-meta">${escapeHtml(item.category || "Note")} · ${escapeHtml(item.confidence || "Unverified")}</p>
        </div>
        ${badge(item.visibility === "private" ? "Private" : "Team", item.visibility === "private" ? "red" : "blue")}
      </div>
      <p class="muted" style="margin-top: 8px;">${escapeHtml(item.summary || item.content || "")}</p>
      <div class="badges">
        <button class="ghost-button compact-button" type="button" data-chat-context="${escapeAttr(`${messageId}:${index}`)}">Add context</button>
      </div>
    </article>
  `;
}

function renderChatReminderSuggestion(item, messageId, index) {
  return `
    <article class="item chat-proposal">
      <div class="item-header">
        <div>
          <h4>${escapeHtml(item.title)}</h4>
          <p class="task-meta">${escapeHtml(item.owner || "Manish")} · ${escapeHtml(item.due || "Open reminder")}</p>
        </div>
        ${badge(item.priority || "P1", priorityTone(item.priority || "P1"))}
      </div>
      <p class="muted" style="margin-top: 8px;">${escapeHtml(item.notes || "")}</p>
      <div class="badges">
        ${badge("Reminder", "blue")}
        <button class="ghost-button compact-button" type="button" data-chat-reminder="${escapeAttr(`${messageId}:${index}`)}">Add reminder</button>
      </div>
    </article>
  `;
}

function renderChatComposer({ simple = false } = {}) {
  return `
    <form id="chat-form" class="chat-composer">
      ${
        simple
          ? `
            <input name="projectId" type="hidden" value="${escapeAttr(getCurrentProjectId())}" />
            <input name="mode" type="hidden" value="operator" />
            <input name="visibility" type="hidden" value="${escapeAttr(getCurrentChatVisibility())}" />
            <input name="threadKind" type="hidden" value="${escapeAttr(getCurrentThreadKind())}" />
            <input name="recipientUserId" type="hidden" value="${escapeAttr(getCurrentRecipientUserId())}" />
          `
          : `
            <div class="composer-controls">
              <label>
                Project
                <select name="projectId" data-chat-project>
                  ${getProjectSpaces()
                    .map((project) => `<option value="${escapeAttr(project.id)}" ${getCurrentProjectId() === project.id ? "selected" : ""}>${escapeHtml(project.name)}</option>`)
                    .join("")}
                </select>
              </label>
              <label>
                Mode
                ${renderChatModeSelect()}
              </label>
              <label>
                Visibility
                <select name="threadKind">
                  <option value="private" ${getCurrentThreadKind() === "private" ? "selected" : ""}>Private to me</option>
                  <option value="team" ${getCurrentThreadKind() === "team" ? "selected" : ""}>Team thread</option>
                  <option value="dm" ${getCurrentThreadKind() === "dm" ? "selected" : ""}>Private DM</option>
                </select>
              </label>
              <input name="recipientUserId" type="hidden" value="${escapeAttr(getCurrentRecipientUserId())}" />
              <input name="visibility" type="hidden" value="${escapeAttr(getCurrentChatVisibility())}" />
            </div>
          `
      }
      <textarea name="prompt" class="agent-prompt chat-prompt" placeholder="Message Gensync teammate...">${escapeHtml(agentState.prompt)}</textarea>
      <div class="composer-bottom">
        <div class="intake-actions">
          <button class="ghost-button ${voiceState.listening ? "recording-button" : ""}" type="button" data-action="voice-note">
            ${voiceState.listening ? "Stop" : "Voice"}
          </button>
          <label class="ghost-button file-button" for="agent-files">Attach</label>
          <input id="agent-files" class="hidden" type="file" multiple accept="image/*,.pdf,.txt,.md,.csv,.json,.srt,.vtt,.doc,.docx,.ppt,.pptx" />
        </div>
        ${renderDraftStatus()}
        <button class="primary-button send-button" type="submit" ${agentState.loading ? "disabled" : ""}>
          ${agentState.loading ? "Thinking..." : "Send"}
        </button>
      </div>
      ${voiceState.message ? `<div class="notice ${voiceState.listening ? "green-notice" : "quiet-notice"}">${escapeHtml(voiceState.message)}</div>` : ""}
      ${renderChatAttachmentTray()}
    </form>
  `;
}

function renderDraftStatus() {
  const hasDraft = Boolean((agentState.prompt || "").trim()) || Boolean(agentState.attachments?.length);
  return `<span class="draft-status">${hasDraft ? "Draft autosaved" : "Autosaves"}</span>`;
}

function renderChatModeSelect(className = "") {
  return `
    <select name="mode" class="${escapeAttr(className)}">
      ${[
        ["operator", "Auto"],
        ["motion", "Motion QC"],
        ["leads", "Lead Gen"],
        ["fulfillment", "Fulfillment"],
        ["strategy", "Strategy"],
        ["calendar", "Calendar"],
      ]
        .map(([value, label]) => `<option value="${value}" ${agentState.mode === value ? "selected" : ""}>${label}</option>`)
        .join("")}
    </select>
  `;
}

function renderChatAttachmentTray() {
  return agentState.attachments?.length ? renderAttachmentTray() : "";
}

function renderProjectContextRail(projectId) {
  const project = getProjectById(projectId);
  const contexts = getProjectContextItems(projectId).slice(0, 5);
  return `
    <aside class="project-context-rail">
      <div class="context-rail-header">
        <div>
          <p class="eyebrow">Project Context</p>
          <h4>${escapeHtml(project?.name || "Gensync")}</h4>
        </div>
        ${badge(`${contexts.length}`, contexts.length ? "green" : "amber")}
      </div>
      <div class="context-mini-list">
        ${
          contexts.length
            ? contexts.map(renderMiniContext).join("")
            : `<div class="empty context-empty">Add the source of truth here before asking the agent to decide.</div>`
        }
      </div>
      <form id="project-context-form" class="project-context-form">
        <input name="projectId" type="hidden" value="${escapeAttr(projectId || "")}" />
        <input name="title" placeholder="Doc, contract, transcript, proof link" required />
        <input name="sourceUrl" placeholder="URL or local path" />
        <textarea name="summary" placeholder="What should the teammate know?"></textarea>
        <button class="ghost-button full-button" type="submit">Add context</button>
      </form>
    </aside>
  `;
}

function renderMiniContext(item) {
  return `
    <article class="mini-row context-hit">
      <strong>${escapeHtml(item.title || "Context")}</strong>
      <span>${escapeHtml(item.summary || item.content || item.sourceUrl || "")}</span>
    </article>
  `;
}

function getProjectSpaces() {
  if (data.projectSpaces?.length) return data.projectSpaces;
  return [
    {
      id: "local-gensync",
      name: "Gensync",
      slug: "gensync",
      clientId: null,
      description: "Internal operating context.",
      visibility: "team",
    },
    ...(data.clients || []).map((client) => ({
      id: `local-client-${client.id}`,
      name: client.name,
      slug: slugify(client.name),
      clientId: client.id,
      description: `${client.name} project context.`,
      visibility: "team",
    })),
  ];
}

function getDefaultProjectId() {
  return getProjectSpaces().find((project) => project.name === "Gensync")?.id || getProjectSpaces()[0]?.id || "";
}

function normalizeChatVisibility(value) {
  return value === "team" ? "team" : "private";
}

function normalizeThreadKind(value) {
  if (value === "team") return "team";
  if (value === "dm") return "dm";
  return "private";
}

function chatVisibilityFromKind(kind) {
  return normalizeThreadKind(kind) === "team" ? "team" : "private";
}

function getCurrentThreadKind(thread = getActiveThread()) {
  return normalizeThreadKind(thread?.threadKind || agentState.threadKind || agentState.visibility || "private");
}

function getCurrentChatVisibility(thread = getActiveThread()) {
  return chatVisibilityFromKind(getCurrentThreadKind(thread));
}

function getCurrentRecipientUserId(thread = getActiveThread()) {
  return thread?.recipientUserId || agentState.recipientUserId || "";
}

function getCurrentAudienceValue(thread = getActiveThread()) {
  const kind = getCurrentThreadKind(thread);
  if (kind === "dm") return `dm:${getCurrentRecipientUserId(thread)}`;
  return kind;
}

function threadAudienceLabel(thread) {
  const kind = getCurrentThreadKind(thread);
  if (kind === "team") return "Team";
  if (kind === "dm") {
    const recipient = getMemberById(thread?.recipientUserId);
    if (thread?.createdBy === session?.uid) {
      return `DM ${memberDisplayName(recipient) || "Member"}`;
    }
    return `DM ${messageUserName(thread?.createdBy) || "Member"}`;
  }
  return "Private";
}

function getPreferredChatThread() {
  const threads = getSortedChatThreads();
  return threads.find((thread) => getCurrentThreadKind(thread) === "private" && thread.createdBy === session?.uid)
    || threads.find((thread) => getCurrentThreadKind(thread) === "team")
    || threads[0]
    || null;
}

function getCurrentProjectId() {
  const activeThread = getActiveThread();
  return activeThread?.projectId || agentState.projectId || getDefaultProjectId();
}

function getProjectById(projectId) {
  return getProjectSpaces().find((project) => project.id === projectId) || getProjectSpaces()[0] || null;
}

function getActiveThread() {
  return data.chatThreads.find((thread) => thread.id === agentState.activeThreadId) || null;
}

function getMemberById(userId) {
  if (!userId) return null;
  return (workspace.members || []).find((member) => member.id === userId) || null;
}

function memberDisplayName(member) {
  if (!member) return "";
  return ownerDisplayName(member.name || member.email) || member.name || member.email || "";
}

function messageUserName(userId) {
  if (!userId) return ownerDisplayName(session?.user) || "You";
  if (userId === session?.uid) return `${ownerDisplayName(session?.user) || "You"} (you)`;
  return memberDisplayName(getMemberById(userId)) || "Team member";
}

function messageAuthorName(message) {
  if (message.userId === session?.uid) return `${ownerDisplayName(session?.user) || "You"} (you)`;
  return messageUserName(message.userId);
}

function getSortedChatThreads() {
  return [...(data.chatThreads || [])].sort((left, right) => Date.parse(right.lastMessageAt || right.createdAt || 0) - Date.parse(left.lastMessageAt || left.createdAt || 0));
}

function getActiveThreadMessages() {
  const thread = getActiveThread();
  if (!thread) return [];
  return data.chatMessages.filter((message) => message.threadId === thread.id);
}

function switchChatThread(threadId = "") {
  saveCurrentChatDraft();
  const thread = data.chatThreads.find((item) => item.id === threadId);
  agentState = {
    ...agentState,
    activeThreadId: thread?.id || "",
    projectId: thread?.projectId || agentState.projectId || getDefaultProjectId(),
    threadKind: thread ? getCurrentThreadKind(thread) : "private",
    recipientUserId: thread?.recipientUserId || "",
    visibility: thread ? getCurrentChatVisibility(thread) : CHAT_DEFAULT_VISIBILITY,
    prompt: "",
    attachments: [],
    result: null,
    error: "",
  };
  restoreDraftForCurrentChat();
  persistChatUiState();
  render();
}

async function setChatAudience(value) {
  const raw = String(value || "private");
  const isDm = raw.startsWith("dm:");
  const nextKind = isDm ? "dm" : normalizeThreadKind(raw);
  const nextRecipientUserId = isDm ? raw.slice(3) : "";
  const nextVisibility = chatVisibilityFromKind(nextKind);
  const thread = getActiveThread();

  if (!thread) {
    if (nextKind === "dm" && !getMemberById(nextRecipientUserId)) {
      agentState.error = "Choose a real team member for the DM.";
      render();
      return;
    }
    agentState.threadKind = nextKind;
    agentState.recipientUserId = nextRecipientUserId;
    agentState.visibility = nextVisibility;
    saveCurrentChatDraft();
    persistChatUiState();
    render();
    return;
  }

  const currentKind = getCurrentThreadKind(thread);
  const currentRecipientUserId = thread.recipientUserId || "";
  const currentVisibility = getCurrentChatVisibility(thread);
  if (currentKind === nextKind && currentRecipientUserId === nextRecipientUserId) return;

  if (nextKind === "dm" && !getMemberById(nextRecipientUserId)) {
    agentState.error = "Choose a real team member for the DM.";
    render();
    return;
  }

  if (
    nextKind === "team"
    && !window.confirm("Share this whole chat thread with Mohit/team members? Project Library context stays shared either way.")
  ) {
    agentState.threadKind = currentKind;
    agentState.recipientUserId = currentRecipientUserId;
    agentState.visibility = currentVisibility;
    render();
    return;
  }

  const previousThreads = data.chatThreads;
  const now = new Date().toISOString();
  data.chatThreads = data.chatThreads.map((item) =>
    item.id === thread.id
      ? {
          ...item,
          visibility: nextVisibility,
          threadKind: nextKind,
          recipientUserId: nextRecipientUserId,
          updatedAt: now,
        }
      : item
  );
  agentState.threadKind = nextKind;
  agentState.recipientUserId = nextRecipientUserId;
  agentState.visibility = nextVisibility;
  persistChatUiState();
  render();

  try {
    if (supabaseClient) {
      const result = await supabaseClient
        .from("chat_threads")
        .update({
          visibility: nextVisibility,
          thread_kind: nextKind,
          recipient_user_id: nextRecipientUserId || null,
          updated_at: now,
        })
        .eq("id", thread.id)
        .eq("team_id", activeTeamId);
      if (result.error) throw result.error;
    } else {
      saveData();
    }
  } catch (error) {
    data.chatThreads = previousThreads;
    agentState.threadKind = currentKind;
    agentState.recipientUserId = currentRecipientUserId;
    agentState.visibility = currentVisibility;
    agentState.error = error.message || "Could not change thread visibility.";
    render();
  }
}

function getProjectContextItems(projectId) {
  const project = getProjectById(projectId);
  return (data.contexts || []).filter((item) => {
    if (item.projectId && item.projectId === projectId) return true;
    if (project?.clientId && item.clientId === project.clientId) return true;
    if (project?.clientId && contextTextMatchesProject(item, project)) return true;
    if (project?.name === "Gensync" && !item.projectId && !item.clientId) return true;
    return false;
  });
}

function contextTextMatchesProject(item, project) {
  const needle = String(project?.name || "").trim().toLowerCase();
  if (!needle) return false;
  const haystack = [
    item.title,
    item.category,
    item.sourceUrl,
    item.summary,
    item.content,
  ].join(" ").toLowerCase();
  return haystack.includes(needle);
}

function renderAgentForm() {
  return `
    <form id="agent-form" class="form">
      <label>
        Mode
        <select name="mode">
          ${[
            ["operator", "Operator"],
            ["motion", "Motion QC"],
            ["leads", "Lead Gen"],
            ["fulfillment", "Fulfillment"],
            ["strategy", "Strategy"],
            ["calendar", "Calendar"],
          ]
            .map(([value, label]) => `<option value="${value}" ${agentState.mode === value ? "selected" : ""}>${label}</option>`)
            .join("")}
        </select>
      </label>
      <label>
        Message
        <textarea name="prompt" class="agent-prompt" placeholder="Paste a referral, ask what to quote, drop a screenshot for QC, or dictate the messy task.">${escapeHtml(agentState.prompt)}</textarea>
      </label>
      <div class="intake-actions">
        <button class="ghost-button ${voiceState.listening ? "recording-button" : ""}" type="button" data-action="voice-note">
          ${voiceState.listening ? "Stop voice note" : "Voice note"}
        </button>
        <label class="ghost-button file-button" for="agent-files">Attach files</label>
        <input id="agent-files" class="hidden" type="file" multiple accept="image/*,.pdf,.txt,.md,.csv,.json,.srt,.vtt,.doc,.docx,.ppt,.pptx" />
      </div>
      ${voiceState.message ? `<div class="notice ${voiceState.listening ? "green-notice" : "quiet-notice"}">${escapeHtml(voiceState.message)}</div>` : ""}
      ${renderAttachmentTray()}
      <button class="primary-button full-button" type="submit" ${agentState.loading ? "disabled" : ""}>
        ${agentState.loading ? "Thinking..." : "Analyze"}
      </button>
      <div class="notice quiet-notice">Images and PDFs are sent to the model for analysis. Board changes only happen after you confirm them.</div>
    </form>
  `;
}

function renderAttachmentTray() {
  const attachments = agentState.attachments || [];
  if (!attachments.length) {
    return `<div class="attachment-drop">Voice, screenshots, PDFs, images, transcripts, notes, invoices, or contracts.</div>`;
  }

  return `
    <div class="attachment-list">
      ${attachments
        .map((file, index) => `
          <div class="attachment-chip">
            <span>${escapeHtml(file.name)}</span>
            <small>${escapeHtml(file.kind || file.type || "file")} · ${formatBytes(file.size)}${file.needsReattach ? " · reattach after reload" : ""}</small>
            <button class="icon-button compact-icon" type="button" data-remove-attachment="${index}" aria-label="Remove attachment">x</button>
          </div>
        `)
        .join("")}
    </div>
  `;
}

function renderAgentOutput() {
  if (agentState.error) {
    return `<div class="notice red-notice">${escapeHtml(agentState.error)}</div>`;
  }

  if (!agentState.result) {
    return `<div class="empty">Ask for a motion QC pass, quote, referral proof pack, client plan, reminder, or lead-gen move.</div>`;
  }

  const result = agentState.result;
  return `
    <div class="stack">
      <div class="agent-answer">${escapeHtml(result.answer || "No answer returned.")}</div>
      ${result.intent ? `<div class="badges no-margin">${badge(result.intent, "blue")}${badge(result.confidence || "Needs review", "amber")}</div>` : ""}
      ${renderAgentList("Assumptions", result.assumptions)}
      ${renderRelevantContext(result.relevantContext)}
      ${renderAgentList("Context Needed", result.contextNeeded)}
      ${renderAgentList("Risks", result.risks)}
      ${
        result.nextQuestion
          ? `<div class="notice"><strong>Question:</strong> ${escapeHtml(result.nextQuestion)}</div>`
          : ""
      }
      <div class="stack">
        ${(result.suggestedContexts || []).map((item, index) => renderAgentContext(item, index)).join("")}
        ${(result.suggestedReminders || []).map((item, index) => renderAgentReminder(item, index)).join("")}
        ${
          result.suggestedTasks?.length
            ? result.suggestedTasks.map((task, index) => renderAgentTask(task, index)).join("")
            : !(result.suggestedContexts?.length || result.suggestedReminders?.length)
              ? `<div class="empty">No board writes proposed. Use the answer/context above.</div>`
              : ""
        }
      </div>
    </div>
  `;
}

function renderAgentList(title, items = []) {
  if (!items.length) return "";
  return `
    <div>
      <p class="eyebrow">${escapeHtml(title)}</p>
      <div class="stack">
        ${items.map((item) => `<div class="mini-row">${escapeHtml(item)}</div>`).join("")}
      </div>
    </div>
  `;
}

function renderAgentTask(task, index) {
  return `
    <article class="item">
      <div class="item-header">
        <div>
          <h4>${escapeHtml(task.title)}</h4>
          <p class="task-meta">${escapeHtml(task.client)} · ${escapeHtml(task.owner)} · ${escapeHtml(task.review)}</p>
        </div>
        ${badge(task.priority, priorityTone(task.priority))}
      </div>
      <p class="muted" style="margin-top: 8px;">${escapeHtml(task.notes)}</p>
      ${task.blockedBy ? `<p class="muted" style="margin-top: 8px;"><strong>Blocked:</strong> ${escapeHtml(task.blockedBy)}</p>` : ""}
      <div class="badges">
        ${badge(task.visibility === "private" ? "Private" : "Team", task.visibility === "private" ? "red" : "blue")}
        ${(task.evidenceRefs || []).slice(0, 2).map((ref) => badge(ref, "green")).join("")}
        <button class="ghost-button compact-button" type="button" data-agent-task="${index}">Add task</button>
      </div>
    </article>
  `;
}

function renderRelevantContext(items = []) {
  if (!items.length) return "";
  return `
    <div>
      <p class="eyebrow">Relevant Context</p>
      <div class="stack">
        ${items
          .map((item) => `
            <article class="mini-row context-hit">
              <strong>${escapeHtml(item.title || "Context")}</strong>
              <span>${escapeHtml(item.reason || item.summary || "")}</span>
              ${item.sourceUrl ? `<small>${escapeHtml(item.sourceUrl)}</small>` : ""}
            </article>
          `)
          .join("")}
      </div>
    </div>
  `;
}

function renderAgentContext(item, index) {
  return `
    <article class="item">
      <div class="item-header">
        <div>
          <h4>${escapeHtml(item.title)}</h4>
          <p class="task-meta">${escapeHtml(item.category || "Note")} · ${escapeHtml(item.confidence || "Unverified")}</p>
        </div>
        ${badge(item.visibility === "private" ? "Private" : "Team", item.visibility === "private" ? "red" : "blue")}
      </div>
      <p class="muted" style="margin-top: 8px;">${escapeHtml(item.summary || item.content || "")}</p>
      <div class="badges">
        <button class="ghost-button compact-button" type="button" data-agent-context="${index}">Add context</button>
      </div>
    </article>
  `;
}

function renderAgentReminder(item, index) {
  return `
    <article class="item">
      <div class="item-header">
        <div>
          <h4>${escapeHtml(item.title)}</h4>
          <p class="task-meta">${escapeHtml(item.owner || "Manish")} · ${escapeHtml(item.due || "Open reminder")}</p>
        </div>
        ${badge(item.priority || "P1", priorityTone(item.priority || "P1"))}
      </div>
      <p class="muted" style="margin-top: 8px;">${escapeHtml(item.notes || "")}</p>
      <div class="badges">
        ${badge("Reminder", "blue")}
        <button class="ghost-button compact-button" type="button" data-agent-reminder="${index}">Add reminder</button>
      </div>
    </article>
  `;
}

function renderContext() {
  const folder = getActiveContextFolder();
  const folderItems = getContextFolderItems(folder);
  const isCalendarFolder = folder?.id === "calendar";
  return `
    <div class="finder-layout" data-tour="vault">
      <aside class="panel folder-sidebar">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Folders</p>
            <h3>Memory</h3>
          </div>
        </div>
        <div class="folder-list">
          ${getContextFolders().map(renderContextFolderButton).join("")}
        </div>
      </aside>

      <section class="panel folder-main">
        <div class="panel-header">
          <div>
            <p class="eyebrow">${isCalendarFolder ? "Connected Source" : "Folder"}</p>
            <h3>${escapeHtml(folder?.name || "Library")}</h3>
            <p class="muted">${escapeHtml(folder?.description || "Project source-of-truth files.")}</p>
          </div>
          ${badge(isCalendarFolder ? `${data.calendarSources.length} calendars` : `${folderItems.length} files`, folderItems.length || isCalendarFolder ? "green" : "amber")}
        </div>
        ${
          isCalendarFolder
            ? renderCalendarFolder()
            : renderContextFolderFiles(folderItems)
        }
      </section>

      <aside class="panel folder-inspector">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Add</p>
            <h3>${isCalendarFolder ? "Calendar Source" : "File"}</h3>
          </div>
        </div>
        ${isCalendarFolder ? renderCalendarForm() : renderContextForm(folder)}
      </aside>
    </div>
  `;
}

function getContextFolders() {
  const projectFolders = getProjectSpaces().map((project) => ({
    id: project.id,
    name: project.name,
    description: project.description || `${project.name} project memory.`,
    project,
    count: getProjectContextItems(project.id).length,
    kind: "project",
  }));

  return [
    ...projectFolders,
    {
      id: "calendar",
      name: "Calendars",
      description: "Availability, scheduling links, working hours, and connected Google accounts.",
      count: data.calendarSources.length,
      kind: "calendar",
    },
    {
      id: "all",
      name: "All Files",
      description: "Everything in the library across projects.",
      count: data.contexts.length,
      kind: "all",
    },
  ];
}

function getActiveContextFolder() {
  const folders = getContextFolders();
  if (!contextFolderId || !folders.some((folder) => folder.id === contextFolderId)) {
    contextFolderId = agentState.projectId || getDefaultProjectId() || folders[0]?.id || "all";
  }
  return folders.find((folder) => folder.id === contextFolderId) || folders[0] || null;
}

function getContextFolderItems(folder) {
  if (!folder) return [];
  if (folder.id === "all") return data.contexts || [];
  if (folder.kind === "project") return getProjectContextItems(folder.id);
  return [];
}

function renderContextFolderButton(folder) {
  return `
    <button class="folder-button ${getActiveContextFolder()?.id === folder.id ? "active" : ""}" type="button" data-context-folder="${escapeAttr(folder.id)}">
      <span class="folder-icon">${folder.kind === "calendar" ? "C" : folder.kind === "all" ? "A" : "F"}</span>
      <span>
        <strong>${escapeHtml(folder.name)}</strong>
        <small>${folder.count} item${folder.count === 1 ? "" : "s"}</small>
      </span>
    </button>
  `;
}

function renderContextFolderFiles(items) {
  if (!items.length) {
    return `<div class="empty folder-empty">This folder is empty. Add docs, links, PDFs, notes, meeting transcripts, invoices, contracts, and source-of-truth summaries here.</div>`;
  }

  return `
    <div class="file-grid">
      ${items.map(renderContextFile).join("")}
    </div>
  `;
}

function renderContextFile(item) {
  return `
    <article class="file-card">
      <div class="file-icon">${contextFileIcon(item.category)}</div>
      <div>
        <h4>${escapeHtml(item.title)}</h4>
        <p>${escapeHtml(item.category || "Note")} · ${escapeHtml(item.confidence || "Unverified")}</p>
      </div>
      ${item.summary || item.content ? `<span>${escapeHtml(item.summary || item.content)}</span>` : ""}
      ${item.sourceUrl ? `<small>${escapeHtml(item.sourceUrl)}</small>` : ""}
    </article>
  `;
}

function contextFileIcon(category) {
  const text = String(category || "").toLowerCase();
  if (text.includes("github")) return "GH";
  if (text.includes("calendar")) return "CAL";
  if (text.includes("pdf")) return "PDF";
  if (text.includes("contract")) return "DOC";
  if (text.includes("invoice")) return "INV";
  if (text.includes("transcript")) return "TXT";
  if (text.includes("google")) return "G";
  return "NOTE";
}

function renderCalendarFolder() {
  const calendarSources = data.calendarSources || [];
  return `
    <div class="calendar-folder-actions">
      <button class="primary-button compact-button" type="button" data-action="connect-google-calendar" ${calendarConnecting ? "disabled" : ""}>
        ${calendarConnecting ? "Opening Google..." : "Connect Google"}
      </button>
      ${badge(calendarSources.some((item) => item.status === "connected") ? "Connected" : "Needs OAuth", calendarSources.some((item) => item.status === "connected") ? "green" : "amber")}
    </div>
    ${calendarNotice ? `<div class="notice calendar-notice ${calendarNotice.startsWith("Google Calendar connected") ? "green-notice" : ""}">${escapeHtml(calendarNotice)}</div>` : ""}
    <div class="file-grid calendar-file-grid">
      ${calendarSources.length ? calendarSources.map(renderCalendarFile).join("") : `<div class="empty">Connect your Google Calendar first, then ask Mohit to log in and connect his own account. Consent happens per user.</div>`}
    </div>
  `;
}

function renderCalendarFile(item) {
  return `
    <article class="file-card">
      <div class="file-icon">CAL</div>
      <div>
        <h4>${escapeHtml(item.owner || item.accountEmail || "Calendar")}</h4>
        <p>${escapeHtml(item.accountEmail)} · Google Calendar</p>
      </div>
      <span>${escapeHtml(item.notes || "Calendar source recorded.")}</span>
      ${item.sourceUrl ? `<small>${escapeHtml(item.sourceUrl)}</small>` : ""}
    </article>
  `;
}

function renderContextNudge(force = false) {
  const contexts = data.contexts || [];
  const calendarSources = data.calendarSources || [];
  if (!force && contexts.length >= 6 && calendarSources.length >= 2) return "";
  return `
    <section class="panel context-nudge">
      <div>
        <p class="eyebrow">Missing Context</p>
        <h3>Upload the source of truth before asking the agent to decide.</h3>
        <p class="muted">Add Google Docs, GitHub links, PDFs, notes, meeting transcripts, invoices, contracts, and Google Calendar account emails for both Manish and Mohit. The agent will treat missing context as a blocker instead of hallucinating.</p>
      </div>
      <button class="ghost-button" data-view="context">Add context</button>
    </section>
  `;
}

function renderContextItem(item) {
  return `
    <article class="item">
      <div class="item-header">
        <div>
          <h4>${escapeHtml(item.title)}</h4>
          <p class="task-meta">${escapeHtml(item.category)} · ${escapeHtml(item.confidence)}</p>
        </div>
        ${badge(item.visibility === "private" ? "Private" : "Team", item.visibility === "private" ? "red" : "blue")}
      </div>
      <p class="muted" style="margin-top: 8px;">${escapeHtml(item.summary || item.content || "No summary yet.")}</p>
      ${item.sourceUrl ? `<p class="task-meta" style="margin-top: 8px;">${escapeHtml(item.sourceUrl)}</p>` : ""}
    </article>
  `;
}

function renderCalendarSource(item) {
  return `
    <article class="item">
      <div class="item-header">
        <div>
          <h4>${escapeHtml(item.owner || item.accountEmail || "Calendar")}</h4>
          <p class="task-meta">${escapeHtml(item.accountEmail)} · Google Calendar</p>
        </div>
        ${badge(item.status === "connected" ? "Connected" : item.status === "manual_context" ? "Manual" : "Needs OAuth", item.status === "connected" ? "green" : "amber")}
      </div>
      <p class="muted" style="margin-top: 8px;">${escapeHtml(item.notes || "Calendar source recorded. OAuth sync is the next integration step.")}</p>
      ${item.sourceUrl ? `<p class="task-meta" style="margin-top: 8px;">${escapeHtml(item.sourceUrl)}</p>` : ""}
    </article>
  `;
}

function renderCrm() {
  const revenue = getRevenueSnapshot();
  return `
    <div class="grid metrics-grid crm-summary">
      ${metric(
        `${formatCompactMoney(revenue.collected)} / ${formatCompactMoney(revenue.target)}`,
        "Collected",
        `${revenue.progress}% of six-week target`,
        { progress: revenue.progress },
      )}
      ${metric(formatMoney(revenue.remaining), "Still needed", "Cash to collect")}
      ${metric(formatMoney(revenue.committed), "Committed", "Won but not paid")}
      ${metric(formatMoney(revenue.weighted), "Weighted pipeline", "Risk-adjusted")}
    </div>
    <div class="grid two-grid">
      <section class="panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Pipeline</p>
            <h3>Lead Packets</h3>
          </div>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Stage</th>
              <th>Value</th>
              <th>Next</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${data.leads
              .map(
                (lead) => `
                  <tr>
                    <td><strong>${escapeHtml(lead.company)}</strong><br><span class="task-meta">${escapeHtml(lead.source)}</span></td>
                    <td>${renderLeadStageSelect(lead.stage, `data-lead-stage="${lead.id}" aria-label="Stage for ${escapeAttr(lead.company)}"`, "")}</td>
                    <td>${formatMoney(Number(lead.value || 0))}</td>
                    <td>${escapeHtml(lead.next)}</td>
                    <td>
                      <button class="ghost-button compact-button" type="button" data-lead-collected="${lead.id}" ${isCollectedLead(lead) ? "disabled" : ""}>
                        ${isCollectedLead(lead) ? "Collected" : "Mark collected"}
                      </button>
                    </td>
                  </tr>
                `,
              )
              .join("")}
          </tbody>
        </table>
      </section>
      <section class="panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Add</p>
            <h3>Lead Packet</h3>
          </div>
        </div>
        ${renderLeadForm()}
      </section>
    </div>
  `;
}

function renderSelf() {
  return `
    <div class="grid two-grid">
      <section class="panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Daily Baseline</p>
            <h3>Body + Mind</h3>
          </div>
          <div class="badges no-margin">
            ${badge(data.self.date, "blue")}
            ${badge("Private", "amber")}
          </div>
        </div>
        <form id="self-form" class="form">
          <div class="form-row">
            <label>Sleep <input name="sleep" value="${escapeAttr(data.self.sleep)}" placeholder="hours / quality" /></label>
            <label>Energy <input name="energy" value="${escapeAttr(data.self.energy)}" placeholder="1-10 + reason" /></label>
          </div>
          <label>Mood <input name="mood" value="${escapeAttr(data.self.mood)}" placeholder="plain truth, no diagnosis" /></label>
          <label>Why this matters today <textarea name="why">${escapeHtml(data.self.why)}</textarea></label>
          <label>Next small win <textarea name="nextSmallWin">${escapeHtml(data.self.nextSmallWin)}</textarea></label>
          <button class="primary-button" type="submit">Save state</button>
        </form>
      </section>
      <section class="panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Minimums</p>
            <h3>Non-Negotiable Floor</h3>
          </div>
        </div>
        <div class="checklist">
          ${renderCheck("body", "20 minutes walking or gym")}
          ${renderCheck("water", "2 liters water")}
          ${renderCheck("meal", "One real meal")}
          ${renderCheck("artifact", "One visible artifact")}
          ${renderCheck("connection", "One useful human touch")}
        </div>
      </section>
    </div>
  `;
}

function renderEvidence() {
  return `
    <div class="grid two-grid">
      <section class="panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Source Control</p>
            <h3>Evidence</h3>
          </div>
        </div>
        <div class="stack">
          ${data.evidence.map(renderEvidenceItem).join("")}
        </div>
      </section>
      <section class="panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Add</p>
            <h3>Evidence Link</h3>
          </div>
        </div>
        ${renderEvidenceForm()}
      </section>
    </div>
  `;
}

function renderTeam() {
  const team = workspace.team || { name: TEAM_NAME, join_code: "" };
  const members = workspace.members || [];
  return `
    <div class="grid two-grid">
      <section class="panel" data-tour="invite">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Access</p>
            <h3>${escapeHtml(team.name || TEAM_NAME)}</h3>
          </div>
          ${badge(workspace.role || "member", workspace.role === "owner" ? "green" : "blue")}
        </div>
        <label>
          Invite code
          <div class="code-row">
            <input value="${escapeAttr(team.join_code || "")}" readonly />
            <button class="ghost-button" type="button" data-action="copy-invite">Copy</button>
          </div>
        </label>
        <div class="badges">
          ${badge("Invite code required", "green")}
          ${badge("Team tasks shared", "green")}
          ${badge("Private tasks hidden", "amber")}
          ${badge("Self check-ins private", "blue")}
        </div>
        <div class="notice quiet-notice">Mohit signs up with his own email, then joins with this invite code. The system does not add people because their name is Mohit.</div>
        <div class="divider"></div>
        <div class="actions team-actions">
          <button class="ghost-button" data-action="export">Export JSON</button>
          <label class="ghost-button" for="import-json">Import JSON</label>
          <input id="import-json" class="hidden" type="file" accept="application/json" />
        </div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Members</p>
            <h3>${members.length} teammate${members.length === 1 ? "" : "s"}</h3>
          </div>
        </div>
        <div class="stack">
          ${
            members.length
              ? members.map((member) => `
                  <article class="item">
                    <div class="item-header">
                      <div>
                        <h4>${escapeHtml(member.name)}</h4>
                        <p class="task-meta">${escapeHtml(member.email || "No email")} · ${escapeHtml(member.role)}</p>
                      </div>
                      ${badge(member.id === session.uid ? "You" : "Team", member.id === session.uid ? "green" : "blue")}
                    </div>
                  </article>
                `).join("")
              : `<div class="empty">No members loaded.</div>`
          }
        </div>
      </section>
    </div>
  `;
}

function renderTour() {
  const step = tourSteps[tourStep] || tourSteps[0];
  const isLast = tourStep === tourSteps.length - 1;
  return `
    <div class="tour-backdrop" aria-live="polite">
      <div class="tour-highlight"></div>
      <div class="tour-cursor" aria-hidden="true"></div>
      <section class="tour-popover" role="dialog" aria-label="Gensync OS tour">
        <button class="icon-button tour-close" type="button" data-action="close-tour" aria-label="Close tour">x</button>
        <p class="eyebrow">Product Tour</p>
        <h3>${escapeHtml(step.title)}</h3>
        <p>${escapeHtml(step.body)}</p>
        <div class="tour-footer">
          <span>${tourStep + 1} of ${tourSteps.length}</span>
          <div class="tour-controls">
            <button class="ghost-button compact-button" type="button" data-action="tour-prev" ${tourStep === 0 ? "disabled" : ""}>Back</button>
            <button class="primary-button compact-button" type="button" data-action="tour-next">${isLast ? "Done" : "Next"}</button>
          </div>
        </div>
      </section>
    </div>
  `;
}

function renderCelebration() {
  if (!celebrationState) return "";
  return `
    <div class="celebration-toast" role="status">
      <span class="celebration-mark">✓</span>
      <div>
        <strong>Shipped</strong>
        <span>${escapeHtml(celebrationState.title)}</span>
      </div>
    </div>
  `;
}

function triggerTaskCelebration(task) {
  if (!task) return;
  celebrationState = {
    taskId: task.id,
    title: task.title || "Task completed",
    at: Date.now(),
  };
  window.clearTimeout(celebrationTimer);
  celebrationTimer = window.setTimeout(() => {
    if (!celebrationState || celebrationState.taskId !== task.id) return;
    celebrationState = null;
    render();
  }, 2600);
  render();
}

function openTour() {
  tourStep = 0;
  setTourStep(0);
}

function closeTour(markDone = true) {
  tourOpen = false;
  if (markDone) localStorage.setItem(tourStorageKey(), "done");
  render();
}

function setTourStep(index) {
  tourStep = Math.max(0, Math.min(index, tourSteps.length - 1));
  const step = tourSteps[tourStep] || tourSteps[0];
  if (step.view && view !== step.view) view = step.view;
  tourOpen = true;
  render();
}

function positionTour() {
  if (!tourOpen) return;
  const step = tourSteps[tourStep] || tourSteps[0];
  const target = document.querySelector(step.selector) || document.querySelector(".main");
  const highlight = document.querySelector(".tour-highlight");
  const cursor = document.querySelector(".tour-cursor");
  const popover = document.querySelector(".tour-popover");
  if (!target || !highlight || !cursor || !popover) return;

  target.scrollIntoView({ block: "center", inline: "nearest", behavior: "smooth" });

  window.setTimeout(() => {
    const rect = target.getBoundingClientRect();
    const pad = 8;
    const left = Math.max(10, rect.left - pad);
    const top = Math.max(10, rect.top - pad);
    const width = Math.min(window.innerWidth - left - 10, rect.width + pad * 2);
    const height = Math.min(window.innerHeight - top - 10, rect.height + pad * 2);
    const targetCenterX = left + width / 2;
    const targetCenterY = top + height / 2;

    highlight.style.left = `${left}px`;
    highlight.style.top = `${top}px`;
    highlight.style.width = `${width}px`;
    highlight.style.height = `${height}px`;

    cursor.style.left = `${Math.min(window.innerWidth - 44, Math.max(16, left + width - 28))}px`;
    cursor.style.top = `${Math.min(window.innerHeight - 44, Math.max(16, top + height - 22))}px`;

    const popoverWidth = Math.min(340, window.innerWidth - 28);
    const popoverHeight = popover.offsetHeight || 210;
    const preferRight = left + width + 16 + popoverWidth < window.innerWidth;
    const preferLeft = left - 16 - popoverWidth > 0;
    const popoverLeft = preferRight
      ? left + width + 16
      : preferLeft
        ? left - popoverWidth - 16
        : Math.min(window.innerWidth - popoverWidth - 14, Math.max(14, targetCenterX - popoverWidth / 2));
    const popoverTop = preferRight || preferLeft
      ? Math.min(window.innerHeight - popoverHeight - 14, Math.max(14, targetCenterY - popoverHeight / 2))
      : Math.min(window.innerHeight - popoverHeight - 14, top + height + 14);

    popover.style.width = `${popoverWidth}px`;
    popover.style.left = `${popoverLeft}px`;
    popover.style.top = `${popoverTop}px`;
    popover.dataset.placement = preferRight ? "right" : preferLeft ? "left" : "bottom";
  }, 180);
}

function renderClientCard(client) {
  return `
    <article class="item client-card">
      <div class="item-header">
        <div>
          <h4>${escapeHtml(client.name)}</h4>
          <p class="client-meta">${escapeHtml(client.retainer)} · ${escapeHtml(client.owner)}</p>
        </div>
        ${badge(client.status, "green")}
      </div>
      <div class="progress"><span style="width: ${Number(client.health || 0)}%"></span></div>
      <p class="muted"><strong>Next:</strong> ${escapeHtml(client.next)}</p>
      <p class="muted" style="margin-top: 8px;"><strong>Proof:</strong> ${escapeHtml(client.proof)}</p>
    </article>
  `;
}

function renderTask(task) {
  if (editingTaskId === task.id) return renderTaskEditForm(task);
  const isDone = task.status === "Done";
  const isCelebrating = celebrationState?.taskId === task.id;

  return `
    <article class="item task-item ${isDone ? "done-item" : ""} ${isCelebrating ? "task-celebrating" : ""}">
      ${isCelebrating ? renderTaskBurst() : ""}
      <div class="item-header">
        <div>
          <h4>${escapeHtml(task.title)}</h4>
          <p class="task-meta">${escapeHtml(task.client)} · ${escapeHtml(task.owner)} · ${escapeHtml(task.due || "")}</p>
        </div>
        <div class="item-actions">
          <select class="status-select" data-task-status="${task.id}">
            ${stateOptions.map((status) => `<option ${task.status === status ? "selected" : ""}>${status}</option>`).join("")}
          </select>
          <button class="ghost-button compact-button" type="button" data-task-edit="${task.id}">Edit</button>
          <button class="ghost-button compact-button danger-button" type="button" data-task-delete="${task.id}">Delete</button>
        </div>
      </div>
      <p class="muted" style="margin-top: 8px;">${escapeHtml(task.notes)}</p>
      <div class="badges">
        ${badge(task.priority, priorityTone(task.priority))}
        ${badge(task.review, "amber")}
        ${badge((task.visibility || "team") === "private" ? "Private" : "Team", (task.visibility || "team") === "private" ? "red" : "blue")}
      </div>
    </article>
  `;
}

function renderCompletedTaskGroups(tasks) {
  if (!tasks.length) return `<div class="empty">No completed tasks in this filter.</div>`;
  const groups = groupTasksByClient(tasks);
  return `
    <div class="completed-groups">
      ${groups.map(renderCompletedTaskGroup).join("")}
    </div>
  `;
}

function groupTasksByClient(tasks) {
  const groups = new Map();
  tasks.forEach((task) => {
    const key = task.client || "Gensync";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(task);
  });

  return Array.from(groups.entries())
    .map(([client, items]) => ({
      client,
      tasks: sortTasksForExecution(items),
    }))
    .sort((left, right) => right.tasks.length - left.tasks.length || left.client.localeCompare(right.client));
}

function renderCompletedTaskGroup(group) {
  return `
    <details class="completed-group">
      <summary>
        <span>
          <strong>${escapeHtml(group.client)}</strong>
          <small>${group.tasks.length} completed item${group.tasks.length === 1 ? "" : "s"}</small>
        </span>
        ${badge("Archived", "green")}
      </summary>
      <div class="stack completed-task-stack">
        ${group.tasks.map(renderTask).join("")}
      </div>
    </details>
  `;
}

function renderTaskBurst() {
  return `
    <div class="task-burst" aria-hidden="true">
      ${Array.from({ length: 8 }, (_, index) => `<span style="--i:${index}"></span>`).join("")}
    </div>
  `;
}

function renderTaskEditForm(task) {
  return `
    <article class="item edit-item">
      <div class="item-header">
        <div>
          <p class="eyebrow">Edit Task</p>
          <h4>${escapeHtml(task.title)}</h4>
        </div>
        <button class="ghost-button compact-button" type="button" data-task-cancel-edit>Cancel</button>
      </div>
      <form class="form task-edit-form" data-task-edit-form="${task.id}">
        <label>Title <input name="title" value="${escapeAttr(task.title)}" required /></label>
        <div class="form-row">
          <label>Client <input name="client" value="${escapeAttr(task.client || "Gensync")}" /></label>
          <label>Due <input name="due" value="${escapeAttr(task.due || "Open")}" /></label>
        </div>
        <div>
          <p class="field-label">Owners</p>
          ${renderOwnerCheckboxes(parseOwners(task.owner))}
        </div>
        <div class="form-row">
          <label>Priority <select name="priority">${["P0", "P1", "P2"].map((priority) => `<option ${task.priority === priority ? "selected" : ""}>${priority}</option>`).join("")}</select></label>
          <label>Status <select name="status">${stateOptions.map((status) => `<option ${task.status === status ? "selected" : ""}>${status}</option>`).join("")}</select></label>
        </div>
        <label>Visibility <select name="visibility">
          <option value="team" ${(task.visibility || "team") === "team" ? "selected" : ""}>Team-visible</option>
          <option value="private" ${(task.visibility || "team") === "private" ? "selected" : ""}>Private to me</option>
        </select></label>
        <label>Approval type <input name="review" value="${escapeAttr(task.review || "Internal")}" /></label>
        <label>Notes <textarea name="notes">${escapeHtml(task.notes || "")}</textarea></label>
        <div class="form-actions">
          <button class="primary-button" type="submit">Save changes</button>
          <button class="ghost-button" type="button" data-task-cancel-edit>Cancel</button>
        </div>
      </form>
    </article>
  `;
}

function renderOwnerCheckboxes(selectedOwners = []) {
  const selected = normalizeOwners(selectedOwners);
  return `
    <div class="owner-grid">
      ${getOwnerOptions(selected)
        .map((owner) => `
          <label class="owner-pill">
            <input type="checkbox" name="owners" value="${escapeAttr(owner)}" ${selected.includes(owner) ? "checked" : ""} />
            <span>${escapeHtml(owner)}</span>
          </label>
        `)
        .join("")}
    </div>
  `;
}

function renderEvidenceItem(item) {
  return `
    <article class="item">
      <div class="item-header">
        <div>
          <h4>${escapeHtml(item.title)}</h4>
          <p class="evidence-meta">${escapeHtml(item.type)} · ${escapeHtml(item.confidence)}</p>
        </div>
        ${badge(item.confidence, item.confidence === "Verified" ? "green" : "amber")}
      </div>
      <p class="muted" style="margin-top: 8px;">${escapeHtml(item.note)}</p>
      <p class="task-meta" style="margin-top: 8px;">${escapeHtml(item.link)}</p>
    </article>
  `;
}

function renderTaskForm() {
  return `
    <form id="task-form" class="form">
      <label>Title <input name="title" required /></label>
      <div class="form-row">
        <label>Client <input name="client" value="Gensync" /></label>
        <label>Due <input name="due" value="Open" /></label>
      </div>
      <div>
        <p class="field-label">Owners</p>
        ${renderOwnerCheckboxes([defaultTaskOwner()])}
      </div>
      <div class="form-row">
        <label>Priority <select name="priority"><option>P0</option><option>P1</option><option>P2</option></select></label>
        <label>Status <select name="status">${stateOptions.map((status) => `<option>${status}</option>`).join("")}</select></label>
      </div>
      <label>Visibility <select name="visibility"><option value="team">Team-visible</option><option value="private">Private to me</option></select></label>
      <label>Approval type <input name="review" value="Internal" /></label>
      <label>Notes <textarea name="notes"></textarea></label>
      <button class="primary-button" type="submit">Add task</button>
    </form>
  `;
}

function getOwnerOptions(extraOwners = []) {
  const memberOwners = (workspace.members || [])
    .map((member) => ownerDisplayName(member.name || member.email))
    .filter(Boolean);
  return normalizeOwners(["Manish", "Mohit", "Codex", ...memberOwners, ...extraOwners]);
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

function defaultTaskOwner() {
  return ownerDisplayName(session?.user) || "Manish";
}

function parseOwners(value) {
  if (Array.isArray(value)) return normalizeOwners(value);
  return normalizeOwners(
    String(value || "")
      .split(/\s*(?:,|\+|&|\/)\s*/)
      .filter(Boolean),
  );
}

function normalizeOwners(owners) {
  const unique = [];
  owners
    .map(ownerDisplayName)
    .filter(Boolean)
    .forEach((owner) => {
      if (!unique.includes(owner)) unique.push(owner);
    });
  return unique;
}

function taskOwnersFromForm(form) {
  const owners = normalizeOwners(form.getAll("owners"));
  return owners.length ? owners.join(", ") : defaultTaskOwner();
}

function sortTasksForExecution(tasks) {
  return [...(tasks || [])]
    .map((task, index) => ({ task, index }))
    .sort((left, right) => compareTasks(left.task, right.task) || left.index - right.index)
    .map(({ task }) => task);
}

function compareTasks(a, b) {
  const aDone = a.status === "Done";
  const bDone = b.status === "Done";
  if (aDone !== bDone) return aDone ? 1 : -1;

  return priorityRank(a.priority) - priorityRank(b.priority)
    || dueRank(a.due) - dueRank(b.due)
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
  if (text.includes("after")) return 30;

  const parsed = Date.parse(text);
  if (Number.isFinite(parsed)) {
    const dayMs = 24 * 60 * 60 * 1000;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const target = new Date(parsed);
    const targetDay = new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime();
    return Math.max(-1, Math.round((targetDay - today) / dayMs));
  }

  return 20;
}

function renderLeadForm() {
  return `
    <form id="lead-form" class="form">
      <label>Company <input name="company" required /></label>
      <div class="form-row">
        <label>Stage ${renderLeadStageSelect("Research")}</label>
        <label>Value <input name="value" type="number" value="5000" /></label>
      </div>
      <label>Source <input name="source" placeholder="warm intro / proof gift / inbound" /></label>
      <label>Next <textarea name="next"></textarea></label>
      <button class="primary-button" type="submit">Add deal</button>
      <div class="notice quiet-notice">Use stage Collected only when money has actually landed. That feeds the north-star scoreboard.</div>
    </form>
  `;
}

function renderLeadStageSelect(current = "Research", attrs = "", name = "stage") {
  const currentValue = String(current || "Research");
  const options = leadStageOptions.includes(currentValue)
    ? leadStageOptions
    : [currentValue, ...leadStageOptions];
  const nameAttr = name ? `name="${escapeAttr(name)}"` : "";
  return `
    <select ${nameAttr} ${attrs}>
      ${options
        .map((stage) => `<option value="${escapeAttr(stage)}" ${stage === currentValue ? "selected" : ""}>${escapeHtml(stage)}</option>`)
        .join("")}
    </select>
  `;
}

function renderEvidenceForm() {
  return `
    <form id="evidence-form" class="form">
      <label>Title <input name="title" required /></label>
      <div class="form-row">
        <label>Type <input name="type" value="Local file" /></label>
        <label>Confidence <select name="confidence"><option>Verified</option><option>Reported</option><option>Inferred</option><option>Unknown</option></select></label>
      </div>
      <label>Link <input name="link" /></label>
      <label>Note <textarea name="note"></textarea></label>
      <button class="primary-button" type="submit">Add evidence</button>
    </form>
  `;
}

function renderContextForm(folder = null) {
  const project = folder?.kind === "project" ? folder.project : null;
  return `
    <form id="context-form" class="form">
      <input name="projectId" type="hidden" value="${escapeAttr(project?.id || "")}" />
      <input name="clientId" type="hidden" value="${escapeAttr(project?.clientId || "")}" />
      <label>Title <input name="title" required placeholder="Geodo contract / Mohit call transcript / GitHub repo" /></label>
      <div class="form-row">
        <label>Category <select name="category"><option>Google Doc</option><option>GitHub</option><option>PDF</option><option>Contract</option><option>Invoice</option><option>Transcript</option><option>Notes</option><option>Calendar</option><option>Other</option></select></label>
        <label>Visibility <select name="visibility"><option value="team">Team-visible</option><option value="private">Private to me</option></select></label>
      </div>
      <div class="form-row">
        <label>Confidence <select name="confidence"><option>Verified</option><option>Reported</option><option>Unverified</option><option>Inferred</option></select></label>
        <label>Text file <input name="file" type="file" accept=".txt,.md,.csv,.json,.srt,.vtt" /></label>
      </div>
      <label>Source URL <input name="sourceUrl" placeholder="Google Doc / GitHub / Drive / PDF / invoice link" /></label>
      <label>Summary <textarea name="summary" placeholder="What should the agent know before making decisions?"></textarea></label>
      <label>Pasted content <textarea name="content" placeholder="Paste meeting transcript, contract excerpt, invoice terms, brief, or notes."></textarea></label>
      <button class="primary-button" type="submit">Add context</button>
    </form>
  `;
}

function renderCalendarForm() {
  return `
    <form id="calendar-form" class="form">
      <div class="form-row">
        <label>Owner <select name="owner"><option>Manish</option><option>Mohit</option><option>Team</option></select></label>
        <label>Calendar email <input name="accountEmail" type="email" placeholder="name@gmail.com" required /></label>
      </div>
      <label>Google Calendar / scheduling link <input name="sourceUrl" placeholder="Optional public/share link until OAuth is connected" /></label>
      <label>Notes <textarea name="notes" placeholder="Working hours, focus blocks, meeting rules, no-overlap constraints."></textarea></label>
      <button class="primary-button" type="submit">Add calendar source</button>
      <div class="notice">Manual sources are useful for rules and constraints. The Connect Google button starts read-only OAuth so the agent can inspect availability without writing events.</div>
    </form>
  `;
}

function renderCheck(key, label) {
  return `
    <label class="check-row">
      <input type="checkbox" data-self-check="${key}" ${data.self[key] ? "checked" : ""} />
      <span>${escapeHtml(label)}</span>
    </label>
  `;
}

function metric(value, label, foot, options = {}) {
  const progress = Number(options.progress);
  const tourAttr = options.tourId ? ` data-tour="${escapeAttr(options.tourId)}"` : "";
  return `
    <article class="metric"${tourAttr}>
      <p class="metric-label">${escapeHtml(label)}</p>
      <p class="metric-value">${escapeHtml(String(value))}</p>
      <p class="muted">${escapeHtml(foot)}</p>
      ${Number.isFinite(progress) ? `<div class="metric-progress" aria-label="${escapeAttr(label)} progress"><span style="width: ${Math.max(0, Math.min(progress, 100))}%"></span></div>` : ""}
    </article>
  `;
}

function badge(text, tone) {
  return `<span class="badge ${tone || ""}">${escapeHtml(text || "")}</span>`;
}

function priorityTone(priority) {
  if (priority === "P0") return "red";
  if (priority === "P1") return "amber";
  return "blue";
}

function getRevenueSnapshot() {
  const leads = data.leads || [];
  const collectedFromDeals = leads
    .filter(isCollectedLead)
    .reduce((sum, lead) => sum + Number(lead.value || 0), 0);
  const committed = leads
    .filter((lead) => isCommittedLead(lead) && !isCollectedLead(lead))
    .reduce((sum, lead) => sum + Number(lead.value || 0), 0);
  const weighted = leads.reduce((sum, lead) => sum + Number(lead.value || 0) * stageWeight(lead.stage), 0);
  const collected = BASELINE_COLLECTED_USD + collectedFromDeals;
  const target = TARGET_COLLECTED_USD;
  const remaining = Math.max(target - collected, 0);
  const progress = Math.min(100, Math.round((collected / target) * 100));

  return {
    collected,
    committed,
    weighted,
    target,
    remaining,
    progress,
  };
}

function isCollectedLead(lead) {
  const normalized = String(lead?.stage || "").toLowerCase();
  return ["collected", "paid", "received"].some((word) => normalized.includes(word));
}

function isCommittedLead(lead) {
  const normalized = String(lead?.stage || "").toLowerCase();
  return ["closed", "won", "signed", "committed"].some((word) => normalized.includes(word));
}

function stageWeight(stage) {
  const normalized = String(stage || "").toLowerCase();
  if (normalized.includes("collected") || normalized.includes("paid") || normalized.includes("received")) return 1;
  if (normalized.includes("closed") || normalized.includes("won") || normalized.includes("signed")) return 0.9;
  if (normalized.includes("call")) return 0.75;
  if (normalized.includes("reply")) return 0.55;
  if (normalized.includes("sent")) return 0.35;
  if (normalized.includes("build")) return 0.25;
  if (normalized.includes("research")) return 0.1;
  return 0.05;
}

function formatMoney(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

function formatCompactMoney(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: Number(amount || 0) < 10000 ? 1 : 0,
  }).format(amount || 0);
}

function formatPlanTime(value) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function formatPlanDateTime(value) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function minutesBetweenIso(start, end) {
  const from = Date.parse(start);
  const to = Date.parse(end);
  if (!Number.isFinite(from) || !Number.isFinite(to)) return 0;
  return Math.max(0, Math.round((to - from) / 60000));
}

function bindGlobalEvents() {
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => {
      saveCurrentChatDraft();
      if (button.dataset.workShortcut) workView = button.dataset.workShortcut;
      if (button.dataset.pipelineShortcut) pipelineView = button.dataset.pipelineShortcut;
      view = button.dataset.view;
      persistChatUiState();
      render();
    });
  });

  const logoutButton = document.querySelector('[data-action="logout"]');
  if (logoutButton) logoutButton.addEventListener("click", async () => {
    if (supabaseClient) {
      await supabaseClient.auth.signOut();
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
    session = null;
    activeTeamId = null;
    needsWorkspace = false;
    workspaceError = "";
    workspace = { team: null, role: "", members: [] };
    data = supabaseClient ? clone(seedData) : loadData();
    render();
  });

  const exportButton = document.querySelector('[data-action="export"]');
  if (exportButton) exportButton.addEventListener("click", exportJson);
  const importInput = document.getElementById("import-json");
  if (importInput) importInput.addEventListener("change", importJson);

  const syncButton = document.querySelector('[data-action="sync-cloud"]');
  if (syncButton) {
    syncButton.addEventListener("click", () => refreshCloudData("manual"));
  }

  document.querySelectorAll('[data-action="open-tour"]').forEach((button) => {
    button.addEventListener("click", () => {
      openTour();
    });
  });

  document.querySelectorAll('[data-action="close-tour"]').forEach((button) => {
    button.addEventListener("click", () => {
      closeTour();
    });
  });

  document.querySelectorAll('[data-action="tour-prev"]').forEach((button) => {
    button.addEventListener("click", () => setTourStep(tourStep - 1));
  });

  document.querySelectorAll('[data-action="tour-next"]').forEach((button) => {
    button.addEventListener("click", () => {
      if (tourStep >= tourSteps.length - 1) {
        closeTour();
        return;
      }
      setTourStep(tourStep + 1);
    });
  });

  const copyInvite = document.querySelector('[data-action="copy-invite"]');
  if (copyInvite) {
    copyInvite.addEventListener("click", async () => {
      const code = workspace.team?.join_code || "";
      if (!code) return;
      try {
        await navigator.clipboard.writeText(code);
        copyInvite.textContent = "Copied";
      } catch {
        alert(`Invite code: ${code}`);
      }
    });
  }
}

function bindViewEvents() {
  const dayPlanForm = document.getElementById("day-plan-form");
  if (dayPlanForm) {
    dayPlanForm.addEventListener("submit", submitDayPlan);
    dayPlanForm.querySelectorAll('input[name="dayStart"], input[name="dayEnd"], select[name="protectedAvailabilityMinutes"]').forEach((input) => {
      input.addEventListener("change", () => {
        const form = new FormData(dayPlanForm);
        dayState = {
          ...dayState,
          rhythm: "custom",
          dayStart: String(form.get("dayStart") || dayState.dayStart),
          dayEnd: String(form.get("dayEnd") || dayState.dayEnd),
          protectedAvailabilityMinutes: Number(form.get("protectedAvailabilityMinutes") || dayState.protectedAvailabilityMinutes),
          plan: null,
        };
        saveDayRhythm();
        render();
      });
    });
  }

  document.querySelectorAll("[data-work-view]").forEach((button) => {
    button.addEventListener("click", () => {
      workView = button.dataset.workView;
      if (workView === "completed") taskView = "completed";
      if (workView === "board" && taskView === "completed") taskView = "active";
      editingTaskId = "";
      render();
    });
  });

  document.querySelectorAll("[data-pipeline-view]").forEach((button) => {
    button.addEventListener("click", () => {
      pipelineView = button.dataset.pipelineView;
      render();
    });
  });

  document.querySelectorAll("[data-context-folder]").forEach((button) => {
    button.addEventListener("click", () => {
      contextFolderId = button.dataset.contextFolder;
      render();
    });
  });

  document.querySelectorAll("[data-open-context-folder]").forEach((button) => {
    button.addEventListener("click", () => {
      contextFolderId = button.dataset.openContextFolder || getCurrentProjectId();
      view = "context";
      render();
    });
  });

  document.querySelectorAll("[data-day-rhythm]").forEach((button) => {
    button.addEventListener("click", () => {
      const rhythm = dayRhythms.find((item) => item.id === button.dataset.dayRhythm);
      if (!rhythm) return;
      dayState = {
        ...dayState,
        rhythm: rhythm.id,
        dayStart: rhythm.start,
        dayEnd: rhythm.end,
        protectedAvailabilityMinutes: rhythm.protectedAvailabilityMinutes,
        error: "",
        plan: null,
      };
      saveDayRhythm();
      render();
    });
  });

  const lateStartButton = document.querySelector('[data-action="late-start-now"]');
  if (lateStartButton) {
    lateStartButton.addEventListener("click", () => {
      dayState = {
        ...dayState,
        rhythm: "custom",
        date: getTodayKey(),
        dayStart: clockFromDate(roundDateUp(new Date(Date.now() + 10 * 60 * 1000), 15)),
        error: "",
        plan: null,
      };
      saveDayRhythm();
      render();
    });
  }

  document.querySelectorAll("[data-day-add]").forEach((button) => {
    button.addEventListener("click", async () => {
      if (button.dataset.dayAdd === "blocks") await addDayBlocksToBoard();
      if (button.dataset.dayAdd === "reminders") await addDayRemindersToBoard();
    });
  });

  document.querySelectorAll("[data-day-add-block]").forEach((button) => {
    button.addEventListener("click", async () => {
      const block = dayState.plan?.scheduledBlocks?.find((item) => item.id === button.dataset.dayAddBlock);
      if (!block) return;
      if (!confirm(`Add this time block to the board?\n\n${block.title}`)) return;
      await saveTask(dayBlockToTask(block));
    });
  });

  document.querySelectorAll("[data-day-add-reminder]").forEach((button) => {
    button.addEventListener("click", async () => {
      const reminder = dayState.plan?.reminders?.find((item) => item.id === button.dataset.dayAddReminder);
      if (!reminder) return;
      if (!confirm(`Add this reminder to the board?\n\n${reminder.title}`)) return;
      await saveTask(dayReminderToTask(reminder));
    });
  });

  document.querySelectorAll("[data-task-view]").forEach((button) => {
    button.addEventListener("click", () => {
      taskView = button.dataset.taskView;
      filter = "all";
      editingTaskId = "";
      render();
    });
  });

  document.querySelectorAll("[data-task-view-select]").forEach((select) => {
    select.addEventListener("change", () => {
      taskView = select.value;
      filter = "all";
      editingTaskId = "";
      render();
    });
  });

  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      filter = button.dataset.filter;
      render();
    });
  });

  document.querySelectorAll("[data-filter-select]").forEach((select) => {
    select.addEventListener("change", () => {
      filter = select.value;
      render();
    });
  });

  document.querySelectorAll("[data-owner-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      ownerFilter = button.dataset.ownerFilter;
      render();
    });
  });

  document.querySelectorAll("[data-owner-filter-select]").forEach((select) => {
    select.addEventListener("change", () => {
      ownerFilter = select.value;
      render();
    });
  });

  document.querySelectorAll("[data-scope-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      scopeFilter = button.dataset.scopeFilter;
      render();
    });
  });

  document.querySelectorAll("[data-scope-filter-select]").forEach((select) => {
    select.addEventListener("change", () => {
      scopeFilter = select.value;
      render();
    });
  });

  document.querySelectorAll("[data-task-status]").forEach((select) => {
    select.addEventListener("change", async () => {
      const task = data.tasks.find((item) => item.id === select.dataset.taskStatus);
      if (!task) return;
      const previousStatus = task.status;
      const nextStatus = select.value;
      const shouldCelebrate = previousStatus !== "Done" && nextStatus === "Done";
      task.status = nextStatus;

      if (supabaseClient) {
        let saved = false;
        await writeCloud(async () => {
          const result = await supabaseClient
            .from("tasks")
            .update({ status: nextStatus, updated_at: new Date().toISOString() })
            .eq("id", task.id)
            .eq("team_id", activeTeamId);
          if (result.error) throw result.error;
          saved = true;
        });
        if (saved && shouldCelebrate) triggerTaskCelebration(task);
        return;
      }

      saveData();
      render();
      if (shouldCelebrate) triggerTaskCelebration(task);
    });
  });

  document.querySelectorAll("[data-task-edit]").forEach((button) => {
    button.addEventListener("click", () => {
      editingTaskId = button.dataset.taskEdit;
      render();
    });
  });

  document.querySelectorAll("[data-task-cancel-edit]").forEach((button) => {
    button.addEventListener("click", () => {
      editingTaskId = "";
      render();
    });
  });

  document.querySelectorAll("[data-task-edit-form]").forEach((formElement) => {
    formElement.addEventListener("submit", async (event) => {
      event.preventDefault();
      const task = data.tasks.find((item) => item.id === formElement.dataset.taskEditForm);
      if (!task) return;
      const form = new FormData(formElement);
      await updateTask({
        ...task,
        title: String(form.get("title")),
        client: String(form.get("client") || "Gensync"),
        owner: taskOwnersFromForm(form),
        visibility: String(form.get("visibility") || "team"),
        priority: String(form.get("priority") || "P1"),
        status: String(form.get("status") || "Next"),
        due: String(form.get("due") || "Open"),
        review: String(form.get("review") || "Internal"),
        notes: String(form.get("notes") || ""),
      });
    });
  });

  document.querySelectorAll("[data-task-delete]").forEach((button) => {
    button.addEventListener("click", async () => {
      const task = data.tasks.find((item) => item.id === button.dataset.taskDelete);
      if (!task) return;
      if (!confirm(`Delete task: ${task.title}?`)) return;

      if (supabaseClient) {
        await writeCloud(async () => {
          const result = await supabaseClient
            .from("tasks")
            .delete()
            .eq("id", task.id)
            .eq("team_id", activeTeamId);
          if (result.error) throw result.error;
        });
        return;
      }

      data.tasks = data.tasks.filter((item) => item.id !== task.id);
      saveData();
      render();
    });
  });

  document.querySelectorAll("[data-self-check]").forEach((input) => {
    input.addEventListener("change", async () => {
      data.self[input.dataset.selfCheck] = input.checked;

      if (supabaseClient) {
        await writeCloud(insertSelfCheckin);
        return;
      }

      saveData();
      render();
    });
  });

  const taskForm = document.getElementById("task-form");
  if (taskForm) {
    taskForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const form = new FormData(taskForm);
      const task = {
        id: createId(),
        title: String(form.get("title")),
        client: String(form.get("client")),
        owner: taskOwnersFromForm(form),
        ownerUserId: session.uid || null,
        visibility: String(form.get("visibility") || "team"),
        priority: String(form.get("priority")),
        status: String(form.get("status")),
        due: String(form.get("due") || "Open"),
        review: String(form.get("review")),
        notes: String(form.get("notes")),
      };

      await saveTask(task);
    });
  }

  const chatForm = document.getElementById("chat-form");
  if (chatForm) {
    chatForm.addEventListener("submit", submitChatForm);
  }

  const chatPrompt = document.querySelector(".agent-prompt");
  if (chatPrompt) {
    chatPrompt.addEventListener("input", () => {
      agentState.prompt = chatPrompt.value;
      scheduleChatDraftSave();
    });
  }

  const chatThreadSelect = document.querySelector("[data-chat-thread-select]");
  if (chatThreadSelect) {
    chatThreadSelect.addEventListener("change", () => {
      switchChatThread(chatThreadSelect.value);
    });
  }

  const chatAudience = document.querySelector("[data-chat-audience]");
  if (chatAudience) {
    chatAudience.addEventListener("change", () => {
      setChatAudience(chatAudience.value);
    });
  }

  document.querySelectorAll("[data-chat-thread]").forEach((button) => {
    button.addEventListener("click", () => {
      switchChatThread(button.dataset.chatThread);
    });
  });

  document.querySelectorAll('[data-action="new-chat"]').forEach((button) => {
    button.addEventListener("click", () => {
      switchChatThread("");
    });
  });

  const chatProject = document.querySelector("[data-chat-project]");
  if (chatProject) {
    chatProject.addEventListener("change", () => {
      saveCurrentChatDraft();
      const activeMessages = getActiveThreadMessages();
      agentState = {
        ...agentState,
        projectId: chatProject.value,
        activeThreadId: activeMessages.length ? "" : agentState.activeThreadId,
        visibility: activeMessages.length ? CHAT_DEFAULT_VISIBILITY : getCurrentChatVisibility(),
        threadKind: activeMessages.length ? "private" : getCurrentThreadKind(),
        recipientUserId: activeMessages.length ? "" : getCurrentRecipientUserId(),
        prompt: "",
        attachments: [],
        error: "",
      };
      restoreDraftForCurrentChat();
      persistChatUiState();
      render();
    });
  }

  const agentForm = document.getElementById("agent-form");
  if (agentForm) {
    agentForm.addEventListener("submit", submitAgentForm);
  }

  const voiceButton = document.querySelector('[data-action="voice-note"]');
  if (voiceButton) {
    voiceButton.addEventListener("click", toggleVoiceNote);
  }

  const agentFiles = document.getElementById("agent-files");
  if (agentFiles) {
    agentFiles.addEventListener("change", async (event) => {
      const textarea = document.querySelector(".agent-prompt");
      agentState.prompt = textarea?.value || agentState.prompt;
      try {
        const nextAttachments = await readAgentAttachments(Array.from(event.target.files || []));
        agentState.attachments = [...(agentState.attachments || []), ...nextAttachments].slice(0, MAX_AGENT_ATTACHMENTS);
        agentState.error = "";
      } catch (error) {
        agentState.error = error.message || "Could not attach file.";
      }
      saveCurrentChatDraft({ includeTextarea: false });
      render();
    });
  }

  document.querySelectorAll("[data-remove-attachment]").forEach((button) => {
    button.addEventListener("click", () => {
      const textarea = document.querySelector(".agent-prompt");
      agentState.prompt = textarea?.value || agentState.prompt;
      agentState.attachments = (agentState.attachments || []).filter((_, index) => index !== Number(button.dataset.removeAttachment));
      saveCurrentChatDraft({ includeTextarea: false });
      render();
    });
  });

  document.querySelectorAll("[data-agent-task]").forEach((button) => {
    button.addEventListener("click", async () => {
      const task = agentState.result?.suggestedTasks?.[Number(button.dataset.agentTask)];
      if (!task) return;
      if (!confirm(`Add this task to the shared board?\n\n${task.title}`)) return;
      const extraNotes = [
        task.notes || "",
        task.blockedBy ? `Blocked by: ${task.blockedBy}` : "",
        task.evidenceRefs?.length ? `Context refs: ${task.evidenceRefs.join(", ")}` : "",
      ].filter(Boolean).join("\n");
      await saveTask({
        id: createId(),
        title: task.title,
        client: task.client,
        owner: task.owner,
        ownerUserId: session.uid || null,
        visibility: task.visibility || "team",
        priority: task.priority || "P1",
        status: "Next",
        due: "Open",
        review: task.review || "Internal",
        notes: extraNotes,
      });
    });
  });

  document.querySelectorAll("[data-agent-reminder]").forEach((button) => {
    button.addEventListener("click", async () => {
      const reminder = agentState.result?.suggestedReminders?.[Number(button.dataset.agentReminder)];
      if (!reminder) return;
      if (!confirm(`Add this reminder to the board?\n\n${reminder.title}`)) return;
      await saveTask({
        id: createId(),
        title: reminder.title,
        client: reminder.client || "Gensync",
        owner: reminder.owner || "Manish",
        ownerUserId: session.uid || null,
        visibility: reminder.visibility || "team",
        priority: reminder.priority || "P1",
        status: "Next",
        due: reminder.due || "Open",
        review: "Reminder",
        notes: reminder.notes || "",
      });
    });
  });

  document.querySelectorAll("[data-agent-context]").forEach((button) => {
    button.addEventListener("click", async () => {
      const item = agentState.result?.suggestedContexts?.[Number(button.dataset.agentContext)];
      if (!item) return;
      if (!confirm(`Add this to the context vault?\n\n${item.title}`)) return;
      await saveContextItem({
        id: createId(),
        title: item.title,
        category: item.category || "Notes",
        visibility: item.visibility || "team",
        confidence: item.confidence || "Unverified",
        sourceUrl: item.sourceUrl || "",
        summary: item.summary || "",
        content: item.content || "",
        ownerUserId: session.uid || null,
      });
    });
  });

  document.querySelectorAll("[data-chat-task]").forEach((button) => {
    button.addEventListener("click", async () => {
      const task = getChatSuggestion(button.dataset.chatTask, "suggestedTasks");
      if (!task) return;
      if (!confirm(`Add this task to the shared board?\n\n${task.title}`)) return;
      const extraNotes = [
        task.notes || "",
        task.blockedBy ? `Blocked by: ${task.blockedBy}` : "",
        task.evidenceRefs?.length ? `Context refs: ${task.evidenceRefs.join(", ")}` : "",
      ].filter(Boolean).join("\n");
      await saveTask({
        id: createId(),
        title: task.title,
        client: task.client,
        owner: task.owner,
        ownerUserId: session.uid || null,
        visibility: task.visibility || "team",
        priority: task.priority || "P1",
        status: "Next",
        due: "Open",
        review: task.review || "Internal",
        notes: extraNotes,
      });
    });
  });

  document.querySelectorAll("[data-chat-reminder]").forEach((button) => {
    button.addEventListener("click", async () => {
      const reminder = getChatSuggestion(button.dataset.chatReminder, "suggestedReminders");
      if (!reminder) return;
      if (!confirm(`Add this reminder to the board?\n\n${reminder.title}`)) return;
      await saveTask({
        id: createId(),
        title: reminder.title,
        client: reminder.client || "Gensync",
        owner: reminder.owner || "Manish",
        ownerUserId: session.uid || null,
        visibility: reminder.visibility || "team",
        priority: reminder.priority || "P1",
        status: "Next",
        due: reminder.due || "Open",
        review: "Reminder",
        notes: reminder.notes || "",
      });
    });
  });

  document.querySelectorAll("[data-chat-context]").forEach((button) => {
    button.addEventListener("click", async () => {
      const item = getChatSuggestion(button.dataset.chatContext, "suggestedContexts");
      if (!item) return;
      if (!confirm(`Add this to the project context folder?\n\n${item.title}`)) return;
      const project = getProjectById(getCurrentProjectId());
      await saveContextItem({
        id: createId(),
        title: item.title,
        category: item.category || "Notes",
        visibility: item.visibility || "team",
        confidence: item.confidence || "Unverified",
        sourceUrl: item.sourceUrl || "",
        summary: item.summary || "",
        content: item.content || "",
        ownerUserId: session.uid || null,
        projectId: project?.id || null,
        clientId: project?.clientId || null,
      });
    });
  });

  const projectContextForm = document.getElementById("project-context-form");
  if (projectContextForm) {
    projectContextForm.addEventListener("submit", submitProjectContextForm);
  }

  const leadForm = document.getElementById("lead-form");
  if (leadForm) {
    leadForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const form = new FormData(leadForm);
      const lead = {
        id: createId(),
        company: String(form.get("company")),
        stage: String(form.get("stage")),
        value: Number(form.get("value")),
        owner: session.user,
        next: String(form.get("next")),
        source: String(form.get("source")),
      };

      if (supabaseClient) {
        await writeCloud(async () => {
          const result = await supabaseClient.from("leads").insert(toCloudLead(lead));
          if (result.error) throw result.error;
        });
        return;
      }

      data.leads.unshift(lead);
      saveData();
      render();
    });
  }

  document.querySelectorAll("[data-lead-stage]").forEach((select) => {
    select.addEventListener("change", async () => {
      await updateLeadStage(select.dataset.leadStage, select.value);
    });
  });

  document.querySelectorAll("[data-lead-collected]").forEach((button) => {
    button.addEventListener("click", async () => {
      const lead = data.leads.find((item) => item.id === button.dataset.leadCollected);
      if (!lead) return;
      if (!confirm(`Mark this as collected revenue?\n\n${lead.company} · ${formatMoney(lead.value)}`)) return;
      await updateLeadStage(lead.id, "Collected");
    });
  });

  const contextForm = document.getElementById("context-form");
  if (contextForm) {
    contextForm.addEventListener("submit", submitContextForm);
  }

  const calendarForm = document.getElementById("calendar-form");
  if (calendarForm) {
    calendarForm.addEventListener("submit", submitCalendarForm);
  }

  document.querySelectorAll('[data-action="connect-google-calendar"]').forEach((button) => {
    button.addEventListener("click", connectGoogleCalendar);
  });

  const evidenceForm = document.getElementById("evidence-form");
  if (evidenceForm) {
    evidenceForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const form = new FormData(evidenceForm);
      const item = {
        id: createId(),
        title: String(form.get("title")),
        type: String(form.get("type")),
        confidence: String(form.get("confidence")),
        link: String(form.get("link")),
        note: String(form.get("note")),
      };

      if (supabaseClient) {
        await writeCloud(async () => {
          const result = await supabaseClient.from("evidence").insert(toCloudEvidence(item));
          if (result.error) throw result.error;
        });
        return;
      }

      data.evidence.unshift(item);
      saveData();
      render();
    });
  }

  const selfForm = document.getElementById("self-form");
  if (selfForm) {
    selfForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const form = new FormData(selfForm);
      data.self.sleep = String(form.get("sleep"));
      data.self.energy = String(form.get("energy"));
      data.self.mood = String(form.get("mood"));
      data.self.why = String(form.get("why"));
      data.self.nextSmallWin = String(form.get("nextSmallWin"));

      if (supabaseClient) {
        await writeCloud(insertSelfCheckin);
        return;
      }

      saveData();
      render();
    });
  }
}

async function saveTask(task) {
  const duplicate = data.tasks.some((item) =>
    item.status !== "Done"
    && item.title.trim().toLowerCase() === task.title.trim().toLowerCase()
    && parseOwners(item.owner).join(", ") === parseOwners(task.owner).join(", ")
  );
  if (duplicate && !confirm("A similar open task already exists for this owner. Add anyway?")) {
    return;
  }

  task.owner = parseOwners(task.owner).join(", ") || defaultTaskOwner();

  if (supabaseClient) {
    await writeCloud(async () => {
      const result = await supabaseClient.from("tasks").insert(toCloudTask(task, cloudClientIdByName()));
      if (result.error) throw result.error;
    });
    return;
  }

  data.tasks.unshift(task);
  saveData();
  render();
}

async function updateTask(task) {
  const previousTask = data.tasks.find((item) => item.id === task.id);
  const nextTask = {
    ...task,
    owner: parseOwners(task.owner).join(", ") || defaultTaskOwner(),
  };
  const shouldCelebrate = previousTask?.status !== "Done" && nextTask.status === "Done";

  if (supabaseClient) {
    let saved = false;
    await writeCloud(async () => {
      const payload = toCloudTask(nextTask, cloudClientIdByName());
      delete payload.team_id;
      const result = await supabaseClient
        .from("tasks")
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq("id", nextTask.id)
        .eq("team_id", activeTeamId);
      if (result.error) throw result.error;
      editingTaskId = "";
      saved = true;
    });
    if (saved && shouldCelebrate) triggerTaskCelebration(nextTask);
    return;
  }

  data.tasks = data.tasks.map((item) => (item.id === nextTask.id ? nextTask : item));
  editingTaskId = "";
  saveData();
  render();
  if (shouldCelebrate) triggerTaskCelebration(nextTask);
}

async function updateLeadStage(leadId, stage) {
  const lead = data.leads.find((item) => item.id === leadId);
  if (!lead) return;
  lead.stage = stage;

  if (supabaseClient) {
    await writeCloud(async () => {
      const result = await supabaseClient
        .from("leads")
        .update({ stage, updated_at: new Date().toISOString() })
        .eq("id", lead.id)
        .eq("team_id", activeTeamId);
      if (result.error) throw result.error;
    });
    return;
  }

  saveData();
  render();
}

async function saveContextItem(item) {
  if (supabaseClient) {
    await writeCloud(async () => {
      const result = await supabaseClient.from("context_items").insert(toCloudContext(item));
      if (result.error) throw result.error;
    });
    return;
  }

  data.contexts.unshift(item);
  saveData();
  render();
}

async function submitDayPlan(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  dayState = {
    ...dayState,
    date: String(form.get("date") || getTodayKey()),
    dayStart: String(form.get("dayStart") || dayState.dayStart || "12:00"),
    dayEnd: String(form.get("dayEnd") || dayState.dayEnd || "02:30"),
    protectedAvailabilityMinutes: Number(form.get("protectedAvailabilityMinutes") || 240),
    loading: true,
    error: "",
  };
  saveDayRhythm();
  render();

  try {
    if (!supabaseClient) {
      throw new Error("Day planning needs the deployed Supabase login and connected Google Calendar.");
    }

    const authSession = (await supabaseClient.auth.getSession()).data.session;
    if (!authSession?.access_token) {
      throw new Error("Your login expired. Sign in again.");
    }

    const response = await fetch("/api/day/plan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authSession.access_token}`,
      },
      body: JSON.stringify({
        date: dayState.date,
        dayStart: dayState.dayStart,
        dayEnd: dayState.dayEnd,
        protectedAvailabilityMinutes: dayState.protectedAvailabilityMinutes,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata",
      }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.error || "Could not plan the day.");
    }

    dayState = {
      ...dayState,
      loading: false,
      error: "",
      plan: payload,
    };
  } catch (error) {
    console.error(error);
    dayState = {
      ...dayState,
      loading: false,
      error: error.message || "Could not plan the day.",
    };
  }

  render();
}

async function addDayBlocksToBoard() {
  const blocks = dayState.plan?.scheduledBlocks || [];
  if (!blocks.length) return;
  if (!confirm(`Add ${blocks.length} time block${blocks.length === 1 ? "" : "s"} to the board?`)) return;
  await saveDayGeneratedTasks(blocks.map(dayBlockToTask));
}

async function addDayRemindersToBoard() {
  const reminders = dayState.plan?.reminders || [];
  if (!reminders.length) return;
  if (!confirm(`Add ${reminders.length} reminder${reminders.length === 1 ? "" : "s"} to the board?`)) return;
  await saveDayGeneratedTasks(reminders.map(dayReminderToTask));
}

async function saveDayGeneratedTasks(tasks) {
  const normalized = tasks.map((task) => ({
    ...task,
    owner: parseOwners(task.owner).join(", ") || defaultTaskOwner(),
  }));
  const duplicates = normalized.filter((task) =>
    data.tasks.some((item) =>
      item.status !== "Done"
      && item.title.trim().toLowerCase() === task.title.trim().toLowerCase()
      && parseOwners(item.owner).join(", ") === parseOwners(task.owner).join(", ")
    )
  );

  if (duplicates.length && !confirm(`${duplicates.length} similar open item${duplicates.length === 1 ? "" : "s"} already exist. Add anyway?`)) {
    return;
  }

  if (supabaseClient) {
    await writeCloud(async () => {
      const result = await supabaseClient.from("tasks").insert(normalized.map((task) => toCloudTask(task, cloudClientIdByName())));
      if (result.error) throw result.error;
    });
    return;
  }

  data.tasks.unshift(...normalized);
  saveData();
  render();
}

function dayBlockToTask(block) {
  const sourceTask = data.tasks.find((task) => task.id === block.taskId);
  return {
    id: createId(),
    title: block.type === "task" ? `Time block: ${block.title}` : block.title,
    client: sourceTask?.client || "Gensync",
    owner: sourceTask?.owner || defaultTaskOwner(),
    ownerUserId: session.uid || null,
    visibility: sourceTask?.visibility || "team",
    priority: block.priority || "P1",
    status: "Next",
    due: `Today ${formatPlanTime(block.start)}-${formatPlanTime(block.end)}`,
    review: block.reviewGate || "Time block",
    notes: [
      `Planned for ${dayState.plan?.date || dayState.date}.`,
      `Start: ${formatPlanDateTime(block.start)}`,
      `End: ${formatPlanDateTime(block.end)}`,
      `Protected booking time kept open: ${dayState.plan?.protectedAvailabilityActualMinutes || 0} minutes.`,
      block.taskId ? `Source task: ${block.taskId}` : "",
      block.notes || "",
    ].filter(Boolean).join("\n"),
  };
}

function dayReminderToTask(reminder) {
  return {
    id: createId(),
    title: `Reminder: ${reminder.title}`,
    client: "Gensync",
    owner: defaultTaskOwner(),
    ownerUserId: session.uid || null,
    visibility: "team",
    priority: "P1",
    status: "Next",
    due: `Today ${formatPlanTime(reminder.due)}`,
    review: "Reminder",
    notes: [
      `Reminder time: ${formatPlanDateTime(reminder.due)}`,
      reminder.notes || "",
    ].filter(Boolean).join("\n"),
  };
}

async function submitContextForm(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const file = form.get("file");
  const fileText = file && file.size ? await readTextFile(file) : "";
  const folder = getActiveContextFolder();
  const project = folder?.kind === "project" ? folder.project : null;
  const item = {
    id: createId(),
    title: String(form.get("title")),
    category: String(form.get("category")),
    visibility: String(form.get("visibility") || "team"),
    confidence: String(form.get("confidence") || "Unverified"),
    sourceUrl: String(form.get("sourceUrl") || ""),
    summary: String(form.get("summary") || ""),
    content: [String(form.get("content") || ""), fileText].filter(Boolean).join("\n\n"),
    ownerUserId: session.uid || null,
    projectId: String(form.get("projectId") || project?.id || "") || null,
    clientId: String(form.get("clientId") || project?.clientId || "") || null,
  };

  await saveContextItem(item);
}

async function submitCalendarForm(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const item = {
    id: createId(),
    owner: String(form.get("owner") || session.user),
    accountEmail: String(form.get("accountEmail") || ""),
    status: "needs_oauth",
    sourceUrl: String(form.get("sourceUrl") || ""),
    notes: String(form.get("notes") || ""),
    ownerUserId: session.uid || null,
  };

  if (supabaseClient) {
    await writeCloud(async () => {
      const result = await supabaseClient.from("calendar_sources").insert(toCloudCalendarSource(item));
      if (result.error) throw result.error;
    });
    return;
  }

  data.calendarSources.unshift(item);
  saveData();
  render();
}

async function connectGoogleCalendar() {
  calendarConnecting = true;
  calendarNotice = "";
  render();

  try {
    if (!supabaseClient) {
      throw new Error("Google Calendar connect needs the deployed Supabase login, not the local passcode mode.");
    }

    const result = await supabaseClient.auth.getSession();
    if (result.error) throw result.error;
    const authSession = result.data.session;
    if (!authSession?.access_token) {
      throw new Error("Sign in again before connecting Google Calendar.");
    }

    const response = await fetch("/api/google/oauth/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authSession.access_token}`,
      },
      body: JSON.stringify({ returnTo: `${window.location.pathname}?view=${view === "day" ? "day" : "context"}` }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || !payload.url) {
      const missing = Array.isArray(payload.missing) && payload.missing.length
        ? ` Missing: ${payload.missing.join(", ")}.`
        : "";
      throw new Error(`${payload.error || "Could not start Google Calendar OAuth."}${missing}`);
    }

    window.location.href = payload.url;
  } catch (error) {
    console.error(error);
    calendarConnecting = false;
    calendarNotice = error.message || "Could not connect Google Calendar.";
    view = "context";
    render();
  }
}

function readTextFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error || new Error("Could not read file."));
    reader.readAsText(file);
  });
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error || new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
}

async function readAgentAttachments(files) {
  if (!files.length) return [];
  const selected = files.slice(0, MAX_AGENT_ATTACHMENTS);
  const attachments = [];

  for (const file of selected) {
    if (file.size > MAX_AGENT_ATTACHMENT_BYTES) {
      throw new Error(`${file.name} is too large. Keep each intake file under ${formatBytes(MAX_AGENT_ATTACHMENT_BYTES)}.`);
    }

    const base = {
      id: createId(),
      name: file.name,
      type: file.type || "application/octet-stream",
      size: file.size,
    };

    if (file.type.startsWith("image/")) {
      attachments.push({
        ...base,
        kind: "image",
        dataUrl: await readFileAsDataUrl(file),
      });
      continue;
    }

    if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
      attachments.push({
        ...base,
        kind: "pdf",
        dataUrl: await readFileAsDataUrl(file),
      });
      continue;
    }

    if (isTextLikeFile(file)) {
      const text = await readTextFile(file);
      attachments.push({
        ...base,
        kind: "text",
        text: text.slice(0, 12000),
      });
      continue;
    }

    attachments.push({
      ...base,
      kind: "file",
      text: `Attached file metadata only: ${file.name}, ${file.type || "unknown type"}, ${formatBytes(file.size)}.`,
    });
  }

  return attachments;
}

function isTextLikeFile(file) {
  const name = file.name.toLowerCase();
  return file.type.startsWith("text/")
    || [".txt", ".md", ".csv", ".json", ".srt", ".vtt"].some((ext) => name.endsWith(ext));
}

function formatBytes(bytes) {
  const size = Number(bytes || 0);
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.round(size / 102.4) / 10} KB`;
  return `${Math.round(size / 1024 / 102.4) / 10} MB`;
}

function toggleVoiceNote() {
  if (voiceState.listening) {
    stopVoiceNote();
    return;
  }
  startVoiceNote();
}

function startVoiceNote() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const textarea = document.querySelector(".agent-prompt");
  if (!SpeechRecognition || !textarea) {
    voiceState = {
      listening: false,
      message: "Voice dictation is not supported in this browser. Use Chrome on Android/Desktop or iOS dictation keyboard.",
    };
    render();
    return;
  }

  window.clearTimeout(voiceRestartTimer);
  voiceManualStop = false;
  voiceTranscriptBase = textarea.value.trim();
  voiceFinalTranscript = "";
  agentState.prompt = textarea.value || agentState.prompt;
  voiceState = {
    listening: true,
    message: "Recording. Press Stop voice note when you are done.",
  };
  render();
  startSpeechRecognitionSession();
}

function startSpeechRecognitionSession() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition || !voiceState.listening) return;

  const recognition = new SpeechRecognition();
  voiceRecognition = recognition;
  recognition.lang = "en-IN";
  recognition.interimResults = true;
  recognition.continuous = true;

  recognition.onstart = () => {
    voiceState = {
      listening: true,
      message: "Recording. Press Stop voice note when you are done.",
    };
    updateVoiceButtonLabel();
  };

  recognition.onresult = (event) => {
    let interim = "";
    for (let index = event.resultIndex; index < event.results.length; index += 1) {
      const transcript = event.results[index][0].transcript;
      if (event.results[index].isFinal) voiceFinalTranscript = `${voiceFinalTranscript} ${transcript}`.trim();
      else interim += transcript;
    }

    const next = [voiceTranscriptBase, voiceFinalTranscript, interim.trim()]
      .filter(Boolean)
      .join("\n")
      .trim();
    const liveTextarea = document.querySelector(".agent-prompt");
    if (liveTextarea) liveTextarea.value = next;
    agentState.prompt = next;
    scheduleChatDraftSave();
  };

  recognition.onerror = (event) => {
    const recoverable = ["aborted", "network", "no-speech"].includes(event.error);
    if (voiceState.listening && recoverable) {
      voiceState = {
        listening: true,
        message: event.error === "no-speech"
          ? "Still recording. I did not catch speech yet."
          : "Recording paused briefly. Trying to resume.",
      };
      updateVoiceButtonLabel();
      return;
    }

    voiceManualStop = true;
    voiceState = { listening: false, message: `Voice failed: ${event.error || "unknown error"}` };
    render();
  };

  recognition.onend = () => {
    const liveTextarea = document.querySelector(".agent-prompt");
    agentState.prompt = liveTextarea?.value || agentState.prompt;

    if (voiceState.listening && !voiceManualStop) {
      window.clearTimeout(voiceRestartTimer);
      voiceRestartTimer = window.setTimeout(startSpeechRecognitionSession, 250);
      return;
    }

    voiceRecognition = null;
    voiceState = {
      listening: false,
      message: agentState.prompt ? "Voice note added." : "Voice stopped.",
    };
    saveCurrentChatDraft({ includeTextarea: false });
    render();
  };

  try {
    recognition.start();
  } catch (error) {
    console.error(error);
    voiceState = { listening: false, message: "Voice could not start. Check microphone permission and try again." };
    render();
  }
}

function stopVoiceNote() {
  voiceManualStop = true;
  window.clearTimeout(voiceRestartTimer);
  const liveTextarea = document.querySelector(".agent-prompt");
  agentState.prompt = liveTextarea?.value || agentState.prompt;
  voiceState = {
    listening: false,
    message: agentState.prompt ? "Voice note added." : "Voice stopped.",
  };
  saveCurrentChatDraft({ includeTextarea: false });

  try {
    voiceRecognition?.stop();
  } catch (error) {
    console.error(error);
  }

  voiceRecognition = null;
  render();
}

function updateVoiceButtonLabel() {
  const button = document.querySelector('[data-action="voice-note"]');
  if (button) {
    button.textContent = voiceState.listening ? "Stop voice note" : "Voice note";
    button.classList.toggle("recording-button", voiceState.listening);
  }
}

function getChatSuggestion(encoded, key) {
  const [messageId, indexText] = String(encoded || "").split(":");
  const message = data.chatMessages.find((item) => item.id === messageId);
  const list = message?.result?.[key];
  if (!Array.isArray(list)) return null;
  return list[Number(indexText)] || null;
}

async function submitProjectContextForm(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const project = getProjectById(String(form.get("projectId") || getCurrentProjectId()));
  await saveContextItem({
    id: createId(),
    title: String(form.get("title") || ""),
    category: "Notes",
    visibility: "team",
    confidence: "Reported",
    sourceUrl: String(form.get("sourceUrl") || ""),
    summary: String(form.get("summary") || ""),
    content: "",
    ownerUserId: session.uid || null,
    projectId: project?.id || null,
    clientId: project?.clientId || null,
  });
}

function createThreadTitle(prompt) {
  const cleaned = String(prompt || "")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) return "New chat";
  return cleaned.length > 56 ? `${cleaned.slice(0, 53)}...` : cleaned;
}

function compactStoredAttachments(attachments = []) {
  return attachments.map((attachment) => ({
    id: attachment.id || createId(),
    name: attachment.name || "attachment",
    type: attachment.type || "application/octet-stream",
    size: Number(attachment.size || 0),
    kind: attachment.kind || "file",
    text: attachment.kind === "text" || attachment.kind === "file" ? String(attachment.text || "").slice(0, 12000) : "",
  }));
}

async function ensureActiveChatThread(prompt) {
  const existing = getActiveThread();
  if (existing) return existing;

  const projectId = agentState.projectId || getDefaultProjectId();
  const now = new Date().toISOString();
  const draft = {
    id: createId(),
    projectId,
    createdBy: session?.uid || null,
    title: createThreadTitle(prompt),
    mode: agentState.mode || "operator",
    visibility: chatVisibilityFromKind(agentState.threadKind || agentState.visibility),
    threadKind: normalizeThreadKind(agentState.threadKind || agentState.visibility),
    recipientUserId: agentState.recipientUserId || "",
    status: "active",
    lastMessageAt: now,
    createdAt: now,
    updatedAt: now,
  };

  if (supabaseClient) {
    const result = await supabaseClient.from("chat_threads").insert(toCloudChatThread(draft)).select("*").single();
    if (result.error) throw result.error;
    const saved = fromCloudChatThread(result.data);
    data.chatThreads = [saved, ...data.chatThreads.filter((thread) => thread.id !== saved.id)];
    agentState.activeThreadId = saved.id;
    return saved;
  }

  data.chatThreads.unshift(draft);
  agentState.activeThreadId = draft.id;
  saveData();
  return draft;
}

async function saveChatMessage(message) {
  const draft = {
    id: createId(),
    createdAt: new Date().toISOString(),
    ...message,
  };

  if (supabaseClient) {
    const result = await supabaseClient.from("chat_messages").insert(toCloudChatMessage(draft)).select("*").single();
    if (result.error) throw result.error;
    const saved = fromCloudChatMessage(result.data);
    data.chatMessages = [...data.chatMessages.filter((item) => item.id !== saved.id), saved];
    return saved;
  }

  data.chatMessages.push(draft);
  saveData();
  return draft;
}

async function touchChatThread(threadId, updates = {}) {
  const now = new Date().toISOString();
  const current = data.chatThreads.find((thread) => thread.id === threadId);
  const next = {
    ...current,
    ...updates,
    lastMessageAt: updates.lastMessageAt || now,
    updatedAt: now,
  };
  data.chatThreads = data.chatThreads.map((thread) => (thread.id === threadId ? next : thread));

  if (supabaseClient) {
    const payload = {
      last_message_at: next.lastMessageAt,
      updated_at: now,
    };
    if (updates.title) payload.title = updates.title;
    if (updates.mode) payload.mode = updates.mode;
    if (updates.threadKind || updates.visibility) {
      payload.thread_kind = normalizeThreadKind(updates.threadKind || updates.visibility);
      payload.visibility = chatVisibilityFromKind(payload.thread_kind);
    }
    if (Object.prototype.hasOwnProperty.call(updates, "recipientUserId")) {
      payload.recipient_user_id = updates.recipientUserId || null;
    }
    if (updates.projectId) {
      const project = getProjectById(updates.projectId);
      payload.project_id = updates.projectId;
      payload.client_id = project?.clientId || null;
    }
    const result = await supabaseClient
      .from("chat_threads")
      .update(payload)
      .eq("id", threadId)
      .eq("team_id", activeTeamId);
    if (result.error) throw result.error;
    return;
  }

  saveData();
}

function fallbackAgentResult(raw) {
  return {
    answer: raw || "The model returned an unstructured response.",
    intent: "unstructured",
    confidence: "Needs review",
    assumptions: [],
    suggestedTasks: [],
    suggestedContexts: [],
    suggestedReminders: [],
    relevantContext: [],
    risks: ["Could not parse the model response as task JSON."],
    contextNeeded: [],
    nextQuestion: "",
  };
}

async function submitChatForm(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const prompt = String(form.get("prompt") || "").trim();
  const attachments = agentState.attachments || [];
  const draftKeyBeforeSubmit = getChatDraftKey();

  agentState = {
    ...agentState,
    mode: String(form.get("mode") || "operator"),
    projectId: String(form.get("projectId") || getCurrentProjectId()),
    threadKind: normalizeThreadKind(form.get("threadKind") || getCurrentThreadKind()),
    recipientUserId: String(form.get("recipientUserId") || getCurrentRecipientUserId()),
    visibility: chatVisibilityFromKind(form.get("threadKind") || getCurrentThreadKind()),
    prompt,
    attachments,
    loading: true,
    result: null,
    error: "",
  };

  if (!prompt && !attachments.length) {
    agentState.loading = false;
    agentState.error = "Message or attachment is required.";
    render();
    return;
  }

  if (agentState.threadKind === "dm" && !getMemberById(agentState.recipientUserId)) {
    agentState.loading = false;
    agentState.error = "Choose a real team member before sending a private DM.";
    render();
    return;
  }

  const missingDraftAttachments = attachments.filter((attachment) => attachment.needsReattach);
  if (missingDraftAttachments.length) {
    agentState.loading = false;
    agentState.error = `Reattach ${missingDraftAttachments.map((item) => item.name).join(", ")} before sending. I saved the draft text, but the browser will not let me safely reuse that file after reload.`;
    saveCurrentChatDraft({ includeTextarea: false });
    render();
    return;
  }

  render();

  try {
    if (!supabaseClient) {
      throw new Error("Agent requires Supabase login on the deployed app.");
    }

    const authSession = (await supabaseClient.auth.getSession()).data.session;
    if (!authSession?.access_token) {
      throw new Error("Your login expired. Sign in again.");
    }

    const thread = await ensureActiveChatThread(prompt);
    const storedAttachments = compactStoredAttachments(attachments);
    await saveChatMessage({
      threadId: thread.id,
      userId: session?.uid || null,
      role: "user",
      content: prompt,
      attachments: storedAttachments,
    });
    const threadUpdates = {
      mode: agentState.mode,
      projectId: agentState.projectId,
      visibility: agentState.visibility,
      threadKind: agentState.threadKind,
      recipientUserId: agentState.recipientUserId,
    };
    if (thread.title === "New chat") threadUpdates.title = createThreadTitle(prompt);
    await touchChatThread(thread.id, threadUpdates);

    agentState = {
      ...agentState,
      prompt: "",
    };
    clearChatDraftByKey(draftKeyBeforeSubmit);
    clearCurrentChatDraft();
    render();

    const response = await fetch("/api/agent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authSession.access_token}`,
      },
      body: JSON.stringify({
        mode: agentState.mode,
        prompt,
        attachments,
        threadId: thread.id,
        projectId: agentState.projectId,
      }),
    });

    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.error || "Agent request failed.");
    }

    const result = payload.result || fallbackAgentResult(payload.raw);
    await saveChatMessage({
      threadId: thread.id,
      userId: session?.uid || null,
      role: "assistant",
      content: result.answer || payload.raw || "",
      result,
      attachments: [],
    });
    await touchChatThread(thread.id);

    agentState = {
      ...agentState,
      loading: false,
      result: null,
      error: "",
      attachments: [],
      prompt: "",
      activeThreadId: thread.id,
    };
    await loadCloudData();
    persistChatUiState();
  } catch (error) {
    console.error(error);
    agentState = {
      ...agentState,
      loading: false,
      error: error.message || "Agent failed.",
    };
  }

  render();
}

async function submitAgentForm(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  agentState = {
    ...agentState,
    mode: String(form.get("mode") || "operator"),
    prompt: String(form.get("prompt") || ""),
    attachments: agentState.attachments || [],
    loading: true,
    error: "",
  };
  render();

  try {
    if (!supabaseClient) {
      throw new Error("Agent requires Supabase login on the deployed app.");
    }

    const authSession = (await supabaseClient.auth.getSession()).data.session;
    if (!authSession?.access_token) {
      throw new Error("Your login expired. Sign in again.");
    }

    const response = await fetch("/api/agent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authSession.access_token}`,
      },
      body: JSON.stringify({
        mode: agentState.mode,
        prompt: agentState.prompt,
        attachments: agentState.attachments,
      }),
    });

    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.error || "Agent request failed.");
    }

    agentState = {
      ...agentState,
      loading: false,
      result: payload.result || {
        answer: payload.raw || "The model returned an unstructured response.",
        intent: "unstructured",
        confidence: "Needs review",
        assumptions: [],
        suggestedTasks: [],
        suggestedContexts: [],
        suggestedReminders: [],
        relevantContext: [],
        risks: ["Could not parse the model response as task JSON."],
        contextNeeded: [],
        nextQuestion: "",
      },
      error: "",
    };
  } catch (error) {
    console.error(error);
    agentState = {
      ...agentState,
      loading: false,
      result: null,
      error: error.message || "Agent failed.",
    };
  }

  render();
}

function exportJson() {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `gensync-os-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function importJson(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async () => {
    try {
      data = JSON.parse(String(reader.result));

      if (supabaseClient) {
        await writeCloud(async () => replaceCloudData(data));
        return;
      }

      saveData();
      render();
    } catch (error) {
      console.error(error);
      alert(`Invalid JSON or Supabase import failed: ${error.message || error}`);
    }
  };
  reader.readAsText(file);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, "&#096;");
}
