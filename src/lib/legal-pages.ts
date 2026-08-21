import type { TocItem } from "./html";
import { stripHtml } from "./html";

export const LEGAL_PAGE_SLUGS = new Set([
  "privacy-policy",
  "terms-of-service",
  "disclaimers",
  "gdpr-ccpa-privacy-policy-for-grandma-recipe",
]);

export interface LegalNavItem {
  slug: string;
  label: string;
  shortLabel: string;
}

export const LEGAL_NAV: LegalNavItem[] = [
  { slug: "privacy-policy", label: "Privacy Policy", shortLabel: "Privacy" },
  { slug: "terms-of-service", label: "Terms of Service", shortLabel: "Terms" },
  { slug: "disclaimers", label: "Disclaimers", shortLabel: "Disclaimers" },
  {
    slug: "affiliate-disclosure",
    label: "Affiliate Disclosure",
    shortLabel: "Affiliates",
  },
  {
    slug: "gdpr-ccpa-privacy-policy-for-grandma-recipe",
    label: "GDPR & CCPA Privacy Policy",
    shortLabel: "GDPR & CCPA",
  },
];

export interface LegalPageMeta {
  effectiveDate?: string;
  lastUpdated?: string;
}

export interface PreparedLegalPage {
  meta: LegalPageMeta;
  contentHtml: string;
  sections: TocItem[];
}

export function isLegalPage(slug: string): boolean {
  return LEGAL_PAGE_SLUGS.has(slug);
}

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function extractLegalDates(html: string): LegalPageMeta {
  const match = html.match(
    /Effective Date:<\/strong>\s*([^<]+)[\s\S]*?Last Updated<\/strong>\s*:\s*([^<]+)/i,
  );

  if (!match) return {};

  return {
    effectiveDate: match[1].trim(),
    lastUpdated: match[2].trim(),
  };
}

export function prepareLegalPageHtml(html: string): PreparedLegalPage {
  const meta = extractLegalDates(html);

  let content = html
    .replace(
      /^\s*<p class="wp-block-paragraph"><strong>Effective Date:[\s\S]*?<\/p>\s*/i,
      "",
    )
    .replace(
      /<div class="wp-block-uagb-container uagb-block-bdfc7997[\s\S]*?<\/div>\s*<\/div>\s*/i,
      "",
    )
    .replace(
      /<div class="wp-block-uagb-container[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*/gi,
      "",
    )
    .replace(/<figure[\s\S]*?<\/figure>/gi, "")
    .replace(/<img[^>]*>/gi, "")
    .replace(
      /<p class="wp-block-paragraph">[\s\S]*?Grandma Millie[\s\S]*?cozy kitchen corner[\s\S]*?<\/p>\s*/i,
      "",
    )
    .replace(/https:\/\/www\.grandmarecipe\.com/g, "")
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, "<h2>$1</h2>")
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_match, inner: string) => {
      const label = stripHtml(inner);
      return `<h2 class="legal-section">${label}</h2>`;
    })
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_match, inner: string) => {
      const label = stripHtml(inner);
      return `<h3 class="legal-subsection">${label}</h3>`;
    })
    .replace(/<p class="wp-block-paragraph">/gi, "<p>")
    .replace(/<ul class="wp-block-list">/gi, '<ul class="legal-list">')
    .replace(/\sclass="(?!(?:legal-section|legal-subsection|legal-list))[^"]*"/gi, "")
    .trim();

  const sections: TocItem[] = [];
  const usedIds = new Set<string>();

  content = content.replace(
    /<h2 class="legal-section">([\s\S]*?)<\/h2>/gi,
    (_match, headingHtml: string) => {
      const label = stripHtml(headingHtml);
      if (!label) return _match;

      let id = slugifyHeading(label);
      let suffix = 2;
      while (usedIds.has(id)) {
        id = `${slugifyHeading(label)}-${suffix}`;
        suffix += 1;
      }
      usedIds.add(id);
      sections.push({ href: `#${id}`, label });

      return `<h2 class="legal-section" id="${id}">${label}</h2>`;
    },
  );

  return { meta, contentHtml: content, sections };
}
