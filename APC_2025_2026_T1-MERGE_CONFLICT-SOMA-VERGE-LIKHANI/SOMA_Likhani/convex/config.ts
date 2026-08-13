import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const records = await ctx.db
      .query("appConfig")
      .filter((q) => q.eq(q.field("configKey"), "default"))
      .collect();
    return records.length > 0 ? records[0] : null;
  },
});

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
    const existing = await ctx.db
      .query("appConfig")
      .filter((q) => q.eq(q.field("configKey"), "default"))
      .collect();

    const payload = {
      configKey: "default",
      recipientName: args.recipientName,
      senderName: args.senderName,
      questionText: args.questionText,
      quizTitle: args.quizTitle || undefined,
      quizQuestions: args.quizQuestions,
      coffeeLocation: args.coffeeLocation,
      slides: args.slides,
      evasiveNoButton: args.evasiveNoButton,
      adminPasscode: args.adminPasscode,
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
