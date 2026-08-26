import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function Navbar() {
  // 1. Initialize Supabase to check for an active session
  let user = null;
  
  if (supabase) {
    try {
      const { data } = await supabase.auth.getUser();
      user = data?.user;
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .global-nav {
          background-color: #080A0D; /* Jet Black */
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          position: sticky;
          top: 0;
          z-index: 1000;
          font-family: system-ui, -apple-system, sans-serif;
        }

        .nav-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 40px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .nav-brand {
          font-size: 1.5rem;
          font-weight: 900;
          color: #FFFFFF;
          text-decoration: none;
          letter-spacing: -0.5px;
        }

        .nav-brand span {
          color: #20D5FF; /* Cyan Blue */
        }

        .nav-links {
          display: none;
          gap: 30px;
        }

        /* Show links on desktop */
        @media (min-width: 768px) {
          .nav-links {
            display: flex;
            align-items: center;
          }
        }

        .nav-link {
          color: #AEB8C4; /* Metallic Silver */
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 600;
          transition: color 0.2s;
        }

        .nav-link:hover {
          color: #FFFFFF;
        }

        .nav-auth {
          display: flex;
          align-items: center;
        }

        .btn-nav-login {
          background-color: transparent;
          color: #FFFFFF;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 8px 20px;
          border-radius: 4px;
          font-size: 0.9rem;
          font-weight: bold;
          text-decoration: none;
          transition: border-color 0.2s;
        }

        .btn-nav-login:hover {
          border-color: #FFFFFF;
        }

        .btn-nav-dashboard {
          background-color: #20D5FF;
          color: #080A0D;
          padding: 8px 20px;
          border-radius: 4px;
          font-size: 0.9rem;
          font-weight: bold;
          text-decoration: none;
          transition: background-color 0.2s;
        }

        .btn-nav-dashboard:hover {
          background-color: #1cbbe0;
        }

        @media (max-width: 767px) {
          .nav-container {
            min-height: 64px;
            height: auto;
            padding: 12px 16px;
            gap: 12px;
            flex-wrap: wrap;
          }

          .nav-brand {
            font-size: 1.25rem;
          }

          .nav-links {
            display: flex;
            order: 3;
            flex: 1 0 100%;
            justify-content: space-between;
            gap: 8px;
            padding-top: 4px;
          }

          .nav-link {
            padding: 8px 4px;
            font-size: 0.82rem;
          }

          .btn-nav-login,
          .btn-nav-dashboard {
            padding: 8px 12px;
            font-size: 0.78rem;
          }
        }
      `}} />

      <header className="global-nav">
        <div className="nav-container">
          {/* Logo */}
          <Link href="/" className="nav-brand">
            WOM<span>.</span>
          </Link>

          {/* Main Links */}
          <nav className="nav-links">
            <Link href="/shows" className="nav-link">Catalog</Link>
            <Link href="/live" className="nav-link">Live Hub</Link>
            <Link href="/schedule" className="nav-link">Schedule</Link>
          </nav>

          {/* Auth Button */}
          <div className="nav-auth">
            {user ? (
              <Link href="/artist/dashboard" className="btn-nav-dashboard">
                Dashboard
              </Link>
            ) : (
              <Link href="/login" className="btn-nav-login">
                Artist Login
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
