import type { ConvexHttpClient } from "convex/browser";
import type { Id } from "../../convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";
import { slugifyTitle } from "@/lib/article-generate-prompts";

export type ExistingForGenerate = {
  _id: Id<"articles">;
  slug: string;
  title: string;
  status: "draft" | "published";
  focusKeyword?: string;
  matchType: "slug" | "keyword";
};

/**
 * Duplicate check using functions already on the Convex deployment
 * (`getBySlug` + `findByFocusKeyword`). Prefer this until
 * `articles:findExistingForGenerate` is pushed via `npx convex dev`.
 */
export async function findExistingForGenerate(
  convex: ConvexHttpClient,
  token: string,
  input: string,
): Promise<ExistingForGenerate | null> {
  const trimmed = input.trim();
  if (trimmed.length < 2) return null;

  const slugCandidate = slugifyTitle(trimmed);
  if (slugCandidate) {
    const bySlug = await convex.query(api.articles.getBySlug, {
      token,
      slug: slugCandidate,
    });
    if (bySlug) {
      return {
        _id: bySlug._id,
        slug: bySlug.slug,
        title: bySlug.title,
        status: bySlug.status,
        focusKeyword: bySlug.focusKeyword,
        matchType: "slug",
      };
    }
  }

  const byKeyword = await convex.query(api.articles.findByFocusKeyword, {
    token,
    keyword: trimmed,
  });
  if (!byKeyword) return null;

  return {
    _id: byKeyword._id,
    slug: byKeyword.slug,
    title: byKeyword.title,
    status: byKeyword.status,
    focusKeyword: byKeyword.focusKeyword,
    matchType: "keyword",
  };
}
