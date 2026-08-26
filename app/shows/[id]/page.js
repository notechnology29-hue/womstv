import { fetchShowById } from "@/lib/supabase";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function WatchPage({ params }) {
  const { id } = params;
  const show = await fetchShowById(id);

  if (!show) {
    return notFound();
  }

  const isReady = show.muxPlaybackId && show.muxPlaybackId.trim() !== "";

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
          padding: 60px 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .watch-container {
          max-width: 1000px;
          width: 100%;
        }

        .player-wrapper {
          aspect-ratio: 16 / 9;
          background-color: var(--wom-midnight-navy);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          margin-bottom: 30px;
        }

        .processing-state {
          text-align: center;
          color: var(--wom-metallic-silver);
          padding: 40px;
        }

        .processing-state h2 {
          color: var(--wom-bright-white);
          margin-bottom: 10px;
        }

        .show-details h1 {
          font-size: 2.2rem;
          margin: 0 0 10px 0;
        }

        .show-details p {
          color: var(--wom-metallic-silver);
          font-size: 1.1rem;
          line-height: 1.6;
        }
      `}} />

      <main className="watch-shell">
        <div className="watch-container">
          
          <div className="player-wrapper">
            {isReady ? (
              // Insert your Mux player here (e.g., <mux-player playback-id={show.mux_playback_id} ... />)
              <iframe
                src={`https://stream.mux.com/${show.muxPlaybackId}.html`}
                style={{ width: "100%", height: "100%", border: "none" }}
                allowFullScreen
              />
            ) : (
              <div className="processing-state">
                <h2>⚙ Video is Processing</h2>
                <p>This title has been uploaded and is currently encoding on the network. Check back in a few moments.</p>
              </div>
            )}
          </div>

          <div className="show-details">
            <h1>{show.title}</h1>
            <p>{show.description || show.meta}</p>
          </div>

        </div>
      </main>
    </>
  );
}