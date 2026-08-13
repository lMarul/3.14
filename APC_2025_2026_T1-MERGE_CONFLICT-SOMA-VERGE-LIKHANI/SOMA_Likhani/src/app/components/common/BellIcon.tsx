import { Bell } from "lucide-react";
import { useCustomTheme } from "../providers/ThemeContext";
import { useEffect, useState } from "react";

export function BellIcon({ className = "" }: { className?: string }) {
  const { theme, resolvedTheme } = useCustomTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-6 h-6" />;

  const currentTheme = theme === 'system' ? resolvedTheme : theme;
  const isDim = currentTheme === 'dim';
  const isLightsOut = currentTheme === 'lights-out';
  const isDark = isDim || isLightsOut;
  const color = isDark ? "#FFFFFF" : "#000000";

  return (
    <div className={`flex items-center justify-center ${className}`} style={{ width: '24px', height: '24px' }}>
      <Bell style={{ width: '20px', height: '20px', color }} />
    </div>
  );
}

