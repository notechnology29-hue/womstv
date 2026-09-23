import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as crypto from "https://deno.land/std@0.168.0/crypto/mod.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const muxWebhookSecret = Deno.env.get("MUX_WEBHOOK_SIGNATURE_SECRET");

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Verify Mux webhook signature
async function verifyMuxSignature(
  request: Request,
  secret: string
): Promise<boolean> {
  const body = await request.text();
  const signature = request.headers.get("Mux-Signature");

  if (!signature) {
    console.error("No signature header found");
    return false;
  }

  // Mux uses HMAC-SHA256 for signing
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signedBody = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  const computedSignature = "t=" + Array.from(new Uint8Array(signedBody))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return signature.includes(computedSignature);
}

serve(async (req: Request) => {
  // Only POST requests
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    // Verify the webhook signature
    if (!await verifyMuxSignature(req, muxWebhookSecret)) {
      console.error("Invalid webhook signature");
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const event = body.type;
    const data = body.data;

    console.log("Received Mux webhook event:", event);

    // Handle video.asset.created: correlate the temporary upload id
    // (stored as mux_asset_id at submission time) with the real asset id.
    if (event === "video.asset.created") {
      const assetId = data.id;
      const uploadId = data.upload_id;

      if (!uploadId) {
        console.log("Asset created without an upload_id, nothing to correlate");
        return new Response("Event received", { status: 200 });
      }

      const { error } = await supabase
        .from("shows")
        .update({ mux_asset_id: assetId })
        .eq("mux_asset_id", uploadId);

      if (error) {
        console.error("Failed to correlate asset id:", error);
        return new Response("Database update failed", { status: 500 });
      }

      return new Response("Webhook processed", { status: 200 });
    }

    // Handle video.asset.ready event
    if (event === "video.asset.ready") {
      const assetId = data.id;
      const playbackId = data.playback_ids?.[0]?.id;

      if (!playbackId) {
        console.error("No playback ID found in asset data");
        return new Response("Missing playback ID", { status: 400 });
      }

      console.log("Asset ready:", {
        assetId,
        playbackId,
      });

      // Update the shows table with the playback ID
      // The mux_asset_id column is kept in sync via the video.asset.created handler above
      const { error } = await supabase
        .from("shows")
        .update({ mux_playback_id: playbackId })
        .eq("mux_asset_id", assetId);


      if (error) {
        console.error("Failed to update show record:", error);
        return new Response("Database update failed", { status: 500 });
      }

      console.log("Successfully updated show with playback ID:", playbackId);
      return new Response("Webhook processed", { status: 200 });
    }

    // Log other events for debugging
    console.log("Unhandled event type:", event);
    return new Response("Event received", { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
});
