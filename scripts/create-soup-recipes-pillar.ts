/**
 * Create Easy Soup Recipes pillar guide on DEV (draft) with feature image
 * and relevant in-article photos from existing soup/stock recipes.
 *
 * Usage: npx tsx scripts/create-soup-recipes-pillar.ts
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
  path.join(ASSETS, "easy-soup-recipes-feature.png"),
  path.join(ASSETS, "easy-soup-recipes-feature.jpg"),
];
const SLUG = "easy-soup-recipes";

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
    soupStock: link("how-to-make-soup-stock", "How to Make Soup Stock"),
    vegStock: link(
      "how-to-make-vegetable-stock",
      "How to Make Vegetable Stock",
    ),
    boneBroth: link("bone-broth-recipe", "Bone Broth Recipe"),
    chickenBroth: link("chicken-bone-broth", "Chicken Bone Broth"),
    koreanBroth: link("korean-bone-broth", "Korean Bone Broth"),
    potPie: link("chicken-pot-pie-soup", "Chicken Pot Pie Soup"),
    cornChowder: link("chicken-corn-chowder", "Chicken Corn Chowder"),
    dumplings: link("chicken-and-dumplings", "Chicken and Dumplings"),
    taco: link("taco-soup", "Taco Soup"),
    whiteChili: link(
      "white-chicken-chili-crockpot",
      "White Chicken Chili Crockpot",
    ),
    vegBeef: link("vegetable-beef-soup", "Vegetable Beef Soup"),
    frenchOnion: link("french-onion-soup", "French Onion Soup"),
    broccoli: link("broccoli-soup", "Broccoli Soup"),
    broccoliPotato: link("broccoli-potato-soup", "Broccoli Potato Soup"),
    potatoCheese: link(
      "potato-broccoli-cheese-soup",
      "Potato Broccoli Cheese Soup",
    ),
    bisque: link("mushroom-bisque", "Mushroom Bisque"),
    beefBone: link("beef-bone-soup", "Beef Bone Soup"),
    lasagnaSoup: link("cozy-lasagna-soup", "Lasagna Soup"),
    asianNoodle: link("asian-noodle-soup", "Asian Noodle Soup"),
  };

  return `
<p>A simmering pot on the stove is one of the surest signs of a welcoming kitchen. Clear broth, creamy potato soup, chicken and dumplings, or a hearty chili can all start with the same idea: take your time, season honestly, and let the pot do the work. This guide gathers Grandma Recipe’s best <strong>soup recipes</strong>—stocks and broths, chicken soups, beef and chili bowls, creamy vegetable soups, and noodle soups—so you can pick a path and cook with confidence.</p>

<p>Use this page as your starting point. Each section below links to tested recipes with clear steps, familiar ingredients, and that cozy, from-scratch flavor we love on chilly evenings and quiet Sundays.</p>

<h2 id="how-to-use-this-guide">How to Use This Soup Recipes Guide</h2>
<p>Start with the kind of bowl you want:</p>
<ul>
<li><strong>Building flavor from scratch?</strong> Begin with stock or bone broth, then turn it into supper.</li>
<li><strong>Want chicken comfort?</strong> Try pot pie soup, corn chowder, or chicken and dumplings.</li>
<li><strong>Need something hearty?</strong> Open vegetable beef soup, taco soup, or white chicken chili.</li>
<li><strong>Craving creamy?</strong> Broccoli, potato, and mushroom soups belong here.</li>
</ul>
<p>If you are new to homemade broth, start with ${L.soupStock} or ${L.vegStock}. For a full supper bowl, ${L.potPie} or ${L.dumplings} is a lovely place to begin.</p>

<h2 id="soup-cooking-basics">Soup Cooking Basics</h2>
<p>A few steady habits keep soup recipes tasting rich and clear:</p>
<ul>
<li><strong>Start with a good base</strong> — homemade stock, bone broth, or a carefully simmered broth.</li>
<li><strong>Brown meat or soften aromatics first</strong> when the recipe calls for it; that early flavor carries through the pot.</li>
<li><strong>Simmer gently</strong> rather than boiling hard, so broth stays clear and vegetables keep their shape.</li>
<li><strong>Season in layers</strong> — a little salt early, then taste again near the end.</li>
<li><strong>Finish with freshness</strong> — herbs, lemon, cheese, or a swirl of cream right before serving.</li>
</ul>

<h2 id="stocks-and-broths">Stocks and Broths</h2>
<p>Great soup often begins before the soup itself. These guides help you build a pot of flavor you can use all week.</p>
<ul>
<li>${L.soupStock} — classic soup stock with chicken and vegetables.</li>
<li>${L.vegStock} — vegetable stock for lighter soups and meatless nights.</li>
<li>${L.boneBroth} — long-simmered bone broth for sipping or cooking.</li>
<li>${L.chickenBroth} — homemade chicken bone broth.</li>
<li>${L.koreanBroth} — Korean-style bone broth with a comforting bowl finish.</li>
<li>${L.beefBone} — beef bone soup for a deeper, savory sip.</li>
</ul>

<h2 id="chicken-soup-recipes">Chicken Soup Recipes</h2>
<p>Chicken soup is home in a bowl—tender meat, gentle broth, and vegetables that taste like care.</p>
<ul>
<li>${L.potPie} — chicken pot pie flavor in a spoonable soup.</li>
<li>${L.cornChowder} — creamy chicken corn chowder.</li>
<li>${L.dumplings} — homemade chicken and dumplings for a full comfort supper.</li>
<li>${L.whiteChili} — crockpot white chicken chili for busy days.</li>
</ul>

<h2 id="beef-chili-and-hearty-soups">Beef, Chili, and Hearty Soups</h2>
<p>When you want a thicker, stick-to-your-ribs bowl, these soup recipes bring more body to the table.</p>
<ul>
<li>${L.vegBeef} — vegetable beef soup with colorful vegetables and beef.</li>
<li>${L.taco} — easy taco soup with bright toppings.</li>
<li>${L.frenchOnion} — caramelized onion soup under melted cheese.</li>
<li>${L.lasagnaSoup} — lasagna flavor in a cozy tomato broth.</li>
</ul>

<h2 id="creamy-vegetable-soups">Creamy Vegetable Soups</h2>
<p>Creamy soups are soft, spoonable comfort—perfect with bread and a simple salad.</p>
<ul>
<li>${L.broccoli} — easy homemade broccoli soup.</li>
<li>${L.broccoliPotato} — creamy broccoli potato soup.</li>
<li>${L.potatoCheese} — potato broccoli cheese soup.</li>
<li>${L.bisque} — mushroom bisque with a silky finish.</li>
</ul>

<h2 id="noodle-soups">Noodle Soups</h2>
<p>Noodles turn broth into a full meal. Keep them tender, and add them near the end when the recipe says so.</p>
<ul>
<li>${L.asianNoodle} — Asian noodle soup with savory broth and toppings.</li>
<li>${L.lasagnaSoup} — pasta-night comfort in soup form.</li>
<li>${L.dumplings} — dumpling-filled chicken comfort.</li>
</ul>

<h2 id="what-to-serve-with-soup">What to Serve with Soup</h2>
<ul>
<li>Crusty bread, biscuits, or grilled cheese</li>
<li>A simple green salad or roasted vegetables</li>
<li>Rice or noodles when the bowl wants a little more bulk</li>
<li>Fresh herbs, cheese, or crackers for finishing</li>
</ul>

<h2 id="make-ahead-storage-and-leftovers">Make Ahead, Storage, and Leftovers</h2>
<ul>
<li><strong>Cool soup promptly</strong> and refrigerate within 2 hours in shallow containers.</li>
<li><strong>Use refrigerated soup</strong> within 3 to 4 days.</li>
<li><strong>Freeze</strong> cooled portions in airtight containers for up to 2 to 3 months.</li>
<li><strong>Reheat</strong> until steaming hot. Creamy soups may need a splash of broth or milk while warming.</li>
<li><strong>Noodle tip:</strong> if freezing, cook and store noodles separately when you can, so they stay firm.</li>
</ul>

<h2 id="faqs">FAQs About Soup Recipes</h2>
<h3>Do I need homemade stock to make good soup?</h3>
<p>Homemade stock adds wonderful depth, but many soup recipes still work with a quality broth. Learning ${L.soupStock} or ${L.vegStock} gives you a stronger base whenever you want it.</p>
<h3>How do I keep creamy soup from separating?</h3>
<p>Heat gently and avoid a hard boil after dairy goes in. Stir often and reheat slowly.</p>
<h3>Which soup should I make first?</h3>
<p>For a classic supper bowl, try ${L.potPie} or ${L.vegBeef}. For a cozy project, start with ${L.soupStock}.</p>
<h3>Can I make soup ahead for busy nights?</h3>
<p>Yes. Most broth-based soups taste even better the next day. Cool, refrigerate, and reheat gently before serving.</p>
<h3>What is the difference between stock and bone broth?</h3>
<p>Stock is usually a cooking base simmered with bones and vegetables. Bone broth often cooks longer for a richer sip. Compare ${L.soupStock} and ${L.boneBroth}.</p>

<h2 id="final-thoughts">Final Thoughts</h2>
<p>Good <strong>soup recipes</strong> do not need fancy equipment—just a sturdy pot, honest seasoning, and enough time for flavors to meet. Bookmark this guide, pick a cluster, and cook one pot at a time. Before long you will have stocks, creamy bowls, and hearty chili-style soups ready for the family table.</p>
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
    alt: "Easy soup recipes featuring homemade chicken soup, creamy potato soup, and simmering broth",
    title: "Easy Soup Recipes Homestyle Dinner Spread",
    caption:
      "A welcoming soup supper: homemade broth, creamy bowls, and cozy kitchen comfort.",
    description:
      "Feature image for the easy soup recipes guide showing a home-style soup dinner table.",
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
    focusKeyword: "soup recipes",
    slug: SLUG,
  });
  const r2Key = buildRecipeImageR2Key(basename);
  await putR2Object(r2Key, processed.buffer, "image/webp", {
    "alt-text": featureMeta.alt,
    title: featureMeta.title,
    caption: featureMeta.caption,
    description: featureMeta.description,
    "focus-keyword": "soup recipes",
    section: "feature",
  });
  const featurePath = r2KeyToPublicPath(r2Key);
  console.log(`Uploaded feature → ${featurePath}`);

  let contentHtml = buildContentHtml();
  const sectionPhotos = [
    {
      headingId: "stocks-and-broths",
      src: "/wp-content/uploads/2026/09/How-To-Make-Soup-Stock-With-Chicken-And-Vegetables.webp",
      alt: "Simmering soup stock with chicken and vegetables",
      caption: "Build flavor first with soup stock, vegetable stock, and bone broth.",
    },
    {
      headingId: "chicken-soup-recipes",
      src: "/wp-content/uploads/2026/01/Delicious-Chicken-Pot-Pie-Soup.webp",
      alt: "Chicken pot pie soup with vegetables and thyme",
      caption: "Chicken soups: pot pie soup, chowder, dumplings, and chili.",
    },
    {
      headingId: "beef-chili-and-hearty-soups",
      src: "/wp-content/uploads/2025/08/Delicious-Vegetable-Beef-Soup.webp",
      alt: "Vegetable beef soup with vegetables and beef chunks",
      caption: "Hearty bowls: vegetable beef, taco soup, french onion, and lasagna soup.",
    },
    {
      headingId: "creamy-vegetable-soups",
      src: "/wp-content/uploads/2026/01/Delicious-Creamy-Broccoli-Soup.webp",
      alt: "Creamy broccoli soup with bread on a wooden table",
      caption: "Creamy vegetable soups for soft, spoonable comfort.",
    },
    {
      headingId: "noodle-soups",
      src: "/wp-content/uploads/2026/08/Cozy-Lasagna-Soup-Recipe.webp",
      alt: "Lasagna soup with noodles, sausage, and cheese",
      caption: "Noodle soups that turn broth into a full meal.",
    },
    {
      headingId: "soup-cooking-basics",
      src: "/wp-content/uploads/2026/09/How-To-Make-Vegetable-Stock-At-Home.webp",
      alt: "Vegetable stock simmering with carrots, celery, and onions",
      caption: "Simmer gently, season in layers, and finish with something fresh.",
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
      title: "Easy Soup Recipes",
      excerpt:
        "Find easy soup recipes for chilly evenings and Sunday supper—homemade stock, chicken soups, beef and chili bowls, creamy vegetable soups, and noodle soups, all gathered in one cozy guide.",
      category: "dinner",
      categories: ["dinner"],
      contentHtml,
      ingredients: [],
      instructions: [],
      featuredImage: featurePath,
      featuredImageAlt: featureMeta.alt,
      featuredImageCaption: featureMeta.caption,
      featuredImageDescription: featureMeta.description,
      seoTitle: "Easy Soup Recipes for Cozy Homemade Bowls",
      seoDescription:
        "Browse easy soup recipes by style: soup stock, chicken soups, beef and chili, creamy vegetable soups, and noodle soups. A Grandma Recipe guide for family meals.",
      focusKeyword: "soup recipes",
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
