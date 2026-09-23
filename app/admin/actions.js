"use server";

import Mux from "@mux/mux-node";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated.");
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();

  if (!profile || profile.role !== "admin") {
    throw new Error("Not authorized.");
  }
}

export async function approveShow(showId) {
  await assertAdmin();

  const admin = createAdminClient();
  const { error } = await admin.from("shows").update({ status: "published" }).eq("id", showId);

  if (error) {
    throw new Error(`Failed to approve show: ${error.message}`);
  }

  revalidatePath("/admin");
  revalidatePath("/shows");
  revalidatePath("/");
}

export async function denyShow(showId) {
  await assertAdmin();

  const admin = createAdminClient();

  const { data: show, error: fetchError } = await admin
    .from("shows")
    .select("mux_asset_id")
    .eq("id", showId)
    .single();

  if (fetchError) {
    throw new Error(`Failed to load show: ${fetchError.message}`);
  }

  const { error: deleteError } = await admin.from("shows").delete().eq("id", showId);

  if (deleteError) {
    throw new Error(`Failed to delete show: ${deleteError.message}`);
  }

  const tokenId = process.env.MUX_TOKEN_ID;
  const tokenSecret = process.env.MUX_TOKEN_SECRET;

  if (show?.mux_asset_id && tokenId && tokenSecret) {
    try {
      const muxClient = new Mux({ tokenId, tokenSecret });
      await muxClient.video.assets.delete(show.mux_asset_id);
    } catch (err) {
      // The Supabase row is already gone; log so the orphaned Mux asset can be cleaned up manually.
      console.error("Failed to delete Mux asset:", err);
    }
  }

  revalidatePath("/admin");
}

export async function setFeaturedShow(showId) {
  await assertAdmin();

  const admin = createAdminClient();

  const { error: clearError } = await admin.from("shows").update({ is_featured: false }).neq("id", showId);

  if (clearError) {
    throw new Error(`Failed to clear existing featured show: ${clearError.message}`);
  }

  const { error: setError } = await admin.from("shows").update({ is_featured: true }).eq("id", showId);

  if (setError) {
    throw new Error(`Failed to set featured show: ${setError.message}`);
  }

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function uploadPoster(showId, formData) {
  await assertAdmin();

  const file = formData.get("poster");
  if (!file || typeof file === "string" || file.size === 0) {
    throw new Error("Please choose an image file.");
  }

  const admin = createAdminClient();
  const extension = file.name.split(".").pop() || "jpg";
  const path = `${showId}-${Date.now()}.${extension}`;

  const { error: uploadError } = await admin.storage.from("posters").upload(path, file, {
    contentType: file.type,
    upsert: true,
  });

  if (uploadError) {
    throw new Error(`Failed to upload poster: ${uploadError.message}`);
  }

  const {
    data: { publicUrl },
  } = admin.storage.from("posters").getPublicUrl(path);

  const { error: updateError } = await admin.from("shows").update({ poster_url: publicUrl }).eq("id", showId);

  if (updateError) {
    throw new Error(`Failed to save poster URL: ${updateError.message}`);
  }

  revalidatePath("/admin");
  revalidatePath("/");
}
