import Link from "next/link";
import { RecipeCard } from "@/components/RecipeCard";
import type { RecipeMeta } from "@/lib/types";

interface HomeRecipeSectionProps {
  title: string;
  description: string;
  categoryHref: string;
  categoryLabel: string;
  recipes: RecipeMeta[];
  /** Prioritize the first card image (above-the-fold sections). */
  prioritizeFirstImage?: boolean;
}

export function HomeRecipeSection({
  title,
  description,
  categoryHref,
  categoryLabel,
  recipes,
  prioritizeFirstImage = false,
}: HomeRecipeSectionProps) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-serif text-3xl text-[#8b1a1a]">{title}</h2>
          <p className="mt-3 max-w-2xl text-muted">{description}</p>
        </div>
        <Link
          href={categoryHref}
          className="shrink-0 text-sm font-semibold text-accent"
        >
          {categoryLabel} →
        </Link>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {recipes.map((recipe, index) => (
          <RecipeCard
            key={recipe.slug}
            recipe={recipe}
            priority={prioritizeFirstImage && index === 0}
          />
        ))}
      </div>
    </section>
  );
}
