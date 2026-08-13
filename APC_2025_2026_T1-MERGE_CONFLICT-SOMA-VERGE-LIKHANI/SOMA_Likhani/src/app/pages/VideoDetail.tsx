import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ThumbsUp,
  Eye,
  Share2,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Bookmark,
} from "lucide-react";
import { toast } from "sonner";
import { usePublishedMedia, useMediaLikes, useWatchLater, incrementViewCount } from "../hooks/useLikhaniData";
import { supabase } from "../lib/supabase";
import { useCustomTheme } from "../components/providers/ThemeContext";
import { VideoPlayer } from "../components/media/VideoPlayer";
import { CategoryCarousel } from "../components/media/CategoryCarousel";
import { BackButton } from "../components/navigation/BackButton";
import { Navbar } from "../components/layout/Navbar";
import { PageContainer } from "../components/layout/PageContainer";
import { useScreenshotProtection } from "../hooks/useScreenshotProtection";
import { motion } from "motion/react";

function getYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function isYouTubeUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return (
    url.includes("youtube.com") || url.includes("youtu.be")
  );
}

function isGoogleDriveUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.includes("drive.google.com");
}

function isCloudinaryUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.includes("res.cloudinary.com");
}

function getGoogleDriveFileId(url: string): string | null {
  const patterns = [/\/file\/d\/([^/]+)/, /id=([^&]+)/];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function VideoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme, resolvedTheme } = useCustomTheme();
  const [mounted, setMounted] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [showAgeRestrictionModal, setShowAgeRestrictionModal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isDarkened = useScreenshotProtection();

  // Video progress tracking
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const progressIntervalRef = useRef<any>(null);

  const currentTheme =
    theme === "system" ? resolvedTheme : theme;
  const isDim = currentTheme === 'dim';
  const isLightsOut = currentTheme === 'lights-out';
  const isDark = isDim || isLightsOut;
  const primaryRed = isDark ? "#ff4b4b" : "#8a181a";

  // Video details
  const { media: publishedMedia, loading } = usePublishedMedia();
  const [video, setVideo] = useState<any>(null);
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [likeCount, setLikeCount] = useState(0);
  
  const { isLiked, toggleLike } = useMediaLikes(id, userId);
  const { watchLaterList, toggleWatchLater } = useWatchLater(userId);
  const isBookmarked = watchLaterList.some(item => item.media_id === id);
  const hasIncrementedView = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    
    // Get current user session
    if (supabase) {
      supabase.auth.getUser().then(({ data }) => {
        if (data.user) {
          setUserId(data.user.id);
        }
      });
    }

    if (!id || loading) return;

    const foundV = publishedMedia.find((m) => m.id === id);
    if (foundV) {
      // Map database item to UI model
      const mappedVideo = {
        ...foundV,
        thumbnail: foundV.posterUrl,
        author: foundV.creator,
        director: foundV.creator,
        likes: foundV.likeCount || 0,
        views: foundV.viewCount || 0,
        cast: [],
        theory: null,
        role: "Creator"
      };
      
      setVideo(mappedVideo);
      setLikeCount(mappedVideo.likes);
      
      // Check if video is age-restricted (R or 18+) and user is guest
      const guestMode = localStorage.getItem("isGuest") === "true";
      if ((mappedVideo.ageRating === "R" || mappedVideo.ageRating === "18+") && guestMode) {
        setShowAgeRestrictionModal(true);
      }
      
      // Load saved progress for signed-in users
      if (!guestMode) {
        const savedProgress = localStorage.getItem(`video_progress_${id}`);
        if (savedProgress) {
          try {
            const progress = JSON.parse(savedProgress);
            setCurrentTime(progress.currentTime || 0);
          } catch (e) {
            console.error("Failed to parse progress", e);
          }
        }
      }
      
      // Scroll to top when video changes
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (publishedMedia.length > 0) {
      // Data is loaded but ID not found - handle 404 or redirect
      navigate("/home");
    } else if (!loading && publishedMedia.length === 0) {
       // Data is loaded, list is empty, and we didn't find our ID
       navigate("/home");
    }
  }, [id, navigate, publishedMedia, loading]);

  useEffect(() => {
    const guestMode =
      localStorage.getItem("isGuest") === "true";
    setIsGuest(guestMode);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          setIsFullscreen(false);
        }
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullscreen]);

  const handleLike = async () => {
    if (isGuest) {
      handleGuestRestriction();
      return;
    }
    
    // Optimistic UI update for like count
    if (isLiked) {
      setLikeCount((prev) => Math.max(0, prev - 1));
    } else {
      setLikeCount((prev) => prev + 1);
    }
    
    await toggleLike();
  };

  const handleWatchLater = async () => {
    if (isGuest || !id) {
      handleGuestRestriction();
      return;
    }
    
    const willBeBookmarked = !isBookmarked;
    await toggleWatchLater(id);
    toast(willBeBookmarked ? "Bookmarked" : "Removed from Bookmarks");
  };

  const handleShare = () => {
    const url = window.location.href;
    
    // Fallback function for restricted environments
    const fallbackCopy = (text: string) => {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
          toast("Link copied to clipboard!");
        } else {
          prompt("Copy this link:", text);
        }
      } catch (err) {
        console.error('Fallback copy failed', err);
        prompt("Copy this link:", text);
      }
    };

    // Try modern API first, then fallback
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url)
        .then(() => toast("Link copied to clipboard!"))
        .catch(() => fallbackCopy(url));
    } else {
      fallbackCopy(url);
    }
  };

  const handleProgress = (time: number, dur: number) => {
    setCurrentTime(time);
    setDuration(dur);
    
    // Save progress for signed-in users (not guests)
    const guestMode = localStorage.getItem("isGuest") === "true";
    if (!guestMode && id && dur) {
      const progress = {
        videoId: id,
        currentTime: time,
        duration: dur,
        percentage: (time / dur) * 100,
        timestamp: Date.now(),
        thumbnail: video?.thumbnail || "",
        title: video?.title || "",
        author: video?.author || "",
        videoDuration: video?.duration || ""
      };
      
      // Only save if progress is between 5% and 95% (avoid saving beginning/end)
      if (progress.percentage > 1 && progress.percentage < 95) {
        localStorage.setItem(`video_progress_${id}`, JSON.stringify(progress));
      } else if (progress.percentage >= 95) {
        // Remove from continue watching if completed
        localStorage.removeItem(`video_progress_${id}`);
      }
    }
  };

  const handleGuestRestriction = () => {
    toast("Please sign in to view");
  };

  const handlePlay = () => {
    if (id && !hasIncrementedView.current) {
      incrementViewCount(id);
      hasIncrementedView.current = true;
    }
  };

  if (!mounted || loading || !video) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isLightsOut ? "bg-[#000000] text-white" : isDim ? "bg-[#15202B] text-white" : "bg-[#f5f5f5] text-gray-900"}`}>
        <div className="animate-pulse font-['Poppins'] font-bold text-xl">
          Loading Likhani...
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={`min-h-screen transition-colors duration-300 ${isLightsOut ? "bg-[#000000] text-white" : isDim ? "bg-[#15202B] text-white" : "bg-[#f5f5f5] text-gray-900"}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Navbar />

      <main className="py-8">
        <PageContainer>
          <div className="mb-8">
            <BackButton />
          </div>

          {/* Player Container */}
          <div
            className={`relative w-full aspect-video rounded-[14px] overflow-hidden shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] mb-12 ${isDark ? "bg-black" : "bg-[#101828]"}`}
          >
            <VideoPlayer
              url={video.videoUrl}
              poster={video.thumbnail}
              title={video.title}
              mimeType={video.videoMimeType}
              isDarkened={isDarkened}
              onProgress={handleProgress}
              onPlay={handlePlay}
            />
          </div>

          {/* Main Info Card */}
          <div
            className={`rounded-2xl p-8 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] mb-12 ${isLightsOut ? "bg-[#000000]" : isDim ? "bg-[#253341]" : "bg-white"}`}
          >
            <div className="flex flex-col lg:flex-row gap-6 mb-8">
              {/* Left Column (792px target) */}
              <div className="flex-[792] lg:max-w-[792px]">
                <div className="mb-8">
                  <h1 className="font-['Poppins'] font-[800] text-[30px] leading-[36px] tracking-[-0.75px] text-[#101828] mb-6">
                    {video.title}
                  </h1>
                  
                  {/* Director Section */}
                  <div className="mb-10">
                    <p className="text-[10px] font-['Inter'] font-[700] uppercase tracking-[1px] text-[#6A7282] mb-3">
                      Director
                    </p>
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-['Inter'] font-[700] text-[16px] flex-shrink-0"
                        style={{ backgroundColor: primaryRed }}
                      >
                        {(video.director || video.author || "K").charAt(0)}
                      </div>
                      <p className="font-['Poppins'] font-[700] text-[15px] text-[#101828]">
                        {video.director || video.author || "Kwentong Barbero"}
                      </p>
                    </div>
                  </div>

                  {/* Cast & Crew Section */}
                  <div className="mb-10">
                    <p className="text-[10px] font-['Inter'] font-[700] uppercase tracking-[1px] text-[#6A7282] mb-3">
                      Cast & Crew
                    </p>
                    <div className="space-y-3">
                      {video.cast && video.cast.length > 0 ? video.cast.map((member: any, index: number) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#E5E7EB] text-[#364153] font-['Inter'] font-[700] text-[12px] flex-shrink-0">
                            {member.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-['Poppins'] font-[600] text-[14px] text-[#101828] leading-tight">
                              {member.name}
                            </p>
                            <p className="font-['Poppins'] font-[500] text-[12px] text-[#6A7282]">
                              {member.role}
                            </p>
                          </div>
                        </div>
                      )) : (
                        <p className="font-['Poppins'] text-[13px] text-[#99A1AF] italic">
                          No cast members listed.
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Validated Badge */}
                  <div className="flex items-center mb-10">
                    <div className="flex items-center gap-[6px] px-3 py-1.5 bg-[#F0FDF4] border border-[#B9F8CF] rounded-full">
                      <svg className="w-[14px] h-[14px] text-[#00A63E]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-['Poppins'] text-[11px] font-[700] text-[#008236]">
                        Validated by Faculty
                      </span>
                    </div>
                  </div>

                  {/* Engagement Row */}
                  <div className="flex flex-wrap gap-4 items-center">
                    {/* View Count */}
                    <div className="flex items-center gap-1.5 px-4 h-[54.13px] bg-[#F3F4F6] rounded-[10px]">
                      <Eye className="w-5 h-5 text-[#101828]" />
                      <span className="font-['Poppins'] font-[700] text-[14px] text-[#101828]">
                        {(video.views || 0).toLocaleString()} views
                      </span>
                    </div>

                    {/* Like Button */}
                    <button
                      onClick={handleLike}
                      className={`flex items-center gap-2 px-6 h-[54.13px] rounded-[10px] border transition-all ${
                        isLiked 
                          ? "bg-[#101828] text-white border-transparent" 
                          : "bg-white text-[#101828] border-[#D1D5DC] hover:bg-gray-50"
                      }`}
                    >
                      <ThumbsUp className="w-5 h-5" fill={isLiked ? "currentColor" : "none"} />
                      <span className="font-['Poppins'] font-[600] text-[14px]">
                        {likeCount.toLocaleString()}
                      </span>
                    </button>

                    {/* Bookmark Button */}
                    <button
                      onClick={handleWatchLater}
                      className={`flex items-center gap-2 px-6 h-[54.13px] rounded-[10px] border transition-all ${
                        isBookmarked 
                          ? "bg-[#101828] text-white border-transparent" 
                          : "bg-white text-[#101828] border-[#D1D5DC] hover:bg-gray-50"
                      }`}
                    >
                      <Bookmark className="w-5 h-5" fill={isBookmarked ? "currentColor" : "none"} />
                      <span className="font-['Poppins'] font-[600] text-[14px]">Bookmark</span>
                    </button>

                    {/* Share Button */}
                    <button
                      onClick={handleShare}
                      className="flex items-center gap-2 px-6 h-[54.13px] rounded-[10px] border bg-white text-[#101828] border-[#D1D5DC] hover:bg-gray-50 transition-all"
                    >
                      <Share2 className="w-5 h-5" />
                      <span className="font-['Poppins'] font-[600] text-[14px]">Share</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column / Metadata Sidebar (256px target) */}
              <div className="flex-[256] lg:max-w-[256px]">
                <div className={`p-6 rounded-[14px] ${isDark ? "bg-black/40" : "bg-[#F9FAFB]"}`}>
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E5E7EB]/20">
                    <span className="text-[10px] font-['Inter'] font-[700] uppercase tracking-[1px] text-[#6A7282]">
                      Metadata
                    </span>
                    <button
                      onClick={() => navigate(`/project-info/${video.id}`)}
                      className="w-4 h-4 rounded-full border border-[#E7000B] flex items-center justify-center text-[10px] font-['Inter'] font-[700] text-[#E7000B] hover:bg-red-50 transition-colors"
                      title="View detailed project information"
                    >
                      i
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Age Rating */}
                    <div>
                      <p className="text-[10px] font-['Inter'] font-[700] uppercase tracking-[1px] text-[#6A7282] mb-2">
                        Age Rating
                      </p>
                      <div className="px-3 py-1.5 bg-[#FEF2F2] border border-[#E7000B] rounded-[10px] w-fit">
                        <span className="font-['Poppins'] text-[13px] font-[800] text-[#C10007]">
                          {video.ageRating || "18+"}
                        </span>
                      </div>
                    </div>

                    {/* Year */}
                    <div>
                      <p className="text-[10px] font-['Inter'] font-[700] uppercase tracking-[1px] text-[#6A7282] mb-1.5">
                        Year
                      </p>
                      <p className="font-['Poppins'] font-[700] text-[14px] text-[#101828]">
                        {new Date(video.releaseDate || Date.now()).getFullYear() || "2014"}
                      </p>
                    </div>

                    {/* Genre */}
                    <div>
                      <p className="text-[10px] font-['Inter'] font-[700] uppercase tracking-[1px] text-[#6A7282] mb-1.5">
                        Genre
                      </p>
                      <p className="font-['Poppins'] font-[700] text-[14px] text-[#101828]">
                        {video.genre || "Horror, Suspense"}
                      </p>
                    </div>

                    {/* Duration */}
                    <div>
                      <p className="text-[10px] font-['Inter'] font-[700] uppercase tracking-[1px] text-[#6A7282] mb-1.5">
                        Duration
                      </p>
                      <p className="font-['Poppins'] font-[700] text-[14px] text-[#101828]">
                        {video.duration ? formatTime(video.duration) : "2:27"}
                      </p>
                    </div>

                    {/* Theoretical Framework */}
                    <div className="pt-4 border-t border-[#E5E7EB]/20">
                      <p className="text-[10px] font-['Inter'] font-[700] uppercase tracking-[1px] text-[#6A7282] mb-2">
                        Theoretical Framework
                      </p>
                      <div className="px-3 py-1.5 bg-white/50 border border-[#E5E7EB] rounded-full w-fit">
                        <span className="font-['Poppins'] text-[11px] font-[700] text-[#364153]">
                          {video.theory || "Folkloric Analysis"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Logline Section */}
            <div className="border-t border-[#E5E7EB] pt-6 mt-8">
              <h2 className="font-['Poppins'] font-[700] text-[18px] text-[#101828] mb-4">
                Logline
              </h2>
              <p className="font-['Poppins'] font-[500] text-[15px] leading-[24px] text-[#364153] max-w-[659px]">
                {video.logline || "A suspenseful short following a quiet moment that turns into a fight for survival as a young woman discovers she is being watched."}
              </p>
              
              {/* Report / Removal Link */}
              <div className="mt-8 pt-6 border-t border-[#F3F4F6]">
                <button 
                  onClick={() => navigate("/report", { state: { mediaId: id } })}
                  className="font-['Poppins'] font-[500] text-[11px] text-[#99A1AF] underline hover:text-[#6A7282] transition-colors"
                >
                  Report / Request Removal
                </button>
              </div>
            </div>
          </div>
        </PageContainer>

        <div className="mt-12 mb-20">
          <CategoryCarousel
            title="Related Works"
            videos={publishedMedia
              .filter((v) => v.id !== video.id)
              .map(m => ({ ...m, thumbnail: m.posterUrl, author: m.creator }))
              .slice(0, 10)}
            isDark={isDark}
          />
        </div>
      </main>

      {/* Age Restriction Modal */}
      {showAgeRestrictionModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className={`max-w-md w-full rounded-2xl p-8 shadow-2xl ${isLightsOut ? "bg-[#000000]" : isDim ? "bg-[#253341]" : "bg-white"}`}>
            <div className="flex flex-col items-center text-center">
              {/* Age Rating Badge */}
              <div className="mb-6 px-6 py-3 bg-red-100 border-3 border-red-600 rounded-xl">
                <span className="font-['Poppins'] text-2xl font-extrabold text-red-700">
                  {video.ageRating}
                </span>
              </div>
              
              <h2 className="font-['Poppins'] font-extrabold text-2xl mb-4">
                Age-Restricted Content
              </h2>
              
              <p className={`font-['Poppins'] text-[15px] leading-relaxed mb-6 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                This project is rated <span className="font-bold text-red-600">{video.ageRating}</span> and contains mature content. Please sign in with your institutional account to verify your access and view this work.
              </p>
              
              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={() => {
                    // Store the current path so the user returns here after sign-in
                    localStorage.setItem("returnTo", window.location.pathname);
                    navigate("/");
                  }}
                  className="w-full px-6 py-4 rounded-lg font-['Poppins'] text-sm font-bold text-white transition-all hover:scale-[1.02] shadow-lg"
                  style={{ backgroundColor: primaryRed }}
                >
                  Sign In to Verify Access
                </button>
                
                <button
                  onClick={() => navigate("/home")}
                  className={`w-full px-6 py-4 rounded-lg font-['Poppins'] text-sm font-semibold transition-all border ${
                    isDark
                      ? "bg-white/10 text-white border-white/20 hover:bg-white/20"
                      : "bg-gray-100 text-gray-900 border-gray-300 hover:bg-gray-200"
                  }`}
                >
                  Return to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
