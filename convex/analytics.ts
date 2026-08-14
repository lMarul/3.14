import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Log a single view-time telemetry event.
 * Called by ConfPage on each screen/slide transition and page unload.
 */
export const logViewTime = mutation({
  args: {
    sessionId: v.string(),
    screen: v.string(),
    slideIndex: v.optional(v.number()),
    durationSeconds: v.number(),
    startTime: v.string(),
    endTime: v.string(),
    userAgent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("analytics", args);
  },
});

/**
 * Aggregate all telemetry records into a summary for the admin dashboard.
 * Returns: totalLogs, uniqueSessions, totalViewSeconds, avgSessionDuration, screenBreakdown
 */
export const getAnalyticsSummary = query({
  args: {},
  handler: async (ctx) => {
    const logs = await ctx.db.query("analytics").order("desc").collect();

    if (logs.length === 0) {
      return {
        totalLogs: 0,
        uniqueSessions: 0,
        totalViewSeconds: 0,
        avgSessionDuration: 0,
        screenBreakdown: [],
      };
    }

    const sessionMap = new Map<string, number>();
    const screenStatsMap = new Map<string, { count: number; totalSeconds: number }>();
    let totalViewSeconds = 0;

    for (const log of logs) {
      totalViewSeconds += log.durationSeconds;

      const prevSessionSec = sessionMap.get(log.sessionId) || 0;
      sessionMap.set(log.sessionId, prevSessionSec + log.durationSeconds);

      const key =
        log.slideIndex !== undefined
          ? `${log.screen}_${log.slideIndex}`
          : log.screen;
      const currentStat = screenStatsMap.get(key) || { count: 0, totalSeconds: 0 };
      screenStatsMap.set(key, {
        count: currentStat.count + 1,
        totalSeconds: currentStat.totalSeconds + log.durationSeconds,
      });
    }

    const uniqueSessions = sessionMap.size;
    const avgSessionDuration =
      uniqueSessions > 0
        ? Math.round((totalViewSeconds / uniqueSessions) * 10) / 10
        : 0;

    const screenBreakdown = Array.from(screenStatsMap.entries()).map(
      ([key, data]) => ({
        key,
        count: data.count,
        totalSeconds: Math.round(data.totalSeconds * 10) / 10,
        avgSeconds:
          data.count > 0
            ? Math.round((data.totalSeconds / data.count) * 10) / 10
            : 0,
      })
    );

    return {
      totalLogs: logs.length,
      uniqueSessions,
      totalViewSeconds: Math.round(totalViewSeconds * 10) / 10,
      avgSessionDuration,
      screenBreakdown,
    };
  },
});

/**
 * List recent telemetry log entries (most recent first, capped at 200).
 */
export const listSessionLogs = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("analytics").order("desc").take(200);
  },
});

/**
 * Delete all analytics records. Admin-only operation.
 */
export const clearAnalytics = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("analytics").collect();
    await Promise.all(all.map((doc) => ctx.db.delete(doc._id)));
    return all.length;
  },
});
