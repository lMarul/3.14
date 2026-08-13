import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Clock, Calendar, Bell, Megaphone, X } from "lucide-react";
import { usePublicAnnouncements, PublicAnnouncement } from "../../hooks/usePublicAnnouncements";

// Verbatim copy of admin's getIcon() (AdminAnnouncements.tsx lines 269-276)
const getIcon = (kind: string) => {
  switch (kind) {
    case "deadline": return <Clock     size={20} className="text-[#991B1B]" />;
    case "event":    return <Calendar  size={20} className="text-[#991B1B]" />;
    case "update":   return <Bell      size={20} className="text-[#991B1B]" />;
    default:         return <Megaphone size={20} className="text-[#991B1B]" />;
  }
};

// Dismiss persistence
const KEY = "lk_dismissed_announcements_v2";
const getDismissedMap = (): Record<string, string> => {
  try { return JSON.parse(localStorage.getItem(KEY) ?? "{}"); } catch { return {}; }
};
const saveDismissed = (id: string, updatedAt?: string) => {
  const map = getDismissedMap();
  map[id] = updatedAt ?? new Date().toISOString();
  localStorage.setItem(KEY, JSON.stringify(map));
};

export function AnnouncementBanner() {
  const { announcements, loading } = usePublicAnnouncements();
  const [dismissedMap, setDismissedMap] = useState<Record<string, string>>({});
  const [exiting,      setExiting]      = useState(false);

  useEffect(() => { setDismissedMap(getDismissedMap()); }, []);

  const active = announcements.filter((a) => {
    const dismissedTime = dismissedMap[a.id];
    if (!dismissedTime) return true;
    if (!a.updated_at) return false;
    return new Date(a.updated_at).getTime() > new Date(dismissedTime).getTime();
  });

  if (loading || active.length === 0) return null;

  const current: PublicAnnouncement = active[0];
  const ghostCount = Math.min(active.length - 1, 2);

  const dismiss = () => { if (!exiting) setExiting(true); };

  const onExitComplete = () => {
    saveDismissed(current.id, current.updated_at);
    setDismissedMap(getDismissedMap());
    setExiting(false);
  };

  // Ghost card visual — mirrors the exact card classes, structure and width
  const GhostCard = ({ offset, scale, opacity }: { offset: number; scale: number; opacity: number }) => (
    <div
      aria-hidden
      className="bg-white border border-[#E6E1DA] rounded-[12px] p-4 flex items-center gap-3 shadow-sm absolute inset-0 pointer-events-none w-full"
      style={{ transform: `translateY(${offset}px) scaleX(${scale})`, transformOrigin: "top center", opacity }}
    />
  );

  return (
    // OUTER wrapper: handles positioning, width (680px), z-index, and ghost cards
    <div
      className="fixed z-[60]"
      style={{ top: 90, right: 24, width: 680, paddingBottom: ghostCount * 6 }}
      aria-live="polite"
    >
      {/* Ghost cards (behind the active card, not interactive) */}
      {ghostCount >= 2 && <GhostCard offset={10} scale={0.92} opacity={0.35} />}
      {ghostCount >= 1 && <GhostCard offset={5}  scale={0.96} opacity={0.60} />}

      {/* Active card */}
      <AnimatePresence mode="popLayout" onExitComplete={onExitComplete}>
        {!exiting && (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0,   transition: { duration: 0.22, ease: "easeOut" } }}
            exit   ={{ opacity: 0, x: 680,  transition: { duration: 0.28, ease: "easeIn"  } }}
            style={{ position: "relative" }}
          >
            {/* INNER card: exact duplicate of admin's card structure, colors, borders, margins and flex alignment */}
            <div className="bg-white border border-[#E6E1DA] rounded-[12px] p-4 flex items-center gap-3 shadow-sm relative w-full">

              {/* Icon box container */}
              <div className="w-10 h-10 rounded-[10px] bg-white border border-gray-100 flex items-center justify-center shrink-0">
                {getIcon(current.kind)}
              </div>

              {/* Text container */}
              <div className="flex flex-col gap-1 overflow-hidden">
                {/* Title */}
                <h4
                  className="text-[#101828] text-[14px] font-bold truncate font-poppins"
                  style={{
                    margin: 0,
                    color: "#101828",
                    fontFamily: "var(--lk-font-primary, 'Poppins', sans-serif)",
                    fontSize: "14px",
                    fontWeight: "700",
                    lineHeight: "24px",
                    letterSpacing: "normal",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {current.title}
                </h4>

                {/* Description */}
                <p
                  className="text-[#4A5565] text-[11px] line-clamp-2 font-poppins"
                  style={{
                    margin: 0,
                    color: "#4A5565",
                    fontFamily: "var(--lk-font-primary, 'Poppins', sans-serif)",
                    fontSize: "11px",
                    fontWeight: "400",
                    lineHeight: "1.5",
                    letterSpacing: "normal",
                  }}
                >
                  {current.description}
                </p>
              </div>

              {/* Dismiss × button — absolutely positioned, does not affect flex flow */}
              <button
                onClick={dismiss}
                aria-label="Dismiss announcement"
                className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors border-none bg-transparent cursor-pointer p-0"
              >
                <X size={13} />
              </button>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AnnouncementBanner;
