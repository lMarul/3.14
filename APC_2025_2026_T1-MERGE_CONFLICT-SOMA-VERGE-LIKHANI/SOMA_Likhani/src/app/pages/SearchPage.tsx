import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search as SearchIcon, ChevronDown, ArrowUpRight } from "lucide-react";
import { usePublishedMedia } from "../hooks/useLikhaniData";
import { VideoCard } from "../components/media/VideoCard";
import { Navbar } from "../components/layout/Navbar";
import { PageContainer } from "../components/layout/PageContainer";
import { SiteFooter } from "../components/layout/SiteFooter";
import { useCustomTheme } from "../components/providers/ThemeContext";
import { motion, AnimatePresence } from "motion/react";

// ─── Types ───────────────────────────────────────────────────────────────────

type SortKey = "most-viewed" | "most-liked" | "recent";
type CategoryKey = "All" | "Animation" | "Film" | "Documentary";

interface CategorySection {
  key: string;
  label: CategoryKey;
  description: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORY_SECTIONS: CategorySection[] = [
  {
    key: "animation",
    label: "Animation",
    description: "Animated short films, motion graphics, and visual storytelling works.",
  },
  {
    key: "liveAction",
    label: "Film",
    description: "Live-action short films and narrative cinema projects.",
  },
  {
    key: "documentaries",
    label: "Documentary",
    description: "Documentary works exploring real-world subjects and cultural narratives.",
  },
];

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "most-viewed", label: "Most Viewed" },
  { key: "most-liked",  label: "Most Liked"  },
  { key: "recent",      label: "Recent"      },
];

const CATEGORY_TABS: CategoryKey[] = ["All", "Animation", "Film", "Documentary"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCategory(genre: string) {
  return genre ? genre.split(",")[0].trim() : "Uncategorized";
}

function getYear(date: string) {
  return date ? date.split("-")[0] : "2026";
}

function sortVideos(videos: any[], sort: SortKey) {
  const copy = [...videos];
  if (sort === "most-viewed") return copy.sort((a, b) => b.views - a.views);
  if (sort === "most-liked")  return copy.sort((a, b) => b.likes - a.likes);
  if (sort === "recent")
    return copy.sort(
      (a, b) => new Date(b.releaseDate || 0).getTime() - new Date(a.releaseDate || 0).getTime()
    );
  return copy;
}

// ─── SortDropdown ─────────────────────────────────────────────────────────────

function SortDropdown({
  value,
  onChange,
  isDark,
}: {
  value: SortKey;
  onChange: (v: SortKey) => void;
  isDark: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = SORT_OPTIONS.find((o) => o.key === value)!;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((p) => !p)}
        className={`flex items-center gap-2 px-4 py-2 rounded-full border font-['Poppins'] text-sm font-medium transition-colors ${
          isDark
            ? "border-gray-700 text-gray-300 hover:border-gray-500 bg-transparent"
            : "border-gray-300 text-gray-700 hover:border-gray-400 bg-white"
        }`}
      >
        <span>{current.label}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className={`absolute right-0 top-full mt-2 w-44 rounded-xl border shadow-xl z-40 overflow-hidden ${
              isLightsOut ? "bg-[#000000] border-gray-700" : isDim ? "bg-[#253341] border-gray-700" : "bg-white border-gray-200"
            }`}
          >
            {SORT_OPTIONS.map((opt) => {
              const isSelected = opt.key === value;
              const optionTextClass = isSelected
                ? isDark
                  ? "text-[#ff4b4b] bg-[#ff4b4b]/10 font-bold"
                  : "text-[#8a181a] bg-[#8a181a]/5 font-bold"
                : isDark
                ? "text-gray-400 hover:text-white hover:bg-white/5"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50";

              return (
                <button
                  key={opt.key}
                  onClick={() => { onChange(opt.key); setOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 font-['Poppins'] text-sm transition-colors cursor-pointer ${optionTextClass}`}
                >
                  {opt.label}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── CategorySectionBlock ─────────────────────────────────────────────────────

function CategorySectionBlock({
  section,
  videos,
  isDark,
  primaryRed,
  animate,
}: {
  section: CategorySection;
  videos: any[];
  isDark: boolean;
  primaryRed: string;
  animate: boolean;
}) {
  if (videos.length === 0) return null;

  return (
    <motion.section
      initial={animate ? { opacity: 0, y: 16 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mb-16"
    >
      {/* Section header */}
      <div className="mb-8">
        <div className="flex items-baseline gap-4 mb-1">
          <h2
            className={`font-['Poppins'] font-extrabold text-[22px] leading-tight ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {section.label}
          </h2>
          <span
            className={`font-['Poppins'] text-[13px] font-medium px-2.5 py-0.5 rounded-full ${
              isDark ? "bg-white/10 text-gray-400" : "bg-gray-100 text-gray-500"
            }`}
          >
            {videos.length} {videos.length === 1 ? "work" : "works"}
          </span>
        </div>
        <p
          className={`font-['Poppins'] text-[13px] ${
            isDark ? "text-gray-500" : "text-gray-500"
          }`}
        >
          {section.description}
        </p>
        <div className={`mt-4 h-px ${isDark ? "bg-gray-800" : "bg-gray-200"}`} />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            id={video.id}
            title={video.title}
            author={video.creator || video.author}
            thumbnail={video.posterUrl || video.thumbnail}
            duration={video.duration ? `${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}` : undefined}
            videoUrl={video.videoUrl}
            category={getCategory(video.genre)}
            year={getYear(video.releaseDate)}
            description={video.logline}
            stills={video.stills}
          />
        ))}
      </div>
    </motion.section>
  );
}

// ─── EmptyState ───────────────────────────────────────────────────────────────

function EmptyState({
  query,
  isDark,
  primaryRed,
  onBrowse,
}: {
  query: string;
  isDark: boolean;
  primaryRed: string;
  onBrowse: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-28 text-center"
    >
      <div
        className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
          isDark ? "bg-white/5" : "bg-gray-100"
        }`}
      >
        <SearchIcon
          className={`w-9 h-9 ${isDark ? "text-gray-600" : "text-gray-400"}`}
        />
      </div>

      <h3
        className={`font-['Poppins'] font-bold text-[22px] mb-2 ${
          isDark ? "text-white" : "text-gray-900"
        }`}
      >
        No results found
      </h3>
      <p
        className={`font-['Poppins'] text-[14px] max-w-sm leading-relaxed ${
          isDark ? "text-gray-500" : "text-gray-500"
        }`}
      >
        We couldn't find any works matching{" "}
        <span className={`font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>
          "{query}"
        </span>
        . Try different keywords or explore categories.
      </p>

      <button
        onClick={onBrowse}
        className="mt-8 inline-flex items-center gap-2 font-['Poppins'] font-bold text-sm px-8 py-3 rounded-full text-white transition-all hover:scale-105 active:scale-95 shadow-md"
        style={{ backgroundColor: primaryRed }}
      >
        Browse Archive
        <ArrowUpRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SearchPage() {
  const navigate       = useNavigate();
  const [searchParams] = useSearchParams();
  const query          = searchParams.get("q") || "";

  const { theme, resolvedTheme } = useCustomTheme();
  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const isDim = currentTheme === 'dim';
  const isLightsOut = currentTheme === 'lights-out';
  const isDark = isDim || isLightsOut;
  const primaryRed   = isDark ? "#ff4b4b" : "#8a181a";

  const [activeCategory, setActiveCategory] = useState<CategoryKey>("All");
  const [activeSort,     setActiveSort]     = useState<SortKey>("most-viewed");

  // Reset category filter when the query changes
  useEffect(() => {
    setActiveCategory("All");
  }, [query]);

  const { media: allVideos, loading } = usePublishedMedia();

  // Filter by committed query across all videos
  const queryFiltered = useMemo(() => {
    if (!query) return allVideos;
    const q = query.toLowerCase();
    return allVideos.filter(
      (v) =>
        (v.title && v.title.toLowerCase().includes(q)) ||
        (v.creator && v.creator.toLowerCase().includes(q)) ||
        (v.genre && v.genre.toLowerCase().includes(q)) ||
        (v.logline && v.logline.toLowerCase().includes(q))
    );
  }, [allVideos, query]);

  const totalCount = queryFiltered.length;

  // Build grouped results per category section
  const groupedResults = useMemo(() => {
    return CATEGORY_SECTIONS.map((section) => {
      const filtered = queryFiltered.filter((v) => {
        const genre = v.genre?.toLowerCase() || "";
        if (section.key === "animation") return genre.includes("animation");
        if (section.key === "liveAction") return genre.includes("film") || genre.includes("live action");
        if (section.key === "documentaries") return genre.includes("documentary");
        return false;
      });
      if (activeCategory !== "All" && activeCategory !== section.label) {
        return { section, videos: [] };
      }
      return { section, videos: sortVideos(filtered, activeSort) };
    });
  }, [queryFiltered, activeCategory, activeSort]);

  const hasAnyResults = groupedResults.some((g) => g.videos.length > 0);

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isLightsOut ? "bg-[#000000] text-white" : isDim ? "bg-[#15202B] text-white" : "bg-[#f5f5f5] text-gray-900"
      }`}
    >
      <Navbar />

      <PageContainer className="pt-8 pb-24">

        <AnimatePresence mode="wait">
          {/* ── No query: prompt state ──────────────────────────────── */}
          {!query ? (
            <motion.div
              key="prompt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center justify-center py-40 text-center"
            >
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
                  isDark ? "bg-white/5" : "bg-gray-100"
                }`}
              >
                <SearchIcon
                  className={`w-9 h-9 ${isDark ? "text-gray-600" : "text-gray-400"}`}
                />
              </div>
              <p
                className={`font-['Poppins'] text-[15px] max-w-xs leading-relaxed ${
                  isDark ? "text-gray-500" : "text-gray-500"
                }`}
              >
                Start typing in the search bar above to explore the archive.
              </p>
            </motion.div>

          ) : loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-40"
            >
              <div className="animate-pulse font-['Poppins'] font-bold text-xl text-gray-500">
                Searching Likhani...
              </div>
            </motion.div>
          ) : (
            /* ── Has query: controls + results ──────────────────────── */
            <motion.div
              key={`results-${query}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* ── Controls bar ──────────────────────────────────────── */}
              <div className="mb-8">
                {/* Result count */}
                <AnimatePresence mode="wait">
                  <motion.p
                    key={`count-${query}-${totalCount}`}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.18 }}
                    className={`font-['Poppins'] text-[13px] mb-5 ${
                      isDark ? "text-gray-500" : "text-gray-500"
                    }`}
                  >
                    {totalCount > 0 ? (
                      <>
                        <span className="font-semibold" style={{ color: primaryRed }}>
                          {totalCount}
                        </span>{" "}
                        {totalCount === 1 ? "result" : "results"} found for{" "}
                        <span
                          className={`font-semibold ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          "{query}"
                        </span>
                      </>
                    ) : (
                      <>
                        No results for{" "}
                        <span
                          className={`font-semibold ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          "{query}"
                        </span>
                      </>
                    )}
                  </motion.p>
                </AnimatePresence>

                {/* Filter chips + Sort */}
                <div
                  className={`flex items-center justify-between pb-5 border-b ${
                    isDark ? "border-gray-800" : "border-gray-200"
                  }`}
                >
                  {/* Category pills */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {CATEGORY_TABS.map((cat) => {
                      const isActive = activeCategory === cat;
                      return (
                        <button
                          key={cat}
                          onClick={() => setActiveCategory(cat)}
                          className={`px-5 py-2 rounded-full font-['Poppins'] text-[13px] font-semibold transition-all border ${
                            isActive
                              ? "text-white border-transparent shadow-sm scale-[1.02]"
                              : isDark
                              ? "border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200 bg-transparent"
                              : "border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900 bg-white"
                          }`}
                          style={
                            isActive
                              ? { backgroundColor: primaryRed, borderColor: primaryRed }
                              : {}
                          }
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>

                  {/* Sort */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span
                      className={`font-['Poppins'] text-[11px] font-bold uppercase tracking-[0.12em] ${
                        isDark ? "text-gray-600" : "text-gray-400"
                      }`}
                    >
                      Sort by
                    </span>
                    <SortDropdown
                      value={activeSort}
                      onChange={setActiveSort}
                      isDark={isDark}
                    />
                  </div>
                </div>
              </div>

              {/* ── Results ───────────────────────────────────────────── */}
              <AnimatePresence mode="wait">
                {hasAnyResults ? (
                  <motion.div
                    key={`grid-${query}-${activeCategory}-${activeSort}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25 }}
                  >
                    {groupedResults.map(({ section, videos }, idx) => (
                      <CategorySectionBlock
                        key={section.key}
                        section={section}
                        videos={videos}
                        isDark={isDark}
                        primaryRed={primaryRed}
                        animate={idx === 0}
                      />
                    ))}
                  </motion.div>
                ) : (
                  <EmptyState
                    key="empty"
                    query={query}
                    isDark={isDark}
                    primaryRed={primaryRed}
                    onBrowse={() => navigate("/recently-uploaded")}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

      </PageContainer>

      <SiteFooter />
    </div>
  );
}

