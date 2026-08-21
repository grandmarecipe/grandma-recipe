import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CategoryIntro } from "@/components/CategoryIntro";
import { CategoryPagination } from "@/components/CategoryPagination";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { RecipeCard } from "@/components/RecipeCard";
import { getCategoryContent } from "@/lib/categories";
import { getRecipesByCategory, isCategorySlug } from "@/lib/content";
import { CATEGORY_SEO, buildPageMetadata } from "@/lib/page-seo";
import { paginateItems } from "@/lib/pagination";
import { buildCategoryPageJsonLd } from "@/lib/seo";
import { CATEGORIES, SITE } from "@/lib/types";

const GRANDMA_PORTRAIT = "/brand/grandma-millie-233x300.webp";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return CATEGORIES.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!isCategorySlug(slug)) return {};

  const category = CATEGORIES.find((item) => item.slug === slug);
  if (!category) return {};

  return buildPageMetadata(CATEGORY_SEO[slug], `/category/${slug}/`, {
    image: category.image,
    imageAlt: `${category.name} recipes from ${SITE.name}`,
  });
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  if (!isCategorySlug(slug)) notFound();

  const category = CATEGORIES.find((item) => item.slug === slug);
  if (!category) notFound();

  const content = getCategoryContent(slug);
  const allRecipes = getRecipesByCategory(slug);
  const { items, page, totalPages, totalItems, startIndex } = paginateItems(
    allRecipes,
    1,
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
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div>
            <Breadcrumbs
              className="mb-4"
              items={[
                { label: "Home", href: "/" },
                { label: category.name },
              ]}
            />
            <p className="text-sm font-semibold tracking-wide text-accent uppercase">
              Category
            </p>
            <h1 className="mt-2 font-serif text-5xl text-[#8b1a1a]">
              {category.name}
            </h1>
            <div className="mt-6">
              <CategoryIntro intro={content.intro} />
            </div>

            <div className="mt-10 rounded-3xl border border-border bg-white p-6 shadow-sm">
              <h2 className="font-serif text-2xl text-accent-dark">
                Grandma&apos;s Picks
              </h2>
              <ul className="mt-4 space-y-3">
                {content.picks.map((pick) => (
                  <li key={pick.slug} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent" />
                    <Link
                      href={`/${pick.slug}/`}
                      className="text-lg font-semibold text-accent transition hover:text-accent-dark"
                    >
                      {pick.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-3xl border border-border bg-white p-6 text-center shadow-sm">
              <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-full border-4 border-white ring-2 ring-[#e8d4b8]">
                <Image
                  src={GRANDMA_PORTRAIT}
                  alt="Grandma Millie"
                  fill
                  className="object-cover"
                  sizes="112px"
                />
              </div>
              <p className="mt-4 text-sm leading-7 text-muted">
                I&apos;m <strong className="text-foreground">Grandma Millie</strong>
                , and I hope this cozy kitchen corner feels like home, full of
                love, laughter, and recipes passed down from flour-dusted counters
                and handwritten cards.
              </p>
              <Link
                href="/about-us/"
                className="mt-3 inline-block text-sm font-semibold text-accent"
              >
                See more about me →
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-8 flex items-end justify-between gap-4">
          <p className="text-sm text-muted">
            Showing {items.length} of {totalItems} recipes
            {totalPages > 1 ? ` · Page ${page} of ${totalPages}` : ""}
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

        {totalItems === 0 && (
          <p className="mt-10 rounded-2xl border border-border bg-white p-6 text-muted">
            No recipes imported yet. Run{" "}
            <code className="text-accent">npm run import:wp</code>.
          </p>
        )}
      </section>
    </div>
  );
}
