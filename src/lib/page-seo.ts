import type { Metadata } from "next";
import type { CategorySlug } from "./types";
import { SITE } from "./types";

export interface PageSeo {
  title: string;
  description: string;
}

/**
 * Target lengths for SERP display:
 * - Title: 50–60 characters
 * - Meta description: 150–160 characters
 *
 * Copy keeps Rank Math keywords from the live WordPress site
 * (grandma recipes, breakfast/lunch/dinner/snacks/dessert recipes,
 * comfort food, Grandma Millie) while fitting those limits.
 */
export const HOME_SEO: PageSeo = {
  title: "Easy Grandma Recipes | Homestyle Comfort Food Made Simple",
  description: SITE.description,
};

export const CATEGORY_SEO: Record<CategorySlug, PageSeo> = {
  breakfast: {
    title: "Easy Breakfast Recipes for Busy Mornings | Grandma Recipe",
    description:
      "Start your day with easy breakfast recipes from Grandma's kitchen—pancakes, eggs, oatmeal, and hearty grab-and-go ideas for busy mornings or lazy weekends.",
  },
  lunch: {
    title: "Easy Lunch Recipes | Homemade Sandwiches, Salads & Soups",
    description:
      "Find wholesome lunch recipes for work or family meals—easy sandwiches, salads, soups, and light homemade dishes the whole family will enjoy packing or serving.",
  },
  dinner: {
    title: "Easy Dinner Recipes | Comfort Food from Grandma's Kitchen",
    description:
      "End the day with easy dinner recipes from Grandma's kitchen—hearty mains, casseroles, and one-pot meals for busy weeknights or cozy family gatherings.",
  },
  snacks: {
    title: "Easy Snack Recipes | Savory Bites and Sweet Homemade Treats",
    description:
      "Craving a cozy bite? Try easy snack recipes with savory chips, sweet treats, and homemade extras perfect for movie nights, lunchboxes, or surprise guests.",
  },
  dessert: {
    title: "Easy Dessert Recipes | Cakes, Pies, Cookies & No-Bake",
    description:
      "Indulge in easy dessert recipes—chocolate cakes, fruity pies, cookies, and no-bake favorites passed down through generations in Grandma's kitchen at home.",
  },
};

export const STATIC_PAGE_SEO: Record<string, PageSeo> = {
  "about-us": {
    title: "About Grandma Millie & Our Recipe Story | Grandma Recipe",
    description:
      "Meet Grandma Millie at GrandmaRecipe.com—homestyle recipes, kitchen stories, and vintage comfort food made with love from flour-dusted counters at home.",
  },
  "how-we-test-recipes": {
    title: "How We Test Recipes | Kitchen Standards at Grandma Recipe",
    description:
      "See how Grandma Millie kitchen-tests every recipe—real home cooking, clear steps, honest notes, and updates when a better method comes along.",
  },
  "affiliate-disclosure": {
    title: "Affiliate Disclosure | How Grandma Recipe Uses Affiliate Links",
    description:
      "Learn how Grandma Recipe may earn commissions from affiliate links at no extra cost to you, and how recommendations stay honest to home cooks.",
  },
  "contact-us": {
    title: "Contact Grandma Recipe | Questions, Ideas & Kitchen Help",
    description:
      "Get in touch with Grandma Millie for recipe questions, family favorites, collaborations, or a friendly hello from this cozy kitchen corner of the internet.",
  },
  "privacy-policy": {
    title: "Privacy Policy | How Grandma Recipe Uses Your Data",
    description:
      "Read how Grandma Recipe collects, uses, and protects your information, including cookies, analytics, and advertising choices on this homestyle recipe website.",
  },
  disclaimers: {
    title: "Disclaimers | Recipe Advice, Nutrition & Site Information",
    description:
      "Review Grandma Recipe disclaimers on nutrition, cooking results, and affiliate links so you can cook from our recipes with clear, practical expectations.",
  },
  "terms-of-service": {
    title: "Terms of Service | Using the Grandma Recipe Website",
    description:
      "These terms explain how you may use GrandmaRecipe.com, including recipes, content, and site features. Please read them before cooking from or sharing recipes.",
  },
  "gdpr-ccpa-privacy-policy-for-grandma-recipe": {
    title: "GDPR & CCPA Privacy Rights for Grandma Recipe Visitors",
    description:
      "Learn your GDPR and CCPA privacy rights at Grandma Recipe, including how to request access, deletion, or limits on how we use your personal information.",
  },
};

export const SEARCH_SEO: PageSeo = {
  title: "Search Grandma Recipes | Find Easy Homestyle Comfort Food",
  description:
    "Search hundreds of easy grandma recipes by name, category, or ingredient. Find breakfast, lunch, dinner, snacks, and dessert ideas made with love at home.",
};

function socialImages(image?: string, alt?: string) {
  const url = image || SITE.defaultOgImage;
  return [
    {
      url,
      width: 1200,
      height: 630,
      alt: alt?.trim() || SITE.name,
    },
  ];
}

export function buildPageMetadata(
  seo: PageSeo,
  path: string,
  options?: { noIndex?: boolean; image?: string; imageAlt?: string },
): Metadata {
  const url = `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
  const images = socialImages(options?.image, options?.imageAlt);

  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: {
      canonical: url,
    },
    ...(options?.noIndex
      ? { robots: { index: false, follow: false } }
      : {}),
    openGraph: {
      title: seo.title,
      description: seo.description,
      url,
      type: "website",
      siteName: SITE.name,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: images.map((image) => image.url),
    },
  };
}

export function buildSocialMetadata({
  title,
  description,
  url,
  image,
  imageAlt,
  type = "website",
}: {
  title: string;
  description?: string;
  url: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
}): Pick<Metadata, "openGraph" | "twitter"> {
  const images = socialImages(image, imageAlt);

  return {
    openGraph: {
      title,
      description,
      url,
      type,
      siteName: SITE.name,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.map((item) => item.url),
    },
  };
}
