import { useState, useEffect, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

export interface PublicAnnouncement {
  id: string;
  title: string;
  description: string;
  kind: "event" | "update" | "announcement" | "deadline" | "general";
  updated_at?: string;
}

export function usePublicAnnouncements() {
  const [announcements, setAnnouncements] = useState<PublicAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("announcements")
      .select("id, title, description, kind, updated_at")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(10);

    setAnnouncements(
      (data ?? []).map((r: any) => ({
        id: String(r.id),
        title: r.title ?? "",
        description: r.description ?? "",
        kind: r.kind ?? "announcement",
        updated_at: r.updated_at ?? undefined,
      }))
    );
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { announcements, loading };
}
