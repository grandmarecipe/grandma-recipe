export interface TocItem {
  href: string;
  label: string;
}

export function extractIntroFromHtml(html: string): string | undefined {
  const match = html.match(/<p\b[^>]*>([\s\S]*?)<\/p>/i);
  if (!match) return undefined;
  return stripHtml(match[1]);
}

/** Drop leading <p> blocks so story HTML can start at the first <h2>. */
export function stripLeadingIntroParagraph(html: string): string {
  let out = html.trimStart();
  while (/^<p\b/i.test(out)) {
    const next = out.replace(/^<p\b[^>]*>[\s\S]*?<\/p>\s*/i, "").trimStart();
    if (next === out) break;
    out = next;
  }
  return out;
}

export function slugifyHeading(text: string): string {
  return (
    text
      .trim()
      .toLowerCase()
      .replace(/['']/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "section"
  );
}

export function extractHeadingsTableOfContents(html: string): TocItem[] {
  const items: TocItem[] = [];
  const seen = new Set<string>();
  const h2Regex = /<h2(\s[^>]*)?>([\s\S]*?)<\/h2>/gi;
  let match: RegExpExecArray | null;

  while ((match = h2Regex.exec(html)) !== null) {
    const attrs = match[1] || "";
    const label = stripHtml(match[2]);
    if (!label || /^table of contents$/i.test(label)) continue;
    // Skip legacy WP Recipe Maker card headings if any remain in HTML.
    if (/\bwprm-/i.test(attrs)) continue;

    const idMatch = attrs.match(/\sid=["']([^"']+)["']/i);
    let href = idMatch ? `#${idMatch[1]}` : `#${slugifyHeading(label)}`;

    if (/^faqs?$/i.test(label.trim()) || idMatch?.[1] === "fa-qs") {
      href = "#faqs";
    }

    if (seen.has(href)) continue;
    seen.add(href);

    items.push({
      href,
      label: /^faqs?$/i.test(label.trim()) ? "FAQs" : label,
    });
  }

  return items;
}

/** Add id attributes to story h2 headings so TOC anchors scroll correctly. */
export function ensureHeadingIds(html: string): string {
  return html.replace(
    /<h2(\s[^>]*)?>([\s\S]*?)<\/h2>/gi,
    (full, attrs = "", inner) => {
      const label = stripHtml(inner);
      if (/^table of contents$/i.test(label)) return full;
      if (/\sid=["']/i.test(attrs)) return full;

      const id = /^faqs?$/i.test(label.trim()) ? "faqs" : slugifyHeading(label);
      return `<h2${attrs} id="${id}">${inner}</h2>`;
    },
  );
}

export function buildRecipeTableOfContents(html: string): TocItem[] {
  const recipeCard: TocItem = { href: "#recipe", label: "Recipe card" };
  // Always derive TOC from story h2 headings (CMS + migrated WP articles).
  const sectionItems = extractHeadingsTableOfContents(stripWprmMarkup(html));

  if (sectionItems.some((item) => item.href === "#recipe")) {
    return sectionItems;
  }

  return [recipeCard, ...sectionItems];
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

/** Remove CMS equipment block from story HTML (shown in recipe card). */
export function stripEquipmentBlockFromHtml(html: string): string {
  return html
    .replace(
      /<div[^>]*id=["']recipe-equipment["'][^>]*>[\s\S]*?<\/div>/i,
      "",
    )
    .trim();
}

/** Remove CMS nutrition block from story HTML (shown in recipe card Notes). */
export function stripNutritionBlockFromHtml(html: string): string {
  return html
    .replace(
      /<div[^>]*id=["']recipe-nutrition["'][^>]*>[\s\S]*?<\/div>/i,
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

/** Split HTML after the Nth closing </p> (for in-article ad placement). */
export function splitHtmlAfterParagraphs(
  html: string,
  paragraphCount: number,
): [string, string] {
  if (paragraphCount <= 0) return ["", html];

  const re = /<\/p>/gi;
  let match: RegExpExecArray | null;
  let found = 0;
  let cut = -1;

  while ((match = re.exec(html)) !== null) {
    found += 1;
    if (found === paragraphCount) {
      cut = match.index + match[0].length;
      break;
    }
  }

  if (cut < 0) return [html, ""];
  return [html.slice(0, cut), html.slice(cut)];
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
