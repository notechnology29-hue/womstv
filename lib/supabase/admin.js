import { createClient } from "@supabase/supabase-js";

// Bypasses RLS entirely — server-only, never import this from a Client Component.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Supabase's newer projects issue a "secret key" (sb_secret_...) instead of
  // the legacy service_role JWT; support both naming schemes.
  const serviceKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error("Supabase service role credentials are not configured");
  }

  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
