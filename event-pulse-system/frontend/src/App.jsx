import { useEffect, useState } from 'react';
import { getUsers } from './api';
import Header from './components/Header';
import EventsPage from './components/EventsPage';
import MyTicketsPage from './components/MyTicketsPage';

export default function App() {
  const [view, setView] = useState('events');
  const [users, setUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(() => {
    const stored = localStorage.getItem('eventPulseUserId');
    return stored ? Number(stored) : null;
  });
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch((err) => setApiError(err.message));
  }, []);

  function handleChangeUser(id) {
    setCurrentUserId(id);
    if (id) {
      localStorage.setItem('eventPulseUserId', String(id));
    } else {
      localStorage.removeItem('eventPulseUserId');
    }
  }

  return (
    <div className="app-shell">
      <Header
        view={view}
        onNavigate={setView}
        users={users}
        currentUserId={currentUserId}
        onChangeUser={handleChangeUser}
      />

      {apiError && (
        <div className="feedback-banner error">
          Can't reach the backend at localhost:5000 — make sure <code>npm start</code> is running
          in the <code>backend</code> folder. ({apiError})
        </div>
      )}

      {view === 'events' && <EventsPage currentUserId={currentUserId} />}
      {view === 'tickets' && <MyTicketsPage currentUserId={currentUserId} />}
    </div>
  );
}
