/**
 * Create Thanksgiving Appetizers guide on DEV (draft).
 * Links existing snack/dip/drink recipes suitable before dinner.
 * No pork / no alcohol.
 *
 * Usage: npx tsx scripts/create-thanksgiving-appetizers-guide.ts
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
  path.join(ASSETS, "thanksgiving-appetizers-feature.png"),
  path.join(ASSETS, "thanksgiving-appetizers-feature.jpg"),
];
const SLUG = "thanksgiving-appetizers";

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
    cheeseBall: link("classic-cheese-ball", "Classic Cheese Ball"),
    cheeseBites: link("cheese-ball-bites", "Cheese Ball Bites"),
    yogurtDip: link("veggie-yogurt-dip", "Veggie Yogurt Dip"),
    cowboy: link("cowboy-caviar-dip", "Easy Cowboy Caviar Dip"),
    bruschetta: link("bruschetta-tomato-basil", "Bruschetta Tomato Basil"),
    popcorn: link("caramel-popcorn", "Homemade Caramel Popcorn"),
    cranberry: link("cranberry-juice-cocktail", "Cranberry Juice Cocktail"),
    cider: link("spiced-apple-cider", "Spiced Apple Cider"),
    crockCider: link("crock-pot-apple-cider", "Crock Pot Apple Cider"),
    hub: link("thanksgiving-recipes", "Easy Thanksgiving Recipes"),
    sides: link("thanksgiving-side-dishes", "Thanksgiving Side Dishes"),
  };

  return `
<p>Before the turkey hits the table, <strong>thanksgiving appetizers</strong> keep guests happy without filling them up. This guide gathers Grandma Recipe’s best make-ahead snacks, dips, and non-alcoholic drinks for the holiday cocktail hour that is really just snack hour.</p>

<p>Use this page for light starters while the bird rests. Each recipe is simple, family-friendly, and easy to set out with crackers, veggies, or a warm mug.</p>

<h2 id="how-to-use-this-guide">How to Use This Thanksgiving Appetizers Guide</h2>
<p>Start with the kind of starter you need:</p>
<ul>
<li><strong>Want a cheese tray centerpiece?</strong> Classic cheese ball or cheese ball bites with crackers.</li>
<li><strong>Need something fresh?</strong> Veggie yogurt dip, cowboy caviar, or tomato basil bruschetta.</li>
<li><strong>Want a sweet nibble?</strong> Homemade caramel popcorn for grazing bowls.</li>
<li><strong>Need a drink station?</strong> Spiced apple cider or cranberry juice cocktail, no alcohol required.</li>
</ul>
<p>Keep appetizers light so dinner still feels special. Two dips plus one drink is usually enough. For the full menu, return to ${L.hub} and ${L.sides}.</p>

<p>Browse cheese and dips first, then fresh crunchy starters and non-alcoholic drinks, before the light-snack tips at the end.</p>

<h2 id="cheese-and-dip-appetizers">Cheese and Dip Appetizers</h2>
<p>Creamy, scoopable starters for the coffee table while dinner finishes.</p>
<ul>
<li>${L.cheeseBall}, a classic cheese ball for crackers and a pretty board.</li>
<li>${L.cheeseBites}, bite-size cheese ball pieces for easy passing.</li>
<li>${L.yogurtDip}, veggie yogurt dip for carrot and cucumber sticks.</li>
<li>${L.cowboy}, cowboy caviar dip with beans, corn, and bright veggies.</li>
</ul>

<h2 id="fresh-and-crunchy-starters">Fresh and Crunchy Starters</h2>
<p>Something bright so the pre-dinner spread is not only rich.</p>
<ul>
<li>${L.bruschetta}, tomato basil bruschetta on toasted bread.</li>
<li>${L.popcorn}, homemade caramel popcorn for a sweet crunchy bowl.</li>
</ul>

<h2 id="thanksgiving-drinks-no-alcohol">Thanksgiving Drinks (No Alcohol)</h2>
<p>Warm and cold drinks for the appetizer hour.</p>
<ul>
<li>${L.cider}, spiced apple cider for a cozy mug.</li>
<li>${L.crockCider}, crock pot apple cider when you want hands-off warmth.</li>
<li>${L.cranberry}, cranberry juice cocktail with citrus sparkle over ice.</li>
</ul>

<h2 id="keep-appetizers-light">Keep Appetizers Light</h2>
<p>A few habits protect dinner appetite:</p>
<ul>
<li><strong>Set out food 30 to 45 minutes before plating</strong>, not hours earlier.</li>
<li><strong>Choose one rich dip and one fresh option</strong> so the tray feels balanced.</li>
<li><strong>Use small bowls</strong> so guests nibble instead of filling a plate.</li>
<li><strong>Put drinks nearby</strong> so people gather without hovering over the oven.</li>
<li><strong>Clear the snack table once turkey is carved</strong> so sides get the attention.</li>
</ul>

<h2 id="faqs">FAQs</h2>
<h3>What Thanksgiving appetizers should I make first?</h3>
<p>Start with ${L.cheeseBall} or ${L.yogurtDip}. Both come together fast and sit well with crackers or vegetables.</p>
<h3>Can I make Thanksgiving appetizers ahead?</h3>
<p>Yes. Cheese balls chill well overnight. Cowboy caviar and veggie dip can be mixed earlier in the day. Popcorn keeps in an airtight container. Warm cider just before guests arrive.</p>
<h3>How many appetizers do I need for Thanksgiving?</h3>
<p>Two savory options and one drink is enough for most gatherings. Add caramel popcorn only if you want a sweet snack bowl.</p>
<h3>What are good non-alcoholic Thanksgiving drinks?</h3>
<p>${L.cider}, ${L.crockCider}, and ${L.cranberry} cover warm and cold without any alcohol.</p>
<h3>How do I keep guests from getting full before dinner?</h3>
<p>Serve smaller portions, include a fresh dip or bruschetta, and announce dinner timing so people know snacks are just a bridge to the meal.</p>

<h2 id="final-thoughts">Final Thoughts</h2>
<p>Good <strong>thanksgiving appetizers</strong> welcome people in without stealing the show from turkey and pie. Pick one cheese or dip, one fresh bite, and a warm cider or cranberry drink, then move everyone to the table. Bookmark this guide and return to ${L.hub} when you are ready to lock in the rest of the menu.</p>
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
    alt: "Thanksgiving appetizers with cheese, dips, veggies, and cranberry drink",
    title: "Thanksgiving Appetizers Homestyle Spread",
    caption:
      "A light Thanksgiving appetizer tray with dips, veggies, and a festive drink.",
    description:
      "Homestyle Thanksgiving appetizers spread with cheese, vegetable dip, crackers, and a cranberry drink on a rustic wooden table.",
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
    focusKeyword: "thanksgiving appetizers",
    slug: SLUG,
  });
  const r2Key = buildRecipeImageR2Key(basename);
  await putR2Object(r2Key, processed.buffer, "image/webp", {
    "alt-text": featureMeta.alt,
    title: featureMeta.title,
    caption: featureMeta.caption,
    description: featureMeta.description,
    "focus-keyword": "thanksgiving appetizers",
    section: "feature",
  });
  const featurePath = r2KeyToPublicPath(r2Key);
  console.log(`Uploaded feature → ${featurePath}`);

  let contentHtml = buildContentHtml();
  const sectionPhotos = [
    {
      headingId: "cheese-and-dip-appetizers",
      src: "/wp-content/uploads/2025/08/Delicious-Classic-Cheese-Ball.webp",
      alt: "Classic cheese ball for Thanksgiving appetizers",
      caption: "Cheese balls and dips for the pre-dinner tray.",
    },
    {
      headingId: "fresh-and-crunchy-starters",
      src: "/wp-content/uploads/2026/10/Homemade-Caramel-Popcorn-For-Cozy-Movie-Nights.webp",
      alt: "Homemade caramel popcorn snack bowl",
      caption: "Fresh bruschetta and sweet crunchy popcorn bowls.",
    },
    {
      headingId: "thanksgiving-drinks-no-alcohol",
      src: "/wp-content/uploads/2025/12/Refreshing-Cranberry-Juice-Cocktail.webp",
      alt: "Cranberry juice cocktail for Thanksgiving",
      caption: "Cider and cranberry drinks with no alcohol.",
    },
    {
      headingId: "keep-appetizers-light",
      src: "/wp-content/uploads/2025/12/Delicious-Veggie-Yogurt-Dip.webp",
      alt: "Veggie yogurt dip with fresh vegetables",
      caption: "Keep starters light so dinner still feels special.",
    },
  ];
  for (const photo of sectionPhotos) {
    // paths verified/adjusted after lookup
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
      title: "Thanksgiving Appetizers",
      excerpt:
        "Find easy Thanksgiving appetizers for cheese balls, dips, bruschetta, caramel popcorn, and non-alcoholic cider or cranberry drinks.",
      category: "snacks",
      categories: ["snacks", "breakfast"],
      contentHtml,
      ingredients: [],
      instructions: [],
      featuredImage: featurePath,
      featuredImageAlt: featureMeta.alt,
      featuredImageCaption: featureMeta.caption,
      featuredImageDescription: featureMeta.description,
      seoTitle: "Thanksgiving Appetizers: Dips, Cheese Balls, and Easy Drinks",
      seoDescription:
        "Browse Thanksgiving appetizers: cheese ball, veggie dip, cowboy caviar, bruschetta, caramel popcorn, cider, and cranberry juice cocktail.",
      focusKeyword: "thanksgiving appetizers",
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
        linkedRecipes: 9,
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
