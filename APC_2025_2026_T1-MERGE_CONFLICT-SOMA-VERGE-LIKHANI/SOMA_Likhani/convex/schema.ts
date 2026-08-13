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

  viewTimeLogs: defineTable({
    sessionId: v.string(),
    screen: v.string(),
    slideIndex: v.optional(v.number()),
    durationSeconds: v.number(),
    startTime: v.string(),
    endTime: v.string(),
    userAgent: v.optional(v.string()),
  }),

  appConfig: defineTable({
    configKey: v.string(),
    recipientName: v.string(),
    senderName: v.string(),
    questionText: v.string(),
    quizTitle: v.optional(v.string()),
    quizQuestions: v.any(),
    coffeeLocation: v.any(),
    slides: v.any(),
    evasiveNoButton: v.boolean(),
    adminPasscode: v.string(),
    updatedAt: v.string(),
  }),
});
