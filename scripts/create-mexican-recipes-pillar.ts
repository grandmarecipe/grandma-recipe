/**
 * Create Easy Mexican Recipes pillar guide on DEV (draft).
 * No pork / no alcohol recipes linked.
 *
 * Usage: npx tsx scripts/create-mexican-recipes-pillar.ts
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
  path.join(ASSETS, "mexican-recipes-feature.png"),
  path.join(ASSETS, "mexican-recipes-feature.jpg"),
];
const SLUG = "mexican-recipes";

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
    birria: link("birria-tacos", "Birria Tacos"),
    pollo: link("tacos-de-pollo", "Tacos de Pollo"),
    mini: link("mini-tacos", "Mini Tacos"),
    puffy: link("puffy-tacos", "Puffy Tacos"),
    board: link("taco-dinner-board", "Taco Dinner Board"),
    gringo: link("taco-gringo", "Easy Taco Gringo"),
    beefBurrito: link("beef-burritos", "Beef Burritos"),
    chickenBurrito: link("chicken-burrito-recipe", "Chicken Burrito Recipe"),
    chickenBurrito2: link("chicken-burrito", "Chicken Burrito"),
    breakfastBurrito: link("breakfast-burritos-2", "Breakfast Burritos"),
    soup: link("taco-soup", "Easy Taco Soup"),
    pizza: link("taco-pizza", "Taco Pizza"),
    meatloaf: link("mexican-meatloaf", "Mexican Meatloaf"),
    quesadillas: link("pizza-quesadillas", "Pizza Quesadillas"),
    nachos: link("air-fryer-nachos", "Air Fryer Nachos"),
    dip: link("baked-taco-dip", "Baked Taco Dip"),
    cornDip: link("mexican-street-corn-dip", "Mexican Street Corn Dip"),
    chips: link("mexican-spicy-chips", "Mexican Spicy Chips"),
  };

  return `
<p>A good Mexican-inspired supper can be taco night, a cozy burrito wrap, or a bubbling pot of taco soup. This guide gathers Grandma Recipe’s best <strong>mexican recipes</strong>—tacos, burritos, dips, and family dinner boards—so you can pick a plate and cook with confidence.</p>

<p>Use this page as your starting point. Each section links to kitchen-tested recipes with clear steps and familiar pantry seasonings for weeknights, game day, and easy Sunday supper. No pork and no alcohol in any recipe linked here.</p>

<h2 id="how-to-use-this-guide">How to Use This Mexican Recipes Guide</h2>
<p>Start with the kind of night you want:</p>
<ul>
<li><strong>Need a taco night?</strong> Open birria tacos, chicken tacos, mini tacos, or a full taco dinner board.</li>
<li><strong>Want something wrap-and-go?</strong> Try beef or chicken burritos, or breakfast burritos for morning.</li>
<li><strong>Feeding a crowd with dips and snacks?</strong> Street corn dip, baked taco dip, nachos, and spicy chips are easy wins.</li>
<li><strong>Prefer a bowl or bake?</strong> Taco soup, taco pizza, and Mexican meatloaf bring the same flavors without assembling every tortilla.</li>
</ul>
<p>If you want dinner with little fuss, start with ${L.pollo} or ${L.soup}. For a party platter, ${L.board} or ${L.nachos} is a lovely place to begin.</p>

<h2 id="mexican-recipe-basics">Mexican Recipe Basics</h2>
<p>A few steady habits keep mexican recipes bold, fresh, and reliable:</p>
<ul>
<li><strong>Warm the tortillas</strong> so they stay soft and fold without cracking.</li>
<li><strong>Season the protein well</strong> with chili powder, cumin, garlic, and paprika before it hits the pan.</li>
<li><strong>Balance heat with lime and cilantro</strong> so rich fillings stay bright.</li>
<li><strong>Set out toppings</strong> — salsa, cheese, avocado, and onions — so everyone builds their own plate.</li>
<li><strong>Cook beef and chicken to juicy doneness</strong>, then rest briefly before stuffing tortillas or burritos.</li>
</ul>

<h2 id="taco-recipes">Taco Recipes</h2>
<p>From slow-simmered birria to quick chicken tacos and playful mini shells.</p>
<ul>
<li>${L.birria} — juicy birria tacos with rich, savory broth for dipping.</li>
<li>${L.pollo} — tacos de pollo for an easy chicken taco night.</li>
<li>${L.mini} — mini tacos for snacks, parties, and kid-friendly plates.</li>
<li>${L.puffy} — puffy tacos with a light, crisp shell.</li>
<li>${L.board} — a taco dinner board so everyone builds their own.</li>
<li>${L.gringo} — easy taco gringo for a simple weeknight plate.</li>
</ul>

<h2 id="burrito-recipes">Burrito Recipes</h2>
<p>Wrapped dinners and breakfast burritos that travel well and reheat kindly.</p>
<ul>
<li>${L.beefBurrito} — hearty beef burritos for a filling supper.</li>
<li>${L.chickenBurrito} — chicken burrito recipe with classic fillings.</li>
<li>${L.chickenBurrito2} — another cozy chicken burrito for lunch or dinner.</li>
<li>${L.breakfastBurrito} — breakfast burritos for busy mornings.</li>
</ul>

<h2 id="soups-bakes-and-mains">Soups, Bakes, and Mains</h2>
<p>When you want Mexican-inspired flavor without assembling every tortilla by hand.</p>
<ul>
<li>${L.soup} — easy taco soup for a one-pot dinner.</li>
<li>${L.pizza} — taco pizza with a playful, shareable crust.</li>
<li>${L.meatloaf} — Mexican meatloaf seasoned for family supper.</li>
<li>${L.quesadillas} — pizza quesadillas for a fast snack or lunch.</li>
</ul>

<h2 id="dips-and-snacks">Dips and Snacks</h2>
<p>Party plates and game-day snacks with salsa-night energy.</p>
<ul>
<li>${L.nachos} — crispy air fryer nachos ready in minutes.</li>
<li>${L.dip} — baked taco dip for scooping with chips.</li>
<li>${L.cornDip} — creamy Mexican street corn dip.</li>
<li>${L.chips} — Mexican spicy chips for a crunchy side.</li>
</ul>

<h2 id="faqs">FAQs</h2>
<h3>What Mexican recipe should I make first?</h3>
<p>For an easy dinner, try ${L.pollo} or ${L.soup}. For a special taco night, make ${L.birria}. For a party, start with ${L.board} or ${L.nachos}.</p>
<h3>Can I prep Mexican recipes ahead of time?</h3>
<p>Yes—cook proteins, chop toppings, and warm tortillas when you are ready to serve. ${L.soup}, ${L.dip}, and ${L.meatloaf} also hold well for leftovers.</p>
<h3>How do I keep tacos from getting soggy?</h3>
<p>Warm tortillas just before serving, drain saucy fillings lightly, and set wet toppings on the side. Build each taco right before you eat.</p>
<h3>What sides go with Mexican recipes?</h3>
<p>Rice, beans, street corn dip, chips and salsa, and a simple salad all work. Many of these mexican recipes already feel complete with one dip or a taco board.</p>
<h3>Do leftovers reheat well?</h3>
<p>Most do. Reheat soups and burritos gently, crisp nachos briefly, and keep cold dips chilled until serving.</p>

<h2 id="final-thoughts">Final Thoughts</h2>
<p>Good <strong>mexican recipes</strong> do not need a long ingredient list—just warm tortillas, bold seasoning, and a table full of toppings. Bookmark this guide, pick a cluster, and make one taco night at a time. Before long you will have birria, burritos, dips, and cozy taco soups ready for any table.</p>
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
    alt: "Easy Mexican recipes with tacos, burritos, nachos, and street corn dip",
    title: "Easy Mexican Recipes Homestyle Spread",
    caption:
      "A welcoming Mexican dinner table: tacos, burritos, dips, and family-style boards.",
    description:
      "Feature image for the easy Mexican recipes guide showing a home-style taco and burrito dinner spread.",
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
    focusKeyword: "mexican recipes",
    slug: SLUG,
  });
  const r2Key = buildRecipeImageR2Key(basename);
  await putR2Object(r2Key, processed.buffer, "image/webp", {
    "alt-text": featureMeta.alt,
    title: featureMeta.title,
    caption: featureMeta.caption,
    description: featureMeta.description,
    "focus-keyword": "mexican recipes",
    section: "feature",
  });
  const featurePath = r2KeyToPublicPath(r2Key);
  console.log(`Uploaded feature → ${featurePath}`);

  let contentHtml = buildContentHtml();
  const sectionPhotos = [
    {
      headingId: "mexican-recipe-basics",
      src: "/wp-content/uploads/2025/06/Delicious-Taco-Dinner-Board.webp",
      alt: "Taco dinner board with toppings",
      caption: "Warm tortillas, seasoned fillings, and toppings on the side.",
    },
    {
      headingId: "taco-recipes",
      src: "/wp-content/uploads/2026/01/Delicious-Birria-Tacos-Ready-to-Serve.webp",
      alt: "Birria tacos ready to serve",
      caption: "Taco recipes from birria night to mini party shells.",
    },
    {
      headingId: "burrito-recipes",
      src: "/wp-content/uploads/2025/12/Delicious-Beef-Burritos-Ready-to-Serve.webp",
      alt: "Beef burritos ready to serve",
      caption: "Burritos for dinner, lunch, and breakfast wraps.",
    },
    {
      headingId: "soups-bakes-and-mains",
      src: "/wp-content/uploads/2026/01/Delicious-Taco-Soup-Ready-to-Serve.webp",
      alt: "Taco soup ready to serve",
      caption: "One-pot soups and bakes with taco-night flavor.",
    },
    {
      headingId: "dips-and-snacks",
      src: "/wp-content/uploads/2025/07/Delicious-Mexican-Street-Corn-Dip.webp",
      alt: "Mexican street corn dip",
      caption: "Dips, nachos, and crunchy snacks for sharing.",
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
      title: "Easy Mexican Recipes",
      excerpt:
        "Find easy Mexican recipes for tacos, burritos, taco soup, nachos, street corn dip, and dinner boards—all gathered in one Grandma Recipe guide.",
      category: "dinner",
      categories: ["dinner", "lunch", "snacks"],
      contentHtml,
      ingredients: [],
      instructions: [],
      featuredImage: featurePath,
      featuredImageAlt: featureMeta.alt,
      featuredImageCaption: featureMeta.caption,
      featuredImageDescription: featureMeta.description,
      seoTitle: "Easy Mexican Recipes for Tacos, Burritos, and Family Dinner",
      seoDescription:
        "Browse easy Mexican recipes: birria tacos, chicken tacos, burritos, taco soup, nachos, street corn dip, and more. A Grandma Recipe guide for family meals.",
      focusKeyword: "mexican recipes",
      cuisine: "Mexican",
      course: "Dinner guide",
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
