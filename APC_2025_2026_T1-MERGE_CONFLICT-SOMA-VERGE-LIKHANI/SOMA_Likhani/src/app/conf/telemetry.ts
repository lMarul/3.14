export interface TelemetryLog {
  id: string;
  sessionId: string;
  screen: string;
  slideIndex?: number;
  durationSeconds: number;
  startTime: string;
  endTime: string;
  userAgent?: string;
}

const STORAGE_KEY = 'conf_app_telemetry_logs';

export const getLocalTelemetryLogs = (): TelemetryLog[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}
  return [];
};

export const saveLocalTelemetryLog = (log: Omit<TelemetryLog, 'id'>): TelemetryLog | null => {
  try {
    const existing = getLocalTelemetryLogs();
    const newLog: TelemetryLog = {
      ...log,
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    };
    const updated = [newLog, ...existing].slice(0, 1000);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newLog;
  } catch (e) {
    return null;
  }
};

export const computeAnalyticsSummary = (logs: TelemetryLog[]) => {
  const sessionMap = new Map<string, number>();
  const screenStatsMap = new Map<string, { count: number; totalSeconds: number }>();
  let totalViewSeconds = 0;

  for (const log of logs) {
    totalViewSeconds += log.durationSeconds;

    const prevSessionSec = sessionMap.get(log.sessionId) || 0;
    sessionMap.set(log.sessionId, prevSessionSec + log.durationSeconds);

    const key = log.slideIndex !== undefined ? `${log.screen}_${log.slideIndex}` : log.screen;
    const currentStat = screenStatsMap.get(key) || { count: 0, totalSeconds: 0 };
    screenStatsMap.set(key, {
      count: currentStat.count + 1,
      totalSeconds: currentStat.totalSeconds + log.durationSeconds,
    });
  }

  const uniqueSessions = sessionMap.size;
  const avgSessionDuration = uniqueSessions > 0 ? Math.round((totalViewSeconds / uniqueSessions) * 10) / 10 : 0;

  const screenBreakdown = Array.from(screenStatsMap.entries()).map(([key, data]) => ({
    key,
    count: data.count,
    totalSeconds: Math.round(data.totalSeconds * 10) / 10,
    avgSeconds: data.count > 0 ? Math.round((data.totalSeconds / data.count) * 10) / 10 : 0,
  }));

  return {
    totalLogs: logs.length,
    uniqueSessions,
    totalViewSeconds: Math.round(totalViewSeconds * 10) / 10,
    avgSessionDuration,
    screenBreakdown,
  };
};

export const clearLocalTelemetryLogs = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {}
};
