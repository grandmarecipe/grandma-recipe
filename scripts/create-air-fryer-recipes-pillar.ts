/**
 * Create Easy Air Fryer Recipes pillar guide on DEV (draft).
 * Links existing air fryer recipes + feature image from Cursor assets.
 *
 * Usage: npx tsx scripts/create-air-fryer-recipes-pillar.ts
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
  path.join(ASSETS, "easy-air-fryer-recipes-feature.png"),
  path.join(ASSETS, "easy-air-fryer-recipes-feature.jpg"),
];
const SLUG = "air-fryer-recipes";

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
    zucchini: link("air-fryer-zucchini-chips", "Air Fryer Zucchini Chips"),
    zucchini2: link(
      "crispy-air-fried-zucchini-chips",
      "Air-Fried Zucchini Chips",
    ),
    nachos: link("air-fryer-nachos", "Crispy Air Fryer Nachos"),
    chips: link("air-fryer-chips", "Air Fryer Chips"),
    mozzarella: link(
      "air-fryer-mozzarella-sticks",
      "Air Fryer Mozzarella Sticks",
    ),
    delicata: link("delicata-squash-air-fryer", "Delicata Squash Air Fryer"),
    pineapple: link("air-fryer-pineapple", "Air Fryer Pineapple"),
    jerky: link("air-fryer-beef-jerky", "Air Fryer Beef Jerky"),
    pizzaRolls: link("air-fryer-pizza-rolls", "Air Fryer Pizza Rolls"),
    bakedPotato: link("air-fryer-baked-potato", "Air Fryer Baked Potato"),
    chicken: link(
      "air-fryer-parmesan-crusted-chicken",
      "Air Fryer Parmesan Crusted Chicken",
    ),
  };

  return `
<p>The air fryer has earned a permanent spot on many kitchen counters—and for good reason. It turns out crisp edges, juicy centers, and golden snacks with far less oil than deep frying, often in less time than a full oven preheat. This guide gathers Grandma Recipe’s best <strong>air fryer recipes</strong> so you can jump straight to chips, cheesy snacks, cozy sides, crispy chicken, and even a sweet pineapple finish.</p>

<p>Use this page as your starting point. Each section links to kitchen-tested recipes with clear steps and familiar ingredients—perfect for weeknights, after-school snacks, and easy family dinners.</p>

<h2 id="how-to-use-this-guide">How to Use This Air Fryer Recipes Guide</h2>
<p>Start with the kind of basket you want to fill:</p>
<ul>
<li><strong>Craving crunch?</strong> Open zucchini chips, potato chips, mozzarella sticks, pizza rolls, or nachos.</li>
<li><strong>Need a side or supper?</strong> Try baked potatoes, delicata squash, or Parmesan crusted chicken.</li>
<li><strong>Want something to nibble later?</strong> Air fryer beef jerky keeps well for snacks on the go.</li>
<li><strong>In the mood for dessert?</strong> Caramelized air fryer pineapple is a quick sweet treat.</li>
</ul>
<p>If you are new to the air fryer, start with ${L.chips} or ${L.bakedPotato}. For a full dinner plate, ${L.chicken} is a lovely place to begin.</p>

<h2 id="air-fryer-basics">Air Fryer Basics</h2>
<p>A few steady habits keep air fryer recipes crisp and even:</p>
<ul>
<li><strong>Preheat when the recipe says so</strong> — a hot basket helps coatings brown instead of steam.</li>
<li><strong>Do not overcrowd</strong> — leave space so hot air can move around every piece.</li>
<li><strong>Shake or flip halfway</strong> for even color on chips, sticks, and chicken.</li>
<li><strong>Pat food dry</strong> before oiling or breading so coatings cling and crisp.</li>
<li><strong>Use a light mist of oil</strong> when you want deeper golden color without deep frying.</li>
</ul>

<h2 id="crispy-chips-and-snacks">Crispy Chips and Snacks</h2>
<p>These are the recipes that make the air fryer feel like a snack bar at home—crisp, salty, and ready fast.</p>
<ul>
<li>${L.zucchini} — thin zucchini slices with seasoned breadcrumbs.</li>
<li>${L.zucchini2} — another crispy zucchini chip path for light snacking.</li>
<li>${L.chips} — classic potato chips with a light oil coating.</li>
<li>${L.mozzarella} — golden mozzarella sticks without a deep fryer.</li>
<li>${L.pizzaRolls} — cheesy, saucy pizza rolls with a crisp shell.</li>
<li>${L.nachos} — layered tortilla chips with melty cheese and toppings.</li>
</ul>

<h2 id="sides-and-main-dishes">Sides and Main Dishes</h2>
<p>When supper needs something hearty from the basket, these air fryer recipes deliver crispy outsides and tender centers.</p>
<ul>
<li>${L.bakedPotato} — shatteringly crisp skin with a fluffy center.</li>
<li>${L.delicata} — sweet delicata squash rings with crisp edges.</li>
<li>${L.chicken} — juicy Parmesan crusted chicken for an easy dinner.</li>
</ul>

<h2 id="protein-snacks">Protein Snacks</h2>
<p>For a savory snack you can pack or keep on hand, try homemade jerky from the air fryer.</p>
<ul>
<li>${L.jerky} — smoky-sweet air fryer beef jerky.</li>
</ul>

<h2 id="sweet-air-fryer-treats">Sweet Air Fryer Treats</h2>
<p>Yes—the air fryer can do dessert. Fruit caramelizes beautifully with a short cook and a little sugar or spice.</p>
<ul>
<li>${L.pineapple} — caramelized pineapple rings, warm and golden.</li>
</ul>

<h2 id="faqs">FAQs</h2>
<h3>Do I need to preheat the air fryer?</h3>
<p>Many recipes brown better with a short preheat. Follow each recipe; chips and breaded foods often benefit most.</p>
<h3>Why is my food soggy instead of crisp?</h3>
<p>The basket may be too full, or the food was wet. Cook in batches, pat dry, and shake halfway through.</p>
<h3>Which air fryer recipe should I make first?</h3>
<p>For a simple win, try ${L.bakedPotato} or ${L.chips}. For dinner, start with ${L.chicken}.</p>
<h3>Can I cook frozen snacks in the air fryer?</h3>
<p>Yes—pizza rolls and similar snacks often crisp well from frozen. Check packaging for time, then adjust for your model.</p>
<h3>Is air fryer food healthier than deep frying?</h3>
<p>You typically use far less oil while still getting a crisp finish, which many home cooks prefer for everyday snacks and dinners.</p>

<h2 id="final-thoughts">Final Thoughts</h2>
<p>Good <strong>air fryer recipes</strong> do not need complicated gadgets—just a hot basket, a little space between pieces, and honest seasoning. Bookmark this guide, pick a cluster, and cook one batch at a time. Before long you will have crispy snacks, easy sides, and weeknight chicken ready whenever the family is hungry.</p>
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
    alt: "Easy air fryer recipes with crispy chicken, chips, mozzarella sticks, and nachos",
    title: "Easy Air Fryer Recipes Homestyle Spread",
    caption:
      "Crispy air fryer favorites: chicken, chips, mozzarella sticks, and nachos for easy family snacks and dinners.",
    description:
      "Feature image for the easy air fryer recipes guide showing a home-style air fryer snack and dinner spread.",
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
    focusKeyword: "air fryer recipes",
    slug: SLUG,
  });
  const r2Key = buildRecipeImageR2Key(basename);
  await putR2Object(r2Key, processed.buffer, "image/webp", {
    "alt-text": featureMeta.alt,
    title: featureMeta.title,
    caption: featureMeta.caption,
    description: featureMeta.description,
    "focus-keyword": "air fryer recipes",
    section: "feature",
  });
  const featurePath = r2KeyToPublicPath(r2Key);
  console.log(`Uploaded feature → ${featurePath}`);

  let contentHtml = buildContentHtml();
  const sectionPhotos = [
    {
      headingId: "air-fryer-basics",
      src: "/wp-content/uploads/2026/01/Delicious-Air-Fryer-Chips-Ready-to-Enjoy.webp",
      alt: "Crispy air fryer potato chips on a serving plate",
      caption: "Preheat, leave space in the basket, and shake halfway for even crunch.",
    },
    {
      headingId: "crispy-chips-and-snacks",
      src: "/wp-content/uploads/2026/01/Crispy-Air-Fryer-Zucchini-Chips.webp",
      alt: "Crispy air fryer zucchini chips with dipping sauce",
      caption: "Chips, mozzarella sticks, pizza rolls, and nachos from the air fryer.",
    },
    {
      headingId: "sides-and-main-dishes",
      src: "/wp-content/uploads/2025/07/Delicious-Air-Fryer-Parmesan-Crusted-Chicken.webp",
      alt: "Air fryer Parmesan crusted chicken with a crisp golden coating",
      caption: "Dinner and sides: Parmesan chicken, baked potatoes, and delicata squash.",
    },
    {
      headingId: "protein-snacks",
      src: "/wp-content/uploads/2025/08/Delicious-Air-Fryer-Beef-Jerky.webp",
      alt: "Homemade air fryer beef jerky strips",
      caption: "Savory protein snacks like homemade air fryer beef jerky.",
    },
    {
      headingId: "sweet-air-fryer-treats",
      src: "/wp-content/uploads/2025/08/Caramelized-Air-Fryer-Pineapple.webp",
      alt: "Caramelized air fryer pineapple rings",
      caption: "A quick sweet finish: caramelized air fryer pineapple.",
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
      title: "Easy Air Fryer Recipes",
      excerpt:
        "Find easy air fryer recipes for crispy snacks, cheesy bites, baked potatoes, Parmesan chicken, beef jerky, and caramelized pineapple—all gathered in one Grandma Recipe guide.",
      category: "snacks",
      categories: ["snacks", "dinner"],
      contentHtml,
      ingredients: [],
      instructions: [],
      featuredImage: featurePath,
      featuredImageAlt: featureMeta.alt,
      featuredImageCaption: featureMeta.caption,
      featuredImageDescription: featureMeta.description,
      seoTitle: "Easy Air Fryer Recipes for Crispy Snacks and Dinners",
      seoDescription:
        "Browse easy air fryer recipes: zucchini chips, nachos, mozzarella sticks, baked potatoes, Parmesan chicken, beef jerky, and more. A Grandma Recipe guide.",
      focusKeyword: "air fryer recipes",
      cuisine: "American",
      course: "Snacks and dinner guide",
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
        linkedRecipes: 11,
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
