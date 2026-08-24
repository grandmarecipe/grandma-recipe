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

DRAFT:
${input.pastedDraft}

Return ONLY valid JSON (no markdown fences) with this shape:
{
  "focusKeyword": "string",
  "title": "string",
  "excerpt": "string under 280 chars",
  "ingredients": ["one ingredient per item, include amounts"],
  "instructions": ["one clear step per item"],
  "prepTime": "e.g. 15 minutes",
  "cookTime": "e.g. 30 minutes",
  "totalTime": "e.g. 45 minutes",
  "servings": "e.g. 4",
  "calories": "optional string or empty",
  "cuisine": "optional",
  "course": "optional"
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
    : `Only a primary keyword was provided. Generate realistic ingredients and step-by-step instructions for a homemade ${input.primaryKeyword} recipe.`
}

Return ONLY valid JSON (no markdown fences) with this shape:
{
  "focusKeyword": "string",
  "title": "string",
  "excerpt": "string under 280 chars",
  "ingredients": ["one ingredient per item, include amounts"],
  "instructions": ["one clear step per item"],
  "prepTime": "e.g. 15 minutes",
  "cookTime": "e.g. 30 minutes",
  "totalTime": "e.g. 45 minutes",
  "servings": "e.g. 4",
  "calories": "optional string or empty",
  "cuisine": "optional",
  "course": "optional"
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
  return `${HOUSE_RULES}

Write a full recipe article body in HTML for Grandma Recipe.
Do NOT include a standalone ingredients list or numbered recipe card steps in the HTML — those live in separate CMS fields.
Do include warm storytelling sections.

Focus keyword: ${args.focusKeyword}
SEO/title: ${args.title}
Category: ${args.category}
Excerpt: ${args.excerpt}
Prep: ${args.prepTime || "n/a"} | Cook: ${args.cookTime || "n/a"} | Total: ${args.totalTime || "n/a"} | Serves: ${args.servings || "n/a"}

Ingredients (for context only):
${args.ingredients.map((item) => `- ${item}`).join("\n")}

Instructions (for context only):
${args.instructions.map((step, i) => `${i + 1}. ${step}`).join("\n")}

Return ONLY valid JSON (no markdown fences):
{
  "seoTitle": "50-60 chars, include focus keyword naturally",
  "seoDescription": "140-160 chars, include focus keyword, no quotes wrapping the whole string",
  "contentHtml": "HTML string with these sections in order using <h2> headings: opening story paragraph(s); Why You'll Love This … (ul/li); brief Ingredients overview paragraph (not a full list); How to Make … narrative that mentions prep/cook times; Pro Tips (ul/li); How to Serve (ul/li); Make Ahead and Storage with h3 subsections; FAQs with h3 questions and paragraph answers (4 FAQs); Final Thoughts short closing"
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
