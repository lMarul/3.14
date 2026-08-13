import { useState, useEffect } from "react";
import { VideoCard } from "../components/media/VideoCard";
import { usePublishedMedia } from "../hooks/useLikhaniData";
import { useCustomTheme } from "../components/providers/ThemeContext";
import { Navbar } from "../components/layout/Navbar";
import { PageContainer } from "../components/layout/PageContainer";
import { SiteFooter } from "../components/layout/SiteFooter";
import svgPaths from "../../generated/svg-cq2lewbljb";
import { motion } from "motion/react";

export default function RecentlyUploaded() {
  const { theme, resolvedTheme } = useCustomTheme();
  const [mounted, setMounted] = useState(false);
  const currentTheme = theme === 'system' ? resolvedTheme : theme;
  const isDim = currentTheme === 'dim';
  const isLightsOut = currentTheme === 'lights-out';
  const isDark = isDim || isLightsOut;

  const { media: publishedMedia, loading, error } = usePublishedMedia();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isLightsOut ? "bg-[#000000] text-white" : isDim ? "bg-[#15202B] text-white" : "bg-[#f5f5f5] text-gray-900"}`}>
        <div className="animate-pulse font-['Poppins'] font-bold text-xl">
          Loading Likhani...
        </div>
      </div>
    );
  }

  // Use real data or fallback to empty state
  const recentVideos = publishedMedia.length > 0
    ? publishedMedia
        .filter((m) => !!m.videoUrl)
        .map((m) => ({ ...m, uploadDate: new Date(m.releaseDate || Date.now()).toLocaleDateString() }))
    : [];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isLightsOut ? 'bg-[#000000] text-white' : isDim ? 'bg-[#15202B] text-white' : 'bg-[#f5f5f5] text-gray-900'}`}>
      <Navbar />

      {/* Page Header */}
      <motion.section
        className="relative py-8 sm:py-12 md:py-16 border-b border-black/10 overflow-hidden px-4 sm:px-5 md:px-6 lg:px-8"
        initial={{ opacity: 0, y: 14, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ background: isLightsOut ? '#0D0F14' : isDim ? '#131622' : '#8A181A' }}
      >
          <style>
            {`
              @keyframes gentleFloat1 {
                0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
                50% { transform: translate(8px, -12px) rotate(3deg) scale(1.02); }
              }
              @keyframes gentleFloat2 {
                0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
                50% { transform: translate(-6px, 10px) rotate(-4deg) scale(0.98); }
              }
              @keyframes gentleFloat3 {
                0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
                50% { transform: translate(10px, 8px) rotate(2deg) scale(1.03); }
              }
              @keyframes gentleFloat4 {
                0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
                50% { transform: translate(-8px, -10px) rotate(-3deg) scale(0.97); }
              }
              @keyframes gentleFloat5 {
                0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
                50% { transform: translate(7px, 12px) rotate(4deg) scale(1.01); }
              }
              @keyframes gentleFloat6 {
                0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
                50% { transform: translate(-10px, 6px) rotate(-2deg) scale(0.99); }
              }
            `}
          </style>
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1400 300" preserveAspectRatio="xMidYMid slice" style={{ pointerEvents: 'none', background: isLightsOut ? '#0D0F14' : isDim ? '#131622' : '#8A181A' }}>
          <g opacity={isDark ? 0.12 : 0.28} transform="translate(0, 75)" fill={isDark ? '#1E2D3F' : '#CD5D5D'} stroke={isDark ? '#1E2D3F' : '#CD5D5D'}>
            <rect height="69.7586" strokeLinejoin="round" strokeWidth="6" transform="rotate(30 30.7812 8.90192)" width="69.7586" x="30.7812" y="8.90192" style={{ animation: 'gentleFloat1 22s ease-in-out infinite' }} />
            <circle cx="76.9999" cy="238" r="62" strokeLinejoin="round" strokeWidth="6" style={{ animation: 'gentleFloat2 18s ease-in-out infinite' }} />
            <circle cx="1040" cy="72" r="62" strokeLinejoin="round" strokeWidth="6" style={{ animation: 'gentleFloat3 20s ease-in-out infinite' }} />
            <path d={svgPaths.p4f09b00} strokeLinejoin="round" strokeWidth="6" style={{ animation: 'gentleFloat4 24s ease-in-out infinite' }} />
            <rect height="123" strokeLinejoin="round" strokeWidth="5" transform="rotate(31.9574 279.658 134.556)" width="123" x="279.658" y="134.556" fill="none" style={{ animation: 'gentleFloat5 19s ease-in-out infinite' }} />
            <circle cx="448" cy="95" r="61.5" strokeLinejoin="round" strokeWidth="5" fill="none" style={{ animation: 'gentleFloat6 21s ease-in-out infinite' }} />
            <path d={svgPaths.p1dcfb980} strokeLinejoin="round" strokeWidth="6" fill="none" style={{ animation: 'gentleFloat1 25s ease-in-out infinite' }} />
            <path d={svgPaths.p1c6b1700} strokeLinejoin="round" strokeWidth="6" style={{ animation: 'gentleFloat2 23s ease-in-out infinite' }} />
            <path d={svgPaths.p3d6a600} strokeLinejoin="round" strokeWidth="6" style={{ animation: 'gentleFloat3 26s ease-in-out infinite' }} />
            <path d={svgPaths.p347edc80} strokeLinejoin="round" strokeWidth="6" fill="none" style={{ animation: 'gentleFloat4 20s ease-in-out infinite' }} />
            <path d={svgPaths.peeaf800} strokeLinejoin="round" strokeWidth="5" fill="none" style={{ animation: 'gentleFloat5 22s ease-in-out infinite' }} />
            <path d={svgPaths.pd790400} strokeLinecap="round" strokeWidth="10" fill="none" style={{ animation: 'gentleFloat6 24s ease-in-out infinite' }} />
            <path d={svgPaths.pb073900} strokeLinecap="round" strokeWidth="10" fill="none" style={{ animation: 'gentleFloat1 27s ease-in-out infinite' }} />
          </g>
        </svg>
        <PageContainer className="relative z-10">
          <h1 className="font-['Poppins'] font-extrabold text-[28px] sm:text-[36px] md:text-[48px] mb-2 sm:mb-4 text-[#F5F5F5]">
            Recently Archived
          </h1>
          <p className="font-['Poppins'] text-[15px] sm:text-[16px] md:text-[18px] text-[#F5F5F5]">
            Discover the latest additions to the Likhani archive.
          </p>
        </PageContainer>
      </motion.section>

      {/* Recent Videos Grid */}
      <motion.section
        className="py-8 sm:py-12 md:py-16 px-4 sm:px-5 md:px-6 lg:px-8"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.22 }}
      >
        <div className="w-full max-w-[1200px] mx-auto">
          {error ? (
            <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-['Poppins'] text-red-200">
              {error}
            </div>
          ) : null}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 gap-y-6 md:gap-y-8">
            {recentVideos.map((video, index) => (
              <motion.div
                key={video.id}
                className="space-y-3"
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.35,
                  ease: "easeOut",
                  delay: 0.28 + Math.min(index, 11) * 0.04,
                }}
              >
                <VideoCard
                  id={video.id}
                  title={video.title}
                  author={video.creator}
                  thumbnail={video.posterUrl || "https://images.unsplash.com/photo-1648459678251-d68308fed935?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=85"}
                  duration={video.duration ? `${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}` : "0:00"}
                  videoUrl={video.videoUrl}
                  stills={video.stills}
                />
                <p className={`text-xs font-['Poppins'] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  Archived {video.uploadDate}
                </p>
              </motion.div>
            ))}
            {recentVideos.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-500 font-['Poppins']">
                No videos have been archived yet.
              </div>
            )}
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
