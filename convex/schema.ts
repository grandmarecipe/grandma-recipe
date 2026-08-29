import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/** Matches site CategorySlug values. */
const categorySlug = v.union(
  v.literal("breakfast"),
  v.literal("lunch"),
  v.literal("dinner"),
  v.literal("snacks"),
  v.literal("dessert"),
);

const featureImagePromptResult = v.object({
  prompt: v.string(),
  alt_text_1: v.string(),
  title_1: v.string(),
  caption_1: v.string(),
  description_1: v.string(),
  alt_text_2: v.string(),
  title_2: v.string(),
  caption_2: v.string(),
  description_2: v.string(),
});

const sectionImagePromptResult = v.object({
  prompt: v.string(),
  alt_text: v.string(),
  title: v.string(),
  caption: v.string(),
  description: v.string(),
});

const imagePromptBundle = v.object({
  focusKeyword: v.string(),
  feature: v.optional(featureImagePromptResult),
  ingredients: v.optional(sectionImagePromptResult),
  how_to_make: v.optional(sectionImagePromptResult),
  how_to_serve: v.optional(sectionImagePromptResult),
});

const imageAssetRecord = v.object({
  publicPath: v.string(),
  r2Key: v.string(),
  alt: v.string(),
  title: v.string(),
  caption: v.string(),
  description: v.string(),
  uploadedAt: v.string(),
  width: v.optional(v.number()),
  height: v.optional(v.number()),
});

const imageAssetsBundle = v.object({
  feature: v.optional(imageAssetRecord),
  ingredients: v.optional(imageAssetRecord),
  how_to_make: v.optional(imageAssetRecord),
  how_to_serve: v.optional(imageAssetRecord),
});

export default defineSchema({
  recipeRatings: defineTable({
    slug: v.string(),
    sum: v.number(),
    count: v.number(),
  }).index("by_slug", ["slug"]),

  recipeComments: defineTable({
    slug: v.string(),
    name: v.string(),
    body: v.string(),
    createdAt: v.string(),
  }).index("by_slug", ["slug"]),

  /** Email/password admins — signup only if email is in ADMIN_EMAILS. */
  adminUsers: defineTable({
    email: v.string(),
    passwordHash: v.string(),
    createdAt: v.string(),
  }).index("by_email", ["email"]),

  adminSessions: defineTable({
    token: v.string(),
    userId: v.id("adminUsers"),
    email: v.string(),
    expiresAt: v.number(),
  })
    .index("by_token", ["token"])
    .index("by_user", ["userId"]),

  /**
   * CMS articles. Published ones override/add to filesystem recipes
   * on the public site. Heavy body fields live in articleBodies.
   */
  articles: defineTable({
    slug: v.string(),
    title: v.string(),
    excerpt: v.string(),
    category: categorySlug,
    categories: v.array(categorySlug),
    /** @deprecated Prefer articleBodies; kept empty/short after migration. */
    contentHtml: v.string(),
    ingredients: v.array(v.string()),
    instructions: v.array(v.string()),
    featuredImage: v.optional(v.string()),
    featuredImageAlt: v.optional(v.string()),
    featuredImageCaption: v.optional(v.string()),
    featuredImageDescription: v.optional(v.string()),
    featuredImageStorageId: v.optional(v.id("_storage")),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    focusKeyword: v.optional(v.string()),
    prepTime: v.optional(v.string()),
    cookTime: v.optional(v.string()),
    totalTime: v.optional(v.string()),
    servings: v.optional(v.string()),
    calories: v.optional(v.string()),
    cuisine: v.optional(v.string()),
    course: v.optional(v.string()),
    status: v.union(v.literal("draft"), v.literal("published")),
    publishedAt: v.string(),
    modifiedAt: v.string(),
    updatedBy: v.optional(v.string()),
    imagePrompts: v.optional(imagePromptBundle),
    imageAssets: v.optional(imageAssetsBundle),
  })
    .index("by_slug", ["slug"])
    .index("by_status", ["status"])
    .index("by_modified", ["modifiedAt"]),

  /** Full recipe body for a CMS article (kept separate so list queries stay small). */
  articleBodies: defineTable({
    articleId: v.id("articles"),
    contentHtml: v.string(),
    ingredients: v.array(v.string()),
    instructions: v.array(v.string()),
  }).index("by_article", ["articleId"]),
});
