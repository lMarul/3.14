import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const telemetryTable = defineTable({
  sessionId: v.string(),
  visitorId: v.optional(v.string()),
  screen: v.string(),
  slideIndex: v.optional(v.number()),
  durationSeconds: v.number(),
  startTime: v.string(),
  endTime: v.string(),
  // Device & Environment
  deviceType: v.optional(v.string()), // "Mobile" | "Tablet" | "Desktop"
  os: v.optional(v.string()),
  browser: v.optional(v.string()),
  screenResolution: v.optional(v.string()),
  viewport: v.optional(v.string()),
  // Location Data
  city: v.optional(v.string()),
  region: v.optional(v.string()),
  country: v.optional(v.string()),
  ip: v.optional(v.string()),
  userAgent: v.optional(v.string()),
})
  .index("by_session", ["sessionId"])
  .index("by_visitor", ["visitorId"]);

export default defineSchema({
  responses: defineTable({
    choice: v.string(),
    preferredDate: v.optional(v.union(v.string(), v.null())),
    preferredTime: v.optional(v.union(v.string(), v.null())),
    message: v.optional(v.union(v.string(), v.null())),
    createdAt: v.string(),
    userAgent: v.optional(v.string()),
  }),

  analytics: telemetryTable,
  viewTimeLogs: telemetryTable,

  appConfig: defineTable({
    configKey: v.optional(v.string()),
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
