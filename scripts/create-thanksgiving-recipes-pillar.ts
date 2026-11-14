/**
 * Create Easy Thanksgiving Recipes hub/guide on DEV (draft).
 * Links existing Thanksgiving-adjacent recipes; gap recipes added later.
 * No pork / no alcohol.
 *
 * Usage: npx tsx scripts/create-thanksgiving-recipes-pillar.ts
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
  path.join(ASSETS, "thanksgiving-recipes-feature.png"),
  path.join(ASSETS, "thanksgiving-recipes-feature.jpg"),
];
const SLUG = "thanksgiving-recipes";

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
    pie: link("pumpkin-pie-recipe", "Classic Homemade Pumpkin Pie"),
    roll: link("pumpkin-roll", "Classic Pumpkin Roll"),
    bread: link("pumpkin-bread", "Grandma's Moist Pumpkin Bread"),
    muffins: link("pumpkin-muffins", "Soft Bakery-Style Pumpkin Muffins"),
    dump: link("pumpkin-dump-cake-recipe", "Pumpkin Dump Cake"),
    poke: link("pumpkin-poke-cake", "Pumpkin Poke Cake"),
    soup: link("pumpkin-soup", "Creamy Homemade Pumpkin Soup"),
    boneTurkey: link("bone-turkey-breast", "Oven-Roasted Bone Turkey Breast"),
    butterball: link(
      "butterball-turkey-breast",
      "Oven-Roasted Butterball Turkey Breast",
    ),
    frozenTurkey: link("frozen-whole-turkey", "Frozen Whole Turkey"),
    roastTurkey: link("roast-turkey", "How to Cook a Turkey"),
    mashed: link("creamy-mashed-potatoes", "Creamy Mashed Potatoes"),
    loaded: link("loaded-mashed-potatoes", "Ultimate Loaded Mashed Potatoes"),
    mashCasserole: link("mashed-potato-casserole", "Mashed Potato Casserole"),
    riceStuffing: link("rice-stuffing", "Rice Stuffing"),
    stuffing: link("classic-stuffing", "Classic Bread Stuffing"),
    greenBeanCasserole: link(
      "green-bean-casserole",
      "Homestyle Green Bean Casserole",
    ),
    sweetPotato: link(
      "sweet-potato-casserole",
      "Classic Sweet Potato Casserole",
    ),
    cranberry: link("cranberry-sauce", "Homemade Cranberry Sauce"),
    greenBeans: link(
      "green-beans-garlic-almonds",
      "Green Beans with Garlic and Almonds",
    ),
    turkeyGravy: link("turkey-gravy", "Silky Homemade Turkey Gravy"),
    gravy: link("homemade-gravy", "Homemade Gravy"),
    veganGravy: link("vegan-gravy", "Vegan Gravy"),
    veganMash: link("vegan-mashed-potatoes", "Vegan Mashed Potatoes"),
    sidesGuide: link("thanksgiving-side-dishes", "Thanksgiving Side Dishes"),
    dessertsGuide: link("thanksgiving-desserts", "Thanksgiving Desserts"),
    appsGuide: link("thanksgiving-appetizers", "Thanksgiving Appetizers"),
    dinnerGuide: link("thanksgiving-dinner-ideas", "Thanksgiving Dinner Ideas"),
  };

  return `
<p>Thanksgiving cooking feels best when the table is planned, not scrambled. This guide gathers Grandma Recipe’s best <strong>thanksgiving recipes</strong>, from juicy turkey and creamy sides to pumpkin desserts and make-ahead gravy, so you can build a menu without hunting through every category.</p>

<p>Use this page as your starting point. Each section links to kitchen-tested recipes with clear steps, familiar pantry ingredients, and family-friendly flavors for the big dinner, a smaller table for two, and cozy leftovers the next day.</p>

<h2 id="how-to-use-this-guide">How to Use This Thanksgiving Recipes Guide</h2>
<p>Start with the kind of Thanksgiving recipe you need:</p>
<ul>
<li><strong>Need the main bird?</strong> Open oven-roasted turkey breast, Butterball turkey breast, or a frozen whole turkey plan.</li>
<li><strong>Building the sideboard?</strong> Reach for mashed potatoes, rice stuffing, green beans, and gravy.</li>
<li><strong>Want a dessert centerpiece?</strong> Classic pumpkin pie leads, with rolls, breads, and dump cake as backups.</li>
<li><strong>Cooking for a smaller table?</strong> Turkey breast plus two sides and one dessert keeps the day calm.</li>
</ul>
<p>If you want one first win with big impact, start with ${L.boneTurkey} or ${L.mashed}. For dessert, ${L.pie} is the classic finish. For focused lists, open ${L.sidesGuide}, ${L.dessertsGuide}, ${L.appsGuide}, or ${L.dinnerGuide}.</p>

<p>The sections below give you room to browse at a calm pace, turkey first, then sides and desserts, with make-ahead tips and FAQs at the end.</p>

<h2 id="thanksgiving-turkey-and-mains">Thanksgiving Turkey and Mains</h2>
<p>Golden skin, juicy slices, and a main dish that anchors the whole menu.</p>
<ul>
<li>${L.roastTurkey}, a full oven roast turkey guide with timing, seasoning, and resting tips.</li>
<li>${L.boneTurkey}, herb-kissed bone-in turkey breast with lemon and garlic.</li>
<li>${L.butterball}, Butterball turkey breast with citrus, rosemary, and a honey mustard glaze.</li>
<li>${L.frozenTurkey}, a clear plan for thawing and roasting a frozen whole turkey.</li>
</ul>

<h2 id="thanksgiving-side-dishes">Thanksgiving Side Dishes</h2>
<p>Creamy mash, savory stuffing, casseroles, cranberry sauce, and gravy that ties the plate together.</p>
<ul>
<li>${L.mashed}, fluffy Yukon Gold mashed potatoes with garlic and chives.</li>
<li>${L.loaded}, loaded mashed potatoes with cheddar, turkey bacon bits, and chives.</li>
<li>${L.mashCasserole}, baked mashed potato casserole with a golden topping.</li>
<li>${L.stuffing}, classic bread stuffing with onion, celery, and herbs.</li>
<li>${L.riceStuffing}, rice stuffing with onions, celery, cranberries, and herbs.</li>
<li>${L.greenBeanCasserole}, green bean casserole with creamy sauce and crispy onions.</li>
<li>${L.sweetPotato}, sweet potato casserole with pecan streusel.</li>
<li>${L.cranberry}, homemade cranberry sauce simmered until glossy.</li>
<li>${L.greenBeans}, green beans with garlic and toasted almonds.</li>
<li>${L.turkeyGravy}, turkey gravy from drippings or broth, no wine.</li>
<li>${L.gravy}, homemade gravy for potatoes, stuffing, and turkey.</li>
<li>${L.veganGravy}, dairy-free gravy with deep savory flavor.</li>
<li>${L.veganMash}, creamy vegan mashed potatoes for plant-based plates.</li>
</ul>

<h2 id="thanksgiving-desserts">Thanksgiving Desserts</h2>
<p>Pumpkin spice, flaky crusts, and soft bakes for the dessert table.</p>
<ul>
<li>${L.pie}, classic homemade pumpkin pie with a creamy spiced filling.</li>
<li>${L.roll}, pumpkin roll with cream cheese filling.</li>
<li>${L.bread}, moist pumpkin bread for breakfast or a sweet side.</li>
<li>${L.muffins}, bakery-style pumpkin muffins with a cinnamon sparkle.</li>
<li>${L.dump}, easy pumpkin dump cake when you want dessert without fuss.</li>
<li>${L.poke}, pumpkin poke cake with a creamy soak.</li>
</ul>

<h2 id="make-ahead-thanksgiving-tips">Make-Ahead Thanksgiving Tips</h2>
<p>A few steady habits keep Thanksgiving recipes tasting homemade without last-minute panic:</p>
<ul>
<li><strong>Cook turkey breast the morning of</strong>, then rest and carve just before serving.</li>
<li><strong>Mash potatoes ahead</strong> and rewarm gently with a splash of milk or broth.</li>
<li><strong>Bake pumpkin pie the day before</strong> so the filling sets cleanly overnight.</li>
<li><strong>Toast almonds and chop herbs early</strong> so green beans and stuffing finish fast.</li>
<li><strong>Warm gravy last</strong> so it stays silky when it hits the table.</li>
</ul>

<h2 id="faqs">FAQs</h2>
<h3>What Thanksgiving recipe should I make first?</h3>
<p>For the main dish, start with ${L.boneTurkey}. For the side everyone reaches for, make ${L.mashed}. For dessert, bake ${L.pie}.</p>
<h3>Can I make Thanksgiving recipes ahead?</h3>
<p>Yes. ${L.pie}, ${L.bread}, and ${L.riceStuffing} hold well overnight. Mashed potatoes and gravy rewarm gently with a little liquid. Turkey breast is best roasted the day you serve it.</p>
<h3>What if I am cooking Thanksgiving dinner for two?</h3>
<p>Choose turkey breast instead of a whole bird, then add ${L.mashed}, ${L.greenBeans}, and ${L.pie}. You still get a full holiday plate without days of prep.</p>
<h3>Do you have vegetarian Thanksgiving options?</h3>
<p>Yes. Build a plate around ${L.veganMash}, ${L.veganGravy}, ${L.riceStuffing}, ${L.greenBeans}, and a pumpkin dessert like ${L.pie} or ${L.roll}.</p>
<h3>What should I serve with turkey besides mashed potatoes?</h3>
<p>Add ${L.riceStuffing}, ${L.greenBeans}, and ${L.gravy}, then finish with ${L.pie}. That mix covers savory, fresh, and sweet without overcrowding the oven.</p>

<h2 id="final-thoughts">Final Thoughts</h2>
<p>Good <strong>thanksgiving recipes</strong> do not need a twelve-dish scramble. Pick one turkey main, two or three sides, gravy, and one pumpkin dessert, and the table feels full. Bookmark this guide, cook what fits your timeline, and let the kitchen smell like herbs, butter, and warm spice until the last plate is cleared.</p>
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
    alt: "Easy Thanksgiving recipes with turkey, mashed potatoes, green beans, and pumpkin pie",
    title: "Easy Thanksgiving Recipes Homestyle Spread",
    caption: "A cozy Thanksgiving table with turkey, sides, and pumpkin pie.",
    description:
      "Homestyle Thanksgiving dinner spread with roasted turkey, creamy mashed potatoes, green beans, cranberry sauce, and pumpkin pie on a rustic wooden table.",
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
    focusKeyword: "thanksgiving recipes",
    slug: SLUG,
  });
  const r2Key = buildRecipeImageR2Key(basename);
  await putR2Object(r2Key, processed.buffer, "image/webp", {
    "alt-text": featureMeta.alt,
    title: featureMeta.title,
    caption: featureMeta.caption,
    description: featureMeta.description,
    "focus-keyword": "thanksgiving recipes",
    section: "feature",
  });
  const featurePath = r2KeyToPublicPath(r2Key);
  console.log(`Uploaded feature → ${featurePath}`);

  let contentHtml = buildContentHtml();
  const sectionPhotos = [
    {
      headingId: "thanksgiving-turkey-and-mains",
      src: "/wp-content/uploads/2026/01/Perfectly-Roasted-Bone-Turkey-Breast.webp",
      alt: "Oven-roasted bone turkey breast for Thanksgiving",
      caption: "Turkey breast options for a smaller or calmer holiday main.",
    },
    {
      headingId: "thanksgiving-side-dishes",
      src: "/wp-content/uploads/2025/12/Delicious-Creamy-Mashed-Potatoes.webp",
      alt: "Creamy mashed potatoes for Thanksgiving sides",
      caption: "Mashed potatoes, stuffing, green beans, and gravy for the sideboard.",
    },
    {
      headingId: "thanksgiving-desserts",
      src: "/wp-content/uploads/2026/10/Classic-Homemade-Pumpkin-Pie-Recipe.webp",
      alt: "Classic homemade pumpkin pie for Thanksgiving dessert",
      caption: "Pumpkin pie, roll, bread, muffins, and dump cake for dessert.",
    },
    {
      headingId: "make-ahead-thanksgiving-tips",
      src: "/wp-content/uploads/2025/12/Delicious-Rice-Stuffing.webp",
      alt: "Rice stuffing ready for a Thanksgiving make-ahead plan",
      caption: "Make-ahead sides and pies keep Thanksgiving day calmer.",
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
      title: "Easy Thanksgiving Recipes",
      excerpt:
        "Find easy Thanksgiving recipes for turkey, mashed potatoes, stuffing, green beans, gravy, and pumpkin pie, all gathered in one Grandma Recipe guide.",
      category: "dinner",
      categories: ["dinner", "dessert", "snacks"],
      contentHtml,
      ingredients: [],
      instructions: [],
      featuredImage: featurePath,
      featuredImageAlt: featureMeta.alt,
      featuredImageCaption: featureMeta.caption,
      featuredImageDescription: featureMeta.description,
      seoTitle: "Easy Thanksgiving Recipes for Turkey, Sides, and Pie",
      seoDescription:
        "Browse easy Thanksgiving recipes: turkey breast, mashed potatoes, stuffing, green beans, gravy, and pumpkin pie. A Grandma Recipe guide for the holiday table.",
      focusKeyword: "thanksgiving recipes",
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
        linkedRecipes: 17,
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
