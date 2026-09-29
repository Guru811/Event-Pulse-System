/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { EventSummary, User, UserRegistration } from './types';
import { api } from './services/api';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { EventsExplorer } from './components/EventsExplorer';
import { EventDetailModal } from './components/EventDetailModal';
import { TicketsView } from './components/TicketsView';
import { StatsSection } from './components/StatsSection';
import { CreateEventModal } from './components/CreateEventModal';
import { ApiStatusModal } from './components/ApiStatusModal';
import { Footer } from './components/Footer';

function MainApp() {
  const [currentTab, setCurrentTab] = useState<'explore' | 'tickets' | 'stats'>('explore');
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [registrations, setRegistrations] = useState<UserRegistration[]>([]);

  const [isLoadingEvents, setIsLoadingEvents] = useState<boolean>(true);
  const [isLoadingTickets, setIsLoadingTickets] = useState<boolean>(false);
  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(false);

  // Modals
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isApiModalOpen, setIsApiModalOpen] = useState<boolean>(false);

  // 1. Load users & events on initial mount
  const loadInitialData = useCallback(async () => {
    setIsLoadingEvents(true);
    try {
      const liveOk = await api.checkHealth();
      setIsLiveConnected(liveOk);

      const usersData = await api.getUsers();
      setUsers(usersData);

      if (usersData.length > 0) {
        const attendee = usersData.find((u) => u.role === 'ATTENDEE') || usersData[0];
        setActiveUser(attendee);
      }

      const eventsData = await api.getEvents();
      setEvents(eventsData);
    } catch (err) {
      console.error('Initialization error:', err);
    } finally {
      setIsLoadingEvents(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // 2. Load tickets whenever activeUser changes
  const loadUserTickets = useCallback(async (userId: number) => {
    setIsLoadingTickets(true);
    try {
      const tickets = await api.getUserRegistrations(userId);
      setRegistrations(tickets);
    } catch (err) {
      console.error('Failed to load tickets:', err);
    } finally {
      setIsLoadingTickets(false);
    }
  }, []);

  useEffect(() => {
    if (activeUser) {
      loadUserTickets(activeUser.user_id);
    }
  }, [activeUser, loadUserTickets]);

  // Handle registration success
  const handleRegistrationCompleted = async () => {
    const refreshedEvents = await api.getEvents();
    setEvents(refreshedEvents);

    if (activeUser) {
      await loadUserTickets(activeUser.user_id);
    }
  };

  // Handle new event created
  const handleEventCreated = async (newEventId: number) => {
    const refreshedEvents = await api.getEvents();
    setEvents(refreshedEvents);
    setSelectedEventId(newEventId);
  };

  const featuredEvent = events.find((e) => e.status === 'PUBLISHED') || events[0];
  const totalSeatsLeft = events.reduce((sum, e) => sum + (e.seats_left || 0), 0);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100 font-sans transition-colors duration-200 selection:bg-amber-400 selection:text-stone-950">
      {/* Top Bar Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        users={users}
        activeUser={activeUser}
        onSelectUser={setActiveUser}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onOpenApiModal={() => setIsApiModalOpen(true)}
        isLiveConnected={isLiveConnected}
        totalTicketsCount={registrations.length}
      />

      {/* Main View Content */}
      <main className="flex-1">
        {currentTab === 'explore' && (
          <>
            <Hero
              featuredEvent={featuredEvent}
              totalEventsCount={events.length}
              totalSeatsLeft={totalSeatsLeft}
              onExploreClick={() => {
                const el = document.getElementById('explore');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onViewEvent={(id) => setSelectedEventId(id)}
              onHostEvent={() => setIsCreateModalOpen(true)}
            />

            <EventsExplorer
              events={events}
              onSelectEvent={(id) => setSelectedEventId(id)}
              isLoading={isLoadingEvents}
            />

            {/* In-page stats teaser */}
            <div className="border-t border-stone-200 dark:border-stone-900 bg-stone-100/50 dark:bg-stone-950/40">
              <StatsSection events={events} />
            </div>
          </>
        )}

        {currentTab === 'tickets' && (
          <TicketsView
            activeUser={activeUser}
            users={users}
            onSelectUser={setActiveUser}
            registrations={registrations}
            isLoading={isLoadingTickets}
            onExploreEvents={() => setCurrentTab('explore')}
            onViewEvent={(id) => setSelectedEventId(id)}
          />
        )}

        {currentTab === 'stats' && (
          <StatsSection events={events} />
        )}
      </main>

      {/* Modals */}
      <EventDetailModal
        eventId={selectedEventId}
        activeUser={activeUser}
        onClose={() => setSelectedEventId(null)}
        onRegistered={handleRegistrationCompleted}
        onNavigateToTickets={() => {
          setSelectedEventId(null);
          setCurrentTab('tickets');
        }}
      />

      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        activeUser={activeUser}
        onEventCreated={handleEventCreated}
      />

      <ApiStatusModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        isLiveConnected={isLiveConnected}
        onConnectionChange={setIsLiveConnected}
      />

      {/* Footer */}
      <Footer
        onSelectTab={setCurrentTab}
        onOpenApiModal={() => setIsApiModalOpen(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}
