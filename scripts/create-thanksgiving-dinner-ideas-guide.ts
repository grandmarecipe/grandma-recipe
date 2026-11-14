/**
 * Create Thanksgiving Dinner Ideas guide on DEV (draft).
 * Menu-building guide: for two, classic table, vegetarian plate.
 * No pork / no alcohol.
 *
 * Usage: npx tsx scripts/create-thanksgiving-dinner-ideas-guide.ts
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
  path.join(ASSETS, "thanksgiving-dinner-ideas-feature.png"),
  path.join(ASSETS, "thanksgiving-dinner-ideas-feature.jpg"),
];
const SLUG = "thanksgiving-dinner-ideas";

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
    hub: link("thanksgiving-recipes", "Easy Thanksgiving Recipes"),
    sides: link("thanksgiving-side-dishes", "Thanksgiving Side Dishes"),
    desserts: link("thanksgiving-desserts", "Thanksgiving Desserts"),
    apps: link("thanksgiving-appetizers", "Thanksgiving Appetizers"),
    boneTurkey: link("bone-turkey-breast", "Oven-Roasted Bone Turkey Breast"),
    butterball: link(
      "butterball-turkey-breast",
      "Oven-Roasted Butterball Turkey Breast",
    ),
    frozenTurkey: link("frozen-whole-turkey", "Frozen Whole Turkey"),
    mashed: link("creamy-mashed-potatoes", "Creamy Mashed Potatoes"),
    loaded: link("loaded-mashed-potatoes", "Ultimate Loaded Mashed Potatoes"),
    riceStuffing: link("rice-stuffing", "Rice Stuffing"),
    greenBeans: link(
      "green-beans-garlic-almonds",
      "Green Beans with Garlic and Almonds",
    ),
    gravy: link("homemade-gravy", "Homemade Gravy"),
    veganGravy: link("vegan-gravy", "Vegan Gravy"),
    veganMash: link("vegan-mashed-potatoes", "Vegan Mashed Potatoes"),
    pie: link("pumpkin-pie-recipe", "Classic Homemade Pumpkin Pie"),
    roll: link("pumpkin-roll", "Classic Pumpkin Roll"),
    cheeseBall: link("classic-cheese-ball", "Classic Cheese Ball"),
    cider: link("spiced-apple-cider", "Spiced Apple Cider"),
  };

  return `
<p>Planning the holiday meal is easier when you start with ready-made <strong>thanksgiving dinner ideas</strong> instead of a blank grocery list. This guide builds full menus from Grandma Recipe’s turkey, sides, desserts, and appetizers so you can choose a classic table, a dinner for two, or a vegetarian plate without overcomplicating the day.</p>

<p>Use each menu as a shopping shortlist. Swap freely, keep gravy and pie if nothing else, and lean on ${L.hub} when you want every linked recipe in one place.</p>

<h2 id="how-to-use-this-guide">How to Use This Thanksgiving Dinner Ideas Guide</h2>
<p>Pick the menu that matches your table:</p>
<ul>
<li><strong>Classic family dinner?</strong> Turkey breast, mashed potatoes, stuffing, green beans, gravy, and pie.</li>
<li><strong>Cooking for two?</strong> Smaller turkey breast, two sides, and one dessert.</li>
<li><strong>Vegetarian guests?</strong> Build around mashed potatoes, gravy, stuffing, green beans, and pumpkin dessert.</li>
<li><strong>Want a calm timeline?</strong> Add one appetizer and one drink, then stop there.</li>
</ul>
<p>Browse ${L.sides}, ${L.desserts}, and ${L.apps} if you want to swap pieces inside a menu.</p>

<p>Three ready menus sit below, classic family, dinner for two, and vegetarian, followed by timing tips so the day stays calm.</p>

<h2 id="classic-thanksgiving-dinner-menu">Classic Thanksgiving Dinner Menu</h2>
<p>A full holiday plate with familiar flavors and a clear shopping list.</p>
<ul>
<li><strong>Main:</strong> ${L.boneTurkey} or ${L.butterball}</li>
<li><strong>Sides:</strong> ${L.mashed}, ${L.riceStuffing}, ${L.greenBeans}</li>
<li><strong>Gravy:</strong> ${L.gravy}</li>
<li><strong>Dessert:</strong> ${L.pie}</li>
<li><strong>Optional starter:</strong> ${L.cheeseBall} with crackers</li>
</ul>

<h2 id="thanksgiving-dinner-for-two">Thanksgiving Dinner for Two</h2>
<p>A smaller table still feels festive without a whole bird or a dozen pans.</p>
<ul>
<li><strong>Main:</strong> ${L.boneTurkey} (save leftovers for sandwiches)</li>
<li><strong>Sides:</strong> ${L.mashed} and ${L.greenBeans}</li>
<li><strong>Gravy:</strong> ${L.gravy}</li>
<li><strong>Dessert:</strong> ${L.pie} or ${L.roll}</li>
<li><strong>Drink:</strong> ${L.cider}</li>
</ul>

<h2 id="vegetarian-thanksgiving-dinner">Vegetarian Thanksgiving Dinner</h2>
<p>A hearty plate that skips meat without skipping comfort.</p>
<ul>
<li><strong>Center of the plate:</strong> ${L.veganMash} with ${L.veganGravy}</li>
<li><strong>Sides:</strong> ${L.riceStuffing} and ${L.greenBeans}</li>
<li><strong>Dessert:</strong> ${L.pie} or ${L.roll}</li>
<li><strong>Optional starter:</strong> ${L.cheeseBall} or a fresh dip from ${L.apps}</li>
</ul>

<h2 id="timing-and-make-ahead">Timing and Make-Ahead</h2>
<p>A simple order keeps Thanksgiving dinner ideas from turning into chaos:</p>
<ul>
<li><strong>Day before:</strong> Bake pie, chill a cheese ball, chop onions and celery for stuffing.</li>
<li><strong>Morning of:</strong> Roast turkey breast, simmer cider, set the table.</li>
<li><strong>Last hour:</strong> Finish mashed potatoes, green beans, and gravy.</li>
<li><strong>Whole bird plan:</strong> Use ${L.frozenTurkey} if you need thawing and roasting guidance.</li>
<li><strong>Keep dessert cold:</strong> Pie rests while you carve, then whipped cream goes on at the end.</li>
</ul>

<h2 id="faqs">FAQs</h2>
<h3>What is the easiest Thanksgiving dinner idea?</h3>
<p>Roast ${L.boneTurkey}, make ${L.mashed}, ${L.greenBeans}, and ${L.gravy}, then finish with ${L.pie}. That five-recipe menu covers the whole meal.</p>
<h3>What should I cook for Thanksgiving dinner for two?</h3>
<p>Skip a whole turkey. Use turkey breast, two sides, gravy, and one dessert. ${L.cider} makes the table feel holiday-ready without extra cooking.</p>
<h3>Can I plan a vegetarian Thanksgiving dinner?</h3>
<p>Yes. Center the plate on ${L.veganMash} and ${L.veganGravy}, then add ${L.riceStuffing}, ${L.greenBeans}, and a pumpkin dessert.</p>
<h3>How far ahead can I prep Thanksgiving dinner?</h3>
<p>Pie and cheese ball can be made the day before. Vegetables can be washed and chopped early. Turkey breast and gravy are best the day you serve.</p>
<h3>Where do I find all the linked recipes?</h3>
<p>Start with ${L.hub}, then open ${L.sides}, ${L.desserts}, and ${L.apps} for focused lists.</p>

<h2 id="final-thoughts">Final Thoughts</h2>
<p>Good <strong>thanksgiving dinner ideas</strong> are really just a short menu you can cook with calm. Choose one main, two or three sides, gravy, and pie, then stop adding dishes. Bookmark this guide, shop once, and let ${L.hub} be your home base until every plate is served.</p>
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
    alt: "Thanksgiving dinner ideas with turkey, mashed potatoes, green beans, and pie",
    title: "Thanksgiving Dinner Ideas Homestyle Spread",
    caption:
      "A complete Thanksgiving dinner table with turkey, sides, and pumpkin pie.",
    description:
      "Homestyle Thanksgiving dinner ideas spread with roasted turkey breast, mashed potatoes, green beans, gravy, and pumpkin pie on a rustic wooden table.",
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
    focusKeyword: "thanksgiving dinner ideas",
    slug: SLUG,
  });
  const r2Key = buildRecipeImageR2Key(basename);
  await putR2Object(r2Key, processed.buffer, "image/webp", {
    "alt-text": featureMeta.alt,
    title: featureMeta.title,
    caption: featureMeta.caption,
    description: featureMeta.description,
    "focus-keyword": "thanksgiving dinner ideas",
    section: "feature",
  });
  const featurePath = r2KeyToPublicPath(r2Key);
  console.log(`Uploaded feature → ${featurePath}`);

  let contentHtml = buildContentHtml();
  const sectionPhotos = [
    {
      headingId: "classic-thanksgiving-dinner-menu",
      src: "/wp-content/uploads/2026/01/Perfectly-Roasted-Bone-Turkey-Breast.webp",
      alt: "Classic Thanksgiving dinner with roasted turkey breast",
      caption: "Classic menu: turkey, mash, stuffing, beans, gravy, and pie.",
    },
    {
      headingId: "thanksgiving-dinner-for-two",
      src: "/wp-content/uploads/2025/12/Delicious-Creamy-Mashed-Potatoes.webp",
      alt: "Thanksgiving dinner for two with mashed potatoes",
      caption: "A smaller menu that still feels like the holiday.",
    },
    {
      headingId: "vegetarian-thanksgiving-dinner",
      src: "/wp-content/uploads/2025/12/Delicious-Vegan-Mashed-Potatoes.webp",
      alt: "Vegetarian Thanksgiving dinner with mashed potatoes",
      caption: "A plant-based plate built on mash, gravy, and sides.",
    },
    {
      headingId: "timing-and-make-ahead",
      src: "/wp-content/uploads/2026/10/Classic-Homemade-Pumpkin-Pie-Recipe.webp",
      alt: "Pumpkin pie baked ahead for Thanksgiving",
      caption: "Bake pie ahead and finish gravy last.",
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
      title: "Thanksgiving Dinner Ideas",
      excerpt:
        "Find easy Thanksgiving dinner ideas for a classic family menu, dinner for two, and a vegetarian plate, with turkey, sides, gravy, and pie.",
      category: "dinner",
      categories: ["dinner", "dessert", "snacks"],
      contentHtml,
      ingredients: [],
      instructions: [],
      featuredImage: featurePath,
      featuredImageAlt: featureMeta.alt,
      featuredImageCaption: featureMeta.caption,
      featuredImageDescription: featureMeta.description,
      seoTitle: "Thanksgiving Dinner Ideas for Family, Two, and Vegetarian Menus",
      seoDescription:
        "Browse Thanksgiving dinner ideas: classic turkey menu, dinner for two, and vegetarian plates with sides, gravy, and pumpkin pie.",
      focusKeyword: "thanksgiving dinner ideas",
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
