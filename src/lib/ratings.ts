import { api } from "../../convex/_generated/api";
import { getConvexClient } from "./convex";

export interface RecipeRatingAggregate {
  ratingValue: number;
  ratingCount: number;
  ratingSum: number;
}

export async function getRecipeRating(
  slug: string,
): Promise<RecipeRatingAggregate> {
  return getConvexClient().query(api.ratings.getBySlug, { slug });
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
