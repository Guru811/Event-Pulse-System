import { useEffect, useState } from 'react';
import { getEvents } from '../api';
import EventStub from './EventStub';
import EventDetail from './EventDetail';

export default function EventsPage({ currentUserId }) {
  const [events, setEvents] = useState(null);
  const [error, setError] = useState(null);
  const [openEventId, setOpenEventId] = useState(null);

  async function load() {
    try {
      setError(null);
      const data = await getEvents();
      setEvents(data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (openEventId) {
    return (
      <EventDetail
        eventId={openEventId}
        currentUserId={currentUserId}
        onBack={() => setOpenEventId(null)}
        onRegistered={load}
      />
    );
  }

  return (
    <section>
      <div className="section-heading">
        <h2>Upcoming &amp; live events</h2>
        {events && <span>{events.length} listed</span>}
      </div>

      {error && <div className="feedback-banner error">Couldn't reach the API: {error}</div>}

      {!events && !error && <p className="loading-text">Loading events…</p>}

      {events && events.length === 0 && (
        <div className="empty-state">
          <strong>No events yet</strong>
          Once an organizer publishes one, it'll show up here.
        </div>
      )}

      {events && events.map((e) => (
        <EventStub key={e.event_id} event={e} onOpen={setOpenEventId} />
      ))}
    </section>
  );
}
