import {
  buildUrlSetXml,
  getCategoriesSitemapEntries,
  xmlResponse,
} from "@/lib/sitemap-xml";

/** Category archives — page counts include published CMS articles. */
export async function GET() {
  const entries = await getCategoriesSitemapEntries();
  return xmlResponse(buildUrlSetXml(entries));
}
