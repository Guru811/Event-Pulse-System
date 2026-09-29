import { useEffect, useState } from 'react';
import { getEvent, registerForEvent } from '../api';

function formatDateTime(dt) {
  return new Date(dt).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

export default function EventDetail({ eventId, currentUserId, onBack, onRegistered }) {
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    getEvent(eventId)
      .then(setEvent)
      .catch((err) => setError(err.message));
  }, [eventId]);

  async function handleRegister() {
    setSubmitting(true);
    setFeedback(null);
    try {
      const res = await registerForEvent(eventId, currentUserId);
      setFeedback({ ok: true, message: res.message });
      onRegistered();
    } catch (err) {
      setFeedback({ ok: false, message: err.message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section>
      <button className="panel-back" onClick={onBack}>
        ← Back to all events
      </button>

      {error && <div className="feedback-banner error">Couldn't load this event: {error}</div>}

      {!event && !error && <p className="loading-text">Loading…</p>}

      {event && (
        <div className="panel">
          <span className={`status-stamp status-${event.status}`}>{event.status}</span>
          <h2>{event.title}</h2>
          <p className="ticket-meta">
            {formatDateTime(event.start_datetime)} – {formatDateTime(event.end_datetime)}
          </p>

          {event.description && <p className="panel-description">{event.description}</p>}

          {event.sessions.length > 0 && (
            <div className="session-list">
              {event.sessions.map((s) => (
                <div className="session-row" key={s.session_id}>
                  <span>
                    {s.session_title}
                    {s.speaker_name ? ` — ${s.speaker_name}` : ''}
                  </span>
                  <span className="session-room">{s.room_no}</span>
                </div>
              ))}
            </div>
          )}

          <div className="register-row">
            <button
              className="btn-primary"
              disabled={!currentUserId || submitting}
              onClick={handleRegister}
            >
              {submitting ? 'Registering…' : 'Register for this event'}
            </button>
            {!currentUserId && (
              <span className="hint-text">Pick who you are, up top, to register.</span>
            )}
          </div>

          {feedback && (
            <div className={`feedback-banner ${feedback.ok ? '' : 'error'}`}>
              {feedback.message}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
