import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { getVideoById } from "../data/videos";
import { useCustomTheme } from "../components/providers/ThemeContext";
import { Navbar } from "../components/layout/Navbar";
import { BackButton } from "../components/navigation/BackButton";
import { PageContainer } from "../components/layout/PageContainer";
import { SiteFooter } from "../components/layout/SiteFooter";

export default function ProjectInfo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme, resolvedTheme } = useCustomTheme();
  const [mounted, setMounted] = useState(false);
  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const isDim = currentTheme === 'dim';
  const isLightsOut = currentTheme === 'lights-out';
  const isDark = isDim || isLightsOut;
  const primaryRed = isDark ? "#ff4b4b" : "#8a181a";

  const [video, setVideo] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    if (id) {
      const v = getVideoById(id);
      if (v) {
        setVideo(v);
      } else {
        navigate("/home");
      }
    }
  }, [id, navigate]);

  if (!mounted || !video) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${isLightsOut ? "bg-[#000000] text-white" : isDim ? "bg-[#15202B] text-white" : "bg-[#f5f5f5] text-gray-900"}`}
      >
        <div className="animate-pulse font-['Poppins'] font-bold text-xl">
          Loading Project Info...
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${isLightsOut ? "bg-[#000000] text-white" : isDim ? "bg-[#15202B] text-white" : "bg-[#f5f5f5] text-gray-900"}`}
    >
      <Navbar />

      <main className="py-12">
        <PageContainer>
          <div className="mb-8">
            <BackButton />
          </div>

          {/* Hero Section */}
          <div className="mb-16">
            <div className="mb-8 px-4 sm:px-0">
              <p className="text-[10px] font-['Inter'] font-[700] uppercase tracking-[1px] text-[#6A7282] mb-4">
                Project Information
              </p>
              <h1 className="font-['Poppins'] font-extrabold text-3xl md:text-5xl mb-6 tracking-tight break-words">
                {video.title}
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div
                  className="w-[52px] h-[52px] rounded-full flex items-center justify-center text-white font-['Inter'] font-bold flex-shrink-0 min-w-[52px] min-h-[52px]"
                  style={{ backgroundColor: isDark ? "#ff4b4b" : "#8a181a" }}
                >
                  {(video.author || "K").charAt(0)}
                </div>
                <div>
                  <p
                    className={`font-['Poppins'] font-bold text-lg ${isDark ? "text-gray-200" : "text-[#101828]"}`}
                  >
                    {video.author || "Kwentong Barbero"}
                  </p>
                  <p className="font-['Poppins'] font-[500] text-sm text-[#6A7282]">
                    {video.role || "Director / Artist"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="flex flex-col lg:flex-row gap-8 mb-16">
            {/* Main Content (Left) */}
            <div className="flex-1 space-y-8">
              {/* Logline Section */}
              <div className={`p-8 rounded-[14px] border border-[#E5E7EB] shadow-sm ${isLightsOut ? "bg-[#000000]" : isDim ? "bg-[#253341]" : "bg-white"}`}>
                <h2 className="font-['Poppins'] font-[700] text-[20px] text-[#101828] mb-4">
                  Logline
                </h2>
                <p className="font-['Poppins'] font-[500] text-[15px] leading-[24px] text-[#364153]">
                  {video.logline || "A suspenseful short following a quiet moment that turns into a fight for survival as a young woman discovers she is being watched."}
                </p>
              </div>

              {/* Theoretical Framework Section */}
              <div className={`p-8 rounded-[14px] border border-[#E5E7EB] shadow-sm ${isLightsOut ? "bg-[#000000]" : isDim ? "bg-[#253341]" : "bg-white"}`}>
                <h2 className="font-['Poppins'] font-[700] text-[20px] text-[#101828] mb-4">
                  Theoretical Framework
                </h2>
                <div className="flex flex-wrap gap-2">
                  {(video.theory || "Folkloric Analysis").split(",").map((theory: string, index: number) => (
                    <div
                      key={index}
                      className="px-4 py-1.5 rounded-full bg-[#F3F4F6] border border-[#E5E7EB]"
                    >
                      <span className="font-['Poppins'] font-[600] text-[13px] text-[#364153]">
                        {theory.trim()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Synopsis Section */}
              <div className={`p-8 rounded-[14px] border border-[#E5E7EB] shadow-sm ${isLightsOut ? "bg-[#000000]" : isDim ? "bg-[#253341]" : "bg-white"}`}>
                <h2 className="font-['Poppins'] font-[700] text-[20px] text-[#101828] mb-4">
                  Synopsis
                </h2>
                <p className="font-['Poppins'] font-[500] text-[15px] leading-[26px] text-[#364153]">
                  {video.synopsis || "Detailed synopsis and creative statement from the artist will be displayed here. This section will provide deeper insight into the creative process, thematic exploration, and artistic intent behind this work."}
                </p>
              </div>

              {/* Process Notes */}
              <div className={`p-8 rounded-[14px] border border-[#E5E7EB] shadow-sm ${isLightsOut ? "bg-[#000000]" : isDim ? "bg-[#253341]" : "bg-white"}`}>
                <h2 className="font-['Poppins'] font-[700] text-[20px] text-[#101828] mb-4">
                  Process Notes
                </h2>
                <div className="space-y-4">
                  <div className="p-4 rounded-[10px] bg-[#F9FAFB] border border-[#F3F4F6]">
                    <p className="font-['Poppins'] font-[500] text-[14px] text-[#4A5565]">
                      • Pre-production: Scripting and storyboard development focused on visual storytelling without dialogue.
                    </p>
                  </div>
                  <div className="p-4 rounded-[10px] bg-[#F9FAFB] border border-[#F3F4F6]">
                    <p className="font-['Poppins'] font-[500] text-[14px] text-[#4A5565]">
                      • Production: Challenges included low-light cinematography and sound design to build tension.
                    </p>
                  </div>
                  <div className="p-4 rounded-[10px] bg-[#F9FAFB] border border-[#F3F4F6]">
                    <p className="font-['Poppins'] font-[500] text-[14px] text-[#4A5565]">
                      • Post-production: Color grading to enhance the suspenseful atmosphere.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar (Right) */}
            <div className="w-full lg:w-[320px]">
              <div className={`p-8 rounded-[14px] border border-[#E5E7EB] shadow-sm ${isLightsOut ? "bg-[#000000]" : isDim ? "bg-[#253341]" : "bg-white"}`}>
                <h3 className="font-['Poppins'] font-[700] text-[18px] text-[#101828] mb-8">
                  Metadata
                </h3>
                <div className="space-y-8">
                  <div>
                    <p className="text-[10px] font-['Inter'] font-[700] uppercase tracking-[1px] text-[#6A7282] mb-2">
                      Year
                    </p>
                    <p className="font-['Poppins'] font-[700] text-[16px] text-[#101828]">
                      {new Date(video.releaseDate || Date.now()).getFullYear() || "2014"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-['Inter'] font-[700] uppercase tracking-[1px] text-[#6A7282] mb-2">
                      Genre
                    </p>
                    <p className="font-['Poppins'] font-[700] text-[16px] text-[#101828]">
                      {video.genre || "Horror, Suspense"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-['Inter'] font-[700] uppercase tracking-[1px] text-[#6A7282] mb-2">
                      Duration
                    </p>
                    <p className="font-['Poppins'] font-[700] text-[16px] text-[#101828]">
                      {video.duration || "2:27"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-['Inter'] font-[700] uppercase tracking-[1px] text-[#6A7282] mb-2">
                      Views
                    </p>
                    <p className="font-['Poppins'] font-[700] text-[16px] text-[#101828]">
                      {(video.views || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="pt-6 border-t border-[#E5E7EB]">
                    <div className="flex items-center gap-[6px] px-3 py-1.5 bg-[#F0FDF4] border border-[#B9F8CF] rounded-full w-fit">
                      <svg className="w-[14px] h-[14px] text-[#00A63E]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-['Poppins'] text-[11px] font-[700] text-[#008236]">
                        Validated by Faculty
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Soma Verge Link */}
              <div className="mt-8">
                <a
                  href="https://somaverge.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between p-6 bg-[#101828] rounded-[14px] hover:bg-[#1C2533] transition-all"
                >
                  <div className="space-y-1">
                    <p className="font-['Poppins'] font-[700] text-[14px] text-white">
                      Explore More Works
                    </p>
                    <p className="font-['Poppins'] font-[500] text-[12px] text-white/60">
                      Visit Soma Verge
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-transform group-hover:translate-x-1">
                    <ExternalLink className="w-4 h-4 text-white" />
                  </div>
                </a>
              </div>
            </div>
          </div>
        </PageContainer>
      </main>

      <SiteFooter />
    </div>
  );
}
