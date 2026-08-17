"use client";

import { useState } from "react";

// Mock Schedule Data (Later, this will be fetched from Supabase)
const scheduleData = [
  {
    date: "Today",
    events: [
      {
        id: 1,
        time: "7:00 PM",
        type: "LIVE",
        title: "Wicked Awesome Comedy: Live",
        description: "A live broadcast of tonight's stand-up showcase from the main stage.",
        duration: 90, // minutes
      },
      {
        id: 2,
        time: "9:00 PM",
        type: "PREMIERE",
        title: "Night Signal: Episode 4",
        description: "The highly anticipated new episode drops exclusively on Word of Mouth.",
        duration: 45,
      }
    ]
  },
  {
    date: "Tomorrow",
    events: [
      {
        id: 3,
        time: "6:00 PM",
        type: "LIVE",
        title: "The Studio Session",
        description: "Live acoustic performances and interviews with local indie artists.",
        duration: 60,
      },
      {
        id: 4,
        time: "8:00 PM",
        type: "PREMIERE",
        title: "Documentary: The Last Echo",
        description: "A deep dive into the underground music scene shaping the city.",
        duration: 120,
      }
    ]
  }
];

export default function SchedulePage() {
  const [reminderEmail, setReminderEmail] = useState("");
  const [activeModal, setActiveModal] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Helper function to generate a Google Calendar template link
  const generateGoogleCalendarLink = (event) => {
    const text = encodeURIComponent(`Word of Mouth: ${event.title}`);
    const details = encodeURIComponent(event.description);
    // In production, you would convert the event's actual date/time to UTC format (YYYYMMDDTHHmmssZ)
    // Here we use a generic placeholder time for the prototype
    const dates = "20260820T020000Z/20260820T033000Z"; 
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&details=${details}&dates=${dates}`;
  };

  const handleSetReminder = (e) => {
    e.preventDefault();
    if (reminderEmail) {
      // Here you would send this to your Supabase backend to trigger an email cron job
      setSuccessMessage("Reminder set! We'll email you 15 minutes before the show starts.");
      setTimeout(() => {
        setSuccessMessage("");
        setActiveModal(null);
        setReminderEmail("");
      }, 3000);
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

        .schedule-shell {
          background-color: var(--wom-jet-black);
          color: var(--wom-bright-white);
          min-height: 100vh;
          padding: 60px 20px;
        }

        .schedule-header {
          max-width: 800px;
          margin: 0 auto 60px auto;
          text-align: center;
        }

        .schedule-header h1 {
          font-size: 3rem;
          margin: 0 0 15px 0;
          font-weight: 800;
        }

        .schedule-header p {
          color: var(--wom-metallic-silver);
          font-size: 1.1rem;
          line-height: 1.6;
        }

        /* Timeline Layout */
        .timeline-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .date-group {
          margin-bottom: 50px;
        }

        .date-header {
          font-size: 1.5rem;
          color: var(--wom-bright-white);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 10px;
          margin-bottom: 30px;
        }

        .event-item {
          display: flex;
          gap: 25px;
          margin-bottom: 30px;
          position: relative;
        }

        /* The vertical timeline line */
        .event-item::before {
          content: '';
          position: absolute;
          left: 110px;
          top: 30px;
          bottom: -40px;
          width: 2px;
          background-color: rgba(32, 213, 255, 0.15);
        }
        
        /* Hide the line on the last item of a group */
        .event-item:last-child::before {
          display: none;
        }

        .event-time {
          width: 85px;
          flex-shrink: 0;
          text-align: right;
          padding-top: 5px;
        }

        .event-time h3 {
          margin: 0;
          font-size: 1.2rem;
          color: var(--wom-cyan-blue);
        }

        .event-time p {
          margin: 5px 0 0 0;
          font-size: 0.85rem;
          color: var(--wom-metallic-silver);
        }

        /* The timeline dot */
        .timeline-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background-color: var(--wom-cyan-blue);
          margin-top: 10px;
          position: relative;
          z-index: 2;
          box-shadow: 0 0 10px rgba(32, 213, 255, 0.5);
        }

        .event-card {
          flex: 1;
          background-color: var(--wom-midnight-navy);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 25px;
          transition: border-color 0.3s;
        }

        .event-card:hover {
          border-color: rgba(32, 213, 255, 0.4);
        }

        .event-type {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: bold;
          letter-spacing: 1px;
          padding: 4px 10px;
          border-radius: 4px;
          margin-bottom: 12px;
        }

        .type-live {
          background-color: rgba(229, 9, 20, 0.15);
          color: #ff4d4d;
          border: 1px solid rgba(229, 9, 20, 0.3);
        }

        .type-premiere {
          background-color: rgba(32, 213, 255, 0.1);
          color: var(--wom-cyan-blue);
          border: 1px solid rgba(32, 213, 255, 0.2);
        }

        .event-card h4 {
          font-size: 1.4rem;
          margin: 0 0 10px 0;
        }

        .event-card p {
          color: var(--wom-metallic-silver);
          line-height: 1.5;
          margin: 0 0 20px 0;
        }

        .event-actions {
          display: flex;
          gap: 15px;
        }

        .action-btn {
          background-color: transparent;
          color: var(--wom-bright-white);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 10px 20px;
          border-radius: 4px;
          font-size: 0.9rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .action-btn:hover {
          border-color: var(--wom-cyan-blue);
          color: var(--wom-cyan-blue);
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(5px);
        }

        .modal-content {
          background-color: var(--wom-midnight-navy);
          padding: 40px;
          border-radius: 8px;
          width: 100%;
          max-width: 450px;
          border: 1px solid rgba(32, 213, 255, 0.2);
        }

        .modal-content h3 {
          margin: 0 0 15px 0;
          font-size: 1.5rem;
        }

        .modal-content p {
          color: var(--wom-metallic-silver);
          margin: 0 0 25px 0;
          line-height: 1.5;
        }

        .reminder-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .reminder-input {
          background-color: var(--wom-jet-black);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          padding: 14px;
          border-radius: 4px;
          font-size: 1rem;
        }

        .reminder-input:focus {
          outline: none;
          border-color: var(--wom-cyan-blue);
        }

        .submit-btn {
          background-color: var(--wom-cyan-blue);
          color: var(--wom-jet-black);
          border: none;
          padding: 14px;
          border-radius: 4px;
          font-weight: bold;
          font-size: 1rem;
          cursor: pointer;
        }

        .cancel-btn {
          background-color: transparent;
          color: var(--wom-metallic-silver);
          border: none;
          margin-top: 10px;
          cursor: pointer;
        }
        
        .success-msg {
          color: #00e676;
          background-color: rgba(0, 230, 118, 0.1);
          padding: 15px;
          border-radius: 4px;
          text-align: center;
          font-weight: bold;
        }
      `}} />

      <main className="schedule-shell">
        <header className="schedule-header">
          <h1>Programming Guide</h1>
          <p>Don't miss a moment. Track upcoming live broadcasts, exclusive premieres, and special events across the network.</p>
        </header>

        <div className="timeline-container">
          {scheduleData.map((group) => (
            <div key={group.date} className="date-group">
              <h2 className="date-header">{group.date}</h2>
              
              {group.events.map((event) => (
                <div key={event.id} className="event-item">
                  
                  <div className="event-time">
                    <h3>{event.time}</h3>
                    <p>{event.duration} min</p>
                  </div>
                  
                  <div className="timeline-dot"></div>
                  
                  <div className="event-card">
                    <span className={`event-type ${event.type === 'LIVE' ? 'type-live' : 'type-premiere'}`}>
                      {event.type}
                    </span>
                    <h4>{event.title}</h4>
                    <p>{event.description}</p>
                    
                    <div className="event-actions">
                      <button 
                        className="action-btn"
                        onClick={() => setActiveModal(event)}
                      >
                        🔔 Remind Me
                      </button>
                      
                      <a 
                        href={generateGoogleCalendarLink(event)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="action-btn"
                      >
                        📅 Add to Calendar
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </main>

      {/* Reminder Modal */}
      {activeModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            {successMessage ? (
              <div className="success-msg">{successMessage}</div>
            ) : (
              <>
                <h3>Set a Reminder</h3>
                <p>We will email you a direct link to <strong>{activeModal.title}</strong> right before it begins.</p>
                
                <form className="reminder-form" onSubmit={handleSetReminder}>
                  <input 
                    type="email" 
                    required 
                    placeholder="Enter your email address" 
                    className="reminder-input"
                    value={reminderEmail}
                    onChange={(e) => setReminderEmail(e.target.value)}
                  />
                  <button type="submit" className="submit-btn">Set Reminder</button>
                </form>
                <button className="cancel-btn" onClick={() => setActiveModal(null)}>Cancel</button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}