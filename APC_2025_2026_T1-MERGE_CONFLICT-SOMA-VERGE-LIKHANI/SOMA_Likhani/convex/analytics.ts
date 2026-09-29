import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const logViewTime = mutation({
  args: {
    sessionId: v.string(),
    visitorId: v.optional(v.string()),
    screen: v.string(),
    slideIndex: v.optional(v.number()),
    durationSeconds: v.number(),
    startTime: v.string(),
    endTime: v.string(),
    deviceType: v.optional(v.string()),
    os: v.optional(v.string()),
    browser: v.optional(v.string()),
    screenResolution: v.optional(v.string()),
    viewport: v.optional(v.string()),
    city: v.optional(v.string()),
    region: v.optional(v.string()),
    country: v.optional(v.string()),
    ip: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Only log meaningful durations (> 0.2s)
    if (args.durationSeconds < 0.2) return null;

    return await ctx.db.insert("viewTimeLogs", {
      sessionId: args.sessionId,
      visitorId: args.visitorId,
      screen: args.screen,
      slideIndex: args.slideIndex,
      durationSeconds: Math.round(args.durationSeconds * 10) / 10,
      startTime: args.startTime,
      endTime: args.endTime,
      deviceType: args.deviceType,
      os: args.os,
      browser: args.browser,
      screenResolution: args.screenResolution,
      viewport: args.viewport,
      city: args.city,
      region: args.region,
      country: args.country,
      ip: args.ip,
      userAgent: args.userAgent,
    });
  },
});

export const listSessionLogs = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("viewTimeLogs").order("desc").take(500);
  },
});

export const getSessionJourneys = query({
  args: {},
  handler: async (ctx) => {
    const logs = await ctx.db.query("viewTimeLogs").order("desc").take(1000);
    const sessionMap = new Map<string, typeof logs>();
    for (const log of logs) {
      const list = sessionMap.get(log.sessionId) || [];
      list.push(log);
      sessionMap.set(log.sessionId, list);
    }

    const journeys = Array.from(sessionMap.entries()).map(([sessionId, rawEvents]) => {
      const events = [...rawEvents].sort(
        (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );

      const latestEvent = events[events.length - 1];
      const firstEvent = events[0];

      const totalDurationSeconds =
        Math.round(events.reduce((sum, e) => sum + e.durationSeconds, 0) * 10) / 10;

      const visitorId = latestEvent.visitorId || firstEvent.visitorId;
      const deviceType = events.find((e) => e.deviceType)?.deviceType || "Desktop";
      const os = events.find((e) => e.os)?.os || "Unknown OS";
      const browser = events.find((e) => e.browser)?.browser || "Unknown Browser";
      const screenResolution = events.find((e) => e.screenResolution)?.screenResolution;
      const viewport = events.find((e) => e.viewport)?.viewport;
      const city = events.find((e) => e.city && e.city !== "Unknown")?.city || "Unknown";
      const region = events.find((e) => e.region && e.region !== "Unknown")?.region;
      const country = events.find((e) => e.country && e.country !== "Unknown")?.country;
      const ip = events.find((e) => e.ip)?.ip;
      const userAgent = latestEvent.userAgent;

      const lastScreen = latestEvent.screen;

      let terminalOutcome = "Viewing / Browsing";
      const screenNames = events.map((e) => e.screen);
      if (screenNames.some((s) => s === "YES_MAP" || s === "SUBMITTED_YES")) {
        terminalOutcome = "Answered YES 💖";
      } else if (screenNames.some((s) => s === "NO_FORM" || s === "SUBMITTED_NO")) {
        terminalOutcome = "Answered NO 💔";
      } else if (screenNames.some((s) => s === "QUESTION")) {
        terminalOutcome = "Reached Decision ☕";
      } else if (screenNames.some((s) => s.startsWith("SLIDE"))) {
        terminalOutcome = `Viewing Slides (${lastScreen})`;
      } else if (screenNames.some((s) => s.startsWith("QUIZ"))) {
        terminalOutcome = `On Quiz (${lastScreen})`;
      } else if (lastScreen === "INTRO") {
        terminalOutcome = "Bounced on Intro";
      }

      return {
        sessionId,
        visitorId,
        deviceType,
        os,
        browser,
        screenResolution,
        viewport,
        city,
        region,
        country,
        ip,
        userAgent,
        startTime: firstEvent.startTime,
        endTime: latestEvent.endTime || latestEvent.startTime,
        totalDurationSeconds,
        eventCount: events.length,
        lastScreen,
        terminalOutcome,
        events,
      };
    });

    return journeys.sort(
      (a, b) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime()
    );
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

      const prevSessionSec = sessionMap.get(log.sessionId) || 0;
      sessionMap.set(log.sessionId, prevSessionSec + log.durationSeconds);

      const key =
        log.slideIndex !== undefined ? `${log.screen}_${log.slideIndex}` : log.screen;
      const currentStat = screenStatsMap.get(key) || { count: 0, totalSeconds: 0 };
      screenStatsMap.set(key, {
        count: currentStat.count + 1,
        totalSeconds: currentStat.totalSeconds + log.durationSeconds,
      });
    }

    const uniqueSessionsCount = sessionMap.size;
    const avgSessionDuration =
      uniqueSessionsCount > 0
        ? Math.round((totalViewSeconds / uniqueSessionsCount) * 10) / 10
        : 0;

    const screenBreakdown = Array.from(screenStatsMap.entries()).map(([key, data]) => ({
      key,
      count: data.count,
      totalSeconds: Math.round(data.totalSeconds * 10) / 10,
      avgSeconds:
        data.count > 0 ? Math.round((data.totalSeconds / data.count) * 10) / 10 : 0,
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
