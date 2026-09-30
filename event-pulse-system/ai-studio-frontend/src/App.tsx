/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, {
  useState,
  useEffect,
  useCallback,
} from 'react';

import {
  EventSummary,
  User,
  UserRegistration,
} from './types';

import { api } from './services/api';

import { ThemeProvider } from './context/ThemeContext';

import { AuthGate } from './components/AuthGate';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { EventsExplorer } from './components/EventsExplorer';
import { EventDetailModal } from './components/EventDetailModal';
import { TicketsView } from './components/TicketsView';
import { StatsSection } from './components/StatsSection';
import { CreateEventModal } from './components/CreateEventModal';
import { ApiStatusModal } from './components/ApiStatusModal';
import { Footer } from './components/Footer';

function MainApp({
  activeUser,
  onLogout,
}: {
  activeUser: User;
  onLogout: () => void;
}) {
  const [currentTab, setCurrentTab] =
    useState<'explore' | 'tickets' | 'stats'>('explore');

  const [events, setEvents] =
    useState<EventSummary[]>([]);

  const [registrations, setRegistrations] =
    useState<UserRegistration[]>([]);

  const [isLoadingEvents, setIsLoadingEvents] =
    useState(true);

  const [isLoadingTickets, setIsLoadingTickets] =
    useState(false);

  const [isLiveConnected, setIsLiveConnected] =
    useState(false);

  const [selectedEventId, setSelectedEventId] =
    useState<number | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] =
    useState(false);

  const [isApiModalOpen, setIsApiModalOpen] =
    useState(false);

  // ---------------------------------------------
  // Load events from the backend
  // ---------------------------------------------

  const loadEvents = useCallback(async () => {
    setIsLoadingEvents(true);

    try {
      const liveOk = await api.checkHealth();
      setIsLiveConnected(liveOk);

      const eventsData = await api.getEvents();

      setEvents(eventsData);
    } catch (err) {
      console.error(
        'Failed to load events:',
        err
      );
    } finally {
      setIsLoadingEvents(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // ---------------------------------------------
  // Load current user's registrations
  // ---------------------------------------------

  const loadUserTickets = useCallback(
    async (userId: number) => {
      setIsLoadingTickets(true);

      try {
        const tickets =
          await api.getUserRegistrations(userId);

        setRegistrations(tickets);
      } catch (err) {
        console.error(
          'Failed to load tickets:',
          err
        );
      } finally {
        setIsLoadingTickets(false);
      }
    },
    []
  );

  useEffect(() => {
    if (activeUser?.user_id) {
      loadUserTickets(activeUser.user_id);
    }
  }, [activeUser, loadUserTickets]);

  // ---------------------------------------------
  // Registration completed
  // ---------------------------------------------

  const handleRegistrationCompleted =
    async () => {
      await loadEvents();

      await loadUserTickets(
        activeUser.user_id
      );
    };

  // ---------------------------------------------
  // Event created
  // ---------------------------------------------

  const handleEventCreated = async (
    newEventId: number
  ) => {
    await loadEvents();

    setSelectedEventId(newEventId);
  };

  const featuredEvent =
    events.find(
      (e) => e.status === 'PUBLISHED'
    ) || events[0];

  const totalSeatsLeft =
    events.reduce(
      (sum, event) =>
        sum + (event.seats_left || 0),
      0
    );

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100 font-sans transition-colors duration-200 selection:bg-amber-400 selection:text-stone-950">

      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        activeUser={activeUser}
        onOpenCreateModal={() =>
          setIsCreateModalOpen(true)
        }
        onOpenApiModal={() =>
          setIsApiModalOpen(true)
        }
        isLiveConnected={isLiveConnected}
        totalTicketsCount={registrations.length}
        onLogout={onLogout}
      />

      <main className="flex-1">

        {currentTab === 'explore' && (
          <>
            <Hero
              featuredEvent={featuredEvent}
              totalEventsCount={events.length}
              totalSeatsLeft={totalSeatsLeft}
              onExploreClick={() => {
                const el =
                  document.getElementById(
                    'explore'
                  );

                el?.scrollIntoView({
                  behavior: 'smooth',
                });
              }}
              onViewEvent={(id) =>
                setSelectedEventId(id)
              }
              onHostEvent={() =>
                setIsCreateModalOpen(true)
              }
            />

            <EventsExplorer
              events={events}
              onSelectEvent={(id) =>
                setSelectedEventId(id)
              }
              isLoading={isLoadingEvents}
            />

            <div className="border-t border-stone-200 dark:border-stone-900 bg-stone-100/50 dark:bg-stone-950/40">
              <StatsSection
                events={events}
              />
            </div>
          </>
        )}

        {currentTab === 'tickets' && (
          <TicketsView
            activeUser={activeUser}
            users={[activeUser]}
            onSelectUser={() => {}}
            registrations={registrations}
            isLoading={isLoadingTickets}
            onExploreEvents={() =>
              setCurrentTab('explore')
            }
            onViewEvent={(id) =>
              setSelectedEventId(id)
            }
          />
        )}

        {currentTab === 'stats' && (
          <StatsSection
            events={events}
          />
        )}
      </main>

      <EventDetailModal
        eventId={selectedEventId}
        activeUser={activeUser}
        onClose={() =>
          setSelectedEventId(null)
        }
        onRegistered={
          handleRegistrationCompleted
        }
        onNavigateToTickets={() => {
          setSelectedEventId(null);
          setCurrentTab('tickets');
        }}
      />

      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() =>
          setIsCreateModalOpen(false)
        }
        activeUser={activeUser}
        onEventCreated={
          handleEventCreated
        }
      />

      <ApiStatusModal
        isOpen={isApiModalOpen}
        onClose={() =>
          setIsApiModalOpen(false)
        }
        isLiveConnected={isLiveConnected}
        onConnectionChange={
          setIsLiveConnected
        }
      />

      <Footer
        onSelectTab={setCurrentTab}
        onOpenApiModal={() =>
          setIsApiModalOpen(true)
        }
      />
    </div>
  );
}

// --------------------------------------------------
// Authentication wrapper
// --------------------------------------------------

export default function App() {
  const [activeUser, setActiveUser] =
    useState<User | null>(null);

  const [checkingSession, setCheckingSession] =
    useState(true);

  useEffect(() => {
    let mounted = true;

    const restoreSession = async () => {
      try {
        const user =
          await api.getCurrentUser();

        if (mounted) {
          setActiveUser(user);
        }
      } catch (error) {
        console.error(
          'Session restore failed:',
          error
        );
      } finally {
        if (mounted) {
          setCheckingSession(false);
        }
      }
    };

    restoreSession();

    return () => {
      mounted = false;
    };
  }, []);

  const handleAuthenticated = (
    user: User
  ) => {
    setActiveUser(user);
  };

  const handleLogout = () => {
    api.logout();
    setActiveUser(null);
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-stone-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse mx-auto mb-4" />

          <p className="text-sm text-stone-400">
            Restoring your session...
          </p>
        </div>
      </div>
    );
  }

  if (!activeUser) {
    return (
      <ThemeProvider>
        <AuthGate
          onAuthenticated={
            handleAuthenticated
          }
        />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <MainApp
        activeUser={activeUser}
        onLogout={handleLogout}
      />
    </ThemeProvider>
  );
}