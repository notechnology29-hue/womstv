"use server";

import Mux from "@mux/mux-node";
import { supabase } from "@/lib/supabase";

export async function createUploadTicket(formData) {
  if (!supabase) {
    throw new Error("Supabase not configured");
  }

  const title = formData?.get?.("title") || "Untitled";
  const description = formData?.get?.("description") || "";

  const tokenId = process.env.MUX_TOKEN_ID;
  const tokenSecret = process.env.MUX_TOKEN_SECRET;

  if (!tokenId || !tokenSecret) {
    throw new Error("Mux credentials are not configured");
  }

  try {
    const muxClient = new Mux({
      tokenId,
      tokenSecret,
    });

    // 1. Create the direct upload ticket with Mux
    const upload = await muxClient.video.uploads.create({
      new_asset_settings: {
        playback_policy: ["public"],
      },
      cors_origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    });

    // 2. Insert a placeholder row into your Supabase 'shows' table
    // Note: artist_id would need to come from auth context in production
    const { error: dbError } = await supabase.from("shows").insert({
      title: title,
      description: description,
      meta: "Indie • Just Added",
      tags: ["Indie", "New"],
      mux_playback_id: null, // Will update once Mux finishes processing via webhook
    });

    if (dbError) {
      console.error("Database insert failed:", dbError);
    }

    return upload.url;
  } catch (err) {
    console.error("Mux ticket creation failed:", err);
    throw new Error(`Failed to initialize upload: ${err.message}`);
  }
}
// Add revalidatePath to your imports from "next/cache"
import { revalidatePath } from "next/cache";

// ... inside your createUploadTicket function after the Supabase insert:
const { error: dbError } = await supabase.from("shows").insert({
  title: title,
  description: description,
  meta: "Indie • Just Added",
  tags: ["Indie", "New"],
  artist_id: user.id,
  mux_playback_id: null, 
});

// Force Next.js to immediately refresh the catalog and home pages
revalidatePath("/shows");
revalidatePath("/");
revalidatePath("/artist/dashboard");