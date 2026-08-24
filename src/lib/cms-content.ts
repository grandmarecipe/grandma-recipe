import { getConvexClient } from "@/lib/convex";
import { api } from "../../convex/_generated/api";
import type { CategorySlug, Recipe, RecipeMeta } from "@/lib/types";
import {
  getAllRecipeMeta,
  getRecipeBySlug as getFileRecipeBySlug,
} from "@/lib/content";

type CmsArticle = {
  slug: string;
  title: string;
  excerpt: string;
  category: CategorySlug;
  categories: CategorySlug[];
  contentHtml: string;
  ingredients: string[];
  instructions: string[];
  featuredImage?: string;
  featuredImageAlt?: string;
  seoTitle?: string;
  seoDescription?: string;
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  servings?: string;
  calories?: string;
  cuisine?: string;
  course?: string;
  publishedAt: string;
  modifiedAt: string;
};

function articleToRecipe(article: CmsArticle): Recipe {
  return {
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    category: article.category,
    categories: article.categories,
    contentHtml: article.contentHtml,
    ingredients: article.ingredients,
    instructions: article.instructions,
    featuredImage: article.featuredImage,
    featuredImageAlt: article.featuredImageAlt,
    seoTitle: article.seoTitle,
    seoDescription: article.seoDescription,
    prepTime: article.prepTime,
    cookTime: article.cookTime,
    totalTime: article.totalTime,
    servings: article.servings,
    calories: article.calories,
    cuisine: article.cuisine,
    course: article.course,
    publishedAt: article.publishedAt,
    modifiedAt: article.modifiedAt,
  };
}

function articleToMeta(article: CmsArticle): RecipeMeta {
  const recipe = articleToRecipe(article);
  return {
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
  };
}

async function listPublishedCmsArticles(): Promise<CmsArticle[]> {
  try {
    const client = getConvexClient();
    const rows = await client.query(api.articles.listPublished, {});
    return rows as CmsArticle[];
  } catch {
    return [];
  }
}

export async function getRecipeBySlugResolved(
  slug: string,
): Promise<Recipe | null> {
  try {
    const client = getConvexClient();
    const cms = await client.query(api.articles.getPublishedBySlug, { slug });
    if (cms) return articleToRecipe(cms as CmsArticle);
  } catch {
    // Fall through to filesystem recipes if Convex is unavailable.
  }
  return getFileRecipeBySlug(slug);
}

export async function getAllRecipeMetaResolved(): Promise<RecipeMeta[]> {
  const files = getAllRecipeMeta();
  const cms = await listPublishedCmsArticles();
  const bySlug = new Map(files.map((recipe) => [recipe.slug, recipe]));
  for (const article of cms) {
    bySlug.set(article.slug, articleToMeta(article));
  }
  return Array.from(bySlug.values()).sort((a, b) =>
    a.publishedAt < b.publishedAt ? 1 : a.publishedAt > b.publishedAt ? -1 : 0,
  );
}

export async function getRecipesByCategoryResolved(
  category: CategorySlug,
): Promise<RecipeMeta[]> {
  const all = await getAllRecipeMetaResolved();
  return all.filter((recipe) => recipe.categories.includes(category));
}
