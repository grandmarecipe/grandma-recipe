/**
 * Create remaining pillar guides on DEV (draft):
 * - easy-dessert-recipes
 * - easy-weeknight-dinners
 * - easy-breakfast-recipes
 *
 * Usage: npx tsx scripts/create-remaining-pillars.ts
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

function findFeature(basename: string) {
  for (const ext of ["png", "jpg", "jpeg", "webp"]) {
    const p = path.join(ASSETS, `${basename}.${ext}`);
    if (fs.existsSync(p)) return p;
  }
  throw new Error(`Missing feature image: ${basename}`);
}

function wordCount(html: string) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean).length;
}

type Pillar = {
  slug: string;
  title: string;
  focusKeyword: string;
  excerpt: string;
  seoTitle: string;
  seoDescription: string;
  cuisine: string;
  course: string;
  category: "breakfast" | "dinner" | "dessert";
  featureBasename: string;
  featureMeta: {
    alt: string;
    title: string;
    caption: string;
    description: string;
  };
  contentHtml: string;
  sectionPhotos: { headingId: string; src: string; alt: string; caption: string }[];
};

function dessertPillar(): Pillar {
  const L = {
    oreoPie: link("no-bake-oreo-cream-pie", "No Bake Oreo Cream Pie"),
    oreoDessert: link("no-bake-oreo-dessert", "No Bake Oreo Dessert"),
    cheesecakeCup: link("no-bake-cheesecake-cup", "No Bake Cheesecake Cup"),
    oreoCheesecake: link("no-bake-oreo-cheesecake", "No Bake Oreo Cheesecake"),
    walking: link("walking-banana-pudding", "Walking Banana Pudding"),
    bananaPudding: link(
      "not-yo-mamas-banana-pudding",
      "Not Yo Mama's Banana Pudding",
    ),
    pbCookies: link(
      "chocolate-peanut-butter-cookies",
      "Chocolate Peanut Butter Cookies",
    ),
    crinkle: link("chocolate-crinkle-cookies", "Chocolate Crinkle Cookies"),
    thinChip: link(
      "thin-chocolate-chip-cookies",
      "Thin Chocolate Chip Cookies",
    ),
    almondJoy: link("almond-joy-cookies", "Almond Joy Cookies"),
    pecan: link("pecan-pie", "Pecan Pie"),
    lemon: link("lemon-meringue-pie", "Lemon Meringue Pie"),
    buttermilk: link("buttermilk-pie", "Buttermilk Pie"),
    pbCupPie: link("peanut-butter-cup-pie", "Peanut Butter Cup Pie"),
    handPies: link(
      "grandmas-homemade-apple-hand-pies",
      "Apple Hand Pies",
    ),
    darkCake: link("dark-chocolate-cake", "Dark Chocolate Cake"),
    mayoCake: link("chocolate-mayonnaise-cake", "Chocolate Mayonnaise Cake"),
    shortcake: link("strawberry-shortcake-cake", "Strawberry Shortcake Cake"),
    heaven: link("heaven-on-earth-cake", "Heaven on Earth Cake"),
    pumpkinPoke: link("pumpkin-poke-cake", "Pumpkin Poke Cake"),
    caramelDump: link("caramel-apple-dump-cake", "Caramel Apple Dump Cake"),
    pumpkinDump: link("pumpkin-dump-cake-recipe", "Pumpkin Dump Cake"),
    chocLasagna: link("chocolate-lasagna", "Chocolate Lasagna"),
    oreoLasagna: link("oreo-lasagna", "Oreo Lasagna"),
    turtle: link("turtle-cheesecake", "Turtle Cheesecake"),
    samoa: link("samoa-cheesecake", "Samoa Cheesecake"),
    brownies: link("chocolate-brownies", "Chocolate Brownies"),
    threeBrownies: link("3-ingredient-brownies", "3-Ingredient Brownies"),
    bananaBread: link(
      "chocolate-chip-banana-bread",
      "Chocolate Chip Banana Bread",
    ),
  };

  const contentHtml = `
<p>A homemade dessert does not have to be complicated to feel special. Cookies cooling on the counter, a no-bake pie chilling in the fridge, or a warm dump cake from the oven can all make the table feel complete. This guide gathers Grandma Recipe’s best <strong>dessert recipes</strong>—no-bake sweets, cookies, pies, cakes, brownies, and layered dessert bars—so you can pick a path and bake with confidence.</p>

<p>Use this page as your starting point. Each section below links to tested recipes with clear steps, pantry-friendly ingredients, and that cozy, from-scratch sweetness we love after family supper.</p>

<h2 id="how-to-use-this-guide">How to Use This Dessert Recipes Guide</h2>
<ul>
<li><strong>No oven time?</strong> Start with no-bake Oreo desserts, cheesecake cups, or banana pudding.</li>
<li><strong>Want something shareable?</strong> Cookies, brownies, and dump cakes travel well to potlucks.</li>
<li><strong>Need a classic finale?</strong> Pie, layer cake, or strawberry shortcake makes Sunday feel complete.</li>
<li><strong>Craving chocolate?</strong> Jump to cakes, brownies, chocolate lasagna, and crinkle cookies.</li>
</ul>

<h2 id="no-bake-desserts">No-Bake Desserts</h2>
<p>No-bake desserts are weeknight heroes—cool, creamy, and ready without heating the whole kitchen.</p>
<ul>
<li>${L.oreoPie} — creamy Oreo pie with a crumb crust.</li>
<li>${L.oreoDessert} — layered no-bake Oreo dessert.</li>
<li>${L.oreoCheesecake} and ${L.cheesecakeCup} — cheesecake flavor with less fuss.</li>
<li>${L.oreoLasagna} and ${L.chocLasagna} — layered dessert “lasagna” for a crowd.</li>
<li>${L.walking} and ${L.bananaPudding} — banana pudding comfort in fun and classic forms.</li>
</ul>

<h2 id="cookies-and-bars">Cookies and Bars</h2>
<p>Cookies are the friendliest dessert recipes—mix, scoop, and bake until the kitchen smells like home.</p>
<ul>
<li>${L.thinChip} — thin, crisp chocolate chip cookies.</li>
<li>${L.crinkle} — soft chocolate crinkle cookies under powdered sugar.</li>
<li>${L.pbCookies} — chocolate peanut butter cookie comfort.</li>
<li>${L.almondJoy} — coconut, chocolate, and almond cookie treats.</li>
<li>${L.brownies} and ${L.threeBrownies} — fudgy brownies, including a simple three-ingredient batch.</li>
</ul>

<h2 id="pies-and-hand-pies">Pies and Hand Pies</h2>
<p>Pie is Sunday dessert at its best—flaky edges, sweet filling, and a slice that makes people linger.</p>
<ul>
<li>${L.pecan} — classic pecan pie.</li>
<li>${L.lemon} — bright lemon meringue pie.</li>
<li>${L.buttermilk} — southern buttermilk pie.</li>
<li>${L.pbCupPie} — peanut butter cup pie for chocolate lovers.</li>
<li>${L.handPies} — apple hand pies for portable pie night.</li>
</ul>

<h2 id="cakes-and-dump-cakes">Cakes and Dump Cakes</h2>
<p>From tall layer cakes to easy dump cakes, these dessert recipes cover celebration and weeknight sweetness alike.</p>
<ul>
<li>${L.darkCake} and ${L.mayoCake} — rich chocolate cakes.</li>
<li>${L.shortcake} and ${L.heaven} — soft, creamy cake desserts.</li>
<li>${L.pumpkinPoke}, ${L.caramelDump}, and ${L.pumpkinDump} — poke cakes and dump cakes with little fuss.</li>
<li>${L.bananaBread} — chocolate chip banana bread for snack-time sweetness.</li>
</ul>

<h2 id="cheesecakes">Cheesecakes</h2>
<ul>
<li>${L.turtle} — turtle cheesecake with caramel and pecans.</li>
<li>${L.samoa} — samoa-inspired cheesecake.</li>
<li>${L.oreoCheesecake} and ${L.cheesecakeCup} — Oreo and cup-style cheesecake treats.</li>
</ul>

<h2 id="final-thoughts">Final Thoughts</h2>
<p>Good <strong>dessert recipes</strong> do not need bakery gear—just a clear method and a little sweetness to share. Bookmark this guide, pick a cluster, and bake one recipe at a time.</p>
<p>Explore more easy <a href="/category/breakfast/"><strong>breakfast</strong></a> recipes, quick <a href="/category/lunch/"><strong>lunch</strong></a> ideas, cozy <a href="/category/dinner/"><strong>dinner</strong></a> meals, tasty <a href="/category/snacks/"><strong>snacks</strong></a>, and delightful <a href="/category/dessert/"><strong>dessert</strong></a>.</p>
`.trim();

  return {
    slug: "easy-dessert-recipes",
    title: "Easy Dessert Recipes",
    focusKeyword: "dessert recipes",
    excerpt:
      "Find easy dessert recipes for weeknights and Sunday supper—no-bake sweets, cookies, pies, cakes, brownies, and cheesecakes, all gathered in one cozy guide.",
    seoTitle: "Easy Dessert Recipes for Homemade Sweets",
    seoDescription:
      "Browse easy dessert recipes by style: no-bake desserts, cookies, pies, cakes, dump cakes, and cheesecakes. A Grandma Recipe guide for family sweets.",
    cuisine: "American",
    course: "Dessert guide",
    category: "dessert",
    featureBasename: "easy-dessert-recipes-feature",
    featureMeta: {
      alt: "Easy dessert recipes featuring chocolate cake, cookies, pie, and no-bake sweets",
      title: "Easy Dessert Recipes Homestyle Sweet Spread",
      caption:
        "A welcoming dessert spread: cake, cookies, pie, and no-bake sweets.",
      description:
        "Feature image for the easy dessert recipes guide showing a home-style dessert table.",
    },
    contentHtml,
    sectionPhotos: [
      {
        headingId: "no-bake-desserts",
        src: "/wp-content/uploads/2025/06/Decadent-No-Bake-Oreo-Cream-Pie-Slice.webp",
        alt: "Slice of no-bake Oreo cream pie",
        caption: "No-bake desserts for cool, creamy sweets without heating the oven.",
      },
      {
        headingId: "cookies-and-bars",
        src: "/wp-content/uploads/2025/12/Delicious-Thin-Chocolate-Chip-Cookies.webp",
        alt: "Thin chocolate chip cookies on a plate",
        caption: "Cookies and brownies for shareable homemade treats.",
      },
      {
        headingId: "pies-and-hand-pies",
        src: "/wp-content/uploads/2025/06/Delicious-Slice-of-Pecan-Pie.webp",
        alt: "Slice of pecan pie on a white plate",
        caption: "Pies and hand pies for classic Sunday dessert.",
      },
      {
        headingId: "cakes-and-dump-cakes",
        src: "/wp-content/uploads/2026/01/Indulgent-Dark-Chocolate-Cake.webp",
        alt: "Dark chocolate layer cake on a cake stand",
        caption: "Cakes, poke cakes, and dump cakes for celebration or weeknight sweetness.",
      },
      {
        headingId: "cheesecakes",
        src: "/wp-content/uploads/2026/01/Delicious-Turtle-Cheesecake-Ready-to-Serve.webp",
        alt: "Turtle cheesecake with caramel and pecans",
        caption: "Cheesecakes for richer dessert nights.",
      },
    ],
  };
}

function weeknightPillar(): Pillar {
  const L = {
    airChicken: link(
      "air-fryer-parmesan-crusted-chicken",
      "Air Fryer Parmesan Crusted Chicken",
    ),
    airMozz: link("air-fryer-mozzarella-sticks", "Air Fryer Mozzarella Sticks"),
    airChips: link("air-fryer-chips", "Air Fryer Chips"),
    airNachos: link("air-fryer-nachos", "Air Fryer Nachos"),
    airZucchini: link(
      "air-fryer-zucchini-chips",
      "Air Fryer Zucchini Chips",
    ),
    delicata: link("delicata-squash-air-fryer", "Air Fryer Delicata Squash"),
    crockAlfredo: link(
      "crockpot-chicken-alfredo-pasta",
      "Crockpot Chicken Alfredo Pasta",
    ),
    crockLasagna: link("crockpot-lasagna", "Crockpot Lasagna"),
    crockSpaghetti: link("crockpot-spaghetti", "Crockpot Spaghetti"),
    whiteChili: link(
      "white-chicken-chili-crockpot",
      "White Chicken Chili Crockpot",
    ),
    chickenRice: link(
      "slow-cooker-chicken-and-rice",
      "Slow Cooker Chicken and Rice",
    ),
    stroganoff: link(
      "slow-cooker-chicken-stroganoff",
      "Slow Cooker Chicken Stroganoff",
    ),
    beefNoodles: link(
      "crock-pot-beef-and-noodles",
      "Crock Pot Beef and Noodles",
    ),
    mississippi: link("mississippi-pot-roast", "Mississippi Pot Roast"),
    barbacoa: link(
      "slow-cooker-style-beef-barbacoa",
      "Slow Cooker Beef Barbacoa",
    ),
    hawaiian: link(
      "hawaiian-chicken-sheet-pan",
      "Hawaiian Chicken Sheet Pan",
    ),
    onePan: link(
      "one-pan-roasted-chicken-and-vegetables",
      "One Pan Roasted Chicken",
    ),
    salmon: link("sheet-pan-salmon", "Sheet Pan Salmon"),
    skilletSteak: link(
      "how-to-cook-steak-in-a-skillet",
      "How to Cook Steak in a Skillet",
    ),
    meatballs: link(
      "ground-chicken-recipes-cozy-skillet-chicken-meatballs",
      "Skillet Chicken Meatballs",
    ),
    steakBites: link("garlic-butter-steak-bites", "Garlic Butter Steak Bites"),
  };

  const contentHtml = `
<p>Weeknights go better when supper has a clear method. An air fryer chicken cutlet, a crockpot roast, a sheet-pan dinner, or a hot skillet can all get food on the table without a long fuss. This guide gathers Grandma Recipe’s best <strong>easy weeknight dinners</strong> by cooking method—air fryer, slow cooker, sheet pan, and skillet—so you can choose a path that fits the clock.</p>

<p>Use this page as your starting point. Each section links to tested recipes with clear steps and that cozy, from-scratch flavor we love after a busy day.</p>

<h2 id="how-to-use-this-guide">How to Use This Weeknight Dinners Guide</h2>
<ul>
<li><strong>Home late?</strong> Choose air fryer or skillet meals.</li>
<li><strong>Can start supper in the morning?</strong> Use the crockpot or slow cooker.</li>
<li><strong>Want easy cleanup?</strong> Sheet-pan and one-pan dinners keep dishes light.</li>
<li><strong>Need something cozy?</strong> Pot roast, chili, and pasta crockpot recipes feel like Sunday on a Tuesday.</li>
</ul>

<h2 id="air-fryer-dinners">Air Fryer Dinners and Sides</h2>
<p>The air fryer brings crisp edges without deep frying—perfect for busy evenings.</p>
<ul>
<li>${L.airChicken} — crispy Parmesan chicken cutlets.</li>
<li>${L.airMozz} — mozzarella sticks with a golden crunch.</li>
<li>${L.airChips} and ${L.airZucchini} — chip-style sides.</li>
<li>${L.airNachos} — nachos finished in the air fryer.</li>
<li>${L.delicata} — roasted delicata squash made easy.</li>
</ul>

<h2 id="crockpot-and-slow-cooker">Crockpot and Slow Cooker Dinners</h2>
<p>Slow cooker dinners do the work while you are away. Come home to a kitchen that already smells like supper.</p>
<ul>
<li>${L.chickenRice} — chicken and rice in one pot.</li>
<li>${L.stroganoff} — creamy chicken stroganoff.</li>
<li>${L.crockAlfredo}, ${L.crockLasagna}, and ${L.crockSpaghetti} — pasta night with less hovering.</li>
<li>${L.whiteChili} — white chicken chili.</li>
<li>${L.mississippi} and ${L.beefNoodles} — beefy comfort.</li>
<li>${L.barbacoa} — shreddable barbacoa for tacos and bowls.</li>
</ul>

<h2 id="sheet-pan-and-one-pan">Sheet Pan and One-Pan Dinners</h2>
<p>Sheet-pan and one-pan recipes keep prep simple and cleanup kinder.</p>
<ul>
<li>${L.hawaiian} — colorful Hawaiian chicken sheet pan.</li>
<li>${L.onePan} — roasted chicken and vegetables together.</li>
<li>${L.salmon} — sheet pan salmon with vegetables.</li>
</ul>

<h2 id="skillet-dinners">Skillet Dinners</h2>
<p>A hot skillet is still one of the fastest paths to a good weeknight plate.</p>
<ul>
<li>${L.skilletSteak} — skillet steak with butter and herbs.</li>
<li>${L.steakBites} — garlic butter steak bites.</li>
<li>${L.meatballs} — cozy skillet chicken meatballs.</li>
</ul>

<h2 id="final-thoughts">Final Thoughts</h2>
<p>Good <strong>easy weeknight dinners</strong> are less about fancy menus and more about choosing a method that fits the day. Bookmark this guide, pick a cluster, and cook one reliable supper at a time.</p>
<p>Explore more easy <a href="/category/breakfast/"><strong>breakfast</strong></a> recipes, quick <a href="/category/lunch/"><strong>lunch</strong></a> ideas, cozy <a href="/category/dinner/"><strong>dinner</strong></a> meals, tasty <a href="/category/snacks/"><strong>snacks</strong></a>, and delightful <a href="/category/dessert/"><strong>dessert</strong></a>.</p>
`.trim();

  return {
    slug: "easy-weeknight-dinners",
    title: "Easy Weeknight Dinners",
    focusKeyword: "easy weeknight dinners",
    excerpt:
      "Find easy weeknight dinners by method—air fryer, crockpot, sheet pan, and skillet meals—for busy evenings and cozy family supper.",
    seoTitle: "Easy Weeknight Dinners for Busy Family Evenings",
    seoDescription:
      "Browse easy weeknight dinners by cooking method: air fryer, slow cooker, sheet pan, and skillet. A Grandma Recipe guide for busy nights.",
    cuisine: "American",
    course: "Dinner guide",
    category: "dinner",
    featureBasename: "easy-weeknight-dinners-feature",
    featureMeta: {
      alt: "Easy weeknight dinners featuring skillet steak bites, sheet-pan chicken, and crockpot supper",
      title: "Easy Weeknight Dinners Homestyle Spread",
      caption:
        "A welcoming weeknight supper: skillet, sheet pan, and slow cooker comfort.",
      description:
        "Feature image for the easy weeknight dinners guide showing home-style quick dinners.",
    },
    contentHtml,
    sectionPhotos: [
      {
        headingId: "air-fryer-dinners",
        src: "/wp-content/uploads/2025/07/Delicious-Air-Fryer-Parmesan-Crusted-Chicken.webp",
        alt: "Air fryer Parmesan crusted chicken cutlets",
        caption: "Air fryer dinners and sides with crisp edges and less mess.",
      },
      {
        headingId: "crockpot-and-slow-cooker",
        src: "/wp-content/uploads/2025/08/Delicious-Slow-Cooker-Chicken-and-Rice-1.webp",
        alt: "Slow cooker chicken and rice",
        caption: "Crockpot dinners that simmer while the day gets done.",
      },
      {
        headingId: "sheet-pan-and-one-pan",
        src: "/wp-content/uploads/2026/01/Delicious-Hawaiian-Chicken-Sheet-Pan.webp",
        alt: "Hawaiian chicken sheet pan dinner",
        caption: "Sheet-pan and one-pan meals for easier cleanup.",
      },
      {
        headingId: "skillet-dinners",
        src: "/wp-content/uploads/2026/01/Savory-Garlic-Butter-Steak-Bites.webp",
        alt: "Garlic butter steak bites",
        caption: "Skillet dinners for fast, flavorful weeknights.",
      },
    ],
  };
}

function breakfastPillar(): Pillar {
  const L = {
    bananaPancakes: link("homemade-banana-pancakes", "Homemade Banana Pancakes"),
    sheetPan: link("sheet-pan-pancakes", "Sheet Pan Pancakes"),
    ovenPancake: link("oven-baked-pancake", "Oven-Baked Pancake"),
    gingerbread: link("gingerbread-pancakes", "Gingerbread Pancakes"),
    blueberry: link("blueberry-waffles", "Blueberry Waffles"),
    wheat: link("wheat-waffles", "Whole Wheat Waffles"),
    frenchToast: link(
      "cinnamon-roll-french-toast",
      "Cinnamon Roll French Toast",
    ),
    oats: link("overnight-oats", "Overnight Oats"),
    hotChocolate: link("hot-chocolate-oatmeal", "Hot Chocolate Oatmeal"),
    granola: link("homemade-granola-bars", "Homemade Granola Bars"),
    muffins: link(
      "breakfast-egg-and-cheese-muffins",
      "Breakfast Egg and Cheese Muffins",
    ),
    quiche: link("spinach-and-cheese-quiche", "Spinach and Cheese Quiche"),
    bakedEggs: link("baked-eggs-and-tomatoes", "Baked Eggs and Tomatoes"),
    shakshouka: link("shakshouka", "Shakshouka"),
    chickenSausage: link(
      "chicken-breakfast-sausage",
      "Chicken Breakfast Sausage",
    ),
    turkeySausage: link(
      "turkey-breakfast-sausage",
      "Turkey Breakfast Sausage",
    ),
    zucchini: link("zucchini-bread", "Zucchini Bread"),
    bananaBread: link(
      "chocolate-chip-banana-bread",
      "Chocolate Chip Banana Bread",
    ),
    strawberry: link("strawberry-bread", "Strawberry Bread"),
    cookies: link("breakfast-cookies", "Breakfast Cookies"),
  };

  const contentHtml = `
<p>Morning feels kinder when breakfast is already decided. A stack of pancakes, a jar of overnight oats, warm banana bread, or a simple egg bake can start the day with calm. This guide gathers Grandma Recipe’s best <strong>breakfast recipes</strong>—pancakes and waffles, make-ahead oats, egg breakfasts, and sweet breads—so you can pick a path and cook with confidence.</p>

<p>Use this page as your starting point. Each section links to tested recipes with clear steps and that cozy, from-scratch flavor we love around the morning table.</p>

<h2 id="how-to-use-this-guide">How to Use This Breakfast Recipes Guide</h2>
<ul>
<li><strong>Weekend slow morning?</strong> Pancakes, waffles, or French toast.</li>
<li><strong>Busy weekday?</strong> Overnight oats, granola bars, or breakfast cookies.</li>
<li><strong>Want something savory?</strong> Egg muffins, quiche, shakshouka, or breakfast sausage.</li>
<li><strong>Need a bake-ahead treat?</strong> Banana bread, zucchini bread, or strawberry bread.</li>
</ul>

<h2 id="pancakes-and-waffles">Pancakes and Waffles</h2>
<p>Pancakes and waffles are the heart of a leisurely breakfast—warm, soft, and ready for butter and syrup.</p>
<ul>
<li>${L.bananaPancakes} — banana pancakes for a sweet start.</li>
<li>${L.sheetPan} — sheet pan pancakes for feeding a crowd.</li>
<li>${L.ovenPancake} — oven-baked pancake with berries.</li>
<li>${L.gingerbread} — gingerbread pancakes for colder mornings.</li>
<li>${L.blueberry} and ${L.wheat} — waffle mornings, classic or whole wheat.</li>
<li>${L.frenchToast} — cinnamon roll French toast.</li>
</ul>

<h2 id="make-ahead-breakfast">Make-Ahead Breakfast</h2>
<p>Make-ahead breakfast recipes keep busy mornings gentle.</p>
<ul>
<li>${L.oats} — overnight oats ready when you wake.</li>
<li>${L.hotChocolate} — hot chocolate oatmeal for a cozy bowl.</li>
<li>${L.granola} — homemade granola bars for grab-and-go.</li>
<li>${L.cookies} — breakfast cookies for snacky mornings.</li>
</ul>

<h2 id="egg-breakfasts">Egg Breakfasts</h2>
<p>Eggs make a savory breakfast plate feel complete.</p>
<ul>
<li>${L.muffins} — egg and cheese muffins.</li>
<li>${L.quiche} — spinach and cheese quiche.</li>
<li>${L.bakedEggs} — baked eggs and tomatoes.</li>
<li>${L.shakshouka} — eggs simmered in a tomato sauce.</li>
<li>${L.chickenSausage} and ${L.turkeySausage} — homemade breakfast sausage patties.</li>
</ul>

<h2 id="breakfast-breads">Breakfast Breads</h2>
<p>Sweet breads are lovely with coffee and even better the next day.</p>
<ul>
<li>${L.bananaBread} — chocolate chip banana bread.</li>
<li>${L.zucchini} — moist zucchini bread.</li>
<li>${L.strawberry} — strawberry bread for a bright bake.</li>
</ul>

<h2 id="final-thoughts">Final Thoughts</h2>
<p>Good <strong>breakfast recipes</strong> make the morning feel cared for—whether that is a weekend pancake stack or a jar of oats waiting in the fridge. Bookmark this guide, pick a cluster, and cook one morning favorite at a time.</p>
<p>Explore more easy <a href="/category/breakfast/"><strong>breakfast</strong></a> recipes, quick <a href="/category/lunch/"><strong>lunch</strong></a> ideas, cozy <a href="/category/dinner/"><strong>dinner</strong></a> meals, tasty <a href="/category/snacks/"><strong>snacks</strong></a>, and delightful <a href="/category/dessert/"><strong>dessert</strong></a>.</p>
`.trim();

  return {
    slug: "easy-breakfast-recipes",
    title: "Easy Breakfast Recipes",
    focusKeyword: "breakfast recipes",
    excerpt:
      "Find easy breakfast recipes for busy mornings and slow weekends—pancakes, waffles, overnight oats, egg breakfasts, and homemade breads, all gathered in one cozy guide.",
    seoTitle: "Easy Breakfast Recipes for Mornings at Home",
    seoDescription:
      "Browse easy breakfast recipes by style: pancakes and waffles, make-ahead oats, egg breakfasts, and sweet breads. A Grandma Recipe guide for family mornings.",
    cuisine: "American",
    course: "Breakfast guide",
    category: "breakfast",
    featureBasename: "easy-breakfast-recipes-feature",
    featureMeta: {
      alt: "Easy breakfast recipes featuring banana pancakes, overnight oats, and warm banana bread",
      title: "Easy Breakfast Recipes Homestyle Morning Spread",
      caption:
        "A welcoming breakfast table: pancakes, oats, eggs, and homemade bread.",
      description:
        "Feature image for the easy breakfast recipes guide showing a home-style morning table.",
    },
    contentHtml,
    sectionPhotos: [
      {
        headingId: "pancakes-and-waffles",
        src: "/wp-content/uploads/2026/09/Homemade-Banana-Pancakes-With-Maple-Syrup.webp",
        alt: "Homemade banana pancakes with maple syrup",
        caption: "Pancakes, waffles, and French toast for slow mornings.",
      },
      {
        headingId: "make-ahead-breakfast",
        src: "/wp-content/uploads/2025/08/Delicious-Overnight-Oats-Ready-to-Enjoy.webp",
        alt: "Overnight oats with fresh fruit",
        caption: "Make-ahead breakfasts for gentler weekdays.",
      },
      {
        headingId: "egg-breakfasts",
        src: "/wp-content/uploads/2025/12/Delicious-Spinach-and-Cheese-Quiche.webp",
        alt: "Spinach and cheese quiche slice",
        caption: "Egg breakfasts: muffins, quiche, baked eggs, and sausage.",
      },
      {
        headingId: "breakfast-breads",
        src: "/wp-content/uploads/2025/06/Delicious-Chocolate-Chip-Banana-Bread-1.webp",
        alt: "Chocolate chip banana bread loaf",
        caption: "Breakfast breads for coffee and next-day slices.",
      },
    ],
  };
}

async function createPillar(
  client: ConvexHttpClient,
  secret: string,
  pillar: Pillar,
) {
  const featureLocal = findFeature(pillar.featureBasename);
  const processed = await convertRecipeImageToWebp(
    fs.readFileSync(featureLocal),
    pillar.featureMeta.title,
    "feature",
    {
      caption: pillar.featureMeta.caption,
      description: pillar.featureMeta.description,
    },
  );
  const basename = buildRecipeImageBasename({
    metadata: pillar.featureMeta,
    focusKeyword: pillar.focusKeyword,
    slug: pillar.slug,
  });
  const r2Key = buildRecipeImageR2Key(basename);
  await putR2Object(r2Key, processed.buffer, "image/webp", {
    "alt-text": pillar.featureMeta.alt,
    title: pillar.featureMeta.title,
    caption: pillar.featureMeta.caption,
    description: pillar.featureMeta.description,
    "focus-keyword": pillar.focusKeyword,
    section: "feature",
  });
  const featurePath = r2KeyToPublicPath(r2Key);
  console.log(`Uploaded ${pillar.slug} feature → ${featurePath}`);

  let contentHtml = pillar.contentHtml;
  for (const photo of pillar.sectionPhotos) {
    contentHtml = insertAfterHeading(
      contentHtml,
      photo.headingId,
      figureHtml(photo),
    );
  }

  const now = new Date().toISOString();
  const result = await client.mutation(api.articles.syncArticleFull, {
    secret,
    article: {
      slug: pillar.slug,
      title: pillar.title,
      excerpt: pillar.excerpt,
      category: pillar.category,
      categories: [pillar.category],
      contentHtml,
      ingredients: [],
      instructions: [],
      featuredImage: featurePath,
      featuredImageAlt: pillar.featureMeta.alt,
      featuredImageCaption: pillar.featureMeta.caption,
      featuredImageDescription: pillar.featureMeta.description,
      seoTitle: pillar.seoTitle,
      seoDescription: pillar.seoDescription,
      focusKeyword: pillar.focusKeyword,
      cuisine: pillar.cuisine,
      course: pillar.course,
      status: "draft",
      publishedAt: now,
      modifiedAt: now,
      imageAssets: {
        feature: {
          publicPath: featurePath,
          r2Key,
          alt: pillar.featureMeta.alt,
          title: pillar.featureMeta.title,
          caption: pillar.featureMeta.caption,
          description: pillar.featureMeta.description,
          uploadedAt: now,
          width: processed.width,
          height: processed.height,
        },
      },
    },
  });

  return {
    ...result,
    wordCount: wordCount(contentHtml),
    admin: `http://localhost:3000/admin/articles/${result.id}/`,
  };
}

async function main() {
  loadEnvLocal();
  const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const secret = process.env.CMS_IMPORT_SECRET!;
  if (!secret) throw new Error("CMS_IMPORT_SECRET missing");

  const pillars = [dessertPillar(), weeknightPillar(), breakfastPillar()];
  const results = [];
  for (const pillar of pillars) {
    results.push(await createPillar(client, secret, pillar));
  }
  console.log(JSON.stringify(results, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
