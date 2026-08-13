import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCustomTheme } from "../providers/ThemeContext";

interface BackButtonProps {
  className?: string;
}

export function BackButton({ className = "" }: BackButtonProps) {
  const navigate = useNavigate();
  const { theme, resolvedTheme } = useCustomTheme();
  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const isDim = currentTheme === 'dim';
  const isLightsOut = currentTheme === 'lights-out';
  const isDark = isDim || isLightsOut;

  return (
    <button
      onClick={() => navigate(-1)}
      className={`flex items-center gap-2 font-['Poppins'] font-medium text-[14px] transition-colors ${
        isDark 
          ? "text-gray-400 hover:text-[#ff4b4b]" 
          : "text-gray-600 hover:text-[#8a181a]"
      } ${className}`}
    >
      <ArrowLeft className="w-4 h-4" />
      Back
    </button>
  );
}

