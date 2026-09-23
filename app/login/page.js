// app/login/page.js
"use client";

import { useState } from "react";
import { login, signup } from "./actions";

export default function LoginPage() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);

    // Call the respective server action based on the current mode
    const result = isLoginMode 
      ? await login(formData) 
      : await signup(formData);

    // If the action returns an object with an error, display it. 
    // Otherwise, the server action automatically redirects the user.
    if (result?.error) {
      setErrorMessage(result.error);
      setLoading(false);
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

        .auth-shell {
          background-color: var(--wom-jet-black);
          color: var(--wom-bright-white);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .auth-card {
          background-color: var(--wom-midnight-navy);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 50px 40px;
          width: 100%;
          max-width: 450px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }

        .auth-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .auth-header h1 {
          font-size: 2rem;
          margin: 0 0 10px 0;
          color: var(--wom-bright-white);
        }

        .auth-header p {
          color: var(--wom-metallic-silver);
          margin: 0;
          font-size: 1rem;
        }

        .auth-form {
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

        .form-input {
          background-color: var(--wom-jet-black);
          border: 1px solid rgba(255,255,255,0.1);
          color: var(--wom-bright-white);
          padding: 14px;
          border-radius: 4px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }

        .form-input:focus {
          outline: none;
          border-color: var(--wom-cyan-blue);
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

        .error-msg {
          background-color: rgba(229, 9, 20, 0.1);
          color: #ff4d4d;
          border: 1px solid rgba(229, 9, 20, 0.2);
          padding: 12px;
          border-radius: 4px;
          text-align: center;
          font-size: 0.9rem;
          margin-bottom: 20px;
        }

        .toggle-mode {
          text-align: center;
          margin-top: 25px;
          font-size: 0.95rem;
          color: var(--wom-metallic-silver);
        }

        .toggle-btn {
          background: none;
          border: none;
          color: var(--wom-cyan-blue);
          font-weight: bold;
          cursor: pointer;
          padding: 0 5px;
          font-size: 0.95rem;
        }
        
        .toggle-btn:hover {
          text-decoration: underline;
        }
      `}} />

      <main className="auth-shell">
        <div className="auth-card">
          <header className="auth-header">
            <h1>{isLoginMode ? "Welcome Back" : "Join the Network"}</h1>
            <p>{isLoginMode ? "Sign in to access your Artist Hub." : "Create an account to submit your work."}</p>
          </header>

          {errorMessage && (
            <div className="error-msg">{errorMessage}</div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                name="email"
                className="form-input" 
                placeholder="artist@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                name="password"
                className="form-input" 
                placeholder="••••••••"
                required
              />
            </div>

            <button 
              type="submit" 
              className="submit-btn" 
              disabled={loading}
            >
              {loading 
                ? "Authenticating..." 
                : (isLoginMode ? "Sign In" : "Create Account")
              }
            </button>
          </form>

          <div className="toggle-mode">
            {isLoginMode ? "Don't have an account?" : "Already have an account?"}
            <button 
              className="toggle-btn"
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setErrorMessage("");
              }}
            >
              {isLoginMode ? "Sign Up" : "Log In"}
            </button>
          </div>

        </div>
      </main>
    </>
  );
}