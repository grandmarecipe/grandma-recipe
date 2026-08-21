import type { MetadataRoute } from "next";
import {
  getAllRecipeMeta,
  getRecipesByCategory,
  getStaticPageSlugs,
} from "@/lib/content";
import { getTotalPages } from "@/lib/pagination";
import { CATEGORIES, SITE } from "@/lib/types";

export default function sitemap(): MetadataRoute.Sitemap {
  const recipes = getAllRecipeMeta();
  const pages = getStaticPageSlugs();

  const categoryPages = CATEGORIES.flatMap((category) => {
    const totalPages = getTotalPages(
      getRecipesByCategory(category.slug).length,
    );

    return Array.from({ length: totalPages }, (_, index) => {
      const page = index + 1;
      return {
        url:
          page === 1
            ? `${SITE.url}/category/${category.slug}/`
            : `${SITE.url}/category/${category.slug}/page/${page}/`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: page === 1 ? 0.8 : 0.6,
      };
    });
  });

  return [
    {
      url: `${SITE.url}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE.url}/how-we-test-recipes/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE.url}/affiliate-disclosure/`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    ...categoryPages,
    ...pages.map((slug) => ({
      url: `${SITE.url}/${slug}/`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...recipes.map((recipe) => ({
      url: `${SITE.url}/${recipe.slug}/`,
      lastModified: new Date(recipe.modifiedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
