import { useNavigate } from "react-router-dom";
import { useCustomTheme } from "../providers/ThemeContext";
import { useTrapTransition, TrapElement } from "../../context/TrapTransitionContext";

export function SiteFooter() {
  const navigate = useNavigate();
  const { triggerTrap } = useTrapTransition();
  const { theme, resolvedTheme } = useCustomTheme();
  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const isDim = currentTheme === 'dim';
  const isLightsOut = currentTheme === 'lights-out';
  const isDark = isDim || isLightsOut;
  const primaryRed = isDark ? "#ff4b4b" : "#8a181a";

  const linkClass = `font-['Poppins'] font-medium text-[13.5px] leading-[20px] transition-colors text-left ${
    isDark ? "text-[#6A7282] hover:text-[#ff4b4b]" : "text-[#6A7282] hover:text-[#8a181a]"
  }`;

  const staticLinkClass = `font-['Poppins'] font-normal text-[13.5px] leading-[20px] cursor-default ${
    isDark ? "text-[#6A7282]" : "text-[#6A7282]"
  }`;

  const colHeadingClass = `font-['Poppins'] font-bold text-[11.5px] leading-[17px] uppercase tracking-[1.61px] mb-[20px] ${
    isDark ? "text-gray-300" : "text-[#1E2939]"
  }`;

  return (
    <footer
      className={`border-t transition-colors ${isLightsOut ? "bg-[#000000] border-gray-900" : isDim ? "bg-[#0F1923] border-[#38444D]" : "bg-white border-[#E5E7EB]"}`}
    >
      <div className="w-full max-w-[min(1200px,calc(100vw-48px))] mx-auto px-4 sm:px-5 md:px-6 lg:px-8 pt-8 sm:pt-12 md:pt-[72px]">
        {/* Upper Footer — side-by-side on mobile, 12-col on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-12 pb-12 md:pb-[60px] gap-6 md:gap-8 lg:gap-[60px]">
          {/* About — anchor column */}
          <TrapElement delay={1.75} rotate={-10} xDrift={-50} className="col-span-2 md:col-span-6 lg:col-span-5">
            <div>
              <h3 className={colHeadingClass}>About</h3>
              <p
                className={`font-['Poppins'] font-normal text-[14px] leading-[24px] max-w-[311px] ${
                  isDark ? "text-gray-400" : "text-[#4A5565]"
                }`}
              >
                Likhani is the official digital archive of Asia Pacific College —
                School of Multimedia Arts, preserving faculty-endorsed student
                works across film, animation, documentary, and experimental media.
              </p>
            </div>
          </TrapElement>

          {/* Resources */}
          <TrapElement delay={1.85} rotate={14} xDrift={40} className="col-span-1 md:col-span-2 lg:col-span-3">
            <div>
              <h3 className={colHeadingClass}>Resources</h3>
              <ul className="space-y-[13px]">
                <li>
                  <button onClick={() => triggerTrap("/conf")} className={linkClass}>
                    Help Center
                  </button>
                </li>
                <li>
                  <button onClick={() => triggerTrap("/conf")} className={linkClass}>
                    Terms of Use
                  </button>
                </li>
                <li>
                  <button onClick={() => triggerTrap("/conf")} className={linkClass}>
                    About the Archive
                  </button>
                </li>
              </ul>
            </div>
          </TrapElement>

          {/* Legal */}
          <TrapElement delay={1.95} rotate={-15} xDrift={-60} className="col-span-1 md:col-span-2 lg:col-span-2">
            <div>
              <h3 className={colHeadingClass}>Legal</h3>
              <ul className="space-y-[13px]">
                <li>
                  <button onClick={() => triggerTrap("/conf")} className={linkClass}>
                    Notices
                  </button>
                </li>
                <li>
                  <button onClick={() => triggerTrap("/conf")} className={linkClass}>
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => triggerTrap("/conf")} className={linkClass}>
                    Copyright
                  </button>
                </li>
              </ul>
            </div>
          </TrapElement>

          {/* Connect */}
          <TrapElement delay={2.0} rotate={10} xDrift={50} className="col-span-1 md:col-span-2 lg:col-span-2">
            <div>
              <h3 className={colHeadingClass}>Connect</h3>
              <ul className="space-y-[13px]">
                <li>
                  <button onClick={() => triggerTrap("/conf")} className={linkClass}>
                    Facebook
                  </button>
                </li>
                <li>
                  <button onClick={() => triggerTrap("/conf")} className={linkClass}>
                    Instagram
                  </button>
                </li>
                <li>
                  <button onClick={() => triggerTrap("/conf")} className={linkClass}>
                    APC Official Site
                  </button>
                </li>
              </ul>
            </div>
          </TrapElement>
        </div>

        {/* Divider — slightly stronger presence */}
        <div
          className={`border-t-[1.06667px] ${
            isDark ? "border-gray-700" : "border-[#D1D5DC]"
          }`}
        />

        {/* Lower Footer Row */}
        <div className="pt-8 sm:pt-[36px] pb-10 sm:pb-[44px] flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">

          {/* Left: Brand identity + Copyright statement */}
          <TrapElement delay={2.05} rotate={12} xDrift={45}>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-5 text-center md:text-left">
              {/* APC SOMA lockup mark */}
              <div className="flex-shrink-0 cursor-pointer" onClick={() => triggerTrap("/conf")}>
                <img
                  src="https://res.cloudinary.com/dv0rckb29/image/upload/v1770619179/Group_626_fvxz3m.png"
                  alt="APC SOMA"
                  className="w-[107px] h-[37px] object-contain"
                />
              </div>
              {/* Copyright block — two-line, hierarchical */}
              <div className="font-['Poppins'] flex flex-col text-center md:text-left pt-1">
                <p
                  className={`text-[12px] font-medium leading-[20px] ${
                    isDark ? "text-gray-300" : "text-[#6A7282]"
                  }`}
                >
                  © 2026 Asia Pacific College — School of Multimedia Arts. All rights reserved.
                </p>
                <p
                  className={`text-[11.5px] font-normal leading-[19px] ${
                    isDark ? "text-gray-500" : "text-[#99A1AF]"
                  }`}
                >
                  Team Likhani &middot; Team Merge Conflict
                </p>
              </div>
            </div>
          </TrapElement>

          {/* Right: Utility links */}
          <TrapElement delay={2.15} rotate={-18} xDrift={-70}>
            <div className="w-full md:w-auto flex flex-wrap items-center justify-center md:justify-end gap-[14px]">
              <button
                onClick={() => triggerTrap("/conf")}
                className={`font-['Poppins'] font-medium text-[11.5px] leading-[18px] transition-colors ${
                  isDark
                    ? "text-gray-500 hover:text-gray-300"
                    : "text-[#99A1AF] hover:text-gray-600"
                }`}
                title="Demo: 404 Page"
              >
                v1.0.0
              </button>
              <span className={`font-['Inter'] text-[11px] leading-[16px] ${isDark ? "text-gray-700" : "text-[#D1D5DC]"}`}>·</span>
              <button
                onClick={() => triggerTrap("/conf")}
                className={`font-['Poppins'] font-medium text-[11.5px] leading-[18px] transition-colors ${
                  isDark
                    ? "text-gray-500 hover:text-gray-300"
                    : "text-[#99A1AF] hover:text-gray-600"
                }`}
                title="Demo: Network Error"
              >
                Network
              </button>
              <span className={`font-['Inter'] text-[11px] leading-[16px] ${isDark ? "text-gray-700" : "text-[#D1D5DC]"}`}>·</span>
              <button
                onClick={() => triggerTrap("/conf")}
                className={`font-['Poppins'] font-medium text-[11.5px] leading-[18px] transition-colors ${
                  isDark
                    ? "text-gray-500 hover:text-gray-300"
                    : "text-[#99A1AF] hover:text-gray-600"
                }`}
                title="Demo: Maintenance"
              >
                Status
              </button>
              <span className={`font-['Inter'] text-[11px] leading-[16px] ${isDark ? "text-gray-700" : "text-[#D1D5DC]"}`}>·</span>
              <button
                onClick={() => triggerTrap("/conf")}
                className={`font-['Poppins'] font-medium text-[11.5px] leading-[18px] transition-colors ${
                  isDark
                    ? "text-gray-500 hover:text-gray-300"
                    : "text-[#99A1AF] hover:text-gray-600"
                }`}
                title="Demo: Error Page"
              >
                Support
              </button>
            </div>
          </TrapElement>
        </div>

      </div>
    </footer>
  );
}


