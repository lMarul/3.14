import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface SiteConfig {
  hero_title?: string;
  hero_subtitle?: string;
  hero_background_url?: string;
  mission_statement?: string;
  institution_name?: string;
  institution_tagline?: string;
  logo_url?: string;
  team_members?: { name: string; role: string; category?: string }[];
  team_sections?: { 
    id: string; 
    title: string; 
    subtitle?: string; 
    members: { name: string; role: string }[] 
  }[];
  [key: string]: any;
}

export function useSiteConfig(configKey: string) {
  const [config, setConfig] = useState<SiteConfig>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = useCallback(async () => {
    if (!supabase || !isSupabaseConfigured) {
      setError('Supabase not configured');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('site_config')
        .select('config_value')
        .eq('config_key', configKey)
        .maybeSingle();

      if (fetchError) throw fetchError;
      
      setConfig(data?.config_value || {});
    } catch (err: any) {
      console.error(`Failed to load ${configKey} config:`, err);
      setError(err?.message || 'Failed to load configuration');
    } finally {
      setLoading(false);
    }
  }, [configKey]);

  useEffect(() => {
    fetchConfig();

    if (!supabase || !isSupabaseConfigured) return;

    const channel = supabase.channel(`public:site_config:${configKey}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'site_config', filter: `config_key=eq.${configKey}` },
        () => {
          fetchConfig();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchConfig, configKey]);

  return { config, loading, error, refresh: fetchConfig };
}

export interface FeaturedWorkItem {
  id: string; // media_id
  title: string;
  creator: string;
  featureRank: number;
  featureTitle?: string;
  featureSubtitle?: string;
  featureType?: string;
  posterUrl?: string;
  genre?: string;
  ageRating?: string;
}

export function useFeaturedWorks(isCarousel: boolean = true) {
  const [works, setWorks] = useState<FeaturedWorkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorks = useCallback(async () => {
    if (!supabase || !isSupabaseConfigured) {
      setError('Supabase not configured');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('featured_media')
        .select(`
          media_id, feature_rank, feature_title, feature_subtitle, is_carousel, feature_type,
          media_items!inner(title, author_display_name, director_name, genre, age_rating, logline, description,
            media_assets(public_url, asset_kind, is_primary, mime_type)
          )
        `)
        .eq('is_carousel', isCarousel)
        .order('feature_rank', { ascending: true });

      if (fetchError) throw fetchError;

      const formattedWorks = (data ?? [])
        .map((row: any) => {
          const item = row.media_items;
          const assets: any[] = item?.media_assets ?? [];
          
          // Image-only assets (exclude video/audio which can't be used as bg image)
          const imageAssets = assets.filter((a: any) =>
            a.public_url &&
            !['video', 'audio', 'subtitles', 'caption'].includes(a.asset_kind) &&
            (!a.mime_type || a.mime_type.startsWith('image/'))
          );
          
          const stills = assets
            ?.filter((a: any) => a.asset_kind === 'still')
            ?.map((a: any) => a.public_url) ?? [];

          // Priority: poster → thumbnail → primary → cover → any image
          const posterAsset =
            imageAssets.find((a: any) => a.asset_kind === 'poster') ??
            imageAssets.find((a: any) => a.asset_kind === 'thumbnail') ??
            imageAssets.find((a: any) => a.is_primary) ??
            imageAssets.find((a: any) => a.asset_kind === 'cover') ??
            imageAssets.find((a: any) => a.asset_kind === 'image') ??
            imageAssets[0]; // last resort: first image-type asset
          
          return {
            id: row.media_id,
            title: row.feature_title || item?.title || 'Untitled',
            creator: item?.author_display_name || item?.director_name || 'Unknown',
            description: item?.description || '',
            logline: item?.logline || '',
            featureRank: row.feature_rank,
            featureTitle: row.feature_title,
            featureSubtitle: row.feature_subtitle,
            featureType: row.feature_type,
            posterUrl: posterAsset?.public_url ?? null,
            genre: item?.genre || 'Uncategorized',
            ageRating: item?.age_rating || 'General',
            stills,
          };
        })
        .filter((w: any) => {
          // Filter out null / invalid works due to soft-delete
          if (!w.id || (w.title === 'Untitled' && !w.posterUrl)) return false;
          return true;
        });

      setWorks(formattedWorks);
    } catch (err: any) {
      console.error('Failed to load featured works:', err);
      setError(err?.message || 'Failed to load featured works');
    } finally {
      setLoading(false);
    }
  }, [isCarousel]);

  useEffect(() => {
    fetchWorks();

    if (!supabase || !isSupabaseConfigured) return;

    const channel = supabase.channel(`public:featured_media:${isCarousel}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'featured_media' }, () => {
        fetchWorks();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchWorks, isCarousel]);

  return { works, loading, error, refresh: fetchWorks };
}

export interface MediaItem {
  id: string;
  title: string;
  creator: string;
  description?: string;
  logline?: string;
  genre?: string;
  releaseDate?: string;
  posterUrl?: string;
  videoUrl?: string;
  viewCount: number;
  likeCount: number;
  duration?: number;
  ageRating?: string;
}

export function usePublishedMedia() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMedia = useCallback(async () => {
    if (!supabase || !isSupabaseConfigured) {
      setError('Supabase not configured');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('media_items')
        .select(`
          id, title, author_display_name, director_name, description, logline, genre, release_date, age_rating,
          view_count, like_count, duration_seconds,
          media_assets(public_url, asset_kind, is_primary, mime_type)
        `)
        .eq('source', 'likhani')
        .eq('is_published', true)
        .is('deleted_at', null)
        .order('published_at', { ascending: false });

      // TODO: If no media items are returned or video playback fails, verify RLS policies for 'media_items'/'media_assets' 
      // and ensure the storage bucket 'media' has public read access or appropriate policies.

      if (fetchError) throw fetchError;

      const formatted = (data ?? [])
        .filter((row: any) => {
          // Filter out empty placeholder "Untitled" works that have no assets
          const hasAssets = row.media_assets && row.media_assets.length > 0;
          const isPlaceholder = (row.title === 'Untitled' || !row.title) && !hasAssets;
          return !isPlaceholder;
        })
        .map((row: any) => {
          // Find the best possible thumbnail: 
          // 1. Explicit poster/thumbnail kind
          // 2. Primary asset that isn't a video
          const posterAsset = row.media_assets?.find((a: any) => 
            a.asset_kind === 'poster' || 
            a.asset_kind === 'thumbnail' || 
            (a.is_primary && a.asset_kind !== 'video')
          );
          const videoAsset = row.media_assets?.find((a: any) => a.asset_kind === 'video' || a.asset_kind === 'master');
          
          const stills = row.media_assets
            ?.filter((a: any) => a.asset_kind === 'still')
            ?.map((a: any) => a.public_url) ?? [];

          return {
            id: row.id,
            title: row.title || 'Untitled',
            creator: row.author_display_name || row.director_name || 'Unknown',
            description: row.description || '',
            logline: row.logline || '',
            genre: row.genre || 'Uncategorized',
            releaseDate: row.release_date,
            posterUrl: posterAsset?.public_url,
            videoUrl: videoAsset?.public_url,
            videoMimeType: videoAsset?.mime_type,
            viewCount: Number(row.view_count) || 0,
            likeCount: Number(row.like_count) || 0,
            duration: Number(row.duration_seconds) || 0,
            ageRating: row.age_rating || 'General',
            stills,
          };
        });

      setMedia(formatted);
    } catch (err: any) {
      console.error('Failed to load published media:', err);
      setError(err?.message || 'Failed to load published media');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedia();

    if (!supabase || !isSupabaseConfigured) return;

    const channel = supabase.channel('public:media_items')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'media_items' }, () => {
        fetchMedia();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchMedia]);

  return { media, loading, error, refresh: fetchMedia };
}

/**
 * Increments the view count for a media item.
 * Uses a dedicated RPC for atomic increments, falling back to a direct update if needed.
 */
export async function incrementViewCount(mediaId: string) {
  if (!supabase || !isSupabaseConfigured) return;

  try {
    // Try RPC first for atomic update
    const { error: rpcError } = await supabase.rpc('increment_media_view_count', {
      p_media_id: mediaId
    });

    if (rpcError) {
      // Fallback: Fetch then update (not atomic, but works for prototype)
      const { data } = await supabase
        .from('media_items')
        .select('view_count')
        .eq('id', mediaId)
        .single();

      if (data) {
        await supabase
          .from('media_items')
          .update({ view_count: (data.view_count || 0) + 1 })
          .eq('id', mediaId);
      }
    }
  } catch (err) {
    console.error('Failed to increment view count:', err);
  }
}

/**
 * Hook to manage media likes for a specific user.
 */
export function useMediaLikes(mediaId?: string, userId?: string) {
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchLikeStatus = useCallback(async () => {
    if (!supabase || !isSupabaseConfigured || !userId || !mediaId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('media_likes')
        .select('id')
        .eq('user_id', userId)
        .eq('media_id', mediaId)
        .maybeSingle();

      if (error) throw error;
      setIsLiked(!!data);
    } catch (err) {
      console.error('Failed to fetch like status:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, mediaId]);

  useEffect(() => {
    fetchLikeStatus();
  }, [fetchLikeStatus]);

  const toggleLike = async () => {
    if (!supabase || !isSupabaseConfigured || !userId || !mediaId) return;

    const previousState = isLiked;
    setIsLiked(!previousState);

    try {
      if (previousState) {
        // Unlike: Remove from likes table and decrement count via RPC
        await supabase
          .from('media_likes')
          .delete()
          .eq('user_id', userId)
          .eq('media_id', mediaId);

        await supabase.rpc('decrement_media_like_count', { p_media_id: mediaId });
      } else {
        // Like: Add to likes table and increment count via RPC
        await supabase
          .from('media_likes')
          .insert({ user_id: userId, media_id: mediaId });

        await supabase.rpc('increment_media_like_count', { p_media_id: mediaId });
      }
    } catch (err) {
      console.error('Failed to toggle like:', err);
      setIsLiked(previousState); // Revert on failure
    }
  };

  return { isLiked, loading, toggleLike, refresh: fetchLikeStatus };
}

export interface CategoryItem {
  id: string;
  name: string;
  displayLabel: string;
  visible: boolean;
  orderIndex?: number;
}

export function useCategories() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    if (!supabase || !isSupabaseConfigured) {
      setError('Supabase not configured');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('media_categories')
        .select('*')
        .eq('source', 'likhani')
        .eq('visible', true)
        .order('order_index', { ascending: true })
        .order('name', { ascending: true });

      if (fetchError) throw fetchError;

      const formatted = (data ?? []).map((row: any) => ({
        id: row.id,
        name: row.name,
        displayLabel: row.display_label ?? row.name,
        visible: row.visible ?? true,
        orderIndex: row.order_index ?? 0,
      }));

      setCategories(formatted);
    } catch (err: any) {
      console.error('Failed to load categories:', err);
      setError(err?.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();

    if (!supabase || !isSupabaseConfigured) return;

    const channel = supabase.channel('public:media_categories')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'media_categories' }, () => {
        fetchCategories();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchCategories]);

  return { categories, loading, error, refresh: fetchCategories };
}

export function useWatchLater(userId?: string) {
  const [watchLaterList, setWatchLaterList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWatchLater = useCallback(async () => {
    if (!supabase || !isSupabaseConfigured || !userId) return;
    setLoading(true);
    try {
      const { data } = await supabase
        .from('watch_later')
        .select('media_id')
        .eq('user_id', userId);
      setWatchLaterList(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchWatchLater();
  }, [fetchWatchLater]);

  const toggleWatchLater = async (mediaId: string) => {
    if (!supabase || !isSupabaseConfigured || !userId) return;
    const isBookmarked = watchLaterList.some(item => item.media_id === mediaId);
    if (isBookmarked) {
      await supabase.from('watch_later').delete().eq('user_id', userId).eq('media_id', mediaId);
      setWatchLaterList(prev => prev.filter(item => item.media_id !== mediaId));
    } else {
      await supabase.from('watch_later').insert({ user_id: userId, media_id: mediaId });
      setWatchLaterList(prev => [...prev, { media_id: mediaId }]);
    }
  };

  return { watchLaterList, loading, toggleWatchLater, refresh: fetchWatchLater };
}

export function useWatchProgress(userId?: string, mediaId?: string) {
  const [progress, setProgress] = useState<{ currentSeconds: number; durationSeconds?: number } | null>(null);

  const fetchProgress = useCallback(async () => {
    if (!supabase || !isSupabaseConfigured || !userId || !mediaId) return;
    try {
      const { data } = await supabase
        .from('watch_progress')
        .select('current_seconds, duration_seconds')
        .eq('user_id', userId)
        .eq('media_id', mediaId)
        .maybeSingle();
      if (data) {
        setProgress({
          currentSeconds: data.current_seconds,
          durationSeconds: data.duration_seconds
        });
      }
    } catch (e) {
      console.error(e);
    }
  }, [userId, mediaId]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const saveProgress = async (currentSeconds: number, durationSeconds?: number) => {
    if (!supabase || !isSupabaseConfigured || !userId || !mediaId) return;
    try {
      await supabase.from('watch_progress').upsert({
        user_id: userId,
        media_id: mediaId,
        current_seconds: Math.floor(currentSeconds),
        duration_seconds: durationSeconds ? Math.floor(durationSeconds) : null,
        last_watched_at: new Date().toISOString()
      }, { onConflict: 'user_id, media_id' });
      setProgress({ currentSeconds, durationSeconds });
    } catch (e) {
      console.error(e);
    }
  };

  return { progress, saveProgress, refresh: fetchProgress };
}

