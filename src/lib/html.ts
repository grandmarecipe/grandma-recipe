export interface TocItem {
  href: string;
  label: string;
}

export function extractIntroFromHtml(html: string): string | undefined {
  const match = html.match(/<p class="wp-block-paragraph">([\s\S]*?)<\/p>/i);
  if (!match) return undefined;
  return stripHtml(match[1]);
}

export function stripLeadingIntroParagraph(html: string): string {
  return html
    .replace(/^\s*<p class="wp-block-paragraph">[\s\S]*?<\/p>\s*/i, "")
    .trimStart();
}

export function extractTableOfContents(html: string): TocItem[] {
  const match = html.match(
    /<div class="wp-block-rank-math-toc-block"[\s\S]*?<nav>([\s\S]*?)<\/nav>/i,
  );
  if (!match) return [];

  const items: TocItem[] = [];
  const linkRegex = /<a href="([^"]+)">([\s\S]*?)<\/a>/gi;
  let linkMatch: RegExpExecArray | null;

  while ((linkMatch = linkRegex.exec(match[1])) !== null) {
    const label = stripHtml(linkMatch[2]);
    if (label) {
      items.push({ href: linkMatch[1], label });
    }
  }

  return items;
}

export function buildRecipeTableOfContents(html: string): TocItem[] {
  const items = extractTableOfContents(html);
  const recipeCard: TocItem = { href: "#recipe", label: "Recipe card" };

  if (items.some((item) => item.href === "#recipe")) {
    return items;
  }

  return [recipeCard, ...items];
}

export function stripWprmMarkup(html: string): string {
  const start = html.search(/<div[^>]*wprm-recipe-container/);
  if (start === -1) return html;

  const afterCard = html.slice(start);
  const resume = afterCard.search(/<h2 class="wp-block-heading"/);
  const withoutCard =
    resume === -1
      ? html.slice(0, start)
      : html.slice(0, start) + afterCard.slice(resume);

  return stripLeadingIntroParagraph(
    sanitizeArticleHtml(
      withoutCard
        .replace(/<div class="wp-block-rank-math-toc-block"[\s\S]*?<\/div>/, "")
        .trim(),
    ),
  );
}

export function sanitizeArticleHtml(html: string): string {
  return html
    .replace(/<div[^>]*id=["']recipe-video["'][^>]*>\s*<\/div>/gi, "")
    .replace(/<div[^>]*class="[^"]*wprm-recipe-video[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "")
    .replace(/<div[^>]*id=["']recipe["'][^>]*>\s*<\/div>/gi, "")
    .replace(/<h2([^>]*)\sid=["']ingredients["']([^>]*)>/gi, "<h2$1$2>")
    .replace(/<h2([^>]*)\sid=["']instructions["']([^>]*)>/gi, "<h2$1$2>")
    .replace(
      /<a([^>]*)>\s*<(?:strong|b)>([\s\S]*?)<\/(?:strong|b)>\s*<\/a>/gi,
      "<a$1>$2</a>",
    );
}

/** Remove Rank Math FAQ block from story HTML when a dedicated FAQ UI is rendered. */
export function stripFaqBlockFromHtml(html: string): string {
  return html
    .replace(
      /<h2[^>]*\sid=["']fa-qs["'][^>]*>[\s\S]*?(?=<h2\b|$)/i,
      "",
    )
    .replace(
      /<div[^>]*\sid=["']rank-math-faq["'][^>]*>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/i,
      "",
    )
    .trim();
}

export function normalizeRecipeToc(items: TocItem[]): TocItem[] {
  return items.map((item) => {
    if (item.href === "#fa-qs" || /^faqs?$/i.test(item.label.trim())) {
      return { ...item, href: "#faqs", label: "FAQs" };
    }
    return item;
  });
}

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function extractFeaturedImageFromHtml(html: string): string | undefined {
  const urls: string[] = [];
  const imgRegex =
    /<img[^>]+src="((?:https:\/\/www\.grandmarecipe\.com)?\/wp-content\/uploads\/[^"]+\.(?:webp|jpg|jpeg|png))"/gi;
  let match: RegExpExecArray | null;

  while ((match = imgRegex.exec(html)) !== null) {
    urls.push(match[1]);
  }

  if (urls.length === 0) return undefined;

  const score = (url: string) => {
    if (/Ingredients-for/i.test(url)) return 0;
    if (/Preparation-Steps|Delicious-|Decadent-/i.test(url)) return 3;
    if (/wprm-recipe-image/i.test(html.slice(Math.max(0, html.indexOf(url) - 200), html.indexOf(url)))) {
      return 2;
    }
    return 1;
  };

  return [...urls].sort((a, b) => score(b) - score(a))[0];
}
