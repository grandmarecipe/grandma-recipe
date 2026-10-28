import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { resolve, extname } from "node:path";

export const ROOT = resolve(import.meta.dirname, "../..");
export const TOKEN_PATH = resolve(ROOT, ".pinterest-token.json");
export const POSTED_PATH = resolve(ROOT, "pinterest-pins/.posted.json");
export const PACKS_DIR = resolve(ROOT, "pinterest-pins");

function loadEnvFile(envPath) {
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

export function loadEnvLocal() {
  // .env.local wins over .env when both define the same key
  loadEnvFile(resolve(ROOT, ".env"));
  loadEnvFile(resolve(ROOT, ".env.local"));
}

function readTokenFile() {
  if (!existsSync(TOKEN_PATH)) return null;
  return JSON.parse(readFileSync(TOKEN_PATH, "utf8"));
}

function writeTokenFile(payload) {
  writeFileSync(TOKEN_PATH, `${JSON.stringify(payload, null, 2)}\n`);
}

async function refreshAccessToken(refreshToken) {
  const appId = process.env.PINTEREST_APP_ID?.trim();
  const appSecret = process.env.PINTEREST_APP_SECRET?.trim();
  if (!appId || !appSecret) {
    throw new Error(
      "Token refresh needs PINTEREST_APP_ID and PINTEREST_APP_SECRET",
    );
  }
  const basic = Buffer.from(`${appId}:${appSecret}`).toString("base64");
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });
  const res = await fetch("https://api.pinterest.com/v5/oauth/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(
      `Pinterest token refresh failed (${res.status}): ${JSON.stringify(json)}`,
    );
  }
  return json;
}

/**
 * Resolve a usable access token.
 * Prefers PINTEREST_ACCESS_TOKEN; otherwise .pinterest-token.json.
 * If PINTEREST_REFRESH_TOKEN (or token file) is set with app secrets, refreshes first in CI.
 */
export async function getAccessToken({ refresh = false } = {}) {
  loadEnvLocal();

  const envAccess = process.env.PINTEREST_ACCESS_TOKEN?.trim();
  const envRefresh = process.env.PINTEREST_REFRESH_TOKEN?.trim();
  const file = readTokenFile();
  const refreshToken = envRefresh || file?.refresh_token;

  if (refresh && refreshToken) {
    const next = await refreshAccessToken(refreshToken);
    const payload = {
      ...(file || {}),
      ...next,
      saved_at: new Date().toISOString(),
    };
    if (!process.env.CI) writeTokenFile(payload);
    process.env.PINTEREST_ACCESS_TOKEN = next.access_token;
    if (next.refresh_token) {
      process.env.PINTEREST_REFRESH_TOKEN = next.refresh_token;
    }
    return next.access_token;
  }

  if (envAccess) return envAccess;
  if (file?.access_token) return file.access_token;

  throw new Error(
    "No Pinterest token. Run: npm run pinterest:oauth  (or set PINTEREST_ACCESS_TOKEN)",
  );
}

export function getPinterestApiBase() {
  return (
    process.env.PINTEREST_API_BASE?.trim() || "https://api.pinterest.com"
  ).replace(/\/$/, "");
}

export async function pinterestFetch(path, { method = "GET", body } = {}) {
  const token = await getAccessToken();
  const apiBase = getPinterestApiBase();
  const res = await fetch(`${apiBase}/v5${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { raw: text };
  }
  if (!res.ok) {
    throw new Error(
      `Pinterest ${method} ${path} failed (${res.status}): ${JSON.stringify(json)}`,
    );
  }
  return json;
}

export function parseArgs(argv = process.argv.slice(2)) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const body = a.slice(2);
      const eq = body.indexOf("=");
      if (eq >= 0) {
        out[body.slice(0, eq)] = body.slice(eq + 1);
        continue;
      }
      const next = argv[i + 1];
      if (!next || next.startsWith("--")) out[body] = true;
      else {
        out[body] = next;
        i++;
      }
    } else out._.push(a);
  }
  return out;
}

export function parseUploadTxt(text) {
  const lines = text.split(/\r?\n/);
  const fields = {};
  let current = null;
  let buf = [];

  const flush = () => {
    if (!current) return;
    fields[current] = buf.join("\n").trim();
    current = null;
    buf = [];
  };

  const headers = [
    "BOARD",
    "BOARD_ID",
    "IMAGE FILE",
    "IMAGE_URL",
    "TITLE",
    "DESCRIPTION",
    "DESTINATION LINK",
    "ALT TEXT",
    "TAG",
  ];

  for (const line of lines) {
    const raw = line.trim();
    // Allow "TITLE (paste into Pin title)" / "TAG (if Pinterest suggests it)"
    const head = raw.split(/[:(]/)[0].trim().toUpperCase();
    if (headers.includes(head)) {
      flush();
      current = head;
      continue;
    }
    if (current) buf.push(line);
  }
  flush();
  return fields;
}

export function contentTypeFor(path) {
  const ext = extname(path).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  throw new Error(`Pinterest base64 upload supports jpg/png only (got ${ext})`);
}

export function releaseDateToday(asOf = new Date()) {
  const y = asOf.getUTCFullYear();
  const m = String(asOf.getUTCMonth() + 1).padStart(2, "0");
  const d = String(asOf.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function publishedAtDay(publishedAt) {
  return String(publishedAt).slice(0, 10);
}

/** slug -> publishedAt from content/recipes/*.json */
export function loadArticlePublishDays() {
  const dir = resolve(ROOT, "content/recipes");
  const map = new Map();
  if (!existsSync(dir)) return map;
  for (const name of readdirSync(dir)) {
    if (!name.endsWith(".json")) continue;
    try {
      const data = JSON.parse(readFileSync(resolve(dir, name), "utf8"));
      const slug = data.slug || name.replace(/\.json$/, "");
      const publishedAt =
        data.publishedAt ||
        data.datePublished ||
        data.modifiedAt ||
        data.dateModified ||
        null;
      if (slug && publishedAt) map.set(slug, publishedAt);
    } catch {
      // skip bad JSON
    }
  }
  return map;
}

/** Grandma Recipe URLs are https://www.grandmarecipe.com/<slug>/ */
export function articleSlugFromLink(link) {
  if (!link) return null;
  const reserved = new Set([
    "category",
    "tag",
    "admin",
    "api",
    "search",
    "about-us",
    "contact-us",
    "privacy-policy",
    "terms-of-service",
    "sitemap",
    "feed",
    "pinterest-pins",
  ]);
  try {
    const u = new URL(link);
    const parts = u.pathname.split("/").filter(Boolean);
    if (!parts.length) return null;
    if (reserved.has(parts[0])) return null;
    return parts[0];
  } catch {
    const m = String(link).match(
      /grandmarecipe\.com\/([^/?#]+)\/?/i,
    );
    if (m && !reserved.has(m[1])) return m[1];
  }
  return null;
}

export function loadPostedLog() {
  if (!existsSync(POSTED_PATH)) return { pins: [] };
  return JSON.parse(readFileSync(POSTED_PATH, "utf8"));
}

export function savePostedLog(log) {
  writeFileSync(POSTED_PATH, `${JSON.stringify(log, null, 2)}\n`);
}

export function listUploadFiles(packsDir = PACKS_DIR) {
  if (!existsSync(packsDir)) return [];
  const out = [];
  for (const folder of readdirSync(packsDir, { withFileTypes: true })) {
    if (!folder.isDirectory()) continue;
    const dir = resolve(packsDir, folder.name);
    for (const name of readdirSync(dir)) {
      if (/^UPLOAD.*\.txt$/i.test(name)) {
        out.push(resolve(dir, name));
      }
    }
  }
  return out.sort();
}
