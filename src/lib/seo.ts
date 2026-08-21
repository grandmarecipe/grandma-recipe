import type { CategorySlug, Recipe } from "./types";
import { SITE } from "./types";
import type { RecipeRatingAggregate } from "./ratings";
import type { RecipeComment } from "./comments";
import { HOME_FAQS } from "./home-faqs";
import {
  cleanSchema,
  extractFaqsFromHtml,
  extractSnapshotMeta,
  parseDurationToIso,
  type FaqItem,
} from "./schema-data";
import {
  isFullRecipe,
  resolveSeoDescription,
} from "./seo-text";

const SCHEMA_CONTEXT = "https://schema.org";

/** Rank Math titles are full titles — bypass the layout `%s | Site` template. */
export function resolveMetadataTitle(
  seoTitle?: string,
  fallback?: string,
): string | { absolute: string } {
  if (seoTitle) return { absolute: seoTitle };
  return fallback ?? SITE.name;
}

export { cleanSeoText, resolveSeoDescription, isFullRecipe } from "./seo-text";

export const SCHEMA_IDS = {
  organization: `${SITE.url}/#organization`,
  website: `${SITE.url}/#website`,
  author: `${SITE.url}/about-us/#grandma-millie`,
};

function recipeUrl(slug: string) {
  return `${SITE.url}/${slug}/`;
}

function categoryUrl(slug: string) {
  return `${SITE.url}/category/${slug}/`;
}

export function buildOrganizationJsonLd() {
  return cleanSchema({
    "@type": "Organization",
    "@id": SCHEMA_IDS.organization,
    name: SITE.name,
    url: SITE.url,
    email: SITE.email,
    logo: {
      "@type": "ImageObject",
      url: SITE.logo,
      width: 512,
      height: 512,
    },
    sameAs: SITE.sameAs,
  });
}

export function buildWebsiteJsonLd() {
  return cleanSchema({
    "@type": "WebSite",
    "@id": SCHEMA_IDS.website,
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    publisher: { "@id": SCHEMA_IDS.organization },
    inLanguage: "en-US",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.url}/search/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  });
}

export function buildPersonJsonLd() {
  return cleanSchema({
    "@type": "Person",
    "@id": SCHEMA_IDS.author,
    name: SITE.author.name,
    description: SITE.author.description,
    image: SITE.author.image,
    url: `${SITE.url}/about-us/#grandma-millie`,
    worksFor: { "@id": SCHEMA_IDS.organization },
    sameAs: SITE.sameAs,
    knowsAbout: [
      "home cooking",
      "comfort food",
      "family recipes",
      "baking",
      "kitchen-tested recipes",
    ],
  });
}

export function buildBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>,
) {
  return cleanSchema({
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  });
}

export function buildWebPageJsonLd({
  name,
  description,
  url,
  type = "WebPage",
  primaryImage,
}: {
  name: string;
  description?: string;
  url: string;
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";
  primaryImage?: {
    url: string;
    name?: string;
    description?: string;
  };
}) {
  return cleanSchema({
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    isPartOf: { "@id": SCHEMA_IDS.website },
    publisher: { "@id": SCHEMA_IDS.organization },
    inLanguage: "en-US",
    primaryImageOfPage: primaryImage
      ? {
          "@type": "ImageObject",
          url: primaryImage.url,
          contentUrl: primaryImage.url,
          name: primaryImage.name,
          description: primaryImage.description,
        }
      : undefined,
  });
}

export function buildFaqJsonLd(faqs: FaqItem[], pageUrl: string) {
  if (faqs.length === 0) return null;

  return cleanSchema({
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  });
}

function buildCommentFields(
  comments: RecipeComment[] | undefined,
  pageUrl: string,
) {
  if (!comments || comments.length === 0) return {};

  return {
    commentCount: comments.length,
    comment: comments.slice(0, 10).map((comment) => ({
      "@type": "Comment",
      "@id": `${pageUrl}#comment-${comment.id}`,
      author: {
        "@type": "Person",
        name: comment.name,
      },
      datePublished: comment.createdAt,
      text: comment.body,
    })),
    interactionStatistic: {
      "@type": "InteractionCounter",
      interactionType: "https://schema.org/CommentAction",
      userInteractionCount: comments.length,
    },
  };
}

function buildRecipeImages(recipe: Recipe) {
  if (!recipe.featuredImage) return undefined;

  const description =
    recipe.featuredImageAlt?.trim() ||
    `${recipe.title} — homemade recipe from ${SITE.name}`;

  return [
    cleanSchema({
      "@type": "ImageObject",
      "@id": `${recipeUrl(recipe.slug)}#primaryimage`,
      url: recipe.featuredImage,
      contentUrl: recipe.featuredImage,
      name: recipe.title,
      description,
      caption: description,
    }),
  ];
}

function buildArticleEntity(
  recipe: Recipe,
  pageUrl: string,
  comments?: RecipeComment[],
) {
  const description = resolveSeoDescription(recipe);

  return cleanSchema({
    "@type": "Article",
    "@id": `${pageUrl}#article`,
    headline: recipe.title,
    description,
    image: buildRecipeImages(recipe),
    url: pageUrl,
    mainEntityOfPage: { "@id": `${pageUrl}#webpage` },
    datePublished: recipe.publishedAt,
    dateModified: recipe.modifiedAt,
    author: { "@id": SCHEMA_IDS.author },
    publisher: { "@id": SCHEMA_IDS.organization },
    inLanguage: "en-US",
    articleSection: recipe.category,
    ...buildCommentFields(comments, pageUrl),
  });
}

function buildRecipeEntity(
  recipe: Recipe,
  pageUrl: string,
  rating?: RecipeRatingAggregate,
  comments?: RecipeComment[],
) {
  const snapshot = extractSnapshotMeta(recipe.contentHtml);
  const prepTime = parseDurationToIso(recipe.prepTime || snapshot.prepTime || "");
  const cookTime = parseDurationToIso(recipe.cookTime || snapshot.cookTime || "");
  const totalTime = parseDurationToIso(
    recipe.totalTime || snapshot.totalTime || "",
  );
  const servings = recipe.servings || snapshot.servings;
  const cuisine = recipe.cuisine || snapshot.cuisine;
  const course = recipe.course || snapshot.category;
  const calories = recipe.calories || snapshot.calories;
  const description = resolveSeoDescription(recipe);

  return cleanSchema({
    "@type": "Recipe",
    "@id": `${pageUrl}#recipe`,
    name: recipe.title,
    description,
    image: buildRecipeImages(recipe),
    url: pageUrl,
    mainEntityOfPage: { "@id": `${pageUrl}#webpage` },
    datePublished: recipe.publishedAt,
    dateModified: recipe.modifiedAt,
    author: { "@id": SCHEMA_IDS.author },
    publisher: { "@id": SCHEMA_IDS.organization },
    inLanguage: "en-US",
    recipeCategory: course,
    recipeCuisine: cuisine,
    keywords: [course, cuisine, snapshot.dietary, recipe.category]
      .filter(Boolean)
      .join(", "),
    prepTime,
    cookTime,
    totalTime,
    recipeYield: servings,
    nutrition: calories
      ? {
          "@type": "NutritionInformation",
          calories,
        }
      : undefined,
    aggregateRating:
      rating && rating.ratingCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: rating.ratingValue,
            ratingCount: rating.ratingCount,
            bestRating: 5,
            worstRating: 1,
          }
        : undefined,
    recipeIngredient: recipe.ingredients,
    recipeInstructions: recipe.instructions.map((text, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      text,
      url: `${pageUrl}#step-${index + 1}`,
    })),
    ...buildCommentFields(comments, pageUrl),
  });
}

export function buildRecipePageJsonLd(
  recipe: Recipe,
  rating?: RecipeRatingAggregate,
  comments?: RecipeComment[],
) {
  const pageUrl = recipeUrl(recipe.slug);
  const category = recipe.category;
  const categoryName =
    category.charAt(0).toUpperCase() + category.slice(1);
  const description = resolveSeoDescription(recipe);
  const faqs = extractFaqsFromHtml(recipe.contentHtml);
  const fullRecipe = isFullRecipe(recipe);

  const graph = [
    buildOrganizationJsonLd(),
    buildPersonJsonLd(),
    buildWebPageJsonLd({
      name: recipe.title,
      description,
      url: pageUrl,
      type: "WebPage",
      primaryImage: recipe.featuredImage
        ? {
            url: recipe.featuredImage,
            name: recipe.title,
            description:
              recipe.featuredImageAlt?.trim() ||
              `${recipe.title} — homemade recipe from ${SITE.name}`,
          }
        : undefined,
    }),
    fullRecipe
      ? buildRecipeEntity(recipe, pageUrl, rating, comments)
      : buildArticleEntity(recipe, pageUrl, comments),
    buildBreadcrumbJsonLd([
      { name: "Home", url: `${SITE.url}/` },
      { name: categoryName, url: categoryUrl(category) },
      { name: recipe.title, url: pageUrl },
    ]),
    buildFaqJsonLd(faqs, pageUrl),
  ].filter(Boolean);

  return cleanSchema({
    "@context": SCHEMA_CONTEXT,
    "@graph": graph,
  });
}

export function buildCategoryPageJsonLd({
  slug,
  name,
  description,
  recipeSlugs,
  page = 1,
  startPosition = 0,
}: {
  slug: CategorySlug;
  name: string;
  description: string;
  recipeSlugs: string[];
  page?: number;
  startPosition?: number;
}) {
  const pageUrl =
    page > 1 ? `${categoryUrl(slug)}page/${page}/` : categoryUrl(slug);
  const pageName =
    page > 1 ? `${name} Recipes – Page ${page}` : `${name} Recipes`;

  return cleanSchema({
    "@context": SCHEMA_CONTEXT,
    "@graph": [
      buildWebPageJsonLd({
        name: pageName,
        description,
        url: pageUrl,
        type: "CollectionPage",
      }),
      buildBreadcrumbJsonLd([
        { name: "Home", url: `${SITE.url}/` },
        { name: name, url: categoryUrl(slug) },
        ...(page > 1
          ? [{ name: `Page ${page}`, url: pageUrl }]
          : []),
      ]),
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#itemlist`,
        name: pageName,
        numberOfItems: recipeSlugs.length,
        itemListElement: recipeSlugs.map((recipeSlug, index) => ({
          "@type": "ListItem",
          position: startPosition + index + 1,
          url: recipeUrl(recipeSlug),
        })),
      },
    ],
  });
}

export function buildHomePageJsonLd() {
  const pageUrl = `${SITE.url}/`;

  return cleanSchema({
    "@context": SCHEMA_CONTEXT,
    "@graph": [
      buildOrganizationJsonLd(),
      buildWebsiteJsonLd(),
      buildWebPageJsonLd({
        name: SITE.tagline,
        description: SITE.description,
        url: pageUrl,
      }),
      buildFaqJsonLd(HOME_FAQS, pageUrl),
    ].filter(Boolean),
  });
}

export function buildAboutPageJsonLd() {
  const pageUrl = `${SITE.url}/about-us/`;

  return cleanSchema({
    "@context": SCHEMA_CONTEXT,
    "@graph": [
      buildOrganizationJsonLd(),
      buildWebPageJsonLd({
        name: "About Us",
        description: SITE.author.description,
        url: pageUrl,
        type: "AboutPage",
      }),
      buildPersonJsonLd(),
      buildBreadcrumbJsonLd([
        { name: "Home", url: `${SITE.url}/` },
        { name: "About Us", url: pageUrl },
      ]),
    ],
  });
}

export function buildHowWeTestPageJsonLd() {
  const pageUrl = `${SITE.url}/how-we-test-recipes/`;
  const description =
    "Learn how Grandma Millie kitchen-tests recipes at Grandma Recipe — clear steps, honest notes, and updates when methods improve.";

  return cleanSchema({
    "@context": SCHEMA_CONTEXT,
    "@graph": [
      buildOrganizationJsonLd(),
      buildPersonJsonLd(),
      buildWebPageJsonLd({
        name: "How we test recipes",
        description,
        url: pageUrl,
        type: "WebPage",
      }),
      buildBreadcrumbJsonLd([
        { name: "Home", url: `${SITE.url}/` },
        { name: "How we test recipes", url: pageUrl },
      ]),
    ],
  });
}

export function buildAffiliateDisclosureJsonLd() {
  const pageUrl = `${SITE.url}/affiliate-disclosure/`;
  const description =
    "Learn how Grandma Recipe may earn commissions from affiliate links at no extra cost to you.";

  return cleanSchema({
    "@context": SCHEMA_CONTEXT,
    "@graph": [
      buildOrganizationJsonLd(),
      buildWebPageJsonLd({
        name: "Affiliate Disclosure",
        description,
        url: pageUrl,
        type: "WebPage",
      }),
      buildBreadcrumbJsonLd([
        { name: "Home", url: `${SITE.url}/` },
        { name: "Affiliate Disclosure", url: pageUrl },
      ]),
    ],
  });
}

export function buildContactPageJsonLd() {
  const pageUrl = `${SITE.url}/contact-us/`;

  return cleanSchema({
    "@context": SCHEMA_CONTEXT,
    "@graph": [
      buildWebPageJsonLd({
        name: "Contact Us",
        description: `Contact ${SITE.name} — we'd love to hear from you.`,
        url: pageUrl,
        type: "ContactPage",
      }),
      buildBreadcrumbJsonLd([
        { name: "Home", url: `${SITE.url}/` },
        { name: "Contact Us", url: pageUrl },
      ]),
    ],
  });
}

/** @deprecated Use buildRecipePageJsonLd instead */
export function buildRecipeJsonLd(recipe: Recipe) {
  const pageUrl = recipeUrl(recipe.slug);
  return isFullRecipe(recipe)
    ? buildRecipeEntity(recipe, pageUrl)
    : buildArticleEntity(recipe, pageUrl);
}
