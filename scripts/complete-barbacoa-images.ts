/**
 * Complete slow-cooker-style-beef-barbacoa draft on DEV:
 * upload generated images to R2, insert into HTML, save prompts/assets/meta.
 * Does NOT write to production or change status from draft.
 *
 * Usage: npx tsx scripts/complete-barbacoa-images.ts
 */
import fs from "fs";
import path from "path";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
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
const FOCUS = "barbacoa";
const SLUG = "slow-cooker-style-beef-barbacoa";
const ASSETS_DIR =
  "/Users/talhaoui/.cursor/projects/Users-talhaoui-Desktop-cursor-projects-grandma-recipe/assets";

const IMAGE_FILES: Record<RecipeImageSection, string> = {
  feature: path.join(ASSETS_DIR, "barbacoa-feature.png"),
  ingredients: path.join(ASSETS_DIR, "barbacoa-ingredients.png"),
  how_to_make: path.join(ASSETS_DIR, "barbacoa-how-to-make.png"),
  how_to_serve: path.join(ASSETS_DIR, "barbacoa-how-to-serve.png"),
};

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

function polishHtml(html: string): string {
  return html
    .replace(
      /<h2[^>]*>\s*Why You'll Love This barbacoa\s*<\/h2>/i,
      '<h2 id="why-youll-love-this-barbacoa">Why You\'ll Love This Barbacoa</h2>',
    )
    .replace(
      /<h2[^>]*>\s*Ingredients\s*<\/h2>/i,
      '<h2 id="ingredients">Ingredients</h2>',
    )
    .replace(
      /<h2[^>]*>\s*How to Make barbacoa\s*<\/h2>/i,
      '<h2 id="how-to-make-barbacoa">How to Make Barbacoa</h2>',
    )
    .replace(
      /<h2[^>]*>\s*Recipe Snapshot\s*<\/h2>/i,
      '<h2 id="recipe-snapshot">Recipe Snapshot</h2>',
    )
    .replace(
      /<h2[^>]*>\s*Pro Tips for Making barbacoa\s*<\/h2>/i,
      '<h2 id="pro-tips">Pro Tips for Making Barbacoa</h2>',
    )
    .replace(
      /<h2[^>]*>\s*How to Serve this barbacoa\s*<\/h2>/i,
      '<h2 id="how-to-serve-barbacoa">How to Serve This Barbacoa</h2>',
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
  prompts: {
    feature: FeatureImagePromptResult;
    ingredients: SectionImagePromptResult;
    how_to_make: SectionImagePromptResult;
    how_to_serve: SectionImagePromptResult;
  },
): Promise<ImageAssetRecord> {
  const filePath = IMAGE_FILES[section];
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing image file: ${filePath}`);
  }
  const metadata = metaForSection(section, prompts);
  const subjectName = buildRecipeImageSubjectName({
    section,
    metadata,
    focusKeyword: FOCUS,
    slug: SLUG,
  });
  const processed = await convertRecipeImageToWebp(
    fs.readFileSync(filePath),
    subjectName,
    section,
    { caption: metadata.caption, description: metadata.description },
  );
  const basename = buildRecipeImageBasename({
    metadata,
    focusKeyword: FOCUS,
    slug: SLUG,
  });
  const r2Key = buildRecipeImageR2Key(basename);
  await putR2Object(r2Key, processed.buffer, "image/webp", {
    "alt-text": metadata.alt,
    title: metadata.title,
    caption: metadata.caption,
    description: metadata.description,
    "focus-keyword": FOCUS,
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

  const devUrl = process.env.NEXT_PUBLIC_CONVEX_URL?.trim();
  const prodUrl =
    process.env.PROD_CONVEX_URL?.trim() ||
    "https://valuable-parrot-157.convex.cloud";
  const secret = process.env.CMS_IMPORT_SECRET?.trim();
  if (!devUrl) throw new Error("Missing NEXT_PUBLIC_CONVEX_URL");
  if (!secret) throw new Error("Missing CMS_IMPORT_SECRET");
  if (devUrl === prodUrl) {
    throw new Error("Dev URL equals prod — refusing to run.");
  }

  const promptsBundle = JSON.parse(
    fs.readFileSync(path.join(ROOT, ".tmp", "barbacoa-prompts.json"), "utf8"),
  ) as ImagePromptBundle & {
    feature: FeatureImagePromptResult;
    ingredients: SectionImagePromptResult;
    how_to_make: SectionImagePromptResult;
    how_to_serve: SectionImagePromptResult;
  };

  const promptsRaw = {
    feature: promptsBundle.feature,
    ingredients: promptsBundle.ingredients,
    how_to_make: promptsBundle.how_to_make,
    how_to_serve: promptsBundle.how_to_serve,
  };

  const imagePrompts: ImagePromptBundle = {
    focusKeyword: FOCUS,
    ...promptsRaw,
  };

  console.log(`Target DEV only: ${devUrl}`);
  console.log("Uploading images to R2…");

  const assets = {
    feature: await uploadSection("feature", promptsRaw),
    ingredients: await uploadSection("ingredients", promptsRaw),
    how_to_make: await uploadSection("how_to_make", promptsRaw),
    how_to_serve: await uploadSection("how_to_serve", promptsRaw),
  };

  const client = new ConvexHttpClient(devUrl);
  const items = await client.query(api.articles.listIdsForSync, { secret });
  const item = items.find((row) => row.slug === SLUG);
  if (!item) throw new Error(`Article ${SLUG} not found on DEV`);

  const existing = await client.query(api.articles.exportOneForSync, {
    secret,
    id: item.id,
  });
  if (!existing) throw new Error("Could not export article from DEV");
  // Keep whatever status it already has (draft or published).
  const keepStatus = existing.status === "published" ? "published" : "draft";

  let contentHtml = polishHtml(existing.contentHtml);
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

  const article = {
    ...existing,
    focusKeyword: FOCUS,
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
  console.log("Production was NOT modified by this script.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
