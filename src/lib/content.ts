import fs from "fs";
import path from "path";
import type { CategorySlug, Recipe, RecipeMeta, StaticPage } from "./types";
import { extractFeaturedImageFromHtml, extractIntroFromHtml } from "./html";
import { CATEGORY_SLUGS } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content");
const RECIPES_DIR = path.join(CONTENT_DIR, "recipes");
const PAGES_DIR = path.join(CONTENT_DIR, "pages");
const INDEX_FILE = path.join(CONTENT_DIR, "index.json");

interface ContentIndex {
  recipes: RecipeMeta[];
  pages: string[];
}

function readJsonFile<T>(filePath: string): T | null {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function getIndex(): ContentIndex {
  return (
    readJsonFile<ContentIndex>(INDEX_FILE) ?? {
      recipes: [],
      pages: [],
    }
  );
}

function withResolvedImage<T extends Pick<Recipe, "featuredImage" | "contentHtml">>(
  recipe: T,
): T {
  if (recipe.featuredImage) return recipe;
  const fallback = extractFeaturedImageFromHtml(recipe.contentHtml);
  if (!fallback) return recipe;
  return { ...recipe, featuredImage: fallback };
}

function withResolvedIntro<T extends Pick<Recipe, "excerpt" | "contentHtml">>(
  recipe: T,
): T {
  const intro = extractIntroFromHtml(recipe.contentHtml);
  if (!intro) return recipe;
  return { ...recipe, excerpt: intro };
}

function enrichRecipe<T extends Recipe>(recipe: T): T {
  return withResolvedIntro(withResolvedImage(recipe));
}

export function getAllRecipeMeta(): RecipeMeta[] {
  return getIndex().recipes.map((recipe) => {
    const full = readJsonFile<Recipe>(path.join(RECIPES_DIR, `${recipe.slug}.json`));
    if (!full) return recipe;

    const enriched = enrichRecipe(full);
    return {
      ...recipe,
      excerpt: enriched.excerpt,
      featuredImage: enriched.featuredImage ?? recipe.featuredImage,
    };
  });
}

export function getRecipeBySlug(slug: string): Recipe | null {
  const recipe = readJsonFile<Recipe>(path.join(RECIPES_DIR, `${slug}.json`));
  return recipe ? enrichRecipe(recipe) : null;
}

export function getRecipesByCategory(category: CategorySlug): RecipeMeta[] {
  return getAllRecipeMeta().filter((recipe) =>
    recipe.categories.includes(category),
  );
}

export function getRelatedRecipes(
  slug: string,
  category: CategorySlug,
  limit = 3,
): RecipeMeta[] {
  return getRecipesByCategory(category)
    .filter((recipe) => recipe.slug !== slug)
    .slice(0, limit);
}

export function getFeaturedRecipes(limit = 6): RecipeMeta[] {
  return getAllRecipeMeta().slice(0, limit);
}

export function getAllRecipeSlugs(): string[] {
  return getAllRecipeMeta().map((recipe) => recipe.slug);
}

export function getStaticPageSlugs(): string[] {
  return getIndex().pages.filter((slug) => slug !== "home");
}

export function getStaticPage(slug: string): StaticPage | null {
  return readJsonFile<StaticPage>(path.join(PAGES_DIR, `${slug}.json`));
}

export function isCategorySlug(slug: string): slug is CategorySlug {
  return CATEGORY_SLUGS.has(slug);
}

export function resolveSlug(slug: string): "recipe" | "page" | null {
  if (getRecipeBySlug(slug)) return "recipe";
  if (getStaticPage(slug)) return "page";
  return null;
}

export function hasImportedContent(): boolean {
  return fs.existsSync(INDEX_FILE) && getAllRecipeMeta().length > 0;
}

export { stripHtml } from "./html";
