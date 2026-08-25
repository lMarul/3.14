import React, {
  useState, useEffect, useMemo, useRef, useLayoutEffect,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "./Logo";
import Group631 from "../../../generated/Group631";
import {
  Search, Settings, LogOut, User, Bookmark, Heart, X, ArrowUpRight, Menu, Clock3, CheckCheck,
} from "lucide-react";
import { useCustomTheme } from "../providers/ThemeContext";
import { useTrapTransition, TrapElement } from "../../context/TrapTransitionContext";
import { motion, AnimatePresence } from "motion/react";
import { BellIcon } from "../common/BellIcon";
import { getAllVideos, videoData } from "../../data/videos";
import type { Video } from "../../data/videos";
import { supabase } from "../../lib/supabase";
import { clearAuthStorage } from "../../lib/authStorage";

type NavbarNotification = {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  dotColor: string;
  isRead: boolean;
};

function relativeTime(value: string) {
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} minute${mins > 1 ? "s" : ""} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SEARCH_W = 480; // px — wider when nav is hidden in Search Focus Mode
const SEARCH_W_SM = 340; // px — narrower for laptop screens

const CAT_META: { key: string; label: string }[] = [
  { key: "animation",     label: "Animation"   },
  { key: "liveAction",    label: "Film"         },
  { key: "documentaries", label: "Documentary"  },
];

const GENRE_TAGS = [
  "Animation", "Drama", "Horror", "Documentary",
  "Fantasy", "Romance", "Action", "Thriller", "Comedy",
];

// ─── Highlight matched text ───────────────────────────────────────────────────

function Highlight({ text, query, color }: { text: string; query: string; color: string }) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <span style={{ color }} className="font-bold">{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

export function Navbar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { triggerTrap } = useTrapTransition();
  const { theme, resolvedTheme } = useCustomTheme();
  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const isDim = currentTheme === 'dim';
  const isLightsOut = currentTheme === 'lights-out';
  const isDark = isDim || isLightsOut;
  const primaryRed = isDark ? "#ff4b4b" : "#8a181a";

  // ── UI state ─────────────────────────────────────────────────────────────
  const [showProfileMenu,   setShowProfileMenu]   = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [isGuest,           setIsGuest]           = useState(false);
  const [isSearchOpen,      setIsSearchOpen]      = useState(false);
  const [searchInput,       setSearchInput]       = useState("");
  const [showMobileMenu,    setShowMobileMenu]    = useState(false);
  const [isMobile,          setIsMobile]          = useState(false);
  const [notifications,     setNotifications]     = useState<NavbarNotification[]>([]);

  const isLaptop = typeof window !== 'undefined' && window.innerWidth <= 1280;
  const searchWidth = isMobile ? 180 : isLaptop ? SEARCH_W_SM : SEARCH_W;

  // ── Refs ─────────────────────────────────────────────────────────────────
  const headerRef       = useRef<HTMLElement>(null);
  const inputRef        = useRef<HTMLInputElement>(null);
  // Wrapper around the expanding input — used to anchor the dropdown
  const searchWrapperRef = useRef<HTMLDivElement>(null);
  // Computed dropdown left offset (px from header left edge)
  const [dropdownLeft, setDropdownLeft] = useState(0);

  // ── Data ─────────────────────────────────────────────────────────────────
  const allVideos = useMemo(() => getAllVideos(), []);

  const searchResults = useMemo(() => {
    const q = searchInput.trim().toLowerCase();
    if (!q) return null;

    const groups: { label: string; videos: Video[] }[] = [];
    CAT_META.forEach(({ key, label }) => {
      const pool = (videoData as Record<string, Video[]>)[key] ?? [];
      const matched = pool
        .filter(v =>
          v.title.toLowerCase().includes(q) ||
          v.genre.toLowerCase().includes(q) ||
          v.logline.toLowerCase().includes(q)
        )
        .slice(0, 2);
      if (matched.length) groups.push({ label, videos: matched });
    });

    const creators = allVideos
      .filter(v => v.author.toLowerCase().includes(q))
      .slice(0, 2);

    const tags = GENRE_TAGS.filter(g => g.toLowerCase().includes(q));

    const totalResults =
      groups.reduce((s, g) => s + g.videos.length, 0) + creators.length;

    return { groups, creators, tags, totalResults };
  }, [searchInput, allVideos]);

  const showPanel = isSearchOpen && searchInput.trim().length > 0;

  const unreadCount = useMemo(() => notifications.filter(n => !n.isRead).length, [notifications]);

  const loadNotifications = async () => {
    if (!supabase || isGuest) {
      setNotifications([]);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setNotifications([]);
      return;
    }

    const { data, error } = await supabase
      .from("user_notifications")
      .select("id,title,message,type,is_read,created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      setNotifications([]);
      return;
    }

    const mapped = (data ?? []).map((item: any) => ({
      id: String(item.id),
      title: item.title ?? "Notification",
      message: item.message ?? "",
      timestamp: item.created_at ? relativeTime(item.created_at) : "",
      dotColor:
        item.type === "endorsement" ? "bg-green-500" : item.type === "submission" ? "bg-blue-500" : "bg-[#8a181a]",
      isRead: Boolean(item.is_read),
    }));

    setNotifications(mapped);
  };

  const markAllNotificationsAsRead = async () => {
    if (!supabase) return;
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from("user_notifications")
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq("user_id", user.id)
      .eq("is_read", false);

    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  // ── Dropdown position: anchored to input left edge, below header ──────────
  // Runs after each open/resize so the left offset is always exact.
  const recalcDropdown = () => {
    const wrapper = searchWrapperRef.current;
    const header  = headerRef.current;
    if (!wrapper || !header) return;
    const wr = wrapper.getBoundingClientRect();
    const hr = header.getBoundingClientRect();
    setDropdownLeft(wr.left - hr.left);
  };

  // Recalculate once the expansion animation has settled (~200ms)
  useEffect(() => {
    if (!isSearchOpen) return;
    const t = setTimeout(recalcDropdown, 210);
    window.addEventListener("resize", recalcDropdown);
    return () => { clearTimeout(t); window.removeEventListener("resize", recalcDropdown); };
  }, [isSearchOpen]);

  // ── Effects ───────────────────────────────────────────────────────────────
  useEffect(() => {
    setIsGuest(localStorage.getItem("isGuest") === "true");
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [isGuest]);

  useEffect(() => {
    if (showNotifications) {
      loadNotifications();
    }
  }, [showNotifications]);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!showMobileMenu) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showMobileMenu]);

  // Auto-focus after expansion animation
  useEffect(() => {
    if (isSearchOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 220);
      return () => clearTimeout(t);
    }
  }, [isSearchOpen]);

  // ESC closes search
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSearchOpen) closeSearch();
    };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [isSearchOpen]);

  // Click outside header closes search
  useEffect(() => {
    if (!isSearchOpen) return;
    const fn = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node))
        closeSearch();
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [isSearchOpen]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const openSearch = () => {
    setIsSearchOpen(true);
    setShowProfileMenu(false);
    setShowNotifications(false);
    setShowMobileMenu(false);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchInput("");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerTrap('/conf');
    closeSearch();
  };

  const handleResultClick = (id: string) => {
    triggerTrap('/conf');
    closeSearch();
  };

  const handleViewAll = () => {
    triggerTrap('/conf');
    closeSearch();
  };

  const handleNotificationClick = () => {
    if (isGuest) { navigate("/"); return; }
    setShowNotifications(p => !p);
    setShowProfileMenu(false);
    setShowMobileMenu(false);
  };

  const handleProfileClick = () => {
    if (isGuest) { navigate("/"); return; }
    setShowProfileMenu(p => !p);
    setShowNotifications(false);
    setShowMobileMenu(false);
  };

  const closeAccountMenus = () => {
    setShowProfileMenu(false);
    setShowNotifications(false);
  };

  const isActive = (p: string) => location.pathname === p;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-50 w-full border-b shadow-sm transition-colors duration-300 ${
        isLightsOut ? "bg-[#000000] border-gray-900" : isDim ? "bg-[#0F1923] border-[#38444D]" : "bg-white border-gray-200"
      }`}
    >
      {/* ── Header bar ──────────────────────────────────────────────────── */}
      <div className="w-full max-w-[min(1200px,calc(100vw-48px))] mx-auto px-4 sm:px-5 md:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between gap-2 sm:gap-3">

        {/* Left side: mobile menu + logo */}
        <TrapElement delay={0.05} rotate={-14} xDrift={-60}>
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <button
              onClick={() => triggerTrap('/conf')}
              className={`md:hidden p-2 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                isDark ? "hover:bg-white/10 text-white" : "hover:bg-gray-100 text-gray-900"
              }`}
              aria-label="Toggle mobile menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="cursor-pointer" onClick={() => triggerTrap('/conf')}>
              <Logo height={isMobile ? 22 : 28} />
            </div>
          </div>
        </TrapElement>

        {/* Nav — absolutely centred */}
        <TrapElement delay={0.12} rotate={12} xDrift={35} className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.nav
            animate={{
              opacity: isSearchOpen ? 0 : 1,
              y: isSearchOpen ? -6 : 0,
            }}
            transition={{ duration: 0.18, ease: "easeInOut" }}
            style={{ pointerEvents: isSearchOpen ? "none" : "auto" }}
            className="flex items-center gap-8"
          >
            {[
              { label: "Home",       path: "/home" },
            ].map(({ label, path }) => (
              <button
                key={label}
                onClick={() => triggerTrap('/conf')}
                className={`font-['Poppins'] font-semibold text-[14px] whitespace-nowrap transition-colors cursor-pointer ${
                  isActive(path)
                    ? isDark ? "text-white" : "text-gray-900"
                    : isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-black"
                }`}
              >
                {label}
              </button>
            ))}
          </motion.nav>
        </TrapElement>

        {/* ── Right actions: [input] [Search/X] [bell] [profile] ────────── */}
        {/*   The input is the FIRST item so it expands leftward naturally.  */}
        {/*   The Search/X button sits immediately right of the input.       */}
        {/* Right actions */}
        <TrapElement delay={0.20} rotate={-16} xDrift={70}>
          <div className="flex items-center gap-1.5 sm:gap-3 z-10">

          {/*
            ── Search input wrapper ────────────────────────────────────────
            • overflow:hidden clips the motion animation
            • ref used to compute the dropdown's left anchor
            • height fixed at 42px so the surrounding flex row never shifts
          */}
          <div
            ref={searchWrapperRef}
            style={{ height: 42, overflow: "hidden" }}
          >
            <motion.div
              animate={{ width: isSearchOpen ? searchWidth : 0 }}
              initial={{ width: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              style={{ height: 42 }}
            >
              {/* Inner form is always SEARCH_W wide — clipping handles the reveal */}
              <form
                onSubmit={handleSearchSubmit}
                style={{ width: searchWidth, height: 42 }}
                className="relative"
              >
                {/* Search icon inside input (left) */}
                <Search
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}
                />
                <input
                  ref={inputRef}
                  type="text"
                  onChange={e => setSearchInput(e.target.value)}
                  placeholder="Search films, creators, or genres…"
                  style={{ height: 42, width: searchWidth }}
                  className={`pl-9 pr-8 rounded-lg font-['Poppins'] text-[13px] font-medium outline-none border transition-colors ${
                    isLightsOut
                      ? "bg-[#242424] border-gray-700 text-white placeholder-gray-500 focus:border-gray-600"
                      : isDim
                      ? "bg-[#1A2634] border-[#38444D] text-white placeholder-[#6A7282] focus:border-[#364153]"
                      : "bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-300"
                  }`}
                />
                {/* Clear X inside input (right edge) */}
                <AnimatePresence>

                <AnimatePresence>
                  {(showNotifications || showProfileMenu || showNotificationsModal) && (
                    <motion.button
                      type="button"
                      aria-label="Close account menus"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.12 }}
                      className="fixed inset-0 z-[45] bg-transparent"
                      onClick={() => {
                        closeAccountMenus();
                        setShowNotificationsModal(false);
                      }}
                    />
                  )}
                </AnimatePresence>
                  {searchInput && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.6 }}
                      transition={{ duration: 0.12 }}
                      type="button"
                      onClick={() => triggerTrap('/conf')}
                      className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full transition-colors cursor-pointer ${
                        isDark
                          ? "hover:bg-white/10 text-gray-500"
                          : "hover:bg-gray-200 text-gray-400"
                      }`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
          </div>

          {/* ── Search / Close toggle button ──────────────────────────────
              Sits immediately to the right of the input (gap-3 = 12px).
              Animates between Search ↔ X icon.
          ─────────────────────────────────────────────────────────────── */}
          <button
            onClick={() => triggerTrap('/conf')}
            className={`p-2 sm:p-2.5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer ${
              isDark ? "hover:bg-white/10 text-white" : "hover:bg-gray-100 text-gray-900"
            }`}
            aria-label="Search"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key="s"
                initial={{ rotate: 45,  opacity: 0 }}
                animate={{ rotate: 0,   opacity: 1 }}
                exit={{ rotate: -45,   opacity: 0 }}
                transition={{ duration: 0.14 }}
              >
                <Search className="w-[22px] h-[22px]" />
              </motion.span>
            </AnimatePresence>
          </button>

          {/* ── Bell ──────────────────────────────────────────────────── */}
          <div className="relative">
            <button
              onClick={() => triggerTrap('/conf')}
              className={`p-2.5 rounded-full transition-colors relative cursor-pointer ${
                isDark ? "hover:bg-white/10 text-white" : "hover:bg-gray-100 text-gray-900"
              }`}
            >
              <BellIcon className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#ff4b4b] rounded-full border-2 border-white dark:border-[#121212]" />
            </button>
          </div>

          {/* ── Profile ───────────────────────────────────────────────── */}
          <div className="relative">
            <button
              onClick={() => triggerTrap('/conf')}
              className={`p-2.5 rounded-full transition-colors flex items-center justify-center cursor-pointer ${
                isDark ? "hover:bg-white/10" : "hover:bg-gray-100"
              }`}
            >
              <div className="w-5 h-5 sm:w-[22px] sm:h-[22px]"><Group631 color={isDark ? "#F5F5F5" : "black"} /></div>
            </button>
          </div>
        </div>
      </TrapElement>
    </div>

      {/*
        ── Search Results Dropdown ─────────────────────────────────────────────
        • `absolute` child of the `sticky` header — positions below header bottom
        • left offset calculated from the search input's rect vs header rect
        • width = SEARCH_W (exactly matches the input)
        • 10px gap between header bottom and dropdown top (top: calc(100% + 10px))
      ─────────────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showPanel && searchResults && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            style={{
              position: "absolute",
              top: "calc(100% + 10px)",
              left: dropdownLeft,
              width: searchWidth,
              zIndex: 60,
            }}
          >
            {/* ── Panel card ─────────────────────────────────────────────── */}
            <div
              className={`rounded-xl border overflow-hidden flex flex-col ${
                isLightsOut ? "bg-[#000000] border-gray-900" : isDim ? "bg-[#1E2A36] border-[#38444D]" : "bg-white border-gray-200"
              }`}
              style={{
                maxHeight: 380,
                boxShadow: isDark
                  ? "0 16px 48px -8px rgba(0,0,0,0.8), 0 4px 16px -4px rgba(0,0,0,0.5)"
                  : "0 16px 48px -8px rgba(0,0,0,0.14), 0 4px 16px -4px rgba(0,0,0,0.08)",
              }}
            >
              {/* ── Scrollable results area ── */}
              <div className="overflow-y-auto flex-1">

                {searchResults.totalResults === 0 && searchResults.tags.length === 0 ? (
                  /* Empty state */
                  <div className={`px-5 py-5 font-['Poppins'] text-[13px] ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                    No results for{" "}
                    <span className={`font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      "{searchInput.trim()}"
                    </span>
                  </div>
                ) : (
                  <>
                    {/* Category groups */}
                    {searchResults.groups.map((group, gi) => (
                      <div key={group.label}>
                        {/* Section label — 16px left padding to match result rows */}
                        <div className={`px-4 pt-3 pb-1.5 ${gi > 0 ? `border-t ${isDark ? "border-gray-800" : "border-gray-100"}` : ""}`}>
                          <span className={`font-['Poppins'] text-[10px] font-bold uppercase tracking-[0.18em] ${isDark ? "text-gray-600" : "text-gray-400"}`}>
                            {group.label}
                          </span>
                        </div>

                        {/* Result rows */}
                        {group.videos.map(video => (
                          <button
                            key={video.id}
                            onClick={() => handleResultClick(video.id)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors group ${
                              isDark ? "hover:bg-white/[0.05]" : "hover:bg-gray-50"
                            }`}
                          >
                            {/* Thumbnail — 48×48 square */}
                            <div
                              className={`flex-shrink-0 w-12 h-12 rounded-md overflow-hidden ${
                                isDark ? "bg-gray-800" : "bg-gray-100"
                              }`}
                            >
                              <img
                                src={video.thumbnail}
                                alt={video.title}
                                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                                onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                              />
                            </div>
                            {/* Title + meta */}
                            <div className="flex-1 min-w-0">
                              <p className={`font-['Poppins'] font-semibold text-[13px] leading-snug line-clamp-1 transition-colors ${
                                isDark
                                  ? "text-gray-200 group-hover:text-white"
                                  : "text-gray-800 group-hover:text-gray-900"
                              }`}>
                                <Highlight text={video.title} query={searchInput.trim()} color={primaryRed} />
                              </p>
                              <p className={`font-['Poppins'] text-[10px] mt-0.5 uppercase tracking-wide ${isDark ? "text-gray-600" : "text-gray-400"}`}>
                                {video.genre.split(",")[0].trim()} · {video.releaseDate.split("-")[0]}
                              </p>
                            </div>
                            <ArrowUpRight
                              className="flex-shrink-0 w-3.5 h-3.5 opacity-0 group-hover:opacity-40 transition-opacity"
                              style={{ color: primaryRed }}
                            />
                          </button>
                        ))}
                      </div>
                    ))}

                    {/* Creators */}
                    {searchResults.creators.length > 0 && (
                      <div className={`border-t ${isDark ? "border-gray-800" : "border-gray-100"}`}>
                        <div className="px-4 pt-3 pb-1.5">
                          <span className={`font-['Poppins'] text-[10px] font-bold uppercase tracking-[0.18em] ${isDark ? "text-gray-600" : "text-gray-400"}`}>
                            Creators
                          </span>
                        </div>
                        {searchResults.creators.map(video => (
                          <button
                            key={`cr-${video.id}`}
                            onClick={() => handleResultClick(video.id)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors group ${
                              isDark ? "hover:bg-white/[0.05]" : "hover:bg-gray-50"
                            }`}
                          >
                            <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
                              <User className={`w-5 h-5 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`font-['Poppins'] font-semibold text-[13px] leading-snug line-clamp-1 transition-colors ${
                                isDark
                                  ? "text-gray-200 group-hover:text-white"
                                  : "text-gray-800 group-hover:text-gray-900"
                              }`}>
                                <Highlight text={video.author.split("|")[0].trim()} query={searchInput.trim()} color={primaryRed} />
                              </p>
                              <p className={`font-['Poppins'] text-[10px] mt-0.5 ${isDark ? "text-gray-600" : "text-gray-400"}`}>
                                {video.role}
                              </p>
                            </div>
                            <ArrowUpRight
                              className="flex-shrink-0 w-3.5 h-3.5 opacity-0 group-hover:opacity-40 transition-opacity"
                              style={{ color: primaryRed }}
                            />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Genre suggestion pills */}
                    {searchResults.tags.length > 0 && (
                      <div className={`border-t px-4 pt-3 pb-4 ${isDark ? "border-gray-800" : "border-gray-100"}`}>
                        <p className={`font-['Poppins'] text-[10px] font-bold uppercase tracking-[0.18em] mb-2.5 ${isDark ? "text-gray-600" : "text-gray-400"}`}>
                          Suggestions
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {searchResults.tags.map(tag => (
                            <button
                              key={tag}
                              onClick={() => { triggerTrap('/conf'); closeSearch(); }}
                              className={`px-3 py-1 rounded-full font-['Poppins'] text-[11px] font-semibold transition-colors border ${
                                isDark
                                  ? "border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200 hover:bg-white/5"
                                  : "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-800 hover:bg-gray-50"
                              }`}
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>{/* end scroll */}

              {/* ── Panel footer — always visible, not scrolled ── */}
              {searchResults.totalResults > 0 && (
                <div className={`flex-shrink-0 border-t flex items-center justify-between px-4 py-2.5 ${
                  isLightsOut ? "border-gray-900 bg-[#000000]" : isDim ? "border-[#38444D] bg-[#0F1923]" : "border-gray-100 bg-gray-50"
                }`}>
                  <span className={`font-['Poppins'] text-[10px] ${isDark ? "text-gray-700" : "text-gray-400"}`}>
                    {searchResults.totalResults} match{searchResults.totalResults !== 1 ? "es" : ""}
                  </span>
                  <button
                    onClick={handleViewAll}
                    className={`font-['Poppins'] text-[11px] font-bold flex items-center gap-1 transition-colors group/va ${
                      isDark ? "text-gray-500 hover:text-white" : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    View all results
                    <ArrowUpRight
                      className="w-3 h-3 transition-transform group-hover/va:translate-x-px group-hover/va:-translate-y-px"
                      style={{ color: primaryRed }}
                    />
                  </button>
                </div>
              )}
            </div>{/* end panel card */}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNotificationsModal && (
          <>
            <motion.button
              type="button"
              aria-label="Close notifications modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.14 }}
              className="fixed inset-0 z-[80] bg-black/35"
              onClick={() => setShowNotificationsModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="fixed inset-0 z-[81] flex items-start justify-center px-3 pt-20 sm:px-6"
            >
              <div className={`w-full max-w-[980px] rounded-2xl border shadow-2xl overflow-hidden ${
                isLightsOut ? "bg-[#000000] border-[#2a2a2a]" : isDim ? "bg-[#15202B] border-[#38444D]" : "bg-white border-gray-200"
              }`}>
                <div className={`px-5 py-4 border-b flex items-center justify-between ${isLightsOut ? "border-[#2a2a2a]" : isDim ? "border-[#364153]" : "border-gray-200"}`}>
                  <div>
                    <h2 className={`font-['Poppins'] text-[30px] leading-tight font-bold ${isDark ? "text-white" : "text-[#001235]"}`}>Notifications</h2>
                    <p className={`font-['Poppins'] text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      Stay updated with your submissions, endorsements, and publication alerts.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 font-['Poppins'] text-xs font-bold text-amber-800">
                      {unreadCount} New
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowNotificationsModal(false)}
                      className={`p-2 rounded-full transition-colors ${isDark ? "hover:bg-white/10 text-gray-300" : "hover:bg-gray-100 text-gray-600"}`}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="max-h-[60vh] overflow-y-auto px-5 py-4 space-y-2">
                  {notifications.length === 0 ? (
                    <div className={`rounded-xl border p-4 ${isLightsOut ? "border-[#2a2a2a] bg-[#000000]" : isDim ? "border-[#38444D] bg-[#1E2A36]" : "border-gray-200 bg-gray-50"}`}>
                      <p className="font-['Poppins'] text-sm">No notifications yet.</p>
                    </div>
                  ) : notifications.map((item) => (
                    <article
                      key={item.id}
                      className={`rounded-xl border p-4 transition-colors ${
                        isLightsOut ? "border-[#2a2a2a] bg-[#000000] hover:bg-[#000000]" : isDim ? "border-[#38444D] bg-[#1E2A36] hover:bg-[#253341]" : "border-gray-200 bg-gray-50 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className={`mt-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full ${item.dotColor}`} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <h3 className={`font-['Poppins'] text-base font-bold ${isDark ? "text-gray-100" : "text-gray-800"}`}>{item.title}</h3>
                            {!item.isRead && (
                              <span className="rounded-full bg-amber-100 px-2 py-0.5 font-['Poppins'] text-[10px] font-bold uppercase tracking-wide text-amber-800">
                                New
                              </span>
                            )}
                          </div>
                          <p className={`mt-1 font-['Poppins'] text-sm leading-relaxed ${isDark ? "text-gray-300" : "text-gray-600"}`}>{item.message}</p>
                          <p className={`mt-2 font-['Poppins'] text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>{item.timestamp}</p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                <div className={`px-5 py-4 border-t flex justify-end ${isDark ? "border-[#2a2a2a]" : "border-gray-200"}`}>
                  <button
                    type="button"
                    onClick={markAllNotificationsAsRead}
                    className="inline-flex items-center gap-2 rounded-md bg-[#8a181a] px-4 py-2 font-['Poppins'] text-sm font-semibold text-white hover:bg-[#6f1315]"
                  >
                    <CheckCheck className="h-4 w-4" />
                    Mark all as read
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMobileMenu && (
          <>
            <button
              type="button"
              aria-label="Close mobile menu"
              className="md:hidden fixed inset-0 z-[69] bg-transparent"
              onClick={() => setShowMobileMenu(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className={`md:hidden fixed top-[56px] left-0 right-0 z-[70] border-b shadow-lg ${isLightsOut ? "bg-[#000000] border-gray-900" : isDim ? "bg-[#0F1923] border-gray-800" : "bg-white border-gray-200"}`}
            >
              <div className="px-4 py-2 flex flex-col">
                {[
                  { label: "Home",       path: "/home" },
                ].map(({ label, path }) => (
                  <button
                    key={label}
                    onClick={() => {
                      navigate(path);
                      setShowMobileMenu(false);
                    }}
                    className={`w-full text-left py-3 font-['Poppins'] font-semibold text-[14px] transition-colors ${
                      isActive(path)
                        ? isDark ? "text-white" : "text-gray-900"
                        : isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-black"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
