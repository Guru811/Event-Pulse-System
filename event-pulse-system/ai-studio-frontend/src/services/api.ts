import {
  EventSummary,
  EventDetail,
  User,
  UserRegistration,
  CreateEventPayload,
} from '../types';

const DEFAULT_API_BASE = 'http://localhost:5000/api';

// Seed data matching the MySQL database dump provided
const INITIAL_USERS: User[] = [
  { user_id: 1, full_name: 'Gurshant Singh', role: 'ADMIN', email: 'gurshant@cgc.edu.in' },
  { user_id: 2, full_name: 'Priya Sharma', role: 'ORGANIZER', email: 'priya@cgc.edu.in' },
  { user_id: 3, full_name: 'Rohit Verma', role: 'ORGANIZER', email: 'rohit@cgc.edu.in' },
  { user_id: 4, full_name: 'Ananya Gupta', role: 'ATTENDEE', email: 'ananya@cgc.edu.in' },
  { user_id: 5, full_name: 'Karan Mehta', role: 'ATTENDEE', email: 'karan@cgc.edu.in' },
  { user_id: 6, full_name: 'Simran Kaur', role: 'ATTENDEE', email: 'simran@cgc.edu.in' },
  { user_id: 7, full_name: 'Devansh Rao', role: 'ATTENDEE', email: 'devansh@cgc.edu.in' },
  { user_id: 8, full_name: 'Neha Joshi', role: 'ATTENDEE', email: 'neha@cgc.edu.in' },
];

const INITIAL_EVENTS: EventDetail[] = [
  {
    event_id: 1,
    title: 'CodeStorm Hackathon 2026',
    description: 'A relentless 24-hour campus hackathon uniting top collegiate builders, designers, and systems hackers. Compete for $10,000+ in sponsor tracks, mentor office hours, and VC demo day invites.',
    category_name: 'Technical',
    category_id: 1,
    venue_name: 'Main Auditorium',
    venue_id: 1,
    organizer_name: 'Priya Sharma',
    organizer_id: 2,
    start_datetime: '2026-10-10 09:00:00',
    end_datetime: '2026-10-11 09:00:00',
    max_attendees: 200,
    seats_left: 198,
    status: 'PUBLISHED',
    ticket_price: 0.0,
    sessions: [
      {
        session_id: 1,
        event_id: 1,
        session_title: 'Opening Ceremony & Track Briefing',
        speaker_name: 'Priya Sharma',
        start_time: '2026-10-10 09:00:00',
        end_time: '2026-10-10 09:30:00',
        room_no: 'Main Hall',
      },
      {
        session_id: 2,
        event_id: 1,
        session_title: 'Agentic AI Architecture Workshop',
        speaker_name: 'Gurshant Singh',
        start_time: '2026-10-10 11:00:00',
        end_time: '2026-10-10 12:30:00',
        room_no: 'Lab 4',
      },
      {
        session_id: 3,
        event_id: 1,
        session_title: 'Midnight Pitch Pitching & Ramen Hour',
        speaker_name: 'Rohit Verma',
        start_time: '2026-10-10 23:59:00',
        end_time: '2026-10-11 01:00:00',
        room_no: 'Atrium',
      },
    ],
  },
  {
    event_id: 2,
    title: 'Sur Sangam Music Fest',
    description: 'The premier annual collegiate music festival bringing together fusion bands, classical masters, and high-octane indie rock under the night stars. Full acoustic staging and food village.',
    category_name: 'Cultural',
    category_id: 2,
    venue_name: 'Open Air Theatre',
    venue_id: 3,
    organizer_name: 'Rohit Verma',
    organizer_id: 3,
    start_datetime: '2026-10-15 17:00:00',
    end_datetime: '2026-10-15 21:00:00',
    max_attendees: 600,
    seats_left: 598,
    status: 'PUBLISHED',
    ticket_price: 150.0,
    sessions: [
      {
        session_id: 4,
        event_id: 2,
        session_title: 'Sufi & Semi-Classical Acoustic Overture',
        speaker_name: 'Karan Mehta & Ensemble',
        start_time: '2026-10-15 17:00:00',
        end_time: '2026-10-15 18:30:00',
        room_no: 'Amphitheatre Stage',
      },
      {
        session_id: 5,
        event_id: 2,
        session_title: 'Battle of the Campus Rock Bands',
        speaker_name: 'Inter-College Finalists',
        start_time: '2026-10-15 19:00:00',
        end_time: '2026-10-15 21:00:00',
        room_no: 'Main Stage',
      },
    ],
  },
  {
    event_id: 3,
    title: 'AI/ML Bootcamp: Deep Dive',
    description: 'Intensive hands-on masterclass covering neural network architectures, PyTorch pipelines, and production inference deployments. Certificate provided upon model submission.',
    category_name: 'Workshop',
    category_id: 3,
    venue_name: 'Seminar Hall B',
    venue_id: 2,
    organizer_name: 'Priya Sharma',
    organizer_id: 2,
    start_datetime: '2026-09-28 10:00:00',
    end_datetime: '2026-09-28 16:00:00',
    max_attendees: 80,
    seats_left: 77,
    status: 'COMPLETED',
    ticket_price: 50.0,
    sessions: [
      {
        session_id: 6,
        event_id: 3,
        session_title: 'Intro to Neural Networks & Tensors',
        speaker_name: 'Dr. Anil Kapoor',
        start_time: '2026-09-28 10:00:00',
        end_time: '2026-09-28 12:00:00',
        room_no: 'Seminar B',
      },
      {
        session_id: 7,
        event_id: 3,
        session_title: 'Hands-on Transformer Fine-Tuning Lab',
        speaker_name: 'Priya Sharma',
        start_time: '2026-09-28 13:00:00',
        end_time: '2026-09-28 16:00:00',
        room_no: 'Computing Lab 2',
      },
    ],
  },
  {
    event_id: 4,
    title: 'Inter-Collegiate Futsal Championship',
    description: 'High-speed 5v5 floodlit futsal clash featuring 16 university squads. Sudden-death knockout rounds, live campus commentary, and trophy ceremony.',
    category_name: 'Sports',
    category_id: 4,
    venue_name: 'Sports Complex Arena',
    venue_id: 4,
    organizer_name: 'Rohit Verma',
    organizer_id: 3,
    start_datetime: '2026-10-22 16:00:00',
    end_datetime: '2026-10-22 22:00:00',
    max_attendees: 350,
    seats_left: 312,
    status: 'PUBLISHED',
    ticket_price: 30.0,
    sessions: [
      {
        session_id: 8,
        event_id: 4,
        session_title: 'Quarter Finals Kickoff',
        speaker_name: 'Tournament Referees',
        start_time: '2026-10-22 16:00:00',
        end_time: '2026-10-22 18:30:00',
        room_no: 'Court A & B',
      },
      {
        session_id: 9,
        event_id: 4,
        session_title: 'Grand Finale & Medal Ceremony',
        speaker_name: 'Sports Director',
        start_time: '2026-10-22 20:00:00',
        end_time: '2026-10-22 22:00:00',
        room_no: 'Central Court',
      },
    ],
  },
];

const INITIAL_REGISTRATIONS: UserRegistration[] = [
  // User 4 (Ananya Gupta)
  {
    user_id: 4,
    title: 'CodeStorm Hackathon 2026',
    registration_status: 'CONFIRMED',
    ticket_code: 'TCK-0001',
    checked_in: true,
    amount: 0.0,
    payment_status: 'SUCCESS',
    event_id: 1,
    start_datetime: '2026-10-10 09:00:00',
    venue_name: 'Main Auditorium',
    category_name: 'Technical',
  },
  {
    user_id: 4,
    title: 'Sur Sangam Music Fest',
    registration_status: 'CONFIRMED',
    ticket_code: 'TCK-0003',
    checked_in: true,
    amount: 150.0,
    payment_status: 'SUCCESS',
    event_id: 2,
    start_datetime: '2026-10-15 17:00:00',
    venue_name: 'Open Air Theatre',
    category_name: 'Cultural',
  },
  // User 5 (Karan Mehta)
  {
    user_id: 5,
    title: 'CodeStorm Hackathon 2026',
    registration_status: 'CONFIRMED',
    ticket_code: 'TCK-0002',
    checked_in: false,
    amount: 0.0,
    payment_status: 'SUCCESS',
    event_id: 1,
    start_datetime: '2026-10-10 09:00:00',
    venue_name: 'Main Auditorium',
    category_name: 'Technical',
  },
  {
    user_id: 5,
    title: 'AI/ML Bootcamp: Deep Dive',
    registration_status: 'CONFIRMED',
    ticket_code: 'TCK-0005',
    checked_in: true,
    amount: 50.0,
    payment_status: 'SUCCESS',
    event_id: 3,
    start_datetime: '2026-09-28 10:00:00',
    venue_name: 'Seminar Hall B',
    category_name: 'Workshop',
  },
  // User 6 (Simran Kaur)
  {
    user_id: 6,
    title: 'Sur Sangam Music Fest',
    registration_status: 'CONFIRMED',
    ticket_code: 'TCK-0004',
    checked_in: true,
    amount: 150.0,
    payment_status: 'SUCCESS',
    event_id: 2,
    start_datetime: '2026-10-15 17:00:00',
    venue_name: 'Open Air Theatre',
    category_name: 'Cultural',
  },
  // User 7 (Devansh Rao)
  {
    user_id: 7,
    title: 'AI/ML Bootcamp: Deep Dive',
    registration_status: 'CANCELLED',
    ticket_code: null,
    checked_in: false,
    amount: 50.0,
    payment_status: 'REFUNDED',
    event_id: 3,
    start_datetime: '2026-09-28 10:00:00',
    venue_name: 'Seminar Hall B',
    category_name: 'Workshop',
  },
  // User 8 (Neha Joshi)
  {
    user_id: 8,
    title: 'AI/ML Bootcamp: Deep Dive',
    registration_status: 'CONFIRMED',
    ticket_code: 'TCK-0007',
    checked_in: true,
    amount: 50.0,
    payment_status: 'SUCCESS',
    event_id: 3,
    start_datetime: '2026-09-28 10:00:00',
    venue_name: 'Seminar Hall B',
    category_name: 'Workshop',
  },
];

class EventPulseApi {
  private baseUrl: string;
  private isLiveConnected: boolean = false;
  private checkedLive: boolean = false;

  constructor() {
    this.baseUrl = localStorage.getItem('event_pulse_api_url') || DEFAULT_API_BASE;
    this.initializeLocalStore();
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public setBaseUrl(url: string) {
    this.baseUrl = url.trim();
    localStorage.setItem('event_pulse_api_url', this.baseUrl);
    this.checkedLive = false;
  }

  public getIsLiveConnected(): boolean {
    return this.isLiveConnected;
  }

  private initializeLocalStore() {
    if (!localStorage.getItem('ep_events')) {
      localStorage.setItem('ep_events', JSON.stringify(INITIAL_EVENTS));
    }
    if (!localStorage.getItem('ep_users')) {
      localStorage.setItem('ep_users', JSON.stringify(INITIAL_USERS));
    }
    if (!localStorage.getItem('ep_registrations')) {
      localStorage.setItem('ep_registrations', JSON.stringify(INITIAL_REGISTRATIONS));
    }
  }

  private getLocalEvents(): EventDetail[] {
    try {
      const data = localStorage.getItem('ep_events');
      return data ? JSON.parse(data) : INITIAL_EVENTS;
    } catch {
      return INITIAL_EVENTS;
    }
  }

  private saveLocalEvents(events: EventDetail[]) {
    localStorage.setItem('ep_events', JSON.stringify(events));
  }

  private getLocalRegistrations(): UserRegistration[] {
    try {
      const data = localStorage.getItem('ep_registrations');
      return data ? JSON.parse(data) : INITIAL_REGISTRATIONS;
    } catch {
      return INITIAL_REGISTRATIONS;
    }
  }

  private saveLocalRegistrations(regs: UserRegistration[]) {
    localStorage.setItem('ep_registrations', JSON.stringify(regs));
  }

  private getLocalUsers(): User[] {
    try {
      const data = localStorage.getItem('ep_users');
      return data ? JSON.parse(data) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  }

  /**
   * Safe fetch with timeout to avoid hanging when localhost:5000 is not running
   */
  private async fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 2000): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(id);
      return response;
    } catch (err) {
      clearTimeout(id);
      throw err;
    }
  }

  /**
   * Check connection status
   */
  public async checkHealth(): Promise<boolean> {
    try {
      const res = await this.fetchWithTimeout(`${this.baseUrl}/events`, { method: 'GET' }, 1500);
      this.isLiveConnected = res.ok;
      this.checkedLive = true;
      return res.ok;
    } catch {
      this.isLiveConnected = false;
      this.checkedLive = true;
      return false;
    }
  }

  /**
   * GET /api/events
   */
  public async getEvents(): Promise<EventSummary[]> {
    try {
      const res = await this.fetchWithTimeout(`${this.baseUrl}/events`);
      if (res.ok) {
        this.isLiveConnected = true;
        const data = await res.json();
        return data;
      }
    } catch {
      this.isLiveConnected = false;
    }

    // Fallback to seeded MySQL view equivalent
    const events = this.getLocalEvents();
    return events.map((e) => ({
      event_id: e.event_id,
      title: e.title,
      category_name: e.category_name,
      venue_name: e.venue_name,
      organizer_name: e.organizer_name,
      start_datetime: e.start_datetime,
      max_attendees: e.max_attendees,
      seats_left: e.seats_left,
      status: e.status,
      ticket_price: e.ticket_price,
      description: e.description,
    }));
  }

  /**
   * GET /api/events/:id
   */
  public async getEventById(id: number): Promise<EventDetail> {
    try {
      const res = await this.fetchWithTimeout(`${this.baseUrl}/events/${id}`);
      if (res.ok) {
        this.isLiveConnected = true;
        return await res.json();
      }
    } catch {
      this.isLiveConnected = false;
    }

    const events = this.getLocalEvents();
    const found = events.find((e) => e.event_id === Number(id));
    if (!found) {
      throw new Error(`Event #${id} not found`);
    }
    return found;
  }

  /**
   * POST /api/events
   */
  public async createEvent(payload: CreateEventPayload): Promise<{ event_id: number }> {
    try {
      const res = await this.fetchWithTimeout(`${this.baseUrl}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        this.isLiveConnected = true;
        return await res.json();
      }
    } catch {
      this.isLiveConnected = false;
    }

    // Fallback: local insert
    const events = this.getLocalEvents();
    const newId = Math.max(...events.map((e) => e.event_id), 0) + 1;

    const categoryMap: Record<number, string> = {
      1: 'Technical',
      2: 'Cultural',
      3: 'Workshop',
      4: 'Sports',
    };
    const venueMap: Record<number, string> = {
      1: 'Main Auditorium',
      2: 'Seminar Hall B',
      3: 'Open Air Theatre',
      4: 'Sports Complex Arena',
    };

    const newEvent: EventDetail = {
      event_id: newId,
      title: payload.title,
      description: payload.description,
      category_id: payload.category_id,
      category_name: categoryMap[payload.category_id] || 'Technical',
      venue_id: payload.venue_id,
      venue_name: venueMap[payload.venue_id] || 'Campus Pavilion',
      organizer_id: payload.organizer_id,
      organizer_name: 'Priya Sharma',
      start_datetime: payload.start_datetime,
      end_datetime: payload.end_datetime,
      max_attendees: payload.max_attendees,
      seats_left: payload.max_attendees,
      status: 'PUBLISHED',
      ticket_price: payload.ticket_price,
      sessions: [
        {
          session_id: newId * 10 + 1,
          event_id: newId,
          session_title: 'Opening Keynote & Welcome',
          speaker_name: 'Keynote Faculty',
          start_time: payload.start_datetime,
          end_time: payload.end_datetime,
          room_no: 'Main Stage',
        },
      ],
    };

    events.unshift(newEvent);
    this.saveLocalEvents(events);
    return { event_id: newId };
  }

  /**
   * GET /api/users
   */
  public async getUsers(): Promise<User[]> {
    try {
      const res = await this.fetchWithTimeout(`${this.baseUrl}/users`);
      if (res.ok) {
        this.isLiveConnected = true;
        return await res.json();
      }
    } catch {
      this.isLiveConnected = false;
    }

    return this.getLocalUsers();
  }

  /**
   * POST /api/registrations
   */
  public async registerForEvent(eventId: number, userId: number): Promise<{ message: string }> {
    try {
      const res = await this.fetchWithTimeout(`${this.baseUrl}/registrations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_id: eventId, user_id: userId }),
      });
      if (res.ok) {
        this.isLiveConnected = true;
        return await res.json();
      }
    } catch {
      this.isLiveConnected = false;
    }

    // Local simulation of stored procedure: sp_register_for_event
    const events = this.getLocalEvents();
    const event = events.find((e) => e.event_id === eventId);
    if (!event) throw new Error('Event not found');

    const registrations = this.getLocalRegistrations();
    const existing = registrations.find(
      (r) => r.event_id === eventId && r.user_id === userId && r.registration_status !== 'CANCELLED'
    );
    if (existing) {
      return { message: 'You are already registered for this event.' };
    }

    let message = 'Registration confirmed';
    const isFull = event.seats_left <= 0;

    if (isFull) {
      message = 'Event full — added to waitlist';
      registrations.push({
        user_id: userId,
        title: event.title,
        registration_status: 'WAITLISTED',
        ticket_code: null,
        checked_in: false,
        amount: event.ticket_price || 0,
        payment_status: 'PENDING',
        event_id: event.event_id,
        start_datetime: event.start_datetime,
        venue_name: event.venue_name,
        category_name: event.category_name,
      });
    } else {
      // Trigger after registration confirmed generates TCK-XXXX
      const nextNum = registrations.length + 10;
      const ticketCode = `TCK-${String(nextNum).padStart(4, '0')}`;
      event.seats_left = Math.max(0, event.seats_left - 1);

      registrations.unshift({
        user_id: userId,
        title: event.title,
        registration_status: 'CONFIRMED',
        ticket_code: ticketCode,
        checked_in: false,
        amount: event.ticket_price || 0,
        payment_status: (event.ticket_price || 0) > 0 ? 'SUCCESS' : 'SUCCESS',
        event_id: event.event_id,
        start_datetime: event.start_datetime,
        venue_name: event.venue_name,
        category_name: event.category_name,
      });

      this.saveLocalEvents(events);
    }

    this.saveLocalRegistrations(registrations);
    return { message };
  }

  /**
   * GET /api/registrations/user/:userId
   */
  public async getUserRegistrations(userId: number): Promise<UserRegistration[]> {
    try {
      const res = await this.fetchWithTimeout(`${this.baseUrl}/registrations/user/${userId}`);
      if (res.ok) {
        this.isLiveConnected = true;
        const liveRows = await res.json();
        // Enrich live rows with event metadata if missing
        const localEvents = this.getLocalEvents();
        return liveRows.map((r: any) => {
          const match = localEvents.find((e) => e.title === r.title);
          return {
            ...r,
            event_id: match?.event_id,
            start_datetime: match?.start_datetime || '2026-10-15 17:00:00',
            venue_name: match?.venue_name || 'Campus Venue',
            category_name: match?.category_name || 'General',
          };
        });
      }
    } catch {
      this.isLiveConnected = false;
    }

    const regs = this.getLocalRegistrations();
    return regs.filter((r) => r.user_id === Number(userId));
  }
}

export const api = new EventPulseApi();
