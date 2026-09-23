import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminDashboard() {
  const supabase = createClient();
  
  // 1. Authenticate user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 2. Verify Admin Role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    redirect("/"); // Kick non-admins back to the homepage
  }

  // 3. Fetch unapproved uploads
  const { data: pendingShows } = await supabase
    .from("shows")
    .select("*")
    .eq("is_approved", false)
    .order("created_at", { ascending: false });

  return (
    <main className="page-shell" style={{ paddingTop: "60px" }}>
      <div className="section-heading">
        <h2>Network Admin Console</h2>
        <p style={{ color: "var(--wom-metallic-silver)" }}>Review pending artist uploads and manage platform ad tags.</p>
      </div>

      <div style={{ backgroundColor: "var(--wom-midnight-navy)", borderRadius: "8px", padding: "30px", border: "1px solid var(--border-soft)" }}>
        <h3 style={{ borderBottom: "1px solid var(--border-soft)", paddingBottom: "15px", marginBottom: "20px" }}>
          Approval Queue
        </h3>
        
        {!pendingShows || pendingShows.length === 0 ? (
          <p style={{ color: "var(--wom-metallic-silver)" }}>No pending videos to review.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {pendingShows.map((show) => (
              <div key={show.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px", backgroundColor: "var(--wom-jet-black)", borderRadius: "6px" }}>
                <div>
                  <h4 style={{ margin: "0 0 5px 0" }}>{show.title}</h4>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--wom-metallic-silver)" }}>Playback ID: {show.mux_playback_id || "Processing"}</p>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <Link href={`/shows/${show.id}`} className="secondary-btn" style={{ padding: "8px 16px", fontSize: "0.9rem" }}>Preview</Link>
                  <button className="primary-btn" style={{ padding: "8px 16px", fontSize: "0.9rem" }}>Approve</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}