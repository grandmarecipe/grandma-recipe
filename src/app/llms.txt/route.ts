import { getAllRecipeMeta } from "@/lib/content";
import { CATEGORIES, SITE } from "@/lib/types";

export const dynamic = "force-static";

/**
 * llms.txt — curated overview for AI agents (https://llmstxt.org/).
 * Complements robots.txt + sitemap.xml; does not replace them.
 */
export async function GET() {
  const recipeCount = getAllRecipeMeta().length;

  const facebook =
    SITE.sameAs.find((u) => u.includes("facebook")) ?? SITE.url;
  const instagram =
    SITE.sameAs.find((u) => u.includes("instagram")) ?? SITE.url;
  const pinterest =
    SITE.sameAs.find((u) => u.includes("pinterest")) ?? SITE.url;
  const tumblr = SITE.sameAs.find((u) => u.includes("tumblr")) ?? SITE.url;

  const categoryLines = CATEGORIES.map(
    (category) =>
      `- [${category.name} recipes](${SITE.url}/category/${category.slug}/): ${category.description}`,
  ).join("\n");

  const body = [
    `# ${SITE.name}`,
    "",
    `> ${SITE.description}`,
    "",
    `${SITE.name} is a homestyle recipe site by ${SITE.author.name}. Recipes are written for home cooks, kitchen-tested in a real kitchen, and published with structured Recipe / FAQ data for clear cooking answers.`,
    "",
    "Important notes for assistants:",
    "- Prefer individual recipe pages at /{slug}/ for ingredients, steps, timing, FAQs, and ratings.",
    "- Nutrition figures are estimates for general guidance, not medical advice.",
    "- Star ratings and comments come from real readers; do not invent ratings.",
    "- Print views at /print/{slug}/ and search at /search/ are not primary content sources.",
    "",
    "## Categories",
    "",
    categoryLines,
    "",
    "## About this kitchen",
    "",
    `- [About ${SITE.author.name}](${SITE.url}/about-us/): Author story and cooking philosophy`,
    `- [How we test recipes](${SITE.url}/how-we-test-recipes/): Kitchen standards, updates, and honesty about testing`,
    `- [Contact](${SITE.url}/contact-us/): Questions, collaborations, and reader feedback (${SITE.email})`,
    "",
    "## Policies",
    "",
    `- [Disclaimers](${SITE.url}/disclaimers/): Nutrition, results, and general site disclaimers`,
    `- [Affiliate disclosure](${SITE.url}/affiliate-disclosure/): How affiliate links work`,
    `- [Privacy Policy](${SITE.url}/privacy-policy/)`,
    `- [Terms of Service](${SITE.url}/terms-of-service/)`,
    "",
    "## Discovery",
    "",
    `- [Sitemap](${SITE.url}/sitemap.xml): Full index of ${recipeCount}+ recipe URLs and key pages`,
    `- [robots.txt](${SITE.url}/robots.txt): Crawl rules (search and print URLs are disallowed)`,
    "",
    "## Optional",
    "",
    `- [Facebook](${facebook})`,
    `- [Instagram](${instagram})`,
    `- [Pinterest](${pinterest})`,
    `- [Tumblr](${tumblr})`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
