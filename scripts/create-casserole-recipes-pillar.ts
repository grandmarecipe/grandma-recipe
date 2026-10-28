/**
 * Create Easy Casserole Recipes pillar guide on DEV (draft).
 * No pork / no alcohol recipes linked.
 *
 * Usage: npx tsx scripts/create-casserole-recipes-pillar.ts
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
  path.join(ASSETS, "casserole-recipes-feature.png"),
  path.join(ASSETS, "casserole-recipes-feature.jpg"),
];
const SLUG = "casserole-recipes";

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
    chickenBroccoli: link(
      "chicken-broccoli-rice-casserole",
      "Chicken Broccoli Rice Casserole",
    ),
    kingRanch: link(
      "king-ranch-chicken-casserole",
      "King Ranch Chicken Casserole",
    ),
    doritos: link("doritos-chicken-casserole", "Doritos Chicken Casserole"),
    ritz: link(
      "ritz-cracker-chicken-casserole",
      "Easy Ritz Cracker Chicken Casserole",
    ),
    noodle: link("chicken-noodle-casserole", "Chicken Noodle Casserole"),
    cobbler: link("chicken-cobbler", "Chicken Cobbler"),
    ziti: link("chicken-baked-ziti", "Chicken Baked Ziti"),
    vegPasta: link("easy-vegetable-pasta-bake", "Easy Vegetable Pasta Bake"),
    lasagnaRolls: link("lasagna-roll-ups", "Lasagna Roll-Ups"),
    crockLasagna: link("crockpot-lasagna", "Crockpot Lasagna"),
    hashbrown: link(
      "crockpot-hashbrown-casserole",
      "Crockpot Hashbrown Casserole",
    ),
    taterTot: link(
      "chili-cheese-tater-tot-casserole",
      "Chili Cheese Tater Tot Casserole",
    ),
    cowboy: link("cowboy-casserole", "Cowboy Casserole"),
    cabbage: link("cabbage-roll-casserole", "Cabbage Roll Casserole"),
    seafood: link("seafood-bake", "Seafood Bake"),
    potato: link("potato-recipes", "Grandma's Creamy Potato Casserole"),
  };

  return `
<p>A bubbling baking dish on the table is pure weeknight comfort. This guide gathers Grandma Recipe’s best <strong>casserole recipes</strong>—creamy chicken bakes, pasta casseroles, potato sides, and hearty one-pan dinners—so you can pick a dish, assemble it, and feed the whole family.</p>

<p>Use this page as your starting point. Each section links to kitchen-tested recipes with clear steps and familiar pantry ingredients for potlucks, holidays, and easy Sunday supper.</p>

<h2 id="how-to-use-this-guide">How to Use This Casserole Recipes Guide</h2>
<p>Start with the kind of bake you want:</p>
<ul>
<li><strong>Need a full dinner?</strong> Open chicken and rice casseroles, King Ranch, Doritos chicken, or cowboy casserole.</li>
<li><strong>Want pasta comfort?</strong> Try baked ziti, lasagna roll-ups, crockpot lasagna, or vegetable pasta bake.</li>
<li><strong>Feeding a crowd with a side?</strong> Hashbrown casserole, creamy potato casserole, or tater tot casserole fit the table.</li>
<li><strong>Looking for something different?</strong> Cabbage roll casserole, chicken cobbler, or seafood bake change the pace.</li>
</ul>
<p>If you need dinner on the table with little fuss, start with ${L.chickenBroccoli} or ${L.ritz}. For a potluck side, ${L.hashbrown} or ${L.potato} is a lovely place to begin.</p>

<h2 id="casserole-basics">Casserole Basics</h2>
<p>A few steady habits keep casserole recipes creamy, golden, and reliable:</p>
<ul>
<li><strong>Grease the dish</strong> so cheese and sauce release cleanly when you scoop.</li>
<li><strong>Use day-old rice or pasta</strong> when the recipe allows—it holds up better under sauce.</li>
<li><strong>Cover, then uncover</strong> so the center heats through before the topping browns.</li>
<li><strong>Rest 5–10 minutes</strong> after baking so slices hold and the sauce thickens.</li>
<li><strong>Taste the sauce</strong> before it goes in the oven—a pinch of salt or garlic powder wakes up a mild bake.</li>
</ul>

<h2 id="chicken-casseroles">Chicken Casseroles</h2>
<p>These are weeknight workhorses—creamy, cheesy, and filling enough for supper with a simple salad.</p>
<ul>
<li>${L.chickenBroccoli} — classic chicken, broccoli, and rice under a creamy cheese sauce.</li>
<li>${L.kingRanch} — Tex-Mex chicken casserole with tortillas and bold seasoning.</li>
<li>${L.doritos} — crunchy Doritos chicken casserole for a fun family bake.</li>
<li>${L.ritz} — Ritz cracker chicken casserole with a buttery golden topping.</li>
<li>${L.noodle} — chicken noodle casserole for cozy leftover-friendly comfort.</li>
<li>${L.cobbler} — chicken cobbler with a biscuit-style topping.</li>
</ul>

<h2 id="pasta-casseroles">Pasta Casseroles</h2>
<p>Baked pasta dishes that travel well and reheat beautifully for second-day lunches.</p>
<ul>
<li>${L.ziti} — chicken baked ziti with melty cheese.</li>
<li>${L.lasagnaRolls} — lasagna roll-ups for neat, portion-friendly servings.</li>
<li>${L.crockLasagna} — crockpot lasagna when you want hands-off layering.</li>
<li>${L.vegPasta} — easy vegetable pasta bake for a meatless night.</li>
</ul>

<h2 id="potato-and-hashbrown-casseroles">Potato and Hashbrown Casseroles</h2>
<p>Golden, creamy sides that belong at holidays, potlucks, and Sunday dinner.</p>
<ul>
<li>${L.hashbrown} — crockpot hashbrown casserole with almost no oven babysitting.</li>
<li>${L.potato} — creamy potato casserole with a toasted topping.</li>
<li>${L.taterTot} — chili cheese tater tot casserole for a hearty, playful bake.</li>
</ul>

<h2 id="hearty-one-pan-casseroles">Hearty One-Pan Casseroles</h2>
<p>Bigger-flavor bakes that can be the whole meal with bread or a green salad.</p>
<ul>
<li>${L.cowboy} — cowboy casserole with savory beef and a comforting topping.</li>
<li>${L.cabbage} — cabbage roll casserole without rolling every leaf.</li>
<li>${L.seafood} — seafood bake for a lighter, coastal-style casserole night.</li>
</ul>

<h2 id="faqs">FAQs</h2>
<h3>Can I assemble a casserole ahead of time?</h3>
<p>Yes—many casserole recipes can be assembled earlier in the day, covered, and refrigerated. Add a few extra minutes of bake time if the dish goes into the oven cold.</p>
<h3>How do I keep a casserole from drying out?</h3>
<p>Use enough sauce, cover with foil for the first part of baking, and rest before serving. Start with ${L.chickenBroccoli} or ${L.hashbrown} if you want a forgiving creamy bake.</p>
<h3>What casserole should I make first?</h3>
<p>For an easy dinner, try ${L.ritz} or ${L.doritos}. For a side dish, make ${L.hashbrown} or ${L.potato}.</p>
<h3>Do casserole leftovers reheat well?</h3>
<p>They do. Cool completely, refrigerate in a covered container, and reheat covered so the topping stays moist. Pasta and rice casseroles are especially good the next day.</p>
<h3>Can casserole recipes work for potlucks?</h3>
<p>Absolutely—${L.hashbrown}, ${L.kingRanch}, and ${L.cabbage} travel well in a covered baking dish and stay warm under foil.</p>

<h2 id="final-thoughts">Final Thoughts</h2>
<p>Good <strong>casserole recipes</strong> do not need fancy ingredients—just a sturdy baking dish, a creamy sauce, and a golden topping. Bookmark this guide, pick a cluster, and make one casserole at a time. Before long you will have chicken dinners, pasta bakes, and potato sides ready for any table.</p>
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
    alt: "Easy casserole recipes with creamy chicken bake, potato casserole, and golden cheese topping",
    title: "Easy Casserole Recipes Homestyle Spread",
    caption:
      "A welcoming casserole table: creamy chicken bakes, potato sides, and golden oven comfort.",
    description:
      "Feature image for the easy casserole recipes guide showing a home-style casserole dinner spread.",
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
    focusKeyword: "casserole recipes",
    slug: SLUG,
  });
  const r2Key = buildRecipeImageR2Key(basename);
  await putR2Object(r2Key, processed.buffer, "image/webp", {
    "alt-text": featureMeta.alt,
    title: featureMeta.title,
    caption: featureMeta.caption,
    description: featureMeta.description,
    "focus-keyword": "casserole recipes",
    section: "feature",
  });
  const featurePath = r2KeyToPublicPath(r2Key);
  console.log(`Uploaded feature → ${featurePath}`);

  let contentHtml = buildContentHtml();
  const sectionPhotos = [
    {
      headingId: "casserole-basics",
      src: "/wp-content/uploads/2025/09/Delicious-Chicken-Broccoli-Rice-Casserole.webp",
      alt: "Chicken broccoli rice casserole in a baking dish",
      caption:
        "Grease the dish, cover then uncover, and rest before scooping.",
    },
    {
      headingId: "chicken-casseroles",
      src: "/wp-content/uploads/2025/08/Hearty-King-Ranch-Chicken-Casserole.webp",
      alt: "King Ranch chicken casserole ready to serve",
      caption: "Chicken casseroles for easy weeknight dinners and leftovers.",
    },
    {
      headingId: "pasta-casseroles",
      src: "/wp-content/uploads/2025/07/Delicious-Chicken-Baked-Ziti.webp",
      alt: "Chicken baked ziti with melted cheese",
      caption: "Pasta casseroles that reheat well for second-day lunches.",
    },
    {
      headingId: "potato-and-hashbrown-casseroles",
      src: "/wp-content/uploads/2026/01/Delicious-Crockpot-Hashbrown-Casserole.webp",
      alt: "Crockpot hashbrown casserole",
      caption: "Potato and hashbrown casseroles for holidays and potlucks.",
    },
    {
      headingId: "hearty-one-pan-casseroles",
      src: "/wp-content/uploads/2025/07/Delicious-COWBOY-CASSEROLE-Ready-to-Serve.webp",
      alt: "Cowboy casserole ready to serve",
      caption: "Hearty one-pan casseroles that can be the whole meal.",
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
      title: "Easy Casserole Recipes",
      excerpt:
        "Find easy casserole recipes for chicken and rice bakes, pasta casseroles, hashbrown and potato sides, cowboy casserole, and more—all gathered in one Grandma Recipe guide.",
      category: "dinner",
      categories: ["dinner"],
      contentHtml,
      ingredients: [],
      instructions: [],
      featuredImage: featurePath,
      featuredImageAlt: featureMeta.alt,
      featuredImageCaption: featureMeta.caption,
      featuredImageDescription: featureMeta.description,
      seoTitle: "Easy Casserole Recipes for Weeknight Dinners and Potlucks",
      seoDescription:
        "Browse easy casserole recipes: chicken broccoli rice, King Ranch, pasta bakes, hashbrown casserole, potato casserole, and more. A Grandma Recipe guide for family meals.",
      focusKeyword: "casserole recipes",
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
        linkedRecipes: 16,
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
