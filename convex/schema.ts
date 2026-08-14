import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // --- Existing: Confession responses submitted by the recipient ---
  responses: defineTable({
    choice: v.string(),
    preferredDate: v.optional(v.union(v.string(), v.null())),
    preferredTime: v.optional(v.union(v.string(), v.null())),
    message: v.optional(v.union(v.string(), v.null())),
    createdAt: v.string(),
    userAgent: v.optional(v.string()),
  }),

  // --- App configuration: single-document store for all admin-editable settings ---
  appConfig: defineTable({
    recipientName: v.string(),
    senderName: v.string(),
    questionText: v.string(),
    quizTitle: v.optional(v.string()),
    // Complex nested objects stored as v.any() due to deeply nested optional fields
    quizQuestions: v.any(),
    coffeeLocation: v.any(),
    slides: v.any(),
    evasiveNoButton: v.boolean(),
    adminPasscode: v.string(),
    updatedAt: v.string(),
  }),

  // --- View-time telemetry: one record per screen/slide view event ---
  analytics: defineTable({
    sessionId: v.string(),
    screen: v.string(),
    slideIndex: v.optional(v.number()),
    durationSeconds: v.number(),
    startTime: v.string(),
    endTime: v.string(),
    userAgent: v.optional(v.string()),
  }).index("by_session", ["sessionId"]),
});
