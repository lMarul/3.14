import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import Logo from "../layout/Logo";
import { Button } from "../ui/button";
import { useCustomTheme } from "../providers/ThemeContext";

type SystemAction = {
  label: string;
  onClick: () => void;
  variant?: "default" | "outline" | "ghost" | "secondary" | "destructive" | "link";
  icon?: LucideIcon;
};

type SystemStatePageProps = {
  icon: LucideIcon;
  iconClassName?: string;
  iconWrapperClassName?: string;
  title: string;
  description: string;
  actions: SystemAction[];
  panel?: React.ReactNode;
};

export function SystemStatePage({
  icon: Icon,
  iconClassName,
  iconWrapperClassName,
  title,
  description,
  actions,
  panel,
}: SystemStatePageProps) {
  const { theme, resolvedTheme } = useCustomTheme();
  const currentTheme = resolvedTheme || theme;
  const isDim = currentTheme === 'dim';
  const isLightsOut = currentTheme === 'lights-out';
  const isDark = isDim || isLightsOut;

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 relative overflow-hidden font-['Poppins'] ${isLightsOut ? 'bg-[#000000] text-white' : isDim ? 'bg-[#15202B] text-white' : 'bg-[#f7f6f3] text-gray-900'}`}>
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
        }}
      />

      <div className="max-w-md w-full text-center relative z-10">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex justify-center"
        >
          <Logo height={80} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div
            className={
              iconWrapperClassName ||
              "w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6"
            }
          >
            <Icon className={iconClassName || "w-10 h-10 text-gray-400"} />
          </div>

          <h2 className={`font-bold text-2xl mb-2 ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}>{title}</h2>
          <p className={`text-[14px] leading-relaxed mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{description}</p>

          {panel ? <div className="mb-8">{panel}</div> : null}

          <div className="space-y-3">
            {actions.map(({ label, onClick, variant = "default", icon: ActionIcon }) => (
              <Button
                key={label}
                variant={variant}
                onClick={onClick}
                className={variant === "outline" ? "w-full border-gray-300 text-gray-600 hover:text-[#8a181a] hover:border-[#8a181a]/30" : "w-full"}
              >
                {ActionIcon ? <ActionIcon className="w-4 h-4 mr-2" /> : null}
                {label}
              </Button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
