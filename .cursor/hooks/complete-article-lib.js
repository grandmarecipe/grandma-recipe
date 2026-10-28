#!/usr/bin/env node
/**
 * Shared reader for Complete article signal.
 * Used by sessionStart + stop hooks.
 */
const fs = require("fs");
const path = require("path");

const signalPath = path.join(
  process.cwd(),
  ".cursor",
  "signals",
  "complete-article.json",
);

function readPendingSignal() {
  if (!fs.existsSync(signalPath)) return null;
  try {
    const signal = JSON.parse(fs.readFileSync(signalPath, "utf8"));
    if (signal.status !== "pending" || !signal.slug) return null;
    return signal;
  } catch {
    return null;
  }
}

function followupFor(signal) {
  return [
    `Complete article signal is pending for “${signal.title || signal.slug}” (${signal.slug}).`,
    "Use Cursor GenerateImage ONLY (never DALL·E / OpenAI images).",
    "Generate feature 16:9 + in-article 3:4 from saved prompts, upload via scripts/complete-article-from-assets.ts, save DEV draft.",
    "Do not publish unless already asked. Then mark the signal done.",
  ].join(" ");
}

function readStdin() {
  return new Promise((resolve) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => {
      data += chunk;
    });
    process.stdin.on("end", () => resolve(data));
  });
}

module.exports = { readPendingSignal, followupFor, readStdin, signalPath };
