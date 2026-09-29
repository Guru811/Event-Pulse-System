import React, { useState, useMemo, useEffect } from 'react';
import { EventSummary, EventStatus } from '../types';
import { getCategoryImage, CATEGORY_ACCENTS } from '../assets/images';
import { Search, Calendar, MapPin, Users, Clock, Filter, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EventsExplorerProps {
  events: EventSummary[];
  onSelectEvent: (eventId: number) => void;
  isLoading: boolean;
}

const CATEGORIES = ['All', 'Technical', 'Cultural', 'Workshop', 'Sports'];
const STATUS_OPTIONS: { label: string; value: string }[] = [
  { label: 'All Statuses', value: 'ALL' },
  { label: 'Published', value: 'PUBLISHED' },
  { label: 'Ongoing', value: 'ONGOING' },
  { label: 'Completed', value: 'COMPLETED' },
];

export const EventsExplorer: React.FC<EventsExplorerProps> = ({
  events,
  onSelectEvent,
  isLoading,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Live timer tick for countdown calculations
  const [now, setNow] = useState<number>(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter logic
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      // Category filter
      if (selectedCategory !== 'All' && ev.category_name !== selectedCategory) {
        return false;
      }
      // Status filter
      if (selectedStatus !== 'ALL' && ev.status !== selectedStatus) {
        return false;
      }
      // Search query (title, venue, organizer)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = ev.title.toLowerCase().includes(q);
        const matchesVenue = ev.venue_name.toLowerCase().includes(q);
        const matchesOrg = ev.organizer_name.toLowerCase().includes(q);
        if (!matchesTitle && !matchesVenue && !matchesOrg) {
          return false;
        }
      }
      return true;
    });
  }, [events, selectedCategory, selectedStatus, searchQuery]);

  // Helper for live countdown
  const getCountdownString = (startDatetimeStr: string, status: EventStatus) => {
    if (status === 'COMPLETED') return 'Concluded';
    if (status === 'ONGOING') return 'Happening Now';
    if (status === 'CANCELLED') return 'Cancelled';

    const target = new Date(startDatetimeStr).getTime();
    const diff = target - now;

    if (diff <= 0) return 'Live Now';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes}m left`;
  };

  return (
    <section id="explore" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-stone-200 dark:border-stone-800">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold">
            Campus Catalog
          </span>
          <h2 className="mt-1 font-display text-3xl sm:text-4xl font-bold tracking-tight text-stone-950 dark:text-white">
            Explore Events &amp; Festivals
          </h2>
          <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
            Real-time seat tracking from the campus DBMS. Click any card to inspect sessions and reserve passes.
          </p>
        </div>

        {/* Search input with clean affordance */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by event, hall, host..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-xs text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-amber-400 shadow-sm transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 text-xs"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Filter bar: Segmented categories + Status filter */}
      <div className="py-6 flex flex-wrap items-center justify-between gap-4">
        {/* Category segmented buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 rounded-xl overflow-x-auto max-w-full">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-amber-400 text-stone-950 font-semibold shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-stone-200 hover:bg-stone-200/70 dark:hover:bg-stone-800/50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Status selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500 font-mono flex items-center gap-1">
            <Filter className="w-3 h-3" /> Status:
          </span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg text-xs text-stone-800 dark:text-stone-300 px-3 py-1.5 focus:outline-none focus:border-amber-400 transition-colors cursor-pointer shadow-sm"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-200">
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Event Grid / Empty State */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-900/40 p-4 animate-pulse h-96 flex flex-col justify-between"
            >
              <div className="w-full h-44 bg-stone-200 dark:bg-stone-800 rounded-xl" />
              <div className="space-y-3 pt-4">
                <div className="w-1/3 h-3 bg-stone-200 dark:bg-stone-800 rounded" />
                <div className="w-3/4 h-5 bg-stone-200 dark:bg-stone-800 rounded" />
                <div className="w-full h-3 bg-stone-200 dark:bg-stone-800 rounded" />
              </div>
              <div className="w-full h-10 bg-stone-200 dark:bg-stone-800 rounded-lg mt-4" />
            </div>
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-stone-300 dark:border-stone-800 rounded-2xl bg-white dark:bg-stone-900/20 my-6 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-800/80 mx-auto flex items-center justify-center text-stone-500 dark:text-stone-400 mb-3">
            <Filter className="w-5 h-5" />
          </div>
          <h3 className="font-display text-lg font-semibold text-stone-950 dark:text-white">No matching campus events</h3>
          <p className="text-xs text-stone-600 dark:text-stone-400 max-w-sm mx-auto mt-1">
            Try adjusting your search criteria or switch categories to discover upcoming activities.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedStatus('ALL');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 text-xs font-medium text-amber-600 dark:text-amber-400 hover:text-amber-500 border border-amber-500/30 hover:border-amber-500/60 rounded-lg transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredEvents.map((event) => {
              const categoryImg = getCategoryImage(event.category_name);
              const accent = CATEGORY_ACCENTS[event.category_name] || CATEGORY_ACCENTS.Technical;
              const seatsPercent = Math.max(
                0,
                Math.min(100, Math.round((event.seats_left / event.max_attendees) * 100))
              );
              const countdown = getCountdownString(event.start_datetime, event.status);

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  key={event.event_id}
                  onClick={() => onSelectEvent(event.event_id)}
                  className={`group relative flex flex-col justify-between rounded-2xl border border-stone-200 dark:border-stone-800/90 bg-white dark:bg-stone-900/60 hover:bg-stone-50/50 dark:hover:bg-stone-900 backdrop-blur-sm overflow-hidden transition-all duration-300 shadow-sm hover:shadow-lg dark:hover:shadow-amber-500/5 cursor-pointer ${accent.border}`}
                >
                  {/* Top Image Banner */}
                  <div className="relative w-full h-48 overflow-hidden bg-stone-950">
                    <img
                      src={categoryImg}
                      alt={event.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent" />

                    {/* Top unboxed kicker & countdown timer */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs">
                      <span className="font-mono text-[11px] font-semibold tracking-wider text-amber-300 px-2.5 py-1 rounded bg-stone-950/80 backdrop-blur-md border border-stone-800">
                        {event.category_name}
                      </span>

                      <span className="font-mono text-[11px] tabular-nums text-stone-200 px-2.5 py-1 rounded bg-stone-950/80 backdrop-blur-md border border-stone-800 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        {countdown}
                      </span>
                    </div>

                    {/* Status marker */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          event.status === 'PUBLISHED'
                            ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                            : event.status === 'ONGOING'
                            ? 'bg-amber-400 animate-pulse'
                            : event.status === 'COMPLETED'
                            ? 'bg-stone-400'
                            : 'bg-rose-400'
                        }`}
                      />
                      <span className="font-mono text-[11px] uppercase tracking-wider text-stone-200 font-medium">
                        {event.status}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Quiet unboxed metadata: date & time */}
                      <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-amber-600 dark:text-stone-500" />
                        <span className="tabular-nums font-medium">
                          {new Date(event.start_datetime).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      {/* Main Title */}
                      <h3 className="mt-2 font-display text-lg font-bold text-stone-950 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors leading-snug">
                        {event.title}
                      </h3>

                      {/* Venue & Organizer */}
                      <div className="mt-2.5 space-y-1 text-xs text-stone-600 dark:text-stone-400">
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500 shrink-0" />
                          <span className="truncate">{event.venue_name}</span>
                        </div>
                        <div className="text-[11px] text-stone-500 truncate">
                          Organized by <span className="text-stone-800 dark:text-stone-300 font-medium">{event.organizer_name}</span>
                        </div>
                      </div>
                    </div>

                    {/* Seats Left Bar & Quick Reservation */}
                    <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800/80">
                      <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                        <span className="text-stone-500 dark:text-stone-400 flex items-center gap-1">
                          <Users className="w-3 h-3 text-stone-400 dark:text-stone-500" /> Capacity
                        </span>
                        <span
                          className={`tabular-nums font-semibold ${
                            event.seats_left === 0
                              ? 'text-rose-600 dark:text-rose-400'
                              : event.seats_left < 10
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          {event.seats_left === 0 ? 'Waitlist Only' : `${event.seats_left} seats left`}
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            event.seats_left === 0
                              ? 'bg-rose-500'
                              : event.seats_left < 10
                              ? 'bg-amber-400'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.max(5, seatsPercent)}%` }}
                        />
                      </div>

                      {/* Card Footer action */}
                      <div className="mt-4 flex items-center justify-between">
                        <span className="font-mono text-xs font-semibold text-stone-900 dark:text-stone-300">
                          {event.ticket_price && event.ticket_price > 0 ? (
                            `₹${Number(event.ticket_price).toFixed(2)}`
                          ) : (
                            <span className="text-emerald-600 dark:text-emerald-400">Free Entry</span>
                          )}
                        </span>

                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 group-hover:text-amber-500 dark:group-hover:text-amber-300 transition-colors">
                          <span>View Sessions</span>
                          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
};
