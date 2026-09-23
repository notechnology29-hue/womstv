"use server";

import Mux from "@mux/mux-node";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createUploadTicket(formData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in to submit a show.");
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
        mp4_support: "standard",
      },
      cors_origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    });

    // 2. Insert a placeholder row into the Supabase 'shows' table
    const { error: dbError } = await supabase.from("shows").insert({
      title: title,
      description: description,
      meta: "Indie • Just Added",
      tags: ["Indie", "New"],
      status: "pending",
      artist_id: user.id,
      mux_asset_id: upload.id, // rewritten to the real asset id by the Mux webhook
    });

    if (dbError) {
      console.error("Database insert failed:", dbError);
      throw new Error("Failed to save your submission. Please try again.");
    }

    revalidatePath("/shows");
    revalidatePath("/");
    revalidatePath("/artist/dashboard");

    return upload.url;
  } catch (err) {
    console.error("Mux ticket creation failed:", err);
    throw new Error(`Failed to initialize upload: ${err.message}`);
  }
}

revalidatePath("/artist/dashboard");