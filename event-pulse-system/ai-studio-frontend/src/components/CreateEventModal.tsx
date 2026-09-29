import React, { useState } from 'react';
import { CreateEventPayload, User } from '../types';
import { api } from '../services/api';
import { X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeUser: User | null;
  onEventCreated: (eventId: number) => void;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  activeUser,
  onEventCreated,
}) => {
  const [formData, setFormData] = useState<CreateEventPayload>({
    title: '',
    description: '',
    category_id: 1,
    venue_id: 1,
    organizer_id: activeUser?.user_id || 2,
    start_datetime: '2026-10-25T10:00',
    end_datetime: '2026-10-25T18:00',
    max_attendees: 150,
    ticket_price: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!formData.title.trim()) {
      setErrorMessage('Please provide an event title');
      return;
    }

    if (new Date(formData.end_datetime) <= new Date(formData.start_datetime)) {
      setErrorMessage('End time must be after the start time (DBMS Constraint)');
      return;
    }

    if (formData.max_attendees <= 0) {
      setErrorMessage('Max attendees capacity must be greater than zero');
      return;
    }

    setIsSubmitting(true);
    try {
      // Format timestamps to MySQL format: 'YYYY-MM-DD HH:mm:ss'
      const formattedStart = formData.start_datetime.replace('T', ' ') + ':00';
      const formattedEnd = formData.end_datetime.replace('T', ' ') + ':00';

      const payload: CreateEventPayload = {
        ...formData,
        start_datetime: formattedStart,
        end_datetime: formattedEnd,
        organizer_id: activeUser?.user_id || 2,
        max_attendees: Number(formData.max_attendees),
        ticket_price: Number(formData.ticket_price),
      };

      const result = await api.createEvent(payload);
      onEventCreated(result.event_id);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit event to database');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-950/70 backdrop-blur-md"
        />

        {/* Modal dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-2xl overflow-hidden z-10 my-8"
        >
          {/* Header */}
          <div className="p-6 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold">
                Event Hosting Registry
              </span>
              <h3 className="font-display text-xl font-bold text-stone-950 dark:text-white mt-0.5">
                Publish a New Campus Event
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-stone-950 dark:text-stone-400 dark:hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {errorMessage && (
              <div className="p-3.5 rounded-xl border border-rose-300 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-950/30 text-xs text-rose-800 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5">
                Event Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. RoboWars Championship 2026"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl text-xs text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-amber-400 transition-colors shadow-sm"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5">
                Description &amp; Highlights *
              </label>
              <textarea
                required
                rows={3}
                placeholder="Detail what attendees will build, watch, or participate in..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl text-xs text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-amber-400 transition-colors resize-none shadow-sm"
              />
            </div>

            {/* Category & Venue Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5">
                  Category *
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) =>
                    setFormData({ ...formData, category_id: Number(e.target.value) })
                  }
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl text-xs text-stone-900 dark:text-stone-200 focus:outline-none focus:border-amber-400 shadow-sm"
                >
                  <option value={1}>Technical (Hackathons, talks)</option>
                  <option value={2}>Cultural (Music, drama)</option>
                  <option value={3}>Workshop (Hands-on labs)</option>
                  <option value={4}>Sports (Inter/intra tournaments)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5">
                  Venue Location *
                </label>
                <select
                  value={formData.venue_id}
                  onChange={(e) => setFormData({ ...formData, venue_id: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl text-xs text-stone-900 dark:text-stone-200 focus:outline-none focus:border-amber-400 shadow-sm"
                >
                  <option value={1}>Main Auditorium (Cap: 500)</option>
                  <option value={2}>Seminar Hall B (Cap: 120)</option>
                  <option value={3}>Open Air Theatre (Cap: 800)</option>
                  <option value={4}>Sports Complex Arena (Cap: 350)</option>
                </select>
              </div>
            </div>

            {/* Start & End Timestamps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5">
                  Start Date &amp; Time *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.start_datetime}
                  onChange={(e) =>
                    setFormData({ ...formData, start_datetime: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl text-xs text-stone-900 dark:text-stone-200 focus:outline-none focus:border-amber-400 font-mono shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5">
                  End Date &amp; Time *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.end_datetime}
                  onChange={(e) => setFormData({ ...formData, end_datetime: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl text-xs text-stone-900 dark:text-stone-200 focus:outline-none focus:border-amber-400 font-mono shadow-sm"
                />
              </div>
            </div>

            {/* Capacity & Ticket Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5">
                  Max Attendees (Capacity) *
                </label>
                <input
                  type="number"
                  min={1}
                  max={2000}
                  required
                  value={formData.max_attendees}
                  onChange={(e) =>
                    setFormData({ ...formData, max_attendees: Number(e.target.value) })
                  }
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-400 font-mono shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5">
                  Ticket Fee (INR ₹, 0 for Free)
                </label>
                <input
                  type="number"
                  min={0}
                  step={10}
                  value={formData.ticket_price}
                  onChange={(e) =>
                    setFormData({ ...formData, ticket_price: Number(e.target.value) })
                  }
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-400 font-mono shadow-sm"
                />
              </div>
            </div>

            {/* Organizer Note */}
            <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/60 text-xs text-stone-600 dark:text-stone-400">
              Publishing as host: <span className="text-stone-900 dark:text-white font-medium">{activeUser?.full_name}</span>{' '}
              <span className="font-mono text-stone-500">({activeUser?.role})</span>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-950 dark:text-stone-400 dark:hover:text-white border border-stone-300 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-700 rounded-xl transition-colors shadow-sm"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                    <span>Inserting into DBMS...</span>
                  </>
                ) : (
                  <span>Publish Campus Event</span>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
