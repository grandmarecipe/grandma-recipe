import { unstable_cache } from "next/cache";
import { api } from "../../convex/_generated/api";
import { getConvexClient } from "./convex";

export interface RecipeRatingAggregate {
  ratingValue: number;
  ratingCount: number;
  ratingSum: number;
}

const EMPTY_RATING: RecipeRatingAggregate = {
  ratingValue: 0,
  ratingCount: 0,
  ratingSum: 0,
};

async function fetchRecipeRating(slug: string): Promise<RecipeRatingAggregate> {
  try {
    return await getConvexClient().query(api.ratings.getBySlug, { slug });
  } catch {
    return EMPTY_RATING;
  }
}

export async function getRecipeRating(
  slug: string,
): Promise<RecipeRatingAggregate> {
  return unstable_cache(
    async () => fetchRecipeRating(slug),
    ["recipe-rating", slug],
    { revalidate: 300, tags: [`rating-${slug}`] },
  )();
}

export async function addRecipeRating(
  slug: string,
  stars: number,
): Promise<RecipeRatingAggregate> {
  return getConvexClient().mutation(api.ratings.add, { slug, stars });
}

export function ratedCookieName(slug: string) {
  return `gr_rated_${slug.replace(/[^a-z0-9_-]/gi, "_")}`;
}
