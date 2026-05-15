const modeLabels = {
  operator: "auto-router operator",
  motion: "motion design QC",
  leads: "lead generation",
  fulfillment: "client fulfillment",
  strategy: "strategy",
  calendar: "calendar and execution planning",
};

const jsonHeaders = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
};

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      ...jsonHeaders,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    });
    res.end();
    return;
  }

  if (req.method !== "POST") {
    send(res, 405, { error: "Use POST." });
    return;
  }

  try {
    const authToken = readBearer(req.headers.authorization);
    if (!authToken) {
      send(res, 401, { error: "Missing Supabase session." });
      return;
    }

    const env = readEnv();
    const body = await readBody(req);
    const prompt = String(body.prompt || "").trim();
    const mode = modeLabels[body.mode] ? body.mode : "operator";
    const threadId = String(body.threadId || "").trim();
    const projectId = String(body.projectId || "").trim();
    const attachments = normalizeAttachments(body.attachments);

    if (!prompt && !attachments.length) {
      send(res, 400, { error: "Prompt or attachment is required." });
      return;
    }

    if (prompt.length > 12000) {
      send(res, 413, { error: "Prompt is too long. Keep it under 12,000 characters." });
      return;
    }

    const user = await getSupabaseUser(env, authToken);
    const membership = await getMembership(env, authToken, user.id);
    if (!membership) {
      send(res, 403, { error: "Join the Gensync workspace first." });
      return;
    }

    const [context, threadHistory] = await Promise.all([
      getWorkspaceContext(env, authToken, membership.team_id),
      threadId ? getThreadHistory(env, authToken, membership.team_id, threadId) : Promise.resolve([]),
    ]);
    const azure = await callAzureResponses(env, buildAgentPayload(env, {
      mode,
      prompt,
      attachments,
      threadId,
      projectId,
      threadHistory,
      user,
      membership,
      context,
    }));

    const text = extractOutputText(azure);
    const result = parseAgentJson(text);

    send(res, 200, {
      mode,
      model: env.azureModel,
      result,
      raw: result ? undefined : text,
      usage: azure.usage || null,
    });
  } catch (error) {
    console.error(error);
    send(res, error.statusCode || 500, {
      error: error.publicMessage || "Agent failed.",
      detail: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

function readEnv() {
  const required = [
    "SUPABASE_URL",
    "SUPABASE_ANON_KEY",
    "AZURE_OPENAI_RESPONSES_URL",
    "AZURE_OPENAI_API_KEY",
    "AZURE_OPENAI_MODEL",
  ];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    const error = new Error(`Missing env vars: ${missing.join(", ")}`);
    error.statusCode = 500;
    error.publicMessage = "Agent environment is not configured.";
    throw error;
  }

  return {
    supabaseUrl: process.env.SUPABASE_URL.replace(/\/$/, ""),
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    azureUrl: process.env.AZURE_OPENAI_RESPONSES_URL,
    azureKey: process.env.AZURE_OPENAI_API_KEY,
    azureModel: process.env.AZURE_OPENAI_MODEL,
  };
}

function readBearer(header) {
  const match = String(header || "").match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : "";
}

async function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

async function getSupabaseUser(env, authToken) {
  const response = await fetch(`${env.supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: env.supabaseAnonKey,
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    const error = new Error(`Supabase auth failed: ${response.status}`);
    error.statusCode = 401;
    error.publicMessage = "Your login expired. Sign in again.";
    throw error;
  }

  return response.json();
}

async function getMembership(env, authToken, userId) {
  const rows = await supabaseRest(env, authToken, `/team_members?user_id=eq.${encodeURIComponent(userId)}&select=team_id,role,email,display_name,teams(name)&limit=1`);
  return rows[0] || null;
}

async function getWorkspaceContext(env, authToken, teamId) {
  const teamFilter = `team_id=eq.${encodeURIComponent(teamId)}`;
  const [clients, tasks, leads, evidence, members, contexts, calendarSources, projectSpaces] = await Promise.all([
    supabaseRest(env, authToken, `/clients?${teamFilter}&select=id,name,status,owner_label,retainer_label,health,next_action,proof&order=created_at.desc&limit=20`),
    supabaseRest(env, authToken, `/tasks?${teamFilter}&select=id,client_id,title,status,priority,owner_label,visibility,due_label,review_gate,notes&order=created_at.desc&limit=80`),
    supabaseRest(env, authToken, `/leads?${teamFilter}&select=company,stage,value_usd,owner_label,next_action,source&order=created_at.desc&limit=40`),
    supabaseRest(env, authToken, `/evidence?${teamFilter}&select=title,evidence_type,confidence,note,link&order=created_at.desc&limit=40`),
    supabaseRest(env, authToken, `/team_members?${teamFilter}&select=display_name,email,role&order=created_at.asc&limit=20`),
    supabaseRest(env, authToken, `/context_items?${teamFilter}&select=id,project_id,client_id,title,category,source_url,summary,content,confidence,visibility&order=created_at.desc&limit=80`),
    supabaseRest(env, authToken, `/calendar_sources?${teamFilter}&select=owner_label,account_email,status,source_url,notes&order=created_at.desc&limit=20`),
    supabaseRest(env, authToken, `/project_spaces?${teamFilter}&select=id,client_id,name,slug,description,visibility&order=created_at.asc&limit=40`),
  ]);

  return {
    clients,
    tasks,
    leads,
    evidence,
    members,
    contexts: contexts.map(compactContextItem),
    calendarSources,
    projectSpaces,
  };
}

async function getThreadHistory(env, authToken, teamId, threadId) {
  const path = `/chat_messages?team_id=eq.${encodeURIComponent(teamId)}&thread_id=eq.${encodeURIComponent(threadId)}&select=user_id,role,content,result,attachments,created_at&order=created_at.asc&limit=40`;
  const rows = await supabaseRest(env, authToken, path);
  return rows.map(compactThreadMessage);
}

function compactContextItem(item) {
  return {
    ...item,
    summary: String(item.summary || "").slice(0, 900),
    content: String(item.content || "").slice(0, 1800),
  };
}

function compactThreadMessage(message) {
  const result = message.result && typeof message.result === "object" ? message.result : null;
  return {
    role: message.role === "assistant" ? "assistant" : "user",
    userId: message.user_id || "",
    content: String(message.content || result?.answer || "").slice(0, 1800),
    assistantSummary: result
      ? {
          intent: String(result.intent || ""),
          answer: String(result.answer || "").slice(0, 1200),
          nextQuestion: String(result.nextQuestion || ""),
          contextNeeded: Array.isArray(result.contextNeeded) ? result.contextNeeded.slice(0, 5) : [],
        }
      : null,
    attachments: Array.isArray(message.attachments)
      ? message.attachments.map((attachment) => ({
          name: String(attachment.name || "attachment").slice(0, 160),
          kind: String(attachment.kind || "file").slice(0, 40),
        })).slice(0, 4)
      : [],
    createdAt: message.created_at,
  };
}

function normalizeAttachments(input) {
  if (!Array.isArray(input)) return [];
  return input.slice(0, 4).map((item) => {
    const kind = ["image", "pdf", "text", "file"].includes(item?.kind) ? item.kind : "file";
    const attachment = {
      name: String(item?.name || "attachment").slice(0, 180),
      type: String(item?.type || "application/octet-stream").slice(0, 120),
      size: Number(item?.size || 0),
      kind,
      text: String(item?.text || "").slice(0, 12000),
      dataUrl: "",
    };

    if ((kind === "image" || kind === "pdf") && typeof item?.dataUrl === "string") {
      attachment.dataUrl = item.dataUrl.slice(0, 5_000_000);
    }

    return attachment;
  });
}

async function supabaseRest(env, authToken, path) {
  const response = await fetch(`${env.supabaseUrl}/rest/v1${path}`, {
    headers: {
      apikey: env.supabaseAnonKey,
      Authorization: `Bearer ${authToken}`,
    },
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Supabase REST ${response.status}: ${text}`);
  }

  return text ? JSON.parse(text) : [];
}

function buildAgentPayload(env, input) {
  const { mode, prompt, attachments, threadId, projectId, threadHistory, user, membership, context } = input;
  const selectedProject = (context.projectSpaces || []).find((project) => project.id === projectId) || null;
  const projectContext = selectedProject
    ? (context.contexts || []).filter((item) =>
        item.project_id === selectedProject.id
        || (selectedProject.client_id && item.client_id === selectedProject.client_id)
        || (selectedProject.client_id && contextTextMatchesProject(item, selectedProject))
        || (selectedProject.name === "Gensync" && !item.project_id && !item.client_id)
      )
    : [];
  const compactContext = {
    user: {
      id: user.id,
      email: user.email,
      role: membership.role,
      displayName: membership.display_name,
    },
    workspace: membership.teams?.name || "Gensync",
    currentThread: {
      threadId,
      selectedProject,
      mode: modeLabels[mode],
    },
    conversationHistory: threadHistory,
    projectContext,
    visibleContext: context,
  };
  const attachmentBriefs = attachments.map((attachment) => ({
    name: attachment.name,
    type: attachment.type,
    size: attachment.size,
    kind: attachment.kind,
    extractedText: attachment.kind === "text" || attachment.kind === "file" ? attachment.text : "",
    sentToModel: Boolean(attachment.dataUrl),
  }));
  const content = [
    {
      type: "input_text",
      text: JSON.stringify({
        mode: modeLabels[mode],
        userRequest: prompt,
        attachments: attachmentBriefs,
        context: compactContext,
        requiredOutputShape: {
          intent: "task, reminder, quote, referral-proof, motion-qc, context, strategy, question, or mixed",
          confidence: "High, Medium, or Low",
          answer: "direct useful response in plain language",
          relevantContext: [
            {
              title: "existing context/evidence/client/task title",
              reason: "why it matters to this request",
              sourceUrl: "source link/path if present",
            },
          ],
          assumptions: ["unknowns that must be verified"],
          suggestedTasks: [
            {
              title: "short task title",
              owner: "Manish, Mohit, Codex, or specific owner",
              priority: "P0, P1, or P2",
              client: "Gensync, Geodo, ConnectME, Ops, or lead/client name",
              review: "Internal, Client message, Personal post, Prospect outreach, Financial, Security, etc.",
              visibility: "team or private",
              notes: "specific next action and QC bar",
              evidenceRefs: ["exact context/evidence/task titles used"],
              blockedBy: "missing context or review blocker, otherwise empty string",
            },
          ],
          suggestedReminders: [
            {
              title: "short reminder title",
              owner: "Manish, Mohit, or Team",
              due: "human-readable due date/time if user supplied it, otherwise Open",
              priority: "P0, P1, or P2",
              client: "Gensync/client name",
              visibility: "team or private",
              notes: "why this reminder exists and what to check",
            },
          ],
          suggestedContexts: [
            {
              title: "short context title",
              category: "Google Doc, GitHub, PDF, Contract, Invoice, Transcript, Notes, Calendar, or Other",
              visibility: "team or private",
              confidence: "Verified, Reported, Unverified, or Inferred",
              sourceUrl: "source URL if present",
              summary: "source-of-truth summary",
              content: "important text excerpt if useful",
            },
          ],
          risks: ["what could go wrong or hallucination risk"],
          contextNeeded: ["specific docs/links/files/calendar data still needed"],
          nextQuestion: "one question only if needed, otherwise empty string",
        },
      }),
    },
  ];

  for (const attachment of attachments) {
    if (attachment.kind === "image" && attachment.dataUrl) {
      content.push({
        type: "input_image",
        image_url: attachment.dataUrl,
        detail: "high",
      });
    }

    if (attachment.kind === "pdf" && attachment.dataUrl) {
      content.push({
        type: "input_file",
        filename: attachment.name,
        file_data: attachment.dataUrl,
      });
    }
  }

  return {
    model: env.azureModel,
    store: false,
    max_output_tokens: 3400,
    instructions: [
      "You are the Gensync team-member agent inside Gensync OS.",
      "Your job is to help Manish/Mohit execute with quality control while respecting review gates.",
      "The first surface is an intake chat. Convert raw messages, voice transcripts, screenshots, PDFs, referrals, pricing questions, and messy notes into useful answers plus proposed writes.",
      "Default to acting like Codex: infer the user's intended workflow, choose the right mode internally, ask only when blocked, and return concrete proposed writes. The user should not need to know whether something is a task, reminder, context file, lead-gen move, calendar action, or motion QC pass.",
      "This is a persistent multi-turn thread. Treat the current message as a reply to the prior assistant question when that fits. If the user corrects spelling, entity names, dates, or context, update your interpretation instead of asking again.",
      "Chat history is private to the logged-in user unless the thread is explicitly shared. Do not leak one user's private conversation, state, or assumptions into another user's answer.",
      "Use the selected project context folder first. Then use global client/task/evidence context. If the selected folder is empty, say exactly what should be uploaded or linked.",
      "Never claim that you contacted clients, posted content, spent money, edited files, rendered videos, or used an external tool unless the provided context proves it.",
      "Current-client messages, publishing on personal accounts, tool purchases, and financial decisions require human review.",
      "Prospect outreach, lead research, internal task planning, drafts, creative direction, and QA plans are allowed as drafts.",
      "Respect privacy boundaries: private tasks and self-state are not shared. Do not infer private mental/medical facts.",
      "Context is king. If a decision depends on missing docs, transcripts, contracts, invoices, calendar events, or current client instructions, ask for that context and mark the action blocked.",
      "Avoid overlap: compare suggested tasks against visible open tasks. Do not create duplicate work unless the task notes explain why it is different.",
      "Never fabricate calendar availability. If live calendar data is not present, propose a scheduling question or a calendar-sync task instead of inventing times.",
      "If the user asks a non-task question such as a quote, referral proof, or what context to use, answer directly and populate relevantContext before suggesting any writes.",
      "When attachments are present, inspect them. For images/screenshots, call out visible flaws, missing information, audience confusion, layout issues, and motion/QC risks. For PDFs, use the document content. If an attachment cannot be interpreted, say so plainly.",
      "For motion work, be concrete about timing, frame-level visual checks, audience comprehension, audio/visual sync, and what proof is needed.",
      "For lead generation, prioritize money-adjacent humans, clear buying power, proof gifts, credibility, and fast paths to meetings.",
      "Return strict JSON only. No markdown outside JSON.",
    ].join("\n"),
    input: [
      {
        role: "user",
        content,
      },
    ],
  };
}

function contextTextMatchesProject(item, project) {
  const needle = String(project?.name || "").trim().toLowerCase();
  if (!needle) return false;
  const haystack = [
    item.title,
    item.category,
    item.source_url,
    item.summary,
    item.content,
  ].join(" ").toLowerCase();
  return haystack.includes(needle);
}

async function callAzureResponses(env, payload) {
  const response = await fetch(env.azureUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": env.azureKey,
    },
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { output_text: text };
  }

  if (!response.ok) {
    const error = new Error(`Azure Responses ${response.status}: ${text.slice(0, 500)}`);
    error.statusCode = response.status >= 500 ? 502 : 400;
    error.publicMessage = data?.error?.message || "Model request failed.";
    throw error;
  }

  return data;
}

function extractOutputText(response) {
  if (typeof response.output_text === "string") return response.output_text;

  const pieces = [];
  for (const item of response.output || []) {
    for (const content of item.content || []) {
      if (typeof content.text === "string") pieces.push(content.text);
      if (typeof content.output_text === "string") pieces.push(content.output_text);
    }
  }

  return pieces.join("\n").trim();
}

function parseAgentJson(text) {
  if (!text) return null;

  const trimmed = text.trim().replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
  try {
    const parsed = JSON.parse(trimmed);
    return {
      intent: String(parsed.intent || ""),
      confidence: String(parsed.confidence || ""),
      answer: String(parsed.answer || ""),
      relevantContext: Array.isArray(parsed.relevantContext) ? parsed.relevantContext.map(normalizeRelevantContext).filter(Boolean).slice(0, 8) : [],
      assumptions: Array.isArray(parsed.assumptions) ? parsed.assumptions.map(String).slice(0, 8) : [],
      suggestedTasks: Array.isArray(parsed.suggestedTasks)
        ? parsed.suggestedTasks.map(normalizeTask).filter(Boolean).slice(0, 8)
        : [],
      suggestedReminders: Array.isArray(parsed.suggestedReminders)
        ? parsed.suggestedReminders.map(normalizeReminder).filter(Boolean).slice(0, 6)
        : [],
      suggestedContexts: Array.isArray(parsed.suggestedContexts)
        ? parsed.suggestedContexts.map(normalizeContextSuggestion).filter(Boolean).slice(0, 6)
        : [],
      risks: Array.isArray(parsed.risks) ? parsed.risks.map(String).slice(0, 8) : [],
      contextNeeded: Array.isArray(parsed.contextNeeded) ? parsed.contextNeeded.map(String).slice(0, 8) : [],
      nextQuestion: String(parsed.nextQuestion || ""),
    };
  } catch {
    return null;
  }
}

function normalizeRelevantContext(item) {
  if (!item || !item.title) return null;
  return {
    title: String(item.title).slice(0, 160),
    reason: String(item.reason || item.summary || "").slice(0, 500),
    sourceUrl: String(item.sourceUrl || item.link || "").slice(0, 500),
  };
}

function normalizeTask(task) {
  if (!task || !task.title) return null;
  return {
    title: String(task.title).slice(0, 140),
    owner: String(task.owner || "Manish").slice(0, 80),
    priority: ["P0", "P1", "P2"].includes(task.priority) ? task.priority : "P1",
    client: String(task.client || "Gensync").slice(0, 80),
    review: String(task.review || "Internal").slice(0, 80),
    visibility: task.visibility === "private" ? "private" : "team",
    notes: String(task.notes || "").slice(0, 1200),
    evidenceRefs: Array.isArray(task.evidenceRefs) ? task.evidenceRefs.map(String).slice(0, 5) : [],
    blockedBy: String(task.blockedBy || "").slice(0, 300),
  };
}

function normalizeReminder(reminder) {
  if (!reminder || !reminder.title) return null;
  return {
    title: String(reminder.title).slice(0, 140),
    owner: String(reminder.owner || "Manish").slice(0, 80),
    due: String(reminder.due || "Open").slice(0, 120),
    priority: ["P0", "P1", "P2"].includes(reminder.priority) ? reminder.priority : "P1",
    client: String(reminder.client || "Gensync").slice(0, 80),
    visibility: reminder.visibility === "private" ? "private" : "team",
    notes: String(reminder.notes || "").slice(0, 900),
  };
}

function normalizeContextSuggestion(item) {
  if (!item || !item.title) return null;
  return {
    title: String(item.title).slice(0, 140),
    category: String(item.category || "Notes").slice(0, 80),
    visibility: item.visibility === "private" ? "private" : "team",
    confidence: String(item.confidence || "Unverified").slice(0, 80),
    sourceUrl: String(item.sourceUrl || "").slice(0, 600),
    summary: String(item.summary || "").slice(0, 1200),
    content: String(item.content || "").slice(0, 1600),
  };
}

function send(res, status, payload) {
  res.writeHead(status, jsonHeaders);
  res.end(JSON.stringify(payload));
}
