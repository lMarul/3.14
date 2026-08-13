import React, { useState, useEffect, useRef } from 'react';

interface ProtectedVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  className?: string;
  fallbackMessage?: string;
}

export const ProtectedVideo: React.FC<ProtectedVideoProps> = ({ 
  className = '', 
  fallbackMessage = '',
  ...props 
}) => {
  const [isDarkened, setIsDarkened] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 1. Detect focus loss (Snipping Tool, switching tabs, screen recording prompts)
    const handleBlur = () => setIsDarkened(true);
    const handleFocus = () => setIsDarkened(false);

    // 2. Detect common screenshot keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMacScreenshot = e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5');
      const isWindowsScreenshot = e.metaKey && e.shiftKey && (e.key === 's' || e.key === 'S');
      const isPrintScreen = e.key === 'PrintScreen';

      if (isMacScreenshot || isWindowsScreenshot || isPrintScreen) {
        setIsDarkened(true);
        
        // Keep it dark for 3 seconds to ensure the screenshot captures the black screen
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          // Only un-darken if the window still has focus
          if (document.hasFocus()) {
            setIsDarkened(false);
          }
        }, 3000);
      }
    };

    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('keydown', handleKeyDown);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className={`relative inline-block overflow-hidden bg-black ${className}`}>
      {/* 
        Using a wrapper to enforce dimensions and keep the layout stable
        while the video is potentially covered.
      */}
      <video {...props} className={`w-full h-full object-cover transition-opacity duration-75 ${isDarkened ? 'opacity-0' : 'opacity-100'}`} />
      
      {/* Dark overlay that appears during a screenshot or blur */}
      {isDarkened && (
        <div className="absolute inset-0 bg-black z-50 flex items-center justify-center pointer-events-none">
          <span className="text-white/50 text-sm font-medium tracking-wider select-none">
            {fallbackMessage}
          </span>
        </div>
      )}
    </div>
  );
};
