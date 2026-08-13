import { useEffect, useMemo, useState } from "react";
import { CheckCheck, Dot, Filter, Search } from "lucide-react";
import { Navbar } from "../components/layout/Navbar";
import { SiteFooter } from "../components/layout/SiteFooter";
import { useCustomTheme } from "../components/providers/ThemeContext";
import { supabase } from "../lib/supabase";
import { CustomDropdown } from "../components/common/CustomDropdown";

type NotificationCategory = "submission" | "endorsement" | "publication";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isNew: boolean;
  category: NotificationCategory;
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

function categoryDotClass(category: NotificationCategory) {
  if (category === "submission") return "bg-blue-500";
  if (category === "endorsement") return "bg-green-500";
  return "bg-[#8a181a]";
}

export default function NotificationsPage() {
  const { theme, resolvedTheme } = useCustomTheme();
  const currentTheme = resolvedTheme || theme;
  const isDim = currentTheme === 'dim';
  const isLightsOut = currentTheme === 'lights-out';
  const isDark = isDim || isLightsOut;

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | NotificationCategory>("all");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      if (!supabase) {
        setNotifications([]);
        setIsLoading(false);
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setNotifications([]);
        setIsLoading(false);
        return;
      }

      const { data } = await supabase
        .from("user_notifications")
        .select("id,title,message,type,is_read,created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      const mapped: NotificationItem[] = (data ?? []).map((item: any) => {
        const type = (item.type ?? "") as string;
        const category: NotificationCategory =
          type === "endorsement" ? "endorsement" : type === "submission" ? "submission" : "publication";

        return {
          id: String(item.id),
          title: item.title ?? "Notification",
          message: item.message ?? "",
          timestamp: item.created_at ? relativeTime(item.created_at) : "",
          isNew: !item.is_read,
          category,
        };
      });

      setNotifications(mapped);
      setIsLoading(false);
    };

    run();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return notifications.filter((item) => {
      const byFilter = filter === "all" ? true : item.category === filter;
      const searchable = `${item.title} ${item.message}`.toLowerCase();
      const byQuery = q ? searchable.includes(q) : true;
      return byFilter && byQuery;
    });
  }, [notifications, query, filter]);

  const unreadCount = notifications.filter((item) => item.isNew).length;

  const cardClass = isLightsOut ? "rounded-2xl border border-[#2a2a2a] bg-[#000000]" : isDim ? "rounded-2xl border border-[#38444D] bg-[#253341]" : "rounded-2xl border border-gray-200 bg-white shadow-sm";

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isLightsOut ? "bg-[#000000] text-white" : isDim ? "bg-[#15202B] text-white" : "bg-[#f5f5f5] text-gray-900"}`}>
      <Navbar />

      <main className="w-full max-w-[980px] mx-auto px-3 sm:px-5 md:px-6 lg:px-8 py-6 md:py-10">
        <section className={`${cardClass} p-4 sm:p-5 md:p-6`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-['Poppins'] text-2xl font-bold">Notifications</h1>
              <p className={`font-['Poppins'] text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                Stay updated with your submissions, endorsements, and publication alerts.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 self-start rounded-full bg-amber-100 px-3 py-1">
              <Dot className="h-4 w-4 text-amber-700" />
              <span className="font-['Poppins'] text-xs font-bold text-amber-800">{unreadCount} New</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-[1fr_220px] gap-3">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search notifications"
                className={`h-10 w-full rounded-md border pl-9 pr-3 font-['Poppins'] text-sm outline-none ${isLightsOut ? "bg-[#111111] border-[#2f2f2f] text-white placeholder:text-gray-500" : isDim ? "bg-[#1A2634] border-[#38444D] text-white placeholder:text-[#6A7282]" : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"}`}
              />
            </div>

            <div className="relative">
              <Filter className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 z-10 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
              <CustomDropdown
                value={filter}
                onChange={(val) => setFilter(val as "all" | NotificationCategory)}
                options={[
                  { value: "all", label: "All Types" },
                  { value: "submission", label: "Submission" },
                  { value: "endorsement", label: "Endorsement" },
                  { value: "publication", label: "Publication" },
                ]}
                placeholder="All Types"
                isFullWidth
                size="sm"
                buttonClassName="pl-9"
              />
            </div>
          </div>

          <div className="mt-5 space-y-2">
            {isLoading ? (
              <div className={`rounded-xl border p-4 ${isLightsOut ? "border-[#2a2a2a] bg-[#000000]" : isDim ? "border-[#38444D] bg-[#1E2A36]" : "border-gray-200 bg-gray-50"}`}>
                <p className="font-['Poppins'] text-sm">Loading notifications...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className={`rounded-xl border p-4 ${isLightsOut ? "border-[#2a2a2a] bg-[#000000]" : isDim ? "border-[#38444D] bg-[#1E2A36]" : "border-gray-200 bg-gray-50"}`}>
                <p className="font-['Poppins'] text-sm">No notifications matched your current filter/search.</p>
              </div>
            ) : (
              filtered.map((item) => (
                <article
                  key={item.id}
                  className={`rounded-xl border p-4 transition-colors ${
                    isLightsOut ? "border-[#2a2a2a] bg-[#000000] hover:bg-[#000000]" : isDim ? "border-[#38444D] bg-[#1E2A36] hover:bg-[#253341]" : "border-gray-200 bg-gray-50 hover:bg-white"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`mt-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full ${categoryDotClass(item.category)}`} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <h2 className={`font-['Poppins'] text-base font-bold ${isDark ? "text-gray-100" : "text-gray-800"}`}>{item.title}</h2>
                        {item.isNew && (
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
              ))
            )}
          </div>

          <div className="mt-5 flex justify-end">
            <button
              type="button"
                onClick={async () => {
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

                  setNotifications((prev) => prev.map((n) => ({ ...n, isNew: false })));
                }}
              className="inline-flex items-center gap-2 rounded-md bg-[#8a181a] px-4 py-2 font-['Poppins'] text-sm font-semibold text-white hover:bg-[#6f1315]"
            >
              <CheckCheck className="h-4 w-4" />
              Mark all as read
            </button>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
