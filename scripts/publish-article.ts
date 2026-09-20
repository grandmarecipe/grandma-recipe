/**
 * Publish a single CMS article by slug:
 * DEV published → PROD sync → content/recipes + index.json
 *
 * Usage: COMPLETE_ARTICLE_SLUG=my-slug npx tsx scripts/publish-article.ts
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

  const slug =
    process.env.COMPLETE_ARTICLE_SLUG?.trim() || process.argv[2]?.trim() || "";
  if (!slug) {
    throw new Error(
      "Usage: COMPLETE_ARTICLE_SLUG=my-slug npx tsx scripts/publish-article.ts",
    );
  }

  const devUrl =
    process.env.DEV_CONVEX_URL?.trim() ||
    process.env.NEXT_PUBLIC_CONVEX_URL?.trim();
  const prodUrl = process.env.PROD_CONVEX_URL?.trim() || DEFAULT_PROD_URL;
  const secret = process.env.CMS_IMPORT_SECRET?.trim();
  if (!devUrl) throw new Error("Missing NEXT_PUBLIC_CONVEX_URL");
  if (!secret) throw new Error("Missing CMS_IMPORT_SECRET");
  if (devUrl === prodUrl) throw new Error("Dev URL equals prod — aborting.");

  const now = new Date().toISOString();
  const dev = new ConvexHttpClient(devUrl);
  const prod = new ConvexHttpClient(prodUrl);

  const items = await dev.query(api.articles.listIdsForSync, { secret });
  const item = items.find((row) => row.slug === slug);
  if (!item) throw new Error(`Missing ${slug} on DEV`);

  const existing = await dev.query(api.articles.exportOneForSync, {
    secret,
    id: item.id as Id<"articles">,
  });
  if (!existing) throw new Error("Could not export article");
  if (!existing.featuredImage) {
    throw new Error("Refusing to publish without featured image");
  }

  const published = {
    ...existing,
    status: "published" as const,
    publishedAt: existing.publishedAt?.trim() || now,
    modifiedAt: now,
    scheduledPublishAt: undefined,
  };

  console.log("Publishing on DEV…");
  const devResult = await dev.mutation(api.articles.syncArticleFull, {
    secret,
    article: published,
  });
  console.log(`DEV: ${devResult.action} ${devResult.slug} (${published.status})`);

  console.log("Syncing to PROD…");
  const prodResult = await prod.mutation(api.articles.syncArticleFull, {
    secret,
    article: published,
  });
  console.log(`PROD: ${prodResult.action} ${prodResult.slug} (${published.status})`);

  const recipePath = path.join(ROOT, "content/recipes", `${slug}.json`);
  const recipeFile = {
    slug: published.slug,
    title: published.title,
    excerpt: published.excerpt,
    category: published.category,
    categories: published.categories?.length
      ? published.categories
      : [published.category],
    publishedAt: published.publishedAt,
    modifiedAt: published.modifiedAt,
    featuredImage: published.featuredImage,
    featuredImageAlt: published.featuredImageAlt,
    contentHtml: published.contentHtml,
    ingredients: published.ingredients,
    instructions: published.instructions,
    seoTitle: published.seoTitle,
    seoDescription: published.seoDescription,
    prepTime: published.prepTime,
    cookTime: published.cookTime,
    totalTime: published.totalTime,
    servings: published.servings,
    calories: published.calories,
    cuisine: published.cuisine,
    course: published.course,
  };
  fs.writeFileSync(recipePath, `${JSON.stringify(recipeFile, null, 2)}\n`);
  console.log(`Wrote ${recipePath}`);

  const indexPath = path.join(ROOT, "content/index.json");
  const index = JSON.parse(fs.readFileSync(indexPath, "utf8")) as {
    recipes: Array<Record<string, unknown>>;
    [key: string]: unknown;
  };
  const meta = {
    slug: recipeFile.slug,
    title: recipeFile.title,
    excerpt: recipeFile.excerpt,
    category: recipeFile.category,
    categories: recipeFile.categories,
    publishedAt: recipeFile.publishedAt,
    modifiedAt: recipeFile.modifiedAt,
    featuredImage: recipeFile.featuredImage,
    featuredImageAlt: recipeFile.featuredImageAlt,
  };
  const idx = index.recipes.findIndex((row) => row.slug === slug);
  if (idx >= 0) index.recipes[idx] = meta;
  else index.recipes.push(meta);
  index.recipes.sort((a, b) =>
    String(a.publishedAt) < String(b.publishedAt)
      ? 1
      : String(a.publishedAt) > String(b.publishedAt)
        ? -1
        : 0,
  );
  fs.writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`);
  console.log(`Updated content/index.json (${index.recipes.length} recipes)`);
  console.log(`\nLive URL after deploy: https://www.grandmarecipe.com/${slug}/`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
