import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import fs from "fs";
import path from "path";

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#") || !t.includes("=")) continue;
    const i = t.indexOf("=");
    const k = t.slice(0, i);
    let v = t.slice(i + 1);
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    if (!process.env[k]) process.env[k] = v;
  }
}

async function main() {
  loadEnvLocal();
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) throw new Error("Missing NEXT_PUBLIC_CONVEX_URL");
  const client = new ConvexHttpClient(url);
  const secret =
    process.env.CMS_IMPORT_SECRET || "grandma-sheet-import-2026-08-25-temp";

  let cursor: string | null = null;
  let totalMoved = 0;
  let totalScanned = 0;

  for (let i = 0; i < 200; i += 1) {
    const r = await client.mutation(api.articles.migrateBodiesBatch, {
      secret,
      cursor,
      limit: 10,
    });
    totalMoved += r.moved;
    totalScanned += r.scanned;
    console.log(`batch ${i + 1}`, r);
    if (r.isDone) break;
    cursor = r.continueCursor;
  }

  console.log(`DONE moved=${totalMoved} scanned=${totalScanned}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
