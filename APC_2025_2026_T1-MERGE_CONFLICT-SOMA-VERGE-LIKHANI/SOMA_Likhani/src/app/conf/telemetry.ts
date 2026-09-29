import type { ResponseData } from './types';

export interface DeviceInfo {
  deviceType: 'Mobile' | 'Tablet' | 'Desktop';
  os: string;
  browser: string;
  screenResolution: string;
  viewport: string;
}

export interface GeoLocationInfo {
  city?: string;
  region?: string;
  country?: string;
  ip?: string;
  timezone?: string;
}

export interface TelemetryLog {
  id: string;
  sessionId: string;
  visitorId?: string;
  screen: string;
  slideIndex?: number;
  durationSeconds: number;
  startTime: string;
  endTime: string;
  deviceType?: 'Mobile' | 'Tablet' | 'Desktop' | string;
  os?: string;
  browser?: string;
  screenResolution?: string;
  viewport?: string;
  city?: string;
  region?: string;
  country?: string;
  ip?: string;
  userAgent?: string;
}

export interface SessionJourney {
  sessionId: string;
  visitorId?: string;
  deviceType: 'Mobile' | 'Tablet' | 'Desktop' | string;
  os: string;
  browser: string;
  screenResolution?: string;
  viewport?: string;
  city?: string;
  region?: string;
  country?: string;
  ip?: string;
  userAgent?: string;
  startTime: string;
  endTime: string;
  totalDurationSeconds: number;
  eventCount: number;
  lastScreen: string;
  terminalOutcome: string;
  outcomeType: 'YES' | 'NO' | 'DECISION' | 'SLIDES' | 'QUIZ' | 'BOUNCED' | 'OTHER';
  events: TelemetryLog[];
}

const STORAGE_KEY = 'conf_app_telemetry_logs';
const VISITOR_KEY = 'conf_visitor_id';
const SESSION_KEY = 'conf_session_id';
const GEO_CACHE_KEY = 'conf_geo_location';

/**
 * Retrieve or initialize persistent visitor ID across browser reopens
 */
export const getVisitorId = (): string => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return 'vis_server';
  }
  try {
    let vid = localStorage.getItem(VISITOR_KEY);
    if (!vid) {
      vid = 'vis_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
      localStorage.setItem(VISITOR_KEY, vid);
    }
    return vid;
  } catch (e) {
    return 'vis_fallback_' + Date.now();
  }
};

/**
 * Retrieve or initialize ephemeral session ID for active tab/visit
 */
export const getSessionId = (): string => {
  if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') {
    return 'sess_server';
  }
  try {
    let sid = sessionStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = 'sess_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
      sessionStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
  } catch (e) {
    return 'sess_fallback_' + Date.now();
  }
};

/**
 * Device & Platform Fingerprinting
 * Evaluates screen dimensions, touch capabilities, and user agent
 */
export const getDeviceInfo = (): DeviceInfo => {
  if (typeof window === 'undefined') {
    return {
      deviceType: 'Desktop',
      os: 'Unknown',
      browser: 'Unknown',
      screenResolution: '0x0',
      viewport: '0x0',
    };
  }

  const ua = navigator.userAgent || '';
  const maxTouchPoints = navigator.maxTouchPoints || 0;

  // OS detection
  let os = 'Unknown OS';
  if (/windows nt/i.test(ua)) {
    os = 'Windows';
  } else if (/iphone|ipad|ipod/i.test(ua) || (navigator.platform === 'MacIntel' && maxTouchPoints > 1)) {
    os = 'iOS';
  } else if (/macintosh|mac os x/i.test(ua)) {
    os = 'macOS';
  } else if (/android/i.test(ua)) {
    os = 'Android';
  } else if (/linux/i.test(ua)) {
    os = 'Linux';
  } else if (/cros/i.test(ua)) {
    os = 'Chrome OS';
  }

  // Browser detection
  let browser = 'Unknown Browser';
  if (/edg(e|a|ios)?\//i.test(ua)) {
    browser = 'Edge';
  } else if (/opr\/|opera/i.test(ua)) {
    browser = 'Opera';
  } else if (/chrome|crios/i.test(ua)) {
    browser = 'Chrome';
  } else if (/firefox|fxios/i.test(ua)) {
    browser = 'Firefox';
  } else if (/safari/i.test(ua)) {
    browser = 'Safari';
  }

  // Device Type detection
  let deviceType: 'Mobile' | 'Tablet' | 'Desktop' = 'Desktop';
  const isTablet =
    /ipad|tablet|(android(?!.*mobile))/i.test(ua) ||
    (navigator.platform === 'MacIntel' && maxTouchPoints > 1);
  const isMobile =
    /mobi|iphone|ipod|android.*mobile|blackberry|opera mini|iemobile/i.test(ua) ||
    (window.innerWidth <= 768 && maxTouchPoints > 0);

  if (isTablet) {
    deviceType = 'Tablet';
  } else if (isMobile) {
    deviceType = 'Mobile';
  } else {
    deviceType = 'Desktop';
  }

  const screenResolution = `${window.screen?.width || window.innerWidth || 0}x${window.screen?.height || window.innerHeight || 0}`;
  const viewport = `${window.innerWidth || 0}x${window.innerHeight || 0}`;

  return {
    deviceType,
    os,
    browser,
    screenResolution,
    viewport,
  };
};

// In-flight singleton promise for passive geo-IP lookup
let inFlightGeoPromise: Promise<GeoLocationInfo> | null = null;

/**
 * Returns cached location synchronously if available
 */
export const getCachedLocation = (): GeoLocationInfo => {
  if (typeof sessionStorage === 'undefined') {
    return { city: 'Unknown', region: 'Unknown', country: 'Unknown' };
  }
  try {
    const raw = sessionStorage.getItem(GEO_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') return parsed;
    }
  } catch (e) {}
  return { city: 'Unknown', region: 'Unknown', country: 'Unknown' };
};

/**
 * Passive Non-Intrusive Location Logging
 * Uses lightweight IP lookups with strict 2.5-second abort timeouts and silent failure
 */
export const getPassiveLocation = async (): Promise<GeoLocationInfo> => {
  if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') {
    return { city: 'Unknown', region: 'Unknown', country: 'Unknown' };
  }

  // Check cache first
  const cached = getCachedLocation();
  if (cached.city && cached.city !== 'Unknown') {
    return cached;
  }

  // Share in-flight promise
  if (inFlightGeoPromise) {
    return inFlightGeoPromise;
  }

  inFlightGeoPromise = (async (): Promise<GeoLocationInfo> => {
    // Attempt 1: freeipapi.com
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const res = await fetch('https://freeipapi.com/api/json', {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const info: GeoLocationInfo = {
          city: data.cityName || 'Unknown',
          region: data.regionName || 'Unknown',
          country: data.countryName || data.countryCode || 'Unknown',
          ip: data.ipAddress || undefined,
          timezone: data.timeZone || undefined,
        };
        sessionStorage.setItem(GEO_CACHE_KEY, JSON.stringify(info));
        return info;
      }
    } catch (e) {
      // Proceed to fallback
    }

    // Attempt 2 fallback: ipapi.co
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const res = await fetch('https://ipapi.co/json/', {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const info: GeoLocationInfo = {
          city: data.city || 'Unknown',
          region: data.region || 'Unknown',
          country: data.country_name || data.country || 'Unknown',
          ip: data.ip || undefined,
          timezone: data.timezone || undefined,
        };
        sessionStorage.setItem(GEO_CACHE_KEY, JSON.stringify(info));
        return info;
      }
    } catch (e) {
      // Silent failure
    }

    const fallback: GeoLocationInfo = { city: 'Unknown', region: 'Unknown', country: 'Unknown' };
    try {
      sessionStorage.setItem(GEO_CACHE_KEY, JSON.stringify(fallback));
    } catch (e) {}
    return fallback;
  })().finally(() => {
    inFlightGeoPromise = null;
  });

  return inFlightGeoPromise;
};

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
    const visitorId = log.visitorId || getVisitorId();
    const device = getDeviceInfo();
    const geo = getCachedLocation();

    const newLog: TelemetryLog = {
      ...log,
      visitorId,
      deviceType: log.deviceType || device.deviceType,
      os: log.os || device.os,
      browser: log.browser || device.browser,
      screenResolution: log.screenResolution || device.screenResolution,
      viewport: log.viewport || device.viewport,
      city: log.city || geo.city,
      region: log.region || geo.region,
      country: log.country || geo.country,
      ip: log.ip || geo.ip,
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    };
    const updated = [newLog, ...existing].slice(0, 1000);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newLog;
  } catch (e) {
    return null;
  }
};

export const clearLocalTelemetryLogs = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {}
};

/**
 * Aggregates logs into Global Averages & Screen Breakdown
 */
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

/**
 * Groups logs into individual visitor session journeys sorted chronologically
 */
export const computeSessionJourneys = (
  logs: TelemetryLog[],
  responses: ResponseData[] = []
): SessionJourney[] => {
  if (!logs || logs.length === 0) return [];

  const sessionMap = new Map<string, TelemetryLog[]>();
  for (const log of logs) {
    if (!log.sessionId) continue;
    const list = sessionMap.get(log.sessionId) || [];
    list.push(log);
    sessionMap.set(log.sessionId, list);
  }

  const journeys: SessionJourney[] = Array.from(sessionMap.entries()).map(([sessionId, rawEvents]) => {
    // Sort events in chronological order (earliest first)
    const events = [...rawEvents].sort(
      (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

    const firstEvent = events[0];
    const latestEvent = events[events.length - 1];

    const totalDurationSeconds =
      Math.round(events.reduce((sum, e) => sum + (e.durationSeconds || 0), 0) * 10) / 10;

    const visitorId = latestEvent.visitorId || firstEvent.visitorId;
    const deviceType = events.find((e) => e.deviceType)?.deviceType || 'Desktop';
    const os = events.find((e) => e.os && e.os !== 'Unknown OS')?.os || 'Unknown OS';
    const browser = events.find((e) => e.browser && e.browser !== 'Unknown Browser')?.browser || 'Unknown Browser';
    const screenResolution = events.find((e) => e.screenResolution)?.screenResolution;
    const viewport = events.find((e) => e.viewport)?.viewport;

    // Resolve location
    const city = events.find((e) => e.city && e.city !== 'Unknown')?.city || 'Unknown';
    const region = events.find((e) => e.region && e.region !== 'Unknown')?.region;
    const country = events.find((e) => e.country && e.country !== 'Unknown')?.country;
    const ip = events.find((e) => e.ip)?.ip;
    const userAgent = latestEvent.userAgent || firstEvent.userAgent;

    const lastScreen = latestEvent.screen || 'UNKNOWN';

    // Outcome determination
    const screenNames = events.map((e) => e.screen);
    let terminalOutcome = 'Browsing';
    let outcomeType: SessionJourney['outcomeType'] = 'OTHER';

    if (screenNames.some((s) => s === 'YES_MAP' || s === 'SUBMITTED_YES')) {
      terminalOutcome = 'Answered YES 💖';
      outcomeType = 'YES';
    } else if (screenNames.some((s) => s === 'NO_FORM' || s === 'SUBMITTED_NO')) {
      terminalOutcome = 'Answered NO 💔';
      outcomeType = 'NO';
    } else if (screenNames.some((s) => s === 'QUESTION')) {
      terminalOutcome = 'Reached Decision ☕';
      outcomeType = 'DECISION';
    } else if (screenNames.some((s) => s.startsWith('SLIDE'))) {
      terminalOutcome = `Viewing Slides (${lastScreen})`;
      outcomeType = 'SLIDES';
    } else if (screenNames.some((s) => s.startsWith('QUIZ'))) {
      terminalOutcome = `On Quiz (${lastScreen})`;
      outcomeType = 'QUIZ';
    } else if (lastScreen === 'INTRO') {
      terminalOutcome = 'Bounced on Intro';
      outcomeType = 'BOUNCED';
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
      outcomeType,
      events,
    };
  });

  // Sort journeys by most recent activity descending
  return journeys.sort(
    (a, b) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime()
  );
};
