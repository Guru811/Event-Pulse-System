const CATEGORY_VARS = {
  Technical: 'var(--cat-technical)',
  Cultural: 'var(--cat-cultural)',
  Workshop: 'var(--cat-workshop)',
  Sports: 'var(--cat-sports)'
};

function formatDate(dt) {
  return new Date(dt).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit'
  });
}

export default function EventStub({ event, onOpen }) {
  const dotColor = CATEGORY_VARS[event.category_name] || 'var(--ink-soft)';

  return (
    <article className="ticket">
      <div className="ticket-main" onClick={() => onOpen(event.event_id)}>
        <span className="category-dot" style={{ '--dot-color': dotColor }}>
          {event.category_name}
        </span>
        <h3 className="ticket-title">{event.title}</h3>
        <p className="ticket-meta">{event.venue_name}</p>
        <p className="ticket-meta">
          {event.organizer_name} · {formatDate(event.start_datetime)}
        </p>
      </div>

      <div className="ticket-stub">
        <div>
          <div className="seats-number">{event.seats_left}</div>
          <div className="seats-label">seats left</div>
        </div>
        <span className={`status-stamp status-${event.status}`}>{event.status}</span>
      </div>
    </article>
  );
}
