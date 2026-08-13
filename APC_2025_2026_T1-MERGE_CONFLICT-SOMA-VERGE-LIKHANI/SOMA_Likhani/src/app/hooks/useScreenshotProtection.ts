import { useState, useEffect, useRef } from 'react';

// Static handlers instantiated once to save memory
const preventDefault = (e: Event) => e.preventDefault();

export type ScreenshotProtectionReason = 'screenshot' | 'devtools' | 'blur';

type ScreenshotProtectionState = {
  isDarkened: boolean;
  reason: ScreenshotProtectionReason | null;
};

export function useScreenshotProtection(): boolean;
export function useScreenshotProtection(options: { withReason: true }): ScreenshotProtectionState;
export function useScreenshotProtection(options?: { withReason?: boolean }): boolean | ScreenshotProtectionState {
  // TEMPORARILY DISABLED ANTI-SCREENSHOT
  if (options?.withReason) {
    return { isDarkened: false, reason: null };
  }
  return false;

  const [state, setState] = useState<ScreenshotProtectionState>({
    isDarkened: false,
    reason: null,
  });

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const darken = (reason: ScreenshotProtectionReason) => {
      setState({ isDarkened: true, reason });
    };

    const clearDarknessAfterDelay = (delayMs: number) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        if (!document.hidden && document.hasFocus()) {
          setState({ isDarkened: false, reason: null });
        }
      }, delayMs);
    };

    // 1. Handle visibility change (switching tabs away, minimized)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        darken('blur');
      } else {
        clearDarknessAfterDelay(200);
      }
    };

    // 1b. Handle window blur/focus (catches Snipping Tool overlay, mobile screen recording start)
    const handleBlur = (e: FocusEvent) => {
      if (e.target !== window && e.target !== document) return;
      darken('blur');
    };
    const handleFocus = (e: FocusEvent) => {
      if (e.target !== window && e.target !== document) return;
      clearDarknessAfterDelay(200);
    };

    // 2. Detect common screenshot / devtools keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // PRE-EMPTIVE DARKENING: Check modifier keys first for high performance
      const hasModifiers = e.shiftKey && (e.metaKey || e.ctrlKey);
      
      if (hasModifiers) {
        const key = e.key.toLowerCase();
        // Check for specific screenshot / devtools keys
        const isScreenshotKey = key === '3' || key === '4' || key === '5' || key === 's';
        const isDevToolsKey = key === 'i' || key === 'j' || key === 'c';

        // Darken immediately on modifier hold
        darken(isDevToolsKey ? 'devtools' : 'screenshot');

        if (isScreenshotKey || isDevToolsKey) {
          e.preventDefault();
          e.stopPropagation();
          clearDarknessAfterDelay(1500);
          return;
        }
      }

      const isPrintScreen = e.key === 'PrintScreen' || e.code === 'PrintScreen';
      const isF12 = e.key === 'F12' || e.code === 'F12';

      if (isPrintScreen || isF12) {
        darken(isF12 ? 'devtools' : 'screenshot');
        if (isF12) {
          e.preventDefault();
          e.stopPropagation();
        }
        clearDarknessAfterDelay(1500);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
       // Only un-darken if we preemptively darkened but they released the modifier keys without taking a screenshot
       if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Meta') {
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => {
             if (!document.hidden && !e.ctrlKey && !e.metaKey) {
              setState({ isDarkened: false, reason: null });
             }
          }, 300);
       }

       if (e.key === 'PrintScreen' || e.code === 'PrintScreen') {
          darken('screenshot');
          clearDarknessAfterDelay(1500);
       }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    window.addEventListener('keyup', handleKeyUp, { capture: true });
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange, { capture: true });
    document.addEventListener('contextmenu', preventDefault, { capture: true });
    document.addEventListener('dragstart', preventDefault, { capture: true });
    document.addEventListener('copy', preventDefault, { capture: true });
    document.addEventListener('cut', preventDefault, { capture: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
      window.removeEventListener('keyup', handleKeyUp, { capture: true });
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange, { capture: true });
      document.removeEventListener('contextmenu', preventDefault, { capture: true });
      document.removeEventListener('dragstart', preventDefault, { capture: true });
      document.removeEventListener('copy', preventDefault, { capture: true });
      document.removeEventListener('cut', preventDefault, { capture: true });
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return options?.withReason ? state : state.isDarkened;
}
