/**
 * Create Easy Fish Recipes pillar guide on DEV (draft).
 * No pork / no alcohol recipes linked.
 *
 * Usage: npx tsx scripts/create-fish-recipes-pillar.ts
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
  path.join(ASSETS, "fish-recipes-feature.png"),
  path.join(ASSETS, "fish-recipes-feature.jpg"),
];
const SLUG = "fish-recipes";

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
    sheetSalmon: link("sheet-pan-salmon", "Sheet Pan Salmon"),
    salmonPrep: link("salmon-meal-prep", "Salmon Meal Prep"),
    smokedBagel: link("smoked-salmon-bagels", "Smoked Salmon Bagels"),
    tunaSteak: link("tuna-steak", "Easy Pan-Seared Tuna Steak"),
    freshTuna: link("fresh-tuna", "Fresh Tuna"),
    tunaBelly: link("tuna-belly", "Glazed Tuna Belly"),
    tunaMelt: link("tuna-melt-2", "Tuna Melt"),
    crispyTuna: link(
      "crispy-rice-with-spicy-tuna",
      "Crispy Rice with Spicy Tuna",
    ),
    tilapia: link("whole-tilapia", "Whole Tilapia"),
    whiting: link("whiting-fish", "Easy Pan-Fried Whiting Fish"),
    pollock: link("pollock-fish", "Easy Baked Pollock Fish"),
    catfish: link("catfish-fillets", "Crispy Cajun Catfish Fillets"),
    snappers: link("snappers-fish-chicken", "Snappers Fish & Chicken"),
    seafoodBake: link("seafood-bake", "Seafood Bake"),
    seafoodMix: link("seafood-mix", "Easy Seafood Mix"),
    shrimpSalad: link("shrimp-salad", "Healthy Shrimp Salad"),
    shrimpPho: link("shrimp-pho", "Shrimp Pho"),
    shrimpRolls: link("shrimp-spring-rolls", "Shrimp Spring Rolls"),
    shrimpCocktail: link("shrimp-cocktail", "Shrimp Cocktail"),
  };

  return `
<p>A good fish dinner can be as simple as a sheet pan or as special as a whole baked tilapia. This guide gathers Grandma Recipe’s best <strong>fish recipes</strong>—salmon, tuna, white fish, shrimp, and seafood mixes—so you can pick a fillet or bowl and cook with confidence.</p>

<p>Use this page as your starting point. Each section links to kitchen-tested recipes with clear steps and familiar pantry seasonings for weeknights, meal prep, and easy Sunday supper.</p>

<h2 id="how-to-use-this-guide">How to Use This Fish Recipes Guide</h2>
<p>Start with the kind of seafood night you want:</p>
<ul>
<li><strong>Need a hands-off dinner?</strong> Open sheet pan salmon or baked pollock.</li>
<li><strong>Want something fast in a skillet?</strong> Try pan-seared tuna, pan-fried whiting, or a garlic lemon seafood mix.</li>
<li><strong>Packing lunches?</strong> Salmon meal prep and shrimp salad hold well for busy days.</li>
<li><strong>Hosting a light spread?</strong> Shrimp cocktail, spring rolls, or smoked salmon bagels feel special without heavy cooking.</li>
</ul>
<p>If you want dinner with little fuss, start with ${L.sheetSalmon} or ${L.whiting}. For meal prep, ${L.salmonPrep} is a lovely place to begin.</p>

<h2 id="fish-basics">Fish Basics</h2>
<p>A few steady habits keep fish recipes juicy, flaky, and reliable:</p>
<ul>
<li><strong>Pat fish dry</strong> before seasoning so the surface browns instead of steaming.</li>
<li><strong>Season simply</strong> with salt, pepper, lemon, garlic, and paprika—you can always add more later.</li>
<li><strong>Cook to just opaque</strong> and pull from heat early; fish keeps cooking as it rests.</li>
<li><strong>Use a hot pan</strong> for steaks and fillets so you get a quick sear without drying the center.</li>
<li><strong>Serve with acid</strong> — lemon, lime, or a bright salad wakes up rich salmon and tuna.</li>
</ul>

<h2 id="salmon-recipes">Salmon Recipes</h2>
<p>Weeknight salmon that feels special, from one-pan dinners to make-ahead lunches.</p>
<ul>
<li>${L.sheetSalmon} — salmon and vegetables roasted together on one pan.</li>
<li>${L.salmonPrep} — portioned salmon meal prep for easy weekday plates.</li>
<li>${L.smokedBagel} — smoked salmon bagels for breakfast or a light brunch board.</li>
</ul>

<h2 id="tuna-recipes">Tuna Recipes</h2>
<p>From quick seared steaks to cozy sandwiches and crispy snacks.</p>
<ul>
<li>${L.tunaSteak} — pan-seared tuna steak with a simple sear.</li>
<li>${L.freshTuna} — fresh tuna cooked for an easy dinner plate.</li>
<li>${L.tunaBelly} — glazed tuna belly with rich, savory edges.</li>
<li>${L.tunaMelt} — classic tuna melt for lunch.</li>
<li>${L.crispyTuna} — crispy rice with spicy tuna for a fun snack plate.</li>
</ul>

<h2 id="white-fish-recipes">White Fish Recipes</h2>
<p>Mild, family-friendly fillets and whole fish that take well to baking and pan frying.</p>
<ul>
<li>${L.tilapia} — whole tilapia baked until tender.</li>
<li>${L.whiting} — pan-fried whiting fish with a crisp, golden crust.</li>
<li>${L.pollock} — baked pollock with a simple breaded coating.</li>
<li>${L.catfish} — catfish fillets for a Southern-style fish night.</li>
<li>${L.snappers} — baked snappers with chicken for a shared platter.</li>
</ul>

<h2 id="shrimp-and-seafood-recipes">Shrimp and Seafood Recipes</h2>
<p>Bowls, bakes, and party plates when you want shrimp or a mixed seafood supper.</p>
<ul>
<li>${L.seafoodBake} — seafood bake for a cozy oven dinner.</li>
<li>${L.seafoodMix} — garlic lemon seafood mix in one skillet.</li>
<li>${L.shrimpSalad} — bright shrimp salad for lunch.</li>
<li>${L.shrimpPho} — shrimp pho with fragrant broth.</li>
<li>${L.shrimpRolls} — fresh shrimp spring rolls.</li>
<li>${L.shrimpCocktail} — classic shrimp cocktail for starters and parties.</li>
</ul>

<h2 id="faqs">FAQs</h2>
<h3>What fish recipe should I make first?</h3>
<p>For an easy dinner, try ${L.sheetSalmon} or ${L.whiting}. For lunch prep, start with ${L.salmonPrep} or ${L.shrimpSalad}.</p>
<h3>How do I keep fish from drying out?</h3>
<p>Pat it dry, season well, cook over steady heat, and pull it as soon as it turns opaque. Rest a few minutes before serving. Sheet pan and skillet recipes like ${L.sheetSalmon} and ${L.tunaSteak} are forgiving places to practice.</p>
<h3>Can fish recipes work for meal prep?</h3>
<p>Yes—${L.salmonPrep} and ${L.shrimpSalad} store well in the fridge. Keep sauces and lemon on the side when you can so leftovers stay fresh.</p>
<h3>What should I serve with fish?</h3>
<p>Rice, roasted vegetables, a simple green salad, lemon wedges, and warm bread all work. Many of these fish recipes already include vegetables on the same pan or plate.</p>
<h3>Do leftover fish dishes reheat well?</h3>
<p>Gently. Warm salmon and white fish covered so they stay moist, and keep cold salads and cocktail shrimp chilled rather than reheating them.</p>

<h2 id="final-thoughts">Final Thoughts</h2>
<p>Good <strong>fish recipes</strong> do not need fancy technique—just fresh seafood, honest seasoning, and a hot pan or sheet tray. Bookmark this guide, pick a cluster, and make one fish dinner at a time. Before long you will have salmon nights, tuna lunches, white fish fries, and shrimp bowls ready for any table.</p>
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
    alt: "Easy fish recipes with salmon, tuna, white fish, shrimp, and seafood dinner plates",
    title: "Easy Fish Recipes Homestyle Spread",
    caption:
      "A welcoming seafood table: salmon, tuna, white fish, shrimp, and easy family dinners.",
    description:
      "Feature image for the easy fish recipes guide showing a home-style fish and seafood dinner spread.",
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
    focusKeyword: "fish recipes",
    slug: SLUG,
  });
  const r2Key = buildRecipeImageR2Key(basename);
  await putR2Object(r2Key, processed.buffer, "image/webp", {
    "alt-text": featureMeta.alt,
    title: featureMeta.title,
    caption: featureMeta.caption,
    description: featureMeta.description,
    "focus-keyword": "fish recipes",
    section: "feature",
  });
  const featurePath = r2KeyToPublicPath(r2Key);
  console.log(`Uploaded feature → ${featurePath}`);

  let contentHtml = buildContentHtml();
  const sectionPhotos = [
    {
      headingId: "fish-basics",
      src: "/wp-content/uploads/2025/12/Healthy-Sheet-Pan-Salmon-Recipe.webp",
      alt: "Sheet pan salmon with roasted vegetables",
      caption: "Pat fish dry, season simply, and rest before serving.",
    },
    {
      headingId: "salmon-recipes",
      src: "/wp-content/uploads/2026/01/Healthy-Salmon-Meal-Prep.webp",
      alt: "Salmon meal prep portions ready for the week",
      caption: "Salmon recipes for weeknights and make-ahead lunches.",
    },
    {
      headingId: "tuna-recipes",
      src: "/wp-content/uploads/2025/12/Deliciously-Seared-Tuna-Steak.webp",
      alt: "Pan-seared tuna steak",
      caption: "Tuna steaks, melts, and crispy snack plates.",
    },
    {
      headingId: "white-fish-recipes",
      src: "/wp-content/uploads/2025/12/Deliciously-Cooked-Whiting-Fish.webp",
      alt: "Pan-fried whiting fish",
      caption: "Mild white fish for family-friendly dinners.",
    },
    {
      headingId: "shrimp-and-seafood-recipes",
      src: "/wp-content/uploads/2026/01/Delicious-Shrimp-Salad.webp",
      alt: "Healthy shrimp salad",
      caption: "Shrimp bowls, bakes, and party seafood plates.",
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
      title: "Easy Fish Recipes",
      excerpt:
        "Find easy fish recipes for salmon, tuna, white fish, shrimp, and seafood dinners—sheet pan, skillet, meal prep, and party plates, all gathered in one Grandma Recipe guide.",
      category: "dinner",
      categories: ["dinner", "lunch"],
      contentHtml,
      ingredients: [],
      instructions: [],
      featuredImage: featurePath,
      featuredImageAlt: featureMeta.alt,
      featuredImageCaption: featureMeta.caption,
      featuredImageDescription: featureMeta.description,
      seoTitle: "Easy Fish Recipes for Salmon, Tuna, Shrimp, and More",
      seoDescription:
        "Browse easy fish recipes: sheet pan salmon, tuna steak, whiting, tilapia, shrimp salad, seafood bake, and more. A Grandma Recipe guide for family meals.",
      focusKeyword: "fish recipes",
      cuisine: "American",
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
        linkedRecipes: 19,
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
