import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { VideoCard } from "../components/media/VideoCard";
import { getAllVideos } from "../data/videos";
import { useCustomTheme } from "../components/providers/ThemeContext";
import { Navbar } from "../components/layout/Navbar";
import { BackButton } from "../components/navigation/BackButton";
import { SiteFooter } from "../components/layout/SiteFooter";
import { PageContainer } from "../components/layout/PageContainer";
import { PrimaryButton } from "../components/common/StandardButtons";

export default function LikedFilms() {
  const navigate = useNavigate();
  const { theme, resolvedTheme } = useCustomTheme();
  const [mounted, setMounted] = useState(false);
  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const isDim = currentTheme === 'dim';
  const isLightsOut = currentTheme === 'lights-out';
  const isDark = isDim || isLightsOut;

  useEffect(() => {
    setMounted(true);
    const guestMode = localStorage.getItem("isGuest") === "true";
    if (guestMode) navigate("/");
  }, [navigate]);

  if (!mounted) return null;

  const allVideos = getAllVideos();
  const likedVideos = allVideos.slice(0, 6);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isLightsOut ? "bg-[#000000] text-white" : isDim ? "bg-[#15202B] text-white" : "bg-[#f5f5f5] text-gray-900"}`}>
      <Navbar />

      <main>
        <PageContainer className="py-8">
          <div className="mb-8">
            <BackButton className="mb-8" />
            <div className="flex items-center gap-3">
               <h1 className="font-['Poppins'] font-extrabold text-[32px]">Liked Films</h1>
               <span className={`px-3 py-1 rounded-full text-xs font-bold ${isDark ? "bg-white/10 text-white" : "bg-gray-200 text-gray-800"}`}>
                 {likedVideos.length}
               </span>
            </div>
            <p className={`font-['Poppins'] text-sm mt-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Your collection of favorites from the archive.
            </p>
          </div>

          {likedVideos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {likedVideos.map((video, index) => (
                <VideoCard
                  key={video.id}
                  id={video.id}
                  title={video.title}
                  author={video.author}
                  thumbnail={video.thumbnail}
                  duration={video.duration}
                  videoUrl={video.videoUrl}
                  stills={(video as any).stills}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
               <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
                 <Heart className="w-10 h-10 text-gray-400" />
               </div>
               <h3 className="font-['Poppins'] font-bold text-2xl mb-2">No liked films yet</h3>
               <p className="font-['Poppins'] text-gray-500 max-w-md mb-8">
                 Start exploring the archive and like films to save them here.
               </p>
               <PrimaryButton
                  onClick={() => navigate("/home")}
                  className="font-bold text-sm px-8 py-3 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#8a181a]/20"
                >
                  Explore Archive
                </PrimaryButton>
            </div>
          )}
        </PageContainer>
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
