/**
 * Upload feature image for easy-chicken-recipes pillar and embed
 * relevant existing chicken recipe photos into cluster sections.
 *
 * Usage: npx tsx scripts/enhance-chicken-recipes-pillar-images.ts
 */
import fs from "fs";
import path from "path";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";
import { convertRecipeImageToWebp } from "../src/lib/recipe-image-process";
import {
  buildRecipeImageBasename,
  buildRecipeImageR2Key,
  r2KeyToPublicPath,
} from "../src/lib/recipe-image-upload";
import { putR2Object } from "../src/lib/r2";

const ROOT = process.cwd();
const FEATURE_PNG =
  "/Users/talhaoui/.cursor/projects/Users-talhaoui-Desktop-cursor-projects-grandma-recipe/assets/easy-chicken-recipes-feature.png";
const SLUG = "easy-chicken-recipes";

function loadEnvLocal() {
  const envPath = path.join(ROOT, ".env.local");
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq < 0) continue;
    const k = t.slice(0, eq).trim();
    let v = t.slice(eq + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    if (!process.env[k]) process.env[k] = v;
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function figureHtml(input: {
  src: string;
  alt: string;
  caption: string;
}): string {
  return `<figure class="wp-block-image aligncenter size-large"><img decoding="async" loading="lazy" src="${escapeHtml(input.src)}" alt="${escapeHtml(input.alt)}" />
<figcaption class="wp-element-caption">${escapeHtml(input.caption)}</figcaption>
</figure>`;
}

/** Insert figure after first matching h2 id, replacing an existing figure if present. */
function insertAfterHeading(
  html: string,
  headingId: string,
  figure: string,
): string {
  const re = new RegExp(
    `(<h2[^>]*id=["']${headingId}["'][^>]*>[\\s\\S]*?<\\/h2>)(\\s*(?:<figure[\\s\\S]*?<\\/figure>)?)`,
    "i",
  );
  if (!re.test(html)) {
    console.warn(`Heading not found: ${headingId}`);
    return html;
  }
  return html.replace(re, `$1\n${figure}`);
}

async function main() {
  loadEnvLocal();
  const devUrl = process.env.NEXT_PUBLIC_CONVEX_URL?.trim();
  const secret = process.env.CMS_IMPORT_SECRET?.trim();
  if (!devUrl || !secret) throw new Error("Missing Convex URL or secret");
  if (!fs.existsSync(FEATURE_PNG)) {
    throw new Error(`Missing feature PNG: ${FEATURE_PNG}`);
  }

  const client = new ConvexHttpClient(devUrl);
  const items = await client.query(api.articles.listIdsForSync, { secret });
  const item = items.find((r) => r.slug === SLUG);
  if (!item) throw new Error(`Article ${SLUG} not found`);

  const existing = await client.query(api.articles.exportOneForSync, {
    secret,
    id: item.id as Id<"articles">,
  });
  if (!existing) throw new Error("Could not export article");

  const featureMeta = {
    alt: "Easy chicken recipes featuring roast chicken, baked chicken, pasta, and family dinner sides",
    title: "Easy Chicken Recipes Homestyle Dinner Spread",
    caption:
      "A welcoming chicken dinner spread: roast chicken, baked pieces, pasta, and cozy supper sides.",
    description:
      "Feature image for the easy chicken recipes hub showing a home-style chicken dinner table.",
  };

  const processed = await convertRecipeImageToWebp(
    fs.readFileSync(FEATURE_PNG),
    "Easy Chicken Recipes Homestyle Dinner Spread",
    "feature",
    {
      caption: featureMeta.caption,
      description: featureMeta.description,
    },
  );
  const basename = buildRecipeImageBasename({
    metadata: featureMeta,
    focusKeyword: "chicken recipes",
    slug: SLUG,
  });
  const r2Key = buildRecipeImageR2Key(basename);
  await putR2Object(r2Key, processed.buffer, "image/webp", {
    "alt-text": featureMeta.alt,
    title: featureMeta.title,
    caption: featureMeta.caption,
    description: featureMeta.description,
    "focus-keyword": "chicken recipes",
    section: "feature",
  });
  const featurePath = r2KeyToPublicPath(r2Key);
  console.log(`Uploaded feature → ${featurePath} (${processed.width}x${processed.height})`);

  // Relevant existing recipe photos for each cluster section
  const sectionPhotos: {
    headingId: string;
    src: string;
    alt: string;
    caption: string;
  }[] = [
    {
      headingId: "baked-and-roasted-chicken",
      src: "/wp-content/uploads/2026/09/How-To-Roast-A-Chicken-With-Herbs-And-Garlic.webp",
      alt: "Golden herb-roasted chicken with garlic, vegetables, and pan juices",
      caption:
        "Start with a golden roast — then explore baked breasts, thighs, and sheet-pan chicken below.",
    },
    {
      headingId: "ground-chicken-recipes",
      src: "/wp-content/uploads/2026/09/Ground-Chicken-Recipes-Cozy-Skillet-Chicken-Meatballs.webp",
      alt: "Skillet chicken meatballs in tomato sauce with noodles and Parmesan",
      caption:
        "Ground chicken recipes shine in skillet meatballs and cozy weeknight sauces.",
    },
    {
      headingId: "chicken-pasta-recipes",
      src: "/wp-content/uploads/2025/07/Indulge-in-Marry-Me-Chicken-Pasta.webp",
      alt: "Creamy marry me chicken pasta topped with fresh basil and Parmesan",
      caption:
        "Chicken pasta night: creamy skillets, baked ziti, and crockpot Alfredo.",
    },
    {
      headingId: "chicken-casserole-recipes",
      src: "/wp-content/uploads/2025/09/Delicious-Chicken-Broccoli-Rice-Casserole.webp",
      alt: "Golden chicken broccoli rice casserole topped with cheddar and breadcrumbs",
      caption:
        "Chicken casseroles bring rice, broccoli, and a bubbling golden top to the table.",
    },
    {
      headingId: "wings-and-crispy-chicken",
      src: "/wp-content/uploads/2026/01/Crispy-Buffalo-Chicken-Wings.webp",
      alt: "Crispy buffalo chicken wings with celery and blue cheese dressing",
      caption:
        "Wings, tenders, and air-fryer cutlets for crispy chicken nights.",
    },
    {
      headingId: "crockpot-and-slow-cooker-chicken",
      src: "/wp-content/uploads/2025/08/Delicious-Slow-Cooker-Chicken-and-Rice-1.webp",
      alt: "Slow cooker chicken and rice with vegetables and parsley",
      caption:
        "Hands-off crockpot chicken: rice dinners, chili, stroganoff, and more.",
    },
    {
      headingId: "sheet-pan-skillet-and-wraps",
      src: "/wp-content/uploads/2026/01/Delicious-Hawaiian-Chicken-Sheet-Pan.webp",
      alt: "Hawaiian chicken sheet pan with pineapple, peppers, and onions",
      caption:
        "Sheet-pan and skillet chicken keep weeknights simple and colorful.",
    },
    {
      headingId: "choose-your-chicken-cut",
      src: "/wp-content/uploads/2026/09/Juicy-Baked-Chicken-Breast-With-Garlic-And-Herbs.webp",
      alt: "Juicy baked chicken breast with garlic, herbs, and lemon",
      caption:
        "Pick your cut first — breast, thighs, whole chicken, ground, or wings.",
    },
  ];

  let html = existing.contentHtml;
  for (const photo of sectionPhotos) {
    html = insertAfterHeading(
      html,
      photo.headingId,
      figureHtml({
        src: photo.src,
        alt: photo.alt,
        caption: photo.caption,
      }),
    );
  }

  const now = new Date().toISOString();
  const result = await client.mutation(api.articles.syncArticleFull, {
    secret,
    article: {
      slug: existing.slug,
      title: existing.title,
      excerpt: existing.excerpt,
      category: existing.category,
      categories: existing.categories,
      contentHtml: html,
      ingredients: existing.ingredients ?? [],
      instructions: existing.instructions ?? [],
      featuredImage: featurePath,
      featuredImageAlt: featureMeta.alt,
      featuredImageCaption: featureMeta.caption,
      featuredImageDescription: featureMeta.description,
      seoTitle: existing.seoTitle,
      seoDescription: existing.seoDescription,
      focusKeyword: existing.focusKeyword,
      prepTime: existing.prepTime,
      cookTime: existing.cookTime,
      totalTime: existing.totalTime,
      servings: existing.servings,
      calories: existing.calories,
      cuisine: existing.cuisine,
      course: existing.course,
      status: "draft",
      publishedAt: existing.publishedAt || now,
      modifiedAt: now,
      imageAssets: {
        feature: {
          publicPath: featurePath,
          r2Key,
          alt: featureMeta.alt,
          title: featureMeta.title,
          caption: featureMeta.caption,
          description: featureMeta.description,
          uploadedAt: now,
          width: processed.width,
          height: processed.height,
        },
      },
    },
  });

  console.log(
    JSON.stringify(
      {
        ...result,
        featuredImage: featurePath,
        inArticlePhotos: sectionPhotos.length,
        admin: `http://localhost:3000/admin/articles/${result.id}/`,
      },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
