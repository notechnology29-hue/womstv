// One-off script: promotes an existing auth user to admin (creates one if missing).
// Usage: node scripts/promote-admin.mjs <email>
import { createClient } from "@supabase/supabase-js";
import crypto from "node:crypto";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.argv[2];

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY in the environment.");
  process.exit(1);
}

if (!email) {
  console.error("Usage: node scripts/promote-admin.mjs <email>");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function findUserByEmail(targetEmail) {
  let page = 1;
  const perPage = 200;

  for (;;) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) throw error;

    const match = data.users.find((u) => u.email?.toLowerCase() === targetEmail.toLowerCase());
    if (match) return match;

    if (data.users.length < perPage) return null;
    page += 1;
  }
}

let user = await findUserByEmail(email);
let generatedPassword = null;

if (!user) {
  generatedPassword = crypto.randomBytes(12).toString("base64url");
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: generatedPassword,
    email_confirm: true,
  });
  if (error) {
    console.error("Failed to create user:", error.message);
    process.exit(1);
  }
  user = data.user;
}

const { error: profileError } = await supabase
  .from("profiles")
  .upsert({ id: user.id, role: "admin" }, { onConflict: "id" });

if (profileError) {
  console.error("Failed to promote profile to admin:", profileError.message);
  console.error("Make sure supabase/pipeline-updates.sql has been run (creates the profiles table).");
  process.exit(1);
}

console.log("Admin profile ready:");
console.log("  email:", email);
if (generatedPassword) {
  console.log("  password:", generatedPassword);
  console.log("  (newly created account — log in at /login, then change this password.)");
} else {
  console.log("  (existing account — sign in with its current password.)");
}
