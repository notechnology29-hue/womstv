import { supabase, fallbackFeaturedShows } from "@/lib/supabase";
import Link from "next/link";

// Forces Next.js to fetch fresh database content on every request
export const dynamic = "force-dynamic";

export default async function ShowsCatalog({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const currentTag = resolvedSearchParams?.tag || "All";
  let shows = [];

  if (supabase) {
    let query = supabase
      .from("shows")
      .select("id, title, meta, tags, description, mux_playback_id, created_at")
      .order("created_at", { ascending: false });

    if (currentTag !== "All") {
      query = query.contains("tags", [currentTag]);
    }

    const { data, error } = await query;
    
    if (!error && data && data.length > 0) {
      shows = data;
    } else {
      shows = fallbackFeaturedShows;
    }
  } else {
    shows = fallbackFeaturedShows;
  }

  const categories = ["All", "Comedy", "Drama", "Documentary", "Indie", "Music", "Culture"];

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

        .catalog-shell {
          background-color: var(--wom-jet-black);
          color: var(--wom-bright-white);
          min-height: 100vh;
          padding: 60px 40px;
        }

        .catalog-header {
          max-width: 1400px;
          margin: 0 auto 40px auto;
        }

        .catalog-header h1 {
          font-size: 3rem;
          margin: 0 0 10px 0;
          font-weight: 800;
        }

        .catalog-header p {
          color: var(--wom-metallic-silver);
          font-size: 1.1rem;
          max-width: 600px;
        }

        .filter-row {
          display: flex;
          gap: 15px;
          margin-bottom: 40px;
          overflow-x: auto;
          scrollbar-width: none;
          padding-bottom: 10px;
        }

        .filter-pill {
          padding: 8px 20px;
          border-radius: 30px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: var(--wom-bright-white);
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 500;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .filter-pill:hover {
          border-color: var(--wom-cyan-blue);
        }

        .filter-pill.active {
          background-color: var(--wom-cyan-blue);
          color: var(--wom-jet-black);
          border-color: var(--wom-cyan-blue);
        }

        .catalog-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 30px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .video-card {
          background-color: var(--wom-midnight-navy);
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: border-color 0.3s, transform 0.2s;
          text-decoration: none;
          display: block;
        }

        .video-card:hover {
          border-color: var(--wom-cyan-blue);
          transform: translateY(-4px);
        }

        .thumbnail {
          aspect-ratio: 16 / 9;
          background-color: #0b1d36;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--wom-cyan-blue);
          font-weight: bold;
          font-size: 0.9rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .card-info {
          padding: 16px;
        }

        .card-info h3 {
          margin: 0 0 6px 0;
          font-size: 1.1rem;
          color: var(--wom-bright-white);
        }

        .card-info p {
          margin: 0 0 10px 0;
          font-size: 0.9rem;
          color: var(--wom-metallic-silver);
        }
        
        .card-tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .card-tag {
          font-size: 0.75rem;
          background-color: rgba(32, 213, 255, 0.1);
          color: var(--wom-cyan-blue);
          padding: 2px 8px;
          border-radius: 4px;
        }

        @media (max-width: 640px) {
          .catalog-shell {
            padding: 32px 16px;
          }

          .catalog-header {
            margin-bottom: 24px;
          }

          .catalog-header h1 {
            font-size: 2.35rem;
          }

          .catalog-header p {
            font-size: 1rem;
          }

          .filter-row {
            margin: 0 -16px 28px;
            padding: 0 16px 10px;
          }

          .catalog-grid {
            grid-template-columns: minmax(0, 1fr);
            gap: 16px;
          }
        }
      `}} />

      <main className="catalog-shell">
        <header className="catalog-header">
          <h1>The Catalog</h1>
          <p>Browse independent premieres, regional showcases, and community-driven storytelling.</p>
        </header>

        <nav className="filter-row">
          {categories.map((category) => {
            const isActive = currentTag === category;
            const href = category === "All" ? "/shows" : `/shows?tag=${category}`;
            return (
              <Link 
                key={category} 
                href={href}
                className={`filter-pill ${isActive ? "active" : ""}`}
              >
                {category}
              </Link>
            );
          })}
        </nav>

        <div className="catalog-grid">
          {shows.map((show) => (
            <Link key={show.id} href={`/shows/${show.id}`} className="video-card">
              <div className="thumbnail">
                {show.mux_playback_id ? "▶ WATCH NOW" : "⚙ PROCESSING"}
              </div>
              <div className="card-info">
                <h3>{show.title}</h3>
                <p>{show.meta || show.description || "Original • Network Premiere"}</p>
                <div className="card-tags">
                  {show.tags?.map(tag => (
                    <span key={tag} className="card-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}