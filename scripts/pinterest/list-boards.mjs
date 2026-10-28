#!/usr/bin/env node
/** List boards so you can copy board IDs into pin packs / .env.local */
import { pinterestFetch } from "./lib.mjs";

const data = await pinterestFetch("/boards?page_size=50");
const items = data.items ?? [];
if (!items.length) {
  console.log("No boards found.");
  process.exit(0);
}

console.log("Board ID → name\n");
for (const b of items) {
  console.log(`${b.id}\t${b.name}`);
}
