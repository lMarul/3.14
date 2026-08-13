import React from "react";
import { useScreenshotProtection, ScreenshotProtectionReason } from "../../hooks/useScreenshotProtection";
import Likhaniondark1 from "../../../generated/Likhaniondark1";

/**
 * Returns the overlay message based on the protection trigger reason.
 * - devtools (F12): explicit warning that dev tools are blocked
 * - blur (focus lost): silent – only the Likhani logo is shown
 * - screenshot: existing "screenshot prevented" text
 */
function getOverlayMessage(reason: ScreenshotProtectionReason | null): string | null {
  switch (reason) {
    case 'devtools':
      return 'DEVELOPER TOOLS IS NOT ALLOWED';
    case 'screenshot':
      return 'SCREENSHOT PREVENTED';
    case 'blur':
    default:
      return null; // no text – just logo + black screen
  }
}

const GlobalScreenshotProtection = React.memo(() => {
  const { isDarkened, reason } = useScreenshotProtection({ withReason: true });

  if (!isDarkened) return null;

  const message = getOverlayMessage(reason);

  return (
    <div className="fixed top-0 left-0 w-screen h-[100svh] z-[999999] bg-black flex flex-col items-center justify-center pointer-events-none select-none">
      {/* Likhani Logo */}
      <div className="w-[220px] opacity-75">
        <Likhaniondark1 />
      </div>

      {/* Contextual message (hidden for blur/focus-loss) */}
      {message && (
        <span className="text-white/50 text-[32px] sm:text-[48px] mt-8 tracking-[0.25em] w-full text-center px-4 font-extrabold select-none uppercase">
          {message}
        </span>
      )}

      {/* SOMA Logo */}
      <img
        src="/SOMALogoFullGrey.svg"
        alt="SOMA"
        className="mt-8 w-[500px] sm:w-[720px] opacity-50 select-none pointer-events-none"
        draggable={false}
      />

      {/* All rights reserved */}
      <span className="text-white/40 text-[10px] sm:text-[12px] mt-3 tracking-[0.15em] w-full text-center px-4 font-semibold select-none uppercase">
        ALL RIGHTS RESERVED
      </span>
    </div>
  );
});

GlobalScreenshotProtection.displayName = "GlobalScreenshotProtection";

export default GlobalScreenshotProtection;
