/**
 * Create Easy Bread Recipes pillar guide on DEV (draft).
 * No pork / no alcohol recipes linked.
 *
 * Usage: npx tsx scripts/create-bread-recipes-pillar.ts
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
  path.join(ASSETS, "bread-recipes-feature.png"),
  path.join(ASSETS, "bread-recipes-feature.jpg"),
];
const SLUG = "bread-recipes";

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
    challah: link("challah-bread", "Challah Bread"),
    ciabatta: link("ciabatta-bread", "Homemade Ciabatta Bread"),
    focaccia: link("focaccia", "Homemade Focaccia"),
    brioche: link("brioche-loaf", "Homemade Brioche Loaf"),
    sourdough: link(
      "cinnamon-raisin-sourdough",
      "Cinnamon Raisin Sourdough Bread",
    ),
    croissantBread: link("croissant-bread", "Croissant Bread"),
    subRolls: link("sub-rolls", "Homemade Sub Rolls"),
    garlic: link("pull-apart-garlic-bread", "Pull Apart Garlic Bread"),
    pizzaBread: link("pull-apart-pizza-bread", "Pull Apart Pizza Bread"),
    bbq: link("bbq-bread", "BBQ Bread"),
    cloud: link("cloud-bread", "Fluffy Cloud Bread"),
    banana: link(
      "chocolate-chip-banana-bread",
      "Chocolate Chip Banana Bread",
    ),
    zucchini: link("zucchini-bread", "Zucchini Bread"),
    lemonZucchini: link(
      "lemon-cranberry-zucchini-bread",
      "Lemon Cranberry Zucchini Bread",
    ),
    strawberry: link("strawberry-bread", "Strawberry Bread"),
    dateNut: link("date-nut-bread", "Date Nut Bread"),
    biscuits: link("butter-biscuits", "Butter Biscuits"),
    scones: link("sticky-fingers-scone-mix", "Sticky Fingers Scones"),
    muffins: link("blueberry-muffin-mix", "Blueberry Muffins"),
    miniCroissant: link("mini-croissant-platter", "Mini Croissant Platter"),
  };

  return `
<p>Fresh bread on the table makes any meal feel like home. This guide gathers Grandma Recipe’s best <strong>bread recipes</strong>—loaves, focaccia, quick breads, biscuits, and pull-apart garlic bread—so you can pick a dough and bake with confidence.</p>

<p>Use this page as your starting point. Each section links to kitchen-tested recipes with clear steps and familiar pantry ingredients for weeknight sides, weekend baking, and cozy brunch tables.</p>

<h2 id="how-to-use-this-guide">How to Use This Bread Recipes Guide</h2>
<p>Start with the kind of bake you want:</p>
<ul>
<li><strong>Need a sandwich loaf or artisan bread?</strong> Open challah, ciabatta, brioche, or cinnamon raisin sourdough.</li>
<li><strong>Want something for dipping and sharing?</strong> Try focaccia, pull-apart garlic bread, or BBQ bread.</li>
<li><strong>Prefer a quick sweet loaf?</strong> Banana bread, zucchini bread, and strawberry bread skip the long rise.</li>
<li><strong>Baking biscuits or brunch breads?</strong> Butter biscuits, scones, muffins, and mini croissants fit morning tables.</li>
</ul>
<p>If you want a first bake with little fuss, start with ${L.banana} or ${L.garlic}. For a weekend loaf, ${L.challah} or ${L.focaccia} is a lovely place to begin.</p>

<h2 id="bread-basics">Bread Basics</h2>
<p>A few steady habits keep bread recipes tender, golden, and reliable:</p>
<ul>
<li><strong>Use warm liquid for yeast doughs</strong> — too hot can kill the yeast; too cool slows the rise.</li>
<li><strong>Knead until smooth</strong> (or follow no-knead steps carefully) so gluten can develop.</li>
<li><strong>Give dough time to rise</strong> in a draft-free spot until puffy, not rushed.</li>
<li><strong>Preheat the oven fully</strong> so loaves spring and crusts set.</li>
<li><strong>Cool before slicing</strong> so the crumb finishes setting and stays moist.</li>
</ul>

<h2 id="yeast-loaves-and-artisan-bread">Yeast Loaves and Artisan Bread</h2>
<p>Braided, crusty, and bakery-style loaves for sandwiches and Sunday supper.</p>
<ul>
<li>${L.challah} — soft braided challah bread for holidays and toast.</li>
<li>${L.ciabatta} — homemade ciabatta with an open, chewy crumb.</li>
<li>${L.focaccia} — focaccia with olive oil and a golden, dimpled top.</li>
<li>${L.brioche} — rich brioche loaf for breakfast and French toast.</li>
<li>${L.sourdough} — cinnamon raisin sourdough bread with gentle sweetness.</li>
<li>${L.croissantBread} — croissant bread with buttery, flaky layers.</li>
<li>${L.subRolls} — homemade sub rolls for sandwiches and party platters.</li>
</ul>

<h2 id="pull-apart-and-savory-breads">Pull-Apart and Savory Breads</h2>
<p>Shareable pans and sides that disappear next to soup, salad, or taco night.</p>
<ul>
<li>${L.garlic} — cheesy pull-apart garlic bread for garlic lovers.</li>
<li>${L.pizzaBread} — pull-apart pizza bread for snack boards.</li>
<li>${L.bbq} — BBQ bread with savory, smoky flavor.</li>
<li>${L.cloud} — fluffy cloud bread for a lighter roll-style bite.</li>
</ul>

<h2 id="quick-breads-and-sweet-loaves">Quick Breads and Sweet Loaves</h2>
<p>No yeast needed—mix, bake, and slice for breakfast or dessert.</p>
<ul>
<li>${L.banana} — chocolate chip banana bread for ripe bananas.</li>
<li>${L.zucchini} — classic zucchini bread with a moist crumb.</li>
<li>${L.lemonZucchini} — lemon cranberry zucchini bread with bright flavor.</li>
<li>${L.strawberry} — strawberry bread for a fruity loaf.</li>
<li>${L.dateNut} — date nut bread for an old-fashioned tea loaf.</li>
</ul>

<h2 id="biscuits-muffins-and-brunch-breads">Biscuits, Muffins, and Brunch Breads</h2>
<p>Morning bakes and soft rolls for coffee, jam, and weekend guests.</p>
<ul>
<li>${L.biscuits} — butter biscuits with flaky layers.</li>
<li>${L.scones} — sticky fingers scones for teatime.</li>
<li>${L.muffins} — blueberry muffins from a simple mix-style bake.</li>
<li>${L.miniCroissant} — mini croissant platter for brunch boards.</li>
</ul>

<h2 id="faqs">FAQs</h2>
<h3>What bread recipe should I make first?</h3>
<p>For an easy win, try ${L.banana} or ${L.garlic}. If you want a yeast loaf, start with ${L.focaccia} or ${L.challah}.</p>
<h3>How do I keep homemade bread soft?</h3>
<p>Do not overbake, cool completely, then store airtight at room temperature. Toast slices the next day if the crust firms up.</p>
<h3>Can I freeze bread recipes?</h3>
<p>Yes—cool loaves fully, wrap well, and freeze. Thaw at room temperature. ${L.banana}, ${L.subRolls}, and ${L.biscuits} freeze especially well.</p>
<h3>What is the difference between yeast bread and quick bread?</h3>
<p>Yeast breads rise with yeast and need time. Quick breads use baking powder or soda and go straight into the oven—like ${L.zucchini} or ${L.strawberry}.</p>
<h3>What should I serve with homemade bread?</h3>
<p>Soup, salad, scrambled eggs, butter and jam, or a simple pasta dinner. Pull-apart garlic bread and focaccia are natural sides for family supper.</p>

<h2 id="final-thoughts">Final Thoughts</h2>
<p>Good <strong>bread recipes</strong> do not need a bakery—just flour, patience, and a hot oven. Bookmark this guide, pick a cluster, and bake one loaf at a time. Before long you will have sandwich bread, sweet quick loaves, and pull-apart garlic bread ready for any table.</p>
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
    alt: "Easy bread recipes with homemade loaf, focaccia, banana bread, and garlic bread",
    title: "Easy Bread Recipes Homestyle Spread",
    caption:
      "A welcoming bread table: artisan loaves, quick breads, biscuits, and pull-apart garlic bread.",
    description:
      "Feature image for the easy bread recipes guide showing a home-style bread baking spread.",
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
    focusKeyword: "bread recipes",
    slug: SLUG,
  });
  const r2Key = buildRecipeImageR2Key(basename);
  await putR2Object(r2Key, processed.buffer, "image/webp", {
    "alt-text": featureMeta.alt,
    title: featureMeta.title,
    caption: featureMeta.caption,
    description: featureMeta.description,
    "focus-keyword": "bread recipes",
    section: "feature",
  });
  const featurePath = r2KeyToPublicPath(r2Key);
  console.log(`Uploaded feature → ${featurePath}`);

  let contentHtml = buildContentHtml();
  const sectionPhotos = [
    {
      headingId: "bread-basics",
      src: "/wp-content/uploads/2025/11/Homemade-Challah-Bread.webp",
      alt: "Homemade challah bread",
      caption: "Warm liquid, a full rise, and cool before slicing.",
    },
    {
      headingId: "yeast-loaves-and-artisan-bread",
      src: "/wp-content/uploads/2025/12/Artisan-Ciabatta-Bread.webp",
      alt: "Artisan ciabatta bread",
      caption: "Yeast loaves for sandwiches, toast, and Sunday supper.",
    },
    {
      headingId: "pull-apart-and-savory-breads",
      src: "/wp-content/uploads/2026/01/Mouthwatering-Pull-Apart-Garlic-Bread.webp",
      alt: "Pull-apart garlic bread",
      caption: "Shareable savory breads for dipping and snacking.",
    },
    {
      headingId: "quick-breads-and-sweet-loaves",
      src: "/wp-content/uploads/2025/06/Delicious-Chocolate-Chip-Banana-Bread-1.webp",
      alt: "Chocolate chip banana bread",
      caption: "Quick sweet loaves with no yeast wait.",
    },
    {
      headingId: "biscuits-muffins-and-brunch-breads",
      src: "/wp-content/uploads/2025/09/Delicious-Butter-Biscuits.webp",
      alt: "Butter biscuits",
      caption: "Biscuits, muffins, and brunch breads for morning tables.",
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
      title: "Easy Bread Recipes",
      excerpt:
        "Find easy bread recipes for homemade loaves, focaccia, banana bread, zucchini bread, biscuits, and pull-apart garlic bread—all gathered in one Grandma Recipe guide.",
      category: "breakfast",
      categories: ["breakfast", "snacks", "dessert"],
      contentHtml,
      ingredients: [],
      instructions: [],
      featuredImage: featurePath,
      featuredImageAlt: featureMeta.alt,
      featuredImageCaption: featureMeta.caption,
      featuredImageDescription: featureMeta.description,
      seoTitle: "Easy Bread Recipes for Loaves, Focaccia, and Quick Breads",
      seoDescription:
        "Browse easy bread recipes: challah, ciabatta, focaccia, banana bread, zucchini bread, biscuits, garlic bread, and more. A Grandma Recipe guide for home baking.",
      focusKeyword: "bread recipes",
      cuisine: "American",
      course: "Bread guide",
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
        linkedRecipes: 20,
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
