import { toast } from "sonner";
import { SiteFooter } from "../components/layout/SiteFooter";
import React, { useState, useEffect, useRef } from "react";
import { getAllVideos, getVideoById } from "../data/videos";
import { useNavigate } from "react-router-dom";
import { useCustomTheme } from "../components/providers/ThemeContext";
import { VideoCard } from "../components/media/VideoCard";
import { motion, AnimatePresence } from "motion/react";
import { Navbar } from "../components/layout/Navbar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PrimaryButton, SecondaryButton, TertiaryButton } from "../components/common/StandardButtons";
import { videoData } from "../data/videos";
import svgPaths from "../../generated/svg-cq2lewbljb";
import { useSiteConfig, useFeaturedWorks, usePublishedMedia, useCategories } from "../hooks/useLikhaniData";

// Horizontal Section Component for Cinematic Scrolling
const HorizontalSection = ({ title, description, videos, isDark, primaryRed, navigate }: any) => {
  const { theme, resolvedTheme } = useCustomTheme();
  const currentTheme = theme === 'system' ? resolvedTheme : theme;
  const isDim = currentTheme === 'dim';
  const isLightsOut = currentTheme === 'lights-out';

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      // Card width (280-340px responsive) + 24px gap
      const cardEl = container.querySelector(':scope > div') as HTMLElement;
      const scrollAmount = cardEl ? cardEl.offsetWidth + 24 : 364;

      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const getCategory = (genre: string) => genre ? genre.split(',')[0].trim() : 'Uncategorized';
  const getYear = (date: string) => date ? date.split('-')[0] : '2026';

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      // Check initial state
      handleScroll();
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [videos]);

  return (
    <section className="relative w-full max-w-[min(1200px,calc(100vw-48px))] mx-auto px-4 sm:px-5 md:px-6 lg:px-8 group/section mb-12 md:mb-20 border-b border-[#E5E7EB] dark:border-gray-800 pb-16 last:border-0">
      <div className="mb-4 md:mb-6">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className={`font-['Poppins'] font-extrabold text-[20px] sm:text-[24px] md:text-[28px] leading-tight transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {title}
          </h2>
          <TertiaryButton
            onClick={() => navigate("/recently-uploaded")}
            className="opacity-0 group-hover/section:opacity-100 whitespace-nowrap text-xs sm:text-sm"
          >
            View All →
          </TertiaryButton>
        </div>
        <p className={`font-['Poppins'] text-[12px] sm:text-[13px] mt-1 md:mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {description}
        </p>
      </div>

      <div className="relative group/slider">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className={`hidden sm:flex absolute -left-6 md:left-0 top-[80px] md:top-[108px] lg:top-[116px] -translate-y-1/2 z-40 w-10 md:w-12 h-10 md:h-12 rounded-full items-center justify-center shadow-xl transition-all duration-300 ${showLeftArrow
            ? "opacity-100 translate-x-0"
            : "opacity-0 pointer-events-none -translate-x-4"
            } ${isLightsOut ? "bg-[#000000] text-white hover:bg-[#000000]" : isDim ? "bg-[#253341] text-white hover:bg-[#3a3a3a]" : "bg-white text-gray-900 hover:bg-gray-50"}`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Scroll Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pt-6 pb-6 hide-scrollbar scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {videos.map((video: any) => (
            <div key={video.id} className="w-[280px] lg:w-[310px] xl:w-[340px] flex-shrink-0 transform transition-transform duration-300">
              <VideoCard
                id={video.id}
                title={video.title}
                author={video.author}
                thumbnail={video.thumbnail}
                duration={video.duration}
                videoUrl={video.videoUrl}
                hideDuration={true}
                category={getCategory(video.genre)}
                year={getYear(video.releaseDate)}
                description={video.logline}
                stills={video.stills}
              />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className={`hidden sm:flex absolute -right-6 md:right-0 top-[80px] md:top-[108px] lg:top-[116px] -translate-y-1/2 z-40 w-10 md:w-12 h-10 md:h-12 rounded-full items-center justify-center shadow-xl transition-all duration-300 ${showRightArrow
            ? "opacity-100 translate-x-0"
            : "opacity-0 pointer-events-none translate-x-4"
            } ${isLightsOut ? "bg-[#000000] text-white hover:bg-[#000000]" : isDim ? "bg-[#253341] text-white hover:bg-[#3a3a3a]" : "bg-white text-gray-900 hover:bg-gray-50"}`}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
};

export default function Home() {
  const navigate = useNavigate();
  const { theme, resolvedTheme } = useCustomTheme();

  const currentTheme = theme === 'system' ? resolvedTheme : theme;
  const isDim = currentTheme === 'dim';
  const isLightsOut = currentTheme === 'lights-out';
  const isDark = isDim || isLightsOut;
  const primaryRed = isDark ? "#ff4b4b" : "#8a181a";
  const bannerSpanColor = isDark ? "#8B9CAD" : "rgba(255,255,255,0.95)";
  const bannerSpanHover = isDark ? "#C9D1D9" : "#FFFFFF";

  const [currentSlide, setCurrentSlide] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [highlightCategory, setHighlightCategory] = useState<'liked' | 'viewed' | 'featured'>('featured');

  const { config: homepageConfig, loading: loadingConfig } = useSiteConfig('homepage');
  const { works: dbFeaturedWorks = [], loading: loadingFeatured } = useFeaturedWorks(true);
  const { works: dbGalleryFeatured = [], loading: loadingGalleryFeatured } = useFeaturedWorks(false);
  const { media: publishedMedia = [], loading: loadingMedia } = usePublishedMedia();
  const { categories = [], loading: loadingCategories } = useCategories();

  useEffect(() => {
    setMounted(true);
    const guestMode = localStorage.getItem("isGuest") === "true";
    setIsGuest(guestMode);
  }, []);

  const heroContent = React.useMemo(() => [
    {
      id: "anim-1",
      title: "Love at First Sight",
      author: "ketzel | Melaiza Ballesteros",
      description: "zombie apocalypse lesbians, that's it, that's the story.",
      image: "https://res.cloudinary.com/dv0rckb29/image/upload/v1771391284/Screenshot_2026-02-18_130736_kldbur.png",
      heroImage: "https://images.unsplash.com/photo-1648459678251-d68308fed935?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=85",
      genre: "Animation, Romance",
      ageRating: "+12",
    },
    {
      id: "live-1",
      title: "Saan Tayo Pupunta",
      author: "Sofia Cassandra Borje",
      description: "A boy tries to go back to his Lolo's hometown to find a sense of belonging in a world that feels increasingly unfamiliar.",
      image: "https://res.cloudinary.com/dv0rckb29/image/upload/v1770619769/Screenshot_2026-02-09_144904_ufev98.png",
      heroImage: "https://images.unsplash.com/photo-1641648537750-96ecc535006c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=85",
      genre: "Drama",
      ageRating: "+16",
    },
    {
      id: "doc-1",
      title: "Wings of Valor",
      author: "Sean Amiel Magalong",
      description: "To show the Filipino youth that 'Aviation Heroism' is not an overnight miracle, but a result of Perseverance, Creative Learning, and Community Support.",
      image: "https://res.cloudinary.com/dv0rckb29/image/upload/v1771394297/WingsOfValor_hugafo.png",
      heroImage: "https://images.unsplash.com/photo-1711311519446-a8659a23ff34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=85",
      genre: "Documentary",
      ageRating: "+13",
    }
  ], []);

  const displayHeroContent = React.useMemo(() => {
    // While the DB is still fetching, return empty so the skeleton shows instead of
    // the hardcoded fallback slides (prevents flash of default content on reload)
    if (loadingFeatured) return [];
    // After loading: use DB works if any, otherwise fall back to hardcoded defaults
    const items = (dbFeaturedWorks || []).length > 0
      ? (dbFeaturedWorks || []).map(fw => ({
        id: fw.id,
        title: fw.featureTitle || fw.title,
        author: fw.creator,
        description: fw.featureSubtitle || '',
        image: fw.posterUrl || "https://images.unsplash.com/photo-1648459678251-d68308fed935?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=85",
        heroImage: fw.posterUrl || "https://images.unsplash.com/photo-1648459678251-d68308fed935?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920&q=85",
        genre: fw.genre || 'Uncategorized',
        ageRating: fw.ageRating || 'General',
      }))
      : heroContent;
    return items.slice(0, 1);
  }, [dbFeaturedWorks, heroContent, loadingFeatured]);

  const spotlightWork = React.useMemo(() => {
    if (dbGalleryFeatured.length === 0) return null;
    return dbGalleryFeatured.find(w => w.featureType === 'spotlight') || dbGalleryFeatured[0];
  }, [dbGalleryFeatured]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => {
        const length = (displayHeroContent || []).length;
        if (length === 0) return 0;
        return (prev + 1) % length;
      });
    }, 7000);

    return () => clearInterval(timer);
  }, [displayHeroContent.length]);

  const handleGuestRestriction = () => {
    navigate("/");
  };


  const handleStreamNowClick = (id: string) => {
    navigate("/conf");
  };

  const handleWatchLaterClick = () => {
    if (isGuest) {
      handleGuestRestriction();
    } else {
      toast("Bookmarked!");
    }
  };

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const topCategoryData = React.useMemo(() => {
    const allVideos = publishedMedia.length > 0
      ? publishedMedia.map(m => ({ ...m, likes: m.likeCount, views: m.viewCount, author: m.creator, thumbnail: m.posterUrl }))
      : [
        ...videoData.animation,
        ...videoData.liveAction,
        ...videoData.documentaries
      ];

    let highlighted = allVideos[0] || null;
    let label = '';

    if (allVideos.length > 0) {
      if (highlightCategory === 'liked') {
        highlighted = allVideos.reduce((prev: any, current: any) =>
          ((current.likes || 0) > (prev.likes || 0)) ? current : prev
        );
        label = `${(highlighted.likes || 0).toLocaleString()} Likes`;
      } else if (highlightCategory === 'viewed') {
        highlighted = allVideos.reduce((prev: any, current: any) =>
          ((current.views || 0) > (prev.views || 0)) ? current : prev
        );
        label = `${(highlighted.views || 0).toLocaleString()} Views`;
      } else {
        const featuredIds = new Set([
          ...dbFeaturedWorks.map(w => w.id),
          ...dbGalleryFeatured.map(w => w.id)
        ]);
        highlighted = allVideos.find(v => featuredIds.has(v.id)) || allVideos[0];
        label = "Curated Selection";
      }
    }

    return { highlightedVideo: highlighted, categoryLabel: label };
  }, [publishedMedia, dbFeaturedWorks, dbGalleryFeatured, highlightCategory]);

  const highlightedVideo = topCategoryData.highlightedVideo;
  const categoryLabel = topCategoryData.categoryLabel;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEndHandler = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setCurrentSlide((prev) => (prev + 1) % displayHeroContent.length);
    }
    if (isRightSwipe) {
      setCurrentSlide((prev) => (prev - 1 + displayHeroContent.length) % displayHeroContent.length);
    }
  };

  // Create extended demo data
  const createDemoVideos = (originalVideos: any[], categoryName: string) => {
    const demoTitles = [
      "Demo Project Alpha", "Demo Project Beta", "Demo Project Gamma",
      "Demo Project Delta", "Demo Project Epsilon", "Demo Project Zeta",
      "Demo Project Eta", "Demo Project Theta", "Demo Project Iota"
    ];

    const extended = [...originalVideos];

    // Add dummy cards to enable scrolling
    while (extended.length < 10) {
      const baseVideo = originalVideos[extended.length % originalVideos.length];
      const demoTitle = demoTitles[(extended.length - originalVideos.length) % demoTitles.length];
      extended.push({
        ...baseVideo,
        id: `${categoryName}-demo-${extended.length}`,
        title: `${demoTitle} [Demo]`,
        author: "Demo Artist",
      });
    }

    return extended;
  };

  // currentHero is only needed after loading completes
  const currentHero = displayHeroContent.length > 0
    ? displayHeroContent[Math.min(currentSlide, displayHeroContent.length - 1)]
    : null;

  const siteHeroTitle = homepageConfig?.hero_title || 'LIKHANI Archive';
  const siteHeroSubtitle = homepageConfig?.hero_subtitle || 'Student Works from Asia Pacific College';
  const siteHeroBg = homepageConfig?.hero_background_url || '';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isLightsOut ? 'bg-[#000000] text-white' : isDim ? 'bg-[#131622] text-white' : 'bg-[#F7F6F3] text-gray-900'}`}>
      <Navbar />

      {/* Editorial Intro Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative w-full overflow-hidden min-h-[360px] flex items-center justify-center bg-[#8A181A]"
        style={siteHeroBg ? { backgroundImage: `url(${siteHeroBg})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        {siteHeroBg && <div className="absolute inset-0 bg-black/40 z-0" />}
        {/* Background layer — same SVG for all themes, colors adapt */}
        {!siteHeroBg && (
          <div className="absolute inset-0 transition-colors z-10">
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 1400 600"
              fill="none"
              preserveAspectRatio="xMidYMid slice"
              style={{ background: siteHeroBg ? 'transparent' : (isLightsOut ? '#0D0F14' : isDim ? '#131622' : '#8A181A') }}
            >
              <style>{`
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
              `}</style>
              <g
                opacity={isLightsOut ? 0.08 : isDim ? 0.15 : 0.21}
                transform="translate(0, 150)"
                fill={isLightsOut ? '#1A1A1A' : isDim ? '#F5F5F6' : '#CD5D5D'}
                stroke={isLightsOut ? '#1A1A1A' : isDim ? '#F5F5F6' : '#CD5D5D'}
              >
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
          </div>
        )}

        {/* Text content — centered with generous vertical padding */}
        <div className="relative z-10 w-full max-w-[min(1200px,calc(100vw-48px))] mx-auto px-4 lg:px-8 py-10 lg:py-16 text-center">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative inline-block"
            >
              <h1 className={`font-['Poppins'] font-bold text-[48px] leading-tight mb-2 tracking-tight ${isDim || isLightsOut ? 'text-[#F5F5F5]' : 'text-[#F5F5F5]'}`}>
                {siteHeroTitle}
              </h1>
              {/* Animated underline accent */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8, delay: 0.5, ease: "easeInOut" }}
                className="absolute -bottom-1 left-0 h-[3px] rounded-full"
                style={{ backgroundColor: isDim || isLightsOut ? 'rgba(245,245,246,0.4)' : '#FFFFFF' }}
              />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className={`font-['Poppins'] font-bold text-[24px] leading-tight mb-6 mt-4 ${isDim || isLightsOut ? 'text-[#D1D5DC]' : 'text-[#F5F5F5]'}`}
            >
              {siteHeroSubtitle}
            </motion.h2>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="max-w-[600px] mx-auto"
            >
              <p className={`font-['Poppins'] font-bold text-[16px] leading-[26px] ${isDim || isLightsOut ? 'text-[#6A7282]' : 'text-[rgba(255,255,255,0.75)]'}`}>
                Featuring faculty-endorsed projects from{" "}
                <motion.span
                  style={{ color: bannerSpanColor }}
                  whileHover={{ color: bannerSpanHover, scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  className="inline-block font-semibold cursor-default"
                >
                  Animation
                </motion.span>
                ,{" "}
                <motion.span
                  style={{ color: bannerSpanColor }}
                  whileHover={{ color: bannerSpanHover, scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  className="inline-block font-semibold cursor-default"
                >
                  Film
                </motion.span>
                ,{" "}
                <motion.span
                  style={{ color: bannerSpanColor }}
                  whileHover={{ color: bannerSpanHover, scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  className="inline-block font-semibold cursor-default"
                >
                  Documentary
                </motion.span>
                , {" "}
                <motion.span
                  style={{ color: bannerSpanColor }}
                  whileHover={{ color: bannerSpanHover, scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  className="inline-block font-semibold cursor-default"
                >
                  Thesis
                </motion.span>
                , and{" "}
                <motion.span
                  style={{ color: bannerSpanColor }}
                  whileHover={{ color: bannerSpanHover, scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  className="inline-block font-semibold cursor-default"
                >
                  Experimental
                </motion.span>
                {" "}disciplines.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Hero Section */}
      {loadingFeatured || !currentHero ? (
        /* Skeleton hero shown while carousel data is loading — prevents flash of default slides */
        <section className="relative h-[720px] overflow-hidden mb-[64px]">
          <div className={`absolute inset-0 animate-pulse ${isLightsOut ? 'bg-[#0D0F14]' : isDim ? 'bg-[#131622]' : 'bg-[#2a0608]'}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
          <div className="absolute bottom-16 left-12 flex flex-col gap-4">
            <div className={`h-10 w-72 rounded-lg animate-pulse ${isLightsOut || isDim ? 'bg-white/10' : 'bg-white/20'}`} />
            <div className={`h-4 w-48 rounded animate-pulse ${isLightsOut || isDim ? 'bg-white/8' : 'bg-white/15'}`} />
            <div className="flex gap-3 mt-2">
              <div className={`h-10 w-28 rounded-full animate-pulse ${isLightsOut || isDim ? 'bg-white/10' : 'bg-white/20'}`} />
              <div className={`h-10 w-28 rounded-full animate-pulse ${isLightsOut || isDim ? 'bg-white/8' : 'bg-white/12'}`} />
            </div>
          </div>
        </section>
      ) : (
        <section
          className="relative h-[720px] overflow-hidden mb-[64px] group"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEndHandler}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={currentHero.id}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
            >
              {/* Cinematic background image with slow Ken Burns drift */}
              <motion.img
                src={currentHero.heroImage}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ scale: 1.08 }}
                animate={{ scale: 1.0 }}
                transition={{ duration: 9, ease: "easeOut" }}
              />

              {/* Layered overlays for depth and text legibility */}
              {/* 1. Base tint — uniform cinematic darkening */}
              <div className="absolute inset-0 bg-black/40" />

              {/* 2. Left-anchored gradient — enhances text column contrast */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(105deg, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.40) 45%, rgba(0,0,0,0.10) 100%)",
                }}
              />

              {/* 3. Bottom gradient — lifts text off the image base */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.30) 38%, transparent 70%)",
                }}
              />

              {/* 4. Subtle top vignette — anchors the navbar zone */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, transparent 18%)",
                }}
              />
            </motion.div>
          </AnimatePresence>

          {/* Text content — at bottom of hero, no arrows inside */}
          <div className="relative w-full max-w-[min(1200px,calc(100vw-48px))] mx-auto px-4 sm:px-5 md:px-6 lg:px-8 h-full flex flex-col justify-end pb-20 sm:pb-24 z-10">
            <div className="max-w-[620px]">
              <motion.h1
                key={`${currentHero.id}-title`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="font-['Poppins'] font-extrabold text-[56px] leading-tight text-white mb-2 drop-shadow-lg"
              >
                {currentHero.title}
              </motion.h1>
              <motion.p
                key={`${currentHero.id}-author`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="font-['Poppins'] font-bold text-[20px] text-white/80 mb-4 drop-shadow-md italic"
              >
                By {currentHero.author}
              </motion.p>
              <motion.p
                key={`${currentHero.id}-desc`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="font-['Poppins'] font-medium text-[18px] leading-relaxed text-white/90 mb-10 drop-shadow-md line-clamp-3"
              >
                {currentHero.description}
              </motion.p>

              <motion.div
                key={`${currentHero.id}-btns`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="flex flex-wrap items-center gap-3 sm:gap-4"
              >
                <PrimaryButton
                  onClick={() => handleStreamNowClick(currentHero.id)}
                  style={{ backgroundColor: primaryRed }}
                >
                  View Work
                </PrimaryButton>
                <SecondaryButton
                  onClick={handleWatchLaterClick}
                  className="!bg-white/10 !border-white/30 !text-white backdrop-blur-md hover:!bg-white/20"
                >
                  Bookmark
                </SecondaryButton>
              </motion.div>

              <div className="mt-4 flex items-center gap-3 md:hidden">
                <div className="bg-black/40 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-md">
                  <p className="font-['Poppins'] font-bold text-white text-xs">{currentHero.genre}</p>
                </div>
                <div className="px-3 py-1.5 rounded-md bg-gray-800/80 backdrop-blur-md border border-white/20">
                  <p className="font-['Poppins'] font-bold text-white text-xs">{currentHero.ageRating}</p>
                </div>
              </div>
            </div>

            <div className="hidden md:flex absolute right-6 bottom-24 items-center gap-4">
              <div className="bg-black/40 backdrop-blur-md border border-white/20 px-4 py-2 rounded-md">
                <p className="font-['Poppins'] font-bold text-white text-sm">{currentHero.genre}</p>
              </div>
              <div className="px-4 py-2 rounded-md bg-gray-800/80 backdrop-blur-md border border-white/20">
                <p className="font-['Poppins'] font-bold text-white text-sm">{currentHero.ageRating}</p>
              </div>
            </div>

            {/* Dot Navigation */}
            {displayHeroContent.length > 1 && (
              <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex gap-3">
                {displayHeroContent.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`transition-all duration-300 ${currentSlide === index
                      ? 'w-10 h-1.5 bg-white rounded-full'
                      : 'w-2 h-1.5 bg-white/40 rounded-full hover:bg-white/70'
                      }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Hero Arrows — aligned with content container edges, vertically centered on image */}
          {displayHeroContent.length > 1 && (
            <>
              <button
                onClick={() => setCurrentSlide((currentSlide - 1 + displayHeroContent.length) % displayHeroContent.length)}
                className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/40 backdrop-blur-md border border-white/20 rounded-full items-center justify-center transition-all duration-200 opacity-100 hover:bg-black/60"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>

              <button
                onClick={() => setCurrentSlide((currentSlide + 1) % displayHeroContent.length)}
                className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/40 backdrop-blur-md border border-white/20 rounded-full items-center justify-center transition-all duration-200 opacity-100 hover:bg-black/60"
                aria-label="Next slide"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </>
          )}
        </section>
      )}

      {/* Main Categories - Horizontal Scrolling */}
      <main className="pb-16">

        {/* Spotlight Section */}
        <section className="w-full max-w-[min(1200px,calc(100vw-48px))] mx-auto px-4 lg:px-8 py-10 lg:py-16 grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-stretch border-b border-[#E5E7EB] dark:border-gray-800 mb-16">
          {/* Left: Featured Image (Span 8 — slightly wider) */}
          <div className="md:col-span-8">
            {!highlightedVideo ? (
              <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-400">
                No videos available
              </div>
            ) : (
              <div
                className="relative aspect-video w-full overflow-hidden rounded-lg shadow-xl cursor-pointer group"
                onClick={() => navigate(`/video/${highlightedVideo.id}`)}
              >
                <img
                  src={highlightedVideo.thumbnail}
                  alt={highlightedVideo.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
              </div>
            )}
          </div>

          {/* Right: Text Block (Span 4 — three-zone flex column) */}
          <div className="md:col-span-4 flex flex-col">

            {/* ── TOP: Tabs + editorial header ── */}
            <div>
              {/* Category Toggle Tabs */}
              <div className="grid grid-cols-3 gap-1.5 mb-5 w-full">
                <button
                  onClick={() => setHighlightCategory('featured')}
                  className={`px-1 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider text-center whitespace-nowrap transition-all ${highlightCategory === 'featured'
                    ? isDark
                      ? 'bg-white/20 text-white border border-white/30'
                      : 'bg-gray-900 text-white border border-gray-900'
                    : isDark
                      ? 'bg-transparent text-gray-500 border border-gray-700 hover:border-gray-500'
                      : 'bg-transparent text-gray-500 border border-gray-300 hover:border-gray-500'
                    }`}
                >
                  Featured
                </button>
                <button
                  onClick={() => setHighlightCategory('liked')}
                  className={`px-1 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider text-center whitespace-nowrap transition-all ${highlightCategory === 'liked'
                    ? isDark
                      ? 'bg-white/20 text-white border border-white/30'
                      : 'bg-gray-900 text-white border border-gray-900'
                    : isDark
                      ? 'bg-transparent text-gray-500 border border-gray-700 hover:border-gray-500'
                      : 'bg-transparent text-gray-500 border border-gray-300 hover:border-gray-500'
                    }`}
                >
                  Most Liked
                </button>
                <button
                  onClick={() => setHighlightCategory('viewed')}
                  className={`px-1 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider text-center whitespace-nowrap transition-all ${highlightCategory === 'viewed'
                    ? isDark
                      ? 'bg-white/20 text-white border border-white/30'
                      : 'bg-gray-900 text-white border border-gray-900'
                    : isDark
                      ? 'bg-transparent text-gray-500 border border-gray-700 hover:border-gray-500'
                      : 'bg-transparent text-gray-500 border border-gray-300 hover:border-gray-500'
                    }`}
                >
                  Most Viewed
                </button>
              </div>

              {highlightedVideo && (
                <>
                  {/* Genre + stat pill */}
                  <span className={`font-['Poppins'] text-[10px] font-bold uppercase tracking-[0.16em] mb-4 block ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                    {(highlightedVideo.genre || "Uncategorized").split(',')[0].trim()} · {categoryLabel}
                  </span>

                  {/* Title */}
                  <h2 className={`font-['Poppins'] font-bold leading-tight mb-4 ${isDark ? "text-white" : "text-gray-900"}`} style={{ fontSize: "clamp(22px, 2.4vw, 32px)" }}>
                    {highlightedVideo.title}
                  </h2>

                  {/* Logline */}
                  <p className={`font-['Poppins'] text-[14px] leading-relaxed mb-6 line-clamp-4 [overflow-wrap:anywhere] ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    {highlightedVideo.logline}
                  </p>

                  {/* ── MIDDLE: Metadata rows — tighter vertical rhythm ── */}
                  <div className="flex-1">
                    {[
                      { label: "Directed by", value: highlightedVideo.director || highlightedVideo.author },
                      { label: "Production", value: "APC School of Multimedia Arts" },
                      ...(highlightedVideo.cast && highlightedVideo.cast.length > 0
                        ? [{ label: "Cast", value: highlightedVideo.cast.slice(0, 2).map((c: any) => c.name).join(", ") }]
                        : [])
                    ].map((row, i) => (
                      <div
                        key={i}
                        className={`flex gap-3 py-[5px] border-b ${isDark ? "border-gray-800" : "border-gray-100"}`}
                      >
                        <span className={`font-['Poppins'] text-[10px] font-bold uppercase tracking-[0.12em] w-[88px] flex-shrink-0 mt-0.5 ${isDark ? "text-gray-600" : "text-gray-400"}`}>
                          {row.label}
                        </span>
                        <span className={`font-['Poppins'] text-[12.5px] leading-snug [overflow-wrap:anywhere] ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* ── BOTTOM: Action button — anchored to column base ── */}
                  <div className="mt-auto pt-6">
                    <PrimaryButton
                      onClick={() =>
                        highlightCategory === 'featured'
                          ? navigate(`/featured/${highlightedVideo.id}`)
                          : navigate(`/video/${highlightedVideo.id}`)
                      }
                      style={{ backgroundColor: primaryRed }}
                    >
                      {highlightCategory === 'featured' ? 'View Page' : 'View Video'}
                    </PrimaryButton>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {categories.length > 0 ? (
          categories.map((category) => {
            const categoryVideos = publishedMedia
              .filter((v) => {
                const genre = (v.genre || "").toLowerCase();
                const categoryName = (category.name || "").toLowerCase();
                const displayLabel = (category.displayLabel || "").toLowerCase();
                return genre.includes(categoryName) || genre.includes(displayLabel);
              })
              .map((m) => ({
                ...m,
                thumbnail: m.posterUrl || '',
                author: m.creator || 'Unknown'
              }));

            if (categoryVideos.length === 0) return null;

            return (
              <HorizontalSection
                key={category.id}
                title={category.displayLabel || category.name}
                description={category.description || `Browse the latest in ${category.displayLabel || category.name}.`}
                videos={categoryVideos}
                isDark={isDark}
                primaryRed={primaryRed}
                navigate={navigate}
              />
            );
          })
        ) : (
          <>
            <HorizontalSection
              title="Animation"
              description="Frame-by-frame storytelling pushing the boundaries of motion."
              videos={publishedMedia.length > 0 ? publishedMedia.filter(v => (v.genre || "").toLowerCase().includes('animation')).map(m => ({ ...m, thumbnail: m.posterUrl, author: m.creator })) : createDemoVideos(videoData.animation, 'anim')}
              isDark={isDark}
              primaryRed={primaryRed}
              navigate={navigate}
            />

            <HorizontalSection
              title="Film & Narrative"
              description="Narrative works that capture the human experience through the lens."
              videos={publishedMedia.length > 0 ? publishedMedia.filter(v => {
                const g = (v.genre || "").toLowerCase();
                return g.includes('film') || g.includes('narrative') || g.includes('experimental') || g.includes('drama') || g.includes('live');
              }).map(m => ({ ...m, thumbnail: m.posterUrl, author: m.creator })) : createDemoVideos(videoData.liveAction, 'film')}
              isDark={isDark}
              primaryRed={primaryRed}
              navigate={navigate}
            />

            <HorizontalSection
              title="Documentary"
              description="Real stories, real people, unveiling the truth of our world."
              videos={publishedMedia.length > 0 ? publishedMedia.filter(v => (v.genre || "").toLowerCase().includes('documentary')).map(m => ({ ...m, thumbnail: m.posterUrl, author: m.creator })) : createDemoVideos(videoData.documentaries, 'doc')}
              isDark={isDark}
              primaryRed={primaryRed}
              navigate={navigate}
            />
          </>
        )}

        {/* Catch-all for other works if they haven't been shown in any dynamic or hardcoded category */}
        {publishedMedia.length > 0 && (() => {
          const shownIds = new Set();

          // Track what's already shown
          if (categories.length > 0) {
            categories.forEach(cat => {
              const name = (cat.name || "").toLowerCase();
              const label = (cat.displayLabel || "").toLowerCase();
              publishedMedia.forEach(v => {
                const g = (v.genre || "").toLowerCase();
                if (g.includes(name) || g.includes(label)) shownIds.add(v.id);
              });
            });
          } else {
            // Hardcoded categories tracking
            const keywords = ['animation', 'film', 'narrative', 'documentary', 'experimental', 'drama', 'live'];
            publishedMedia.forEach(v => {
              const g = (v.genre || "").toLowerCase();
              if (keywords.some(k => g.includes(k))) shownIds.add(v.id);
            });
          }

          const otherVideos = publishedMedia
            .filter(v => !shownIds.has(v.id))
            .map(m => ({ ...m, thumbnail: m.posterUrl || '', author: m.creator || 'Unknown' }));

          if (otherVideos.length === 0) return null;

          return (
            <HorizontalSection
              title="More Works"
              description="Explore more unique projects from our creative students."
              videos={otherVideos}
              isDark={isDark}
              primaryRed={primaryRed}
              navigate={navigate}
            />
          );
        })()}
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
