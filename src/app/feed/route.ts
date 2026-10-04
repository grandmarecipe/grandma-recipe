import { buildRecipesRssXml, rssResponse } from "@/lib/rss";

/**
 * RSS 2.0 feed of latest recipes — used by Pinterest auto-publish and readers.
 * Live URL: https://www.grandmarecipe.com/feed/
 */
export const revalidate = 1800;

export async function GET() {
  const xml = await buildRecipesRssXml();
  return rssResponse(xml);
}
