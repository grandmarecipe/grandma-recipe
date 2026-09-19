#!/usr/bin/env node
/**
 * If a pending Complete article signal exists when the agent stops,
 * send a follow-up so the agent finishes images without a typed chat prompt.
 */
const fs = require("fs");
const path = require("path");

const signalPath = path.join(
  process.cwd(),
  ".cursor",
  "signals",
  "complete-article.json",
);

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

(async () => {
  await readStdin();
  if (!fs.existsSync(signalPath)) {
    process.stdout.write("{}\n");
    return;
  }
  let signal;
  try {
    signal = JSON.parse(fs.readFileSync(signalPath, "utf8"));
  } catch {
    process.stdout.write("{}\n");
    return;
  }
  if (signal.status !== "pending" || !signal.slug) {
    process.stdout.write("{}\n");
    return;
  }

  const followup = [
    `Complete article signal is pending for “${signal.title || signal.slug}” (${signal.slug}).`,
    "Use Cursor GenerateImage ONLY (never DALL·E / OpenAI images).",
    "Generate feature 16:9 + in-article 3:4 from saved prompts, upload via scripts/complete-article-from-assets.ts, save DEV draft.",
    "Do not publish unless already asked. Then mark the signal done.",
  ].join(" ");

  process.stdout.write(
    `${JSON.stringify({ followup_message: followup })}\n`,
  );
})();
