const BASE_URL = 'http://localhost:5000/api';

async function request(path, options) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

export const getEvents = () => request('/events');
export const getEvent = (id) => request(`/events/${id}`);
export const getUsers = () => request('/users');
export const getMyRegistrations = (userId) => request(`/registrations/user/${userId}`);
export const registerForEvent = (eventId, userId) =>
  request('/registrations', {
    method: 'POST',
    body: JSON.stringify({ event_id: eventId, user_id: userId })
  });
