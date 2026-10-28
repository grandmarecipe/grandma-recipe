/**
 * Create Easy Pasta Recipes pillar guide on DEV (draft) with feature image
 * and relevant in-article photos from existing pasta recipes.
 *
 * Usage: npx tsx scripts/create-pasta-recipes-pillar.ts
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
const FEATURE_PNG =
  "/Users/talhaoui/.cursor/projects/Users-talhaoui-Desktop-cursor-projects-grandma-recipe/assets/easy-pasta-recipes-feature.png";
const SLUG = "easy-pasta-recipes";

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
    vegLasagna: link(
      "homemade-vegetarian-lasagna-recipe",
      "Homemade Vegetarian Lasagna",
    ),
    lasagnaSoup: link("cozy-lasagna-soup", "Cozy Lasagna Soup"),
    crockLasagna: link("crockpot-lasagna", "Crockpot Lasagna"),
    marry: link("marry-me-chicken-pasta", "Marry Me Chicken Pasta"),
    tuscan: link("tuscan-chicken-pasta", "Tuscan Chicken Pasta"),
    crackPenne: link("crack-chicken-penne", "Crack Chicken Penne"),
    crockAlfredo: link(
      "crockpot-chicken-alfredo-pasta",
      "Crockpot Chicken Alfredo Pasta",
    ),
    alfredo: link("homemade-alfredo-sauce", "Homemade Alfredo Sauce"),
    ziti: link("chicken-baked-ziti", "Chicken Baked Ziti"),
    cajunChicken: link(
      "cajun-chicken-and-sausage-pasta",
      "Cajun Chicken and Sausage Pasta",
    ),
    lemonOrzo: link("lemon-chicken-orzo", "Lemon Chicken Orzo"),
    million: link("million-dollar-spaghetti", "Million Dollar Spaghetti"),
    crockSpaghetti: link("crockpot-spaghetti", "Crockpot Spaghetti"),
    manicotti: link("manicotti", "Manicotti"),
    cheesyRavioli: link("cheesy-ravioli", "Cheesy Ravioli"),
    spinachRavioli: link(
      "spinach-ricotta-ravioli",
      "Spinach Ricotta Ravioli",
    ),
    vegBake: link("easy-vegetable-pasta-bake", "Easy Vegetable Pasta Bake"),
    bowTie: link("bow-tie-pasta-salad", "Bow Tie Pasta Salad"),
    italianSalad: link("italian-pasta-salad", "Italian Pasta Salad"),
    blt: link("blt-pasta-salad", "BLT Pasta Salad"),
    deviled: link("deviled-egg-pasta-salad", "Deviled Egg Pasta Salad"),
    crab: link("crab-pasta-salad", "Crab Pasta Salad"),
    mac: link("macaroni-and-cheese", "Macaroni and Cheese"),
    cheeseburgerMac: link("cheeseburger-macaroni", "Cheeseburger Macaroni"),
    orzo: link("orzo-pasta", "Orzo Pasta"),
    marinara: link("marinara-pasta", "Marinara Pasta"),
    cannelloni: link("cannelloni-pasta", "Cannelloni Pasta"),
    ragu: link("beef-short-rib-ragu", "Beef Short Rib Ragu"),
    cajun: link("cajun-pasta", "Cajun Pasta"),
    shells: link("frozen-stuffed-shells", "Stuffed Shells"),
  };

  return `
<p>When you need a supper that feels both comforting and doable, <strong>pasta recipes</strong> are hard to beat. A bubbling lasagna, a creamy skillet chicken pasta, a crockpot spaghetti, or a cool pasta salad can all belong on a family table. This guide gathers Grandma Recipe’s best easy pasta recipes by style—lasagna, creamy chicken pasta, baked pasta, pasta salads, and slow cooker noodles—so you can pick a path and cook with confidence.</p>

<p>Use this page as your starting point. Each section below links to tested recipes with clear steps, familiar ingredients, and that cozy, from-scratch flavor we love for weeknights and Sundays alike.</p>

<h2 id="how-to-use-this-guide">How to Use This Pasta Recipes Guide</h2>
<p>Start with the kind of pasta night you want, then choose a recipe that fits your time:</p>
<ul>
<li><strong>Short on time?</strong> Try a creamy skillet pasta, orzo, marinara pasta, or a simple Alfredo toss.</li>
<li><strong>Want something cozy?</strong> Open lasagna, baked ziti, million dollar spaghetti, or lasagna soup.</li>
<li><strong>Feeding a crowd?</strong> Baked pasta, crockpot lasagna, and pasta salads travel well to potlucks.</li>
<li><strong>Need a make-ahead option?</strong> Slow cooker pasta and chilled pasta salads do some of the work for you.</li>
</ul>
<p>If you want a classic layered dinner, begin with ${L.vegLasagna}. For a weeknight skillet, start with ${L.marry} or ${L.tuscan}.</p>

<h2 id="pasta-cooking-basics">Pasta Cooking Basics</h2>
<p>A few steady habits keep pasta recipes tasting like home:</p>
<ul>
<li><strong>Salt the pasta water</strong> so the noodles themselves have flavor.</li>
<li><strong>Cook pasta just to al dente</strong> when it will finish in a sauce or bake, so it does not turn soft.</li>
<li><strong>Save a little pasta water</strong> for creamy sauces—it helps the sauce cling.</li>
<li><strong>Layer lasagna generously</strong> but keep sauces spreadable so every bite stays moist.</li>
<li><strong>Rest baked pasta briefly</strong> before cutting so slices hold together.</li>
</ul>

<h2 id="lasagna-recipes">Lasagna Recipes</h2>
<p>Lasagna is Sunday supper in a pan—layers of noodles, sauce, and cheese that make the whole kitchen smell inviting.</p>
<ul>
<li>${L.vegLasagna} — garden vegetables, ricotta, and golden mozzarella.</li>
<li>${L.crockLasagna} — hands-off lasagna for busy days.</li>
<li>${L.lasagnaSoup} — all the lasagna flavor in a cozy bowl.</li>
<li>${L.manicotti} and ${L.cannelloni} — stuffed pasta shells and tubes with classic cheese fillings.</li>
<li>${L.shells} — stuffed shells ready for a saucy bake.</li>
</ul>
<p>Serve lasagna recipes with garlic bread and a simple green salad. Leftovers reheat beautifully the next day.</p>

<h2 id="creamy-chicken-pasta">Creamy Chicken Pasta Recipes</h2>
<p>Chicken and pasta belong together on busy nights. Creamy sauces, skillet dinners, and slow cooker Alfredo all earn a place here.</p>
<ul>
<li>${L.marry} — creamy sun-dried tomato comfort in one skillet.</li>
<li>${L.tuscan} — garlic, greens, and tender chicken with pasta.</li>
<li>${L.crackPenne} — rich, cheesy penne the whole table finishes.</li>
<li>${L.crockAlfredo} — hands-off Alfredo for crockpot evenings.</li>
<li>${L.alfredo} — a homemade Alfredo sauce to pour over any pasta.</li>
<li>${L.cajunChicken} and ${L.cajun} — Cajun warmth with chicken or sausage.</li>
<li>${L.lemonOrzo} — bright lemon chicken with tender orzo.</li>
</ul>

<h2 id="baked-pasta-recipes">Baked Pasta Recipes</h2>
<p>Baked pasta is potluck-friendly and family-proof—cheese on top, sauce underneath, and a golden finish from the oven.</p>
<ul>
<li>${L.ziti} — chicken baked ziti for a hearty casserole night.</li>
<li>${L.million} — layered spaghetti with a rich, cheesy middle.</li>
<li>${L.vegBake} — vegetable pasta bake with a golden cheese topping.</li>
<li>${L.cheesyRavioli} and ${L.spinachRavioli} — ravioli dinners with simple sauce and melt.</li>
<li>${L.mac} and ${L.cheeseburgerMac} — classic macaroni comfort, plain or skillet-style.</li>
</ul>
<p>Make-ahead tip: assemble most baked pasta dishes earlier in the day, refrigerate, then bake until bubbling before supper.</p>

<h2 id="pasta-salad-recipes">Pasta Salad Recipes</h2>
<p>Pasta salads are the cool side of the pasta family—perfect for lunches, picnics, and easy dinner spreads.</p>
<ul>
<li>${L.italianSalad} — bright Italian pasta salad with fresh vegetables.</li>
<li>${L.bowTie} — creamy bow-tie pasta salad.</li>
<li>${L.blt} — bacon, tomato, and lettuce in pasta form.</li>
<li>${L.deviled} — deviled-egg flavor in a pasta salad bowl.</li>
<li>${L.crab} — creamy crab pasta salad for a lighter lunch plate.</li>
</ul>

<h2 id="crockpot-pasta">Crockpot and Slow Cooker Pasta</h2>
<p>Slow cooker pasta recipes turn busy days into noodle-night victories. Add the ingredients, let time help, and come home to a kitchen that already smells like supper.</p>
<ul>
<li>${L.crockLasagna} — layered lasagna without hovering at the stove.</li>
<li>${L.crockAlfredo} — creamy chicken Alfredo pasta.</li>
<li>${L.crockSpaghetti} — classic spaghetti with less hands-on time.</li>
</ul>

<h2 id="simple-sauces-and-sides">Simple Sauces and Everyday Pasta</h2>
<p>Not every pasta night needs a long bake. Sometimes a good sauce and a quick noodle are enough.</p>
<ul>
<li>${L.marinara} — simple marinara pasta for a reliable weeknight plate.</li>
<li>${L.orzo} — orzo as a cozy side or light main.</li>
<li>${L.ragu} — beef short rib ragu when you want a richer sauce night.</li>
<li>${L.alfredo} — homemade Alfredo to keep in your back pocket.</li>
</ul>

<h2 id="what-to-serve-with-pasta">What to Serve with Pasta</h2>
<ul>
<li>Garlic bread, warm rolls, or focaccia</li>
<li>A crisp green salad or simple roasted vegetables</li>
<li>Extra Parmesan and fresh herbs at the table</li>
<li>A light dessert if Sunday supper needs a sweet finish</li>
</ul>

<h2 id="make-ahead-storage-and-leftovers">Make Ahead, Storage, and Leftovers</h2>
<ul>
<li><strong>Refrigerate</strong> cooked pasta dishes within 2 hours in covered containers. Use within 3 to 4 days.</li>
<li><strong>Freeze</strong> cooled baked pasta or sauce portions in airtight containers for up to 2 to 3 months.</li>
<li><strong>Reheat</strong> gently until steaming hot. Add a splash of water, broth, or milk to loosen creamy sauces.</li>
<li><strong>Leftover ideas:</strong> lunch bowls, baked leftover pasta with extra cheese, or soup add-ins.</li>
</ul>

<h2 id="faqs">FAQs About Pasta Recipes</h2>
<h3>Should I undercook pasta for baked recipes?</h3>
<p>Yes. Pull it a minute or two early so it finishes softening in the oven without turning mushy.</p>
<h3>How do I keep lasagna from getting watery?</h3>
<p>Drain vegetables well, avoid overly thin sauce, and let the lasagna rest before slicing. ${L.vegLasagna} walks through a reliable layered method.</p>
<h3>Can I make creamy pasta ahead?</h3>
<p>You can, but reheat gently with a splash of liquid. Crockpot Alfredo and skillet pastas are often best the day they are made.</p>
<h3>Which pasta recipe should I make first?</h3>
<p>For a classic dinner, make ${L.vegLasagna} or ${L.ziti}. For a quick weeknight, choose ${L.marry}, ${L.tuscan}, or ${L.marinara}.</p>
<h3>Are pasta salads good for make-ahead lunches?</h3>
<p>Yes. ${L.italianSalad}, ${L.bowTie}, and ${L.blt} hold well when chilled and packed for the next day.</p>

<h2 id="final-thoughts">Final Thoughts</h2>
<p>Good <strong>pasta recipes</strong> do not need complicated tricks—just sturdy noodles, a sauce that tastes like home, and a method that fits your night. Bookmark this guide, pick a cluster, and cook one recipe at a time. Before long you will have a reliable rotation for lasagna Sundays, creamy skillet nights, and easy pasta salads.</p>
<p>Explore more easy <a href="/category/breakfast/"><strong>breakfast</strong></a> recipes, quick <a href="/category/lunch/"><strong>lunch</strong></a> ideas, cozy <a href="/category/dinner/"><strong>dinner</strong></a> meals, tasty <a href="/category/snacks/"><strong>snacks</strong></a>, and delightful <a href="/category/dessert/"><strong>dessert</strong></a>.</p>
`.trim();
}

async function main() {
  loadEnvLocal();
  const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const secret = process.env.CMS_IMPORT_SECRET!;
  if (!secret) throw new Error("CMS_IMPORT_SECRET missing");
  if (!fs.existsSync(FEATURE_PNG)) {
    throw new Error(`Missing feature PNG: ${FEATURE_PNG}`);
  }

  const featureMeta = {
    alt: "Easy pasta recipes featuring lasagna, creamy chicken pasta, and a family dinner table",
    title: "Easy Pasta Recipes Homestyle Dinner Spread",
    caption:
      "A welcoming pasta dinner spread: lasagna, creamy pasta, and cozy supper sides.",
    description:
      "Feature image for the easy pasta recipes guide showing a home-style pasta dinner table.",
  };

  const processed = await convertRecipeImageToWebp(
    fs.readFileSync(FEATURE_PNG),
    featureMeta.title,
    "feature",
    {
      caption: featureMeta.caption,
      description: featureMeta.description,
    },
  );
  const basename = buildRecipeImageBasename({
    metadata: featureMeta,
    focusKeyword: "pasta recipes",
    slug: SLUG,
  });
  const r2Key = buildRecipeImageR2Key(basename);
  await putR2Object(r2Key, processed.buffer, "image/webp", {
    "alt-text": featureMeta.alt,
    title: featureMeta.title,
    caption: featureMeta.caption,
    description: featureMeta.description,
    "focus-keyword": "pasta recipes",
    section: "feature",
  });
  const featurePath = r2KeyToPublicPath(r2Key);
  console.log(`Uploaded feature → ${featurePath}`);

  let contentHtml = buildContentHtml();
  const sectionPhotos = [
    {
      headingId: "lasagna-recipes",
      src: "/wp-content/uploads/2026/09/Homemade-Vegetarian-Lasagna-Recipe.webp",
      alt: "Homemade vegetarian lasagna with golden melted cheese",
      caption: "Lasagna night: layered bakes, crockpot lasagna, and lasagna soup.",
    },
    {
      headingId: "creamy-chicken-pasta",
      src: "/wp-content/uploads/2025/07/Indulge-in-Marry-Me-Chicken-Pasta.webp",
      alt: "Creamy marry me chicken pasta with basil and Parmesan",
      caption: "Creamy chicken pasta for skillet weeknights and Alfredo nights.",
    },
    {
      headingId: "baked-pasta-recipes",
      src: "/wp-content/uploads/2025/07/Delicious-Chicken-Baked-Ziti.webp",
      alt: "Chicken baked ziti with melted cheese and herbs",
      caption: "Baked pasta: ziti, million dollar spaghetti, ravioli, and macaroni.",
    },
    {
      headingId: "pasta-salad-recipes",
      src: "/wp-content/uploads/2026/01/Delicious-Italian-Pasta-Salad.webp",
      alt: "Italian pasta salad with fresh vegetables and herbs",
      caption: "Pasta salads for lunches, picnics, and easy dinner spreads.",
    },
    {
      headingId: "crockpot-pasta",
      src: "/wp-content/uploads/2025/09/Hearty-CROCKPOT-LASAGNA-Recipe.webp",
      alt: "Crockpot lasagna with layers of cheese and sauce",
      caption: "Slow cooker pasta: lasagna, Alfredo, and spaghetti with less fuss.",
    },
    {
      headingId: "simple-sauces-and-sides",
      src: "/wp-content/uploads/2026/01/Delicious-Homemade-Alfredo-Sauce-Over-Pasta.webp",
      alt: "Homemade Alfredo sauce over pasta with parsley",
      caption: "Simple sauces and everyday pasta for quick, reliable plates.",
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
      title: "Easy Pasta Recipes",
      excerpt:
        "Find easy pasta recipes for weeknights and Sunday supper—lasagna, creamy chicken pasta, baked pasta, pasta salads, and crockpot noodles, all gathered in one cozy guide.",
      category: "dinner",
      categories: ["dinner"],
      contentHtml,
      ingredients: [],
      instructions: [],
      featuredImage: featurePath,
      featuredImageAlt: featureMeta.alt,
      featuredImageCaption: featureMeta.caption,
      featuredImageDescription: featureMeta.description,
      seoTitle: "Easy Pasta Recipes for Weeknights and Sunday Supper",
      seoDescription:
        "Browse easy pasta recipes by style: lasagna, creamy chicken pasta, baked pasta, pasta salads, and crockpot dinners. A Grandma Recipe guide for family meals.",
      focusKeyword: "pasta recipes",
      cuisine: "Italian-inspired",
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
