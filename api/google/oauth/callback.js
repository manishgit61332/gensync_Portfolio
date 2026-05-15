const {
  readEnv,
  missingGoogleConfig,
  redirect,
  supabaseServiceRest,
  verifyState,
  readCookie,
  clearCookieHeader,
  encryptToken,
  publicError,
} = require("../../../lib/calendar-oauth");

const stateCookieName = "gensync_calendar_oauth";

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    redirect(res, buildReturnUrl("/", { calendar: "error", message: "Use the calendar connect button." }));
    return;
  }

  try {
    const env = readEnv();
    const missing = missingGoogleConfig(env);
    if (missing.length) {
      throw publicError(503, `Google Calendar OAuth is not configured yet: ${missing.join(", ")}.`);
    }

    const url = new URL(req.url, "https://gensync.local");
    if (url.searchParams.get("error")) {
      throw publicError(400, `Google rejected calendar access: ${url.searchParams.get("error")}.`);
    }

    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    if (!code || !state) throw publicError(400, "Google did not return a usable OAuth code.");

    const payload = verifyState(env, state);
    const cookieNonce = readCookie(req, stateCookieName);
    if (!cookieNonce || cookieNonce !== payload.nonce) {
      throw publicError(400, "Calendar connect session could not be verified. Try again from Gensync OS.");
    }

    const tokens = await exchangeCodeForTokens(env, code);
    const profile = await readGoogleProfile(tokens.access_token);
    const accountEmail = normalizeEmail(profile.email || payload.userEmail);
    if (!accountEmail) throw publicError(400, "Google did not return a calendar account email.");

    const source = await upsertCalendarSource(env, payload, accountEmail);
    await upsertCalendarConnection(env, payload, source.id, accountEmail, tokens);

    res.setHeader("Set-Cookie", clearCookieHeader(req, stateCookieName));
    redirect(res, buildReturnUrl(payload.returnTo, {
      calendar: "connected",
      account: accountEmail,
    }));
  } catch (error) {
    console.error(error);
    res.setHeader("Set-Cookie", clearCookieHeader(req, stateCookieName));
    redirect(res, buildReturnUrl("/", {
      calendar: "error",
      message: error.publicMessage || "Could not connect Google Calendar.",
    }));
  }
};

async function exchangeCodeForTokens(env, code) {
  const body = new URLSearchParams({
    code,
    client_id: env.googleClientId,
    client_secret: env.googleClientSecret,
    redirect_uri: env.googleRedirectUri,
    grant_type: "authorization_code",
  });

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.access_token) {
    console.error("Google token exchange failed", response.status, payload.error || payload.error_description || "");
    throw publicError(400, "Google Calendar consent did not complete. Try connecting again.");
  }
  return payload;
}

async function readGoogleProfile(accessToken) {
  const response = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw publicError(400, "Could not read the connected Google account.");
  return payload;
}

async function upsertCalendarSource(env, payload, accountEmail) {
  const existing = await supabaseServiceRest(
    env,
    `/calendar_sources?team_id=eq.${encodeURIComponent(payload.teamId)}&owner_user_id=eq.${encodeURIComponent(payload.userId)}&provider=eq.google&account_email=eq.${encodeURIComponent(accountEmail)}&select=id&limit=1`,
  );
  const now = new Date().toISOString();
  const body = {
    team_id: payload.teamId,
    owner_user_id: payload.userId,
    owner_label: payload.displayName || payload.userEmail || accountEmail,
    provider: "google",
    account_email: accountEmail,
    status: "connected",
    source_url: "google-oauth",
    notes: "Connected with read-only Google Calendar OAuth. Event creation still needs a confirm step before write access is added.",
    updated_at: now,
  };

  if (existing[0]?.id) {
    const rows = await supabaseServiceRest(
      env,
      `/calendar_sources?id=eq.${encodeURIComponent(existing[0].id)}&select=*`,
      {
        method: "PATCH",
        prefer: "return=representation",
        body,
      },
    );
    return rows[0];
  }

  const rows = await supabaseServiceRest(env, "/calendar_sources?select=*", {
    method: "POST",
    prefer: "return=representation",
    body: { ...body, created_at: now },
  });
  return rows[0];
}

async function upsertCalendarConnection(env, payload, sourceId, accountEmail, tokens) {
  const existing = await supabaseServiceRest(
    env,
    `/calendar_connections?team_id=eq.${encodeURIComponent(payload.teamId)}&user_id=eq.${encodeURIComponent(payload.userId)}&provider=eq.google&account_email=eq.${encodeURIComponent(accountEmail)}&select=id,refresh_token_enc&limit=1`,
  );
  const now = new Date().toISOString();
  const body = {
    team_id: payload.teamId,
    user_id: payload.userId,
    calendar_source_id: sourceId,
    provider: "google",
    account_email: accountEmail,
    scopes: String(tokens.scope || ""),
    access_token_enc: encryptToken(env, tokens.access_token),
    refresh_token_enc: tokens.refresh_token
      ? encryptToken(env, tokens.refresh_token)
      : existing[0]?.refresh_token_enc || "",
    token_type: tokens.token_type || "Bearer",
    expiry_date: Number(tokens.expires_in)
      ? new Date(Date.now() + Number(tokens.expires_in) * 1000).toISOString()
      : null,
    updated_at: now,
  };

  if (existing[0]?.id) {
    await supabaseServiceRest(
      env,
      `/calendar_connections?id=eq.${encodeURIComponent(existing[0].id)}`,
      {
        method: "PATCH",
        prefer: "return=minimal",
        body,
      },
    );
    return;
  }

  await supabaseServiceRest(env, "/calendar_connections", {
    method: "POST",
    prefer: "return=minimal",
    body: { ...body, created_at: now },
  });
}

function buildReturnUrl(returnTo, params) {
  const safePath = safeReturnTo(returnTo);
  const url = new URL(safePath, "https://gensync.local");
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, String(value));
  });
  return `${url.pathname}${url.search}${url.hash}`;
}

function safeReturnTo(value) {
  const path = String(value || "/");
  if (!path.startsWith("/") || path.startsWith("//")) return "/";
  if (path.startsWith("/api/")) return "/";
  return path.slice(0, 400);
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}
