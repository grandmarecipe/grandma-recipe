import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const NAME_MIN = 2;
const NAME_MAX = 40;
const BODY_MIN = 5;
const BODY_MAX = 800;

function cleanText(value: string) {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function looksSpammy(name: string, body: string) {
  const combined = `${name} ${body}`.toLowerCase();
  if (/https?:\/\/|www\.|\.com\/|\.net\/|\.org\//i.test(combined)) {
    return true;
  }
  if (/(viagra|casino|crypto\s*invest|buy\s*followers)/i.test(combined)) {
    return true;
  }
  return false;
}

export const listBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const rows = await ctx.db
      .query("recipeComments")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .collect();

    return rows
      .map((row) => ({
        id: row._id,
        name: row.name,
        body: row.body,
        createdAt: row.createdAt,
      }))
      .sort((a, b) =>
        a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0,
      );
  },
});

export const add = mutation({
  args: {
    slug: v.string(),
    name: v.string(),
    body: v.string(),
    website: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Honeypot — bots fill hidden "website" fields
    if (args.website && args.website.trim()) {
      throw new Error("Comment rejected.");
    }

    const name = cleanText(args.name);
    const body = cleanText(args.body);

    if (name.length < NAME_MIN || name.length > NAME_MAX) {
      throw new Error(`Name must be ${NAME_MIN}–${NAME_MAX} characters.`);
    }
    if (body.length < BODY_MIN || body.length > BODY_MAX) {
      throw new Error(`Comment must be ${BODY_MIN}–${BODY_MAX} characters.`);
    }
    if (looksSpammy(name, body)) {
      throw new Error(
        "Comment looks like spam. Please remove links and try again.",
      );
    }

    const createdAt = new Date().toISOString();
    const id = await ctx.db.insert("recipeComments", {
      slug: args.slug,
      name,
      body,
      createdAt,
    });

    return {
      id,
      name,
      body,
      createdAt,
    };
  },
});

/** One-time seed from local JSON comments. */
export const seedFromJson = mutation({
  args: {
    entries: v.array(
      v.object({
        slug: v.string(),
        name: v.string(),
        body: v.string(),
        createdAt: v.string(),
      }),
    ),
  },
  handler: async (ctx, { entries }) => {
    let inserted = 0;
    for (const entry of entries) {
      await ctx.db.insert("recipeComments", {
        slug: entry.slug,
        name: entry.name,
        body: entry.body,
        createdAt: entry.createdAt,
      });
      inserted += 1;
    }
    return { inserted };
  },
});
