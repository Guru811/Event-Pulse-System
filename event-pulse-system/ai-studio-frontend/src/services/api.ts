import {
  EventSummary,
  EventDetail,
  User,
  UserRegistration,
  CreateEventPayload,
} from '../types';

const DEFAULT_API_BASE = 'http://localhost:5000/api';

class EventPulseApi {
  private baseUrl: string;
  private isLiveConnected = false;
  private checkedLive = false;

  constructor() {
    this.baseUrl =
      localStorage.getItem('event_pulse_api_url') ||
      DEFAULT_API_BASE;
  }

  // ============================================================
  // BASIC CONFIG
  // ============================================================

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public setBaseUrl(url: string) {
    this.baseUrl = url.trim().replace(/\/$/, '');

    localStorage.setItem(
      'event_pulse_api_url',
      this.baseUrl
    );

    this.checkedLive = false;
  }

  public getIsLiveConnected(): boolean {
    return this.isLiveConnected;
  }

  // ============================================================
  // AUTHENTICATION
  // ============================================================

  private getToken(): string | null {
    return localStorage.getItem(
      'event_pulse_token'
    );
  }

  private saveToken(token: string) {
    localStorage.setItem(
      'event_pulse_token',
      token
    );
  }

  private clearToken() {
    localStorage.removeItem(
      'event_pulse_token'
    );
  }

  public async login(
    email: string,
    password: string
  ): Promise<User> {

    const response =
      await this.fetchWithTimeout(
        `${this.baseUrl}/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        },
        5000
      );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || 'Login failed'
      );
    }

    this.saveToken(data.token);

    return data.user as User;
  }

  public async signup(
    full_name: string,
    email: string,
    password: string,
    phone?: string
  ): Promise<User> {

    const response =
      await this.fetchWithTimeout(
        `${this.baseUrl}/auth/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            full_name,
            email,
            password,
            phone:
              phone || undefined,
          }),
        },
        5000
      );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
        'Account creation failed'
      );
    }

    this.saveToken(data.token);

    return data.user as User;
  }

  public async getCurrentUser(): Promise<User | null> {

    const token = this.getToken();

    if (!token) {
      return null;
    }

    try {
      const response =
        await this.fetchWithTimeout(
          `${this.baseUrl}/auth/me`,
          {
            method: 'GET',
          },
          5000
        );

      if (!response.ok) {
        this.clearToken();
        return null;
      }

      return await response.json();

    } catch {
      this.clearToken();
      return null;
    }
  }

  public logout() {
    this.clearToken();
  }

  public isAuthenticated(): boolean {
    return Boolean(
      this.getToken()
    );
  }

  // ============================================================
  // FETCH HELPER
  // ============================================================

  private async fetchWithTimeout(
    url: string,
    options: RequestInit = {},
    timeoutMs = 5000
  ): Promise<Response> {

    const controller =
      new AbortController();

    const timeoutId = setTimeout(
      () => controller.abort(),
      timeoutMs
    );

    const token = this.getToken();

    const headers =
      new Headers(options.headers);

    if (
      options.body &&
      !headers.has('Content-Type')
    ) {
      headers.set(
        'Content-Type',
        'application/json'
      );
    }

    if (token) {
      headers.set(
        'Authorization',
        `Bearer ${token}`
      );
    }

    try {

      const response =
        await fetch(url, {
          ...options,
          headers,
          signal:
            controller.signal,
        });

      clearTimeout(timeoutId);

      if (
        response.status === 401 &&
        !url.includes('/auth/login') &&
        !url.includes('/auth/signup')
      ) {
        this.clearToken();
      }

      return response;

    } catch (error) {

      clearTimeout(timeoutId);

      throw error;
    }
  }

  // ============================================================
  // HEALTH CHECK
  // ============================================================

  public async checkHealth(): Promise<boolean> {

    try {

      const response =
        await this.fetchWithTimeout(
          `${this.baseUrl}/events`,
          {
            method: 'GET',
          },
          3000
        );

      this.isLiveConnected =
        response.ok;

      this.checkedLive = true;

      return response.ok;

    } catch {

      this.isLiveConnected = false;
      this.checkedLive = true;

      return false;
    }
  }

  // ============================================================
  // EVENTS
  // ============================================================

  public async getEvents(): Promise<EventSummary[]> {

    const response =
      await this.fetchWithTimeout(
        `${this.baseUrl}/events`,
        {
          method: 'GET',
        }
      );

    if (!response.ok) {

      const data =
        await response.json()
          .catch(() => ({}));

      throw new Error(
        data.error ||
        'Failed to load events'
      );
    }

    this.isLiveConnected = true;

    return await response.json();
  }

  public async getEventById(
    id: number
  ): Promise<EventDetail> {

    const response =
      await this.fetchWithTimeout(
        `${this.baseUrl}/events/${id}`,
        {
          method: 'GET',
        }
      );

    if (!response.ok) {

      const data =
        await response.json()
          .catch(() => ({}));

      throw new Error(
        data.error ||
        `Event #${id} not found`
      );
    }

    this.isLiveConnected = true;

    return await response.json();
  }

  public async createEvent(
    payload: CreateEventPayload
  ): Promise<{ event_id: number }> {

    const response =
      await this.fetchWithTimeout(
        `${this.baseUrl}/events`,
        {
          method: 'POST',
          body: JSON.stringify(
            payload
          ),
        }
      );

    const data =
      await response.json()
        .catch(() => ({}));

    if (!response.ok) {

      throw new Error(
        data.error ||
        'Failed to create event'
      );
    }

    this.isLiveConnected = true;

    return data;
  }

  // ============================================================
  // USERS
  // ============================================================

  public async getUsers(): Promise<User[]> {

    const response =
      await this.fetchWithTimeout(
        `${this.baseUrl}/users`,
        {
          method: 'GET',
        }
      );

    if (!response.ok) {

      const data =
        await response.json()
          .catch(() => ({}));

      throw new Error(
        data.error ||
        'Failed to load users'
      );
    }

    this.isLiveConnected = true;

    return await response.json();
  }

  // ============================================================
  // REGISTRATIONS
  // ============================================================

  public async registerForEvent(
    eventId: number,
    _userId?: number
  ): Promise<{ message: string }> {

    const response =
      await this.fetchWithTimeout(
        `${this.baseUrl}/registrations`,
        {
          method: 'POST',
          body: JSON.stringify({
            event_id: eventId,
          }),
        }
      );

    const data =
      await response.json()
        .catch(() => ({}));

    if (!response.ok) {

      throw new Error(
        data.error ||
        'Registration failed'
      );
    }

    this.isLiveConnected = true;

    return data;
  }

  // ============================================================
  // CURRENT USER REGISTRATIONS
  // ============================================================

  public async getUserRegistrations(
    _userId?: number
  ): Promise<UserRegistration[]> {

    const response =
      await this.fetchWithTimeout(
        `${this.baseUrl}/registrations/me`,
        {
          method: 'GET',
        }
      );

    const data =
      await response.json()
        .catch(() => []);

    if (!response.ok) {

      throw new Error(
        data.error ||
        'Failed to load registrations'
      );
    }

    this.isLiveConnected = true;

    return data;
  }
}

export const api =
  new EventPulseApi();