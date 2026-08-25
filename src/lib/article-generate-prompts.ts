import type { GenerateArticleInput } from "./article-generate-types";

const HOUSE_RULES = `
House rules for Grandma Recipe:
- Warm, conversational, nostalgic "grandma kitchen" voice.
- Never use pork, bacon, wine, or any alcoholic ingredients; use substitutes.
- Do not invent unsafe cooking advice.
- Keep language family-friendly.
- NEVER use the em dash character "—" (or en dash "–"). Use a hyphen "-" or a comma "," instead.
`.trim();

/** Replace em/en dashes with hyphen so generated copy never ships "—". */
export function stripEmDashes(text: string): string {
  return text
    .replace(/\u2014/g, "-") // —
    .replace(/\u2013/g, "-") // –
    .replace(/--+/g, "-");
}

export function buildRecipeDataPrompt(input: GenerateArticleInput): string {
  if (input.mode === "paste" && input.pastedDraft?.trim()) {
    return `${HOUSE_RULES}

Parse this recipe draft into structured JSON for our CMS.
Primary keyword hint: ${input.primaryKeyword || "(detect from draft)"}
${input.category ? `Preferred category hint: ${input.category}` : "Detect the best category yourself."}

If the draft includes nutrition or calories per serving, extract them into the nutrition array. Otherwise estimate reasonable per-serving values from the ingredients.
If the draft mentions tools, pans, or appliances, extract them into the equipment array. Otherwise infer typical home-kitchen equipment for this recipe.
Put the draft's warm opening story into "excerpt" (hero intro under the title). Do not leave that opening only in the body.

Choose exactly one category from: breakfast, lunch, dinner, snacks, dessert.

DRAFT:
${input.pastedDraft}

Return ONLY valid JSON (no markdown fences) with this shape:
{
  "focusKeyword": "string",
  "category": "breakfast|lunch|dinner|snacks|dessert",
  "title": "string",
  "excerpt": "warm hero intro: 2–4 sentences of nostalgic storytelling (about 200–450 chars). This is the top intro under the title — NOT a short tagline.",
  "ingredients": ["one ingredient per item, include amounts"],
  "instructions": ["one clear step per item — each step is a single cooking action, not a paragraph"],
  "prepTime": "e.g. 15 minutes",
  "cookTime": "e.g. 30 minutes",
  "totalTime": "e.g. 45 minutes",
  "servings": "e.g. 4",
  "calories": "optional — prefer nutrition[].Calories amount",
  "cuisine": "optional",
  "course": "optional",
  "nutrition": [
    {"nutrient": "Calories", "amount": "e.g. 350"},
    {"nutrient": "Fat", "amount": "e.g. 20g"},
    {"nutrient": "Protein", "amount": "e.g. 30g"},
    {"nutrient": "Carbs", "amount": "e.g. 0g"}
  ],
  "equipment": [
    {"name": "e.g. 9x5 inch loaf pan", "notes": "optional short note"},
    {"name": "e.g. mixing bowls", "notes": "optional"}
  ]
}`;
  }

  const recipePaste = (
    input.recipePaste?.trim() ||
    [input.ingredientsText?.trim(), input.instructionsText?.trim()]
      .filter(Boolean)
      .join("\n\n")
  ).trim();

  const hasRecipe = input.mode === "keyword_recipe" && Boolean(recipePaste);

  return `${HOUSE_RULES}

Create structured recipe data for Grandma Recipe.
Focus keyword / recipe name: ${input.primaryKeyword}
${input.category ? `Category hint (optional): ${input.category}` : "Detect the best category yourself from the keyword/recipe."}
Extra notes: ${input.notes?.trim() || "none"}

Choose exactly one category from: breakfast, lunch, dinner, snacks, dessert
(e.g. pies/cakes/cookies → dessert; pancakes/eggs → breakfast; sandwiches/salads → lunch; mains/casseroles → dinner; chips/dips/appetizers → snacks).

${
  hasRecipe
    ? `The cook pasted a rough recipe (may include emojis, titles, "Ingredients" headings, affiliate phrases like "try our X recipe", missing steps, or mixed formatting).

Your job:
1. Extract and clean the ingredient list (one item per line, keep amounts; drop emojis and "try our … recipe" marketing phrases — keep the ingredient itself).
2. If instructions/steps are missing or incomplete, WRITE clear homemade cooking steps that match those ingredients (8–12 steps, one action per step).
3. If instructions ARE present, clean/reorder them — do not invent a different recipe.
4. Infer a sensible title from the paste + focus keyword when needed.
5. Set the category field based on the dish.

PASTED RECIPE:
${recipePaste}`
    : `Only a primary keyword was provided. Generate realistic ingredients and 8–12 clear, separate cooking steps (one action per step — e.g. "Preheat the oven to 350°F", not a paragraph) for a homemade ${input.primaryKeyword} recipe. Also estimate per-serving nutrition (Calories, Fat, Protein, Carbs) and list typical home-kitchen equipment (3–6 items). Set category from the dish type.`
}

Include a nutrition array with estimated per-serving values (required): Calories, Fat, Protein, and Carbs. Numbers are estimates for home cooking — round to sensible values.
Include an equipment array (required, 3–6 items): common tools a home cook would use — baking dishes, skillets, mixing bowls, thermometers, etc. Add a short optional notes string when helpful (size, material, or why it's used).

The excerpt is the hero intro shown under the title (before the recipe card). Write it like our live articles: warm, nostalgic storytelling that hooks the reader — not a one-line summary.

Return ONLY valid JSON (no markdown fences) with this shape:
{
  "focusKeyword": "string",
  "category": "breakfast|lunch|dinner|snacks|dessert",
  "title": "string",
  "excerpt": "warm hero intro: 2–4 sentences of nostalgic storytelling (about 200–450 chars). This is the top intro under the title — NOT a short tagline.",
  "ingredients": ["one ingredient per item, include amounts"],
  "instructions": ["one clear step per item — each step is a single cooking action, not a paragraph"],
  "prepTime": "e.g. 15 minutes",
  "cookTime": "e.g. 30 minutes",
  "totalTime": "e.g. 45 minutes",
  "servings": "e.g. 4",
  "calories": "optional — prefer nutrition[].Calories amount",
  "cuisine": "optional",
  "course": "optional",
  "nutrition": [
    {"nutrient": "Calories", "amount": "e.g. 350"},
    {"nutrient": "Fat", "amount": "e.g. 20g"},
    {"nutrient": "Protein", "amount": "e.g. 30g"},
    {"nutrient": "Carbs", "amount": "e.g. 0g"}
  ],
  "equipment": [
    {"name": "e.g. 9x5 inch loaf pan", "notes": "optional short note"},
    {"name": "e.g. mixing bowls", "notes": "optional"}
  ]
}`;
}

export function buildArticleBodyPrompt(args: {
  focusKeyword: string;
  title: string;
  category: string;
  excerpt: string;
  ingredients: string[];
  instructions: string[];
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  servings?: string;
  cuisine?: string;
  course?: string;
}): string {
  const stepCount = args.instructions.length;
  const recipeName = args.focusKeyword;

  return `${HOUSE_RULES}

Write a full recipe article body in HTML for Grandma Recipe.
Match the structure and tone of our live articles (e.g. smoked sirloin steak): clear <h2> sections, bold ingredient names, numbered Step headings, Recipe Snapshot table.

IMPORTANT layout rule:
- The warm opening story already lives in the hero as the excerpt (under the title, BEFORE the recipe card).
- contentHtml appears AFTER the recipe card Notes section.
- contentHtml MUST start with <h2>Why You'll Love This …</h2> - do NOT put opening story paragraphs before that heading.

Focus keyword: ${args.focusKeyword}
SEO/title: ${args.title}
Category: ${args.category}
Course: ${args.course || args.category}
Cuisine: ${args.cuisine || "American"}
Hero excerpt (already shown at top — do not repeat): ${args.excerpt}
Prep: ${args.prepTime || "n/a"} | Cook: ${args.cookTime || "n/a"} | Total: ${args.totalTime || "n/a"} | Serves: ${args.servings || "n/a"}

Ingredients (source of truth for the Ingredients section list):
${args.ingredients.map((item) => `- ${item}`).join("\n")}

Instructions (source of truth — one Step block each):
${args.instructions.map((step, i) => `${i + 1}. ${step}`).join("\n")}

HTML rules:
- Use only these tags: p, h2, h3, ul, ol, li, strong, em, a, table, thead, tbody, tr, th, td, br. No markdown. No <img> or <figure> (images are added manually later).
- Every major section starts with <h2> (TOC is built from these).
- First element must be the Why You'll Love <h2>.

Ingredients section (required — match live articles):
1) <h2 id="ingredients">Ingredients</h2>
2) One short inviting <p> overview.
3) Then a <ul> with one <li> per ingredient from the list above.
   Format each item exactly like: <li><strong>Ingredient name</strong> – amount and notes</li>
   (bold the food name, then an en dash –, then the amount). Use the provided ingredients; split name vs amount sensibly.

How to Make section (required — match live articles):
1) <h2 id="how-to-make-...">How to Make ${recipeName}</h2> (Title Case the dish name)
2) One warm intro <p> that mentions prep time, cook time, and any resting/extra time.
3) Exactly ${stepCount} steps — one per instruction — each:
   <h3><strong>Step N: Short action title</strong></h3>
   <p>1–3 sentences expanding that step. Do not merge multiple steps.</p>
   Step titles short (e.g. "Preheat the Smoker", "Season the Steaks").

Recipe Snapshot section (required — match live articles):
1) <h2 id="recipe-snapshot">Recipe Snapshot</h2>
2) A simple HTML <table> with header row Feature | Details, then rows for:
   Category/Course, Cuisine, Prep Time, Cook Time, Extra Time (if any, else 0 or omit), Total Time, Dietary (sensible label), Serves, Best Served (one short friendly line).
   Use the times/servings/course/cuisine provided above.

Make Ahead and Storage:
- <h2>Make Ahead and Storage</h2>
- Then <h3>Storing Leftovers</h3>, <h3>Freezing</h3>, <h3>Reheating</h3> each with a <ul> of practical tips.
- Immediately AFTER the Reheating subsection, add this exact closing paragraph (with category links):
  <p>Explore more easy <a href="/category/breakfast/"><strong>breakfast</strong></a> recipes, quick <a href="/category/lunch/"><strong>lunch</strong></a> ideas, cozy <a href="/category/dinner/"><strong>dinner</strong></a> meals, tasty <a href="/category/snacks/"><strong>snacks</strong></a>, and delightful <a href="/category/dessert/"><strong>dessert</strong></a>.</p>

FAQs:
- <h2 id="faqs">FAQs</h2>, brief intro <p>, then 4 items as <h3>question</h3><p>answer</p>.

Section order (all required, in this order):
1. <h2>Why You'll Love This ${recipeName}</h2> + <ul> with 4–5 <li> items.
2. Ingredients section (h2 + overview <p> + bolded <ul> list) as specified above.
3. How to Make section (h2 + intro <p> + ${stepCount} Step h3/p blocks) as specified above.
4. Recipe Snapshot (h2 + table) as specified above.
5. <h2>Pro Tips for Making ${recipeName}</h2> + <ul> 3–5 tips.
6. <h2>How to Serve this ${recipeName}</h2> + <ul> serving ideas.
7. Make Ahead and Storage with the three h3 subsections, then the Explore more category paragraph after Reheating.
8. <h2>Final Thoughts</h2> + 1 short closing <p>.
9. <h2 id="faqs">FAQs</h2> + 4 FAQ h3/p pairs.

Return ONLY valid JSON (no markdown fences):
{
  "seoTitle": "50-60 chars, include focus keyword naturally",
  "seoDescription": "140-160 chars, include focus keyword, no quotes wrapping the whole string",
  "contentHtml": "full HTML string following the rules above"
}`;
}

export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
