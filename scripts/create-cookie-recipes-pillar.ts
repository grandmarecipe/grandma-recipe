/**
 * Create Easy Cookie Recipes pillar guide on DEV (draft).
 * No pork / no alcohol recipes linked.
 *
 * Usage: npx tsx scripts/create-cookie-recipes-pillar.ts
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
  path.join(ASSETS, "cookie-recipes-feature.png"),
  path.join(ASSETS, "cookie-recipes-feature.jpg"),
];
const SLUG = "cookie-recipes";

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
    thinChip: link("thin-chocolate-chip-cookies", "Thin Chocolate Chip Cookies"),
    thinCrispy: link(
      "thin-crispy-chocolate-chip-cookies",
      "Thin Crispy Chocolate Chip Cookies",
    ),
    pbOatmeal: link(
      "peanut-butter-oatmeal-chocolate-chip-cookies",
      "Peanut Butter Oatmeal Chocolate Chip Cookies",
    ),
    chocolatePb: link(
      "chocolate-peanut-butter-cookies",
      "Chocolate Peanut Butter Cookies",
    ),
    noBake: link(
      "chocolate-peanut-butter-no-bake-cookies",
      "Chocolate Peanut Butter No Bake Cookies",
    ),
    crinkle: link("chocolate-crinkle-cookies", "Chocolate Crinkle Cookies"),
    brownie: link("brownie-crinkle-cookies", "Brownie Crinkle Cookies"),
    cookiesCream: link(
      "cookies-and-cream-cookies",
      "Cookies and Cream Cookies",
    ),
    almondJoy: link("almond-joy-cookies", "Almond Joy Cookies"),
    biscoff: link("biscoff-butter-cookies", "Biscoff Butter Cookies"),
    blueberry: link("blueberry-cookies", "Blueberry Cookies"),
    pbBanana: link(
      "peanut-butter-banana-cookies",
      "Peanut Butter Banana Cookies",
    ),
    breakfast: link("breakfast-cookies", "Breakfast Cookies"),
    protein: link("protein-cookies", "Protein Cookies"),
    glutenFree: link("gluten-free-cookies", "Gluten Free Cookies"),
    dough: link("cookie-dough", "Cookie Dough"),
    shortbread: link("millionaire-shortbread", "Millionaire Shortbread"),
    sprinkle: link("rainbow-sprinkle-cookies", "Rainbow Sprinkle Cookies"),
    july4: link("4th-of-july-sugar-cookies", "4th of July Sugar Cookies"),
    christmas: link("christmas-sugar-cookies", "Christmas Sugar Cookies"),
    gingerbread: link(
      "gingerbread-cookies-royal-icing",
      "Gingerbread Cookies with Royal Icing",
    ),
    halloween: link("halloween-cookies", "Halloween Cookies"),
    valentine: link("valentine-cookie", "Heart-Shaped Valentine Cookies"),
  };

  return `
<p>A warm tray of cookies can turn an ordinary afternoon into something special. This guide gathers Grandma Recipe’s best <strong>cookie recipes</strong>—chocolate chip, peanut butter, no-bake, holiday sugar cookies, and more—so you can pick a dough and bake with confidence.</p>

<p>Use this page as your starting point. Each section links to kitchen-tested recipes with clear steps and familiar pantry ingredients for after-school trays, bake sales, and cozy weekend baking.</p>

<h2 id="how-to-use-this-guide">How to Use This Cookie Recipes Guide</h2>
<p>Start with the kind of cookie you want:</p>
<ul>
<li><strong>Need a classic chocolate chip?</strong> Open thin chocolate chip or thin crispy chocolate chip cookies.</li>
<li><strong>Want peanut butter or no-bake?</strong> Try chocolate peanut butter cookies or the no-bake version.</li>
<li><strong>Baking for a holiday?</strong> Sugar cookies, gingerbread, Halloween, and Valentine cookies dress up the table.</li>
<li><strong>Need something quicker or lighter?</strong> Breakfast cookies, protein cookies, and gluten-free cookies fit busy days.</li>
</ul>
<p>If you want a first batch with little fuss, start with ${L.thinChip} or ${L.noBake}. For a festive tray, ${L.christmas} or ${L.gingerbread} is a lovely place to begin.</p>

<h2 id="cookie-basics">Cookie Basics</h2>
<p>A few steady habits keep cookie recipes soft, chewy, or crisp—just the way you like them:</p>
<ul>
<li><strong>Measure flour lightly</strong> so dough does not turn dry and cakey.</li>
<li><strong>Chill dough when the recipe says to</strong> so cookies hold their shape and bake evenly.</li>
<li><strong>Use room-temperature butter</strong> for creamed doughs unless the recipe calls for melted.</li>
<li><strong>Leave space on the sheet</strong> so cookies can spread without merging.</li>
<li><strong>Cool on the pan briefly</strong>, then move to a rack so bottoms stay tender instead of soggy.</li>
</ul>

<h2 id="chocolate-chip-and-classic-cookies">Chocolate Chip and Classic Cookies</h2>
<p>Everyday favorites for milk-and-cookie nights and lunchbox treats.</p>
<ul>
<li>${L.thinChip} — thin chocolate chip cookies with lots of crispy edges.</li>
<li>${L.thinCrispy} — thin crispy chocolate chip cookies for a shatter-snap bite.</li>
<li>${L.pbOatmeal} — peanut butter oatmeal chocolate chip cookies with hearty texture.</li>
<li>${L.cookiesCream} — cookies and cream cookies packed with creamy cookie pieces.</li>
<li>${L.dough} — edible-style cookie dough for scooping and snacking.</li>
</ul>

<h2 id="peanut-butter-and-chocolate-cookies">Peanut Butter and Chocolate Cookies</h2>
<p>Rich, cocoa-forward trays and no-bake batches when you want big flavor fast.</p>
<ul>
<li>${L.chocolatePb} — chocolate peanut butter cookies for a double-comfort bake.</li>
<li>${L.noBake} — chocolate peanut butter no bake cookies without turning on the oven.</li>
<li>${L.crinkle} — chocolate crinkle cookies rolled in powdered sugar.</li>
<li>${L.brownie} — brownie crinkle cookies with a fudgy center.</li>
<li>${L.almondJoy} — almond joy cookies with coconut and chocolate notes.</li>
<li>${L.biscoff} — biscoff butter cookies with warm cookie-butter flavor.</li>
</ul>

<h2 id="fruit-breakfast-and-lighter-cookies">Fruit, Breakfast, and Lighter Cookies</h2>
<p>Softer, snackable cookies for mornings and after-school plates.</p>
<ul>
<li>${L.blueberry} — blueberry cookies with juicy fruit in every bite.</li>
<li>${L.pbBanana} — peanut butter banana cookies for a simple snack.</li>
<li>${L.breakfast} — breakfast cookies you can bake ahead.</li>
<li>${L.protein} — protein cookies for a more filling treat.</li>
<li>${L.glutenFree} — gluten free cookies for guests who need them.</li>
<li>${L.shortbread} — millionaire shortbread with layered caramel and chocolate.</li>
<li>${L.sprinkle} — rainbow sprinkle cookies for birthday trays.</li>
</ul>

<h2 id="holiday-cookie-recipes">Holiday Cookie Recipes</h2>
<p>Decorated and seasonal cookies for celebrations through the year.</p>
<ul>
<li>${L.july4} — 4th of July sugar cookies with red, white, and blue icing.</li>
<li>${L.christmas} — Christmas sugar cookies for cookie exchanges.</li>
<li>${L.gingerbread} — gingerbread cookies finished with royal icing.</li>
<li>${L.halloween} — Halloween cookies for spooky dessert tables.</li>
<li>${L.valentine} — heart-shaped Valentine cookies for sharing.</li>
</ul>

<h2 id="faqs">FAQs</h2>
<h3>What cookie recipe should I make first?</h3>
<p>For an easy classic, try ${L.thinChip} or ${L.chocolatePb}. If you do not want to bake, start with ${L.noBake}.</p>
<h3>How do I keep cookies soft?</h3>
<p>Do not overbake, pull them when centers still look slightly underdone, and store cooled cookies in an airtight container. A slice of bread in the container helps soft batches stay tender.</p>
<h3>Can I freeze cookie dough?</h3>
<p>Yes—many of these cookie recipes freeze well as scooped balls. Bake from frozen and add a minute or two as needed. ${L.thinChip} and ${L.christmas} doughs are especially handy to freeze.</p>
<h3>Which cookies are best for holidays?</h3>
<p>Decorated sugar cookies and gingerbread are classic: start with ${L.christmas}, ${L.gingerbread}, ${L.halloween}, or ${L.valentine}.</p>
<h3>Do leftover cookies stay fresh?</h3>
<p>They do. Cool completely, then store airtight at room temperature. Crisp cookies reheat briefly in a low oven if you want to refresh the edges.</p>

<h2 id="final-thoughts">Final Thoughts</h2>
<p>Good <strong>cookie recipes</strong> do not need fancy tools—just a mixing bowl, a sheet pan, and a little patience while the kitchen smells like butter and sugar. Bookmark this guide, pick a cluster, and bake one batch at a time. Before long you will have chocolate chip classics, peanut butter favorites, and holiday trays ready for any table.</p>
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
    alt: "Easy cookie recipes with chocolate chip, crinkle, peanut butter, and sugar cookies",
    title: "Easy Cookie Recipes Homestyle Spread",
    caption:
      "A welcoming cookie table: chocolate chip, peanut butter, crinkles, and holiday sugar cookies.",
    description:
      "Feature image for the easy cookie recipes guide showing a home-style cookie baking spread.",
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
    focusKeyword: "cookie recipes",
    slug: SLUG,
  });
  const r2Key = buildRecipeImageR2Key(basename);
  await putR2Object(r2Key, processed.buffer, "image/webp", {
    "alt-text": featureMeta.alt,
    title: featureMeta.title,
    caption: featureMeta.caption,
    description: featureMeta.description,
    "focus-keyword": "cookie recipes",
    section: "feature",
  });
  const featurePath = r2KeyToPublicPath(r2Key);
  console.log(`Uploaded feature → ${featurePath}`);

  let contentHtml = buildContentHtml();
  const sectionPhotos = [
    {
      headingId: "cookie-basics",
      src: "/wp-content/uploads/2025/12/Delicious-Thin-Chocolate-Chip-Cookies.webp",
      alt: "Thin chocolate chip cookies on a plate",
      caption: "Measure lightly, space the dough, and cool briefly on the pan.",
    },
    {
      headingId: "chocolate-chip-and-classic-cookies",
      src: "/wp-content/uploads/2025/12/Delicious-Thin-Crispy-Chocolate-Chip-Cookies-1.webp",
      alt: "Thin crispy chocolate chip cookies",
      caption: "Classic chocolate chip and cookies-and-cream favorites.",
    },
    {
      headingId: "peanut-butter-and-chocolate-cookies",
      src: "/wp-content/uploads/2025/06/Delicious-Chocolate-Peanut-Butter-Cookies.webp",
      alt: "Chocolate peanut butter cookies",
      caption: "Peanut butter, crinkle, and no-bake chocolate trays.",
    },
    {
      headingId: "fruit-breakfast-and-lighter-cookies",
      src: "/wp-content/uploads/2025/07/Delicious-Breakfast-Cookies-Ready-to-Enjoy.webp",
      alt: "Breakfast cookies ready to enjoy",
      caption: "Breakfast, fruit, and lighter snack cookies.",
    },
    {
      headingId: "holiday-cookie-recipes",
      src: "/wp-content/uploads/2025/12/Festive-Christmas-Sugar-Cookies.webp",
      alt: "Festive Christmas sugar cookies",
      caption: "Holiday sugar cookies and decorated seasonal trays.",
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
      title: "Easy Cookie Recipes",
      excerpt:
        "Find easy cookie recipes for chocolate chip, peanut butter, no-bake, crinkle, sugar cookies, and holiday trays—all gathered in one Grandma Recipe guide.",
      category: "dessert",
      categories: ["dessert", "snacks"],
      contentHtml,
      ingredients: [],
      instructions: [],
      featuredImage: featurePath,
      featuredImageAlt: featureMeta.alt,
      featuredImageCaption: featureMeta.caption,
      featuredImageDescription: featureMeta.description,
      seoTitle: "Easy Cookie Recipes for Chocolate Chip, Holidays, and More",
      seoDescription:
        "Browse easy cookie recipes: chocolate chip, peanut butter, no-bake, crinkle, sugar cookies, gingerbread, and more. A Grandma Recipe guide for family baking.",
      focusKeyword: "cookie recipes",
      cuisine: "American",
      course: "Dessert guide",
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
        linkedRecipes: 23,
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
