import {
  buildUrlSetXml,
  getPostsSitemapEntries,
  xmlResponse,
} from "@/lib/sitemap-xml";

/** Recipe posts only — add this URL in Search Console if you want posts separate. */
export function GET() {
  return xmlResponse(buildUrlSetXml(getPostsSitemapEntries()));
}
