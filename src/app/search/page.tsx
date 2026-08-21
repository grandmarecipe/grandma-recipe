import type { Metadata } from "next";
import Link from "next/link";
import { RecipeCard } from "@/components/RecipeCard";
import { getAllRecipeMeta } from "@/lib/content";
import { SEARCH_SEO, buildPageMetadata } from "@/lib/page-seo";

export const metadata: Metadata = buildPageMetadata(SEARCH_SEO, "/search/", {
  noIndex: true,
});

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "" } = await searchParams;
  const recipes = getAllRecipeMeta();
  const normalized = q.trim().toLowerCase();

  const results = normalized
    ? recipes.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(normalized) ||
          recipe.excerpt.toLowerCase().includes(normalized) ||
          recipe.category.includes(normalized),
      )
    : recipes.slice(0, 12);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-serif text-4xl text-[#8b1a1a]">Search Recipes</h1>
      <p className="mt-3 text-muted">
        Find your next cozy kitchen favorite by name, category, or ingredient.
      </p>

      <form className="mt-8" action="/search/" method="get">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Try lemon bread, breakfast, chicken..."
          className="w-full rounded-2xl border border-border bg-white px-5 py-4 text-lg outline-none ring-accent focus:ring-2"
        />
      </form>

      <p className="mt-4 text-sm text-muted">
        {results.length} result{results.length === 1 ? "" : "s"}
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {results.map((recipe) => (
          <RecipeCard key={recipe.slug} recipe={recipe} />
        ))}
      </div>

      {recipes.length === 0 && (
        <p className="mt-8 text-muted">
          Import recipes first with{" "}
          <Link href="/" className="text-accent">
            npm run import:wp
          </Link>
          .
        </p>
      )}
    </div>
  );
}
