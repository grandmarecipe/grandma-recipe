import { getAllRecipeMetaResolved } from "@/lib/cms-content";
import { absoluteUrl } from "@/lib/seo";
import type { RecipeMeta } from "@/lib/types";
import { SITE } from "@/lib/types";

const FEED_ITEM_LIMIT = 50;
const PIN_TITLE_MAX = 100;
const PIN_CAPTION_MAX = 420;

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

function cleanText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function truncateAtWord(value: string, max: number) {
  const text = cleanText(value);
  if (text.length <= max) return text;
  const sliced = text.slice(0, max - 1);
  const lastSpace = sliced.lastIndexOf(" ");
  return `${(lastSpace > 40 ? sliced.slice(0, lastSpace) : sliced).trim()}…`;
}

const CATEGORY_PIN_LINE: Record<string, string> = {
  breakfast: "A cozy breakfast idea your family will love.",
  lunch: "A simple lunch idea worth saving.",
  dinner: "A comforting dinner idea for busy nights.",
  snacks: "A tasty snack idea to save for later.",
  dessert: "A sweet dessert idea worth pinning.",
};

/** Short pin-style title Pinterest often uses as the pin headline. */
export function buildPinTitle(recipe: Pick<RecipeMeta, "title">) {
  let title = cleanText(recipe.title);
  // Avoid "… Recipes Recipe" on guides that already say recipe/recipes.
  if (!/\brecipes?\b/i.test(title)) {
    title = `${title} Recipe`;
  }
  return truncateAtWord(title, PIN_TITLE_MAX);
}

/** Longer pin caption for the RSS description field. */
export function buildPinCaption(
  recipe: Pick<RecipeMeta, "title" | "excerpt" | "category">,
) {
  const pinTitle = buildPinTitle(recipe);
  const excerpt = cleanText(recipe.excerpt || "");
  const categoryLine =
    CATEGORY_PIN_LINE[recipe.category] || "A homemade recipe worth saving.";

  let body = excerpt;
  if (!body) {
    body = `Save this ${pinTitle.toLowerCase()} for later.`;
  } else if (!/[.!?]$/.test(body)) {
    body = `${body}.`;
  }

  const caption = [body, categoryLine, `Get the full recipe on ${SITE.name}.`].join(
    " ",
  );

  return truncateAtWord(caption, PIN_CAPTION_MAX);
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
      const pinTitle = buildPinTitle(recipe);
      const pinCaption = buildPinCaption(recipe);
      const imageUrl =
        absoluteUrl(recipe.featuredImage) || absoluteUrl(SITE.defaultOgImage);
      const pubDate = toRfc822(recipe.publishedAt || recipe.modifiedAt);
      const imageAlt = recipe.featuredImageAlt?.trim() || pinTitle;
      const descriptionHtml = imageUrl
        ? `<p><img src="${escapeXml(imageUrl)}" alt="${escapeXml(
            imageAlt,
          )}" /></p><p>${escapeXml(pinCaption)}</p>`
        : `<p>${escapeXml(pinCaption)}</p>`;

      const parts = [
        `      <title>${escapeXml(pinTitle)}</title>`,
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
          `      <media:content url="${escapeXml(imageUrl)}" medium="image">`,
        );
        parts.push(
          `        <media:title>${escapeXml(pinTitle)}</media:title>`,
        );
        parts.push(
          `        <media:description>${escapeXml(pinCaption)}</media:description>`,
        );
        parts.push(`      </media:content>`);
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
    <title>${escapeXml(SITE.name)} Recipes</title>
    <link>${escapeXml(SITE.url)}/</link>
    <description>${escapeXml(
      `Homestyle recipes from ${SITE.name} — pin-ready titles and captions for easy saving.`,
    )}</description>
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
