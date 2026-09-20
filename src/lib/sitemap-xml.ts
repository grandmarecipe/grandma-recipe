import { getStaticPageSlugs } from "@/lib/content";
import {
  getAllRecipeMetaResolved,
  getRecipesByCategoryResolved,
} from "@/lib/cms-content";
import { getTotalPages } from "@/lib/pagination";
import { CATEGORIES, SITE } from "@/lib/types";

export type SitemapUrlEntry = {
  loc: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
};

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function buildUrlSetXml(entries: SitemapUrlEntry[]) {
  const body = entries
    .map((entry) => {
      const parts = [`    <loc>${escapeXml(entry.loc)}</loc>`];
      if (entry.lastmod) {
        parts.push(`    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`);
      }
      if (entry.changefreq) {
        parts.push(`    <changefreq>${entry.changefreq}</changefreq>`);
      }
      if (typeof entry.priority === "number") {
        parts.push(`    <priority>${entry.priority.toFixed(1)}</priority>`);
      }
      return `  <url>\n${parts.join("\n")}\n  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

export function buildSitemapIndexXml(
  sitemaps: Array<{ loc: string; lastmod?: string }>,
) {
  const body = sitemaps
    .map((item) => {
      const parts = [`    <loc>${escapeXml(item.loc)}</loc>`];
      if (item.lastmod) {
        parts.push(`    <lastmod>${escapeXml(item.lastmod)}</lastmod>`);
      }
      return `  <sitemap>\n${parts.join("\n")}\n  </sitemap>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</sitemapindex>
`;
}

export function xmlResponse(xml: string) {
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

/** File recipes + published CMS articles (cron publish shows up here after revalidate). */
export async function getPostsSitemapEntries(): Promise<SitemapUrlEntry[]> {
  const recipes = await getAllRecipeMetaResolved();
  return recipes.map((recipe) => ({
    loc: `${SITE.url}/${recipe.slug}/`,
    lastmod: new Date(recipe.modifiedAt).toISOString(),
    changefreq: "monthly" as const,
    priority: 0.7,
  }));
}

export async function getCategoriesSitemapEntries(): Promise<SitemapUrlEntry[]> {
  const entries: SitemapUrlEntry[] = [];
  for (const category of CATEGORIES) {
    const recipes = await getRecipesByCategoryResolved(category.slug);
    const totalPages = getTotalPages(recipes.length);

    for (let index = 0; index < totalPages; index += 1) {
      const page = index + 1;
      entries.push({
        loc:
          page === 1
            ? `${SITE.url}/category/${category.slug}/`
            : `${SITE.url}/category/${category.slug}/page/${page}/`,
        lastmod: new Date().toISOString(),
        changefreq: "weekly",
        priority: page === 1 ? 0.8 : 0.6,
      });
    }
  }
  return entries;
}

export function getPagesSitemapEntries(): SitemapUrlEntry[] {
  const staticSlugs = getStaticPageSlugs();
  const fixedPages: SitemapUrlEntry[] = [
    {
      loc: `${SITE.url}/`,
      lastmod: new Date().toISOString(),
      changefreq: "daily",
      priority: 1,
    },
    {
      loc: `${SITE.url}/how-we-test-recipes/`,
      lastmod: new Date().toISOString(),
      changefreq: "monthly",
      priority: 0.6,
    },
    {
      loc: `${SITE.url}/affiliate-disclosure/`,
      lastmod: new Date().toISOString(),
      changefreq: "yearly",
      priority: 0.4,
    },
    {
      loc: `${SITE.url}/sitemap/`,
      lastmod: new Date().toISOString(),
      changefreq: "weekly",
      priority: 0.4,
    },
  ];

  const contentPages = staticSlugs.map((slug) => ({
    loc: `${SITE.url}/${slug}/`,
    lastmod: new Date().toISOString(),
    changefreq: "monthly" as const,
    priority: 0.5,
  }));

  // Avoid duplicating fixed pages that also exist as content JSON.
  const seen = new Set(fixedPages.map((page) => page.loc));
  const uniqueContentPages = contentPages.filter((page) => {
    if (seen.has(page.loc)) return false;
    seen.add(page.loc);
    return true;
  });

  return [...fixedPages, ...uniqueContentPages];
}

export const SITEMAP_CHILDREN = [
  "sitemap-posts.xml",
  "sitemap-categories.xml",
  "sitemap-pages.xml",
] as const;
