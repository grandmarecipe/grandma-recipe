#!/usr/bin/env node
/**
 * One-time (or refresh) Pinterest OAuth for Grandma Recipe.
 *
 * Setup:
 * 1. In Pinterest app settings, add Redirect URI:
 *    http://localhost:3456/callback
 * 2. Put PINTEREST_APP_ID and PINTEREST_APP_SECRET in .env.local
 * 3. Run: npm run pinterest:oauth
 * 4. Approve scopes in the browser; token is saved to .pinterest-token.json
 *
 * Do not use the console "Generate token" button — that only grants read
 * scopes. This OAuth flow requests pins:write + boards:write.
 */

import http from "node:http";
import { createWriteStream, readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { spawn } from "node:child_process";

const ROOT = resolve(import.meta.dirname, "../..");
const TOKEN_PATH = resolve(ROOT, ".pinterest-token.json");
const PORT = 3456;
const REDIRECT_URI = `http://localhost:${PORT}/callback`;
const SCOPES = ["boards:read", "boards:write", "pins:read", "pins:write"].join(
  ",",
);

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

function loadEnv() {
  // .env.local wins over .env when both define the same key
  loadEnvFile(resolve(ROOT, ".env"));
  loadEnvFile(resolve(ROOT, ".env.local"));
}

loadEnv();

const APP_ID = process.env.PINTEREST_APP_ID?.trim();
const APP_SECRET = process.env.PINTEREST_APP_SECRET?.trim();

if (!APP_ID || !APP_SECRET) {
  console.error(
    "Missing PINTEREST_APP_ID or PINTEREST_APP_SECRET in .env or .env.local",
  );
  process.exit(1);
}

const state = `gr_${Date.now().toString(36)}`;
const authUrl = new URL("https://www.pinterest.com/oauth/");
authUrl.searchParams.set("client_id", APP_ID);
authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
authUrl.searchParams.set("response_type", "code");
authUrl.searchParams.set("scope", SCOPES);
authUrl.searchParams.set("state", state);

function openBrowser(url) {
  const platform = process.platform;
  if (platform === "darwin") spawn("open", [url], { detached: true });
  else if (platform === "win32") spawn("cmd", ["/c", "start", url], { detached: true });
  else spawn("xdg-open", [url], { detached: true });
}

async function exchangeCode(code) {
  const basic = Buffer.from(`${APP_ID}:${APP_SECRET}`).toString("base64");
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
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
    throw new Error(`Token exchange failed (${res.status}): ${JSON.stringify(json)}`);
  }
  return json;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);
  if (url.pathname !== "/callback") {
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  const code = url.searchParams.get("code");
  const returnedState = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error) {
    res.writeHead(400, { "Content-Type": "text/html" });
    res.end(`<h1>OAuth error</h1><pre>${error}</pre>`);
    console.error("OAuth error:", error);
    server.close();
    process.exit(1);
  }

  if (!code || returnedState !== state) {
    res.writeHead(400, { "Content-Type": "text/html" });
    res.end("<h1>Invalid callback</h1>");
    return;
  }

  try {
    const token = await exchangeCode(code);
    const payload = {
      ...token,
      saved_at: new Date().toISOString(),
      scopes: SCOPES,
    };
    writeFileSync(TOKEN_PATH, `${JSON.stringify(payload, null, 2)}\n`);
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(
      "<h1>Pinterest connected</h1><p>You can close this tab and return to the terminal.</p>",
    );
    console.log(`Saved token to ${TOKEN_PATH}`);
    console.log("Scopes:", token.scope ?? SCOPES);
    server.close();
    process.exit(0);
  } catch (err) {
    res.writeHead(500, { "Content-Type": "text/html" });
    res.end(`<h1>Token exchange failed</h1><pre>${String(err)}</pre>`);
    console.error(err);
    server.close();
    process.exit(1);
  }
});

server.on("error", (err) => {
  if (err && err.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use.`);
    console.error("Stop the old OAuth process, then retry:");
    console.error(`  lsof -ti :${PORT} | xargs kill -9`);
    console.error("  npm run pinterest:oauth");
    process.exit(1);
  }
  throw err;
});

server.listen(PORT, () => {
  console.log("Pinterest OAuth");
  console.log(`Redirect URI (must match app settings): ${REDIRECT_URI}`);
  console.log(`Scopes: ${SCOPES}`);
  console.log("\nOpen this URL if the browser does not open:\n");
  console.log(authUrl.toString());
  console.log("");
  openBrowser(authUrl.toString());
});
