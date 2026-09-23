"use client";

import { useState } from "react";
import { createUploadTicket } from "./actions";

export default function ArtistSubmitPage() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
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
      // 1. Package up the form inputs into FormData so the server action can read them
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);

      // 2. Ask our server action for the secure Mux URL (and create the Supabase record)
      const uploadUrl = await createUploadTicket(formData);

      // 3. Upload the file directly from the browser to Mux
      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type, // Automatically grab the video's mime type (e.g., video/mp4)
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
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --wom-electric-blue: #087BFF;
          --wom-midnight-navy: #071426;
          --wom-jet-black: #080A0D;
          --wom-bright-white: #FFFFFF;
          --wom-cyan-blue: #20D5FF;
          --wom-metallic-silver: #AEB8C4;
        }

        .portal-shell {
          background-color: var(--wom-jet-black);
          color: var(--wom-bright-white);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
        }

        .upload-card {
          background-color: var(--wom-midnight-navy);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 40px;
          width: 100%;
          max-width: 600px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }

        .portal-header {
          margin-bottom: 30px;
        }

        .portal-header h1 {
          font-size: 2rem;
          margin: 0 0 10px 0;
          color: var(--wom-bright-white);
        }

        .portal-header p {
          color: var(--wom-metallic-silver);
          margin: 0;
          font-size: 1rem;
        }

        .upload-form {
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
          color: var(--wom-metallic-silver);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-input, .form-textarea {
          background-color: var(--wom-jet-black);
          border: 1px solid rgba(255,255,255,0.1);
          color: var(--wom-bright-white);
          padding: 14px;
          border-radius: 4px;
          font-size: 1rem;
          font-family: inherit;
          transition: border-color 0.2s;
        }

        .form-textarea {
          min-height: 120px;
          resize: vertical;
        }

        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: var(--wom-cyan-blue);
        }

        /* Custom File Input Styling */
        .file-drop-area {
          border: 2px dashed rgba(255,255,255,0.2);
          border-radius: 6px;
          padding: 40px 20px;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.2s, background-color 0.2s;
          position: relative;
        }

        .file-drop-area:hover {
          border-color: var(--wom-cyan-blue);
          background-color: rgba(32, 213, 255, 0.05);
        }

        .file-input {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          opacity: 0;
          cursor: pointer;
          width: 100%;
        }

        .file-msg {
          color: var(--wom-cyan-blue);
          font-weight: bold;
          font-size: 1.1rem;
        }

        .file-name {
          display: block;
          margin-top: 10px;
          color: var(--wom-metallic-silver);
          font-size: 0.9rem;
        }

        .submit-btn {
          background-color: var(--wom-cyan-blue);
          color: var(--wom-jet-black);
          border: none;
          padding: 16px;
          font-size: 1.1rem;
          font-weight: bold;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 10px;
          transition: opacity 0.2s;
        }

        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .status-msg {
          padding: 15px;
          border-radius: 4px;
          text-align: center;
          font-weight: bold;
          margin-top: 20px;
        }

        .status-success {
          background-color: rgba(0, 230, 118, 0.1);
          color: #00e676;
          border: 1px solid rgba(0, 230, 118, 0.2);
        }

        .status-error {
          background-color: rgba(229, 9, 20, 0.1);
          color: #ff4d4d;
          border: 1px solid rgba(229, 9, 20, 0.2);
        }
      `}} />

      <main className="portal-shell">
        <div className="upload-card">
          <header className="portal-header">
            <h1>Artist Submission Portal</h1>
            <p>Upload your content directly to the Word of Mouth streaming network.</p>
          </header>

          <form className="upload-form" onSubmit={handleUpload}>
            
            <div className="form-group">
              <label>Video File</label>
              <div className="file-drop-area">
                <input 
                  type="file" 
                  className="file-input" 
                  accept="video/*" 
                  onChange={handleFileChange}
                />
                <span className="file-msg">
                  {file ? "File Selected" : "Click to select a video file"}
                </span>
                {file && <span className="file-name">{file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)</span>}
              </div>
            </div>

            <div className="form-group">
              <label>Title</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="The name of your show or film"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Synopsis</label>
              <textarea 
                className="form-textarea" 
                placeholder="Provide a brief description of the content..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="submit-btn" 
              disabled={status === "uploading"}
            >
              {status === "uploading" ? "Uploading to Network..." : "Submit Content"}
            </button>

          </form>

          {status === "success" && (
            <div className="status-msg status-success">
              Upload complete! Your video is now processing on the network.
            </div>
          )}

          {status === "error" && (
            <div className="status-msg status-error">
              {errorMessage}
            </div>
          )}

        </div>
      </main>
    </>
  );
}