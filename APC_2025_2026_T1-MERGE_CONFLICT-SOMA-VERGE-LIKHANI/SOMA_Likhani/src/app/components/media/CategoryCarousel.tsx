import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { VideoCard } from "./VideoCard";
import { TertiaryButton } from "../common/StandardButtons";

interface Video {
  id: string;
  title: string;
  author?: string;
  thumbnail: string;
  duration: string;
  videoUrl: string;
}

interface CategoryCarouselProps {
  title: string;
  videos: Video[];
  isDark: boolean;
  onViewAll?: () => void;
}

import { useCustomTheme } from "../providers/ThemeContext";

export function CategoryCarousel({ title, videos, isDark, onViewAll }: CategoryCarouselProps) {
  const { theme, resolvedTheme } = useCustomTheme();
  const currentTheme = theme === 'system' ? resolvedTheme : theme;
  const isDim = currentTheme === 'dim';
  const isLightsOut = currentTheme === 'lights-out';
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  
  // Drag state
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftArrow(scrollLeft > 10);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [videos]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    // Scroll one card (340px) + gap (24px) = 364px
    const scrollAmount = direction === "left" ? -364 : 364;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDown(true);
    setIsDragging(false);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const handleMouseLeave = () => {
    setIsDown(false);
    setIsDragging(false);
    setIsHovering(false);
  };

  const handleMouseUp = () => {
    setIsDown(false);
    // setTimeout to allow onClick to fire if it wasn't a drag, 
    // but here we just reset isDragging after a microtask so click handler can check it if needed
    setTimeout(() => setIsDragging(false), 0); 
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current.offsetLeft || 0);
    const walk = (x - startX) * 2; // Scroll-fast
    
    if (Math.abs(walk) > 5) {
        setIsDragging(true);
    }
    
    scrollRef.current.scrollLeft = scrollLeft - walk;
    checkScroll();
  };

  const handleCardClickCapture = (e: React.MouseEvent) => {
    if (isDragging) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  return (
    <div 
      className="relative group py-8"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-baseline justify-between px-4 lg:px-8 mb-6 w-full max-w-[min(1200px,calc(100vw-48px))] mx-auto">
        <h2 className={`font-['Poppins'] font-extrabold text-[28px] transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </h2>
        {onViewAll && (
          <TertiaryButton onClick={onViewAll}>
            View All →
          </TertiaryButton>
        )}
      </div>

      <div className="relative w-full max-w-[min(1200px,calc(100vw-48px))] mx-auto px-4 lg:px-8">
        {/* Left Arrow - Vertically Centered on Row */}
        <AnimatePresence>
          {isHovering && showLeftArrow && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.22 }}
              onClick={() => scroll("left")}
              className={`absolute left-4 top-1/2 -translate-y-1/2 z-[50] w-12 h-12 rounded-full flex items-center justify-center shadow-lg backdrop-blur-md transition-all ${
                isDark 
                  ? "text-white border border-white/20" 
                  : "text-gray-900 border border-gray-200"
              }`}
              style={{ backgroundColor: isDark ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.95)" }}
              whileHover={{ 
                backgroundColor: isDark ? "rgba(0,0,0,1)" : "rgba(255,255,255,1)",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }}
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Right Arrow - Vertically Centered on Row */}
        <AnimatePresence>
          {isHovering && showRightArrow && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.22 }}
              onClick={() => scroll("right")}
              className={`absolute right-4 top-1/2 -translate-y-1/2 z-[50] w-12 h-12 rounded-full flex items-center justify-center shadow-lg backdrop-blur-md transition-all ${
                isDark 
                  ? "text-white border border-white/20" 
                  : "text-gray-900 border border-gray-200"
              }`}
              style={{ backgroundColor: isDark ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.95)" }}
              whileHover={{ 
                backgroundColor: isDark ? "rgba(0,0,0,1)" : "rgba(255,255,255,1)",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }}
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={`overflow-x-auto scrollbar-hide py-8 -mx-1 px-1 ${isDown ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="flex gap-6" style={{ width: "max-content" }}>
            {videos.map((video, idx) => (
              <motion.div 
                key={`${video.id}-${idx}`}
                className="w-[340px] flex-shrink-0 relative"
                onClickCapture={handleCardClickCapture}
                whileHover={{ 
                  scale: 1.08, 
                  zIndex: 40,
                  transition: { duration: 0.22, ease: "easeOut" }
                }}
                style={{ transformOrigin: "center center" }}
              >
                <div className={`transition-all duration-300 ${isDark ? 'shadow-black/50' : 'shadow-gray-200'} group-hover:shadow-2xl`}>
                  <VideoCard
                    id={video.id}
                    title={video.title}
                    author={video.author}
                    thumbnail={video.thumbnail}
                    duration={video.duration}
                    videoUrl={video.videoUrl}
                    stills={video.stills}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

