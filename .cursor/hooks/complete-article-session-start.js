#!/usr/bin/env node
/**
 * sessionStart: inject pending Complete article into new Agent chats
 * in this workspace so the agent sees it immediately.
 */
const {
  readPendingSignal,
  followupFor,
  readStdin,
} = require("./complete-article-lib.js");

(async () => {
  await readStdin();
  const signal = readPendingSignal();
  if (!signal) {
    process.stdout.write("{}\n");
    return;
  }
  process.stdout.write(
    `${JSON.stringify({
      additional_context: [
        "PRIORITY — Complete article signal is PENDING.",
        followupFor(signal),
        "Start this work now without waiting for another user message.",
      ].join(" "),
    })}\n`,
  );
})();
