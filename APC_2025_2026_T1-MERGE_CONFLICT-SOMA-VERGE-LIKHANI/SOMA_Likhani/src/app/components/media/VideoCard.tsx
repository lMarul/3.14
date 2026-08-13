import React, { useState, useRef, useEffect } from "react";
import { Play, Film } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCustomTheme } from "../providers/ThemeContext";
import { motion } from "motion/react";

interface VideoCardProps {
  id: string;
  title: string;
  author?: string;
  thumbnail: string;
  duration: string;
  videoUrl?: string;
  hideDuration?: boolean;
  category?: string;
  year?: string;
  description?: string;
  stills?: string[];
}

// Helper function to extract YouTube video ID
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

// Helper function to extract Google Drive file ID
function getGoogleDriveFileId(url: string): string | null {
  const patterns = [/\/file\/d\/([^/]+)/, /id=([^&]+)/];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Helper function to check if URL is a YouTube link
function isYouTubeUrl(url: string | null | undefined): boolean {
  return !!url && (url.includes('youtube.com') || url.includes('youtu.be'));
}

// Helper function to check if URL is a Google Drive link
function isGoogleDriveUrl(url: string | null | undefined): boolean {
  return !!url && url.includes('drive.google.com');
}

export function VideoCard({ id, title, author, thumbnail, duration, videoUrl, hideDuration = false, category, year, description, stills = [] }: VideoCardProps) {
  const navigate = useNavigate();
  const { theme, resolvedTheme } = useCustomTheme();
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [currentStillIndex, setCurrentStillIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isHovered && stills && stills.length > 0) {
      const interval = setInterval(() => {
        setCurrentStillIndex((prev) => (prev + 1) % stills.length);
      }, 1200); // 1200ms slides
      return () => clearInterval(interval);
    } else {
      setCurrentStillIndex(0);
    }
  }, [isHovered, stills]);

  const currentTheme = theme === 'system' ? resolvedTheme : theme;
  const isDim = currentTheme === 'dim';
  const isLightsOut = currentTheme === 'lights-out';
  const isDark = isDim || isLightsOut;
  const primaryRed = isDark ? "#ff4b4b" : "#8a181a";

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/video/${id}`);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (stills && stills.length > 0) return;
    if (!videoUrl) return;
    if (videoRef.current && !isYouTubeUrl(videoUrl) && !isGoogleDriveUrl(videoUrl)) {
      videoRef.current.play().catch(() => {
        // Ignore autoplay errors
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (stills && stills.length > 0) return;
    if (!videoUrl) return;
    if (videoRef.current && !isYouTubeUrl(videoUrl) && !isGoogleDriveUrl(videoUrl)) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  if (!mounted) return null;

  const youtubeId = videoUrl && isYouTubeUrl(videoUrl) ? getYouTubeVideoId(videoUrl) : null;

  return (
    <motion.div 
      className="group cursor-pointer w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      animate={isHovered ? { 
        scale: 1.02, // Reduced scale effect for academic feel
        zIndex: 50,
      } : { 
        scale: 1, 
        zIndex: 1
      }}
      transition={{ duration: 0.22, ease: "easeInOut" }}
    >
      <div 
        className={`relative w-full overflow-hidden rounded-lg mb-[12px] transition-all duration-200 ${
          isHovered 
            ? 'shadow-2xl ring-2 ring-transparent' 
            : 'shadow-sm'
        }`}
        style={{ aspectRatio: '16 / 9' }}
      >
        {/* Thumbnail */}
        {!imgError ? (
          <motion.img 
            src={thumbnail} 
            alt={title}
            className={`w-full h-full object-cover transition-opacity duration-300 ${isHovered ? 'opacity-100 brightness-110' : 'opacity-100'}`}
            animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
            transition={{ duration: 0.4 }}
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className={`w-full h-full flex flex-col items-center justify-center select-none transition-colors ${
              isLightsOut ? "bg-[#000000]" : isDim ? "bg-[#253341]" : "bg-[#e8e5df]"
            }`}
          >
            <Film
              className={`w-7 h-7 mb-2 opacity-25 ${isDark ? "text-gray-400" : "text-gray-500"}`}
            />
            <p
              className={`font-['Poppins'] text-[11px] text-center px-3 leading-snug opacity-30 line-clamp-2 ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {title}
            </p>
          </div>
        )}
        
        {/* YouTube Autoplay Hover */}
        {youtubeId && isHovered && (
          <div className="absolute inset-0 w-full h-full bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${youtubeId}&modestbranding=1&rel=0`}
              className="w-full h-full pointer-events-none"
              allow="autoplay"
              title={title}
            />
          </div>
        )}

        {/* Cloudinary/Direct Video preview on hover */}
        {videoUrl && !isYouTubeUrl(videoUrl) && !isGoogleDriveUrl(videoUrl) && (
          <video
            ref={videoRef}
            src={videoUrl}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
            muted
            loop
            playsInline
          />
        )}

        {/* Stills Slideshow Hover Overlay */}
        {stills && stills.length > 0 && isHovered && (
          <div className="absolute inset-0 w-full h-full bg-black z-20">
            {stills.map((stillUrl, idx) => (
              <img
                key={stillUrl}
                src={stillUrl}
                alt=""
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                  idx === currentStillIndex ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
          </div>
        )}
        
        {/* Play button overlay */}
        <div className={`absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}>
          <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
            <Play className="w-6 h-6 ml-1 text-gray-900" fill="currentColor" />
          </div>
        </div>
        
        {/* Duration badge - Hidden if requested */}
        {!hideDuration && !isHovered && (
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded font-['Poppins'] font-bold uppercase tracking-wider">
            {duration}
          </div>
        )}
      </div>
      
      <div className="flex flex-col">
        {/* Title */}
        <h3 
          className={`font-['Poppins'] font-bold text-[16px] md:text-[18px] line-clamp-1 transition-colors duration-300 leading-snug mb-[6px] ${isHovered ? 'text-gray-900 dark:text-white' : isDark ? 'text-white' : 'text-gray-900'}`}
        >
          {title}
        </h3>

        {/* Metadata: Category · Year */}
        {(category || year) && (
          <p className={`font-['Poppins'] text-[12px] font-medium uppercase tracking-wide mb-[6px] ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            {category || 'Uncategorized'} · {year || '2026'}
          </p>
        )}

        {/* Description */}
        {description && (
          <p className={`font-['Poppins'] text-[13px] leading-relaxed line-clamp-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {description}
          </p>
        )}

        {/* Author (if not redundant with description/metadata, keeps existing behavior just in case, but styled subtly) */}
        {author && !description && (
          <p className={`font-['Poppins'] text-[13px] mt-1 line-clamp-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            {author}
          </p>
        )}
      </div>
    </motion.div>
  );
}
