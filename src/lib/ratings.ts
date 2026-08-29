import { unstable_cache } from "next/cache";
import { api } from "../../convex/_generated/api";
import { getConvexClient } from "./convex";
import { recipeHasRatings } from "./ugc-active";

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

/** Align with recipe page ISR; UGC writes still call revalidateTag. */
const UGC_CACHE_SECONDS = 3600;

async function fetchRecipeRating(slug: string): Promise<RecipeRatingAggregate> {
  try {
    return await getConvexClient().query(api.ratings.getBySlug, { slug });
  } catch {
    return EMPTY_RATING;
  }
}

export async function getRecipeRating(
  slug: string,
  options?: { force?: boolean },
): Promise<RecipeRatingAggregate> {
  if (options?.force) {
    return fetchRecipeRating(slug);
  }
  if (!(await recipeHasRatings(slug))) {
    return EMPTY_RATING;
  }

  return unstable_cache(
    async () => fetchRecipeRating(slug),
    ["recipe-rating", slug],
    { revalidate: UGC_CACHE_SECONDS, tags: [`rating-${slug}`] },
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
