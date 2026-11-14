/**
 * Create Thanksgiving Side Dishes guide on DEV (draft).
 * Links existing sides; gap recipes (casseroles, cranberry, stuffing, turkey gravy) added later.
 * No pork / no alcohol.
 *
 * Usage: npx tsx scripts/create-thanksgiving-side-dishes-guide.ts
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
  path.join(ASSETS, "thanksgiving-side-dishes-feature.png"),
  path.join(ASSETS, "thanksgiving-side-dishes-feature.jpg"),
];
const SLUG = "thanksgiving-side-dishes";

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
    mashed: link("creamy-mashed-potatoes", "Creamy Mashed Potatoes"),
    loaded: link("loaded-mashed-potatoes", "Ultimate Loaded Mashed Potatoes"),
    mashCasserole: link("mashed-potato-casserole", "Mashed Potato Casserole"),
    veganMash: link("vegan-mashed-potatoes", "Vegan Mashed Potatoes"),
    riceStuffing: link("rice-stuffing", "Rice Stuffing"),
    greenBeans: link(
      "green-beans-garlic-almonds",
      "Green Beans with Garlic and Almonds",
    ),
    greenBeanCasserole: link(
      "green-bean-casserole",
      "Homestyle Green Bean Casserole",
    ),
    sweetPotato: link(
      "sweet-potato-casserole",
      "Classic Sweet Potato Casserole",
    ),
    stuffing: link("classic-stuffing", "Classic Bread Stuffing"),
    cranberry: link("cranberry-sauce", "Homemade Cranberry Sauce"),
    turkeyGravy: link("turkey-gravy", "Silky Homemade Turkey Gravy"),
    gravy: link("homemade-gravy", "Homemade Gravy"),
    veganGravy: link("vegan-gravy", "Vegan Gravy"),
    turkey: link("bone-turkey-breast", "Oven-Roasted Bone Turkey Breast"),
    pie: link("pumpkin-pie-recipe", "Classic Homemade Pumpkin Pie"),
    hub: link("thanksgiving-recipes", "Easy Thanksgiving Recipes"),
  };

  return `
<p>The turkey gets the spotlight, but <strong>thanksgiving side dishes</strong> are what fill the plates. This guide gathers Grandma Recipe’s best holiday sides, from creamy mashed potatoes and rice stuffing to green beans and silky gravy, so you can build a sideboard without last-minute guessing.</p>

<p>Use this page as your sides checklist. Each recipe has clear steps and pantry-friendly ingredients for a full Thanksgiving table, a smaller dinner for two, or make-ahead prep the day before.</p>

<h2 id="how-to-use-this-guide">How to Use This Thanksgiving Side Dishes Guide</h2>
<p>Start with the kind of side you need:</p>
<ul>
<li><strong>Want the classic mash?</strong> Open creamy mashed potatoes, loaded mash, or a baked mashed potato casserole.</li>
<li><strong>Need something savory beside the bird?</strong> Rice stuffing and garlic almond green beans travel well on the plate.</li>
<li><strong>Finishing the plate?</strong> Homemade gravy (or vegan gravy) ties everything together.</li>
<li><strong>Cooking for plant-based guests?</strong> Pair vegan mashed potatoes with vegan gravy and rice stuffing.</li>
</ul>
<p>If you want one first win, start with ${L.mashed}. Add ${L.greenBeans} and ${L.gravy}, and the sideboard already feels complete. For the full holiday menu, return to ${L.hub}.</p>

<p>Scroll the potato, stuffing, vegetable, and gravy sections below, then use the simple sideboard checklist when you are ready to shop.</p>

<h2 id="potato-thanksgiving-sides">Potato Thanksgiving Sides</h2>
<p>Creamy, cozy potato dishes everyone reaches for first.</p>
<ul>
<li>${L.mashed}, fluffy Yukon Gold mashed potatoes with garlic and chives.</li>
<li>${L.loaded}, loaded mashed potatoes with cheddar, turkey bacon bits, and chives.</li>
<li>${L.mashCasserole}, baked mashed potato casserole with a golden topping.</li>
<li>${L.veganMash}, creamy dairy-free mashed potatoes for plant-based plates.</li>
</ul>

<h2 id="stuffing-and-vegetables">Stuffing and Vegetables</h2>
<p>Savory stuffing, casseroles, and a fresh green vegetable to balance the richer dishes.</p>
<ul>
<li>${L.stuffing}, classic bread stuffing with onion, celery, and herbs.</li>
<li>${L.riceStuffing}, rice stuffing with onions, celery, cranberries, and herbs.</li>
<li>${L.greenBeanCasserole}, green bean casserole with creamy sauce and crispy onions.</li>
<li>${L.greenBeans}, green beans with garlic and toasted almonds.</li>
<li>${L.sweetPotato}, sweet potato casserole with pecan streusel.</li>
<li>${L.cranberry}, homemade cranberry sauce simmered until glossy.</li>
</ul>

<h2 id="gravy-for-thanksgiving">Gravy for Thanksgiving</h2>
<p>Silky gravy for mashed potatoes, stuffing, and turkey.</p>
<ul>
<li>${L.turkeyGravy}, turkey gravy from drippings or broth, no wine.</li>
<li>${L.gravy}, homemade gravy you can whisk up for the whole table.</li>
<li>${L.veganGravy}, dairy-free gravy with deep savory flavor.</li>
</ul>

<h2 id="build-a-simple-sideboard">Build a Simple Sideboard</h2>
<p>You do not need eight pans to make Thanksgiving sides feel generous:</p>
<ul>
<li><strong>Pick one potato</strong>, creamy mash for tradition or casserole when you want oven-friendly make-ahead.</li>
<li><strong>Add one stuffing</strong>, rice stuffing is light enough to sit beside turkey without weighing the plate down.</li>
<li><strong>Add one green vegetable</strong>, garlic almond green beans bring crunch and color.</li>
<li><strong>Finish with gravy</strong>, warm it last so it stays silky.</li>
<li><strong>Serve with turkey and pie</strong>, ${L.turkey} and ${L.pie} complete the classic menu.</li>
</ul>

<h2 id="faqs">FAQs</h2>
<h3>How many Thanksgiving side dishes do I need?</h3>
<p>For most tables, three sides plus gravy is enough: one potato, one stuffing, and one vegetable. Add a second potato dish only if you are feeding a crowd.</p>
<h3>Which Thanksgiving side dish should I make first?</h3>
<p>Start with ${L.mashed}. It is familiar, rewarms well, and pairs with almost every main. Then add ${L.riceStuffing} and ${L.greenBeans}.</p>
<h3>Can I make Thanksgiving side dishes ahead?</h3>
<p>Yes. ${L.riceStuffing} and ${L.mashCasserole} hold well overnight. Mashed potatoes rewarm gently with a splash of milk or broth. Gravy is best finished just before serving.</p>
<h3>What are good vegetarian Thanksgiving side dishes?</h3>
<p>Build around ${L.veganMash}, ${L.veganGravy}, ${L.riceStuffing}, and ${L.greenBeans}. Skip turkey bacon toppings on loaded mash if you want a fully meat-free plate.</p>
<h3>What gravy goes with mashed potatoes?</h3>
<p>Use ${L.gravy} for a classic table, or ${L.veganGravy} when you need a dairy-free option that still tastes rich.</p>

<h2 id="final-thoughts">Final Thoughts</h2>
<p>Good <strong>thanksgiving side dishes</strong> do not need a crowded stove. Choose one potato, one stuffing, one green vegetable, and gravy, then let the oven and a couple of pots do the work. Bookmark this guide, cook what fits your timeline, and come back to ${L.hub} when you are ready to lock in turkey and dessert.</p>
<p>Explore more easy <a href="/category/breakfast/"><strong>breakfast</strong></a> recipes, quick <a href="/category/lunch/"><strong>lunch</strong></a> ideas, cozy <a href="/category/dinner/"><strong>dinner</strong></a> meals, tasty <a href="/category/snacks/"><strong>snacks</strong></a>, and delightful <a href="/category/dessert/"><strong>dessert</strong></a>.</p>
`.trim();
}

async function main() {
  loadEnvLocal();
  const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const secret = process.env.CMS_IMPORT_SECRET!;
  if (!secret) throw new Error("CMS_IMPORT_SECRET missing");

  const featureLocal = FEATURE_CANDIDATES.find((p) => fs.existsSync(p));
  if (!featureLocal) {
    throw new Error(
      `Feature image not found. Expected one of:\n${FEATURE_CANDIDATES.join("\n")}`,
    );
  }

  const featureMeta = {
    alt: "Thanksgiving side dishes with mashed potatoes, stuffing, green beans, and gravy",
    title: "Thanksgiving Side Dishes Homestyle Spread",
    caption:
      "A cozy Thanksgiving sideboard with mashed potatoes, stuffing, green beans, and gravy.",
    description:
      "Homestyle Thanksgiving side dishes spread with creamy mashed potatoes, rice stuffing, green beans with almonds, and gravy on a rustic wooden table.",
  };

  const processed = await convertRecipeImageToWebp(
    fs.readFileSync(featureLocal),
    featureMeta.title,
    "feature",
    {
      caption: featureMeta.caption,
      description: featureMeta.description,
    },
  );
  const basename = buildRecipeImageBasename({
    metadata: featureMeta,
    focusKeyword: "thanksgiving side dishes",
    slug: SLUG,
  });
  const r2Key = buildRecipeImageR2Key(basename);
  await putR2Object(r2Key, processed.buffer, "image/webp", {
    "alt-text": featureMeta.alt,
    title: featureMeta.title,
    caption: featureMeta.caption,
    description: featureMeta.description,
    "focus-keyword": "thanksgiving side dishes",
    section: "feature",
  });
  const featurePath = r2KeyToPublicPath(r2Key);
  console.log(`Uploaded feature → ${featurePath}`);

  let contentHtml = buildContentHtml();
  const sectionPhotos = [
    {
      headingId: "potato-thanksgiving-sides",
      src: "/wp-content/uploads/2025/12/Delicious-Creamy-Mashed-Potatoes.webp",
      alt: "Creamy mashed potatoes for Thanksgiving",
      caption: "Potato sides from creamy mash to baked casserole.",
    },
    {
      headingId: "stuffing-and-vegetables",
      src: "/wp-content/uploads/2025/12/Delicious-Rice-Stuffing.webp",
      alt: "Rice stuffing for Thanksgiving sides",
      caption: "Rice stuffing and green beans for savory balance.",
    },
    {
      headingId: "gravy-for-thanksgiving",
      src: "/wp-content/uploads/2025/12/Delicious-Vegan-Gravy-Over-Mashed-Potatoes.webp",
      alt: "Gravy served over mashed potatoes",
      caption: "Homemade and vegan gravy options for the table.",
    },
    {
      headingId: "build-a-simple-sideboard",
      src: "/wp-content/uploads/2025/12/Delicious-Vegan-Mashed-Potatoes.webp",
      alt: "Simple Thanksgiving sideboard with mashed potatoes",
      caption: "A calm sideboard: potato, stuffing, vegetable, and gravy.",
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
      title: "Thanksgiving Side Dishes",
      excerpt:
        "Find easy Thanksgiving side dishes for mashed potatoes, stuffing, green beans, and gravy, gathered in one Grandma Recipe guide.",
      category: "dinner",
      categories: ["dinner", "snacks"],
      contentHtml,
      ingredients: [],
      instructions: [],
      featuredImage: featurePath,
      featuredImageAlt: featureMeta.alt,
      featuredImageCaption: featureMeta.caption,
      featuredImageDescription: featureMeta.description,
      seoTitle: "Thanksgiving Side Dishes: Potatoes, Stuffing, Beans, and Gravy",
      seoDescription:
        "Browse Thanksgiving side dishes: creamy mashed potatoes, rice stuffing, green beans, and gravy. A Grandma Recipe guide for the holiday table.",
      focusKeyword: "thanksgiving side dishes",
      cuisine: "American",
      course: "Thanksgiving guide",
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
        linkedRecipes: 10,
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
