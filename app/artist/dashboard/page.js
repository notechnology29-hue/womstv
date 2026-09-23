import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signout } from "./actions";

export default async function ArtistDashboard() {
  if (!supabase) {
    redirect("/login");
  }

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    redirect("/login");
  }

  const { data: shows } = await supabase
    .from("shows")
    .select("*")
    .eq("artist_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --wom-electric-blue: #087BFF;
          --wom-midnight-navy: #071426;
          --wom-jet-black: #080A0D;
          --wom-bright-white: #FFFFFF;
          --wom-cyan-blue: #20D5FF;
          --wom-metallic-silver: #AEB8C4;
        }

        .dashboard-shell {
          background-color: var(--wom-jet-black);
          color: var(--wom-bright-white);
          min-height: 100vh;
          padding: 60px 40px;
        }

        .dashboard-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          padding-bottom: 20px;
          margin-bottom: 40px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .dashboard-header h1 {
          font-size: 2.5rem;
          margin: 0 0 10px 0;
        }

        .dashboard-header p {
          color: var(--wom-metallic-silver);
          margin: 0;
          font-size: 1.1rem;
        }

        .header-actions {
          display: flex;
          gap: 15px;
          align-items: center;
        }

        .btn-primary {
          background-color: var(--wom-cyan-blue);
          color: var(--wom-jet-black);
          padding: 12px 24px;
          border-radius: 4px;
          text-decoration: none;
          font-weight: bold;
          transition: background-color 0.2s;
        }

        .btn-primary:hover {
          background-color: #1cbbe0;
        }

        .btn-outline {
          background-color: transparent;
          color: var(--wom-bright-white);
          padding: 12px 24px;
          border-radius: 4px;
          border: 1px solid rgba(255,255,255,0.2);
          font-weight: bold;
          cursor: pointer;
          transition: border-color 0.2s;
        }

        .btn-outline:hover {
          border-color: #ff4d4d;
          color: #ff4d4d;
        }

        .shows-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .show-row {
          background-color: var(--wom-midnight-navy);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 8px;
          padding: 25px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: border-color 0.2s;
        }

        .show-row:hover {
          border-color: rgba(32, 213, 255, 0.3);
        }

        .show-info h3 {
          margin: 0 0 8px 0;
          font-size: 1.4rem;
        }

        .show-info p {
          margin: 0;
          color: var(--wom-metallic-silver);
          font-size: 0.95rem;
        }

        .show-status {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 12px;
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status-processing {
          background-color: rgba(255, 193, 7, 0.1);
          color: #ffc107;
          border: 1px solid rgba(255, 193, 7, 0.2);
        }

        .status-published {
          background-color: rgba(0, 230, 118, 0.1);
          color: #00e676;
          border: 1px solid rgba(0, 230, 118, 0.2);
        }

        .watch-link {
          color: var(--wom-cyan-blue);
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: bold;
        }
        
        .watch-link:hover {
          text-decoration: underline;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          background-color: var(--wom-midnight-navy);
          border-radius: 8px;
          border: 1px dashed rgba(255,255,255,0.2);
        }
      `}} />

      <main className="dashboard-shell">
        <div className="dashboard-container">
          <header className="dashboard-header">
            <div>
              <h1>Artist Dashboard</h1>
              <p>Manage your uploaded films, sets, and series.</p>
            </div>
            
            <div className="header-actions">
              <Link href="/artist/submit" className="btn-primary">
                + Upload New Content
              </Link>
              
              {/* Sign Out Form utilizing the server action */}
              <form action={signout}>
                <button type="submit" className="btn-outline">
                  Sign Out
                </button>
              </form>
            </div>
          </header>

          <div className="shows-list">
            {!shows || shows.length === 0 ? (
              <div className="empty-state">
                <h3>No content yet</h3>
                <p style={{ color: "var(--wom-metallic-silver)", marginBottom: "20px" }}>You haven't uploaded any videos to the network.</p>
                <Link href="/artist/submit" className="btn-primary">Submit Your First Video</Link>
              </div>
            ) : (
              shows.map((show) => (
                <div key={show.id} className="show-row">
                  <div className="show-info">
                    <h3>{show.title}</h3>
                    <p>{show.description}</p>
                  </div>
                  
                  <div className="show-status">
                    {!show.mux_playback_id || show.mux_playback_id === "" ? (
                      <span className="status-badge status-processing">⚙ Processing</span>
                    ) : (
                      <>
                        <span className="status-badge status-published">✔ Published</span>
                        <Link href={`/shows/${show.id}`} className="watch-link">
                          View on Network ↗
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </>
  );
  } catch (error) {
    console.error("Dashboard error:", error);
    redirect("/login");
  }
}