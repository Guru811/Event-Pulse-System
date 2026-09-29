export default function Header({ view, onNavigate, users, currentUserId, onChangeUser }) {
  return (
    <header className="header">
      <div>
        <h1 className="wordmark">
          Event <em>Pulse</em>
        </h1>
        <p className="tagline">CGC campus events — browse, register, track your tickets</p>
      </div>

      <div className="header-right">
        <nav className="nav">
          <button
            className={view === 'events' ? 'active' : ''}
            onClick={() => onNavigate('events')}
          >
            Events
          </button>
          <button
            className={view === 'tickets' ? 'active' : ''}
            onClick={() => onNavigate('tickets')}
          >
            My tickets
          </button>
        </nav>

        <div className="badge-picker">
          <label htmlFor="user-select">Viewing as</label>
          <select
            id="user-select"
            value={currentUserId ?? ''}
            onChange={(e) => onChangeUser(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">Select a name</option>
            {users.map((u) => (
              <option key={u.user_id} value={u.user_id}>
                {u.full_name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}
