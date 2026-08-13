import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("responses").order("desc").collect();
  },
});

export const add = mutation({
  args: {
    choice: v.string(),
    preferredDate: v.optional(v.union(v.string(), v.null())),
    preferredTime: v.optional(v.union(v.string(), v.null())),
    message: v.optional(v.union(v.string(), v.null())),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("responses", {
      choice: args.choice,
      preferredDate: args.preferredDate || null,
      preferredTime: args.preferredTime || null,
      message: args.message || null,
      createdAt: new Date().toISOString(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("responses") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const update = mutation({
  args: {
    id: v.id("responses"),
    choice: v.optional(v.string()),
    preferredDate: v.optional(v.union(v.string(), v.null())),
    preferredTime: v.optional(v.union(v.string(), v.null())),
    message: v.optional(v.union(v.string(), v.null())),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});
