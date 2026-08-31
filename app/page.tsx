import Image from "next/image";
import { fetchFeaturedShows } from "@/lib/supabase";

const localArtists = [
  { name: "Lena Hart", region: "Brooklyn, NY", tag: "Indie Folk" },
  { name: "Arlo Mendez", region: "Austin, TX", tag: "Documentary" },
  { name: "Sana River", region: "Chicago, IL", tag: "Soul" },
  { name: "Theo Vale", region: "Seattle, WA", tag: "Alt Rock" },
];

const genres = [
  "Action",
  "Comedy",
  "Drama",
  "Sci-Fi",
  "Docs",
  "Music",
  "Culture",
  "Reality",
  "Animation",
  "Mystery",
  "Family",
  "News",
];

const schedule = [
  { time: "6:00 PM", show: "Live World Report" },
  { time: "7:15 PM", show: "Indie Spotlight" },
  { time: "8:30 PM", show: "The Studio Session" },
  { time: "9:45 PM", show: "Late Night Mix" },
];

export default async function Home() {
  const featuredTitles = await fetchFeaturedShows();
  const featuredSlug = featuredTitles[0]?.id ?? "lead-program-title";
  
  // Added query parameters for reliable, muted autoplay
  const embedUrl = "https://connecttoyourcity.com/channel/695c8f4e0630443ffb4c4ca3?autoplay=1&muted=1";

  return (
    <>
      <main className="page-shell">
        <section className="hero">
          <div className="hero-overlay" />
          <div className="hero-content">
            <Image
              src="/logo.png"
              alt="Word of Mouth Television"
              width={96}
              height={96}
              className="hero-logo"
              priority
            />
            <p className="eyebrow">Featured Indie Premiere Coming Soon</p>
            <h1>Wicked Awesome Comedy Coming Soon</h1>
            <p className="hero-copy">
              The sharpest local comics audition for a chance to compete, We place them into an uncompromising multi-stage tournament, and build the infrastructure to launch their careers on a national scale.
              Original voices, global reach.
            </p>
            <a href={`/shows/${featuredSlug}`} className="primary-btn" style={{ display: "inline-flex" }}>
              ▶ Watch Now
            </a>
          </div>
        </section>

        <section className="content-section">
          <div className="section-heading">
            <h2>Continue Watching</h2>
          </div>
          <div className="video-row">
            {featuredTitles.map((item) => (
              <a key={item.title} href={`/shows/${item.id}`} className="video-card">
                <div className="thumbnail">16:9</div>
                <div className="card-info">
                  <h3>{item.title}</h3>
                  <p>{item.meta}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="community-panel">
          <div className="community-copy">
            <p className="eyebrow">Artist Hub Coming Soon</p>
            <h2>Submit your story to the next wave of creators.</h2>
            <p>
              Upload your work, review submissions, and connect with a community built
              around independent voices.
            </p>
            <button className="primary-btn">Artist Portal Access Coming Soon</button>
          </div>
          <div className="ad-slot">Your Ad Here</div>
        </section>

        <section className="content-section">
          <div className="section-heading">
            <h2>Local Artist Showcase</h2>
          </div>
          <div className="video-row artist-row">
            {localArtists.map((artist) => (
              <article key={artist.name} className="video-card local-card">
                <div className="thumbnail alt-thumb">Portrait</div>
                <div className="card-info">
                  <span className="tag">{artist.tag}</span>
                  <h3>{artist.name}</h3>
                  <p>{artist.region}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="content-section">
          <div className="section-heading">
            <h2>Explore by Genre</h2>
          </div>
          <div className="genre-grid">
            {genres.map((genre, index) => (
              <div key={genre} className="genre-card" style={{ animationDelay: `${index * 80}ms` }}>
                {genre}
              </div>
            ))}
          </div>
        </section>

        <section className="live-section">
          <div className="live-player-container" style={{ flex: 1, display: "flex", flexDirection: "column", gap: "15px" }}>
            
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <span style={{ 
                backgroundColor: "rgba(255, 77, 77, 0.1)", 
                color: "#ff4d4d", 
                padding: "6px 12px", 
                borderRadius: "4px", 
                fontSize: "0.85rem", 
                fontWeight: "bold", 
                textTransform: "uppercase",
                border: "1px solid rgba(255, 77, 77, 0.2)"
              }}>
                ● Live Now
              </span>
              <h3 style={{ margin: 0, fontSize: "1.8rem" }}>Word of Mouth Live</h3>
            </div>

            <div style={{ 
              aspectRatio: "16/9", 
              width: "100%", 
              backgroundColor: "#071426", 
              borderRadius: "8px", 
              overflow: "hidden", 
              border: "1px solid rgba(255, 255, 255, 0.05)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
            }}>
              <iframe
                src={embedUrl}
                title="Word of Mouth Live Stream"
                style={{ width: "100%", height: "100%", border: "none" }}
                allow="autoplay; fullscreen; picture-in-picture"
                loading="lazy"
                allowFullScreen
              />
            </div>
            
            <p style={{ color: "#AEB8C4", margin: 0, fontSize: "1.1rem" }}>
              Streaming conversations, interviews, and local premieres.
            </p>
          </div>

          <aside className="side-stack">
            <div className="ad-slot tall">Ads Coming Soon</div>
            <div className="schedule-card">
              <h3>Tonight&apos;s Schedule</h3>
              <ul>
                {schedule.map((slot) => (
                  <li key={slot.time}>
                    <span>{slot.time}</span>
                    <strong>{slot.show}</strong>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </section>

        <section className="plan-section">
          <div className="plan-copy">
            <p className="eyebrow">Choose Your Plan</p>
            <h2>Watch free or go premium Coming Soon.</h2>
          </div>

          <div className="plan-grid">
            <div className="plan-card free-plan">
              <div className="plan-header">
                <h3>Free</h3>
                <span className="plan-price">$0</span>
              </div>
              <ul>
                <li>Ad-supported streaming Coming Soon</li>
                <li>Live programming access </li>
                <li>Community creator portal Coming Soon</li>
              </ul>
              <button className="secondary-btn">Start Watching</button>
            </div>

            <div className="plan-card premium-plan">
              <div className="plan-header">
                <h3>Premium Comming Soon</h3>
                <span className="plan-price">$9.99/mo</span>
              </div>
              <ul>
                <li>Ad-free viewing</li>
                <li>Offline downloads</li>
                <li>Early access to premieres Coming Soon</li>
              </ul>
              <button className="premium-btn premium-inverse">Go Premium</button>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-brand">
          <div className="brand-mark">WORD OF MOUTH</div>
          <p>Streaming the stories and artists shaping your community.</p>
        </div>

        <div className="footer-links">
          <div>
            <h4>Explore</h4>
            <a href="#">Watch</a>
            <a href="#">Shows</a>
            <a href="#">Live</a>
            <a href="#">Radio</a>
          </div>
          <div>
            <h4>Company</h4>
            <a href="#">About</a>
            <a href="#">Press</a>
            <a href="#">Partners</a>
            <a href="#">Careers</a>
          </div>
          <div>
            <h4>Plans & Support</h4>
            <a href="#">Account</a>
            <a href="#">Plans</a>
            <a href="#">Help Center</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </footer>
    </>
  );
}