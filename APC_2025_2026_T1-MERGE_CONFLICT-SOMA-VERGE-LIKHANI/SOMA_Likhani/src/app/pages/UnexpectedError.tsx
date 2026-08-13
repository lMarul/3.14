import { useNavigate } from "react-router-dom";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { motion } from "motion/react";
import { useCustomTheme } from "../components/providers/ThemeContext";
import { PrimaryButton, SecondaryButton } from "../components/common/StandardButtons";

export default function UnexpectedError() {
  const navigate = useNavigate();
  const { theme, resolvedTheme } = useCustomTheme();
  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const isDim = currentTheme === 'dim';
  const isLightsOut = currentTheme === 'lights-out';
  const isDark = isDim || isLightsOut;

  return (
    <div className={`min-h-screen ${isLightsOut ? "bg-[#000000]" : isDim ? "bg-[#15202B]" : "bg-gradient-to-br from-[#F5F2EE] via-[#ECE8E2] to-[#E6E1DA]"} flex items-center justify-center px-4 font-['Poppins']`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className={`w-[384px] h-[461.9px] ${isDark ? "bg-[#1E2A36] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.4),_0px_10px_30px_-4px_rgba(0,0,0,0.5)] border border-white/10" : "bg-white shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.06),_0px_10px_30px_-4px_rgba(0,0,0,0.09)]"} rounded-[20px] flex flex-col items-center px-10 relative`}
      >
        <div className={`w-16 h-16 ${isDark ? "bg-[#252525] text-[#9A9390]" : "bg-[#F4F4F4] text-[#9CA3AF]"} rounded-full flex justify-center items-center mt-12 mb-6`}>
          <AlertTriangle size={28} strokeWidth={2.33} />
        </div>

        <p className={`text-[12px] font-semibold tracking-[1.44px] uppercase ${isDark ? "text-[#5A5654]" : "text-[#C0BBB5]"} mb-[30px] leading-[18px]`}>
          Error 500
        </p>

        <h1 className={`text-[22px] font-bold ${isDark ? "text-[#EDE9E4]" : "text-[#1A1A1A]"} mb-[10px] leading-[29px] text-center`}>
          Unexpected Error
        </h1>

        <p className={`text-[14px] ${isDark ? "text-[#9A9390]" : "text-[#6B7280]"} text-center leading-[23px] mb-[30px] w-full`}>
          Something went wrong on our end. The issue has been logged and we're looking into it.
        </p>

        <div className="flex flex-col w-full gap-[10px] mb-6">
          <PrimaryButton
            onClick={() => window.location.reload()}
            className="w-full h-12 flex items-center justify-center"
          >
            <RefreshCw className="w-4 h-4 mr-2 animate-hover-spin" strokeWidth={isDark ? 1.33 : 2.66} />
            Try Again
          </PrimaryButton>

          <SecondaryButton
            onClick={() => navigate("/home")}
            className="w-full h-12 flex items-center justify-center"
          >
            <Home className="w-4 h-4 mr-2" strokeWidth={isDark ? 1.33 : 2.66} />
            Back to Home
          </SecondaryButton>
        </div>
      </motion.div>
    </div>
  );
} 


