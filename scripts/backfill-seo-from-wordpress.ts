import fs from "fs";
import path from "path";

const WP_BASE = "https://www.grandmarecipe.com/wp-json/wp/v2";

interface WPRankMathMeta {
  rank_math_title?: string;
  rank_math_description?: string;
}

interface WPPost {
  slug: string;
  status: string;
  meta?: WPRankMathMeta;
}

function decodeHtml(text: string): string {
  return text
    .replace(/&#8211;/g, "–")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
}

function extractRankMathSeo(meta?: WPRankMathMeta): {
  seoTitle?: string;
  seoDescription?: string;
} {
  const seoTitle = meta?.rank_math_title?.trim();
  const seoDescription = meta?.rank_math_description?.trim();

  return {
    seoTitle: seoTitle ? decodeHtml(seoTitle) : undefined,
    seoDescription: seoDescription ? decodeHtml(seoDescription) : undefined,
  };
}

async function fetchAllPosts(): Promise<WPPost[]> {
  const results: WPPost[] = [];
  let page = 1;

  while (true) {
    const url = `${WP_BASE}/posts?per_page=100&page=${page}`;
    const response = await fetch(url);
    if (!response.ok) break;

    const batch = (await response.json()) as WPPost[];
    if (batch.length === 0) break;

    results.push(...batch);
    page += 1;
  }

  return results;
}

async function main() {
  const recipesDir = path.join(process.cwd(), "content", "recipes");
  const posts = await fetchAllPosts();
  console.log(`Fetched ${posts.length} WordPress posts`);

  let updated = 0;
  let missingFile = 0;
  let noSeo = 0;

  for (const post of posts) {
    if (post.status !== "publish") continue;

    const filePath = path.join(recipesDir, `${post.slug}.json`);
    if (!fs.existsSync(filePath)) {
      missingFile += 1;
      continue;
    }

    const seo = extractRankMathSeo(post.meta);
    if (!seo.seoTitle && !seo.seoDescription) {
      noSeo += 1;
      continue;
    }

    const recipe = JSON.parse(fs.readFileSync(filePath, "utf8")) as Record<
      string,
      unknown
    >;

    let changed = false;
    if (seo.seoTitle && recipe.seoTitle !== seo.seoTitle) {
      recipe.seoTitle = seo.seoTitle;
      changed = true;
    }
    if (seo.seoDescription && recipe.seoDescription !== seo.seoDescription) {
      recipe.seoDescription = seo.seoDescription;
      changed = true;
    }

    if (changed) {
      fs.writeFileSync(filePath, JSON.stringify(recipe, null, 2));
      updated += 1;
    }
  }

  console.log(`Updated ${updated} recipe files with Rank Math SEO`);
  if (missingFile) console.log(`Skipped ${missingFile} posts with no local JSON`);
  if (noSeo) console.log(`Skipped ${noSeo} posts with empty Rank Math fields`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
