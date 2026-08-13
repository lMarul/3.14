import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useCustomTheme } from "../providers/ThemeContext";

interface DropdownOption {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  value: string;
  onChange: (val: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  className?: string;
  isFullWidth?: boolean;
  size?: 'sm' | 'md';
  buttonClassName?: string;
}

export function CustomDropdown({
  value,
  onChange,
  options,
  placeholder = "Select Option",
  className = "",
  isFullWidth = false,
  size = "md",
  buttonClassName = "",
}: CustomDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { theme, resolvedTheme } = useCustomTheme();
  
  const currentTheme = theme === 'system' ? resolvedTheme : theme;
  const isDim = currentTheme === 'dim';
  const isLightsOut = currentTheme === 'lights-out';
  const isDark = isDim || isLightsOut;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const currentOption = options.find((o) => o.value === value);

  // Styling tokens based on theme
  const buttonBg = isLightsOut ? "bg-[#000000]" : isDim ? "bg-[#1E2A36]" : "bg-[#F3F3F5]";
  const buttonBorder = isLightsOut ? "border-gray-800" : isDim ? "border-[#38444D]" : "border-[#E5E7EB]";
  const buttonText = currentOption ? (isDark ? "text-white" : "text-gray-900") : (isDark ? "text-gray-400" : "text-gray-500");
  
  const listBg = isLightsOut ? "bg-[#000000]" : isDim ? "bg-[#1E2A36]" : "bg-white";
  const listBorder = isLightsOut ? "border-gray-800" : isDim ? "border-[#38444D]" : "border-gray-200";

  return (
    <div 
      className={`relative ${isFullWidth ? "w-full" : "w-full sm:w-[200px]"} ${className}`} 
      ref={ref}
    >
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={`flex items-center justify-between w-full ${size === 'sm' ? 'h-10 rounded-md py-2' : 'h-[50px] rounded-[14px] py-3'} ${buttonBg} border ${buttonBorder} ${buttonText} px-4 focus:outline-none focus:border-[#8A181A] dark:focus:border-[#ff4b4b] text-left text-sm font-semibold transition-all cursor-pointer ${buttonClassName}`}
      >
        <span className="truncate">{currentOption ? currentOption.label : placeholder}</span>
        <ChevronDown className={`w-4 h-4 text-[#99A1AF] transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className={`absolute left-0 top-full mt-2 w-full rounded-xl border shadow-xl z-50 overflow-hidden ${listBg} ${listBorder}`}
          >
            <div className="max-h-[220px] overflow-y-auto no-scrollbar py-1">
              {options.map((opt) => {
                const isSelected = opt.value === value;
                const optionTextClass = isSelected
                  ? isDark
                    ? "text-[#ff4b4b] bg-[#ff4b4b]/10 font-bold"
                    : "text-[#8A181A] bg-[#8A181A]/5 font-bold"
                  : isDark
                  ? "text-gray-300 hover:text-white hover:bg-white/5"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-50";

                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer ${optionTextClass}`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
