import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// This client is only ever used from Server Components, where Next.js
// patches global fetch to cache responses by default — without opting out,
// a show fetched once (e.g. while still pending) stays stale forever even
// after its status/data changes, regardless of `dynamic = "force-dynamic"`.
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        global: {
          fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
        },
      })
    : null;

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
  posterUrl: null,
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
    .eq("status", "published")
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

// Powers the homepage hero: the admin-picked `is_featured` show, falling
// back to the most recently published show when nothing is picked yet.
export async function fetchHeroShow() {
  if (!supabase) {
    return fallbackShow;
  }

  const { data: pick } = await supabase
    .from("shows")
    .select("*")
    .eq("status", "published")
    .eq("is_featured", true)
    .limit(1)
    .maybeSingle();

  const row =
    pick ??
    (
      await supabase
        .from("shows")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()
    ).data;

  if (!row) {
    return fallbackShow;
  }

  return {
    id: row.slug ?? row.id,
    title: row.title ?? fallbackShow.title,
    muxPlaybackId: row.mux_playback_id ?? fallbackShow.muxPlaybackId,
    posterUrl: row.poster_url ?? fallbackShow.posterUrl,
    description: row.description ?? fallbackShow.description,
    meta: row.meta ?? fallbackShow.meta,
    tags: Array.isArray(row.tags) ? row.tags : fallbackShow.tags,
    cast: Array.isArray(row.cast_member) ? row.cast_member : fallbackShow.cast,
    director: row.director ?? fallbackShow.director,
  };
}

export async function fetchShowById(idOrSlug: string) {
  if (!supabase || !idOrSlug) {
    return { ...fallbackShow, id: idOrSlug || "unknown" };
  }

  // Next.js doesn't always URL-decode dynamic route segments (e.g. slugs
  // with spaces arrive as "Wicked%20Awesome%20Comedy"), so decode explicitly
  // or the slug lookup below silently never matches.
  idOrSlug = decodeURIComponent(idOrSlug);

  // First try to find by slug
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
      cast: Array.isArray(bySlug.data.cast_member) ? bySlug.data.cast_member : fallbackShow.cast,
      director: bySlug.data.director ?? fallbackShow.director,
      // Explicitly exclude Date fields to ensure serializability for Server->Client transmission
    };
  }

  // If slug lookup didn't find anything, don't try UUID lookup if it's not a valid UUID
  // Check if idOrSlug looks like a UUID (simple heuristic: contains hyphens and is the right length)
  const isLikelyUuid = idOrSlug.includes("-") && idOrSlug.length > 30;
  
  if (!isLikelyUuid) {
    // Not a UUID, return fallback
    console.log(`Show not found by slug "${idOrSlug}", returning fallback data`);
    return { ...fallbackShow, id: idOrSlug };
  }

  // Try by UUID ID as fallback
  const byId = await supabase
    .from("shows")
    .select("*")
    .eq("id", idOrSlug)
    .single();

  if (byId.error) {
    console.log(`Show not found by ID "${idOrSlug}", using fallback data`);
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
    cast: Array.isArray(byId.data.cast_member) ? byId.data.cast_member : fallbackShow.cast,
    director: byId.data.director ?? fallbackShow.director,
    // Explicitly exclude Date fields to ensure serializability for Server->Client transmission
  };
}
