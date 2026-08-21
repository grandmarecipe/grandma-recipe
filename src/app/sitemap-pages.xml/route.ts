import {
  buildUrlSetXml,
  getPagesSitemapEntries,
  xmlResponse,
} from "@/lib/sitemap-xml";

/** Static / site pages only (home, about, contact, legal, etc.). */
export function GET() {
  return xmlResponse(buildUrlSetXml(getPagesSitemapEntries()));
}
