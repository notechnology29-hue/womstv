"use client";

import { useState } from "react";
import { createUploadTicket } from "./actions";

export default function SubmitPage() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [cast, setCast] = useState("");
  const [status, setStatus] = useState("idle"); // idle, uploading, success, error
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setErrorMessage("Please select a video file.");
      return;
    }

    setStatus("uploading");
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("genre", genre);
      formData.append("cast", cast);

      // Creates the pending Supabase row + asks Mux for a direct upload URL.
      const uploadUrl = await createUploadTicket(formData);

      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (uploadResponse.ok) {
        setStatus("success");
      } else {
        throw new Error("Failed to push file to Mux.");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMessage(err.message || "An error occurred during upload.");
    }
  };

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .submit-shell {
          background-color: var(--wom-jet-black, #080A0D);
          color: var(--wom-bright-white, #FFFFFF);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
        }

        .submit-card {
          background-color: var(--wom-midnight-navy, #071426);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 40px;
          width: 100%;
          max-width: 640px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }

        .submit-card h1 {
          font-size: 2rem;
          margin: 0 0 10px 0;
        }

        .submit-card > p {
          color: var(--wom-metallic-silver, #AEB8C4);
          margin: 0 0 30px 0;
        }

        .submit-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-size: 0.9rem;
          font-weight: bold;
          color: var(--wom-metallic-silver, #AEB8C4);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-input, .form-textarea {
          background-color: var(--wom-jet-black, #080A0D);
          border: 1px solid rgba(255,255,255,0.1);
          color: var(--wom-bright-white, #FFFFFF);
          padding: 14px;
          border-radius: 4px;
          font-size: 1rem;
          font-family: inherit;
        }

        .form-textarea {
          min-height: 100px;
          resize: vertical;
        }

        .file-drop-area {
          border: 2px dashed rgba(255,255,255,0.2);
          border-radius: 6px;
          padding: 30px 20px;
          text-align: center;
          cursor: pointer;
          position: relative;
        }

        .file-input {
          position: absolute;
          inset: 0;
          opacity: 0;
          cursor: pointer;
          width: 100%;
        }

        .submit-btn {
          background-color: var(--wom-cyan-blue, #20D5FF);
          color: var(--wom-jet-black, #080A0D);
          border: none;
          padding: 16px;
          font-size: 1.1rem;
          font-weight: bold;
          border-radius: 4px;
          cursor: pointer;
        }

        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .status-message {
          padding: 14px;
          border-radius: 4px;
          font-size: 0.95rem;
        }

        .status-message.success {
          background: rgba(0, 230, 118, 0.1);
          color: #00e676;
        }

        .status-message.error {
          background: rgba(255, 77, 77, 0.1);
          color: #ff4d4d;
        }
      `,
        }}
      />

      <main className="submit-shell">
        <div className="submit-card">
          <h1>Submit Your Show</h1>
          <p>Send your work into the review queue for a shot at the Word of Mouth network.</p>

          {status === "success" ? (
            <div className="status-message success">
              Upload received! Your submission is now pending review in the Screening Room.
            </div>
          ) : (
            <form className="submit-form" onSubmit={handleUpload}>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  id="title"
                  className="form-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  className="form-textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="genre">Genre</label>
                <input
                  id="genre"
                  className="form-input"
                  placeholder="Comedy, Documentary, Music..."
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="cast">Cast</label>
                <input
                  id="cast"
                  className="form-input"
                  placeholder="Comma-separated names"
                  value={cast}
                  onChange={(e) => setCast(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Video File</label>
                <div className="file-drop-area">
                  <input type="file" accept="video/*" className="file-input" onChange={handleFileChange} required />
                  <span>{file ? file.name : "Click or drop a video file"}</span>
                </div>
              </div>

              {status === "error" && <div className="status-message error">{errorMessage}</div>}

              <button type="submit" className="submit-btn" disabled={status === "uploading"}>
                {status === "uploading" ? "Uploading..." : "Submit for Review"}
              </button>
            </form>
          )}
        </div>
      </main>
    </>
  );
}
