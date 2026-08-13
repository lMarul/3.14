import { motion } from "motion/react";
import { useCustomTheme } from "../providers/ThemeContext";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

/**
 * PRIMARY BUTTON
 * Filled, brand color background
 * Use once per section for the main action
 */
export function PrimaryButton({ children, onClick, disabled = false, className = "", style = {}, type = "button" }: any) {
  const { theme, resolvedTheme } = useCustomTheme();
  const currentTheme = theme === 'system' ? resolvedTheme : theme;
  const isDim = currentTheme === 'dim';
  const isLightsOut = currentTheme === 'lights-out';
  const isDark = isDim || isLightsOut;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={style}
      className={`
        px-6 py-4 rounded-lg
        font-['Poppins'] font-semibold text-sm
        transition-all duration-200 ease-out
        outline-none
        focus-visible:ring-2 focus-visible:ring-offset-2
        ${isDark
          ? 'focus-visible:ring-[#ff4b4b]/60 focus-visible:ring-offset-[#1a1a1a]'
          : 'focus-visible:ring-[#8a181a]/50 focus-visible:ring-offset-[#f7f6f3]'
        }
        ${disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:brightness-[0.88] active:brightness-[0.75] active:scale-[0.98]'
        }
        ${isDark 
          ? 'bg-[#ff4b4b] text-white' 
          : 'bg-[#8a181a] text-white'
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
}

/**
 * SECONDARY BUTTON
 * Outlined or subtle filled
 * For secondary actions
 */
export function SecondaryButton({ children, onClick, disabled = false, className = "", style = {}, type = "button" }: any) {
  const { theme, resolvedTheme } = useCustomTheme();
  const currentTheme = theme === 'system' ? resolvedTheme : theme;
  const isDim = currentTheme === 'dim';
  const isLightsOut = currentTheme === 'lights-out';
  const isDark = isDim || isLightsOut;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={style}
      className={`
        px-6 py-4 rounded-lg
        font-['Poppins'] font-semibold text-sm
        border transition-all duration-220 ease-out
        ${disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:shadow-md hover:brightness-110'
        }
        ${isDark 
          ? 'border-white/30 bg-white/10 text-white backdrop-blur-md' 
          : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
}

/**
 * TERTIARY BUTTON
 * Text-only, minimal style
 * For tertiary/auxiliary actions
 */
export function TertiaryButton({ children, onClick, disabled = false, className = "", style = {}, type = "button" }: any) {
  const { theme, resolvedTheme } = useCustomTheme();
  const currentTheme = theme === 'system' ? resolvedTheme : theme;
  const isDim = currentTheme === 'dim';
  const isLightsOut = currentTheme === 'lights-out';
  const isDark = isDim || isLightsOut;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={style}
      className={`
        font-['Poppins'] font-semibold text-[14px]
        transition-all duration-220 ease-out
        hover:opacity-70
        ${disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : ''
        }
        ${isDark 
          ? 'text-white' 
          : 'text-gray-900'
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
}
