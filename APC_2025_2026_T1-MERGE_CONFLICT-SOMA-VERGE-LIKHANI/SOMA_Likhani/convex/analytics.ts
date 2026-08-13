import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

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
    // Only log meaningful durations (> 0.2s)
    if (args.durationSeconds < 0.2) return null;

    return await ctx.db.insert("viewTimeLogs", {
      sessionId: args.sessionId,
      screen: args.screen,
      slideIndex: args.slideIndex,
      durationSeconds: Math.round(args.durationSeconds * 10) / 10,
      startTime: args.startTime,
      endTime: args.endTime,
      userAgent: args.userAgent || undefined,
    });
  },
});

export const listSessionLogs = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("viewTimeLogs").order("desc").take(500);
  },
});

export const getAnalyticsSummary = query({
  args: {},
  handler: async (ctx) => {
    const logs = await ctx.db.query("viewTimeLogs").collect();
    
    const sessionMap = new Map<string, number>();
    const screenStatsMap = new Map<string, { count: number; totalSeconds: number }>();

    let totalViewSeconds = 0;

    for (const log of logs) {
      totalViewSeconds += log.durationSeconds;

      // Track session total
      const prevSessionSec = sessionMap.get(log.sessionId) || 0;
      sessionMap.set(log.sessionId, prevSessionSec + log.durationSeconds);

      // Track screen stats
      const key = log.slideIndex !== undefined ? `${log.screen}_${log.slideIndex}` : log.screen;
      const currentStat = screenStatsMap.get(key) || { count: 0, totalSeconds: 0 };
      screenStatsMap.set(key, {
        count: currentStat.count + 1,
        totalSeconds: currentStat.totalSeconds + log.durationSeconds,
      });
    }

    const uniqueSessionsCount = sessionMap.size;
    const avgSessionDuration = uniqueSessionsCount > 0 ? Math.round((totalViewSeconds / uniqueSessionsCount) * 10) / 10 : 0;

    const screenBreakdown = Array.from(screenStatsMap.entries()).map(([key, data]) => ({
      key,
      count: data.count,
      totalSeconds: Math.round(data.totalSeconds * 10) / 10,
      avgSeconds: data.count > 0 ? Math.round((data.totalSeconds / data.count) * 10) / 10 : 0,
    }));

    return {
      totalLogs: logs.length,
      uniqueSessions: uniqueSessionsCount,
      totalViewSeconds: Math.round(totalViewSeconds * 10) / 10,
      avgSessionDuration,
      screenBreakdown,
    };
  },
});

export const clearAnalytics = mutation({
  args: {},
  handler: async (ctx) => {
    const logs = await ctx.db.query("viewTimeLogs").collect();
    for (const log of logs) {
      await ctx.db.delete(log._id);
    }
    return { deleted: logs.length };
  },
});
