/**
 * Seed Convex with existing local ratings/comments JSON.
 *
 * Usage (with `npx convex dev` running, or after deploy):
 *   npx tsx scripts/seed-convex-ugc.ts
 */
import fs from "node:fs";
import path from "node:path";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

async function main() {
  loadEnvLocal();
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    throw new Error("Missing NEXT_PUBLIC_CONVEX_URL in .env.local");
  }

  const client = new ConvexHttpClient(url);
  const ratingsPath = path.join(process.cwd(), "data", "ratings.json");
  const commentsPath = path.join(process.cwd(), "data", "comments.json");

  if (fs.existsSync(ratingsPath)) {
    const ratings = JSON.parse(fs.readFileSync(ratingsPath, "utf8")) as Record<
      string,
      { sum: number; count: number }
    >;
    const entries = Object.entries(ratings).map(([slug, value]) => ({
      slug,
      sum: value.sum,
      count: value.count,
    }));
    const result = await client.mutation(api.ratings.seedFromJson, { entries });
    console.log("Ratings seeded:", result);
  }

  if (fs.existsSync(commentsPath)) {
    const comments = JSON.parse(
      fs.readFileSync(commentsPath, "utf8"),
    ) as Record<
      string,
      Array<{ name: string; body: string; createdAt: string }>
    >;
    const entries = Object.entries(comments).flatMap(([slug, list]) =>
      list.map((item) => ({
        slug,
        name: item.name,
        body: item.body,
        createdAt: item.createdAt,
      })),
    );
    const result = await client.mutation(api.comments.seedFromJson, {
      entries,
    });
    console.log("Comments seeded:", result);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
