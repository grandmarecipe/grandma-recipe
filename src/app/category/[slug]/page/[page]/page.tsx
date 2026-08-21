import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CategoryPagination } from "@/components/CategoryPagination";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { RecipeCard } from "@/components/RecipeCard";
import { getCategoryContent } from "@/lib/categories";
import { getRecipesByCategory, isCategorySlug } from "@/lib/content";
import { CATEGORY_SEO, buildPageMetadata } from "@/lib/page-seo";
import {
  categoryPagePath,
  getTotalPages,
  paginateItems,
  parsePageParam,
} from "@/lib/pagination";
import { buildCategoryPageJsonLd } from "@/lib/seo";
import { CATEGORIES, type CategorySlug } from "@/lib/types";

interface PageProps {
  params: Promise<{ slug: string; page: string }>;
}

function getCategoryPages(slug: CategorySlug) {
  const total = getRecipesByCategory(slug).length;
  return getTotalPages(total);
}

export async function generateStaticParams() {
  return CATEGORIES.flatMap((category) => {
    const totalPages = getCategoryPages(category.slug);
    return Array.from({ length: Math.max(totalPages - 1, 0) }, (_, index) => ({
      slug: category.slug,
      page: String(index + 2),
    }));
  });
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug, page: pageParam } = await params;
  if (!isCategorySlug(slug)) return {};

  const pageNumber = parsePageParam(pageParam);
  if (!pageNumber || pageNumber < 2) return {};

  const category = CATEGORIES.find((item) => item.slug === slug);
  if (!category) return {};

  const seo = CATEGORY_SEO[slug];
  const path = categoryPagePath(slug, pageNumber);

  return buildPageMetadata(
    {
      title: `${category.name} Recipes – Page ${pageNumber} | Grandma Recipe`,
      description: `${seo.description} Browse page ${pageNumber} of our ${category.name.toLowerCase()} collection.`,
    },
    path,
    {
      image: category.image,
      imageAlt: `${category.name} recipes from Grandma Recipe`,
    },
  );
}

export default async function CategoryPagedPage({ params }: PageProps) {
  const { slug, page: pageParam } = await params;
  if (!isCategorySlug(slug)) notFound();

  const pageNumber = parsePageParam(pageParam);
  if (!pageNumber) notFound();
  if (pageNumber === 1) redirect(categoryPagePath(slug, 1));

  const category = CATEGORIES.find((item) => item.slug === slug);
  if (!category) notFound();

  const content = getCategoryContent(slug);
  const allRecipes = getRecipesByCategory(slug);
  const totalPages = getTotalPages(allRecipes.length);

  if (pageNumber > totalPages) notFound();

  const { items, page, totalItems, startIndex } = paginateItems(
    allRecipes,
    pageNumber,
  );

  return (
    <div className="bg-[#fffdf9]">
      <JsonLd
        data={buildCategoryPageJsonLd({
          slug,
          name: category.name,
          description: content.seoDescription,
          recipeSlugs: items.map((recipe) => recipe.slug),
          page,
          startPosition: startIndex,
        })}
      />

      <section className="border-b border-border bg-[radial-gradient(circle_at_top,#fff7ef_0%,#fffdf9_55%,#f8f2ea_100%)]">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <Breadcrumbs
            className="mb-4"
            items={[
              { label: "Home", href: "/" },
              { label: category.name, href: categoryPagePath(slug, 1) },
              { label: `Page ${page}` },
            ]}
          />
          <p className="text-sm font-semibold tracking-wide text-accent uppercase">
            Category
          </p>
          <h1 className="mt-2 font-serif text-5xl text-[#8b1a1a]">
            {category.name}{" "}
            <span className="text-3xl text-muted">– Page {page}</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            More {category.name.toLowerCase()} recipes from Grandma&apos;s
            kitchen.{" "}
            <Link
              href={categoryPagePath(slug, 1)}
              className="font-semibold text-accent underline-offset-2 hover:underline"
            >
              Back to page 1
            </Link>
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-8 flex items-end justify-between gap-4">
          <p className="text-sm text-muted">
            Showing {startIndex + 1}–{startIndex + items.length} of {totalItems}{" "}
            recipes · Page {page} of {totalPages}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((recipe) => (
            <RecipeCard key={recipe.slug} recipe={recipe} />
          ))}
        </div>

        <CategoryPagination
          slug={slug}
          page={page}
          totalPages={totalPages}
        />
      </section>
    </div>
  );
}
