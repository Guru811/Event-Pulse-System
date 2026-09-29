import React, { useState, useEffect } from 'react';
import { EventDetail, User } from '../types';
import { api } from '../services/api';
import { getCategoryImage } from '../assets/images';
import {
  X,
  Clock,
  Ticket,
  CheckCircle,
  AlertCircle,
  Layers,
  ArrowRight,
  Users,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EventDetailModalProps {
  eventId: number | null;
  activeUser: User | null;
  onClose: () => void;
  onRegistered: () => void;
  onNavigateToTickets: () => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  eventId,
  activeUser,
  onClose,
  onRegistered,
  onNavigateToTickets,
}) => {
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{
    text: string;
    type: 'success' | 'warning' | 'error';
  } | null>(null);

  // Load single event details
  useEffect(() => {
    if (!eventId) return;
    let isMounted = true;
    setIsLoading(true);
    setFeedbackMessage(null);

    api
      .getEventById(eventId)
      .then((data) => {
        if (isMounted) {
          setEvent(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setIsLoading(false);
          setFeedbackMessage({ text: err.message || 'Failed to load event details', type: 'error' });
        }
      });

    return () => {
      isMounted = false;
    };
  }, [eventId]);

  const handleRegister = async () => {
    if (!event || !activeUser) {
      setFeedbackMessage({
        text: 'Please select a valid user profile from the top bar to register.',
        type: 'warning',
      });
      return;
    }

    setIsRegistering(true);
    setFeedbackMessage(null);

    try {
      const res = await api.registerForEvent(event.event_id, activeUser.user_id);
      const isWaitlist = res.message.toLowerCase().includes('waitlist');
      const isAlready = res.message.toLowerCase().includes('already');

      setFeedbackMessage({
        text: res.message,
        type: isAlready ? 'warning' : isWaitlist ? 'warning' : 'success',
      });

      // Refresh event to get updated seats_left
      const updated = await api.getEventById(event.event_id);
      setEvent(updated);
      onRegistered();
    } catch (err: any) {
      setFeedbackMessage({
        text: err.message || 'Registration failed. Check network or server connection.',
        type: 'error',
      });
    } finally {
      setIsRegistering(false);
    }
  };

  if (!eventId) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-950/70 backdrop-blur-md transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-3xl rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/90 dark:bg-stone-950/70 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white flex items-center justify-center backdrop-blur-sm shadow-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {isLoading ? (
            <div className="p-12 text-center space-y-4">
              <div className="w-10 h-10 border-2 border-amber-500 dark:border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-mono text-stone-500 dark:text-stone-400">Loading session timeline...</p>
            </div>
          ) : event ? (
            <div className="flex-1 overflow-y-auto">
              {/* Hero Banner Header */}
              <div className="relative w-full h-64 sm:h-72 bg-stone-950 overflow-hidden">
                <img
                  src={getCategoryImage(event.category_name)}
                  alt={event.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/50 to-transparent" />

                {/* Banner Content */}
                <div className="absolute bottom-6 left-6 right-6">
                  {/* Category unboxed kicker & Status */}
                  <div className="flex items-center gap-2 text-xs font-mono text-stone-200 mb-2">
                    <span className="font-semibold text-amber-300 px-2 py-0.5 rounded bg-stone-950/80 border border-stone-800">
                      {event.category_name}
                    </span>
                    <span>·</span>
                    <span className="text-stone-200">{event.venue_name}</span>
                    <span>·</span>
                    <span className="font-semibold uppercase text-stone-300">{event.status}</span>
                  </div>

                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight">
                    {event.title}
                  </h2>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-6 sm:p-8 space-y-8">
                {/* Notification / Feedback Banner */}
                {feedbackMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl border text-xs flex items-start justify-between gap-3 ${
                      feedbackMessage.type === 'success'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                        : feedbackMessage.type === 'warning'
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-500/30 text-amber-800 dark:text-amber-300'
                        : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-500/30 text-rose-800 dark:text-rose-300'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {feedbackMessage.type === 'success' ? (
                        <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                      )}
                      <div>
                        <p className="font-semibold">{feedbackMessage.text}</p>
                        {feedbackMessage.type === 'success' && (
                          <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-1">
                            Your pass has been generated with a unique ticket code.
                          </p>
                        )}
                      </div>
                    </div>

                    {feedbackMessage.type === 'success' && (
                      <button
                        onClick={onNavigateToTickets}
                        className="px-3 py-1 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-500 transition-colors whitespace-nowrap text-xs flex items-center gap-1 shrink-0"
                      >
                        View Pass <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </motion.div>
                )}

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/40 text-xs font-mono">
                  <div>
                    <span className="text-stone-500 block text-[11px]">Date &amp; Time</span>
                    <span className="text-stone-900 dark:text-stone-200 font-semibold tabular-nums mt-1 block">
                      {new Date(event.start_datetime).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="text-stone-500 dark:text-stone-400 text-[11px]">
                      {new Date(event.start_datetime).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div>
                    <span className="text-stone-500 block text-[11px]">Venue Hall</span>
                    <span className="text-stone-900 dark:text-stone-200 font-semibold mt-1 block truncate">
                      {event.venue_name}
                    </span>
                    <span className="text-stone-500 dark:text-stone-400 text-[11px]">CGC Campus</span>
                  </div>

                  <div>
                    <span className="text-stone-500 block text-[11px]">Pass Fee</span>
                    <span className="text-stone-900 dark:text-stone-200 font-semibold mt-1 block font-mono">
                      {event.ticket_price && event.ticket_price > 0 ? (
                        `₹${Number(event.ticket_price).toFixed(2)}`
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400">Free Admission</span>
                      )}
                    </span>
                    <span className="text-stone-500 dark:text-stone-400 text-[11px]">Inclusive of Taxes</span>
                  </div>

                  <div>
                    <span className="text-stone-500 block text-[11px]">Seats Left</span>
                    <span
                      className={`font-semibold tabular-nums mt-1 block ${
                        event.seats_left === 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {event.seats_left} / {event.max_attendees}
                    </span>
                    <span className="text-stone-500 dark:text-stone-400 text-[11px]">
                      {event.seats_left === 0 ? 'Waitlist Mode' : 'Instant Confirmation'}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-display text-base font-bold text-stone-950 dark:text-white mb-2">About This Event</h3>
                  <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                    {event.description ||
                      'Join fellow college peers for this curated campus gathering featuring keynote speakers, real-world sessions, and networking.'}
                  </p>
                </div>

                {/* Session Schedule Timeline */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display text-base font-bold text-stone-950 dark:text-white flex items-center gap-2">
                      <Layers className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                      Session Schedule &amp; Agenda
                    </h3>
                    <span className="text-xs font-mono text-stone-500">
                      {event.sessions?.length || 0} Sub-Sessions
                    </span>
                  </div>

                  {event.sessions && event.sessions.length > 0 ? (
                    <div className="space-y-4 border-l border-stone-200 dark:border-stone-800 ml-3 pl-6">
                      {event.sessions.map((session, index) => (
                        <div key={session.session_id || index} className="relative group">
                          {/* Timeline dot */}
                          <div className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-amber-400 ring-4 ring-white dark:ring-stone-900 group-hover:scale-125 transition-transform" />

                          <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-950/60 hover:border-stone-300 dark:hover:border-stone-700 transition-colors">
                            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-stone-500 dark:text-stone-400">
                              <span className="text-amber-700 dark:text-amber-400 flex items-center gap-1.5 font-semibold">
                                <Clock className="w-3.5 h-3.5" />
                                {new Date(session.start_time).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}{' '}
                                -{' '}
                                {new Date(session.end_time).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>

                              {session.room_no && (
                                <span className="text-stone-700 dark:text-stone-400 px-2 py-0.5 rounded bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                                  Room: {session.room_no}
                                </span>
                              )}
                            </div>

                            <h4 className="mt-2 text-sm font-semibold text-stone-950 dark:text-white">
                              {session.session_title}
                            </h4>

                            {session.speaker_name && (
                              <p className="mt-1 text-xs text-stone-600 dark:text-stone-400">
                                Speaker / Host:{' '}
                                <span className="text-stone-900 dark:text-stone-200 font-medium">{session.speaker_name}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl border border-dashed border-stone-200 dark:border-stone-800 text-center text-xs text-stone-500 font-mono">
                      Main stage general track. No separate breakout sessions listed.
                    </div>
                  )}
                </div>

                {/* Organizer details */}
                <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-950/40 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-stone-500 block text-[11px]">Primary Organizer</span>
                    <span className="text-stone-900 dark:text-white font-medium">{event.organizer_name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-stone-500 block text-[11px]">Host Role</span>
                    <span className="font-mono text-amber-700 dark:text-amber-400 font-medium">Verified College Club</span>
                  </div>
                </div>
              </div>

              {/* Fixed Modal Action Footer */}
              <div className="p-6 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-stone-600 dark:text-stone-400">
                  <span>Registering as: </span>
                  <span className="text-stone-900 dark:text-white font-semibold">{activeUser?.full_name}</span>{' '}
                  <span className="font-mono text-stone-500">({activeUser?.role})</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={onClose}
                    className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white border border-stone-300 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-700 rounded-xl transition-colors bg-white dark:bg-transparent shadow-sm"
                  >
                    Cancel
                  </button>

                  <button
                    disabled={isRegistering || event.status === 'COMPLETED' || event.status === 'CANCELLED'}
                    onClick={handleRegister}
                    className={`flex-1 sm:flex-none px-6 py-2.5 text-xs font-semibold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 ${
                      event.status === 'COMPLETED'
                        ? 'bg-stone-300 dark:bg-stone-800 text-stone-500 cursor-not-allowed'
                        : event.seats_left === 0
                        ? 'bg-amber-500 hover:bg-amber-400 text-stone-950'
                        : 'bg-amber-400 hover:bg-amber-300 text-stone-950 shadow-amber-400/10'
                    }`}
                  >
                    {isRegistering ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                        <span>Reserving Seat...</span>
                      </>
                    ) : event.status === 'COMPLETED' ? (
                      <span>Event Concluded</span>
                    ) : event.seats_left === 0 ? (
                      <>
                        <Users className="w-3.5 h-3.5" />
                        <span>Join Waitlist</span>
                      </>
                    ) : (
                      <>
                        <Ticket className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Claim Admission Pass</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
