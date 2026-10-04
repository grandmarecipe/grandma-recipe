import { getAllRecipeMetaResolved } from "@/lib/cms-content";
import { absoluteUrl } from "@/lib/seo";
import { SITE } from "@/lib/types";

const FEED_ITEM_LIMIT = 50;

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRfc822(dateValue: string) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return new Date().toUTCString();
  return date.toUTCString();
}

/** Latest published recipes as RSS 2.0 (for Pinterest + readers). */
export async function buildRecipesRssXml() {
  const recipes = await getAllRecipeMetaResolved();
  const items = [...recipes]
    .sort((a, b) => {
      const aTime = new Date(a.publishedAt || a.modifiedAt).getTime();
      const bTime = new Date(b.publishedAt || b.modifiedAt).getTime();
      return bTime - aTime;
    })
    .slice(0, FEED_ITEM_LIMIT);

  const lastBuild =
    items[0]?.modifiedAt || items[0]?.publishedAt || new Date().toISOString();
  const channelImage = absoluteUrl(SITE.defaultOgImage) || absoluteUrl(SITE.logo);

  const itemXml = items
    .map((recipe) => {
      const link = `${SITE.url}/${recipe.slug}/`;
      const title = recipe.title.trim();
      const description = (recipe.excerpt || title).trim();
      const imageUrl =
        absoluteUrl(recipe.featuredImage) || absoluteUrl(SITE.defaultOgImage);
      const pubDate = toRfc822(recipe.publishedAt || recipe.modifiedAt);
      const descriptionHtml = imageUrl
        ? `<p><img src="${escapeXml(imageUrl)}" alt="${escapeXml(
            recipe.featuredImageAlt || title,
          )}" /></p><p>${escapeXml(description)}</p>`
        : `<p>${escapeXml(description)}</p>`;

      const parts = [
        `      <title>${escapeXml(title)}</title>`,
        `      <link>${escapeXml(link)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(link)}</guid>`,
        `      <pubDate>${escapeXml(pubDate)}</pubDate>`,
        `      <category>${escapeXml(recipe.category)}</category>`,
        `      <description><![CDATA[${descriptionHtml}]]></description>`,
      ];

      if (imageUrl) {
        parts.push(
          `      <enclosure url="${escapeXml(imageUrl)}" type="image/webp" />`,
        );
        parts.push(
          `      <media:content url="${escapeXml(imageUrl)}" medium="image" />`,
        );
        parts.push(
          `      <media:thumbnail url="${escapeXml(imageUrl)}" />`,
        );
      }

      return `    <item>\n${parts.join("\n")}\n    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${escapeXml(SITE.name)}</title>
    <link>${escapeXml(SITE.url)}/</link>
    <description>${escapeXml(SITE.description)}</description>
    <language>en-us</language>
    <lastBuildDate>${escapeXml(toRfc822(lastBuild))}</lastBuildDate>
    <atom:link href="${escapeXml(SITE.url)}/feed/" rel="self" type="application/rss+xml" />
    <image>
      <url>${escapeXml(channelImage || `${SITE.url}/brand/logo.webp`)}</url>
      <title>${escapeXml(SITE.name)}</title>
      <link>${escapeXml(SITE.url)}/</link>
    </image>
${itemXml}
  </channel>
</rss>
`;
}

export function rssResponse(xml: string) {
  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=1800, s-maxage=1800",
    },
  });
}
