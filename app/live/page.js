"use client";

import { useState, useEffect, useRef } from "react";
import MuxPlayer from "@mux/mux-player-react";
import { supabase } from "@/lib/supabase";

export default function LiveBroadcastHub() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("Viewer" + Math.floor(Math.random() * 1000));
  const messagesEndRef = useRef(null);

  // Auto-scroll to the newest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch initial messages and subscribe to new ones
  useEffect(() => {
    if (!supabase) return;

    // Load recent chat history
    const fetchMessages = async () => {
      const { data } = await supabase
        .from("live_chat")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(50);
      
      if (data) setMessages(data);
    };

    fetchMessages();

    // Subscribe to real-time inserts
    const channel = supabase
      .channel("realtime chat")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "live_chat" },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !supabase) return;

    const messageToSend = newMessage;
    setNewMessage(""); // Clear input instantly for better UX

    await supabase.from("live_chat").insert([
      { username: username, message: messageToSend }
    ]);
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

        .live-shell {
          background-color: var(--wom-jet-black);
          color: var(--wom-bright-white);
          min-height: calc(100vh - 80px);
          display: flex;
          flex-direction: column;
        }

        /* Desktop Layout: Video left, Chat right */
        @media (min-width: 1024px) {
          .live-shell {
            flex-direction: row;
            height: calc(100vh - 80px); /* Assuming 80px header */
            overflow: hidden;
          }
        }

        /* --- VIDEO SECTION --- */
        .video-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          background-color: #000;
          overflow-y: auto;
          scrollbar-width: none;
        }

        .player-container {
          width: 100%;
          aspect-ratio: 16 / 9;
          background-color: #000;
        }

        mux-player {
          --controls: rgba(7, 20, 38, 0.9);
          --primary-color: var(--wom-cyan-blue);
          --live-button: #ff0000;
          width: 100%;
          height: 100%;
        }

        .stream-info {
          padding: 30px 40px;
          background-color: var(--wom-jet-black);
        }

        .live-badge {
          display: inline-block;
          background-color: #e50914;
          color: white;
          padding: 4px 12px;
          border-radius: 4px;
          font-weight: bold;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 15px;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.7; }
          100% { opacity: 1; }
        }

        .stream-info h1 {
          font-size: 2.2rem;
          margin: 0 0 10px 0;
        }

        .stream-info p {
          color: var(--wom-metallic-silver);
          font-size: 1.1rem;
          line-height: 1.5;
          max-width: 800px;
        }

        /* --- CHAT SECTION --- */
        .chat-section {
          width: 100%;
          height: 500px;
          background-color: var(--wom-midnight-navy);
          display: flex;
          flex-direction: column;
          border-left: 1px solid rgba(255,255,255,0.05);
        }

        @media (min-width: 1024px) {
          .chat-section {
            width: 400px;
            height: 100%;
          }
        }

        .chat-header {
          padding: 20px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          font-weight: bold;
          font-size: 1.1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .viewer-count {
          font-size: 0.85rem;
          color: var(--wom-cyan-blue);
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .message {
          font-size: 0.95rem;
          line-height: 1.4;
        }

        .message-username {
          color: var(--wom-metallic-silver);
          font-weight: bold;
          margin-right: 8px;
        }

        .chat-input-area {
          padding: 20px;
          border-top: 1px solid rgba(255,255,255,0.05);
          background-color: rgba(0,0,0,0.2);
        }

        .chat-form {
          display: flex;
          gap: 10px;
        }

        .chat-input {
          flex: 1;
          background-color: var(--wom-jet-black);
          border: 1px solid rgba(255,255,255,0.1);
          color: var(--wom-bright-white);
          padding: 12px 15px;
          border-radius: 4px;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.2s;
        }

        .chat-input:focus {
          border-color: var(--wom-cyan-blue);
        }

        .chat-submit {
          background-color: var(--wom-cyan-blue);
          color: var(--wom-jet-black);
          border: none;
          padding: 0 20px;
          border-radius: 4px;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .chat-submit:hover {
          background-color: #1cbbe0;
        }
      `}} />

      <main className="live-shell">
        <section className="video-section">
         <div className="player-container">
  <MuxPlayer
    streamType="on-demand" /* Temporarily changed from live */
    playbackId="DS00Spx1CV902MCtPj5WknGlR102V5HFkDe" /* Valid Mux Test ID */
    primaryColor="#20D5FF"
    autoPlay="any"
    muted={true} /* Muted helps auto-play work in Chrome during testing */
  />
</div>
          
          <div className="stream-info">
            <span className="live-badge">Live</span>
            <h1>Wicked Awesome Comedy Presents 2 Tears in a Bucket</h1>
            <p>Join Juan, Shad, and the rest of the crew for an exclusive live set. Streaming direct to the community.</p>
          </div>
        </section>

        <section className="chat-section">
          <header className="chat-header">
            <span>Live Chat</span>
            <span className="viewer-count">● 1,204 watching</span>
          </header>
          
          <div className="chat-messages">
            {messages.length === 0 ? (
              <div style={{ color: 'var(--wom-metallic-silver)', textAlign: 'center', marginTop: '20px' }}>
                Welcome to the live chat!
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="message">
                  <span className="message-username">{msg.username}</span>
                  <span className="message-text">{msg.message}</span>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-area">
            <form onSubmit={handleSendMessage} className="chat-form">
              <input
                type="text"
                className="chat-input"
                placeholder="Send a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                maxLength={200}
              />
              <button type="submit" className="chat-submit">Send</button>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}