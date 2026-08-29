import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import {
  mutation,
  query,
  type MutationCtx,
  type QueryCtx,
} from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { requireAdmin } from "./adminAuth";

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

const imagePromptSection = v.union(
  v.literal("feature"),
  v.literal("ingredients"),
  v.literal("how_to_make"),
  v.literal("how_to_serve"),
);

const imagePromptBundle = v.object({
  focusKeyword: v.string(),
  feature: v.optional(featureImagePromptResult),
  ingredients: v.optional(sectionImagePromptResult),
  how_to_make: v.optional(sectionImagePromptResult),
  how_to_serve: v.optional(sectionImagePromptResult),
});

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
  focusKeyword: v.optional(v.string()),
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

function normalizeFocusKeyword(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

type ArticleDoc = {
  _id: Id<"articles">;
  _creationTime: number;
  slug: string;
  title: string;
  excerpt: string;
  category: "breakfast" | "lunch" | "dinner" | "snacks" | "dessert";
  categories: ("breakfast" | "lunch" | "dinner" | "snacks" | "dessert")[];
  contentHtml: string;
  ingredients: string[];
  instructions: string[];
  featuredImage?: string;
  featuredImageAlt?: string;
  featuredImageCaption?: string;
  featuredImageDescription?: string;
  featuredImageStorageId?: Id<"_storage">;
  seoTitle?: string;
  seoDescription?: string;
  focusKeyword?: string;
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  servings?: string;
  calories?: string;
  cuisine?: string;
  course?: string;
  status: "draft" | "published";
  publishedAt: string;
  modifiedAt: string;
  updatedBy?: string;
  imagePrompts?: {
    focusKeyword: string;
    feature?: {
      prompt: string;
      alt_text_1: string;
      title_1: string;
      caption_1: string;
      description_1: string;
      alt_text_2: string;
      title_2: string;
      caption_2: string;
      description_2: string;
    };
    ingredients?: {
      prompt: string;
      alt_text: string;
      title: string;
      caption: string;
      description: string;
    };
    how_to_make?: {
      prompt: string;
      alt_text: string;
      title: string;
      caption: string;
      description: string;
    };
    how_to_serve?: {
      prompt: string;
      alt_text: string;
      title: string;
      caption: string;
      description: string;
    };
  };
  imageAssets?: {
    feature?: {
      publicPath: string;
      r2Key: string;
      alt: string;
      title: string;
      caption: string;
      description: string;
      uploadedAt: string;
    };
    ingredients?: {
      publicPath: string;
      r2Key: string;
      alt: string;
      title: string;
      caption: string;
      description: string;
      uploadedAt: string;
    };
    how_to_make?: {
      publicPath: string;
      r2Key: string;
      alt: string;
      title: string;
      caption: string;
      description: string;
      uploadedAt: string;
    };
    how_to_serve?: {
      publicPath: string;
      r2Key: string;
      alt: string;
      title: string;
      caption: string;
      description: string;
      uploadedAt: string;
    };
  };
};

async function getBody(ctx: QueryCtx | MutationCtx, articleId: Id<"articles">) {
  return await ctx.db
    .query("articleBodies")
    .withIndex("by_article", (q) => q.eq("articleId", articleId))
    .unique();
}

async function withBody(ctx: QueryCtx | MutationCtx, row: ArticleDoc | null) {
  if (!row) return null;
  const body = await getBody(ctx, row._id);
  if (!body) return row;
  return {
    ...row,
    contentHtml: body.contentHtml || row.contentHtml,
    ingredients:
      body.ingredients.length > 0 ? body.ingredients : row.ingredients,
    instructions:
      body.instructions.length > 0 ? body.instructions : row.instructions,
  };
}

async function upsertBody(
  ctx: MutationCtx,
  articleId: Id<"articles">,
  contentHtml: string,
  ingredients: string[],
  instructions: string[],
) {
  const existing = await ctx.db
    .query("articleBodies")
    .withIndex("by_article", (q) => q.eq("articleId", articleId))
    .unique();
  const payload = {
    contentHtml,
    ingredients,
    instructions,
  };
  if (existing) {
    await ctx.db.patch(existing._id, payload);
  } else {
    await ctx.db.insert("articleBodies", { articleId, ...payload });
  }
  await ctx.db.patch(articleId, {
    contentHtml: "",
    ingredients: [],
    instructions: [],
  });
}

export const list = query({
  args: {
    token: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { token, paginationOpts }) => {
    await requireAdmin(ctx, token);
    const result = await ctx.db
      .query("articles")
      .withIndex("by_modified")
      .order("desc")
      .paginate(paginationOpts);
    return {
      ...result,
      page: result.page.map((row) => ({
        _id: row._id,
        _creationTime: row._creationTime,
        slug: row.slug,
        title: row.title,
        excerpt: row.excerpt,
        category: row.category,
        categories: row.categories,
        featuredImage: row.featuredImage,
        focusKeyword: row.focusKeyword,
        status: row.status,
        publishedAt: row.publishedAt,
        modifiedAt: row.modifiedAt,
        updatedBy: row.updatedBy,
      })),
    };
  },
});

export const get = query({
  args: {
    token: v.string(),
    id: v.id("articles"),
  },
  handler: async (ctx, { token, id }) => {
    await requireAdmin(ctx, token);
    return await withBody(ctx, await ctx.db.get(id));
  },
});

/** Find an existing article using the same primary keyword (case/spacing-insensitive). */
export const findByFocusKeyword = query({
  args: {
    token: v.string(),
    keyword: v.string(),
  },
  handler: async (ctx, { token, keyword }) => {
    await requireAdmin(ctx, token);
    const needle = normalizeFocusKeyword(keyword);
    if (!needle) return null;

    // Articles rows are metadata-only (bodies in articleBodies), so collect is safe.
    const rows = await ctx.db.query("articles").collect();
    const match = rows.find(
      (row) =>
        row.focusKeyword &&
        normalizeFocusKeyword(row.focusKeyword) === needle,
    );
    if (!match) return null;

    return {
      _id: match._id,
      slug: match.slug,
      title: match.title,
      status: match.status,
      focusKeyword: match.focusKeyword,
    };
  },
});

export const getBySlug = query({
  args: {
    token: v.string(),
    slug: v.string(),
  },
  handler: async (ctx, { token, slug }) => {
    await requireAdmin(ctx, token);
    const row = await ctx.db
      .query("articles")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    return await withBody(ctx, row);
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
    return await withBody(ctx, row);
  },
});

/** Public: one page of published CMS metas (bodies stored separately). */
export const listPublishedPage = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, { paginationOpts }) => {
    const result = await ctx.db
      .query("articles")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .paginate(paginationOpts);
    return {
      ...result,
      page: result.page.map((row) => ({
        slug: row.slug,
        title: row.title,
        excerpt: row.excerpt,
        category: row.category,
        categories: row.categories,
        featuredImage: row.featuredImage,
        featuredImageAlt: row.featuredImageAlt,
        seoTitle: row.seoTitle,
        seoDescription: row.seoDescription,
        prepTime: row.prepTime,
        cookTime: row.cookTime,
        totalTime: row.totalTime,
        servings: row.servings,
        calories: row.calories,
        cuisine: row.cuisine,
        course: row.course,
        publishedAt: row.publishedAt ?? row.modifiedAt,
        modifiedAt: row.modifiedAt,
        contentHtml: "",
        ingredients: [] as string[],
        instructions: [] as string[],
      })),
    };
  },
});

/** @deprecated Prefer listPublishedPage. */
export const listPublished = query({
  args: {},
  handler: async () => [],
});

/**
 * Move inline contentHtml off articles into articleBodies.
 * Pass continueCursor from the previous result until isDone.
 */
export const migrateBodiesBatch = mutation({
  args: {
    secret: v.optional(v.string()),
    token: v.optional(v.string()),
    cursor: v.union(v.string(), v.null()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { secret, token, cursor, limit }) => {
    const importSecret = process.env.CMS_IMPORT_SECRET;
    const secretOk =
      Boolean(importSecret) &&
      Boolean(secret) &&
      secret === importSecret;
    if (!secretOk) {
      await requireAdmin(ctx, token);
    }

    const batchSize = Math.min(Math.max(limit ?? 12, 1), 20);
    const page = await ctx.db.query("articles").paginate({
      numItems: batchSize,
      cursor,
    });

    let moved = 0;
    for (const row of page.page) {
      const hasInline =
        (row.contentHtml && row.contentHtml.length > 0) ||
        row.ingredients.length > 0 ||
        row.instructions.length > 0;
      if (!hasInline) continue;
      await upsertBody(
        ctx,
        row._id,
        row.contentHtml || "",
        row.ingredients,
        row.instructions,
      );
      moved += 1;
    }

    return {
      moved,
      scanned: page.page.length,
      isDone: page.isDone,
      continueCursor: page.continueCursor,
    };
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
      contentHtml: "",
      ingredients: [],
      instructions: [],
      featuredImage: cleanOptional(args.featuredImage),
      featuredImageAlt: cleanOptional(args.featuredImageAlt),
      featuredImageCaption: cleanOptional(args.featuredImageCaption),
      featuredImageDescription: cleanOptional(args.featuredImageDescription),
      featuredImageStorageId: args.featuredImageStorageId,
      seoTitle: cleanOptional(args.seoTitle),
      seoDescription: cleanOptional(args.seoDescription),
      focusKeyword: cleanOptional(args.focusKeyword),
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

    await upsertBody(
      ctx,
      id,
      args.contentHtml,
      args.ingredients.map((item) => item.trim()).filter(Boolean),
      args.instructions.map((item) => item.trim()).filter(Boolean),
    );

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
      featuredImage: cleanOptional(args.featuredImage),
      featuredImageAlt: cleanOptional(args.featuredImageAlt),
      featuredImageCaption: cleanOptional(args.featuredImageCaption),
      featuredImageDescription: cleanOptional(args.featuredImageDescription),
      featuredImageStorageId: args.featuredImageStorageId,
      seoTitle: cleanOptional(args.seoTitle),
      seoDescription: cleanOptional(args.seoDescription),
      focusKeyword: cleanOptional(args.focusKeyword),
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

    await upsertBody(
      ctx,
      args.id,
      args.contentHtml,
      args.ingredients.map((item) => item.trim()).filter(Boolean),
      args.instructions.map((item) => item.trim()).filter(Boolean),
    );

    return { id: args.id, slug };
  },
});

export const saveImagePrompts = mutation({
  args: {
    token: v.string(),
    id: v.id("articles"),
    imagePrompts: imagePromptBundle,
  },
  handler: async (ctx, { token, id, imagePrompts }) => {
    const admin = await requireAdmin(ctx, token);
    const current = await ctx.db.get(id);
    if (!current) throw new Error("Article not found.");

    await ctx.db.patch(id, {
      imagePrompts,
      modifiedAt: new Date().toISOString(),
      updatedBy: admin.email,
    });

    return { ok: true as const };
  },
});

export const saveImageAsset = mutation({
  args: {
    token: v.string(),
    id: v.id("articles"),
    section: imagePromptSection,
    asset: imageAssetRecord,
  },
  handler: async (ctx, { token, id, section, asset }) => {
    const admin = await requireAdmin(ctx, token);
    const current = await ctx.db.get(id);
    if (!current) throw new Error("Article not found.");

    const existing = current.imageAssets ?? {};
    await ctx.db.patch(id, {
      imageAssets: {
        ...existing,
        [section]: asset,
      },
      modifiedAt: new Date().toISOString(),
      updatedBy: admin.email,
    });

    return { ok: true as const };
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
    const body = await getBody(ctx, id);
    if (body) await ctx.db.delete(body._id);
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

/**
 * Import one filesystem/WP recipe into the CMS as published.
 * Auth: admin token, or CMS_IMPORT_SECRET (Convex env) for bulk scripts.
 * Skips overwrite when a CMS article already exists for the slug
 * (only fills missing focusKeyword).
 */
export const upsertPublishedImport = mutation({
  args: {
    token: v.optional(v.string()),
    secret: v.optional(v.string()),
    article: v.object({
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
      publishedAt: v.optional(v.string()),
      modifiedAt: v.optional(v.string()),
      status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
    }),
  },
  handler: async (ctx, { token, secret, article }) => {
    const importSecret = process.env.CMS_IMPORT_SECRET;
    const secretOk =
      Boolean(importSecret) &&
      Boolean(secret) &&
      secret === importSecret;

    let actorEmail = "import-script";
    if (!secretOk) {
      const admin = await requireAdmin(ctx, token);
      actorEmail = admin.email;
    }

    const slug = slugify(article.slug || article.title);
    if (!slug) throw new Error("Slug is required.");

    const existing = await ctx.db
      .query("articles")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();

    const focusKeyword = cleanOptional(article.focusKeyword);
    const status = article.status ?? "published";
    const now = new Date().toISOString();

    if (existing) {
      const patch: {
        focusKeyword?: string;
        status?: "draft" | "published";
        publishedAt?: string;
        modifiedAt: string;
        updatedBy: string;
      } = {
        modifiedAt: now,
        updatedBy: actorEmail,
      };

      // Sheet is source of truth for primary keyword + publish status
      if (focusKeyword && focusKeyword !== existing.focusKeyword) {
        patch.focusKeyword = focusKeyword;
      }
      if (existing.status !== status) {
        patch.status = status;
        if (status === "published" && !existing.publishedAt) {
          patch.publishedAt = article.publishedAt?.trim() || now;
        }
      }

      const changed = Boolean(patch.focusKeyword || patch.status);
      if (changed) {
        await ctx.db.patch(existing._id, patch);
      }
      return {
        action: changed
          ? patch.focusKeyword
            ? ("keyword" as const)
            : ("status" as const)
          : ("skip" as const),
        id: existing._id,
        slug,
      };
    }

    const categories =
      article.categories.length > 0 ? article.categories : [article.category];

    const id = await ctx.db.insert("articles", {
      slug,
      title: article.title.trim(),
      excerpt: article.excerpt.trim(),
      category: article.category,
      categories,
      contentHtml: "",
      ingredients: [],
      instructions: [],
      featuredImage: cleanOptional(article.featuredImage),
      featuredImageAlt: cleanOptional(article.featuredImageAlt),
      seoTitle: cleanOptional(article.seoTitle),
      seoDescription: cleanOptional(article.seoDescription),
      focusKeyword,
      prepTime: cleanOptional(article.prepTime),
      cookTime: cleanOptional(article.cookTime),
      totalTime: cleanOptional(article.totalTime),
      servings: cleanOptional(article.servings),
      calories: cleanOptional(article.calories),
      cuisine: cleanOptional(article.cuisine),
      course: cleanOptional(article.course),
      status,
      publishedAt: article.publishedAt?.trim() || now,
      modifiedAt: article.modifiedAt?.trim() || now,
      updatedBy: actorEmail,
    });

    await upsertBody(
      ctx,
      id,
      article.contentHtml,
      article.ingredients.map((item) => item.trim()).filter(Boolean),
      article.instructions.map((item) => item.trim()).filter(Boolean),
    );

    return { action: "insert" as const, id, slug };
  },
});
