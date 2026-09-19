/**
 * Upload pre-generated section images for a CMS draft on DEV and attach meta.
 * Reads article from Convex by COMPLETE_ARTICLE_SLUG (or argv).
 * Image PNGs live under Cursor assets as {basename}-{section}.png
 *
 * Usage:
 *   COMPLETE_ARTICLE_SLUG=what-is-a-light-roast-coffee-a-bright-gentle-brew \
 *   COMPLETE_ARTICLE_BASENAME=light-roast-coffee \
 *   npx tsx scripts/complete-article-from-assets.ts
 */
import fs from "fs";
import path from "path";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";
import { insertRecipeImageIntoArticle } from "../src/lib/article-image-insert";
import { convertRecipeImageToWebp } from "../src/lib/recipe-image-process";
import {
  buildRecipeImageBasename,
  buildRecipeImageR2Key,
  buildRecipeImageSubjectName,
  r2KeyToPublicPath,
  type RecipeImageSection,
} from "../src/lib/recipe-image-upload";
import { putR2Object } from "../src/lib/r2";
import type {
  FeatureImagePromptResult,
  ImageAssetRecord,
  ImagePromptBundle,
  SectionImagePromptResult,
} from "../src/lib/image-prompt-types";

const ROOT = process.cwd();
const ASSETS_DIR =
  "/Users/talhaoui/.cursor/projects/Users-talhaoui-Desktop-cursor-projects-grandma-recipe/assets";
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

function polishHtml(html: string, focusKeyword: string): string {
  const pretty = focusKeyword
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return html
    .replace(
      /<h2[^>]*>\s*Why You'll Love This [^<]*<\/h2>/i,
      `<h2 id="why-youll-love-this">Why You'll Love This ${pretty}</h2>`,
    )
    .replace(
      /<h2[^>]*>\s*Ingredients\s*<\/h2>/i,
      '<h2 id="ingredients">Ingredients</h2>',
    )
    .replace(
      /<h2[^>]*>\s*How to Make [^<]*<\/h2>/i,
      `<h2 id="how-to-make">How to Make ${pretty}</h2>`,
    )
    .replace(
      /<h2[^>]*>\s*Recipe Snapshot\s*<\/h2>/i,
      '<h2 id="recipe-snapshot">Recipe Snapshot</h2>',
    )
    .replace(
      /<h2[^>]*>\s*Pro Tips for Making [^<]*<\/h2>/i,
      `<h2 id="pro-tips">Pro Tips for Making ${pretty}</h2>`,
    )
    .replace(
      /<h2[^>]*>\s*How to Serve this [^<]*<\/h2>/i,
      `<h2 id="how-to-serve">How to Serve ${pretty}</h2>`,
    )
    .replace(
      /<h2[^>]*>\s*Make Ahead and Storage\s*<\/h2>/i,
      '<h2 id="make-ahead-and-storage">Make Ahead and Storage</h2>',
    )
    .replace(
      /<h2[^>]*>\s*Final Thoughts\s*<\/h2>/i,
      '<h2 id="final-thoughts">Final Thoughts</h2>',
    )
    .replace(/<h2[^>]*>\s*FAQs\s*<\/h2>/i, '<h2 id="faqs">FAQs</h2>');
}

function metaForSection(
  section: RecipeImageSection,
  prompts: {
    feature: FeatureImagePromptResult;
    ingredients: SectionImagePromptResult;
    how_to_make: SectionImagePromptResult;
    how_to_serve: SectionImagePromptResult;
  },
) {
  if (section === "feature") {
    return {
      alt: prompts.feature.alt_text_1,
      title: prompts.feature.title_1,
      caption: prompts.feature.caption_1,
      description: prompts.feature.description_1,
    };
  }
  const row = prompts[section];
  return {
    alt: row.alt_text,
    title: row.title,
    caption: row.caption,
    description: row.description,
  };
}

async function uploadSection(
  section: RecipeImageSection,
  filePath: string,
  focus: string,
  slug: string,
  prompts: {
    feature: FeatureImagePromptResult;
    ingredients: SectionImagePromptResult;
    how_to_make: SectionImagePromptResult;
    how_to_serve: SectionImagePromptResult;
  },
): Promise<ImageAssetRecord> {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing image file: ${filePath}`);
  }
  const metadata = metaForSection(section, prompts);
  const subjectName = buildRecipeImageSubjectName({
    section,
    metadata,
    focusKeyword: focus,
    slug,
  });
  const processed = await convertRecipeImageToWebp(
    fs.readFileSync(filePath),
    subjectName,
    section,
    { caption: metadata.caption, description: metadata.description },
  );
  const basename = buildRecipeImageBasename({
    metadata,
    focusKeyword: focus,
    slug,
  });
  const r2Key = buildRecipeImageR2Key(basename);
  await putR2Object(r2Key, processed.buffer, "image/webp", {
    "alt-text": metadata.alt,
    title: metadata.title,
    caption: metadata.caption,
    description: metadata.description,
    "focus-keyword": focus,
    section,
    "subject-name": subjectName,
  });
  const publicPath = r2KeyToPublicPath(r2Key);
  console.log(`Uploaded ${section} → ${publicPath} (${processed.width}x${processed.height})`);
  return {
    publicPath,
    r2Key,
    alt: metadata.alt,
    title: metadata.title,
    caption: metadata.caption,
    description: metadata.description,
    uploadedAt: new Date().toISOString(),
    width: processed.width,
    height: processed.height,
  };
}

async function main() {
  loadEnvLocal();

  const slug =
    process.env.COMPLETE_ARTICLE_SLUG?.trim() ||
    process.argv[2]?.trim() ||
    "";
  const basename =
    process.env.COMPLETE_ARTICLE_BASENAME?.trim() ||
    process.argv[3]?.trim() ||
    "";
  if (!slug || !basename) {
    throw new Error(
      "Usage: COMPLETE_ARTICLE_SLUG=… COMPLETE_ARTICLE_BASENAME=… npx tsx scripts/complete-article-from-assets.ts",
    );
  }

  const devUrl = process.env.NEXT_PUBLIC_CONVEX_URL?.trim();
  const prodUrl =
    process.env.PROD_CONVEX_URL?.trim() || DEFAULT_PROD_URL;
  const secret = process.env.CMS_IMPORT_SECRET?.trim();
  if (!devUrl) throw new Error("Missing NEXT_PUBLIC_CONVEX_URL");
  if (!secret) throw new Error("Missing CMS_IMPORT_SECRET");
  if (devUrl === prodUrl) throw new Error("Dev URL equals prod — aborting.");

  const imageFiles: Record<RecipeImageSection, string> = {
    feature: path.join(ASSETS_DIR, `${basename}-feature.png`),
    ingredients: path.join(ASSETS_DIR, `${basename}-ingredients.png`),
    how_to_make: path.join(ASSETS_DIR, `${basename}-how-to-make.png`),
    how_to_serve: path.join(ASSETS_DIR, `${basename}-how-to-serve.png`),
  };

  const client = new ConvexHttpClient(devUrl);
  const items = await client.query(api.articles.listIdsForSync, { secret });
  const item = items.find((row) => row.slug === slug);
  if (!item) throw new Error(`Article ${slug} not found on DEV`);

  const existing = await client.query(api.articles.exportOneForSync, {
    secret,
    id: item.id as Id<"articles">,
  });
  if (!existing) throw new Error("Could not export article");
  if (!existing.imagePrompts?.feature) {
    throw new Error("Article is missing saved image prompts.");
  }

  const focus =
    existing.focusKeyword?.trim() ||
    existing.imagePrompts.focusKeyword ||
    slug.replace(/-/g, " ");

  const promptsRaw = {
    feature: existing.imagePrompts.feature,
    ingredients: existing.imagePrompts.ingredients!,
    how_to_make: existing.imagePrompts.how_to_make!,
    how_to_serve: existing.imagePrompts.how_to_serve!,
  };
  if (
    !promptsRaw.ingredients ||
    !promptsRaw.how_to_make ||
    !promptsRaw.how_to_serve
  ) {
    throw new Error("Need all four image prompt sections saved first.");
  }

  const imagePrompts: ImagePromptBundle = {
    focusKeyword: focus,
    ...promptsRaw,
  };

  console.log(`Target DEV only: ${devUrl}`);
  console.log(`Slug: ${slug} · focus: ${focus}`);

  const assets = {
    feature: await uploadSection(
      "feature",
      imageFiles.feature,
      focus,
      slug,
      promptsRaw,
    ),
    ingredients: await uploadSection(
      "ingredients",
      imageFiles.ingredients,
      focus,
      slug,
      promptsRaw,
    ),
    how_to_make: await uploadSection(
      "how_to_make",
      imageFiles.how_to_make,
      focus,
      slug,
      promptsRaw,
    ),
    how_to_serve: await uploadSection(
      "how_to_serve",
      imageFiles.how_to_serve,
      focus,
      slug,
      promptsRaw,
    ),
  };

  let contentHtml = polishHtml(existing.contentHtml, focus);
  for (const section of ["ingredients", "how_to_make", "how_to_serve"] as const) {
    contentHtml = insertRecipeImageIntoArticle({
      contentHtml,
      section,
      src: assets[section].publicPath,
      alt: assets[section].alt,
      caption: assets[section].caption,
      width: assets[section].width,
      height: assets[section].height,
    });
  }

  const keepStatus = existing.status === "published" ? "published" : "draft";
  const article = {
    ...existing,
    focusKeyword: focus,
    featuredImage: assets.feature.publicPath,
    featuredImageAlt: assets.feature.alt,
    featuredImageCaption: assets.feature.caption,
    featuredImageDescription: assets.feature.description,
    contentHtml,
    status: keepStatus,
    imagePrompts,
    imageAssets: assets,
    modifiedAt: new Date().toISOString(),
  };

  const result = await client.mutation(api.articles.syncArticleFull, {
    secret,
    article,
  });

  console.log(`\nSaved on DEV: ${result.action} ${result.slug} (${keepStatus})`);
  console.log(`Admin: http://localhost:3000/admin/articles/${result.id}/`);
  console.log("Featured:", assets.feature.publicPath);
  console.log("Production was NOT modified.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
