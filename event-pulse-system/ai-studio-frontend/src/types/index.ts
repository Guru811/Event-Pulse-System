export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
export type UserRole = 'ATTENDEE' | 'ORGANIZER' | 'ADMIN';
export type RegistrationStatus = 'CONFIRMED' | 'WAITLISTED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
export type PaymentMethod = 'CARD' | 'UPI' | 'NETBANKING' | 'CASH';

export interface EventSummary {
  event_id: number;
  title: string;
  category_name: string;
  venue_name: string;
  organizer_name: string;
  start_datetime: string;
  max_attendees: number;
  seats_left: number;
  status: EventStatus;
  // Optional extra fields for enhanced experience
  end_datetime?: string;
  ticket_price?: number;
  description?: string;
}

export interface Session {
  session_id?: number;
  event_id?: number;
  session_title: string;
  speaker_name: string;
  start_time: string;
  end_time: string;
  room_no: string;
}

export interface EventDetail extends EventSummary {
  description: string;
  end_datetime?: string;
  ticket_price?: number;
  category_id?: number;
  venue_id?: number;
  organizer_id?: number;
  sessions: Session[];
}

export interface User {
  user_id: number;
  full_name: string;
  role: UserRole;
  email?: string;
}

export interface UserRegistration {
  user_id: number;
  title: string;
  registration_status: RegistrationStatus;
  ticket_code: string | null;
  checked_in: boolean | null;
  amount: number | null;
  payment_status: PaymentStatus | null;
  event_id?: number;
  start_datetime?: string;
  venue_name?: string;
  category_name?: string;
}

export interface CreateEventPayload {
  title: string;
  description: string;
  category_id: number;
  venue_id: number;
  organizer_id: number;
  start_datetime: string;
  end_datetime: string;
  max_attendees: number;
  ticket_price: number;
}
