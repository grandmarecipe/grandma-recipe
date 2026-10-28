/**
 * Create Easy Beef Recipes pillar guide on DEV (draft) with feature image
 * and relevant in-article photos from existing beef/steak recipes.
 *
 * Usage: npx tsx scripts/create-beef-recipes-pillar.ts
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
  "/Users/talhaoui/.cursor/projects/Users-talhaoui-Desktop-cursor-projects-grandma-recipe/assets/easy-beef-recipes-feature.png";
const SLUG = "easy-beef-recipes";

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
    skillet: link(
      "how-to-cook-steak-in-a-skillet",
      "How to Cook Steak in a Skillet",
    ),
    bites: link("garlic-butter-steak-bites", "Garlic Butter Steak Bites"),
    pepper: link("pepper-steak", "Easy Pepper Steak"),
    mississippi: link("mississippi-pot-roast", "Mississippi Pot Roast"),
    shortRibs: link("plate-short-ribs", "Plate Short Ribs"),
    chuckRoast: link("bone-in-chuck-roast", "Bone-In Chuck Roast"),
    barbacoa: link(
      "slow-cooker-style-beef-barbacoa",
      "Slow Cooker Beef Barbacoa",
    ),
    noodles: link("crock-pot-beef-and-noodles", "Crock Pot Beef and Noodles"),
    carne: link("carne-asada", "Carne Asada"),
    kabobs: link("beef-kabobs", "Beef Kabobs"),
    pastrami: link("homemade-beef-pastrami", "Homemade Beef Pastrami"),
    swedish: link("swedish-meatballs", "Swedish Meatballs"),
    meatloaf: link("mexican-meatloaf", "Mexican Meatloaf"),
    cowboy: link("cowboy-casserole", "Cowboy Casserole"),
    philly: link("philly-cheesesteak", "Philly Cheesesteak"),
    ragu: link("beef-short-rib-ragu", "Beef Short Rib Ragu"),
    angus: link("angus-beef-steak", "Juicy Angus Beef Steak"),
    skirt: link("skirt-steak", "Skirt Steak"),
    tomahawk: link("tomahawk-steak", "Tomahawk Steak"),
    italian: link("italian-steak", "Italian Steak"),
    shoulder: link("shoulder-steak", "Shoulder Steak"),
    ribCap: link("rib-cap-steak", "Rib Cap Steak"),
    chuckSteak: link("beef-chuck-steak", "Slow-Cooked Beef Chuck Steak"),
    roasted: link("roasted-beef", "Roasted Beef"),
    soup: link("vegetable-beef-soup", "Vegetable Beef Soup"),
    burritos: link("beef-burritos", "Beef Burritos"),
    sliders: link("mini-beef-sliders", "Mini Beef Sliders"),
    holyCow: link("holy-cow-burgers", "Holy Cow Burgers"),
    brisketBurgers: link("brisket-burgers", "Brisket Burgers"),
    primeBrisket: link("prime-beef-brisket", "Prime Beef Brisket"),
    wholeBrisket: link("whole-brisket", "Whole Brisket"),
    loMein: link("beef-lo-mein", "Beef Lo Mein"),
    cheeseburgerMac: link("cheeseburger-macaroni", "Cheeseburger Macaroni"),
  };

  return `
<p>When supper needs something hearty and familiar, <strong>beef recipes</strong> bring everyone to the table. A skillet steak, a Sunday pot roast, slow cooker barbacoa, or a simple ground-beef casserole can all feel like home when the method is clear and the seasoning is honest. This guide gathers Grandma Recipe’s best easy beef recipes by style—steak nights, pot roasts and ribs, ground beef dinners, slow cooker comfort, and brisket—so you can choose a path and cook with confidence.</p>

<p>Use this page as your starting point. Each section below links to tested recipes with clear steps, pantry-friendly ingredients, and that cozy, from-scratch flavor we love for weeknights and Sundays alike.</p>

<h2 id="how-to-use-this-guide">How to Use This Beef Recipes Guide</h2>
<p>Start with the cut you have, then pick the method that matches your evening:</p>
<ul>
<li><strong>Short on time?</strong> Try skillet steak, steak bites, pepper steak, or a quick Philly cheesesteak.</li>
<li><strong>Want something cozy?</strong> Open a pot roast, short ribs, beef and noodles, or vegetable beef soup.</li>
<li><strong>Feeding a crowd with ground beef?</strong> Jump to meatballs, meatloaf, casseroles, burgers, and macaroni.</li>
<li><strong>Planning a special supper?</strong> Brisket, tomahawk, or a carefully cooked steak make the night feel memorable.</li>
</ul>
<p>If you are new to steak, begin with ${L.skillet}. For a set-it-and-forget-it dinner, start with ${L.mississippi} or ${L.noodles}.</p>

<h2 id="choose-your-beef-cut">Choose Your Beef Cut</h2>
<p>Matching the cut to the recipe is half the work.</p>
<ul>
<li><strong>Steaks for the skillet or grill</strong> — ribeye-style plates, skirt, shoulder, and steak bites. See ${L.skillet}, ${L.skirt}, ${L.angus}, and ${L.bites}.</li>
<li><strong>Chuck and roast cuts</strong> — best for low-and-slow tenderness. Try ${L.chuckRoast}, ${L.chuckSteak}, ${L.mississippi}, and ${L.roasted}.</li>
<li><strong>Short ribs</strong> — rich, braise-friendly beef for special plates like ${L.shortRibs} and ${L.ragu}.</li>
<li><strong>Brisket</strong> — for smoking, slicing, pastrami, or burgers: ${L.primeBrisket}, ${L.wholeBrisket}, ${L.pastrami}, and ${L.brisketBurgers}.</li>
<li><strong>Ground beef</strong> — meatballs, meatloaf, casseroles, and burgers when you need stretch and comfort.</li>
</ul>

<h2 id="beef-cooking-basics">Beef Cooking Basics</h2>
<p>A few steady habits keep beef recipes juicy and flavorful:</p>
<ul>
<li><strong>Pat the meat dry</strong> before searing so you get a good brown crust.</li>
<li><strong>Season generously</strong> with salt and pepper; add garlic, herbs, or a simple marinade when the recipe calls for it.</li>
<li><strong>Use a hot pan for steaks</strong>, then finish gently if needed. Rest the meat before slicing so the juices stay put.</li>
<li><strong>Trust low-and-slow for tough cuts</strong> — chuck, short ribs, and brisket soften with time and moisture.</li>
<li><strong>Slice against the grain</strong> on skirt, flank-style, and brisket slices for tenderness in every bite.</li>
</ul>
<p>For steak doneness, an instant-read thermometer removes the guesswork. Our skillet steak guide walks through the full method from sear to rest.</p>

<h2 id="steak-recipes">Steak Recipes</h2>
<p>Steak night does not have to be complicated. A hot skillet, good seasoning, and a short rest turn a simple cut into supper worth remembering.</p>
<ul>
<li>${L.skillet} — butter, garlic, and rosemary with a clear skillet method.</li>
<li>${L.bites} — quick garlic-butter bites for busy evenings.</li>
<li>${L.pepper} — tender strips with peppers and onions.</li>
<li>${L.angus}, ${L.skirt}, ${L.italian}, ${L.shoulder}, and ${L.ribCap} — cut-focused steak plates.</li>
<li>${L.tomahawk} — a showpiece steak when the table wants something special.</li>
<li>${L.carne} and ${L.kabobs} — grilled beef with bright, shareable flavors.</li>
<li>${L.philly} — sliced steak piled into a classic sandwich supper.</li>
</ul>
<p>Serve steak recipes with mashed potatoes, roasted vegetables, a simple salad, or warm bread for the pan juices.</p>

<h2 id="pot-roast-and-ribs">Pot Roast and Short Ribs</h2>
<p>These are the beef recipes that fill the kitchen with Sunday smells—tender meat, savory gravy, and vegetables that soaked up all the goodness.</p>
<ul>
<li>${L.mississippi} — pepperoncini comfort with fork-tender roast.</li>
<li>${L.chuckRoast} — bone-in chuck with vegetables.</li>
<li>${L.chuckSteak} — slow-cooked chuck steak with a hearty finish.</li>
<li>${L.shortRibs} — plated short ribs ready for a special dinner.</li>
<li>${L.ragu} — short rib ragu over a soft bed of polenta or pasta.</li>
<li>${L.roasted} — classic roasted beef for slicing at the table.</li>
</ul>
<p>Make-ahead tip: many pot roast dinners taste even better the next day. Cool, refrigerate, and reheat gently with a splash of broth.</p>

<h2 id="ground-beef-recipes">Ground Beef Recipes</h2>
<p>Ground beef stretches into family meals without feeling thin. Season well, brown properly, and finish with a sauce or cheese that feels like home.</p>
<ul>
<li>${L.swedish} — creamy meatballs for a cozy plate.</li>
<li>${L.meatloaf} — Mexican-inspired meatloaf with bright toppings.</li>
<li>${L.cowboy} — a hearty casserole night favorite.</li>
<li>${L.cheeseburgerMac} — skillet macaroni with cheeseburger flavor.</li>
<li>${L.holyCow}, ${L.brisketBurgers}, and ${L.sliders} — burger night in full-size or mini form.</li>
<li>${L.burritos} — seasoned beef wrapped for an easy hand-held supper.</li>
</ul>

<h2 id="slow-cooker-beef">Slow Cooker Beef Recipes</h2>
<p>Slow cooker beef recipes turn busy days into tender dinners. Add the ingredients, let time do the work, and come home to a kitchen that already smells like supper.</p>
<ul>
<li>${L.barbacoa} — shreddable barbacoa for tacos, bowls, and plates.</li>
<li>${L.noodles} — classic crock pot beef and noodles.</li>
<li>${L.mississippi} — pot roast that practically cooks itself.</li>
<li>${L.soup} — vegetable beef soup for chilly evenings.</li>
</ul>
<p>For best texture, keep pieces similar in size, and shred or slice only after the beef is fully tender.</p>

<h2 id="brisket-and-special-beef">Brisket and Special Beef</h2>
<p>When you want a project that rewards patience, brisket and specialty beef recipes earn their place.</p>
<ul>
<li>${L.primeBrisket} and ${L.wholeBrisket} — sliced brisket for a feast.</li>
<li>${L.pastrami} — homemade pastrami with rye-board energy.</li>
<li>${L.brisketBurgers} — brisket flavor in burger form.</li>
<li>${L.loMein} — a skillet noodle supper with savory beef.</li>
</ul>

<h2 id="what-to-serve-with-beef">What to Serve with Beef</h2>
<ul>
<li>Mashed potatoes, buttered noodles, or fluffy rice</li>
<li>Roasted carrots, green beans, or a crisp garden salad</li>
<li>Warm rolls or garlic bread for saucy plates</li>
<li>Pickles, peppers, or a simple slaw for sandwiches and tacos</li>
</ul>

<h2 id="make-ahead-storage-and-leftovers">Make Ahead, Storage, and Leftovers</h2>
<ul>
<li><strong>Refrigerate</strong> cooked beef within 2 hours in shallow containers. Use within 3 to 4 days.</li>
<li><strong>Freeze</strong> cooled portions in airtight containers for up to 2 to 3 months.</li>
<li><strong>Reheat</strong> gently until steaming hot. Add a splash of broth to sliced roast or steak so it stays moist.</li>
<li><strong>Leftover ideas:</strong> sandwiches, hash, taco fillings, soup starters, and pasta tosses.</li>
</ul>

<h2 id="faqs">FAQs About Beef Recipes</h2>
<h3>How do I cook steak without drying it out?</h3>
<p>Start with a hot pan, do not move the steak constantly, and rest it before slicing. ${L.skillet} covers the full skillet method.</p>
<h3>Which beef cut is best for beginners?</h3>
<p>Steak bites and skillet steaks are friendly starting points. For roast nights, chuck and Mississippi-style pot roast are forgiving because moisture and time do most of the work.</p>
<h3>Can I swap steak cuts in these recipes?</h3>
<p>Often yes for skillet and stir-fry style recipes. Thicker or tougher cuts may need more time or a marinade—follow the linked recipe’s cues.</p>
<h3>What internal temperature should I use for steak?</h3>
<p>Use an instant-read thermometer and pull the steak a few degrees before your target doneness, then rest. Exact targets are listed in ${L.skillet}.</p>
<h3>Which beef recipe should I make first?</h3>
<p>For steak night, make ${L.skillet} or ${L.bites}. For Sunday comfort, choose ${L.mississippi} or ${L.noodles}.</p>

<h2 id="final-thoughts">Final Thoughts</h2>
<p>Good <strong>beef recipes</strong> do not need fancy tricks—just the right cut, honest seasoning, and a method that fits your night. Bookmark this guide, pick a cluster, and cook one recipe at a time. Before long you will have a reliable rotation for skillet steaks, pot roast Sundays, and easy ground-beef weeknights.</p>
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
    alt: "Easy beef recipes featuring seared steak, pot roast, and garlic butter steak bites",
    title: "Easy Beef Recipes Homestyle Dinner Spread",
    caption:
      "A welcoming beef dinner spread: skillet steak, pot roast, and savory steak bites.",
    description:
      "Feature image for the easy beef recipes guide showing a home-style beef dinner table.",
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
    focusKeyword: "beef recipes",
    slug: SLUG,
  });
  const r2Key = buildRecipeImageR2Key(basename);
  await putR2Object(r2Key, processed.buffer, "image/webp", {
    "alt-text": featureMeta.alt,
    title: featureMeta.title,
    caption: featureMeta.caption,
    description: featureMeta.description,
    "focus-keyword": "beef recipes",
    section: "feature",
  });
  const featurePath = r2KeyToPublicPath(r2Key);
  console.log(`Uploaded feature → ${featurePath}`);

  let contentHtml = buildContentHtml();
  const sectionPhotos = [
    {
      headingId: "choose-your-beef-cut",
      src: "/wp-content/uploads/2026/01/Savory-Garlic-Butter-Steak-Bites.webp",
      alt: "Garlic butter steak bites with parsley",
      caption: "Pick your cut first — steak, chuck, short ribs, brisket, or ground beef.",
    },
    {
      headingId: "steak-recipes",
      src: "/wp-content/uploads/2026/09/How-To-Cook-Steak-In-A-Skillet.webp",
      alt: "Steak cooking in a skillet with butter, garlic, and rosemary",
      caption: "Steak night starts with a hot skillet, good seasoning, and a short rest.",
    },
    {
      headingId: "pot-roast-and-ribs",
      src: "/wp-content/uploads/2026/01/Mouthwatering-Mississippi-Pot-Roast.webp",
      alt: "Mississippi pot roast with pepperoncini and mashed potatoes",
      caption: "Pot roast and short ribs bring Sunday comfort to the table.",
    },
    {
      headingId: "ground-beef-recipes",
      src: "/wp-content/uploads/2025/11/Savory-Swedish-Meatballs-with-Creamy-Sauce.webp",
      alt: "Swedish meatballs with creamy sauce",
      caption: "Ground beef recipes stretch into meatballs, casseroles, burgers, and more.",
    },
    {
      headingId: "slow-cooker-beef",
      src: "/wp-content/uploads/2026/09/Slow-Cooker-Beef-Barbacoa-With-Warm-Tortillas.webp",
      alt: "Slow cooker beef barbacoa with tortillas and lime",
      caption: "Slow cooker beef dinners: barbacoa, noodles, pot roast, and soup.",
    },
    {
      headingId: "brisket-and-special-beef",
      src: "/wp-content/uploads/2025/12/Deliciously-Smoked-Prime-Beef-Brisket.webp",
      alt: "Sliced prime beef brisket on a wooden board",
      caption: "Brisket and specialty beef for weekends and special plates.",
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
      title: "Easy Beef Recipes",
      excerpt:
        "Find easy beef recipes for weeknights and Sunday supper—skillet steak, pot roast, short ribs, ground beef dinners, slow cooker beef, and brisket, all gathered in one cozy guide.",
      category: "dinner",
      categories: ["dinner"],
      contentHtml,
      ingredients: [],
      instructions: [],
      featuredImage: featurePath,
      featuredImageAlt: featureMeta.alt,
      featuredImageCaption: featureMeta.caption,
      featuredImageDescription: featureMeta.description,
      seoTitle: "Easy Beef Recipes for Steak Night and Sunday Supper",
      seoDescription:
        "Browse easy beef recipes by style: skillet steak, pot roast, short ribs, ground beef, slow cooker dinners, and brisket. A Grandma Recipe guide for family meals.",
      focusKeyword: "beef recipes",
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
