import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./adminAuth";

const categorySlug = v.union(
  v.literal("breakfast"),
  v.literal("lunch"),
  v.literal("dinner"),
  v.literal("snacks"),
  v.literal("dessert"),
);

const articleFields = {
  slug: v.string(),
  title: v.string(),
  excerpt: v.string(),
  category: categorySlug,
  categories: v.array(categorySlug),
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
  prepTime: v.optional(v.string()),
  cookTime: v.optional(v.string()),
  totalTime: v.optional(v.string()),
  servings: v.optional(v.string()),
  calories: v.optional(v.string()),
  cuisine: v.optional(v.string()),
  course: v.optional(v.string()),
  status: v.union(v.literal("draft"), v.literal("published")),
  publishedAt: v.optional(v.string()),
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function cleanOptional(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export const list = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    await requireAdmin(ctx, token);
    const rows = await ctx.db.query("articles").collect();
    return rows.sort((a, b) =>
      a.modifiedAt < b.modifiedAt ? 1 : a.modifiedAt > b.modifiedAt ? -1 : 0,
    );
  },
});

export const get = query({
  args: {
    token: v.string(),
    id: v.id("articles"),
  },
  handler: async (ctx, { token, id }) => {
    await requireAdmin(ctx, token);
    return await ctx.db.get(id);
  },
});

export const getBySlug = query({
  args: {
    token: v.string(),
    slug: v.string(),
  },
  handler: async (ctx, { token, slug }) => {
    await requireAdmin(ctx, token);
    return await ctx.db
      .query("articles")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
  },
});

/** Public: published CMS article by slug (no auth). */
export const getPublishedBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const row = await ctx.db
      .query("articles")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (!row || row.status !== "published") return null;
    return row;
  },
});

/** Public: all published CMS articles (for listing merge). */
export const listPublished = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("articles")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();
  },
});

export const create = mutation({
  args: {
    token: v.string(),
    ...articleFields,
  },
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx, args.token);
    const slug = slugify(args.slug || args.title);
    if (!slug) throw new Error("Slug is required.");
    if (!args.title.trim()) throw new Error("Title is required.");

    const existing = await ctx.db
      .query("articles")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (existing) throw new Error(`Slug "${slug}" already exists in the CMS.`);

    const now = new Date().toISOString();
    const categories =
      args.categories.length > 0 ? args.categories : [args.category];

    const id = await ctx.db.insert("articles", {
      slug,
      title: args.title.trim(),
      excerpt: args.excerpt.trim(),
      category: args.category,
      categories,
      contentHtml: args.contentHtml,
      ingredients: args.ingredients.map((item) => item.trim()).filter(Boolean),
      instructions: args.instructions
        .map((item) => item.trim())
        .filter(Boolean),
      featuredImage: cleanOptional(args.featuredImage),
      featuredImageAlt: cleanOptional(args.featuredImageAlt),
      featuredImageCaption: cleanOptional(args.featuredImageCaption),
      featuredImageDescription: cleanOptional(args.featuredImageDescription),
      featuredImageStorageId: args.featuredImageStorageId,
      seoTitle: cleanOptional(args.seoTitle),
      seoDescription: cleanOptional(args.seoDescription),
      prepTime: cleanOptional(args.prepTime),
      cookTime: cleanOptional(args.cookTime),
      totalTime: cleanOptional(args.totalTime),
      servings: cleanOptional(args.servings),
      calories: cleanOptional(args.calories),
      cuisine: cleanOptional(args.cuisine),
      course: cleanOptional(args.course),
      status: args.status,
      publishedAt: args.publishedAt?.trim() || now,
      modifiedAt: now,
      updatedBy: admin.email,
    });

    return { id, slug };
  },
});

export const update = mutation({
  args: {
    token: v.string(),
    id: v.id("articles"),
    ...articleFields,
  },
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx, args.token);
    const current = await ctx.db.get(args.id);
    if (!current) throw new Error("Article not found.");

    const slug = slugify(args.slug || args.title);
    if (!slug) throw new Error("Slug is required.");

    const conflict = await ctx.db
      .query("articles")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (conflict && conflict._id !== args.id) {
      throw new Error(`Slug "${slug}" is already used by another article.`);
    }

    const categories =
      args.categories.length > 0 ? args.categories : [args.category];
    const now = new Date().toISOString();

    await ctx.db.patch(args.id, {
      slug,
      title: args.title.trim(),
      excerpt: args.excerpt.trim(),
      category: args.category,
      categories,
      contentHtml: args.contentHtml,
      ingredients: args.ingredients.map((item) => item.trim()).filter(Boolean),
      instructions: args.instructions
        .map((item) => item.trim())
        .filter(Boolean),
      featuredImage: cleanOptional(args.featuredImage),
      featuredImageAlt: cleanOptional(args.featuredImageAlt),
      featuredImageCaption: cleanOptional(args.featuredImageCaption),
      featuredImageDescription: cleanOptional(args.featuredImageDescription),
      featuredImageStorageId: args.featuredImageStorageId,
      seoTitle: cleanOptional(args.seoTitle),
      seoDescription: cleanOptional(args.seoDescription),
      prepTime: cleanOptional(args.prepTime),
      cookTime: cleanOptional(args.cookTime),
      totalTime: cleanOptional(args.totalTime),
      servings: cleanOptional(args.servings),
      calories: cleanOptional(args.calories),
      cuisine: cleanOptional(args.cuisine),
      course: cleanOptional(args.course),
      status: args.status,
      publishedAt: args.publishedAt?.trim() || current.publishedAt,
      modifiedAt: now,
      updatedBy: admin.email,
    });

    return { id: args.id, slug };
  },
});

export const remove = mutation({
  args: {
    token: v.string(),
    id: v.id("articles"),
  },
  handler: async (ctx, { token, id }) => {
    await requireAdmin(ctx, token);
    const row = await ctx.db.get(id);
    if (!row) throw new Error("Article not found.");
    await ctx.db.delete(id);
    return { ok: true as const };
  },
});

export const generateUploadUrl = mutation({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    await requireAdmin(ctx, token);
    return await ctx.storage.generateUploadUrl();
  },
});

export const resolveStorageUrl = mutation({
  args: {
    token: v.string(),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, { token, storageId }) => {
    await requireAdmin(ctx, token);
    const url = await ctx.storage.getUrl(storageId);
    if (!url) throw new Error("Upload not found.");
    return { url, storageId };
  },
});
