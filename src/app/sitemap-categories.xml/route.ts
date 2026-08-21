import {
  buildUrlSetXml,
  getCategoriesSitemapEntries,
  xmlResponse,
} from "@/lib/sitemap-xml";

/** Category archives only. */
export function GET() {
  return xmlResponse(buildUrlSetXml(getCategoriesSitemapEntries()));
}
