import React, { useEffect, useRef, useState } from "react";
// Robust import for Cloudinary
import * as cloudinaryModule from "cloudinary-video-player";
import "cloudinary-video-player/cld-video-player.min.css";

interface CloudinaryPlayerProps {
  url: string;
  poster?: string;
  autoPlay?: boolean;
  onPlay?: () => void;
}

export const CloudinaryPlayer: React.FC<CloudinaryPlayerProps> = ({ 
  url, 
  poster, 
  autoPlay = false,
  onPlay
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Extract cloud name from URL
  const getCloudName = (url: string) => {
    const match = url.match(/res\.cloudinary\.com\/([^/]+)/);
    return match ? match[1] : "demo";
  };

  // Extract public ID from Cloudinary URL
  const getPublicId = (url: string) => {
    // Match pattern: .../upload/v{version}/{public_id}.{ext}
    const match = url.match(/\/upload\/v\d+\/(.+?)(?:\.[^.]+)?$/);
    if (match) {
      return match[1];
    }
    // Fallback: try to get the last part of the URL without extension
    const parts = url.split('/');
    const lastPart = parts[parts.length - 1];
    return lastPart.replace(/\.[^.]+$/, '');
  };

  useEffect(() => {
    if (!containerRef.current) return;

    setIsLoading(true);
    setError(null);

    // Reset container
    containerRef.current.innerHTML = "";

    // Create video element
    const videoElement = document.createElement("video");
    videoElement.className = "cld-video-player cld-fluid select-none";
    videoElement.id = `cld-player-${Math.random().toString(36).substr(2, 9)}`;
    
    // Add anti-screenshot / interaction protections natively
    videoElement.style.userSelect = "none";
    videoElement.style.webkitUserSelect = "none";
    videoElement.setAttribute("controlsList", "nodownload nofullscreen noremoteplayback");
    videoElement.setAttribute("disablePictureInPicture", "true");
    videoElement.addEventListener("contextmenu", (e) => e.preventDefault());
    videoElement.addEventListener("dragstart", (e) => e.preventDefault());
    
    containerRef.current.appendChild(videoElement);

    const cloudName = getCloudName(url);
    const publicId = getPublicId(url);
    
    try {
      const cldAny = cloudinaryModule as any;
      const videoPlayerFn = cldAny.videoPlayer || cldAny.default?.videoPlayer || cldAny.default || (window as any).cloudinary?.videoPlayer;
      
      if (typeof videoPlayerFn !== 'function') {
        throw new Error("Cloudinary videoPlayer not found");
      }

      // We remove the 'colors' object to prevent dynamic loading of colors.js chunk
      // which fails in some sandboxed environments.
      const player = videoPlayerFn(videoElement, {
        cloud_name: cloudName,
        controls: true,
        fluid: true,
        autoplayMode: autoPlay ? 'always' : 'never',
        showLogo: false,
        allowFullscreen: true,
        interactionDisplay: false,
        analytics: false,
        logo: false,
        // Explicitly avoid any plugins that might try to load external chunks
      });

      playerRef.current = player;

      // Add error handlers
      player.on('error', (error: any) => {
        console.error("Cloudinary player error:", error);
        const errorCode = error?.code || error?.currentTarget?.error?.code;
        const statusCode = error?.statusCode;
        
        if (errorCode === 4 || statusCode === 401) {
          setError("This video is currently unavailable. Please contact the archive administrator.");
        } else if (errorCode === 10) {
          setError("Unable to play this video. The format may not be supported.");
        } else {
          setError("An error occurred while loading the video.");
        }
        setIsLoading(false);
      });

      player.on('loadedmetadata', () => {
        setIsLoading(false);
      });

      player.on('canplay', () => {
        setIsLoading(false);
      });

      player.on('play', () => {
        if (onPlay) onPlay();
      });

      // Use publicId instead of full URL for better compatibility
      player.source(publicId, {
        sourceTypes: ['hls', 'dash', 'mp4'],
        transformation: {
          streaming_profile: 'full_hd'
        },
        info: {
          title: '',
        },
        poster: poster
      });

    } catch (err) {
      console.error("Cloudinary initialization error:", err);
      setError("Unable to load the Likhani stream.");
      setIsLoading(false);
    }

    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.dispose();
          playerRef.current = null;
        } catch (e) {
          // Silent cleanup
        }
      }
    };
  }, [url, poster, autoPlay]);

  if (error) {
    return (
      <div className="w-full h-full bg-black flex flex-col items-center justify-center text-white p-8">
        <div className="text-center max-w-md">
          <div className="text-red-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="font-['Poppins'] text-sm text-white/80 mb-2">{error}</p>
          <p className="font-['Poppins'] text-xs text-white/50">Error loading video stream</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/50 mx-auto mb-4"></div>
          <p className="font-['Poppins'] text-sm text-white/60">Loading archive...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-black relative overflow-hidden group">
      {/* 
          CSS Overrides for branding. 
          This is a safer way to style the player than using the 'colors' config option 
          which triggers external chunk loading (colors.js).
      */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* Progress and Volume bars */
        .vjs-play-progress, .vjs-volume-level, .vjs-slider-bar {
          background-color: #8a181a !important;
        }
        
        /* Big Play Button */
        .vjs-big-play-button {
          background-color: rgba(138, 24, 26, 0.8) !important;
          border-color: #8a181a !important;
          border-radius: 50% !important;
          width: 80px !important;
          height: 80px !important;
          line-height: 80px !important;
          margin-left: -40px !important;
          margin-top: -40px !important;
        }
        
        .vjs-big-play-button:hover {
          background-color: #8a181a !important;
        }

        /* Seek Bar Progress */
        .vjs-load-progress div {
          background: rgba(255, 255, 255, 0.2) !important;
        }
        
        .cld-video-player {
          width: 100% !important;
          height: 100% !important;
        }
      `}} />
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};