import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get the single app configuration document.
 * Returns null if not yet seeded (frontend falls back to defaultConfig).
 */
export const get = query({
  args: {},
  handler: async (ctx) => {
    const docs = await ctx.db.query("appConfig").order("desc").take(1);
    if (docs.length === 0) return null;
    return docs[0];
  },
});

/**
 * Save (upsert) the app configuration.
 * If a config document already exists, patches it.
 * Otherwise, inserts a new one (first-time setup).
 */
export const save = mutation({
  args: {
    recipientName: v.string(),
    senderName: v.string(),
    questionText: v.string(),
    quizTitle: v.optional(v.string()),
    quizQuestions: v.any(),
    coffeeLocation: v.any(),
    slides: v.any(),
    evasiveNoButton: v.boolean(),
    adminPasscode: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("appConfig").order("desc").take(1);
    const payload = {
      ...args,
      updatedAt: new Date().toISOString(),
    };

    if (existing.length > 0) {
      await ctx.db.patch(existing[0]._id, payload);
      return existing[0]._id;
    } else {
      return await ctx.db.insert("appConfig", payload);
    }
  },
});
