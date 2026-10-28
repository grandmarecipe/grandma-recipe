/**
 * Copy all CMS articles from prod Convex → dev Convex.
 * Production is never written to (safe for indexed live site).
 *
 * Usage:
 *   npx tsx scripts/sync-cms-prod-to-dev.ts
 *   npm run sync:cms-dev
 *
 * Requires CMS_IMPORT_SECRET in .env.local and on both Convex deployments.
 *
 * Optional env:
 *   DEV_CONVEX_URL   — defaults to NEXT_PUBLIC_CONVEX_URL from .env.local
 *   PROD_CONVEX_URL  — defaults to https://valuable-parrot-157.convex.cloud
 *   SYNC_SLUGS       — comma-separated slugs to sync (default: all)
 */
import fs from "fs";
import path from "path";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";

const ROOT = process.cwd();
const DEFAULT_PROD_URL = "https://valuable-parrot-157.convex.cloud";

function loadEnvLocal() {
  const envPath = path.join(ROOT, ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
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

async function main() {
  loadEnvLocal();

  const devUrl =
    process.env.DEV_CONVEX_URL?.trim() ||
    process.env.NEXT_PUBLIC_CONVEX_URL?.trim();
  const prodUrl = process.env.PROD_CONVEX_URL?.trim() || DEFAULT_PROD_URL;
  const importSecret = process.env.CMS_IMPORT_SECRET?.trim();
  const slugFilter = process.env.SYNC_SLUGS?.split(",")
    .map((slug) => slug.trim())
    .filter(Boolean);

  if (!devUrl) throw new Error("Missing DEV_CONVEX_URL / NEXT_PUBLIC_CONVEX_URL.");
  if (!importSecret) {
    throw new Error("Missing CMS_IMPORT_SECRET in .env.local.");
  }
  if (devUrl === prodUrl) {
    throw new Error("Dev and prod Convex URLs are the same — refusing to run.");
  }

  console.log(`Source (prod): ${prodUrl}`);
  console.log(`Target (dev):  ${devUrl}`);
  console.log("Prod will NOT be modified.\n");

  const prodClient = new ConvexHttpClient(prodUrl);
  const devClient = new ConvexHttpClient(devUrl);

  let items = await prodClient.query(api.articles.listIdsForSync, {
    secret: importSecret,
  });

  if (slugFilter?.length) {
    items = items.filter((item) => slugFilter.includes(item.slug));
  }

  if (items.length === 0) {
    console.log("No CMS articles found in prod.");
    return;
  }

  console.log(`Syncing ${items.length} CMS article(s) from prod → dev…`);

  let inserted = 0;
  let updated = 0;
  let failed = 0;
  const statusCounts = { published: 0, draft: 0 };

  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    try {
      const article = await prodClient.query(api.articles.exportOneForSync, {
        secret: importSecret,
        id: item.id as Id<"articles">,
      });
      if (!article) throw new Error("Article not found in prod.");

      const result = await devClient.mutation(api.articles.syncArticleFull, {
        secret: importSecret,
        article,
      });

      if (result.action === "insert") inserted += 1;
      else updated += 1;
      if (article.status === "published") statusCounts.published += 1;
      else statusCounts.draft += 1;

      console.log(
        `[${i + 1}/${items.length}] ${result.action} ${result.slug} (${article.status})`,
      );
    } catch (error) {
      failed += 1;
      const message = error instanceof Error ? error.message : String(error);
      console.error(`FAIL ${item.slug}: ${message}`);
    }
  }

  console.log(
    `\nDone. inserted=${inserted} updated=${updated} failed=${failed}`,
  );
  console.log(
    `Statuses copied: published=${statusCounts.published} draft=${statusCounts.draft}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
