import {
  buildUrlSetXml,
  getPostsSitemapEntries,
  xmlResponse,
} from "@/lib/sitemap-xml";

/** Recipe posts — includes file recipes + published CMS articles. */
export async function GET() {
  const entries = await getPostsSitemapEntries();
  return xmlResponse(buildUrlSetXml(entries));
}
