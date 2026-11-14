/**
 * Create Thanksgiving Desserts guide on DEV (draft).
 * Links existing pumpkin desserts; more dessert spokes can be added later.
 * No pork / no alcohol.
 *
 * Usage: npx tsx scripts/create-thanksgiving-desserts-guide.ts
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
  path.join(ASSETS, "thanksgiving-desserts-feature.png"),
  path.join(ASSETS, "thanksgiving-desserts-feature.jpg"),
];
const SLUG = "thanksgiving-desserts";

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
    hub: link("thanksgiving-recipes", "Easy Thanksgiving Recipes"),
    sides: link("thanksgiving-side-dishes", "Thanksgiving Side Dishes"),
  };

  return `
<p>After the turkey and gravy, <strong>thanksgiving desserts</strong> bring the table back to warm spice and whipped cream. This guide gathers Grandma Recipe’s best holiday sweets, from classic pumpkin pie to rolls, breads, muffins, and easy dump cake, so dessert feels planned instead of rushed.</p>

<p>Use this page as your dessert shortlist. Each recipe uses familiar pantry ingredients and clear steps for a full dessert table, a single centerpiece pie, or bake-ahead treats for guests.</p>

<h2 id="how-to-use-this-guide">How to Use This Thanksgiving Desserts Guide</h2>
<p>Start with the kind of dessert you need:</p>
<ul>
<li><strong>Want the classic centerpiece?</strong> Bake pumpkin pie the day before so it sets overnight.</li>
<li><strong>Need a pretty sliceable cake?</strong> Pumpkin roll looks special without fussy frosting work.</li>
<li><strong>Baking for breakfast leftovers?</strong> Pumpkin bread and muffins travel well the next morning.</li>
<li><strong>Short on time?</strong> Pumpkin dump cake or poke cake keeps dessert warm and simple.</li>
</ul>
<p>If you only make one dessert, start with ${L.pie}. For the full holiday menu, return to ${L.hub} and ${L.sides}.</p>

<p>Pie comes first below, then cakes and rolls, then breads and muffins, with make-ahead tips before the FAQs.</p>

<h2 id="classic-pumpkin-pie">Classic Pumpkin Pie</h2>
<p>The dessert most people expect on a Thanksgiving table.</p>
<ul>
<li>${L.pie}, classic homemade pumpkin pie with a creamy spiced filling and flaky crust.</li>
</ul>

<h2 id="pumpkin-cakes-and-rolls">Pumpkin Cakes and Rolls</h2>
<p>Soft cakes for a second dessert tray or a smaller celebration.</p>
<ul>
<li>${L.roll}, pumpkin roll with cream cheese filling and a dusting of powdered sugar.</li>
<li>${L.poke}, pumpkin poke cake with a creamy soak and soft crumb.</li>
<li>${L.dump}, easy pumpkin dump cake when you want dessert without mixing fuss.</li>
</ul>

<h2 id="pumpkin-breads-and-muffins">Pumpkin Breads and Muffins</h2>
<p>Bake-ahead loaves and muffins for Thanksgiving week breakfasts and neighbor gifts.</p>
<ul>
<li>${L.bread}, moist pumpkin bread with warm spices.</li>
<li>${L.muffins}, bakery-style pumpkin muffins with a cinnamon-sugar sparkle.</li>
</ul>

<h2 id="make-ahead-dessert-tips">Make-Ahead Dessert Tips</h2>
<p>A few steady habits keep Thanksgiving desserts calm:</p>
<ul>
<li><strong>Bake pie the day before</strong> so the filling sets cleanly before slicing.</li>
<li><strong>Cool cakes fully</strong> before rolling or frosting so layers stay neat.</li>
<li><strong>Wrap breads and muffins airtight</strong> so they stay moist overnight.</li>
<li><strong>Whip cream just before serving</strong> for the freshest finish on pie.</li>
<li><strong>Keep one easy backup</strong> like dump cake if oven space is tight on turkey day.</li>
</ul>

<h2 id="faqs">FAQs</h2>
<h3>What is the best Thanksgiving dessert to make first?</h3>
<p>Start with ${L.pie}. It is the classic finish and holds beautifully overnight in the fridge.</p>
<h3>Can I make Thanksgiving desserts ahead?</h3>
<p>Yes. ${L.pie}, ${L.bread}, and ${L.muffins} all keep well. Pumpkin roll chills nicely once filled. Dump cake is best warm from the oven.</p>
<h3>What if I do not want to make pie crust?</h3>
<p>Choose ${L.dump} or ${L.poke} for a pumpkin dessert without rolling dough, or bake ${L.bread} for a simpler sweet finish.</p>
<h3>How many Thanksgiving desserts do I need?</h3>
<p>One centerpiece pie is enough for most tables. Add pumpkin roll or muffins if you want a second option for kids or overnight guests.</p>
<h3>What dessert pairs well with a full turkey dinner?</h3>
<p>${L.pie} is the classic match. If dinner already feels heavy, serve smaller slices of pie beside ${L.muffins} for a lighter second tray.</p>

<h2 id="final-thoughts">Final Thoughts</h2>
<p>Good <strong>thanksgiving desserts</strong> do not need a bakery counter of options. Pick one pumpkin pie, maybe one cake or bread, and let whipped cream do the rest. Bookmark this guide, bake what fits your timeline, and return to ${L.hub} when you are ready to finish turkey and sides.</p>
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
    alt: "Thanksgiving desserts with pumpkin pie, pumpkin roll, muffins, and bread",
    title: "Thanksgiving Desserts Homestyle Spread",
    caption:
      "A cozy Thanksgiving dessert table with pumpkin pie, roll, muffins, and bread.",
    description:
      "Homestyle Thanksgiving desserts spread with classic pumpkin pie, pumpkin roll, muffins, and pumpkin bread on a rustic wooden table.",
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
    focusKeyword: "thanksgiving desserts",
    slug: SLUG,
  });
  const r2Key = buildRecipeImageR2Key(basename);
  await putR2Object(r2Key, processed.buffer, "image/webp", {
    "alt-text": featureMeta.alt,
    title: featureMeta.title,
    caption: featureMeta.caption,
    description: featureMeta.description,
    "focus-keyword": "thanksgiving desserts",
    section: "feature",
  });
  const featurePath = r2KeyToPublicPath(r2Key);
  console.log(`Uploaded feature → ${featurePath}`);

  let contentHtml = buildContentHtml();
  const sectionPhotos = [
    {
      headingId: "classic-pumpkin-pie",
      src: "/wp-content/uploads/2026/10/Classic-Homemade-Pumpkin-Pie-Recipe.webp",
      alt: "Classic homemade pumpkin pie for Thanksgiving",
      caption: "Pumpkin pie as the classic Thanksgiving dessert centerpiece.",
    },
    {
      headingId: "pumpkin-cakes-and-rolls",
      src: "/wp-content/uploads/2026/10/Classic-Pumpkin-Roll-With-Cream-Cheese-Filling.webp",
      alt: "Classic pumpkin roll for Thanksgiving dessert",
      caption: "Pumpkin roll, poke cake, and dump cake for a second tray.",
    },
    {
      headingId: "pumpkin-breads-and-muffins",
      src: "/wp-content/uploads/2026/10/Grandmas-Moist-Pumpkin-Bread.webp",
      alt: "Grandma's moist pumpkin bread",
      caption: "Pumpkin bread and muffins for bake-ahead sweets.",
    },
    {
      headingId: "make-ahead-dessert-tips",
      src: "/wp-content/uploads/2026/10/Soft-Bakery-style-Pumpkin-Muffins.webp",
      alt: "Soft bakery-style pumpkin muffins",
      caption: "Make-ahead tips for pie, cakes, breads, and muffins.",
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
      title: "Thanksgiving Desserts",
      excerpt:
        "Find easy Thanksgiving desserts for pumpkin pie, pumpkin roll, bread, muffins, and dump cake, gathered in one Grandma Recipe guide.",
      category: "dessert",
      categories: ["dessert", "breakfast"],
      contentHtml,
      ingredients: [],
      instructions: [],
      featuredImage: featurePath,
      featuredImageAlt: featureMeta.alt,
      featuredImageCaption: featureMeta.caption,
      featuredImageDescription: featureMeta.description,
      seoTitle: "Thanksgiving Desserts: Pumpkin Pie, Rolls, Breads, and More",
      seoDescription:
        "Browse Thanksgiving desserts: pumpkin pie, pumpkin roll, bread, muffins, poke cake, and dump cake. A Grandma Recipe guide for the holiday table.",
      focusKeyword: "thanksgiving desserts",
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
        linkedRecipes: 8,
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
