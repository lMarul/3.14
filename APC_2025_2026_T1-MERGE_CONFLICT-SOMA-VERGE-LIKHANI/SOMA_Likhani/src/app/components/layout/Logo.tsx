import React, { useState, useEffect } from "react";
import Likhaniondark from "../../../generated/Likhaniondark1";
import Likhanionwhite from "../../../generated/Likhanionwhite1";
import { useCustomTheme } from "../providers/ThemeContext";

interface LogoProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

export default function Logo({ className = "", width, height }: LogoProps) {
  const { theme, resolvedTheme } = useCustomTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div 
        className={className} 
        style={{ 
          width: width ? (typeof width === 'number' ? `${width}px` : width) : 'auto', 
          height: height ? (typeof height === 'number' ? `${height}px` : height) : '32px',
          visibility: 'hidden'
        }} 
      />
    );
  }

  const currentTheme = theme === 'system' ? resolvedTheme : theme;
  const isDim = currentTheme === 'dim';
  const isLightsOut = currentTheme === 'lights-out';
  const isDark = isDim || isLightsOut;

  return (
    <div 
      className={`flex items-center justify-center ${className}`} 
      style={{ 
        width: width ? (typeof width === 'number' ? `${width}px` : width) : 'auto', 
        height: height ? (typeof height === 'number' ? `${height}px` : height) : '32px' 
      }}
    >
      <div className="h-full w-auto aspect-[1532/343]">
        {isDark ? <Likhaniondark /> : <Likhanionwhite />}
      </div>
    </div>
  );
}

