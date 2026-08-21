import fs from "fs";
import path from "path";
import type { CategorySlug, Recipe, RecipeMeta, StaticPage } from "../src/lib/types";
import { extractRecipeFieldsFromHtml } from "../src/lib/recipe-card-meta";
import { extractFeaturedImageFromHtml } from "../src/lib/html";

const WP_BASE = "https://www.grandmarecipe.com/wp-json/wp/v2";
const CATEGORY_MAP: Record<number, CategorySlug> = {
  1: "breakfast",
  39: "lunch",
  40: "dinner",
  41: "dessert",
  444: "snacks",
};

interface WPRankMathMeta {
  rank_math_title?: string;
  rank_math_description?: string;
  [key: string]: unknown;
}

interface WPPost {
  id: number;
  slug: string;
  link: string;
  status: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  modified: string;
  categories: number[];
  meta?: WPRankMathMeta;
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
      alt_text: string;
    }>;
  };
}

interface WPPage {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  meta?: WPRankMathMeta;
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

function stripTags(html: string): string {
  return decodeHtml(html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function extractListItems(html: string, kind: "ingredient" | "instruction"): string[] {
  if (kind === "ingredient") {
    const items: string[] = [];
    const liRegex =
      /<li class="wprm-recipe-ingredient"[^>]*>([\s\S]*?)<\/li>/gi;
    let match: RegExpExecArray | null;

    while ((match = liRegex.exec(html)) !== null) {
      const block = match[1];
      const amount = extractSpan(block, "wprm-recipe-ingredient-amount");
      const unit = extractSpan(block, "wprm-recipe-ingredient-unit");
      const name = extractSpan(block, "wprm-recipe-ingredient-name");
      const notes = extractSpan(block, "wprm-recipe-ingredient-notes");
      const parts = [amount, unit, name].filter(Boolean).join(" ");
      const text = notes ? `${parts} (${notes})` : parts;
      if (text.trim()) items.push(decodeHtml(text.trim()));
    }

    return items;
  }

  const instructions: string[] = [];
  const textRegex =
    /<div class="wprm-recipe-instruction-text"[^>]*>([\s\S]*?)<\/div>/gi;
  let match: RegExpExecArray | null;

  while ((match = textRegex.exec(html)) !== null) {
    const text = stripTags(match[1]);
    if (text) instructions.push(text);
  }

  return instructions;
}

function extractSpan(html: string, className: string): string {
  const regex = new RegExp(
    `<span class="${className}[^"]*"[^>]*>([\\s\\S]*?)<\\/span>`,
    "i",
  );
  const match = html.match(regex);
  return match ? stripTags(match[1]) : "";
}

function parseRecipe(html: string, _post: WPPost): Pick<
  Recipe,
  | "ingredients"
  | "instructions"
  | "equipment"
  | "prepTime"
  | "cookTime"
  | "totalTime"
  | "servings"
  | "calories"
  | "cuisine"
  | "course"
> {
  const ingredients = extractListItems(html, "ingredient");
  const instructions = extractListItems(html, "instruction");
  const equipment = extractEquipment(html);
  const fields = extractRecipeFieldsFromHtml(html);

  return {
    ingredients,
    instructions,
    equipment: equipment.length > 0 ? equipment : undefined,
    ...fields,
  };
}

function extractEquipment(html: string): string[] {
  const items: string[] = [];
  const itemRegex =
    /<li class="[^"]*wprm-recipe-equipment-item[^"]*"[^>]*>([\s\S]*?)<\/li>/gi;
  let match: RegExpExecArray | null;

  while ((match = itemRegex.exec(html)) !== null) {
    const block = match[1];
    const notes = extractSpan(block, "wprm-recipe-equipment-notes");
    const withoutNotes = block.replace(
      /<span class="[^"]*wprm-recipe-equipment-notes[^"]*"[^>]*>[\s\S]*?<\/span>/gi,
      "",
    );
    const name = stripTags(withoutNotes);
    const text = notes ? `${name} (${notes})` : name;
    if (text) items.push(text);
  }

  return items;
}

function mapCategories(ids: number[]): CategorySlug[] {
  return ids
    .map((id) => CATEGORY_MAP[id])
    .filter((slug): slug is CategorySlug => Boolean(slug));
}

async function fetchAll<T>(endpoint: string): Promise<T[]> {
  const results: T[] = [];
  let page = 1;

  while (true) {
    const url = `${WP_BASE}/${endpoint}?per_page=100&page=${page}&_embed=1`;
    const response = await fetch(url);
    if (!response.ok) break;

    const batch = (await response.json()) as T[];
    if (batch.length === 0) break;

    results.push(...batch);
    page += 1;
  }

  return results;
}

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeJson(filePath: string, data: unknown) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

async function main() {
  const contentDir = path.join(process.cwd(), "content");
  const recipesDir = path.join(contentDir, "recipes");
  const pagesDir = path.join(contentDir, "pages");

  ensureDir(recipesDir);
  ensureDir(pagesDir);

  console.log("Fetching WordPress posts...");
  const posts = await fetchAll<WPPost>("posts");
  console.log(`Found ${posts.length} posts`);

  const recipeMeta: RecipeMeta[] = [];

  for (const post of posts) {
    if (post.status !== "publish") continue;

    const categories = mapCategories(post.categories);
    const primaryCategory = categories[0] ?? "dinner";
    const parsed = parseRecipe(post.content.rendered, post);
    const featured = post._embedded?.["wp:featuredmedia"]?.[0];
    const featuredImage =
      featured?.source_url ??
      extractFeaturedImageFromHtml(post.content.rendered);
    const seo = extractRankMathSeo(post.meta);

    const contentHtml = post.content.rendered;
    const intro =
      contentHtml.match(/<p class="wp-block-paragraph">([\s\S]*?)<\/p>/i)?.[1];
    const fullExcerpt = intro
      ? stripTags(intro)
      : stripTags(post.excerpt.rendered);

    const recipe: Recipe = {
      slug: post.slug,
      title: decodeHtml(post.title.rendered),
      excerpt: fullExcerpt,
      category: primaryCategory,
      categories,
      publishedAt: post.date,
      modifiedAt: post.modified,
      featuredImage,
      featuredImageAlt: featured?.alt_text || decodeHtml(post.title.rendered),
      contentHtml: post.content.rendered,
      seoTitle: seo.seoTitle,
      seoDescription: seo.seoDescription,
      ...parsed,
    };

    writeJson(path.join(recipesDir, `${post.slug}.json`), recipe);

    recipeMeta.push({
      slug: recipe.slug,
      title: recipe.title,
      excerpt: recipe.excerpt,
      category: recipe.category,
      categories: recipe.categories,
      publishedAt: recipe.publishedAt,
      modifiedAt: recipe.modifiedAt,
      featuredImage: recipe.featuredImage,
      featuredImageAlt: recipe.featuredImageAlt,
      prepTime: recipe.prepTime,
      cookTime: recipe.cookTime,
      totalTime: recipe.totalTime,
      servings: recipe.servings,
      calories: recipe.calories,
      cuisine: recipe.cuisine,
      course: recipe.course,
    });
  }

  console.log("Fetching WordPress pages...");
  const pages = await fetchAll<WPPage>("pages");
  const pageSlugs: string[] = [];

  for (const page of pages) {
    if (page.slug === "home") continue;

    const seo = extractRankMathSeo(page.meta);
    const staticPage: StaticPage = {
      slug: page.slug,
      title: decodeHtml(page.title.rendered),
      contentHtml: page.content.rendered,
      seoTitle: seo.seoTitle,
      seoDescription: seo.seoDescription,
    };

    writeJson(path.join(pagesDir, `${page.slug}.json`), staticPage);
    pageSlugs.push(page.slug);
  }

  writeJson(path.join(contentDir, "index.json"), {
    recipes: recipeMeta.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    ),
    pages: pageSlugs,
    importedAt: new Date().toISOString(),
    totalRecipes: recipeMeta.length,
  });

  console.log(`Imported ${recipeMeta.length} recipes and ${pageSlugs.length} pages.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
