import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export const fallbackFeaturedShows = [
  { id: "night-signal", title: "Night Signal", meta: "Drama • 45 min", featured: true },
  { id: "the-last-echo", title: "The Last Echo", meta: "Documentary • 38 min", featured: true },
  { id: "open-frame", title: "Open Frame", meta: "Indie • 52 min", featured: true },
  { id: "city-noise", title: "City Noise", meta: "Comedy • 31 min", featured: true },
];

export const fallbackShow = {
  id: "lead-program-title",
  title: "Lead Program Title",
  muxPlaybackId: "DS00Spx1CV902MCtPj5WknGlR102V5HFkDe",
  description:
    "An exclusive look into the creative process of independent voices. This feature presentation takes you behind the scenes of community-driven storytelling, raw stand-up, and underground music scenes.",
  meta: "Documentary • 1h 45m • 2026",
  tags: ["Indie", "Exclusive", "Culture"],
  cast: ["Host Name", "Featured Guest 1", "Featured Guest 2"],
  director: "Word of Mouth Productions",
};

export async function fetchFeaturedShows() {
  if (!supabase) {
    return fallbackFeaturedShows;
  }

  const { data, error } = await supabase
    .from("shows")
    .select("id, title, meta, featured")
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(4);

  if (error) {
    console.error("Supabase featured shows lookup failed:", error.message);
    return fallbackFeaturedShows;
  }

  if (!data || data.length === 0) {
    return fallbackFeaturedShows;
  }

  return data.map((show) => ({
    id: show.id,
    title: show.title,
    meta: show.meta ?? "Original • 45 min",
    featured: true,
  }));
}

export async function fetchShowById(idOrSlug: string) {
  if (!supabase) {
    return { ...fallbackShow, id: idOrSlug };
  }

  const bySlug = await supabase
    .from("shows")
    .select("*")
    .eq("slug", idOrSlug)
    .single();

  if (bySlug.data) {
    return {
      id: bySlug.data.slug ?? bySlug.data.id,
      title: bySlug.data.title ?? fallbackShow.title,
      muxPlaybackId:
        bySlug.data.mux_playback_id ??
        bySlug.data.muxPlaybackId ??
        fallbackShow.muxPlaybackId,
      description: bySlug.data.description ?? fallbackShow.description,
      meta: bySlug.data.meta ?? fallbackShow.meta,
      tags: Array.isArray(bySlug.data.tags) ? bySlug.data.tags : fallbackShow.tags,
      cast: Array.isArray(bySlug.data.cast) ? bySlug.data.cast : fallbackShow.cast,
      director: bySlug.data.director ?? fallbackShow.director,
    };
  }

  const byId = await supabase
    .from("shows")
    .select("*")
    .eq("id", idOrSlug)
    .single();

  if (byId.error) {
    console.error("Supabase single show lookup failed:", byId.error.message);
    return { ...fallbackShow, id: idOrSlug };
  }

  if (!byId.data) {
    return { ...fallbackShow, id: idOrSlug };
  }

  return {
    id: byId.data.slug ?? byId.data.id,
    title: byId.data.title ?? fallbackShow.title,
    muxPlaybackId:
      byId.data.mux_playback_id ??
      byId.data.muxPlaybackId ??
      fallbackShow.muxPlaybackId,
    description: byId.data.description ?? fallbackShow.description,
    meta: byId.data.meta ?? fallbackShow.meta,
    tags: Array.isArray(byId.data.tags) ? byId.data.tags : fallbackShow.tags,
    cast: Array.isArray(byId.data.cast) ? byId.data.cast : fallbackShow.cast,
    director: byId.data.director ?? fallbackShow.director,
  };
}
