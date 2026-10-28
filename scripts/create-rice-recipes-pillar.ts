/**
 * Create Easy Rice Recipes pillar guide on DEV (draft) with feature image
 * and relevant in-article photos from existing rice guides and dinners.
 *
 * Usage: npx tsx scripts/create-rice-recipes-pillar.ts
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
  path.join(ASSETS, "easy-rice-recipes-feature.png"),
  path.join(ASSETS, "easy-rice-recipes-feature.jpg"),
];
const SLUG = "easy-rice-recipes";

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
    howTo: link("how-to-cook-rice", "How to Cook Rice"),
    jasmine: link("how-to-cook-jasmine-rice", "How to Cook Jasmine Rice"),
    basmati: link("how-to-cook-basmati-rice", "How to Cook Basmati Rice"),
    brown: link("how-to-cook-brown-rice", "How to Cook Brown Rice"),
    jasmineBrown: link("jasmine-brown-rice", "Jasmine Brown Rice"),
    chickenOver: link("chicken-over-rice", "Chicken Over Rice"),
    crockChicken: link(
      "slow-cooker-chicken-and-rice",
      "Slow Cooker Chicken and Rice",
    ),
    casserole: link(
      "chicken-broccoli-rice-casserole",
      "Chicken Broccoli Rice Casserole",
    ),
    kielbasa: link("kielbasa-and-rice", "Kielbasa and Rice"),
    beans: link("simple-rice-and-beans-recipe", "Rice and Beans"),
    lamb: link("lamb-over-rice", "Lamb Over Rice"),
    stuffing: link("rice-stuffing", "Rice Stuffing"),
    phoRice: link("pho-and-rice", "Pho and Rice"),
    crispy: link(
      "crispy-rice-with-spicy-tuna",
      "Crispy Rice with Spicy Tuna",
    ),
    flatNoodles: link("flat-rice-noodles", "Flat Rice Noodles"),
    stickNoodles: link("rice-stick-noodles", "Rice Stick Noodles"),
    biryani: link("biryani", "Homemade Biryani"),
    mutton: link("mutton-biryani", "Mutton Biryani"),
    goat: link("goat-biryani", "Goat Biryani"),
  };

  return `
<p>A pot of rice on the stove is one of the simplest comforts in a home kitchen. Fluffy white rice, fragrant jasmine, nutty brown rice, or a full chicken-and-rice supper can all start with the same quiet confidence. This guide gathers Grandma Recipe’s best <strong>rice recipes</strong>—how-to methods by rice type, easy rice dinners, casseroles, bowls, and biryani—so you can choose a path and cook with confidence.</p>

<p>Use this page as your starting point. Each section below links to tested recipes with clear steps, everyday ingredients, and that cozy, from-scratch flavor we love for weeknights and Sundays alike.</p>

<h2 id="how-to-use-this-guide">How to Use This Rice Recipes Guide</h2>
<p>Start with what you need tonight:</p>
<ul>
<li><strong>Need a dependable side?</strong> Begin with ${L.howTo}, then choose jasmine, basmati, or brown.</li>
<li><strong>Cooking a full plate?</strong> Jump to chicken over rice, kielbasa and rice, or rice and beans.</li>
<li><strong>Want oven comfort?</strong> Open a chicken broccoli rice casserole or rice stuffing.</li>
<li><strong>Craving a special rice night?</strong> Try biryani or crispy rice with spicy tuna.</li>
</ul>
<p>If you are new to stovetop rice, start with ${L.howTo}. For fragrant weeknight rice, ${L.jasmine} is a lovely next step.</p>

<h2 id="rice-cooking-basics">Rice Cooking Basics</h2>
<p>A few steady habits keep rice recipes fluffy instead of sticky or scorched:</p>
<ul>
<li><strong>Rinse when the recipe calls for it</strong> — rinsing removes extra surface starch for lighter grains.</li>
<li><strong>Use the right water ratio</strong> for the rice type you are cooking.</li>
<li><strong>Keep the lid closed</strong> while the rice simmers so steam can finish the work.</li>
<li><strong>Rest off the heat</strong> before fluffing so moisture settles through the pot.</li>
<li><strong>Fluff gently with a fork</strong> rather than stirring hard, which can mash the grains.</li>
</ul>
<p>Our full method lives in ${L.howTo}, with dedicated guides for the most-loved rice varieties.</p>

<h2 id="how-to-cook-rice-by-type">How to Cook Rice by Type</h2>
<p>Different grains need slightly different care. These how-to guides walk through each one clearly:</p>
<ul>
<li>${L.howTo} — the foundational stovetop method for fluffy white rice.</li>
<li>${L.jasmine} — fragrant, soft grains for curries, bowls, and everyday sides.</li>
<li>${L.basmati} — long, separate grains with a delicate aroma.</li>
<li>${L.brown} — nuttier brown rice with a sturdy, wholesome bite.</li>
<li>${L.jasmineBrown} — jasmine brown rice when you want fragrance and heartiness together.</li>
</ul>

<h2 id="easy-rice-dinners">Easy Rice Dinners</h2>
<p>Rice is more than a side. These rice recipes turn grains into the heart of supper.</p>
<ul>
<li>${L.chickenOver} — seasoned chicken over a generous bed of rice.</li>
<li>${L.crockChicken} — slow cooker chicken and rice for hands-off evenings.</li>
<li>${L.kielbasa} — sausage and rice for a quick skillet-style comfort plate.</li>
<li>${L.beans} — rice and beans for a simple, satisfying supper.</li>
<li>${L.lamb} — lamb over rice when you want a richer dinner bowl.</li>
<li>${L.phoRice} — a cozy pairing of pho flavors with rice on the side.</li>
</ul>

<h2 id="rice-casseroles-and-sides">Rice Casseroles and Sides</h2>
<p>When the oven can help, rice becomes casserole comfort or a holiday-ready side.</p>
<ul>
<li>${L.casserole} — chicken, broccoli, and rice under a golden topping.</li>
<li>${L.stuffing} — rice stuffing for roast dinners and festive tables.</li>
</ul>
<p>Make-ahead tip: many rice casseroles reheat well with a splash of broth to restore moisture.</p>

<h2 id="biryani-and-special-rice">Biryani and Special Rice</h2>
<p>Some rice recipes are celebration food—layered spices, fragrant steam, and a table that feels a little more special.</p>
<ul>
<li>${L.biryani} — homemade biryani with inviting spice and tender layers.</li>
<li>${L.mutton} — mutton biryani for a hearty feast plate.</li>
<li>${L.goat} — goat biryani with deep, savory flavor.</li>
<li>${L.crispy} — crispy rice topped with spicy tuna for a fun appetizer-style bite.</li>
</ul>

<h2 id="rice-noodles">Rice Noodles</h2>
<p>Rice also shows up as noodles—another easy path for weeknight bowls and stir-fries.</p>
<ul>
<li>${L.flatNoodles} — stir-fried flat rice noodles with vegetables.</li>
<li>${L.stickNoodles} — rice stick noodles for quick savory plates.</li>
</ul>

<h2 id="what-to-serve-with-rice">What to Serve with Rice</h2>
<ul>
<li>Roast chicken, baked fish, beans, or a simple vegetable curry</li>
<li>Steamed greens, roasted carrots, or a crisp salad</li>
<li>A pat of butter, fresh herbs, or a squeeze of lemon for plain rice</li>
<li>Leftover rice turned into next-day bowls or fried-rice style skillet meals</li>
</ul>

<h2 id="make-ahead-storage-and-leftovers">Make Ahead, Storage, and Leftovers</h2>
<ul>
<li><strong>Cool rice promptly</strong> and refrigerate within 2 hours in shallow containers.</li>
<li><strong>Use refrigerated rice</strong> within 3 to 4 days.</li>
<li><strong>Freeze</strong> cooled portions in airtight containers for up to about 1 month for best texture.</li>
<li><strong>Reheat</strong> until steaming hot, adding a splash of water to restore moisture.</li>
</ul>

<h2 id="faqs">FAQs About Rice Recipes</h2>
<h3>Do I always need to rinse rice?</h3>
<p>For many white rice recipes, rinsing helps remove excess starch. Follow the linked method for each rice type—start with ${L.howTo}.</p>
<h3>Why is my rice mushy?</h3>
<p>Too much water, too much stirring, or skipping the rest can soften the grains. Measure carefully and keep the lid on while it cooks.</p>
<h3>Which rice should I cook first?</h3>
<p>Begin with ${L.howTo} or ${L.jasmine}. Once that feels easy, try brown rice or a full dinner like ${L.chickenOver}.</p>
<h3>Can I make rice ahead for busy nights?</h3>
<p>Yes. Cook a batch, cool it quickly, refrigerate, and reheat with a little water. It also works well under leftover chicken, beans, or vegetables.</p>
<h3>What is the difference between jasmine and basmati?</h3>
<p>Jasmine is soft and fragrant; basmati cooks into longer, more separate grains. Compare ${L.jasmine} and ${L.basmati} to see which you prefer.</p>

<h2 id="final-thoughts">Final Thoughts</h2>
<p>Good <strong>rice recipes</strong> do not need complicated equipment—just the right grain, a steady simmer, and a little patience at the end. Bookmark this guide, pick a cluster, and cook one pot at a time. Before long you will have fluffy sides, easy rice dinners, and a few special-occasion dishes ready for the family table.</p>
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
    alt: "Easy rice recipes featuring fluffy white rice, jasmine rice, and chicken over rice",
    title: "Easy Rice Recipes Homestyle Dinner Spread",
    caption:
      "A welcoming rice dinner spread: fluffy grains, fragrant sides, and cozy supper bowls.",
    description:
      "Feature image for the easy rice recipes guide showing a home-style rice dinner table.",
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
    focusKeyword: "rice recipes",
    slug: SLUG,
  });
  const r2Key = buildRecipeImageR2Key(basename);
  await putR2Object(r2Key, processed.buffer, "image/webp", {
    "alt-text": featureMeta.alt,
    title: featureMeta.title,
    caption: featureMeta.caption,
    description: featureMeta.description,
    "focus-keyword": "rice recipes",
    section: "feature",
  });
  const featurePath = r2KeyToPublicPath(r2Key);
  console.log(`Uploaded feature → ${featurePath}`);

  let contentHtml = buildContentHtml();
  const sectionPhotos = [
    {
      headingId: "how-to-cook-rice-by-type",
      src: "/wp-content/uploads/2026/09/How-To-Cook-Rice-For-Fluffy-Tender-Grains.webp",
      alt: "Fluffy white rice cooking in a saucepan",
      caption: "Start with the basics, then choose jasmine, basmati, or brown.",
    },
    {
      headingId: "easy-rice-dinners",
      src: "/wp-content/uploads/2025/07/Delicious-Chicken-Over-Rice.webp",
      alt: "Chicken over rice in a bowl with sauces and herbs",
      caption: "Rice dinners: chicken, kielbasa, beans, lamb, and slow cooker plates.",
    },
    {
      headingId: "rice-casseroles-and-sides",
      src: "/wp-content/uploads/2025/09/Delicious-Chicken-Broccoli-Rice-Casserole.webp",
      alt: "Chicken broccoli rice casserole with cheddar topping",
      caption: "Casseroles and sides that turn rice into oven comfort.",
    },
    {
      headingId: "biryani-and-special-rice",
      src: "/wp-content/uploads/2025/12/Delicious-Homemade-Biryani.webp",
      alt: "Homemade biryani garnished with mint and coriander",
      caption: "Biryani and special rice for feast nights and fun appetizers.",
    },
    {
      headingId: "rice-noodles",
      src: "/wp-content/uploads/2025/11/Delicious-Flat-Rice-Noodles-Stir-Fry.webp",
      alt: "Stir-fried flat rice noodles with vegetables",
      caption: "Rice noodles for quick stir-fries and weeknight bowls.",
    },
    {
      headingId: "rice-cooking-basics",
      src: "/wp-content/uploads/2026/09/How-To-Cook-Jasmine-Rice-For-Fluffy-Fragrant-Grains.webp",
      alt: "Fluffy jasmine rice in a white pot with gentle steam",
      caption: "Rinse, simmer, rest, and fluff — the quiet habits behind good rice.",
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
      title: "Easy Rice Recipes",
      excerpt:
        "Find easy rice recipes for weeknights and Sunday supper—how to cook rice by type, chicken and rice dinners, casseroles, biryani, and rice noodles, all gathered in one cozy guide.",
      category: "dinner",
      categories: ["dinner"],
      contentHtml,
      ingredients: [],
      instructions: [],
      featuredImage: featurePath,
      featuredImageAlt: featureMeta.alt,
      featuredImageCaption: featureMeta.caption,
      featuredImageDescription: featureMeta.description,
      seoTitle: "Easy Rice Recipes for Fluffy Sides and Family Dinners",
      seoDescription:
        "Browse easy rice recipes by style: how to cook rice, jasmine, basmati, brown rice, chicken and rice dinners, casseroles, and biryani. A Grandma Recipe guide.",
      focusKeyword: "rice recipes",
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
