"use server";

import Mux from "@mux/mux-node";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

function slugify(title) {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${base || "show"}-${suffix}`;
}

export async function createUploadTicket(formData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in to submit a show.");
  }

  const title = formData.get("title")?.toString().trim() || "Untitled Submission";
  const description = formData.get("description")?.toString().trim() || "";
  const genre = formData.get("genre")?.toString().trim() || "Uncategorized";
  const cast =
    formData
      .get("cast")
      ?.toString()
      .split(",")
      .map((name) => name.trim())
      .filter(Boolean) ?? [];

  const tokenId = process.env.MUX_TOKEN_ID;
  const tokenSecret = process.env.MUX_TOKEN_SECRET;

  if (!tokenId || !tokenSecret) {
    throw new Error("Mux credentials are not configured");
  }

  // 1. Create the row first so we have an id to correlate with Mux.
  const { data: show, error: insertError } = await supabase
    .from("shows")
    .insert({
      title,
      slug: slugify(title),
      description,
      genre,
      cast_member: cast,
      meta: `${genre} • Pending Review`,
      tags: [genre, "Pending"],
      status: "pending",
      artist_id: user.id,
    })
    .select("id")
    .single();

  if (insertError || !show) {
    console.error("Database insert failed:", insertError);
    throw new Error("Failed to save your submission. Please try again.");
  }

  try {
    const muxClient = new Mux({ tokenId, tokenSecret });

    // 2. Request the direct upload URL, requesting MP4 support for downloads.
    const upload = await muxClient.video.uploads.create({
      new_asset_settings: {
        playback_policy: ["public"],
        mp4_support: "standard",
      },
      cors_origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    });

    // 3. Store the upload id; the webhook rewrites this to the real asset id
    // once Mux finishes ingesting the file (video.asset.created event).
    await supabase.from("shows").update({ mux_asset_id: upload.id }).eq("id", show.id);

    revalidatePath("/artist/dashboard");
    revalidatePath("/admin");

    return upload.url;
  } catch (err) {
    console.error("Mux ticket creation failed:", err);
    // Roll back the placeholder row so it doesn't linger as an orphaned pending show.
    await supabase.from("shows").delete().eq("id", show.id);
    throw new Error(`Failed to initialize upload: ${err.message}`);
  }
}
