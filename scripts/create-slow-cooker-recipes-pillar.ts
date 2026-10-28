/**
 * Create Easy Slow Cooker Recipes pillar guide on DEV (draft).
 *
 * Usage: npx tsx scripts/create-slow-cooker-recipes-pillar.ts
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
  path.join(ASSETS, "slow-cooker-recipes-feature.png"),
  path.join(ASSETS, "slow-cooker-recipes-feature.jpg"),
];
const SLUG = "slow-cooker-recipes";

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
    barbacoa: link(
      "slow-cooker-style-beef-barbacoa",
      "Slow Cooker-Style Beef Barbacoa",
    ),
    potRoast: link("mississippi-pot-roast", "Mississippi Pot Roast"),
    hashbrown: link(
      "crockpot-hashbrown-casserole",
      "Crockpot Hashbrown Casserole",
    ),
    stroganoff: link(
      "slow-cooker-chicken-stroganoff",
      "Slow Cooker Chicken Stroganoff",
    ),
    beefNoodles: link("crock-pot-beef-and-noodles", "Crock Pot Beef and Noodles"),
    chuck: link("beef-chuck-steak", "Slow-Cooked Beef Chuck Steak"),
    brisket: link("beef-brisket-flat", "Slow-Cooked Beef Brisket Flat"),
    chili: link("white-chicken-chili-crockpot", "White Chicken Chili Crockpot"),
    mac: link("crockpot-mac-and-cheese", "Crockpot Mac and Cheese"),
    spaghetti: link("crockpot-spaghetti", "Crockpot Spaghetti"),
    lasagna: link("crockpot-lasagna", "Crockpot Lasagna"),
    alfredo: link(
      "crockpot-chicken-alfredo-pasta",
      "Crockpot Chicken Alfredo Pasta",
    ),
    chickenRice: link(
      "slow-cooker-chicken-and-rice",
      "Slow Cooker Chicken and Rice",
    ),
    cider: link("crock-pot-apple-cider", "Crock Pot Apple Cider"),
    wings: link("crockpot-hawaiian-wings", "Crockpot Hawaiian Wings"),
    bbq: link("slow-cooker-bbq-chicken", "Slow Cooker BBQ Chicken"),
    peppers: link(
      "slow-cooker-meatloaf-stuffed-peppers",
      "Slow Cooker Meatloaf Stuffed Peppers",
    ),
  };

  return `
<p>A slow cooker turns a busy day into a welcoming kitchen—set it in the morning, come home to pot roast, creamy pasta, or shredded BBQ chicken. This guide gathers Grandma Recipe’s best <strong>slow cooker recipes</strong> (and crockpot favorites) so you can pick a pot and cook with confidence.</p>

<p>Use this page as your starting point. Each section links to tested recipes with clear steps, familiar ingredients, and that cozy, hands-off comfort we love on weeknights and Sundays.</p>

<h2 id="how-to-use-this-guide">How to Use This Slow Cooker Recipes Guide</h2>
<p>Start with the kind of supper you want:</p>
<ul>
<li><strong>Want fall-apart beef?</strong> Open pot roast, barbacoa, beef and noodles, chuck steak, or brisket.</li>
<li><strong>Craving chicken comfort?</strong> Try BBQ chicken, stroganoff, chicken and rice, Alfredo, chili, or Hawaiian wings.</li>
<li><strong>Need a pasta night?</strong> Crockpot mac and cheese, spaghetti, and lasagna belong here.</li>
<li><strong>Looking beyond dinner?</strong> Hashbrown casserole for breakfast and warm apple cider for gatherings.</li>
</ul>
<p>If you are new to the crockpot, start with ${L.bbq} or ${L.mac}. For a classic Sunday supper, ${L.potRoast} is a lovely place to begin.</p>

<h2 id="slow-cooker-basics">Slow Cooker Basics</h2>
<p>A few steady habits keep slow cooker recipes rich and tender:</p>
<ul>
<li><strong>Brown meat first</strong> when the recipe calls for it—that early flavor carries through the pot.</li>
<li><strong>Do not lift the lid often</strong> — each peek releases heat and adds cook time.</li>
<li><strong>Layer thoughtfully</strong> — denser vegetables and meats near the bottom when the recipe says so.</li>
<li><strong>Use the right amount of liquid</strong> — slow cookers trap steam, so you usually need less than stovetop soup.</li>
<li><strong>Finish and taste</strong> — salt, herbs, or a splash of acid at the end wakes up long-cooked flavors.</li>
</ul>

<h2 id="beef-slow-cooker-recipes">Beef Slow Cooker Recipes</h2>
<p>These pots deliver tender beef for tacos, noodles, and Sunday plates.</p>
<ul>
<li>${L.potRoast} — Mississippi pot roast with that classic peppery gravy.</li>
<li>${L.barbacoa} — slow cooker-style beef barbacoa for warm tortillas.</li>
<li>${L.beefNoodles} — comforting crock pot beef and noodles.</li>
<li>${L.chuck} — slow-cooked beef chuck steak with vegetables.</li>
<li>${L.brisket} — slow-cooked beef brisket flat.</li>
<li>${L.peppers} — meatloaf stuffed peppers from the slow cooker.</li>
</ul>

<h2 id="chicken-slow-cooker-recipes">Chicken Slow Cooker Recipes</h2>
<p>Chicken shines in the crockpot—juicy, shreddable, and ready for rice, pasta, or buns.</p>
<ul>
<li>${L.bbq} — slow cooker BBQ chicken.</li>
<li>${L.stroganoff} — creamy slow cooker chicken stroganoff.</li>
<li>${L.chickenRice} — slow cooker chicken and rice.</li>
<li>${L.alfredo} — crockpot chicken Alfredo pasta.</li>
<li>${L.chili} — white chicken chili crockpot.</li>
<li>${L.wings} — crockpot Hawaiian wings.</li>
</ul>

<h2 id="crockpot-pasta-and-casseroles">Crockpot Pasta and Casseroles</h2>
<p>Hands-off pasta nights and breakfast casserole comfort from the slow cooker.</p>
<ul>
<li>${L.mac} — creamy crockpot mac and cheese.</li>
<li>${L.spaghetti} — crockpot spaghetti.</li>
<li>${L.lasagna} — crockpot lasagna.</li>
<li>${L.hashbrown} — crockpot hashbrown casserole for breakfast or brunch.</li>
</ul>

<h2 id="sips-and-gatherings">Sips and Gatherings</h2>
<p>Not every slow cooker recipe is supper—some fill the house with a welcoming aroma for guests.</p>
<ul>
<li>${L.cider} — warm crock pot apple cider.</li>
</ul>

<h2 id="faqs">FAQs</h2>
<h3>Can I use a crockpot and a slow cooker the same way?</h3>
<p>Yes for most home recipes. Times may vary by model, so check doneness near the end of the range.</p>
<h3>Which slow cooker recipe should I make first?</h3>
<p>Try ${L.bbq} or ${L.mac} for an easy win. For a classic roast dinner, start with ${L.potRoast}.</p>
<h3>Do I need to add lots of water?</h3>
<p>Usually no. Slow cookers hold moisture. Follow each recipe’s liquid amount so sauces stay rich, not watery.</p>
<h3>Can I cook from frozen meat?</h3>
<p>For food safety, thaw meat in the fridge first unless a recipe specifically says otherwise.</p>
<h3>How do I store leftovers?</h3>
<p>Cool, refrigerate in airtight containers, and reheat gently. Many beef and chicken pots taste even better the next day.</p>

<h2 id="final-thoughts">Final Thoughts</h2>
<p>Good <strong>slow cooker recipes</strong> do not need constant stirring—just a sturdy pot, honest seasoning, and enough time for flavors to meet. Bookmark this guide, pick a cluster, and set one pot at a time. Before long you will have pot roast, BBQ chicken, creamy pasta, and cozy casserole nights ready whenever the family walks in hungry.</p>
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
    alt: "Easy slow cooker recipes with pot roast, BBQ chicken, mac and cheese, and barbacoa",
    title: "Easy Slow Cooker Recipes Homestyle Spread",
    caption:
      "A welcoming slow cooker supper: pot roast, BBQ chicken, creamy pasta, and shredded beef.",
    description:
      "Feature image for the easy slow cooker recipes guide showing a home-style crockpot dinner spread.",
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
    focusKeyword: "slow cooker recipes",
    slug: SLUG,
  });
  const r2Key = buildRecipeImageR2Key(basename);
  await putR2Object(r2Key, processed.buffer, "image/webp", {
    "alt-text": featureMeta.alt,
    title: featureMeta.title,
    caption: featureMeta.caption,
    description: featureMeta.description,
    "focus-keyword": "slow cooker recipes",
    section: "feature",
  });
  const featurePath = r2KeyToPublicPath(r2Key);
  console.log(`Uploaded feature → ${featurePath}`);

  let contentHtml = buildContentHtml();
  const sectionPhotos = [
    {
      headingId: "slow-cooker-basics",
      src: "/wp-content/uploads/2026/01/Mouthwatering-Mississippi-Pot-Roast.webp",
      alt: "Mississippi pot roast from the slow cooker",
      caption: "Brown when needed, keep the lid on, and finish with a final taste.",
    },
    {
      headingId: "beef-slow-cooker-recipes",
      src: "/wp-content/uploads/2026/09/Slow-Cooker-Beef-Barbacoa-With-Warm-Tortillas.webp",
      alt: "Slow cooker beef barbacoa with warm tortillas",
      caption: "Beef pots: pot roast, barbacoa, noodles, chuck, and brisket.",
    },
    {
      headingId: "chicken-slow-cooker-recipes",
      src: "/wp-content/uploads/2025/07/Savory-Slow-Cooker-BBQ-Chicken-Delight.webp",
      alt: "Slow cooker BBQ chicken ready to serve",
      caption: "Chicken pots: BBQ, stroganoff, rice, Alfredo, chili, and wings.",
    },
    {
      headingId: "crockpot-pasta-and-casseroles",
      src: "/wp-content/uploads/2025/09/Creamy-Crockpot-Mac-and-Cheese.webp",
      alt: "Creamy crockpot mac and cheese",
      caption: "Hands-off pasta nights and hashbrown casserole comfort.",
    },
    {
      headingId: "sips-and-gatherings",
      src: "/wp-content/uploads/2025/08/Warm-and-Inviting-Crock-Pot-Apple-Cider.webp",
      alt: "Warm crock pot apple cider",
      caption: "Gathering sips like warm crock pot apple cider.",
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
      title: "Easy Slow Cooker Recipes",
      excerpt:
        "Find easy slow cooker recipes for pot roast, BBQ chicken, crockpot pasta, white chicken chili, barbacoa, and more—hands-off comfort from Grandma Recipe.",
      category: "dinner",
      categories: ["dinner"],
      contentHtml,
      ingredients: [],
      instructions: [],
      featuredImage: featurePath,
      featuredImageAlt: featureMeta.alt,
      featuredImageCaption: featureMeta.caption,
      featuredImageDescription: featureMeta.description,
      seoTitle: "Easy Slow Cooker Recipes for Cozy Family Dinners",
      seoDescription:
        "Browse easy slow cooker recipes: Mississippi pot roast, BBQ chicken, crockpot mac and cheese, lasagna, chili, and more. A Grandma Recipe guide.",
      focusKeyword: "slow cooker recipes",
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
