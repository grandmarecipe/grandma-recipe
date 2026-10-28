/**
 * Create Easy Egg Recipes pillar guide on DEV (draft).
 * No pork / no alcohol recipes linked.
 *
 * Usage: npx tsx scripts/create-egg-recipes-pillar.ts
 */
import fs from "fs";
import path from "path";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import { convertRecipeImageToWebp } from "../src/lib/recipe-image-process";
import {
  buildRecipeImageBasename,
  buildRecipeImageR2Key,
  r2KeyToPublicPath,
} from "../src/lib/recipe-image-upload";
import { putR2Object } from "../src/lib/r2";

const ROOT = process.cwd();
const ASSETS =
  "/Users/talhaoui/.cursor/projects/Users-talhaoui-Desktop-cursor-projects-grandma-recipe/assets";
const FEATURE_CANDIDATES = [
  path.join(ASSETS, "egg-recipes-feature.png"),
  path.join(ASSETS, "egg-recipes-feature.jpg"),
];
const SLUG = "egg-recipes";

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

function link(slug: string, label: string) {
  return `<a href="/${slug}/"><strong>${label}</strong></a>`;
}

function figureHtml(input: { src: string; alt: string; caption: string }) {
  return `<figure class="wp-block-image aligncenter size-large"><img decoding="async" loading="lazy" src="${escapeHtml(input.src)}" alt="${escapeHtml(input.alt)}" />
<figcaption class="wp-element-caption">${escapeHtml(input.caption)}</figcaption>
</figure>`;
}

function insertAfterHeading(html: string, headingId: string, figure: string) {
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

function buildContentHtml() {
  const L = {
    baked: link("baked-eggs-and-tomatoes", "Baked Eggs and Tomatoes"),
    muffins: link(
      "breakfast-egg-and-cheese-muffins",
      "Breakfast Egg and Cheese Muffins",
    ),
    patties: link("egg-patties", "Easy Egg Patties"),
    feta: link("feta-and-egg-recipes", "Feta and Egg Omelette"),
    quiche: link("spinach-and-cheese-quiche", "Spinach and Cheese Quiche"),
    sandwich: link("egg-salad-sandwich", "Egg Salad Sandwich"),
    pastaSalad: link(
      "deviled-egg-pasta-salad",
      "Easy Deviled Egg Pasta Salad",
    ),
    devilled: link("devilled-eggs", "Devilled Eggs"),
    pie: link("egg-custard-pie", "Egg Custard Pie"),
  };

  return `
<p>A carton of eggs can become breakfast, lunch, a cookout side, or a simple dessert. This guide gathers Grandma Recipe’s best <strong>egg recipes</strong>—baked eggs, muffins, quiche, omelettes, egg salad, and classic party eggs—so you can pick a dish and cook with confidence.</p>

<p>Use this page as your starting point. Each section links to kitchen-tested recipes with clear steps and familiar pantry ingredients for busy mornings, potlucks, and easy weekend brunch.</p>

<h2 id="how-to-use-this-guide">How to Use This Egg Recipes Guide</h2>
<p>Start with the kind of egg dish you want:</p>
<ul>
<li><strong>Need a quick breakfast?</strong> Open baked eggs, egg patties, muffins, or a feta omelette.</li>
<li><strong>Want brunch for company?</strong> Spinach and cheese quiche looks special without fussy pastry work.</li>
<li><strong>Packing lunch or a picnic?</strong> Egg salad sandwiches and deviled egg pasta salad travel well.</li>
<li><strong>Hosting a party tray?</strong> Devilled eggs are always the first plate to empty.</li>
<li><strong>Craving something sweet?</strong> Egg custard pie turns pantry eggs into a cozy dessert.</li>
</ul>
<p>If you want breakfast on the table fast, start with ${L.patties} or ${L.muffins}. For a make-ahead brunch, ${L.quiche} is a lovely place to begin.</p>

<h2 id="egg-basics">Egg Basics</h2>
<p>A few steady habits keep egg recipes tender, flavorful, and reliable:</p>
<ul>
<li><strong>Use room-temperature eggs</strong> for baked dishes and custards so they mix evenly and set gently.</li>
<li><strong>Season early</strong> — a pinch of salt before cooking helps eggs taste bright, not flat.</li>
<li><strong>Cook gently</strong> for scrambled-style and omelette dishes; high heat makes eggs rubbery.</li>
<li><strong>Chill before filling</strong> when you make hard-cooked eggs for salad or party trays.</li>
<li><strong>Store leftovers covered</strong> in the fridge and reheat egg dishes gently so they stay soft.</li>
</ul>

<h2 id="breakfast-egg-recipes">Breakfast Egg Recipes</h2>
<p>Easy morning plates that feel homemade without a long weekend brunch timeline.</p>
<ul>
<li>${L.baked} — eggs baked with juicy tomatoes and herbs for a skillet-to-table breakfast.</li>
<li>${L.muffins} — portable egg and cheese muffins you can bake ahead for busy mornings.</li>
<li>${L.patties} — golden egg patties that crisp at the edges and stay tender inside.</li>
<li>${L.feta} — a fluffy feta omelette with salty cheese and fresh herbs.</li>
</ul>

<h2 id="brunch-and-bake-egg-recipes">Brunch and Bake Egg Recipes</h2>
<p>Sliceable bakes that look generous on a brunch table or light dinner plate.</p>
<ul>
<li>${L.quiche} — spinach and cheese quiche with a creamy, savory filling.</li>
</ul>

<h2 id="lunch-and-picnic-egg-recipes">Lunch and Picnic Egg Recipes</h2>
<p>Cool, packable egg dishes for sandwiches, potlucks, and backyard tables.</p>
<ul>
<li>${L.sandwich} — classic egg salad sandwich on toasted bread.</li>
<li>${L.pastaSalad} — creamy pasta salad with a playful deviled-egg twist.</li>
<li>${L.devilled} — paprika-dusted party eggs for holidays and cookouts.</li>
</ul>

<h2 id="sweet-egg-recipes">Sweet Egg Recipes</h2>
<p>When you want eggs to finish the meal instead of start it.</p>
<ul>
<li>${L.pie} — silky egg custard pie with a golden crust and simple pantry sweetness.</li>
</ul>

<h2 id="faqs">FAQs</h2>
<h3>What egg recipe should I make first?</h3>
<p>For a fast breakfast, try ${L.patties} or ${L.baked}. For company, bake ${L.quiche}. For a party platter, make ${L.devilled}.</p>
<h3>Can I make egg recipes ahead of time?</h3>
<p>Yes—${L.muffins}, ${L.quiche}, ${L.pastaSalad}, and ${L.devilled} all hold well in the fridge. Reheat breakfast bakes gently and keep cold salads chilled until serving.</p>
<h3>How do I keep scrambled-style eggs from turning rubbery?</h3>
<p>Use medium-low heat, pull them off the burner while they still look a little soft, and avoid over-stirring. Start with ${L.feta} or ${L.patties} for forgiving weeknight eggs.</p>
<h3>Are egg recipes only for breakfast?</h3>
<p>Not at all. ${L.sandwich} and ${L.pastaSalad} make easy lunches, ${L.quiche} works for light dinner, and ${L.pie} is a cozy dessert.</p>
<h3>Do leftover egg dishes reheat well?</h3>
<p>Most do. Cover muffins and quiche so they stay moist, warm gently, and keep egg salad and pasta salad cold rather than reheating them.</p>

<h2 id="final-thoughts">Final Thoughts</h2>
<p>Good <strong>egg recipes</strong> do not need fancy technique—just fresh eggs, honest seasoning, and a pan or baking dish you trust. Bookmark this guide, pick a cluster, and make one egg dish at a time. Before long you will have breakfast bakes, picnic salads, party eggs, and a simple custard pie ready for any table.</p>
<p>Explore more easy <a href="/category/breakfast/"><strong>breakfast</strong></a> recipes, quick <a href="/category/lunch/"><strong>lunch</strong></a> ideas, cozy <a href="/category/dinner/"><strong>dinner</strong></a> meals, tasty <a href="/category/snacks/"><strong>snacks</strong></a>, and delightful <a href="/category/dessert/"><strong>dessert</strong></a>.</p>
`.trim();
}

async function main() {
  loadEnvLocal();
  const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const secret = process.env.CMS_IMPORT_SECRET!;
  if (!secret) throw new Error("CMS_IMPORT_SECRET missing");

  const featurePathLocal = FEATURE_CANDIDATES.find((p) => fs.existsSync(p));
  if (!featurePathLocal) {
    throw new Error(`Missing feature image in ${ASSETS}`);
  }

  const featureMeta = {
    alt: "Easy egg recipes with baked eggs, quiche, omelette, egg salad, and muffins",
    title: "Easy Egg Recipes Homestyle Spread",
    caption:
      "A welcoming egg table: baked eggs, quiche, omelettes, muffins, and picnic classics.",
    description:
      "Feature image for the easy egg recipes guide showing a home-style egg breakfast and lunch spread.",
  };

  const processed = await convertRecipeImageToWebp(
    fs.readFileSync(featurePathLocal),
    featureMeta.title,
    "feature",
    {
      caption: featureMeta.caption,
      description: featureMeta.description,
    },
  );
  const basename = buildRecipeImageBasename({
    metadata: featureMeta,
    focusKeyword: "egg recipes",
    slug: SLUG,
  });
  const r2Key = buildRecipeImageR2Key(basename);
  await putR2Object(r2Key, processed.buffer, "image/webp", {
    "alt-text": featureMeta.alt,
    title: featureMeta.title,
    caption: featureMeta.caption,
    description: featureMeta.description,
    "focus-keyword": "egg recipes",
    section: "feature",
  });
  const featurePath = r2KeyToPublicPath(r2Key);
  console.log(`Uploaded feature → ${featurePath}`);

  let contentHtml = buildContentHtml();
  const sectionPhotos = [
    {
      headingId: "egg-basics",
      src: "/wp-content/uploads/2026/01/Golden-Egg-Patties-Ready-to-Serve.webp",
      alt: "Golden egg patties ready to serve",
      caption: "Cook eggs gently and season early for tender results.",
    },
    {
      headingId: "breakfast-egg-recipes",
      src: "/wp-content/uploads/2025/12/Delicious-Baked-Eggs-and-Tomatoes.webp",
      alt: "Baked eggs and tomatoes in a baking dish",
      caption: "Breakfast egg recipes for busy mornings and cozy brunch.",
    },
    {
      headingId: "brunch-and-bake-egg-recipes",
      src: "/wp-content/uploads/2025/12/Delicious-Spinach-and-Cheese-Quiche.webp",
      alt: "Slice of spinach and cheese quiche",
      caption: "Brunch bakes that slice cleanly for company.",
    },
    {
      headingId: "lunch-and-picnic-egg-recipes",
      src: "/wp-content/uploads/2025/08/Homemade-Egg-Salad-Sandwich.webp",
      alt: "Homemade egg salad sandwich",
      caption: "Cool egg salads and sandwiches for lunch and picnics.",
    },
    {
      headingId: "sweet-egg-recipes",
      src: "/wp-content/uploads/2025/08/Delicious-Egg-Custard-Pie.webp",
      alt: "Freshly baked egg custard pie",
      caption: "A simple custard pie when eggs turn dessert.",
    },
  ];
  for (const photo of sectionPhotos) {
    contentHtml = insertAfterHeading(
      contentHtml,
      photo.headingId,
      figureHtml(photo),
    );
  }

  const wordCount = contentHtml
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean).length;

  const now = new Date().toISOString();
  const result = await client.mutation(api.articles.syncArticleFull, {
    secret,
    article: {
      slug: SLUG,
      title: "Easy Egg Recipes",
      excerpt:
        "Find easy egg recipes for breakfast bakes, muffins, quiche, omelettes, egg salad, party eggs, and custard pie—all gathered in one Grandma Recipe guide.",
      category: "breakfast",
      categories: ["breakfast", "lunch", "snacks"],
      contentHtml,
      ingredients: [],
      instructions: [],
      featuredImage: featurePath,
      featuredImageAlt: featureMeta.alt,
      featuredImageCaption: featureMeta.caption,
      featuredImageDescription: featureMeta.description,
      seoTitle: "Easy Egg Recipes for Breakfast, Lunch, and Brunch",
      seoDescription:
        "Browse easy egg recipes: baked eggs, muffins, quiche, omelettes, egg salad, devilled eggs, and custard pie. A Grandma Recipe guide for family meals.",
      focusKeyword: "egg recipes",
      cuisine: "American",
      course: "Breakfast and lunch guide",
      status: "draft",
      publishedAt: now,
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
        wordCount,
        featuredImage: featurePath,
        linkedRecipes: 9,
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
