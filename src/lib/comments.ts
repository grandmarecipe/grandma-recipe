import { unstable_cache } from "next/cache";
import { api } from "../../convex/_generated/api";
import { getConvexClient } from "./convex";

export interface RecipeComment {
  id: string;
  name: string;
  body: string;
  createdAt: string;
}

/** Align with recipe page ISR; UGC writes still call revalidateTag. */
const UGC_CACHE_SECONDS = 3600;

async function fetchRecipeComments(slug: string): Promise<RecipeComment[]> {
  try {
    return await getConvexClient().query(api.comments.listBySlug, { slug });
  } catch {
    return [];
  }
}

export async function getRecipeComments(
  slug: string,
): Promise<RecipeComment[]> {
  return unstable_cache(
    async () => fetchRecipeComments(slug),
    ["recipe-comments", slug],
    { revalidate: UGC_CACHE_SECONDS, tags: [`comments-${slug}`] },
  )();
}

export async function addRecipeComment(
  slug: string,
  input: { name: string; body: string; website?: string },
): Promise<RecipeComment> {
  return getConvexClient().mutation(api.comments.add, {
    slug,
    name: input.name,
    body: input.body,
    website: input.website,
  });
}

export function commentedCookieName(slug: string) {
  return `gr_commented_${slug.replace(/[^a-z0-9_-]/gi, "_")}`;
}

export function formatCommentDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso.slice(0, 10);
  }
}
