import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

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
});
