/**
 * Normalize text used in meta tags and JSON-LD descriptions.
 * Strips emojis, WordPress hellip markers, and excess whitespace.
 */
export function cleanSeoText(value?: string | null): string | undefined {
  if (!value) return undefined;

  const cleaned = value
    .replace(/\[&hellip;\]/gi, "")
    .replace(/&hellip;/gi, "")
    .replace(/\u2026/g, "")
    // Emoji and pictographs (including variation selectors / ZWJ sequences)
    .replace(/\p{Extended_Pictographic}/gu, "")
    .replace(/\uFE0F/g, "")
    .replace(/\u200D/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return cleaned || undefined;
}

/** Prefer seoDescription, then excerpt — always cleaned for SERP/schema. */
export function resolveSeoDescription(recipe: {
  seoDescription?: string;
  excerpt?: string;
}): string | undefined {
  return (
    cleanSeoText(recipe.seoDescription) || cleanSeoText(recipe.excerpt)
  );
}

export function isFullRecipe(recipe: {
  ingredients?: string[];
  instructions?: string[];
}): boolean {
  return (
    (recipe.ingredients?.length ?? 0) > 0 &&
    (recipe.instructions?.length ?? 0) > 0
  );
}
