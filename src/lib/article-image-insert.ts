import type { RecipeImageSection } from "./recipe-image-upload";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildFigureHtml(input: {
  src: string;
  alt: string;
  caption?: string;
  section: Exclude<RecipeImageSection, "feature">;
  width?: number;
  height?: number;
}): string {
  const alt = escapeHtml(input.alt);
  const caption = input.caption?.trim()
    ? `\n<figcaption class="wp-element-caption">${escapeHtml(input.caption)}</figcaption>`
    : "";
  const sizeAttrs =
    input.width && input.height
      ? ` width="${input.width}" height="${input.height}"`
      : "";
  return `<figure class="wp-block-image aligncenter size-large" data-recipe-image="${input.section}"><img decoding="async" loading="lazy"${sizeAttrs} src="${escapeHtml(input.src)}" alt="${alt}" />${caption}\n</figure>`;
}

const SECTION_HEADING_PATTERNS: Record<
  Exclude<RecipeImageSection, "feature">,
  RegExp[]
> = {
  ingredients: [
    /<h2[^>]*id=["']ingredients["'][^>]*>[\s\S]*?<\/h2>/i,
    /<h2[^>]*>\s*<strong>\s*ingredients\s*<\/strong>\s*<\/h2>/i,
    /<h2[^>]*>\s*ingredients\s*<\/h2>/i,
  ],
  how_to_make: [
    /<h2[^>]*id=["']how-to-make[^"']*["'][^>]*>[\s\S]*?<\/h2>/i,
    /<h2[^>]*>\s*<strong>\s*how to make[\s\S]*?<\/strong>\s*<\/h2>/i,
    /<h2[^>]*>\s*how to make[\s\S]*?<\/h2>/i,
  ],
  how_to_serve: [
    /<h2[^>]*id=["']how-to-serve[^"']*["'][^>]*>[\s\S]*?<\/h2>/i,
    /<h2[^>]*>\s*<strong>\s*how to serve[\s\S]*?<\/strong>\s*<\/h2>/i,
    /<h2[^>]*>\s*how to serve[\s\S]*?<\/h2>/i,
  ],
};

function findHeadingEnd(html: string, patterns: RegExp[]): number | null {
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.index != null) {
      return match.index + match[0].length;
    }
  }
  return null;
}

function replaceSectionFigure(
  html: string,
  section: Exclude<RecipeImageSection, "feature">,
  figureHtml: string,
): string {
  const headingEnd = findHeadingEnd(html, SECTION_HEADING_PATTERNS[section]);
  if (headingEnd == null) {
    return `${html.trim()}\n\n${figureHtml}\n`;
  }

  const afterHeading = html.slice(headingEnd);
  const figureMatch = afterHeading.match(
    /(\s*(?:<p[^>]*>[\s\S]*?<\/p>\s*)?)<figure class="wp-block-image[\s\S]*?<\/figure>/i,
  );

  if (figureMatch?.index != null) {
    const start = headingEnd + figureMatch.index + (figureMatch[1]?.length ?? 0);
    const end =
      headingEnd +
      figureMatch.index +
      figureMatch[0].length -
      (figureMatch[1]?.length ?? 0);
    return html.slice(0, start) + figureHtml + html.slice(end);
  }

  const introMatch = afterHeading.match(/^\s*<p class="wp-block-paragraph">[\s\S]*?<\/p>/i);
  const insertAt =
    headingEnd + (introMatch ? introMatch.index! + introMatch[0].length : 0);

  return `${html.slice(0, insertAt)}\n\n${figureHtml}\n${html.slice(insertAt)}`;
}

export function insertRecipeImageIntoArticle(input: {
  contentHtml: string;
  section: RecipeImageSection;
  src: string;
  alt: string;
  caption?: string;
  previousSrc?: string;
  width?: number;
  height?: number;
}): string {
  if (input.section === "feature") {
    return input.contentHtml;
  }

  const figureHtml = buildFigureHtml({
    src: input.src,
    alt: input.alt,
    caption: input.caption,
    section: input.section,
    width: input.width,
    height: input.height,
  });

  const bySectionTag = new RegExp(
    `<figure[^>]*data-recipe-image="${input.section}"[\\s\\S]*?<\\/figure>`,
    "i",
  );
  if (bySectionTag.test(input.contentHtml)) {
    return input.contentHtml.replace(bySectionTag, figureHtml);
  }

  if (input.previousSrc) {
    const byPreviousSrc = new RegExp(
      `<figure[^>]*>[\\s\\S]*?src="${escapeRegex(input.previousSrc)}"[\\s\\S]*?<\\/figure>`,
      "i",
    );
    if (byPreviousSrc.test(input.contentHtml)) {
      return input.contentHtml.replace(byPreviousSrc, figureHtml);
    }
  }

  return replaceSectionFigure(input.contentHtml, input.section, figureHtml);
}

export function getRecipeSectionImageSrc(
  contentHtml: string,
  section: Exclude<RecipeImageSection, "feature">,
): string | undefined {
  const bySectionTag = contentHtml.match(
    new RegExp(
      `<figure[^>]*data-recipe-image="${section}"[\\s\\S]*?src="([^"]+)"`,
      "i",
    ),
  );
  if (bySectionTag?.[1]) return bySectionTag[1];

  const headingEnd = findHeadingEnd(
    contentHtml,
    SECTION_HEADING_PATTERNS[section],
  );
  if (headingEnd == null) return undefined;

  const afterHeading = contentHtml.slice(headingEnd);
  const figureMatch = afterHeading.match(
    /<figure[^>]*>[\s\S]*?src="([^"]+)"[\s\S]*?<\/figure>/i,
  );
  return figureMatch?.[1];
}
