"use client";

import { useRef } from "react";
import MuxPlayer from "@mux/mux-player-react";

export default function InteractivePlayer({ show, relatedShows }) {
  // 1. Create a reference to target the Mux Player DOM element
  const playerRef = useRef(null);

  // 2. Function to request full screen across different browsers (Chrome, Safari, iOS)
  const triggerFullScreen = () => {
    const player = playerRef.current;
    if (!player) return;

    if (player.requestFullscreen) {
      player.requestFullscreen();
    } else if (player.webkitRequestFullscreen) { /* Safari & iOS */
      player.webkitRequestFullscreen();
    } else if (player.msRequestFullscreen) { /* Edge */
      player.msRequestFullscreen();
    }
  };

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

        .watch-shell {
          background-color: var(--wom-jet-black);
          color: var(--wom-bright-white);
          min-height: 100vh;
        }

        .player-wrapper {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          background-color: #000;
          aspect-ratio: 16 / 9;
        }

        mux-player {
          --controls: rgba(7, 20, 38, 0.9);
          --primary-color: var(--wom-cyan-blue);
          width: 100%;
          height: 100%;
        }

        .show-header {
          max-width: 1400px;
          margin: 0 auto;
          padding: 30px 40px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .show-title {
          font-size: 2.5rem;
          margin: 0 0 10px 0;
          font-weight: 800;
        }

        .show-meta-row {
          display: flex;
          align-items: center;
          gap: 15px;
          color: var(--wom-metallic-silver);
          font-size: 1rem;
          margin-bottom: 20px;
        }

        .tag {
          background-color: var(--wom-midnight-navy);
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 0.85rem;
          color: var(--wom-cyan-blue);
          border: 1px solid rgba(32, 213, 255, 0.2);
        }

        .action-row {
          display: flex;
          gap: 15px;
          margin-bottom: 30px;
          flex-wrap: wrap; /* Helps buttons stack nicely on small mobile screens */
        }

        .btn-primary {
          background-color: var(--wom-cyan-blue);
          color: var(--wom-jet-black);
          border: none;
          padding: 12px 28px;
          font-size: 1rem;
          font-weight: bold;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .btn-primary:hover {
          background-color: #1cbbe0;
        }

        .btn-secondary {
          background-color: transparent;
          color: var(--wom-bright-white);
          border: 1px solid rgba(255,255,255,0.2);
          padding: 12px 28px;
          font-size: 1rem;
          font-weight: bold;
          border-radius: 4px;
          cursor: pointer;
          transition: border-color 0.2s;
        }

        .btn-secondary:hover {
          border-color: var(--wom-bright-white);
        }

        .show-details-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
          max-width: 1400px;
          margin: 0 auto;
        }

        @media (min-width: 768px) {
          .show-details-grid {
             grid-template-columns: 2fr 1fr;
          }
        }

        .synopsis p { line-height: 1.6; font-size: 1.1rem; opacity: 0.9; }
        .credits h4 { color: var(--wom-metallic-silver); margin: 0 0 5px 0; font-size: 0.9rem; text-transform: uppercase; }
        .credits p { margin: 0 0 20px 0; font-size: 1rem; }

        .related-section {
          max-width: 1400px;
          margin: 60px auto 40px auto;
          padding: 0 40px;
        }

        .related-section h3 {
          font-size: 1.4rem;
          margin-bottom: 20px;
        }

        .video-row {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          scrollbar-width: none;
        }

        .video-card {
            min-width: 300px;
            background-color: var(--wom-midnight-navy);
            border-radius: 6px;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.05);
            transition: border-color 0.3s;
            text-decoration: none;
            color: inherit;
        }

        .video-card:hover {
            border-color: var(--wom-cyan-blue);
        }

        .thumbnail {
            height: 170px;
            background-color: #0b1d36;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0.5;
        }

        .card-info { padding: 16px; }
        .card-info h4 { margin: 0 0 6px 0; font-size: 1.1rem; }
        .card-info p { margin: 0; font-size: 0.9rem; opacity: 0.6; }
      `}} />

      <main className="watch-shell">
        <div className="player-wrapper">
          {/* 3. Attach the ref to the MUX Player */}
          <MuxPlayer
            ref={playerRef}
            streamType="on-demand"
            playbackId={show.muxPlaybackId}
            metadata={{
              video_id: show.id,
              video_title: show.title,
            }}
            primaryColor="#20D5FF"
          />
        </div>

        <section className="show-header">
          <h1 className="show-title">{show.title}</h1>
          
          <div className="show-meta-row">
            <span>{show.meta}</span>
            {show.tags?.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>

          <div className="action-row">
            <button className="btn-primary" onClick={() => playerRef.current?.play()}>▶ Play</button>
            
            {/* 4. The new Full Screen Button */}
            <button className="btn-secondary" onClick={triggerFullScreen}>
               ⛶ Full Screen
            </button>
            
            <button className="btn-secondary">+ Add to List</button>
          </div>

          <div className="show-details-grid">
            <div className="synopsis">
              <p>{show.description}</p>
            </div>
            <div className="credits">
              <h4>Director</h4>
              <p>{show.director}</p>
              
              <h4>Featuring</h4>
              <p>{show.cast?.join(", ")}</p>
            </div>
          </div>
        </section>

        <section className="related-section">
          <h3>Related Content</h3>
          <div className="video-row">
            {relatedShows.map((item) => (
              <a key={item.id} href={`/shows/${item.id}`} className="video-card">
                <div className="thumbnail">16:9 Thumbnail</div>
                <div className="card-info">
                  <h4>{item.title}</h4>
                  <p>{item.meta}</p>
                </div>
              </a>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}