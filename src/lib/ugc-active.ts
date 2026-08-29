import { unstable_cache } from "next/cache";
import { api } from "../../convex/_generated/api";
import { getConvexClient } from "./convex";

/** How often to refresh the “which recipes have UGC” lists. Writes revalidate sooner. */
const ACTIVE_SLUGS_CACHE_SECONDS = 86_400;

export const UGC_RATING_SLUGS_TAG = "ugc-rating-slugs";
export const UGC_COMMENT_SLUGS_TAG = "ugc-comment-slugs";

async function fetchRatingSlugs(): Promise<string[]> {
  try {
    return await getConvexClient().query(api.ratings.listActiveSlugs, {});
  } catch {
    return [];
  }
}

async function fetchCommentSlugs(): Promise<string[]> {
  try {
    return await getConvexClient().query(api.comments.listActiveSlugs, {});
  } catch {
    return [];
  }
}

export async function getSlugsWithRatings(): Promise<Set<string>> {
  const slugs = await unstable_cache(
    fetchRatingSlugs,
    ["ugc-rating-slugs"],
    { revalidate: ACTIVE_SLUGS_CACHE_SECONDS, tags: [UGC_RATING_SLUGS_TAG] },
  )();
  return new Set(slugs);
}

export async function getSlugsWithComments(): Promise<Set<string>> {
  const slugs = await unstable_cache(
    fetchCommentSlugs,
    ["ugc-comment-slugs"],
    { revalidate: ACTIVE_SLUGS_CACHE_SECONDS, tags: [UGC_COMMENT_SLUGS_TAG] },
  )();
  return new Set(slugs);
}

export async function recipeHasRatings(slug: string): Promise<boolean> {
  return (await getSlugsWithRatings()).has(slug);
}

export async function recipeHasComments(slug: string): Promise<boolean> {
  return (await getSlugsWithComments()).has(slug);
}
