/**
 * Push draft CMS articles that have a schedule from DEV → PROD.
 * Keeps status=draft on PROD; Convex cron publishes when due.
 *
 * Usage:
 *   npx tsx scripts/push-scheduled-to-prod.ts
 *   SYNC_SLUGS=slug-a,slug-b npx tsx scripts/push-scheduled-to-prod.ts
 *
 * Requires CMS_IMPORT_SECRET in .env.local (and both Convex deployments).
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
  if (devUrl === prodUrl) throw new Error("Dev URL equals prod — aborting.");

  console.log(`Dev:  ${devUrl}`);
  console.log(`Prod: ${prodUrl}`);

  const devClient = new ConvexHttpClient(devUrl);
  const prodClient = new ConvexHttpClient(prodUrl);

  let items = await devClient.query(api.articles.listIdsForSync, {
    secret: importSecret,
  });

  items = items.filter(
    (item) =>
      item.status === "draft" && Boolean(item.scheduledPublishAt?.trim()),
  );

  if (slugFilter?.length) {
    items = items.filter((item) => slugFilter.includes(item.slug));
  }

  if (items.length === 0) {
    console.log("No scheduled drafts found in DEV.");
    return;
  }

  console.log(`Pushing ${items.length} scheduled draft(s) to PROD…`);

  let inserted = 0;
  let updated = 0;
  let failed = 0;

  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    try {
      const article = await devClient.query(api.articles.exportOneForSync, {
        secret: importSecret,
        id: item.id as Id<"articles">,
      });
      if (!article) throw new Error("Article not found in DEV.");
      if (!article.featuredImage?.trim()) {
        throw new Error("Missing featured image — complete images first.");
      }

      const payload = {
        ...article,
        status: "draft" as const,
        scheduledPublishAt: article.scheduledPublishAt,
      };

      const result = await prodClient.mutation(api.articles.syncArticleFull, {
        secret: importSecret,
        article: payload,
      });

      if (result.action === "insert") inserted += 1;
      else updated += 1;

      console.log(
        `[${i + 1}/${items.length}] ${result.action} ${result.slug} → draft, schedule ${article.scheduledPublishAt}`,
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
    "PROD cron publishes each draft within ~10 minutes of its scheduled time.",
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
