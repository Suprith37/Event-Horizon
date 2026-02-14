
import type { Event, Registration, User } from '../types';

// Backend API endpoint
const API_BASE = 'https://event-horizon-4zfq.onrender.com/api';

// Local storage keys for JWT token and user session
const TOKEN_KEY = 'eventhub_token'; // Stores JWT token from backend
const CURRENT_USER_KEY = 'eventhub_current_user'; // Stores logged-in user info

const getToken = () => localStorage.getItem(TOKEN_KEY);
const setToken = (t: string | null) => {
  if (t) localStorage.setItem(TOKEN_KEY, t);
  else localStorage.removeItem(TOKEN_KEY);
};

const getCurrentStoredUser = () => {
  const d = localStorage.getItem(CURRENT_USER_KEY);
  return d ? JSON.parse(d) : null;
};

const setCurrentStoredUser = (u: User | null) => {
  if (u) localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(u));
  else localStorage.removeItem(CURRENT_USER_KEY);
};

const mapEvent = (e: any): Event => ({
  id: e._id || e.id,
  name: e.name,
  description: e.description,
  date: e.date,
  endDate: e.endDate,
  time: e.time,
  endTime: e.endTime,
  venue: e.venue,
  district: e.district,
  state: e.state,
  organizer: e.organizer,
  registrationLimit: e.registrationLimit,
  enableQr: e.enableQr,
  createdAt: e.createdAt ? Date.parse(e.createdAt) : Date.now(),
  imageUrl: e.imageUrl,
  category: e.category,
  phone: e.phone,
  userId: e.userId,
});

const mapRegistration = (r: any): Registration => ({
  id: r._id || r.id,
  eventId: r.eventId,
  eventName: r.eventName,
  studentName: r.studentName,
  email: r.email,
  college: r.college,
  phone: r.phone,
  registeredAt: r.registeredAt ? Date.parse(r.registeredAt) : Date.now(),
  attended: r.attended || false,
  ticketId: r.ticketId,
  eventTicketId: r.eventTicketId, // Ensure this field is included in the mapping  
  // userId: r.userId, // Ensure this field is included in the mapping  

});

const mapUser = (u: any): User => ({
  id: u._id || u.id, // Map MongoDB _id to id
  name: u.name,
  email: u.email,
  college: u.college,
  password: u.password || '',
  createdAt: u.createdAt ? Date.parse(u.createdAt) : Date.now(),
});

const handleError = (err: any) => {
  console.error('API Error:', err);
  throw new Error(err?.message || 'API request failed');
};

export const db = {
  // Event Methods - pure API calls
  getEvents: async (): Promise<Event[]> => {
    const res = await fetch(`${API_BASE}/events`);
    if (!res.ok) throw new Error('Failed to fetch events');
    const events = await res.json();
    return events.map(mapEvent);
  },

  saveEvent: async (event: Event) => {
    console.log('Saving event:', event);
    const token = getToken();
    const res = await fetch(`${API_BASE}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(event)
    });
    if (!res.ok) throw new Error('Failed to create event');
    const created = await res.json();

    console.log('response from saveEvent:', created);
    return mapEvent(created);
  },

  // Registration Methods
  getRegistrations: async (): Promise<Registration[]> => {
    const res = await fetch(`${API_BASE}/registrations`);
    if (!res.ok) throw new Error('Failed to fetch registrations');
    const regs = await res.json();
    return regs.map(mapRegistration);
  },

  getEventRegistrations: async (eventId: string): Promise<Registration[]> => {
    const res = await fetch(`${API_BASE}/registrations/event/${eventId}`);
    if (!res.ok) throw new Error('Failed to fetch event registrations');
    const regs = await res.json();
    return regs.map(mapRegistration);
  },

  saveRegistration: async (registration: Registration) => {
    const res = await fetch(`${API_BASE}/registrations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registration)
    });
    if (!res.ok) throw new Error('Failed to register');
    const created = await res.json();
    console.log('reg:created:id', created);
    return mapRegistration(created);
  },

  updateAttendance: async (registrationId: string, attended: boolean) => {
    const token = getToken();
    const res = await fetch(`${API_BASE}/registrations/${registrationId}/attendance`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ attended })
    });
    if (!res.ok) throw new Error('Failed to update attendance');
    const updated = await res.json();
    return mapRegistration(updated);
  },

  verifyTicket: async (ticketId: string): Promise<Registration | undefined> => {
    try {
      const res = await fetch(`${API_BASE}/registrations/verify/${encodeURIComponent(ticketId)}`);
      if (!res.ok) return undefined;
      const reg = await res.json();
      return mapRegistration(reg);
    } catch (err) {
      return undefined;
    }
  },

  // User & Auth Methods
  saveUser: async (user: User) => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          college: user.college,
          password: user.password
        })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Registration failed');
      }
    } catch (err: any) {
      if (err instanceof TypeError) {
        throw new Error(`Failed to connect to backend at ${API_BASE}. Make sure backend is running on port 5000.`);
      }
      throw err;
    }
  },

  authenticateUser: async (email: string, password: string): Promise<User | null> => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) return null;
      const data = await res.json();
      setToken(data.token || null);
      const user = mapUser(data.user);
      setCurrentStoredUser(user);
      window.dispatchEvent(new Event('storage'));
      return user;
    } catch (err) {
      handleError(err);
    }
  },

  getCurrentUser: async (): Promise<User | null> => {
    const token = getToken();
    if (!token) {
      const stored = getCurrentStoredUser();
      return stored ? mapUser(stored) : null;
    }

    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        // token invalid, clear it
        setToken(null);
        const stored = getCurrentStoredUser();
        return stored ? mapUser(stored) : null;
      }
      const user = mapUser(await res.json());
      setCurrentStoredUser(user);
      return user;
    } catch (err) {
      const stored = getCurrentStoredUser();
      return stored ? mapUser(stored) : null;
    }
  },

  logout: () => {
    setCurrentStoredUser(null);
    setToken(null);
    window.dispatchEvent(new Event('storage'));
  }
};
