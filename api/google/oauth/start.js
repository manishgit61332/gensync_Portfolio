const crypto = require("crypto");
const {
  googleCalendarScopes,
  readEnv,
  missingGoogleConfig,
  readBearer,
  sendJson,
  readBody,
  getSupabaseUser,
  getMembership,
  createState,
  cookieHeader,
} = require("../../../lib/calendar-oauth");

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
        error: "Google Calendar OAuth is not configured yet.",
        missing,
      });
      return;
    }

    const authToken = readBearer(req.headers.authorization);
    if (!authToken) {
      sendJson(res, 401, { error: "Missing Supabase session." });
      return;
    }

    const body = await readBody(req);
    const user = await getSupabaseUser(env, authToken);
    const membership = await getMembership(env, authToken, user.id);
    if (!membership) {
      sendJson(res, 403, { error: "Join the Gensync workspace first." });
      return;
    }

    const nonce = crypto.randomBytes(18).toString("base64url");
    const state = createState(env, {
      nonce,
      userId: user.id,
      userEmail: user.email || "",
      teamId: membership.team_id,
      displayName: membership.display_name || user.email || "",
      returnTo: String(body.returnTo || "/").slice(0, 400),
      exp: Date.now() + 10 * 60 * 1000,
    });

    const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    url.searchParams.set("client_id", env.googleClientId);
    url.searchParams.set("redirect_uri", env.googleRedirectUri);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", googleCalendarScopes.join(" "));
    url.searchParams.set("state", state);
    url.searchParams.set("access_type", "offline");
    url.searchParams.set("include_granted_scopes", "true");
    url.searchParams.set("prompt", "consent");
    if (user.email) url.searchParams.set("login_hint", user.email);

    res.setHeader("Set-Cookie", cookieHeader(req, "gensync_calendar_oauth", nonce, 600));
    sendJson(res, 200, { url: url.toString() });
  } catch (error) {
    console.error(error);
    sendJson(res, error.statusCode || 500, {
      error: error.publicMessage || "Could not start Google Calendar OAuth.",
    });
  }
};
