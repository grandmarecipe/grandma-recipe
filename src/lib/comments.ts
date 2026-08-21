import { api } from "../../convex/_generated/api";
import { getConvexClient } from "./convex";

export interface RecipeComment {
  id: string;
  name: string;
  body: string;
  createdAt: string;
}

export async function getRecipeComments(
  slug: string,
): Promise<RecipeComment[]> {
  return getConvexClient().query(api.comments.listBySlug, { slug });
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
