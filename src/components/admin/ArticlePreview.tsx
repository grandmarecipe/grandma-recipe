"use client";

import { useEffect } from "react";
import { RecipeBody } from "@/components/RecipeBody";
import { RecipeHero } from "@/components/RecipeHero";
import type { Recipe } from "@/lib/types";

export type ArticlePreviewInput = {
  slug: string;
  title: string;
  excerpt: string;
  category: Recipe["category"];
  categories: Recipe["category"][];
  contentHtml: string;
  ingredientsText: string;
  instructionsText: string;
  featuredImage: string;
  featuredImageAlt: string;
  seoTitle: string;
  seoDescription: string;
  prepTime: string;
  cookTime: string;
  totalTime: string;
  servings: string;
  calories: string;
  cuisine: string;
  course: string;
  publishedAt: string;
  status: "draft" | "published";
};

function linesToList(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function formToPreviewRecipe(input: ArticlePreviewInput): Recipe {
  const now = new Date().toISOString();
  const publishedAt = input.publishedAt
    ? new Date(input.publishedAt).toISOString()
    : now;

  return {
    slug: input.slug.trim() || "preview",
    title: input.title.trim() || "Untitled recipe",
    excerpt: input.excerpt.trim() || "Preview excerpt",
    category: input.category,
    categories:
      input.categories.length > 0 ? input.categories : [input.category],
    contentHtml: input.contentHtml,
    ingredients: linesToList(input.ingredientsText),
    instructions: linesToList(input.instructionsText),
    featuredImage: input.featuredImage.trim() || undefined,
    featuredImageAlt: input.featuredImageAlt.trim() || undefined,
    prepTime: input.prepTime.trim() || undefined,
    cookTime: input.cookTime.trim() || undefined,
    totalTime: input.totalTime.trim() || undefined,
    servings: input.servings.trim() || undefined,
    calories: input.calories.trim() || undefined,
    cuisine: input.cuisine.trim() || undefined,
    course: input.course.trim() || undefined,
    seoTitle: input.seoTitle.trim() || undefined,
    seoDescription: input.seoDescription.trim() || undefined,
    publishedAt,
    modifiedAt: now,
  };
}

type Props = {
  input: ArticlePreviewInput;
  liveUrl?: string;
  onClose: () => void;
};

export function ArticlePreview({ input, liveUrl, onClose }: Props) {
  const recipe = formToPreviewRecipe(input);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#fffdf9]">
      <div className="sticky top-0 z-10 border-b border-[#e5d8c8] bg-[#fffdf9]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#b8860b]">
              Preview
            </p>
            <p className="text-sm text-[#6b5b4f]">
              {input.status === "published"
                ? "Published articles look like this on the live site."
                : "Draft preview — save & publish to go live."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {liveUrl ? (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-[#d4a574] px-4 py-2 text-sm font-semibold text-[#b8860b]"
              >
                Open live page
              </a>
            ) : null}
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-[#5a822b] px-4 py-2 text-sm font-semibold text-white"
            >
              Back to editor
            </button>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <RecipeHero recipe={recipe} />
        <RecipeBody recipe={recipe} preview />
      </div>
    </div>
  );
}
