import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  responses: defineTable({
    choice: v.string(),
    preferredDate: v.optional(v.union(v.string(), v.null())),
    preferredTime: v.optional(v.union(v.string(), v.null())),
    message: v.optional(v.union(v.string(), v.null())),
    createdAt: v.string(),
    userAgent: v.optional(v.string()),
  }),
});
