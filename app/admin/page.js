import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import AdminQueue from "./AdminQueue";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // 1. Authenticate user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  // 2. Verify Admin Role
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();

  if (!profile || profile.role !== "admin") {
    redirect("/admin/login"); // Kick non-admins back to the admin login instead of the homepage
  }

  // 3. Fetch queues with the service-role client — admins need to see every
  // creator's pending/published rows, not just their own (RLS only exposes
  // published shows + a user's own rows to the anon/authenticated client).
  const admin = createAdminClient();

  const { data: pendingShows } = await admin
    .from("shows")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  const { data: publishedShows } = await admin
    .from("shows")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  return (
    <main className="page-shell" style={{ paddingTop: "60px" }}>
      <div className="section-heading">
        <h2>Network Admin Console</h2>
        <p style={{ color: "var(--wom-metallic-silver)" }}>
          Review pending artist uploads and control which show leads the homepage.
        </p>
      </div>

      <AdminQueue pendingShows={pendingShows ?? []} publishedShows={publishedShows ?? []} />
    </main>
  );
}
