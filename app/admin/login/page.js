"use client";

import { useState } from "react";
import { adminLogin } from "./actions";

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const result = await adminLogin(formData);

    if (result?.error) {
      setErrorMessage(result.error);
      setLoading(false);
    }
  };

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        :root {
          --wom-electric-blue: #087BFF;
          --wom-midnight-navy: #071426;
          --wom-jet-black: #080A0D;
          --wom-bright-white: #FFFFFF;
          --wom-cyan-blue: #20D5FF;
          --wom-metallic-silver: #AEB8C4;
        }

        .admin-auth-shell {
          background-color: var(--wom-jet-black);
          color: var(--wom-bright-white);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .admin-auth-card {
          background-color: var(--wom-midnight-navy);
          border: 1px solid rgba(255, 77, 77, 0.15);
          border-radius: 8px;
          padding: 50px 40px;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }

        .admin-auth-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .admin-auth-header .badge {
          display: inline-block;
          background: rgba(255, 77, 77, 0.1);
          color: #ff4d4d;
          border: 1px solid rgba(255, 77, 77, 0.3);
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 15px;
        }

        .admin-auth-header h1 {
          font-size: 1.8rem;
          margin: 0 0 10px 0;
        }

        .admin-auth-header p {
          color: var(--wom-metallic-silver);
          margin: 0;
          font-size: 0.95rem;
        }

        .admin-auth-form {
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
          font-size: 0.85rem;
          font-weight: bold;
          color: var(--wom-metallic-silver);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-input {
          background-color: var(--wom-jet-black);
          border: 1px solid rgba(255,255,255,0.1);
          color: var(--wom-bright-white);
          padding: 14px;
          border-radius: 4px;
          font-size: 1rem;
        }

        .form-input:focus {
          outline: none;
          border-color: #ff4d4d;
        }

        .admin-submit-btn {
          background-color: #ff4d4d;
          color: var(--wom-bright-white);
          border: none;
          padding: 16px;
          font-size: 1.05rem;
          font-weight: bold;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 10px;
        }

        .admin-submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .error-msg {
          background-color: rgba(255, 77, 77, 0.1);
          color: #ff4d4d;
          border: 1px solid rgba(255, 77, 77, 0.2);
          padding: 12px;
          border-radius: 4px;
          text-align: center;
          font-size: 0.9rem;
          margin-bottom: 20px;
        }
      `,
        }}
      />

      <main className="admin-auth-shell">
        <div className="admin-auth-card">
          <header className="admin-auth-header">
            <span className="badge">Restricted</span>
            <h1>Network Admin Console</h1>
            <p>Sign in with an admin account to review submissions.</p>
          </header>

          {errorMessage && <div className="error-msg">{errorMessage}</div>}

          <form className="admin-auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" className="form-input" placeholder="admin@example.com" required />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" className="form-input" placeholder="••••••••" required />
            </div>

            <button type="submit" className="admin-submit-btn" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
