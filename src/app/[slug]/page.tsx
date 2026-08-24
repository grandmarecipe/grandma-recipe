import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { LegalPage } from "@/components/LegalPage";
import { RecipeBody } from "@/components/RecipeBody";
import { RecipeHero } from "@/components/RecipeHero";
import {
  getAllRecipeSlugs,
  getRelatedRecipes,
  getStaticPage,
  getStaticPageSlugs,
  resolveSlug,
} from "@/lib/content";
import { getRecipeBySlugResolved } from "@/lib/cms-content";
import { buildRecipePageJsonLd, buildWebPageJsonLd, resolveMetadataTitle, resolveSeoDescription } from "@/lib/seo";
import { isLegalPage, prepareLegalPageHtml } from "@/lib/legal-pages";
import { STATIC_PAGE_SEO, buildPageMetadata, buildSocialMetadata } from "@/lib/page-seo";
import { getRecipeRating } from "@/lib/ratings";
import { getRecipeComments } from "@/lib/comments";
import { CATEGORIES, SITE } from "@/lib/types";
import { RelatedRecipes } from "@/components/RelatedRecipes";

/** Allow recipe pages to refresh after new ratings. */
export const revalidate = 300;

interface PageProps {
  params: Promise<{ slug: string }>;
}

const CUSTOM_PAGES = new Set(["about-us", "contact-us"]);

export async function generateStaticParams() {
  const recipeSlugs = getAllRecipeSlugs().map((slug) => ({ slug }));
  const pageSlugs = getStaticPageSlugs()
    .filter((slug) => !CUSTOM_PAGES.has(slug))
    .map((slug) => ({ slug }));
  return [...recipeSlugs, ...pageSlugs];
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cmsRecipe = await getRecipeBySlugResolved(slug);
  const kind = cmsRecipe ? "recipe" : resolveSlug(slug);

  if (kind === "recipe") {
    const recipe = cmsRecipe;
    if (!recipe) return {};
    const title = resolveMetadataTitle(recipe.seoTitle, recipe.title);
    const description = resolveSeoDescription(recipe);
    const pageUrl = `${SITE.url}/${slug}/`;
    return {
      title,
      description,
      alternates: {
        canonical: pageUrl,
      },
      ...buildSocialMetadata({
        title: recipe.seoTitle || recipe.title,
        description,
        url: pageUrl,
        image: recipe.featuredImage || SITE.defaultOgImage,
        imageAlt:
          recipe.featuredImageAlt ||
          `${recipe.title} — homemade recipe from ${SITE.name}`,
        type: "article",
      }),
    };
  }

  if (kind === "page") {
    const page = getStaticPage(slug);
    if (!page) return {};
    const seo = STATIC_PAGE_SEO[slug];
    if (seo) {
      return buildPageMetadata(seo, `/${slug}/`);
    }
    const title = page.seoTitle || page.title;
    const description = page.seoDescription;
    const pageUrl = `${SITE.url}/${slug}/`;
    return {
      title: resolveMetadataTitle(page.seoTitle, page.title),
      description,
      alternates: {
        canonical: pageUrl,
      },
      ...buildSocialMetadata({
        title,
        description,
        url: pageUrl,
        image: SITE.defaultOgImage,
      }),
    };
  }

  return {};
}

export default async function ContSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const cmsRecipe = await getRecipeBySlugResolved(slug);
  const kind = cmsRecipe ? "recipe" : resolveSlug(slug);

  if (kind === "recipe") {
    const recipe = cmsRecipe;
    if (!recipe) notFound();
    const rating = await getRecipeRating(slug);
    const comments = await getRecipeComments(slug);
    const related = getRelatedRecipes(slug, recipe.category, 3);
    const categoryName =
      CATEGORIES.find((item) => item.slug === recipe.category)?.name ||
      recipe.category;

    return (
      <>
        <JsonLd data={buildRecipePageJsonLd(recipe, rating, comments)} />
        <RecipeHero recipe={recipe} rating={rating} />
        <RecipeBody recipe={recipe} rating={rating} comments={comments} />
        <RelatedRecipes
          recipes={related}
          categoryName={categoryName}
          categoryHref={`/category/${recipe.category}/`}
        />
      </>
    );
  }

  if (kind === "page") {
    const page = getStaticPage(slug);
    if (!page) notFound();

    const seo = STATIC_PAGE_SEO[slug];
    const description = seo?.description || page.seoDescription;

    if (isLegalPage(slug)) {
      const prepared = prepareLegalPageHtml(page.contentHtml);

      return (
        <>
          <JsonLd
            data={{
              "@context": "https://schema.org",
              ...buildWebPageJsonLd({
                name: page.title,
                description,
                url: `${SITE.url}/${slug}/`,
              }),
            }}
          />
          <LegalPage
            title={page.title}
            slug={slug}
            contentHtml={prepared.contentHtml}
            meta={prepared.meta}
            sections={prepared.sections}
          />
        </>
      );
    }

    return (
      <article className="mx-auto max-w-3xl px-4 py-12">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            ...buildWebPageJsonLd({
              name: page.title,
              description,
              url: `${SITE.url}/${slug}/`,
            }),
          }}
        />
        <h1 className="font-serif text-4xl text-[#8b1a1a]">{page.title}</h1>
        <div
          className="prose-page mt-8 max-w-none text-muted"
          dangerouslySetInnerHTML={{ __html: page.contentHtml }}
        />
      </article>
    );
  }

  notFound();
}
