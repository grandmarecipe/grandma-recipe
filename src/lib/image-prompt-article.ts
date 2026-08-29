/** Build image-prompt inputs from a CMS article draft. */
export type ArticleImagePromptSource = {
  title: string;
  excerpt: string;
  focusKeyword: string;
  ingredientsText: string;
  instructionsText: string;
  contentHtml: string;
};

export function buildArticleImagePromptInput(source: ArticleImagePromptSource) {
  const focusKeyword =
    source.focusKeyword.trim() || source.title.trim() || "recipe";

  const recipeDetails = [source.title, source.excerpt]
    .map((part) => part.trim())
    .filter(Boolean)
    .join("\n\n");

  return {
    focusKeyword,
    recipeDetails,
    ingredientsContent: source.ingredientsText.trim(),
    howToMakeContent: source.instructionsText.trim(),
    howToServeContent:
      extractHowToServeSection(source.contentHtml) ||
      source.excerpt.trim() ||
      `Serving ideas for ${focusKeyword}.`,
  };
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function extractHowToServeSection(contentHtml: string): string {
  if (!contentHtml.trim()) return "";

  const sectionMatch = contentHtml.match(
    /<h2[^>]*id=["']?how-to-serve[^"']*["']?[^>]*>[\s\S]*?(?=<h2|$)/i,
  );
  if (sectionMatch) {
    return stripHtml(sectionMatch[0]).slice(0, 2000);
  }

  const headingMatch = contentHtml.match(
    /<h2[^>]*>\s*how to serve[\s\S]*?(?=<h2|$)/i,
  );
  if (headingMatch) {
    return stripHtml(headingMatch[0]).slice(0, 2000);
  }

  return "";
}
