/**
 * Create Easy Salad Recipes pillar guide on DEV (draft).
 *
 * Usage: npx tsx scripts/create-salad-recipes-pillar.ts
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
  path.join(ASSETS, "salad-recipes-feature.png"),
  path.join(ASSETS, "salad-recipes-feature.jpg"),
];
const SLUG = "salad-recipes";

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
    seaweed: link("seaweed-salad", "Seaweed Salad"),
    bltMac: link("blt-macaroni-salad", "BLT Macaroni Salad"),
    cucumber: link("creamy-cucumber-salad", "Creamy Cucumber Salad"),
    bltPasta: link("blt-pasta-salad", "BLT Pasta Salad"),
    corn: link("summer-corn-salad", "Summer Corn Salad"),
    italian: link("italian-pasta-salad", "Easy Italian Pasta Salad"),
    ramen: link("ramen-noodle-salad", "Ramen Noodle Salad"),
    deviled: link("deviled-egg-pasta-salad", "Easy Deviled Egg Pasta Salad"),
    bowTie: link("bow-tie-pasta-salad", "Creamy Bow Tie Pasta Salad"),
    antipasto: link("antipasto-salad", "Easy Antipasto Salad"),
    papaya: link("thai-papaya-salad", "Thai Papaya Salad (Som Tum)"),
    shrimp: link("shrimp-salad", "Healthy Shrimp Salad"),
    fruit: link("fruit-salad-with-honey", "Fruit Salad with Honey"),
    bistro: link("bistro-salad", "Bistro Salad"),
    eggSandwich: link("egg-salad-sandwich", "Egg Salad Sandwich"),
    bigMac: link("big-mac-salad-2", "Big Mac Salad"),
    grape: link("grape-salad", "Grape Salad"),
    crab: link("crab-pasta-salad", "Crab Pasta Salad"),
  };

  return `
<p>A good salad can be a quick lunch, a cookout side, or a full supper when you pile on shrimp, eggs, or pasta. This guide gathers Grandma Recipe’s best <strong>salad recipes</strong>—creamy pasta salads, crisp vegetable bowls, seafood salads, and sweet fruit salads—so you can pick a bowl and get cooking.</p>

<p>Use this page as your starting point. Each section links to kitchen-tested recipes with clear steps and familiar ingredients for picnics, potlucks, and easy weeknight plates.</p>

<h2 id="how-to-use-this-guide">How to Use This Salad Recipes Guide</h2>
<p>Start with the kind of bowl you want:</p>
<ul>
<li><strong>Need a potluck side?</strong> Open pasta salads, BLT macaroni salad, or antipasto.</li>
<li><strong>Want something light and crisp?</strong> Try cucumber salad, seaweed salad, or Thai papaya salad.</li>
<li><strong>Hungry for a full lunch?</strong> Shrimp salad, Big Mac salad, egg salad sandwich, or bistro salad fit the plate.</li>
<li><strong>In the mood for sweet?</strong> Fruit salad with honey or grape salad finish the table.</li>
</ul>
<p>If you are packing a cooler, start with ${L.italian} or ${L.corn}. For a protein lunch, ${L.shrimp} or ${L.eggSandwich} is a lovely place to begin.</p>

<h2 id="salad-basics">Salad Basics</h2>
<p>A few steady habits keep salad recipes tasting fresh:</p>
<ul>
<li><strong>Salt and dry vegetables</strong> when the recipe calls for it so dressings cling instead of watering down.</li>
<li><strong>Cook pasta just to al dente</strong> for pasta salads—it softens a little as it chills.</li>
<li><strong>Dress closer to serving</strong> for leafy or cucumber salads when you want maximum crunch.</li>
<li><strong>Chill creamy salads</strong> so flavors settle and the bowl travels well.</li>
<li><strong>Taste before serving</strong> — a pinch of salt, lemon, or pepper wakes up a cold salad.</li>
</ul>

<h2 id="pasta-salads">Pasta Salads</h2>
<p>These are cookout classics—cheesy, creamy, or tangy bowls that hold up on a buffet table.</p>
<ul>
<li>${L.bltMac} — BLT flavors in a creamy macaroni salad.</li>
<li>${L.bltPasta} — pasta salad with bacon, lettuce, and tomato vibes.</li>
<li>${L.italian} — easy Italian pasta salad with bright dressing.</li>
<li>${L.deviled} — deviled egg pasta salad for potluck comfort.</li>
<li>${L.bowTie} — creamy bow tie pasta salad.</li>
<li>${L.crab} — crab pasta salad for a seafood twist.</li>
<li>${L.ramen} — crunchy ramen noodle salad.</li>
</ul>

<h2 id="fresh-vegetable-salads">Fresh Vegetable Salads</h2>
<p>Crisp, colorful bowls that feel light but still satisfying.</p>
<ul>
<li>${L.cucumber} — creamy cucumber salad.</li>
<li>${L.corn} — summer corn salad.</li>
<li>${L.seaweed} — refreshing seaweed salad.</li>
<li>${L.papaya} — Thai papaya salad (Som Tum).</li>
<li>${L.antipasto} — antipasto salad with bold Italian bites.</li>
<li>${L.bistro} — simple bistro salad for everyday lunch.</li>
</ul>

<h2 id="hearty-protein-salads">Hearty Protein Salads</h2>
<p>When salad needs to be the main dish, these bowls bring shrimp, eggs, or a burger-style plate.</p>
<ul>
<li>${L.shrimp} — healthy shrimp salad.</li>
<li>${L.eggSandwich} — classic egg salad sandwich.</li>
<li>${L.bigMac} — Big Mac salad for a fun, filling lunch.</li>
</ul>

<h2 id="sweet-fruit-salads">Sweet Fruit Salads</h2>
<p>Dessert-leaning salads for brunch, holidays, and summer tables.</p>
<ul>
<li>${L.fruit} — fruit salad with honey.</li>
<li>${L.grape} — creamy grape salad.</li>
</ul>

<h2 id="faqs">FAQs</h2>
<h3>How far ahead can I make pasta salad?</h3>
<p>Most pasta salads keep well overnight in the fridge. Stir before serving and refresh with a spoonful of dressing if needed.</p>
<h3>Which salad travels best for a picnic?</h3>
<p>Try ${L.italian}, ${L.bltMac}, or ${L.corn}. Keep creamy salads cold in a cooler.</p>
<h3>What salad should I make first?</h3>
<p>For a simple side, start with ${L.cucumber} or ${L.italian}. For lunch, try ${L.shrimp} or ${L.eggSandwich}.</p>
<h3>How do I keep cucumber salad from getting watery?</h3>
<p>Salt and drain the cucumbers when the recipe says to, then dress closer to serving time.</p>
<h3>Can salad recipes work as dinner?</h3>
<p>Yes—protein salads like ${L.shrimp} or ${L.bigMac} make an easy plate with bread or leftovers on the side.</p>

<h2 id="final-thoughts">Final Thoughts</h2>
<p>Good <strong>salad recipes</strong> do not need fancy produce—just fresh ingredients, honest seasoning, and a bowl big enough to toss. Bookmark this guide, pick a cluster, and make one salad at a time. Before long you will have potluck pasta salads, crisp vegetable bowls, and sweet fruit salads ready for any table.</p>
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
    alt: "Easy salad recipes with pasta salad, cucumber salad, shrimp salad, and fresh vegetable bowls",
    title: "Easy Salad Recipes Homestyle Spread",
    caption:
      "A welcoming salad table: pasta salads, crisp vegetable bowls, and fresh lunch favorites.",
    description:
      "Feature image for the easy salad recipes guide showing a home-style salad spread.",
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
    focusKeyword: "salad recipes",
    slug: SLUG,
  });
  const r2Key = buildRecipeImageR2Key(basename);
  await putR2Object(r2Key, processed.buffer, "image/webp", {
    "alt-text": featureMeta.alt,
    title: featureMeta.title,
    caption: featureMeta.caption,
    description: featureMeta.description,
    "focus-keyword": "salad recipes",
    section: "feature",
  });
  const featurePath = r2KeyToPublicPath(r2Key);
  console.log(`Uploaded feature → ${featurePath}`);

  let contentHtml = buildContentHtml();
  const sectionPhotos = [
    {
      headingId: "salad-basics",
      src: "/wp-content/uploads/2026/01/Refreshing-Creamy-Cucumber-Salad.webp",
      alt: "Creamy cucumber salad in a serving bowl",
      caption: "Keep vegetables crisp, chill creamy bowls, and taste before serving.",
    },
    {
      headingId: "pasta-salads",
      src: "/wp-content/uploads/2026/01/Delicious-Italian-Pasta-Salad.webp",
      alt: "Easy Italian pasta salad with vegetables",
      caption: "Pasta salads for potlucks, cookouts, and make-ahead lunches.",
    },
    {
      headingId: "fresh-vegetable-salads",
      src: "/wp-content/uploads/2026/01/Delicious-Summer-Corn-Salad.webp",
      alt: "Summer corn salad with fresh vegetables",
      caption: "Crisp vegetable salads: corn, cucumber, seaweed, papaya, and more.",
    },
    {
      headingId: "hearty-protein-salads",
      src: "/wp-content/uploads/2026/01/Delicious-Shrimp-Salad.webp",
      alt: "Healthy shrimp salad ready to serve",
      caption: "Protein salads that can be the whole lunch plate.",
    },
    {
      headingId: "sweet-fruit-salads",
      src: "/wp-content/uploads/2025/12/Refreshing-Fruit-Salad-with-Honey.webp",
      alt: "Fruit salad with honey in a glass bowl",
      caption: "Sweet fruit salads for brunch and dessert tables.",
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
      title: "Easy Salad Recipes",
      excerpt:
        "Find easy salad recipes for pasta salads, crisp cucumber and corn bowls, shrimp and egg salad lunches, antipasto, and sweet fruit salads—all gathered in one Grandma Recipe guide.",
      category: "lunch",
      categories: ["lunch", "snacks"],
      contentHtml,
      ingredients: [],
      instructions: [],
      featuredImage: featurePath,
      featuredImageAlt: featureMeta.alt,
      featuredImageCaption: featureMeta.caption,
      featuredImageDescription: featureMeta.description,
      seoTitle: "Easy Salad Recipes for Lunch, Potlucks, and Sides",
      seoDescription:
        "Browse easy salad recipes: pasta salads, cucumber salad, shrimp salad, antipasto, fruit salad, and more. A Grandma Recipe guide for family meals.",
      focusKeyword: "salad recipes",
      cuisine: "American",
      course: "Lunch and sides guide",
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
        linkedRecipes: 18,
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
