/**
 * Create the Easy Chicken Recipes pillar guide on DEV as a draft.
 * Usage: npx tsx scripts/create-chicken-recipes-pillar.ts
 */
import fs from "fs";
import path from "path";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
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

function link(slug: string, label: string) {
  return `<a href="/${slug}/"><strong>${label}</strong></a>`;
}

function buildContentHtml() {
  const L = {
    roast: link("how-to-roast-a-chicken", "How to Roast a Chicken"),
    breast: link("juicy-baked-chicken-breast", "Juicy Baked Chicken Breast"),
    meatballs: link(
      "ground-chicken-recipes-cozy-skillet-chicken-meatballs",
      "Skillet Chicken Meatballs",
    ),
    onePan: link(
      "one-pan-roasted-chicken-and-vegetables",
      "One Pan Roasted Chicken",
    ),
    broccoli: link(
      "chicken-broccoli-rice-casserole",
      "Chicken Broccoli Rice Casserole",
    ),
    doritos: link("doritos-chicken-casserole", "Doritos Chicken Casserole"),
    ritz: link(
      "ritz-cracker-chicken-casserole",
      "Ritz Cracker Chicken Casserole",
    ),
    marry: link("marry-me-chicken-pasta", "Marry Me Chicken Pasta"),
    tuscan: link("tuscan-chicken-pasta", "Tuscan Chicken Pasta"),
    crackPenne: link("crack-chicken-penne", "Crack Chicken Penne"),
    crockAlfredo: link(
      "crockpot-chicken-alfredo-pasta",
      "Crockpot Chicken Alfredo Pasta",
    ),
    chickenRice: link(
      "slow-cooker-chicken-and-rice",
      "Slow Cooker Chicken and Rice",
    ),
    stroganoff: link(
      "slow-cooker-chicken-stroganoff",
      "Slow Cooker Chicken Stroganoff",
    ),
    chili: link("white-chicken-chili-crockpot", "White Chicken Chili Crockpot"),
    buffalo: link("buffalo-chicken-wings", "Crispy Buffalo Chicken Wings"),
    honeyGarlic: link("honey-garlic-wings", "Crispy Honey Garlic Wings"),
    airFryer: link(
      "air-fryer-parmesan-crusted-chicken",
      "Air Fryer Parmesan Crusted Chicken",
    ),
    dumplings: link("chicken-and-dumplings", "Homemade Chicken and Dumplings"),
    potPieSoup: link("chicken-pot-pie-soup", "Chicken Pot Pie Soup"),
    smothered: link("smothered-chicken", "Smothered Chicken"),
    frenchOnion: link("french-onion-chicken", "French Onion Chicken"),
    hawaiian: link(
      "hawaiian-chicken-sheet-pan",
      "Hawaiian Chicken Sheet Pan Dinner",
    ),
    shawarma: link("chicken-shawarma-wrap", "Chicken Shawarma Wrap"),
    nashville: link("nashville-hot-chicken", "Nashville Hot Chicken"),
    thighs: link("chicken-thighs", "Chicken Thighs"),
    bonelessThighs: link(
      "boneless-chicken-thighs",
      "Oven-Baked Boneless Chicken Thighs",
    ),
    ketoParm: link("keto-chicken-parmesan", "Keto Chicken Parmesan"),
    ziti: link("chicken-baked-ziti", "Chicken Baked Ziti"),
    cajun: link(
      "cajun-chicken-and-sausage-pasta",
      "Cajun Chicken and Sausage Pasta",
    ),
    monterey: link("monterey-chicken", "Monterey Chicken"),
    sliders: link("crack-chicken-sliders", "Crack Chicken Sliders"),
    handPies: link("chicken-pot-pie-hand-pies", "Chicken Pot Pie Hand Pies"),
    lemonOrzo: link("lemon-chicken-orzo", "Lemon Chicken Orzo"),
    ramen: link(
      "best-homemade-chicken-ramen-recipe",
      "Homemade Chicken Ramen",
    ),
    tenders: link("chicken-tenders", "Homemade Chicken Tenders"),
    strips: link("breaded-chicken-strips", "Breaded Chicken Strips"),
    aloha: link("aloha-chicken", "Easy Aloha Chicken"),
    peri: link("peri-peri-chicken", "Peri Peri Chicken"),
  };

  return `
<p>When you need supper that feels like home, <strong>chicken recipes</strong> are the first place most of us look. A good chicken dinner can be as simple as a weeknight sheet pan or as special as a golden Sunday roast. This guide gathers Grandma Recipe’s best easy chicken recipes by cooking style—baked and roasted, skillet and ground chicken, pasta nights, cozy casseroles, wings, and slow cooker meals—so you can pick a path and cook with confidence.</p>

<p>Use this page as your starting point. Each section below points to tested recipes with clear steps, familiar ingredients, and that comforting, from-scratch flavor we love around the family table.</p>

<h2 id="how-to-use-this-guide">How to Use This Chicken Recipes Guide</h2>
<p>Start with the cut you have, then choose the method that matches your evening:</p>
<ul>
<li><strong>Short on time?</strong> Try baked chicken breast, air fryer chicken, or a sheet-pan supper.</li>
<li><strong>Want something cozy?</strong> Open a casserole, pot pie soup, dumplings, or a crockpot chicken dinner.</li>
<li><strong>Feeding a pasta crowd?</strong> Jump to the chicken pasta cluster for creamy, skillet, and baked noodles.</li>
<li><strong>Cooking for game night?</strong> Wings, tenders, and hot chicken belong on that table.</li>
</ul>
<p>If you are new to roasting a whole bird, begin with ${L.roast}. For a reliable boneless dinner, start with ${L.breast}.</p>

<h2 id="choose-your-chicken-cut">Choose Your Chicken Cut</h2>
<p>Matching the cut to the recipe is half the battle.</p>
<ul>
<li><strong>Boneless chicken breast</strong> cooks quickly and stays mild. Best for baking, slicing over rice, and creamy skillet sauces. See ${L.breast}.</li>
<li><strong>Chicken thighs</strong> stay juicy and forgiving. Bone-in or boneless both shine in the oven—try ${L.thighs} and ${L.bonelessThighs}.</li>
<li><strong>Whole chicken</strong> is Sunday supper in one pan. Learn the method in ${L.roast}, or keep it easy with ${L.onePan}.</li>
<li><strong>Ground chicken</strong> makes tender meatballs, skillet meals, and lighter comfort food. Start with ${L.meatballs}.</li>
<li><strong>Wings and tenders</strong> bring crispy edges and big flavor—${L.buffalo}, ${L.honeyGarlic}, ${L.tenders}, and ${L.strips}.</li>
</ul>

<h2 id="chicken-cooking-basics">Chicken Cooking Basics</h2>
<p>A few kitchen habits keep chicken recipes juicy instead of dry:</p>
<ul>
<li><strong>Pat the meat dry</strong> before seasoning so you get better browning.</li>
<li><strong>Season under and over the skin</strong> on bone-in pieces for flavor that reaches the meat.</li>
<li><strong>Cook to a safe internal temperature</strong> of 165°F in the thickest part. An instant-read thermometer takes the guesswork away.</li>
<li><strong>Rest briefly</strong> after cooking so the juices settle before you slice.</li>
<li><strong>Use the pan juices</strong>—a spoonful over the meat tastes like home.</li>
</ul>
<p>For oven nights, baked chicken and roasted chicken are your friends. For hands-off evenings, slow cooker chicken and rice or white chicken chili can simmer while you set the table.</p>

<h2 id="baked-and-roasted-chicken">Baked and Roasted Chicken Recipes</h2>
<p>Oven chicken recipes are the backbone of an easy weeknight or a quiet Sunday. High heat for color, steady heat for tenderness, and simple seasoning are all you need.</p>
<ul>
<li>${L.roast} — crisp skin, tender meat, and savory pan juices.</li>
<li>${L.breast} — a dependable boneless dinner with garlic and herbs.</li>
<li>${L.bonelessThighs} — juicy oven thighs with less fuss than a whole bird.</li>
<li>${L.onePan} — chicken and vegetables share one roasting pan.</li>
<li>${L.hawaiian} — a bright sheet-pan dinner with sweet-savory flavor.</li>
<li>${L.monterey} and ${L.smothered} — saucy baked chicken for when you want comfort on a plate.</li>
<li>${L.frenchOnion} and ${L.aloha} — weeknight favorites with big flavor from pantry ingredients.</li>
<li>${L.peri} — a bolder roast-style chicken when the table wants a little heat.</li>
</ul>
<p>These baked chicken recipes pair beautifully with rice, mashed potatoes, green beans, or a simple salad. If you are building a meal around leftovers, slice roast chicken into wraps, soups, or next-day pasta.</p>

<h2 id="ground-chicken-recipes">Ground Chicken Recipes</h2>
<p>Ground chicken is lighter than beef but still hearty when you season it well and keep the mixture moist. It shines in skillet dinners, meatballs, and family-friendly pasta nights.</p>
<ul>
<li>${L.meatballs} — cozy skillet meatballs in tomato sauce over noodles.</li>
<li>${L.sliders} — party-ready chicken sliders for busy evenings.</li>
</ul>
<p>Tips for ground chicken recipes: do not overwork the meat, add a binder like breadcrumbs or egg when shaping, and brown in a hot skillet before simmering in sauce so you keep savory flavor.</p>

<h2 id="chicken-pasta-recipes">Chicken Pasta Recipes</h2>
<p>Chicken and pasta belong together on busy nights. Creamy sauces, baked casseroles, and skillet noodles all earn a place in this cluster.</p>
<ul>
<li>${L.marry} — creamy, sun-dried tomato comfort in one skillet.</li>
<li>${L.tuscan} — garlic, greens, and tender chicken with pasta.</li>
<li>${L.crackPenne} — rich, cheesy penne the whole table finishes.</li>
<li>${L.crockAlfredo} — hands-off Alfredo for crockpot evenings.</li>
<li>${L.ziti} — baked ziti with chicken for potluck-style dinners.</li>
<li>${L.cajun} — spicy sausage-and-chicken pasta with Cajun warmth.</li>
<li>${L.lemonOrzo} — bright lemon chicken with tender orzo.</li>
<li>${L.ketoParm} — a lighter chicken Parmesan-style plate when you want fewer carbs.</li>
</ul>
<p>Serve chicken pasta recipes with garlic bread and a crisp salad. Leftovers reheat gently with a splash of broth or milk to loosen the sauce.</p>

<h2 id="chicken-casserole-recipes">Chicken Casserole Recipes</h2>
<p>Casseroles are Grandma’s answer to “what’s for dinner” when the oven can do the work. Creamy sauces, rice or crackers, and a golden top make these chicken recipes feel like a hug.</p>
<ul>
<li>${L.broccoli} — classic chicken, broccoli, and rice in one dish.</li>
<li>${L.ritz} — buttery cracker topping over tender chicken.</li>
<li>${L.doritos} — a fun, crunchy family casserole night.</li>
<li>${L.handPies} — chicken pot pie flavor in hand-held pies.</li>
</ul>
<p>Make-ahead tip: assemble most chicken casseroles earlier in the day, refrigerate, then bake until bubbling and golden before supper.</p>

<h2 id="wings-and-crispy-chicken">Wings and Crispy Chicken</h2>
<p>When you want crunch and sauce, this cluster is the place. Oven and air fryer methods keep things simpler than deep frying while still delivering that satisfying bite.</p>
<ul>
<li>${L.buffalo} — classic tangy heat.</li>
<li>${L.honeyGarlic} — sticky-sweet wings with garlic.</li>
<li>${L.nashville} — fiery hot chicken for spice lovers.</li>
<li>${L.airFryer} — crisp Parmesan crust without heating the whole kitchen.</li>
<li>${L.tenders} and ${L.strips} — kid-friendly crispy chicken for dipping.</li>
</ul>
<p>Set out ranch or blue cheese, celery, and a simple slaw. Crispy chicken recipes also tuck into sandwiches and wraps the next day.</p>

<h2 id="crockpot-and-slow-cooker-chicken">Crockpot and Slow Cooker Chicken</h2>
<p>Slow cooker chicken recipes turn tough evenings into gentle ones. Add the ingredients in the morning, and come home to a kitchen that smells like supper already started.</p>
<ul>
<li>${L.chickenRice} — tender chicken and rice in one pot.</li>
<li>${L.stroganoff} — creamy slow cooker comfort.</li>
<li>${L.chili} — white chicken chili for chilly nights.</li>
<li>${L.crockAlfredo} — pasta night without standing at the stove.</li>
<li>${L.dumplings} — homemade chicken and dumplings when you want a bowl of comfort.</li>
<li>${L.potPieSoup} — pot pie flavor in a spoonable soup.</li>
</ul>
<p>For best texture, keep chicken pieces similar in size, and shred or slice only after the meat is fully cooked and tender.</p>

<h2 id="sheet-pan-skillet-and-wraps">Sheet Pan, Skillet, and Wrap Night</h2>
<p>Not every chicken dinner needs a long bake. Sheet pans, skillets, and wraps keep prep light and cleanup kinder.</p>
<ul>
<li>${L.hawaiian} — colorful sheet-pan supper.</li>
<li>${L.onePan} — roast chicken and vegetables together.</li>
<li>${L.meatballs} — skillet meatballs for pasta night.</li>
<li>${L.shawarma} — wrap-ready chicken with bold seasoning.</li>
<li>${L.ramen} — a cozy bowl when noodles sound better than rice.</li>
</ul>

<h2 id="what-to-serve-with-chicken">What to Serve with Chicken</h2>
<p>Round out chicken recipes with sides that feel familiar:</p>
<ul>
<li>Fluffy rice, mashed potatoes, or buttered noodles</li>
<li>Green beans, roasted carrots, or a simple garden salad</li>
<li>Warm bread, rolls, or garlic toast for saucy plates</li>
<li>A light dessert if Sunday supper needs a sweet finish</li>
</ul>
<p>For rice sides that never fail, you can also explore our rice guides—chicken and rice is a classic pairing for a reason.</p>

<h2 id="make-ahead-storage-and-leftovers">Make Ahead, Storage, and Leftovers</h2>
<ul>
<li><strong>Refrigerate</strong> cooked chicken within 2 hours in shallow containers. Use within 3 to 4 days.</li>
<li><strong>Freeze</strong> cooled portions in airtight containers for up to 2 to 3 months.</li>
<li><strong>Reheat</strong> until steaming hot. Add a splash of broth to sliced breast meat so it stays moist.</li>
<li><strong>Leftover ideas:</strong> chicken salad, quesadillas, soup starters, pasta tosses, and grain bowls.</li>
</ul>

<h2 id="faqs">FAQs About Chicken Recipes</h2>
<h3>How do I keep baked chicken breast from drying out?</h3>
<p>Do not overbake, season well, and rest a few minutes before slicing. Our ${L.breast} walks through a juicy oven method step by step.</p>
<h3>Is dark meat better for beginners?</h3>
<p>Often yes. Thighs stay moist even if they cook a little longer, which makes ${L.bonelessThighs} a forgiving place to start.</p>
<h3>Can I swap chicken thighs for breasts?</h3>
<p>Yes in many skillet and casserole recipes. Expect a slightly richer flavor and adjust cook time so the thickest piece reaches 165°F.</p>
<h3>What is the safest internal temperature for chicken?</h3>
<p>Cook chicken to 165°F in the thickest part. For a whole roast, check the thigh without touching the bone—see ${L.roast}.</p>
<h3>Which chicken recipe should I make first?</h3>
<p>If you want a classic Sunday feeling, make ${L.roast}. For a weeknight, choose ${L.breast}, ${L.hawaiian}, or ${L.marry}.</p>

<h2 id="final-thoughts">Final Thoughts</h2>
<p>Good <strong>chicken recipes</strong> do not need complicated tricks—just the right cut, honest seasoning, and a method that fits your night. Bookmark this guide, pick a cluster, and cook one recipe at a time. Before long you will have a little rotation of family favorites ready for weeknights and Sundays alike.</p>
<p>Explore more easy <a href="/category/breakfast/"><strong>breakfast</strong></a> recipes, quick <a href="/category/lunch/"><strong>lunch</strong></a> ideas, cozy <a href="/category/dinner/"><strong>dinner</strong></a> meals, tasty <a href="/category/snacks/"><strong>snacks</strong></a>, and delightful <a href="/category/dessert/"><strong>dessert</strong></a>.</p>
`.trim();
}

async function main() {
  loadEnvLocal();
  const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const secret = process.env.CMS_IMPORT_SECRET!;
  if (!secret) throw new Error("CMS_IMPORT_SECRET missing");

  const now = new Date().toISOString();
  const contentHtml = buildContentHtml();
  const wordCount = contentHtml
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean).length;

  const article = {
    slug: "easy-chicken-recipes",
    title: "Easy Chicken Recipes",
    excerpt:
      "Find easy chicken recipes for weeknights and Sunday supper—baked chicken, ground chicken, pasta, casseroles, wings, and slow cooker dinners, all gathered in one cozy guide.",
    category: "dinner" as const,
    categories: ["dinner"] as ("dinner")[],
    contentHtml,
    ingredients: [] as string[],
    instructions: [] as string[],
    seoTitle: "Easy Chicken Recipes for Weeknights and Sunday Supper",
    seoDescription:
      "Browse easy chicken recipes by style: baked and roasted, ground chicken, pasta, casseroles, wings, and crockpot dinners. A Grandma Recipe guide for family meals.",
    focusKeyword: "chicken recipes",
    cuisine: "American",
    course: "Dinner guide",
    status: "draft" as const,
    publishedAt: now,
    modifiedAt: now,
  };

  const result = await client.mutation(api.articles.syncArticleFull, {
    secret,
    article,
  });

  console.log(
    JSON.stringify(
      {
        ...result,
        wordCount,
        admin: `http://localhost:3000/admin/articles/${result.id}/`,
        note: "Draft on DEV only. Add featured image via Complete article when ready.",
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
