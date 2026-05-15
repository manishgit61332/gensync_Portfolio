const crypto = require("crypto");

const googleCalendarScopes = [
  "openid",
  "email",
  "profile",
  "https://www.googleapis.com/auth/calendar.readonly",
];

function readEnv() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const googleRedirectUri = process.env.GOOGLE_REDIRECT_URI;
  const calendarTokenSecret = process.env.CALENDAR_TOKEN_SECRET;

  return {
    supabaseUrl: supabaseUrl ? supabaseUrl.replace(/\/$/, "") : "",
    supabaseAnonKey,
    supabaseServiceRoleKey,
    googleClientId,
    googleClientSecret,
    googleRedirectUri,
    calendarTokenSecret,
  };
}

function missingGoogleConfig(env) {
  return [
    ["GOOGLE_CLIENT_ID", env.googleClientId],
    ["GOOGLE_CLIENT_SECRET", env.googleClientSecret],
    ["GOOGLE_REDIRECT_URI", env.googleRedirectUri],
    ["SUPABASE_SERVICE_ROLE_KEY", env.supabaseServiceRoleKey],
    ["CALENDAR_TOKEN_SECRET", env.calendarTokenSecret],
  ]
    .filter(([, value]) => !value)
    .map(([key]) => key);
}

function readBearer(header) {
  const match = String(header || "").match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : "";
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(payload));
}

function redirect(res, location) {
  res.writeHead(302, {
    Location: location,
    "Cache-Control": "no-store",
  });
  res.end();
}

async function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
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
  if (!response.ok) throw publicError(401, "Your login expired. Sign in again.");
  return response.json();
}

async function getMembership(env, authToken, userId) {
  const rows = await supabaseUserRest(
    env,
    authToken,
    `/team_members?user_id=eq.${encodeURIComponent(userId)}&select=team_id,role,email,display_name&limit=1`,
  );
  return rows[0] || null;
}

async function supabaseUserRest(env, authToken, path) {
  return supabaseRest(env, env.supabaseAnonKey, authToken, path);
}

async function supabaseServiceRest(env, path, options = {}) {
  return supabaseRest(env, env.supabaseServiceRoleKey, env.supabaseServiceRoleKey, path, options);
}

async function supabaseRest(env, apikey, authToken, path, options = {}) {
  const response = await fetch(`${env.supabaseUrl}/rest/v1${path}`, {
    method: options.method || "GET",
    headers: {
      apikey,
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
      Prefer: options.prefer || "",
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const text = await response.text();
  if (!response.ok) {
    const message = text || `Supabase REST ${response.status}`;
    throw new Error(message);
  }
  return text ? JSON.parse(text) : null;
}

function createState(env, payload) {
  const body = base64Url(JSON.stringify(payload));
  const sig = hmac(env.calendarTokenSecret, body);
  return `${body}.${sig}`;
}

function verifyState(env, state) {
  const [body, sig] = String(state || "").split(".");
  if (!body || !sig) throw publicError(400, "Invalid OAuth state.");
  const expected = hmac(env.calendarTokenSecret, body);
  if (!timingSafeEqual(sig, expected)) throw publicError(400, "OAuth state check failed.");
  const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  if (!payload.exp || payload.exp < Date.now()) throw publicError(400, "OAuth session expired. Try again.");
  return payload;
}

function hmac(secret, value) {
  return crypto.createHmac("sha256", secret).update(value).digest("base64url");
}

function timingSafeEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function base64Url(value) {
  return Buffer.from(value).toString("base64url");
}

function readCookie(req, name) {
  const cookies = String(req.headers.cookie || "").split(/;\s*/);
  const prefix = `${name}=`;
  const cookie = cookies.find((item) => item.startsWith(prefix));
  return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : "";
}

function cookieHeader(req, name, value, maxAgeSeconds) {
  const secure = String(req.headers["x-forwarded-proto"] || "").includes("https") ? "; Secure" : "";
  return `${name}=${encodeURIComponent(value)}; HttpOnly; SameSite=Lax; Path=/api/google/oauth; Max-Age=${maxAgeSeconds}${secure}`;
}

function clearCookieHeader(req, name) {
  const secure = String(req.headers["x-forwarded-proto"] || "").includes("https") ? "; Secure" : "";
  return `${name}=; HttpOnly; SameSite=Lax; Path=/api/google/oauth; Max-Age=0${secure}`;
}

function encryptToken(env, value) {
  if (!value) return "";
  const key = crypto.createHash("sha256").update(env.calendarTokenSecret).digest();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(String(value), "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("base64url")}.${tag.toString("base64url")}.${encrypted.toString("base64url")}`;
}

function decryptToken(env, value) {
  if (!value) return "";
  const [ivValue, tagValue, encryptedValue] = String(value).split(".");
  if (!ivValue || !tagValue || !encryptedValue) {
    throw publicError(409, "Stored Google Calendar token is unreadable. Reconnect Google Calendar.");
  }
  const key = crypto.createHash("sha256").update(env.calendarTokenSecret).digest();
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, Buffer.from(ivValue, "base64url"));
  decipher.setAuthTag(Buffer.from(tagValue, "base64url"));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedValue, "base64url")),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
}

function publicError(statusCode, publicMessage) {
  const error = new Error(publicMessage);
  error.statusCode = statusCode;
  error.publicMessage = publicMessage;
  return error;
}

module.exports = {
  googleCalendarScopes,
  readEnv,
  missingGoogleConfig,
  readBearer,
  sendJson,
  redirect,
  readBody,
  getSupabaseUser,
  getMembership,
  supabaseServiceRest,
  createState,
  verifyState,
  readCookie,
  cookieHeader,
  clearCookieHeader,
  encryptToken,
  decryptToken,
  publicError,
};
