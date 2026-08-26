import Link from "next/link";

export default function LivePage() {
  const liveStreamUrl = "https://connecttoyourcity.com/channel/695c8f4e0630443ffb4c4ca3";

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

        .live-shell {
          background-color: var(--wom-jet-black);
          color: var(--wom-bright-white);
          min-height: 100vh;
          padding: 60px 40px;
          font-family: system-ui, -apple-system, sans-serif;
        }

        .live-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .live-header {
          margin-bottom: 30px;
        }

        .live-badge {
          display: inline-block;
          background-color: rgba(255, 77, 77, 0.1);
          color: #ff4d4d;
          padding: 6px 14px;
          border-radius: 4px;
          font-size: 0.85rem;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 15px;
          border: 1px solid rgba(255, 77, 77, 0.2);
        }

        .live-header h1 {
          font-size: 3rem;
          font-weight: 800;
          margin: 0 0 10px 0;
        }

        .live-header p {
          color: var(--wom-metallic-silver);
          font-size: 1.1rem;
        }

        .player-wrapper {
          aspect-ratio: 16 / 9;
          background-color: var(--wom-midnight-navy);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          overflow: hidden;
          margin-bottom: 30px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.5);
        }

        .external-action-box {
          background-color: var(--wom-midnight-navy);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }

        .external-action-box h3 {
          margin: 0 0 5px 0;
          font-size: 1.3rem;
        }

        .external-action-box p {
          margin: 0;
          color: var(--wom-metallic-silver);
          font-size: 0.95rem;
        }

        .btn-primary {
          background-color: var(--wom-cyan-blue);
          color: var(--wom-jet-black);
          padding: 12px 28px;
          font-size: 1rem;
          font-weight: bold;
          border-radius: 4px;
          text-decoration: none;
          transition: background-color 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
        }

        .btn-primary:hover {
          background-color: #1cbbe0;
        }

        @media (max-width: 640px) {
          .live-shell {
            padding: 32px 16px;
          }

          .live-header h1 {
            font-size: 2.35rem;
          }

          .live-header p {
            font-size: 1rem;
            line-height: 1.5;
          }

          .external-action-box {
            align-items: stretch;
            padding: 20px;
          }

          .external-action-box .btn-primary {
            width: 100%;
          }
        }
      `}} />

      <main className="live-shell">
        <div className="live-container">
          
          <header className="live-header">
            <span className="live-badge">● Live Broadcast</span>
            <h1>Word of Mouth Live</h1>
            <p>Streaming conversations, live performances, and local premieres directly from our broadcast partners.</p>
          </header>

          {/* Embedded Stream Window */}
          <div className="player-wrapper">
            <iframe
              src={liveStreamUrl}
              title="Word of Mouth Live Stream"
              style={{ width: "100%", height: "100%", border: "none" }}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Fallback / Direct External Action Bar */}
          <div className="external-action-box">
            <div>
              <h3>Having trouble viewing the embedded stream?</h3>
              <p>You can open the direct broadcast channel in a dedicated browser window.</p>
            </div>
            <a 
              href={liveStreamUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-primary"
            >
              Open Fullscreen Stream ↗
            </a>
          </div>

        </div>
      </main>
    </>
  );
}