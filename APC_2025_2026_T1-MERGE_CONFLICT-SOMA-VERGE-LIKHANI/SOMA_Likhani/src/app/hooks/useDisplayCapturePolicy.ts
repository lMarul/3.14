import { useEffect } from 'react';

/**
 * Hook to actively block the Screen Capture API (getDisplayMedia).
 * 
 * 1. Attempts to inject a Permissions-Policy meta tag (support varies by browser)
 * 2. Monkey-patches navigator.mediaDevices.getDisplayMedia to always reject
 * 
 * This prevents browser extensions and users from easily using the built-in
 * screen sharing / capture APIs to record the protected content.
 */
export function useDisplayCapturePolicy() {
  useEffect(() => {
    // 1. Inject Permissions-Policy meta tag (best effort)
    const metaId = 'display-capture-policy';
    if (!document.getElementById(metaId)) {
      const meta = document.createElement('meta');
      meta.id = metaId;
      meta.httpEquiv = 'Permissions-Policy';
      meta.content = 'display-capture=()';
      document.head.appendChild(meta);
    }

    // 2. Monkey-patch getDisplayMedia to block it
    if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
      // Store original in case we ever need to restore it (we don't for Likhani)
      const originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia.bind(navigator.mediaDevices);
      
      // Override
      // @ts-ignore - TS complains about the override type
      navigator.mediaDevices.getDisplayMedia = async (constraints?: MediaStreamConstraints) => {
        console.warn('Screen capture is disabled by security policy.');
        throw new Error('NotAllowedError: Screen capture is disabled for protected content.');
      };

      return () => {
        // Cleanup: restore original if component unmounts
        // @ts-ignore
        navigator.mediaDevices.getDisplayMedia = originalGetDisplayMedia;
        
        const meta = document.getElementById(metaId);
        if (meta) {
          meta.remove();
        }
      };
    }
  }, []);
}
