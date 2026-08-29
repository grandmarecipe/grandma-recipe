import type {
  FeatureImagePromptResult,
  ImagePromptSection,
  SectionImagePromptResult,
} from "./image-prompt-types";

const BANNED_WORDS =
  "breast, nude, naked, lingerie, sexy, hot, cleavage, intimate, sensual, petite, patriotic, crack";

const JSON_RULES = `
Output format: return ONLY valid JSON. Do not add notes, comments, a title, or markdown fences like \`\`\`json.
`.trim();

export function formatFeatureDedupBlock(
  feature: FeatureImagePromptResult | undefined,
): string {
  if (!feature) return "(none yet)";
  return [
    feature.alt_text_1,
    feature.title_1,
    feature.caption_1,
    feature.description_1,
    feature.alt_text_2,
    feature.title_2,
    feature.caption_2,
    feature.description_2,
  ]
    .filter(Boolean)
    .join(" | ");
}

export function formatSectionDedupBlock(
  ...sections: Array<SectionImagePromptResult | undefined>
): string {
  const parts = sections.flatMap((section) =>
    section
      ? [
          section.alt_text,
          section.title,
          section.caption,
          section.description,
        ]
      : [],
  );
  return parts.filter(Boolean).join(" | ") || "(none yet)";
}

export function buildFeatureImagePrompt(input: {
  focusKeyword: string;
  recipeDetails: string;
}): string {
  return `1. For this info:
- recipe: ${input.focusKeyword}
- details: ${input.recipeDetails}

Generate one single complete feature image prompt with clear, specific details to visually represent the recipe. One image only — no split screen. Do not use these banned words; use safe substitutes instead: ${BANNED_WORDS}.

2. For the prompt above, give 2 alt texts, 2 titles, 2 captions, and 2 short descriptions. Include this exact focus keyword in each text field: ${input.focusKeyword}

${JSON_RULES}
Start the JSON exactly like this:
{
  "prompt": " ",
  "alt_text_1": "",
  "title_1": "",
  "caption_1": " ",
  "description_1": " ",
  "alt_text_2": "",
  "title_2": "",
  "caption_2": " ",
  "description_2": " "
}`;
}

export function buildIngredientsImagePrompt(input: {
  focusKeyword: string;
  ingredientsContent: string;
  doNotDuplicate: string;
}): string {
  return `1. Create a realistic image prompt for the ingredients section of ${input.focusKeyword}:
${input.ingredientsContent}

Provide clear, specific details to visually represent the ingredients on a kitchen table. Do not add numbers of ingredients or any text in the image — photo only, no text or numbers.

Obligatory: do not use these banned words; use safe substitutes instead: ${BANNED_WORDS}.

2. For this prompt, give its alt text, title, caption, and a very short description. Include this exact focus keyword: ${input.focusKeyword}

Obligatory: do not copy or duplicate any wording from this existing metadata:
(${input.doNotDuplicate})

${JSON_RULES}
Start the JSON exactly like this:
{
  "prompt": " ",
  "alt_text": "",
  "title": "",
  "caption": " ",
  "description": " "
}`;
}

export function buildHowToMakeImagePrompt(input: {
  focusKeyword: string;
  howToMakeContent: string;
  doNotDuplicate: string;
}): string {
  return `1. Create a realistic image prompt for this section (How to make ${input.focusKeyword}):
${input.howToMakeContent}

Provide a real-photo style prompt with clear, specific details showing the steps for preparing ${input.focusKeyword}. Divide the screen into 3 or 4 parts. Include in the prompt: no text or numbers in the photo — images only.

Do not use these banned words; use safe substitutes instead: ${BANNED_WORDS}.

2. For this prompt, give its alt text, title, caption, and a very short description. Include this exact focus keyword: ${input.focusKeyword}

Do not duplicate any wording from this existing metadata:
(${input.doNotDuplicate})

${JSON_RULES}
Start the JSON exactly like this:
{
  "prompt": " ",
  "alt_text": "",
  "title": "",
  "caption": " ",
  "description": " "
}`;
}

export function buildHowToServeImagePrompt(input: {
  focusKeyword: string;
  howToServeContent: string;
  doNotDuplicate: string;
}): string {
  return `1. Create a realistic image prompt for the serving section of ${input.focusKeyword}:
${input.howToServeContent}

Show the finished dish beautifully plated and ready to serve — warm, inviting, homestyle presentation on a kitchen table or dining setting. One cohesive photo (not a split screen). No text or numbers in the image — photo only.

Do not use these banned words; use safe substitutes instead: ${BANNED_WORDS}.

2. For this prompt, give its alt text, title, caption, and a very short description. Include this exact focus keyword: ${input.focusKeyword}

Do not duplicate any wording from this existing metadata:
(${input.doNotDuplicate})

${JSON_RULES}
Start the JSON exactly like this:
{
  "prompt": " ",
  "alt_text": "",
  "title": "",
  "caption": " ",
  "description": " "
}`;
}

export function buildImagePromptForSection(
  section: ImagePromptSection,
  input: {
    focusKeyword: string;
    recipeDetails?: string;
    ingredientsContent?: string;
    howToMakeContent?: string;
    howToServeContent?: string;
    feature?: FeatureImagePromptResult;
    ingredients?: SectionImagePromptResult;
    how_to_make?: SectionImagePromptResult;
  },
): string {
  switch (section) {
    case "feature":
      return buildFeatureImagePrompt({
        focusKeyword: input.focusKeyword,
        recipeDetails: input.recipeDetails?.trim() || input.focusKeyword,
      });
    case "ingredients":
      return buildIngredientsImagePrompt({
        focusKeyword: input.focusKeyword,
        ingredientsContent:
          input.ingredientsContent?.trim() || input.focusKeyword,
        doNotDuplicate: formatFeatureDedupBlock(input.feature),
      });
    case "how_to_make":
      return buildHowToMakeImagePrompt({
        focusKeyword: input.focusKeyword,
        howToMakeContent:
          input.howToMakeContent?.trim() || input.focusKeyword,
        doNotDuplicate: [
          formatFeatureDedupBlock(input.feature),
          formatSectionDedupBlock(input.ingredients),
        ].join(" "),
      });
    case "how_to_serve":
      return buildHowToServeImagePrompt({
        focusKeyword: input.focusKeyword,
        howToServeContent:
          input.howToServeContent?.trim() ||
          input.recipeDetails?.trim() ||
          `Serving suggestions and presentation ideas for ${input.focusKeyword}.`,
        doNotDuplicate: [
          formatFeatureDedupBlock(input.feature),
          formatSectionDedupBlock(input.ingredients, input.how_to_make),
        ].join(" "),
      });
  }
}
