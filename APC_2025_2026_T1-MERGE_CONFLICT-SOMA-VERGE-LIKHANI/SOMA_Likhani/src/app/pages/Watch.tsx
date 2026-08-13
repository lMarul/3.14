import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";
import { usePublishedMedia } from "../hooks/useLikhaniData";
import { VideoPlayer } from "../components/media/VideoPlayer";
import { useCustomTheme } from "../components/providers/ThemeContext";
import { useScreenshotProtection } from "../hooks/useScreenshotProtection";

export default function Watch() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme, resolvedTheme } = useCustomTheme();
  const [mounted, setMounted] = useState(false);
  const { media: publishedMedia, loading } = usePublishedMedia();
  const [video, setVideo] = useState<any>(null);
  const isDarkened = useScreenshotProtection();

  const isDark = (theme === 'system' ? resolvedTheme : theme) === 'dark';

  useEffect(() => {
    setMounted(true);
    if (!id || loading) return;

    const v = publishedMedia.find((m) => m.id === id);
    if (v) {
      // Map database item to UI model
      const mappedVideo = {
        ...v,
        thumbnail: v.posterUrl,
        author: v.creator,
      };
      setVideo(mappedVideo);
    } else if (!loading && publishedMedia.length >= 0) {
      // List is empty or video not found
      navigate("/home");
    }
  }, [id, navigate, publishedMedia, loading]);

  if (!mounted || loading || !video) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-pulse text-white font-['Poppins'] font-bold text-xl">
          Loading Archive...
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-[200] flex flex-col overflow-hidden">
      {/* Top Header/Controls - Hidden until hover if needed, but here always for navigation */}
      <div className="absolute top-0 left-0 right-0 px-4 py-4 md:p-6 flex flex-col md:flex-row items-center justify-between z-[210] bg-gradient-to-b from-black/80 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 gap-2 md:gap-0">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group self-start md:self-auto min-h-[44px]"
        >
          <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          <span className="font-['Poppins'] font-bold">Back to Details</span>
        </button>
        
        <div className="flex flex-col items-center max-w-[80vw] md:max-w-md w-full">
          <h1 className="text-white font-['Poppins'] font-bold text-base md:text-lg text-center truncate w-full px-1">{video.title}</h1>
          <p className="text-white/50 text-xs font-['Poppins']">{video.author}</p>
        </div>

        <button 
          onClick={() => navigate("/home")}
          className="p-2 text-white/70 hover:text-white transition-colors self-end md:self-auto min-h-[44px] min-w-[44px] flex justify-center items-center absolute top-4 right-4 md:static"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className={`flex-1 w-full h-[100svh] relative flex items-center justify-center transition-opacity duration-100`}>
        <VideoPlayer
          url={video.videoUrl}
          poster={video.thumbnail}
          title={video.title}
          mimeType={video.videoMimeType}
          autoPlay={true}
          isDarkened={isDarkened}
        />
      </div>
    </div>
  );
}
