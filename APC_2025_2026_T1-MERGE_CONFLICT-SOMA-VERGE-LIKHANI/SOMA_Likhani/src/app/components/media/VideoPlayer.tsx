import React, { useState, useRef, useEffect } from "react";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  SkipBack, 
  SkipForward,
  Settings,
  AlertCircle,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CloudinaryPlayer } from "./CloudinaryPlayer";
import DynamicWatermarkOverlay from "../common/DynamicWatermarkOverlay";
import SecureMediaContainer from "../common/SecureMediaContainer";
import { useDisplayCapturePolicy } from "../../hooks/useDisplayCapturePolicy";

interface VideoPlayerProps {
  url: string;
  poster?: string;
  title?: string;
  mimeType?: string;
  autoPlay?: boolean;
  isDarkened?: boolean;
  onProgress?: (currentTime: number, duration: number) => void;
  onPlay?: () => void;
  className?: string;
}

export function VideoPlayer({ 
  url, 
  poster, 
  title, 
  mimeType, 
  autoPlay = false, 
  isDarkened = false,
  onProgress,
  onPlay,
  className = "" 
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<any>(null);

  useDisplayCapturePolicy();

  // Detect Video Type
  const isYouTube = (u: string) => u.includes("youtube.com") || u.includes("youtu.be");
  const isGoogleDrive = (u: string) => u.includes("drive.google.com");
  const isCloudinary = (u: string) => u.includes("res.cloudinary.com");

  const getYouTubeId = (u: string) => {
    const match = u.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const getDriveId = (u: string) => {
    const match = u.match(/\/file\/d\/([^/]+)/) || u.match(/id=([^&]+)/);
    return match ? match[1] : null;
  };

  const youtubeId = isYouTube(url) ? getYouTubeId(url) : null;
  const driveId = isGoogleDrive(url) ? getDriveId(url) : null;
  const cloudinaryUrl = isCloudinary(url) ? url : null;

  // Auto-hide controls
  useEffect(() => {
    if (isPlaying && showControls) {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    }
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [isPlaying, showControls]);

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(err => {
        console.error("Playback error:", err);
        setError("Playback failed. Please try again.");
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      const dur = videoRef.current.duration;
      setCurrentTime(time);
      if (onProgress) onProgress(time, dur);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsLoading(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (youtubeId) {
    return (
      <div className={`relative w-full h-full bg-black rounded-xl overflow-hidden ${className}`}>
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=${autoPlay ? 1 : 0}&rel=0&modestbranding=1&showinfo=0`}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          title={title}
        />
      </div>
    );
  }

  if (driveId) {
    return (
      <div className={`relative w-full h-full bg-black rounded-xl overflow-hidden ${className}`}>
        <iframe
          src={`https://drive.google.com/file/d/${driveId}/preview?autoplay=${autoPlay ? 1 : 0}`}
          className="w-full h-full border-0"
          allow="autoplay; fullscreen"
          allowFullScreen
          title={title}
        />
      </div>
    );
  }

  if (cloudinaryUrl) {
    return (
      <SecureMediaContainer isDarkened={isDarkened} className={`relative w-full h-full bg-black rounded-xl overflow-hidden select-none ${className}`}>
        <div className={`pointer-events-auto h-full w-full transition-opacity duration-300 ${isDarkened ? "opacity-0 invisible" : "opacity-100"}`}>
            <CloudinaryPlayer url={cloudinaryUrl} poster={poster} autoPlay={autoPlay} onPlay={onPlay} />
        </div>
        <DynamicWatermarkOverlay controlsVisible={false} opacity={0.15} />
      </SecureMediaContainer>
    );
  }

  return (
    <SecureMediaContainer 
      ref={containerRef}
      videoRef={videoRef}
      isDarkened={isDarkened}
      className={`relative w-full h-full bg-black rounded-xl overflow-hidden group cursor-none ${showControls ? "cursor-default" : ""} ${className}`}
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={url}
        poster={poster}
        className={`w-full h-full object-contain transition-opacity duration-300 select-none ${isDarkened ? "opacity-0 invisible" : "opacity-100"}`}
        style={{ WebkitUserSelect: "none" }}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onLoadStart={() => setIsLoading(true)}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => {
          setIsLoading(false);
          if (onPlay) onPlay();
        }}
        onEnded={() => setIsPlaying(false)}
        onError={() => setError("The video could not be loaded. Please check your connection or try again later.")}
        onClick={togglePlay}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        controlsList="nodownload nofullscreen noremoteplayback"
        disablePictureInPicture
        playsInline
      >
        {mimeType && <source src={url} type={mimeType} />}
      </video>

      {/* Dynamic Watermark Overlay */}
      <DynamicWatermarkOverlay controlsVisible={showControls} opacity={0.3} />

      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && !error && (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Loader2 className="w-12 h-12 text-white animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Overlay */}
      <AnimatePresence>
        {error && (
          <motion.div 
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md z-20 p-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
            <p className="text-white font-['Poppins'] font-bold text-lg mb-2">{error}</p>
            <button 
              onClick={() => { setError(null); setIsLoading(true); }}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors text-sm font-medium"
            >
              Try Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Big Center Play/Pause Button (Mobile-friendly) */}
      <AnimatePresence>
        {!isPlaying && !error && (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
          >
            <div className="w-20 h-20 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center shadow-2xl">
              <Play className="w-10 h-10 text-white fill-white ml-1" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls Overlay */}
      <AnimatePresence>
        {showControls && !error && (
          <motion.div 
            className="absolute inset-0 flex flex-col justify-end z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Gradient Background - More subtle at top, darker at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

            {/* BIG CENTER PLAY CONTROLS (Figma Design) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="flex items-center gap-[34px] pointer-events-auto">
                {/* Skip Back */}
                <button 
                  onClick={(e) => { e.stopPropagation(); if (videoRef.current) videoRef.current.currentTime -= 10; }}
                  className="w-12 h-12 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full transition-all active:scale-95"
                >
                  <div className="relative w-6 h-6 flex items-center justify-center">
                    <SkipBack className="w-5 h-5 text-white fill-white" />
                  </div>
                </button>

                {/* Big Play/Pause Button */}
                <button 
                  onClick={togglePlay}
                  className="w-[76px] h-[76px] flex items-center justify-center bg-white rounded-full shadow-[0px_19px_23.75px_-4.75px_rgba(0,0,0,0.1),0px_7.6px_9.5px_-5.7px_rgba(0,0,0,0.1)] transition-all hover:scale-105 active:scale-95 group"
                >
                  {isPlaying ? (
                    <Pause className="w-[38px] h-[38px] text-[#8A181A] fill-[#8A181A]" />
                  ) : (
                    <Play className="w-[38px] h-[38px] text-[#8A181A] fill-[#8A181A] ml-1" />
                  )}
                </button>

                {/* Skip Forward */}
                <button 
                  onClick={(e) => { e.stopPropagation(); if (videoRef.current) videoRef.current.currentTime += 10; }}
                  className="w-12 h-12 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full transition-all active:scale-95"
                >
                  <div className="relative w-6 h-6 flex items-center justify-center">
                    <SkipForward className="w-5 h-5 text-white fill-white" />
                  </div>
                </button>
              </div>
            </div>

            {/* BOTTOM CONTROLS AREA (Figma Design) */}
            <div className="relative w-full px-6 pb-6 pt-10 bg-gradient-to-t from-black/80 to-transparent">
              {/* Range Slider / Progress Bar */}
              <div className="relative w-full h-[6px] bg-white/30 rounded-full mb-3 group cursor-pointer pointer-events-auto">
                <div 
                  className="absolute h-full bg-[#8A181A] rounded-full"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer pointer-events-auto"
                />
              </div>

              {/* Time and Utility Controls */}
              <div className="flex items-center justify-between pointer-events-auto">
                <div className="flex items-center gap-4">
                  {/* Time Display */}
                  <div className="flex items-center gap-1 font-['Poppins'] text-[12px] font-bold text-white">
                    <span>{formatTime(currentTime)}</span>
                    <span className="opacity-50">/</span>
                    <span>{formatTime(duration)}</span>
                  </div>

                  {/* Volume Control (Mini) */}
                  <div className="flex items-center gap-2 group/vol">
                    <button onClick={toggleMute} className="text-white/70 hover:text-white transition-colors">
                      {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <div className="w-0 group-hover/vol:w-16 transition-all duration-300 overflow-hidden">
                       <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-16 h-0.5 accent-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Fullscreen Button */}
                  <button 
                    onClick={toggleFullscreen}
                    className="w-7 h-5 flex items-center justify-center text-white/80 hover:text-white transition-colors"
                  >
                    {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </SecureMediaContainer>
  );
}


