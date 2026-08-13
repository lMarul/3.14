import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface WatermarkData {
  username: string;
  emailFragment: string;
  sessionFragment: string;
  timestamp: string;
  deviceId: string;
  /** Pre-formatted multi-line watermark text */
  displayText: string;
}

/**
 * Derives a short browser/device identifier from the User-Agent string.
 * Kept deliberately simple to avoid heavy UA parsing libraries.
 */
function getDeviceId(): string {
  const ua = navigator.userAgent;

  let browser = 'Browser';
  if (ua.includes('Edg/')) browser = 'Edge';
  else if (ua.includes('OPR/') || ua.includes('Opera')) browser = 'Opera';
  else if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
  else if (ua.includes('Firefox')) browser = 'Firefox';

  let os = 'OS';
  if (ua.includes('Windows')) os = 'Win';
  else if (ua.includes('Mac OS')) os = 'Mac';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
  else if (ua.includes('Linux')) os = 'Linux';

  return `${browser}/${os}`;
}

/**
 * Generates dynamic, user-specific watermark data.
 *
 * - Reads user info from localStorage (existing authStorage pattern)
 * - Reads session ID from Supabase auth (if configured)
 * - Refreshes the timestamp every 60 seconds (event-driven, not polling)
 * - Returns a memoised WatermarkData object
 */
export function useWatermarkData(): WatermarkData {
  const [sessionFragment, setSessionFragment] = useState('');
  const [tick, setTick] = useState(0);

  // Fetch session fragment once on mount
  useEffect(() => {
    let cancelled = false;

    async function fetchSession() {
      if (!isSupabaseConfigured || !supabase) {
        setSessionFragment('no-session');
        return;
      }
      try {
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token ?? '';
        if (!cancelled) {
          setSessionFragment(token ? token.slice(-8) : 'guest');
        }
      } catch {
        if (!cancelled) setSessionFragment('err');
      }
    }

    fetchSession();
    return () => { cancelled = true; };
  }, []);

  // Refresh timestamp every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 60_000);
    return () => clearInterval(interval);
  }, []);

  const data = useMemo<WatermarkData>(() => {
    const username = localStorage.getItem('userName') || 'Guest';
    const email = localStorage.getItem('userEmail') || '';
    const isGuest = localStorage.getItem('isGuest') === 'true';

    // Obscure email: show first 3 chars + @domain
    let emailFragment = '';
    if (email) {
      const [local, domain] = email.split('@');
      emailFragment = local
        ? `${local.slice(0, 3)}***@${domain || ''}`
        : email.slice(0, 6);
    }

    const now = new Date();
    const timestamp = `${now.toLocaleDateString('en-PH', {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit',
    })} ${now.toLocaleTimeString('en-PH', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })}`;

    const deviceId = getDeviceId();

    const displayLines = isGuest
      ? `Guest Session\n${timestamp}\n${deviceId}`
      : `${username}\n${emailFragment}\nSID:${sessionFragment}\n${timestamp}`;

    return {
      username: isGuest ? 'Guest' : username,
      emailFragment,
      sessionFragment,
      timestamp,
      deviceId,
      displayText: displayLines,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionFragment, tick]);

  return data;
}
