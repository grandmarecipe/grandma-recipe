import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

function toAggregate(sum: number, count: number) {
  if (count <= 0) {
    return { ratingValue: 0, ratingCount: 0, ratingSum: 0 };
  }
  return {
    ratingSum: sum,
    ratingCount: count,
    ratingValue: Math.round((sum / count) * 10) / 10,
  };
}

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const row = await ctx.db
      .query("recipeRatings")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();

    if (!row) return toAggregate(0, 0);
    return toAggregate(row.sum, row.count);
  },
});

/** Slugs that have at least one rating — used to skip empty reads on the free tier. */
export const listActiveSlugs = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("recipeRatings").collect();
    return rows.filter((row) => row.count > 0).map((row) => row.slug);
  },
});

export const add = mutation({
  args: {
    slug: v.string(),
    stars: v.number(),
  },
  handler: async (ctx, { slug, stars }) => {
    if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
      throw new Error("Rating must be an integer from 1 to 5.");
    }

    const existing = await ctx.db
      .query("recipeRatings")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        sum: existing.sum + stars,
        count: existing.count + 1,
      });
      return toAggregate(existing.sum + stars, existing.count + 1);
    }

    await ctx.db.insert("recipeRatings", {
      slug,
      sum: stars,
      count: 1,
    });
    return toAggregate(stars, 1);
  },
});

/** One-time seed from local JSON { [slug]: { sum, count } }. */
export const seedFromJson = mutation({
  args: {
    entries: v.array(
      v.object({
        slug: v.string(),
        sum: v.number(),
        count: v.number(),
      }),
    ),
  },
  handler: async (ctx, { entries }) => {
    let upserted = 0;
    for (const entry of entries) {
      if (entry.count <= 0) continue;
      const existing = await ctx.db
        .query("recipeRatings")
        .withIndex("by_slug", (q) => q.eq("slug", entry.slug))
        .unique();

      if (existing) {
        await ctx.db.patch(existing._id, {
          sum: entry.sum,
          count: entry.count,
        });
      } else {
        await ctx.db.insert("recipeRatings", {
          slug: entry.slug,
          sum: entry.sum,
          count: entry.count,
        });
      }
      upserted += 1;
    }
    return { upserted };
  },
});
