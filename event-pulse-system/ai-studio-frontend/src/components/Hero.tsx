import React from 'react';
import { EventSummary } from '../types';
import { Calendar, MapPin, ArrowRight, Flame, Users, Ticket } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  featuredEvent?: EventSummary;
  totalEventsCount: number;
  totalSeatsLeft: number;
  onExploreClick: () => void;
  onViewEvent: (id: number) => void;
  onHostEvent: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  featuredEvent,
  totalEventsCount,
  totalSeatsLeft,
  onExploreClick,
  onViewEvent,
  onHostEvent,
}) => {
  return (
    <div className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-stone-200 dark:border-stone-900 bg-radial-[at_top_center] from-amber-500/10 via-stone-50 to-stone-100/50 dark:from-stone-900/60 dark:via-stone-950 dark:to-stone-950 transition-colors">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[340px] bg-gradient-to-b from-amber-500/15 via-amber-600/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-cyan-500/5 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Hero Typography & Call-To-Action */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Live Campus Pulse Indicator */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full border border-stone-200 dark:border-stone-800 bg-white/90 dark:bg-stone-900/90 shadow-sm text-xs text-stone-700 dark:text-stone-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 dark:bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500 dark:bg-amber-400" />
              </span>
              <span className="font-mono text-stone-500 dark:text-stone-400">Live Campus Pulse</span>
              <span className="text-stone-300 dark:text-stone-600">·</span>
              <span className="font-mono tabular-nums text-amber-700 dark:text-amber-300 font-semibold">
                {totalEventsCount} Active Events
              </span>
              <span className="text-stone-300 dark:text-stone-600">·</span>
              <span className="font-mono tabular-nums text-stone-600 dark:text-stone-400">
                {totalSeatsLeft} Seats Open
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-950 dark:text-white leading-[1.08] [text-wrap:balance]">
              Where campus ambition turns into{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 dark:from-amber-300 dark:via-amber-400 dark:to-orange-400">
                unforgettable moments.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-stone-600 dark:text-stone-400 max-w-2xl leading-relaxed">
              Discover hackathons, headline music festivals, interactive tech labs, and varsity tournaments.
              Instant ticket allocation, dynamic seat maps, and verified campus passes.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onExploreClick}
                className="px-6 py-3 text-sm font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 active:scale-95 group"
              >
                <span>Explore Campus Lineup</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onHostEvent}
                className="px-6 py-3 text-sm font-medium text-stone-700 hover:text-stone-950 dark:text-stone-300 dark:hover:text-white bg-white hover:bg-stone-100 dark:bg-stone-900/80 dark:hover:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 shadow-sm transition-all active:scale-95"
              >
                Organize an Event
              </button>
            </div>

            {/* Quick trust metrics */}
            <div className="pt-4 flex items-center gap-6 text-xs text-stone-500 font-mono">
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                <span>Zero waitlist stalls</span>
              </div>
              <span className="text-stone-300 dark:text-stone-800">|</span>
              <div className="flex items-center gap-1.5">
                <Ticket className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                <span>Instant pass generation</span>
              </div>
              <span className="text-stone-300 dark:text-stone-800">|</span>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                <span>Verified student admission</span>
              </div>
            </div>
          </motion.div>

          {/* Featured Spotlight Card */}
          {featuredEvent && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5"
            >
              <div
                onClick={() => onViewEvent(featuredEvent.event_id)}
                className="group relative rounded-2xl border border-stone-200 dark:border-stone-800 bg-white/90 dark:bg-stone-900/70 backdrop-blur-md p-6 overflow-hidden cursor-pointer hover:border-amber-400/60 transition-all duration-300 shadow-xl dark:shadow-2xl hover:shadow-amber-500/10"
              >
                {/* Visual glow on hover */}
                <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-amber-400/10 rounded-full blur-2xl group-hover:bg-amber-400/20 transition-all duration-500 pointer-events-none" />

                {/* Quiet unboxed kicker */}
                <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 pb-3 border-b border-stone-100 dark:border-stone-800">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider text-[11px]">
                      Spotlight Selection
                    </span>
                    <span>·</span>
                    <span className="text-stone-800 dark:text-stone-300">{featuredEvent.category_name}</span>
                  </div>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                    {featuredEvent.seats_left} seats left
                  </span>
                </div>

                {/* Title */}
                <h3 className="mt-4 font-display text-2xl font-bold text-stone-950 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
                  {featuredEvent.title}
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed">
                  {featuredEvent.description ||
                    'Join the leading campus gathering with featured speakers, hands-on activities, and networking opportunities.'}
                </p>

                {/* Metadata row */}
                <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800/80 flex flex-col gap-2 text-xs text-stone-600 dark:text-stone-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
                    <span className="font-mono tabular-nums text-stone-800 dark:text-stone-300">
                      {new Date(featuredEvent.start_datetime).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500 shrink-0" />
                    <span className="truncate">{featuredEvent.venue_name}</span>
                  </div>
                </div>

                {/* Bottom action banner */}
                <div className="mt-6 flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800">
                  <span className="font-mono text-xs text-stone-500 dark:text-stone-400">
                    Host: <span className="text-stone-900 dark:text-stone-200 font-medium">{featuredEvent.organizer_name}</span>
                  </span>
                  <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    View Details &amp; Pass <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
