import { useEffect, useState } from 'react';
import { getMyRegistrations } from '../api';

export default function MyTicketsPage({ currentUserId }) {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUserId) {
      setRows(null);
      return;
    }
    setError(null);
    setRows(null);
    getMyRegistrations(currentUserId)
      .then(setRows)
      .catch((err) => setError(err.message));
  }, [currentUserId]);

  if (!currentUserId) {
    return (
      <div className="empty-state">
        <strong>Nobody's picked yet</strong>
        Choose your name at the top to see your registrations and tickets.
      </div>
    );
  }

  return (
    <section>
      <div className="section-heading">
        <h2>My tickets</h2>
        {rows && <span>{rows.length} registration{rows.length === 1 ? '' : 's'}</span>}
      </div>

      {error && <div className="feedback-banner error">Couldn't load tickets: {error}</div>}

      {!rows && !error && <p className="loading-text">Loading…</p>}

      {rows && rows.length === 0 && (
        <div className="empty-state">
          <strong>No registrations yet</strong>
          Register for an event and it'll show up here with its ticket code.
        </div>
      )}

      {rows && rows.map((r, i) => (
        <div className="ticket-row" key={i}>
          <div className="ticket-row-left">
            <h3>{r.title}</h3>
            <span className="ticket-code">
              {r.ticket_code ? `Ticket ${r.ticket_code}` : 'No ticket issued'}
              {r.checked_in ? ' · Checked in' : ''}
            </span>
          </div>
          <div className="ticket-row-right">
            <span className={`status-stamp status-${r.registration_status}`}>
              {r.registration_status}
            </span>
            {r.amount != null && (
              <span className="amount">
                ₹{r.amount} · {r.payment_status || 'PENDING'}
              </span>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
