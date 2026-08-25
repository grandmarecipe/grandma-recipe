import type { GenerateArticleInput } from "./article-generate-types";

const HOUSE_RULES = `
House rules for Grandma Recipe:
- Warm, conversational, nostalgic "grandma kitchen" voice.
- Never use pork, bacon, wine, or any alcoholic ingredients; use substitutes.
- Do not invent unsafe cooking advice.
- Keep language family-friendly.
`.trim();

export function buildRecipeDataPrompt(input: GenerateArticleInput): string {
  if (input.mode === "paste" && input.pastedDraft?.trim()) {
    return `${HOUSE_RULES}

Parse this recipe draft into structured JSON for our CMS.
Primary keyword hint: ${input.primaryKeyword || "(detect from draft)"}
Preferred category: ${input.category}

If the draft includes nutrition or calories per serving, extract them into the nutrition array. Otherwise estimate reasonable per-serving values from the ingredients.
If the draft mentions tools, pans, or appliances, extract them into the equipment array. Otherwise infer typical home-kitchen equipment for this recipe.

DRAFT:
${input.pastedDraft}

Return ONLY valid JSON (no markdown fences) with this shape:
{
  "focusKeyword": "string",
  "title": "string",
  "excerpt": "string under 280 chars",
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

  const hasRecipe =
    input.mode === "keyword_recipe" &&
    Boolean(input.ingredientsText?.trim() || input.instructionsText?.trim());

  return `${HOUSE_RULES}

Create structured recipe data for Grandma Recipe.
Focus keyword / recipe name: ${input.primaryKeyword}
Category: ${input.category}
Extra notes: ${input.notes?.trim() || "none"}

${
  hasRecipe
    ? `Use these ingredients and instructions as the source of truth (clean/normalize, do not invent a different recipe):
INGREDIENTS:
${input.ingredientsText || "(none provided — generate reasonable ones)"}

INSTRUCTIONS:
${input.instructionsText || "(none provided — generate reasonable ones)"}`
    : `Only a primary keyword was provided. Generate realistic ingredients and 8–12 clear, separate cooking steps (one action per step — e.g. "Preheat the oven to 350°F", not a paragraph) for a homemade ${input.primaryKeyword} recipe. Also estimate per-serving nutrition (Calories, Fat, Protein, Carbs) and list typical home-kitchen equipment (3–6 items).`
}

Include a nutrition array with estimated per-serving values (required): Calories, Fat, Protein, and Carbs. Numbers are estimates for home cooking — round to sensible values.
Include an equipment array (required, 3–6 items): common tools a home cook would use — baking dishes, skillets, mixing bowls, thermometers, etc. Add a short optional notes string when helpful (size, material, or why it's used).

Return ONLY valid JSON (no markdown fences) with this shape:
{
  "focusKeyword": "string",
  "title": "string",
  "excerpt": "string under 280 chars",
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
}): string {
  const stepCount = args.instructions.length;

  return `${HOUSE_RULES}

Write a full recipe article body in HTML for Grandma Recipe.
Do NOT include a standalone ingredients bullet list or recipe-card jump links in the HTML — ingredients and numbered method steps live in separate CMS fields.
The HTML story should still walk readers through the cook with clear step-by-step sections.

Focus keyword: ${args.focusKeyword}
SEO/title: ${args.title}
Category: ${args.category}
Excerpt: ${args.excerpt}
Prep: ${args.prepTime || "n/a"} | Cook: ${args.cookTime || "n/a"} | Total: ${args.totalTime || "n/a"} | Serves: ${args.servings || "n/a"}

Ingredients (for context only — do not duplicate as a full list in HTML):
${args.ingredients.map((item) => `- ${item}`).join("\n")}

Instructions (use these as the source of truth — expand each into its own step block in HTML):
${args.instructions.map((step, i) => `${i + 1}. ${step}`).join("\n")}

HTML rules:
- Use only these tags in contentHtml: p, h2, h3, ul, ol, li, strong, em, a, figure, img, br. No markdown.
- Every major section starts with <h2> (Table of Contents is built from these automatically).
- "How to Make" must NOT be one long paragraph. It must match our live recipe pages:
  1) <h2 id="how-to-make-...">How to Make …</h2>
  2) One warm intro <p> mentioning prep time, cook time, and what the reader will do (2–4 sentences).
  3) Then exactly ${stepCount} step blocks — one per instruction above — each like:
     <h3><strong>Step 1: Short action title</strong></h3>
     <p>1–3 sentences expanding that step with grandma-style tips. Do not cram multiple steps into one paragraph.</p>
- Step titles should be short and descriptive (e.g. "Preheat the Smoker", "Season the Steaks").
- Step body text can expand the instruction but must stay faithful to the numbered instructions list.
- "Make Ahead and Storage" uses <h2> plus <h3> subsections (Storing Leftovers, Freezing, Reheating) with <ul> lists under each.
- FAQs: <h2 id="faqs">FAQs</h2>, brief intro <p>, then 4 FAQ items each as <h3>question</h3><p>answer</p>.

Section order (all required):
1. Opening story — 1–2 <p> paragraphs (no heading).
2. <h2>Why You'll Love This …</h2> + <ul> with 4–5 <li> items.
3. <h2 id="ingredients">Ingredients</h2> + 1 short overview <p> only (no ingredient list).
4. <h2 id="how-to-make-...">How to Make …</h2> + intro <p> + ${stepCount} step blocks (h3 + p each).
5. <h2>Pro Tips …</h2> + <ul>.
6. <h2>How to Serve …</h2> + <ul>.
7. <h2>Make Ahead and Storage</h2> + h3 subsections with lists.
8. <h2 id="faqs">FAQs</h2> + 4 FAQ h3/p pairs.
9. <h2>Final Thoughts</h2> + 1 short closing <p>.

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
