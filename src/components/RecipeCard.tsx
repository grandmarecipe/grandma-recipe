import Link from "next/link";
import { ContentImage } from "@/components/ContentImage";
import type { RecipeMeta } from "@/lib/types";

interface RecipeCardProps {
  recipe: RecipeMeta;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <Link href={`/${recipe.slug}/`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-[#f3e8dc]">
          {recipe.featuredImage ? (
            <ContentImage
              src={recipe.featuredImage}
              alt={recipe.featuredImageAlt || recipe.title}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center font-serif text-accent">
              {recipe.title}
            </div>
          )}
        </div>
        <div className="p-5">
          <p className="text-xs font-semibold tracking-wide text-accent uppercase">
            {recipe.category}
          </p>
          <h3 className="mt-2 font-serif text-xl text-foreground">
            {recipe.title}
          </h3>
          <p className="mt-3 line-clamp-3 text-sm text-muted">{recipe.excerpt}</p>
          <p className="mt-4 text-sm font-semibold text-accent">
            Continue reading →
          </p>
        </div>
      </Link>
    </article>
  );
}
