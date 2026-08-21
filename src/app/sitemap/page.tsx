import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import {
  getAllRecipeMeta,
  getRecipesByCategory,
  getStaticPage,
} from "@/lib/content";
import { STATIC_PAGE_SEO, buildPageMetadata } from "@/lib/page-seo";
import { CATEGORIES, SITE } from "@/lib/types";

export const metadata: Metadata = buildPageMetadata(
  STATIC_PAGE_SEO.sitemap,
  "/sitemap/",
);

const MAIN_PAGES: Array<{ href: string; label: string }> = [
  { href: "/", label: "Home" },
  { href: "/about-us/", label: "About Us" },
  { href: "/how-we-test-recipes/", label: "How We Test Recipes" },
  { href: "/contact-us/", label: "Contact Us" },
  { href: "/search/", label: "Search Recipes" },
  { href: "/affiliate-disclosure/", label: "Affiliate Disclosure" },
  { href: "/disclaimers/", label: "Disclaimers" },
  { href: "/privacy-policy/", label: "Privacy Policy" },
  { href: "/terms-of-service/", label: "Terms of Service" },
  {
    href: "/gdpr-ccpa-privacy-policy-for-grandma-recipe/",
    label: "GDPR & CCPA Privacy",
  },
];

function pageTitle(slug: string, fallback: string) {
  return getStaticPage(slug)?.title || fallback;
}

export default function HtmlSitemapPage() {
  const recipes = getAllRecipeMeta().sort((a, b) =>
    a.title.localeCompare(b.title),
  );

  const mainPages = MAIN_PAGES.map((page) => {
    const slug = page.href.replace(/^\/|\/$/g, "");
    if (!slug) return page;
    return {
      ...page,
      label: pageTitle(slug, page.label),
    };
  });

  return (
    <div className="bg-[#fffdf9]">
      <section className="border-b border-border bg-[radial-gradient(circle_at_top,#fff7ef_0%,#fffdf9_55%,#f8f2ea_100%)]">
        <div className="mx-auto max-w-6xl px-4 py-12 lg:py-16">
          <Breadcrumbs
            className="mb-6"
            items={[{ label: "Home", href: "/" }, { label: "Sitemap" }]}
          />
          <p className="text-sm font-semibold tracking-[0.22em] text-gold uppercase">
            Site map
          </p>
          <h1 className="mt-3 font-serif text-5xl text-[#8b1a1a] sm:text-6xl">
            Sitemap
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
            Browse every section of {SITE.name} — pages, recipe categories, and
            all {recipes.length} recipes listed below.
          </p>
          <nav
            aria-label="Sitemap sections"
            className="mt-8 flex flex-wrap gap-3 text-sm"
          >
            <a
              href="#pages"
              className="rounded-full border border-border bg-white px-4 py-2 font-medium text-accent transition hover:border-accent"
            >
              Pages
            </a>
            <a
              href="#categories"
              className="rounded-full border border-border bg-white px-4 py-2 font-medium text-accent transition hover:border-accent"
            >
              Categories
            </a>
            <a
              href="#recipes"
              className="rounded-full border border-border bg-white px-4 py-2 font-medium text-accent transition hover:border-accent"
            >
              Recipes
            </a>
          </nav>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-14 px-4 py-12">
        <section id="pages" className="scroll-mt-28">
          <h2 className="font-serif text-3xl text-[#8b1a1a]">Pages</h2>
          <ul className="mt-5 columns-1 gap-x-10 sm:columns-2">
            {mainPages.map((page) => (
              <li key={page.href} className="mb-2 break-inside-avoid">
                <Link
                  href={page.href}
                  className="text-muted transition hover:text-accent"
                >
                  {page.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section id="categories" className="scroll-mt-28">
          <h2 className="font-serif text-3xl text-[#8b1a1a]">Categories</h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((category) => {
              const count = getRecipesByCategory(category.slug).length;
              return (
                <li key={category.slug}>
                  <Link
                    href={`/category/${category.slug}/`}
                    className="block rounded-2xl border border-border bg-white p-5 transition hover:border-accent"
                  >
                    <span className="font-serif text-xl text-accent">
                      {category.name}
                    </span>
                    <span className="mt-1 block text-sm text-muted">
                      {count} recipes
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <section id="recipes" className="scroll-mt-28">
          <h2 className="font-serif text-3xl text-[#8b1a1a]">Recipes</h2>
          <p className="mt-2 text-sm text-muted">
            Grouped by category. Jump to a category with the links above.
          </p>

          <div className="mt-8 space-y-10">
            {CATEGORIES.map((category) => {
              const items = getRecipesByCategory(category.slug).sort((a, b) =>
                a.title.localeCompare(b.title),
              );
              if (items.length === 0) return null;

              return (
                <div key={category.slug} id={`recipes-${category.slug}`}>
                  <div className="mb-4 flex items-end justify-between gap-4 border-b border-border pb-2">
                    <h3 className="font-serif text-2xl text-accent">
                      {category.name}
                    </h3>
                    <Link
                      href={`/category/${category.slug}/`}
                      className="text-sm font-medium text-muted transition hover:text-accent"
                    >
                      View category →
                    </Link>
                  </div>
                  <ul className="columns-1 gap-x-10 sm:columns-2 lg:columns-3">
                    {items.map((recipe) => (
                      <li
                        key={recipe.slug}
                        className="mb-2 break-inside-avoid"
                      >
                        <Link
                          href={`/${recipe.slug}/`}
                          className="text-sm text-muted transition hover:text-accent"
                        >
                          {recipe.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
