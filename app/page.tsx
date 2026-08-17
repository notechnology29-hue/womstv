import { fetchFeaturedShows } from "@/lib/supabase";

const navItems = ["Merch", "Shows", "Live", "Schedule", "Radio", "About"];

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

  return (
    <>
      <header className="topbar">
        <div className="brand-mark">WORD OF MOUTH</div>
        <nav className="main-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <a href="#" key={item}>
              {item}
            </a>
          ))}
        </nav>
        <div className="topbar-actions">
          <button className="artist-btn">Artist Hub</button>
          <button className="premium-btn">Go Premium</button>
        </div>
      </header>

      <main className="page-shell">
        <section className="hero">
          <div className="hero-overlay" />
          <div className="hero-content">
            <p className="eyebrow">Featured Indie Premiere</p>
            <h1>Lead Program Title</h1>
            <p className="hero-copy">
              Short description, host name, episode information, and release schedule.
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
            <p className="eyebrow">Artist Hub</p>
            <h2>Submit your story to the next wave of creators.</h2>
            <p>
              Upload your work, review submissions, and connect with a community built
              around independent voices.
            </p>
            <button className="primary-btn">Access Artist Portal</button>
          </div>
          <div className="ad-slot">Ad Placeholder</div>
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
          <div className="live-player">
            <span className="live-badge">Live Now</span>
            <div className="live-meta">
              <h3>Word of Mouth Live</h3>
              <p>Streaming conversations, interviews, and local premieres.</p>
            </div>
          </div>

          <aside className="side-stack">
            <div className="ad-slot tall">Ad Placeholder</div>
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
            <h2>Watch free or go premium.</h2>
          </div>

          <div className="plan-grid">
            <div className="plan-card free-plan">
              <div className="plan-header">
                <h3>Free</h3>
                <span className="plan-price">$0</span>
              </div>
              <ul>
                <li>Ad-supported streaming</li>
                <li>Live programming access</li>
                <li>Community creator portal</li>
              </ul>
              <button className="secondary-btn">Start Watching</button>
            </div>

            <div className="plan-card premium-plan">
              <div className="plan-header">
                <h3>Premium</h3>
                <span className="plan-price">$9.99/mo</span>
              </div>
              <ul>
                <li>Ad-free viewing</li>
                <li>Offline downloads</li>
                <li>Early access to premieres</li>
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
