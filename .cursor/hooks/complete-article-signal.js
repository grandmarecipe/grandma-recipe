#!/usr/bin/env node
/**
 * stop: if Complete article is pending, auto-follow up so the agent finishes
 * without waiting for a typed chat message.
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
    `${JSON.stringify({ followup_message: followupFor(signal) })}\n`,
  );
})();
