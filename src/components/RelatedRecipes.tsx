import Link from "next/link";
import { RecipeCard } from "@/components/RecipeCard";
import type { RecipeMeta } from "@/lib/types";

interface RelatedRecipesProps {
  recipes: RecipeMeta[];
  categoryName: string;
  categoryHref: string;
}

export function RelatedRecipes({
  recipes,
  categoryName,
  categoryHref,
}: RelatedRecipesProps) {
  if (recipes.length === 0) return null;

  return (
    <section className="no-print border-t border-border bg-[#fffdf9]">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-wide text-accent uppercase">
              More to cook
            </p>
            <h2 className="mt-2 font-serif text-3xl text-[#8b1a1a]">
              Related {categoryName} recipes
            </h2>
            <p className="mt-2 max-w-2xl text-muted">
              More cozy favorites from the same kitchen shelf.
            </p>
          </div>
          <Link
            href={categoryHref}
            className="shrink-0 text-sm font-semibold text-accent transition hover:text-accent-dark"
          >
            Browse all {categoryName.toLowerCase()} →
          </Link>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.slug} recipe={recipe} />
          ))}
        </div>
      </div>
    </section>
  );
}
