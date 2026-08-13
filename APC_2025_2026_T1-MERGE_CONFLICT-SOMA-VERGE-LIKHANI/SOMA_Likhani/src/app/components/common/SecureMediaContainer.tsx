import React, { useEffect } from 'react';

interface SecureMediaContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  isDarkened: boolean;
  videoRef?: React.RefObject<HTMLVideoElement>;
}

/**
 * A secure wrapper for protected media that provides:
 * 1. CSS content-visibility isolation
 * 2. Video pause-on-capture
 * 3. Canvas extraction prevention (toDataURL / toBlob / captureStream)
 * 
 * Works in tandem with useScreenshotProtection to hide/pause content
 * when screen capture or recording is suspected.
 */
export const SecureMediaContainer = React.forwardRef<HTMLDivElement, SecureMediaContainerProps>(({
  children,
  isDarkened,
  videoRef,
  className = '',
  ...props
}, ref) => {
  // Pause video when screen capture is detected
  useEffect(() => {
    if (isDarkened && videoRef?.current) {
      // If a screenshot or recording starts, pause the video immediately
      // This ensures they don't capture audio/video while the screen is black
      if (!videoRef.current.paused) {
        videoRef.current.pause();
      }
    }
  }, [isDarkened, videoRef]);

  // Prevent canvas extraction (anti-scraping)
  useEffect(() => {
    const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
    const originalToBlob = HTMLCanvasElement.prototype.toBlob;
    // @ts-ignore
    const originalCaptureStream = HTMLCanvasElement.prototype.captureStream;

    // Override extraction methods to return empty/fail
    HTMLCanvasElement.prototype.toDataURL = function () {
      return 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // transparent 1x1
    };

    HTMLCanvasElement.prototype.toBlob = function (callback) {
      if (callback) {
        callback(null);
      }
    };

    // @ts-ignore
    if (HTMLCanvasElement.prototype.captureStream) {
      // @ts-ignore
      HTMLCanvasElement.prototype.captureStream = function () {
        throw new Error('NotAllowedError: Stream capture is disabled for protected content.');
      };
    }

    return () => {
      // Restore on unmount
      HTMLCanvasElement.prototype.toDataURL = originalToDataURL;
      HTMLCanvasElement.prototype.toBlob = originalToBlob;
      if (originalCaptureStream) {
         // @ts-ignore
        HTMLCanvasElement.prototype.captureStream = originalCaptureStream;
      }
    };
  }, []);

  return (
    <div 
      ref={ref}
      className={`relative ${className}`}
      style={{ 
        // Hints to browser to isolate rendering, making OS-level extraction slightly harder
        contentVisibility: 'auto',
        contain: 'strict'
      }}
      {...props}
    >
      {/* 
        The actual content (VideoPlayer) already handles opacity:0 on isDarkened.
        This wrapper provides the pause behavior and extraction overrides.
      */}
      {children}
    </div>
  );
});

SecureMediaContainer.displayName = 'SecureMediaContainer';

export default SecureMediaContainer;
