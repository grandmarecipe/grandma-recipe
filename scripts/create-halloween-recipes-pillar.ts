/**
 * Create Easy Halloween Recipes hub/guide on DEV (draft).
 * Links 6 new high-volume fall spokes + existing Halloween/fall recipes.
 * No pork / no alcohol.
 *
 * Usage: npx tsx scripts/create-halloween-recipes-pillar.ts
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
  path.join(ASSETS, "halloween-recipes-feature.png"),
  path.join(ASSETS, "halloween-recipes-feature.jpg"),
];
const SLUG = "halloween-recipes";

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
    bread: link("pumpkin-bread", "Grandma's Moist Pumpkin Bread"),
    muffins: link("pumpkin-muffins", "Soft Bakery-Style Pumpkin Muffins"),
    roll: link("pumpkin-roll", "Classic Pumpkin Roll"),
    popcorn: link("caramel-popcorn", "Homemade Caramel Popcorn"),
    soup: link("pumpkin-soup", "Creamy Homemade Pumpkin Soup"),
    cookies: link("halloween-cookies", "Halloween Cookies"),
    punch: link("halloween-sherbet-punch", "Halloween Sherbet Punch"),
    mummy: link("mummy-hot-dogs", "Mummy Hot Dogs"),
    dump: link("pumpkin-dump-cake-recipe", "Pumpkin Dump Cake"),
    poke: link("pumpkin-poke-cake", "Pumpkin Poke Cake"),
    caramelApple: link(
      "caramel-apple-dump-cake",
      "Caramel Apple Dump Cake",
    ),
  };

  return `
<p>Halloween week calls for cozy kitchen projects, party trays, and desserts that smell like cinnamon and pumpkin. This guide gathers Grandma Recipe’s best <strong>Halloween recipes</strong>, from spooky snacks and sherbet punch to pumpkin pie, bread, muffins, and soup, so you can plan the week without hunting through every category.</p>

<p>Use this page as your starting point. Each section links to kitchen-tested recipes with clear steps, familiar pantry ingredients, and family-friendly flavors for trick-or-treat night, classroom parties, and fall weekends.</p>

<h2 id="how-to-use-this-guide">How to Use This Halloween Recipes Guide</h2>
<p>Start with the kind of Halloween recipe you need:</p>
<ul>
<li><strong>Need a party snack tray?</strong> Open caramel popcorn, mummy hot dogs, or Halloween cookies.</li>
<li><strong>Want a pumpkin dessert centerpiece?</strong> Try pumpkin pie, pumpkin roll, dump cake, or poke cake.</li>
<li><strong>Baking for breakfast or brunch?</strong> Pumpkin muffins and pumpkin bread travel well.</li>
<li><strong>Planning a cozy dinner?</strong> Creamy pumpkin soup warms the table before dessert.</li>
</ul>
<p>If you want one first bake with big impact, start with ${L.pie} or ${L.bread}. For a no-fuss party plate, ${L.popcorn} or ${L.mummy} is a friendly place to begin.</p>

<h2 id="halloween-party-snacks-and-drinks">Halloween Party Snacks and Drinks</h2>
<p>Quick trays and a colorful punch bowl for movie night, classroom parties, and trick-or-treat fuel.</p>
<ul>
<li>${L.popcorn}, crunchy homemade caramel popcorn for sharing bowls.</li>
<li>${L.mummy}, crescent-wrapped hot dogs with mustard eyes for a playful tray.</li>
<li>${L.cookies}, decorated Halloween cookies for dessert tables and lunchbox treats.</li>
<li>${L.punch}, non-alcoholic Halloween sherbet punch with lemon-lime soda and bright scoops of sherbet.</li>
</ul>

<h2 id="pumpkin-desserts-for-halloween">Pumpkin Desserts for Halloween</h2>
<p>Spiced cakes and classic pie for when the dessert table needs something orange and inviting.</p>
<ul>
<li>${L.pie}, a classic homemade pumpkin pie with a flaky crust and creamy filling.</li>
<li>${L.roll}, pumpkin cake roll with cream cheese filling and a dusting of powdered sugar.</li>
<li>${L.dump}, easy pumpkin dump cake when you want dessert without fussy steps.</li>
<li>${L.poke}, pumpkin poke cake with a creamy soak and soft crumb.</li>
<li>${L.caramelApple}, caramel apple dump cake for a fall fruit twist.</li>
</ul>

<h2 id="cozy-pumpkin-bakes">Cozy Pumpkin Breads and Muffins</h2>
<p>Bake-ahead loaves and muffins for Halloween week breakfasts and neighbor gifts.</p>
<ul>
<li>${L.bread}, moist pumpkin bread with warm spices and optional chocolate chips or walnuts.</li>
<li>${L.muffins}, soft bakery-style pumpkin muffins with a cinnamon-sugar sparkle.</li>
</ul>

<h2 id="cozy-halloween-dinner">Cozy Halloween Dinner</h2>
<p>One savory bowl to balance the candy bowls and dessert trays.</p>
<ul>
<li>${L.soup}, creamy homemade pumpkin soup with garlic, onion, and a swirl of cream or coconut milk.</li>
</ul>

<h2 id="halloween-baking-basics">Halloween Baking Basics</h2>
<p>A few steady habits keep Halloween recipes tasting homemade and looking pretty on the table:</p>
<ul>
<li><strong>Use plain pumpkin puree</strong>, not pumpkin pie filling, so spice levels stay in your control.</li>
<li><strong>Measure flour lightly</strong> so quick breads and muffins stay tender instead of dense.</li>
<li><strong>Cool cakes and pie fully</strong> before slicing so layers set and fillings stay neat.</li>
<li><strong>Plan make-ahead pieces</strong> like caramel popcorn, cookies, and pumpkin bread the day before the party.</li>
<li><strong>Keep decor simple</strong> with candy eyes, powdered sugar, cinnamon sticks, and mini pumpkins instead of complicated frosting work.</li>
</ul>

<h2 id="faqs">FAQs</h2>
<h3>What Halloween recipe should I make first?</h3>
<p>For a classic dessert, bake ${L.pie}. For a shareable snack tray, start with ${L.popcorn} or ${L.mummy}. For breakfast the next morning, ${L.muffins} are hard to beat.</p>
<h3>Can I make Halloween recipes ahead?</h3>
<p>Yes. ${L.bread}, ${L.cookies}, and ${L.popcorn} keep well in airtight containers. Pumpkin pie and pumpkin roll chill nicely overnight, which makes party day easier.</p>
<h3>Which recipes are best for kids’ parties?</h3>
<p>${L.mummy}, ${L.cookies}, ${L.punch}, and ${L.popcorn} are playful, easy to portion, and familiar to most kids.</p>
<h3>What if I only have time for one pumpkin dessert?</h3>
<p>Choose ${L.pie} for a traditional table, or ${L.dump} when you want something warm and fast with almost no mixing fuss.</p>
<h3>Do you have a savory Halloween option?</h3>
<p>Yes. Serve ${L.soup} with crusty bread, then finish with pie or caramel popcorn.</p>

<h2 id="final-thoughts">Final Thoughts</h2>
<p>Good <strong>Halloween recipes</strong> do not need a complicated costume-kitchen setup. Pick one snack tray, one pumpkin bake, and one cozy bowl, and the week feels festive without the scramble. Bookmark this guide, bake what fits your timeline, and let the kitchen smell like cinnamon until the last candy wrapper is gone.</p>
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
    alt: "Easy Halloween recipes with pumpkin pie, bread, muffins, caramel popcorn, and cookies",
    title: "Easy Halloween Recipes Homestyle Spread",
    caption:
      "A welcoming Halloween table: pumpkin pie, bread, muffins, caramel popcorn, and festive treats.",
    description:
      "Feature image for the easy Halloween recipes guide showing a home-style fall party food spread.",
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
    focusKeyword: "halloween recipes",
    slug: SLUG,
  });
  const r2Key = buildRecipeImageR2Key(basename);
  await putR2Object(r2Key, processed.buffer, "image/webp", {
    "alt-text": featureMeta.alt,
    title: featureMeta.title,
    caption: featureMeta.caption,
    description: featureMeta.description,
    "focus-keyword": "halloween recipes",
    section: "feature",
  });
  const featurePath = r2KeyToPublicPath(r2Key);
  console.log(`Uploaded feature → ${featurePath}`);

  let contentHtml = buildContentHtml();
  const sectionPhotos = [
    {
      headingId: "halloween-party-snacks-and-drinks",
      src: "/wp-content/uploads/2026/10/Homemade-Caramel-Popcorn-For-Cozy-Movie-Nights.webp",
      alt: "Homemade caramel popcorn for Halloween movie nights",
      caption: "Caramel popcorn, mummy dogs, cookies, and sherbet punch for party trays.",
    },
    {
      headingId: "pumpkin-desserts-for-halloween",
      src: "/wp-content/uploads/2026/10/Classic-Homemade-Pumpkin-Pie-Recipe.webp",
      alt: "Classic homemade pumpkin pie for Halloween dessert",
      caption: "Pumpkin pie, roll, dump cake, poke cake, and caramel apple dessert.",
    },
    {
      headingId: "cozy-pumpkin-bakes",
      src: "/wp-content/uploads/2026/10/Grandmas-Moist-Pumpkin-Bread.webp",
      alt: "Grandma's moist pumpkin bread loaf",
      caption: "Pumpkin bread and muffins for Halloween week breakfasts.",
    },
    {
      headingId: "cozy-halloween-dinner",
      src: "/wp-content/uploads/2026/10/Creamy-Homemade-Pumpkin-Soup.webp",
      alt: "Creamy homemade pumpkin soup",
      caption: "A cozy pumpkin soup bowl before the dessert table.",
    },
    {
      headingId: "halloween-baking-basics",
      src: "/wp-content/uploads/2026/10/Soft-Bakery-style-Pumpkin-Muffins.webp",
      alt: "Soft bakery-style pumpkin muffins",
      caption: "Simple habits for tender pumpkin bakes and make-ahead party trays.",
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
      title: "Easy Halloween Recipes",
      excerpt:
        "Find easy Halloween recipes for pumpkin pie, bread, muffins, caramel popcorn, cookies, mummy hot dogs, and cozy soup, all gathered in one Grandma Recipe guide.",
      category: "dessert",
      categories: ["dessert", "snacks", "dinner", "breakfast"],
      contentHtml,
      ingredients: [],
      instructions: [],
      featuredImage: featurePath,
      featuredImageAlt: featureMeta.alt,
      featuredImageCaption: featureMeta.caption,
      featuredImageDescription: featureMeta.description,
      seoTitle: "Easy Halloween Recipes for Parties, Pumpkin Bakes, and More",
      seoDescription:
        "Browse easy Halloween recipes: pumpkin pie, bread, muffins, caramel popcorn, cookies, mummy hot dogs, sherbet punch, and soup. A Grandma Recipe guide for fall.",
      focusKeyword: "halloween recipes",
      cuisine: "American",
      course: "Halloween guide",
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
        linkedRecipes: 12,
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
