"use client";

import { useTransition } from "react";
import MuxPlayer from "@mux/mux-player-react";
import { approveShow, denyShow, setFeaturedShow, uploadPoster } from "./actions";

function ScreeningRoomCard({ show }) {
  const [isPending, startTransition] = useTransition();
  const mp4Url = show.mux_playback_id
    ? `https://stream.mux.com/${show.mux_playback_id}/high.mp4`
    : null;

  return (
    <div className="screening-card">
      <div className="screening-player">
        {show.mux_playback_id ? (
          <MuxPlayer playbackId={show.mux_playback_id} streamType="on-demand" />
        ) : (
          <div className="screening-processing">⚙ Still processing on Mux…</div>
        )}
      </div>

      <div className="screening-info">
        <h4>{show.title}</h4>
        <p>{show.description}</p>
        <p className="screening-meta">
          {show.genre || "Uncategorized"} • Submitted {new Date(show.created_at).toLocaleDateString()}
        </p>

        <div className="screening-actions">
          {mp4Url && (
            <a href={mp4Url} download className="secondary-btn" style={{ padding: "8px 16px", fontSize: "0.85rem" }}>
              Download MP4
            </a>
          )}
          <button
            className="primary-btn"
            style={{ padding: "8px 16px", fontSize: "0.85rem" }}
            disabled={isPending}
            onClick={() => startTransition(() => approveShow(show.id))}
          >
            Approve
          </button>
          <button
            className="deny-btn"
            disabled={isPending}
            onClick={() => startTransition(() => denyShow(show.id))}
          >
            Deny
          </button>
        </div>
      </div>
    </div>
  );
}

function PublishedRow({ show }) {
  const [isPending, startTransition] = useTransition();

  const handlePosterChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("poster", file);
    startTransition(() => uploadPoster(show.id, formData));
  };

  return (
    <div className="published-row">
      {show.poster_url ? (
        <img src={show.poster_url} alt="" className="poster-thumb" />
      ) : (
        <div className="poster-thumb poster-thumb-empty" aria-hidden="true" />
      )}

      <div style={{ flex: 1 }}>
        <h4 style={{ margin: "0 0 4px 0" }}>{show.title}</h4>
        <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--wom-metallic-silver)" }}>
          {show.genre || "Uncategorized"}
        </p>
      </div>

      <label className="poster-upload-btn">
        {isPending ? "Uploading..." : "Upload Poster"}
        <input type="file" accept="image/*" onChange={handlePosterChange} disabled={isPending} hidden />
      </label>

      <button
        className={show.is_featured ? "featured-btn active" : "featured-btn"}
        disabled={isPending || show.is_featured}
        onClick={() => startTransition(() => setFeaturedShow(show.id))}
      >
        {show.is_featured ? "★ Featured" : "⭐ Set as Featured"}
      </button>
    </div>
  );
}

export default function AdminQueue({ pendingShows, publishedShows }) {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .screening-card {
          display: grid;
          grid-template-columns: 360px 1fr;
          gap: 20px;
          background-color: var(--wom-jet-black);
          border-radius: 6px;
          padding: 20px;
        }

        .screening-player {
          aspect-ratio: 16/9;
          border-radius: 6px;
          overflow: hidden;
          background: #000;
        }

        .screening-processing {
          display: grid;
          place-items: center;
          height: 100%;
          color: var(--wom-metallic-silver);
          font-size: 0.9rem;
        }

        .screening-info h4 {
          margin: 0 0 8px 0;
          font-size: 1.2rem;
        }

        .screening-info p {
          margin: 0 0 8px 0;
          color: var(--wom-metallic-silver);
          font-size: 0.9rem;
        }

        .screening-meta {
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-size: 0.75rem !important;
        }

        .screening-actions {
          display: flex;
          gap: 10px;
          margin-top: 15px;
          flex-wrap: wrap;
        }

        .deny-btn {
          background: transparent;
          border: 1px solid rgba(255, 77, 77, 0.4);
          color: #ff4d4d;
          padding: 8px 16px;
          border-radius: 4px;
          font-size: 0.85rem;
          font-weight: bold;
          cursor: pointer;
        }

        .deny-btn:hover {
          background: rgba(255, 77, 77, 0.1);
        }

        .published-row {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          background-color: var(--wom-jet-black);
          border-radius: 6px;
        }

        .poster-thumb {
          width: 72px;
          height: 40px;
          border-radius: 4px;
          object-fit: cover;
          background: rgba(255, 255, 255, 0.05);
          flex-shrink: 0;
        }

        .poster-thumb-empty {
          border: 1px dashed rgba(255, 255, 255, 0.15);
        }

        .poster-upload-btn {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: var(--wom-bright-white);
          padding: 8px 16px;
          border-radius: 4px;
          font-size: 0.85rem;
          font-weight: bold;
          cursor: pointer;
          white-space: nowrap;
        }

        .poster-upload-btn:hover {
          border-color: var(--wom-cyan-blue);
        }

        .featured-btn {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: var(--wom-bright-white);
          padding: 8px 16px;
          border-radius: 4px;
          font-size: 0.85rem;
          font-weight: bold;
          cursor: pointer;
        }

        .featured-btn:hover {
          border-color: var(--wom-cyan-blue);
        }

        .featured-btn.active {
          background: var(--wom-cyan-blue);
          color: var(--wom-jet-black);
          border-color: var(--wom-cyan-blue);
          cursor: default;
        }

        @media (max-width: 720px) {
          .screening-card {
            grid-template-columns: 1fr;
          }
        }
      `,
        }}
      />

      <div style={{ backgroundColor: "var(--wom-midnight-navy)", borderRadius: "8px", padding: "30px", border: "1px solid var(--border-soft)", marginBottom: "30px" }}>
        <h3 style={{ borderBottom: "1px solid var(--border-soft)", paddingBottom: "15px", marginBottom: "20px" }}>
          Screening Room — Pending Approval
        </h3>

        {pendingShows.length === 0 ? (
          <p style={{ color: "var(--wom-metallic-silver)" }}>No pending videos to review.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {pendingShows.map((show) => (
              <ScreeningRoomCard key={show.id} show={show} />
            ))}
          </div>
        )}
      </div>

      <div style={{ backgroundColor: "var(--wom-midnight-navy)", borderRadius: "8px", padding: "30px", border: "1px solid var(--border-soft)" }}>
        <h3 style={{ borderBottom: "1px solid var(--border-soft)", paddingBottom: "15px", marginBottom: "20px" }}>
          Featured Content Controller
        </h3>

        {publishedShows.length === 0 ? (
          <p style={{ color: "var(--wom-metallic-silver)" }}>No published shows yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {publishedShows.map((show) => (
              <PublishedRow key={show.id} show={show} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
