import {
  buildSitemapIndexXml,
  SITEMAP_CHILDREN,
  xmlResponse,
} from "@/lib/sitemap-xml";
import { SITE } from "@/lib/types";

/** Sitemap index — submit this (or the child sitemaps) in Search Console. */
export function GET() {
  const lastmod = new Date().toISOString();
  const xml = buildSitemapIndexXml(
    SITEMAP_CHILDREN.map((name) => ({
      loc: `${SITE.url}/${name}`,
      lastmod,
    })),
  );
  return xmlResponse(xml);
}
