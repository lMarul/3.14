import { useNavigate } from "react-router-dom";
import { useCustomTheme } from "../providers/ThemeContext";

export function SiteFooter() {
  const navigate = useNavigate();
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
          {/* About — anchor column, wider measure */}
          <div className="col-span-2 md:col-span-6 lg:col-span-5">
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

          {/* Resources */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <h3 className={colHeadingClass}>Resources</h3>
            <ul className="space-y-[13px]">
              <li>
                <span className={staticLinkClass}>Help Center</span>
              </li>
              <li>
                <button onClick={() => navigate("/conf")} className={linkClass}>
                  Terms of Use
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/conf")} className={linkClass}>
                  About the Archive
                </button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <h3 className={colHeadingClass}>Legal</h3>
            <ul className="space-y-[13px]">
              <li>
                <span className={staticLinkClass}>Notices</span>
              </li>
              <li>
                <span className={staticLinkClass}>Privacy Policy</span>
              </li>
              <li>
                <span className={staticLinkClass}>Copyright</span>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <h3 className={colHeadingClass}>Connect</h3>
            <ul className="space-y-[13px]">
              <li>
                <a
                  href="https://www.facebook.com/profile.php?id=61587556703784"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={staticLinkClass}
                >
                  Facebook
                </a>
              </li>
              <li>
                <span className={staticLinkClass}>Instagram</span>
              </li>
              <li>
                <span className={staticLinkClass}>APC Official Site</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider — slightly stronger presence */}
        <div
          className={`border-t-[1.06667px] ${
            isDark ? "border-gray-700" : "border-[#D1D5DC]"
          }`}
        />

        {/* Lower Footer Row */}
        <div className="pt-8 sm:pt-[36px] pb-10 sm:pb-[44px] flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">

          {/* Left: Logos + Copyright */}
          <div className="w-full md:w-auto flex flex-col md:flex-row items-center justify-center md:items-center gap-[13px]">
            <div className="flex flex-row items-center justify-center md:justify-start gap-[9px]">
              <img
                src="/03_Seal-of-APC%201.png"
                alt="Asia Pacific College"
                className="w-[113px] h-[88px] object-contain"
              />
              <img
                src={isDark ? "/SOMALogoDimMode.png" : "/SOMALogoLightMode.png"}
                alt="SoMA"
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

          {/* Right: Utility links  slightly inward, deliberate spacing */}
          <div className="w-full md:w-auto flex flex-wrap items-center justify-center md:justify-end gap-[14px]">
            <button
              onClick={() => navigate("/conf")}
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
              onClick={() => navigate("/conf")}
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
              onClick={() => navigate("/conf")}
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
              onClick={() => navigate("/conf")}
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
        </div>

      </div>
    </footer>
  );
}


