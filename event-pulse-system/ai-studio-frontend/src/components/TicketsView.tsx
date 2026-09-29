import React, { useState } from 'react';
import { User, UserRegistration } from '../types';
import {
  Ticket,
  CheckCircle2,
  Clock,
  Calendar,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TicketsViewProps {
  activeUser: User | null;
  users: User[];
  onSelectUser: (user: User) => void;
  registrations: UserRegistration[];
  isLoading: boolean;
  onExploreEvents: () => void;
  onViewEvent?: (eventId: number) => void;
}

export const TicketsView: React.FC<TicketsViewProps> = ({
  activeUser,
  users,
  onSelectUser,
  registrations,
  isLoading,
  onExploreEvents,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Banner with Viewing As User Selector */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-stone-200 dark:border-stone-800">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold">
            Campus Passes &amp; Boarding Credentials
          </span>
          <h2 className="mt-1 font-display text-3xl sm:text-4xl font-bold tracking-tight text-stone-950 dark:text-white">
            My Digital Passes
          </h2>
          <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
            Official ticket allocations from the campus DBMS view (`vw_my_registrations`). Show at the venue entrance for gate scan.
          </p>
        </div>

        {/* User Switcher Pill Box */}
        <div className="flex items-center gap-3 p-2 bg-stone-100 dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 rounded-xl shadow-sm">
          <div className="text-xs text-stone-600 dark:text-stone-400 pl-2">
            <span className="text-stone-500 font-mono text-[11px] block">Active Attendee</span>
            <span className="font-semibold text-stone-900 dark:text-white truncate max-w-[150px] inline-block">
              {activeUser?.full_name || 'Select'}
            </span>
          </div>
          <select
            value={activeUser?.user_id || ''}
            onChange={(e) => {
              const u = users.find((item) => item.user_id === Number(e.target.value));
              if (u) onSelectUser(u);
            }}
            className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-amber-400 cursor-pointer shadow-sm"
          >
            {users.map((u) => (
              <option key={u.user_id} value={u.user_id}>
                {u.full_name} ({u.role})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tickets List or Empty State */}
      {isLoading ? (
        <div className="py-20 text-center space-y-4">
          <div className="w-10 h-10 border-2 border-amber-500 dark:border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono text-stone-500 dark:text-stone-400">Fetching ticket registry from MySQL...</p>
        </div>
      ) : registrations.length === 0 ? (
        <div className="py-20 my-6 text-center border border-dashed border-stone-300 dark:border-stone-800 rounded-2xl bg-white dark:bg-stone-900/20 max-w-xl mx-auto shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-stone-800/80 mx-auto flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4">
            <Ticket className="w-7 h-7" />
          </div>
          <h3 className="font-display text-xl font-bold text-stone-950 dark:text-white">No passes reserved yet</h3>
          <p className="text-xs text-stone-600 dark:text-stone-400 max-w-md mx-auto mt-2 leading-relaxed">
            {activeUser?.full_name} doesn't have any active event registrations in the database.
            Browse the active lineup and claim your first pass!
          </p>
          <button
            onClick={onExploreEvents}
            className="mt-6 px-5 py-2.5 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md hover:shadow-lg inline-flex items-center gap-2"
          >
            <span>Explore Lineup</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AnimatePresence>
            {registrations.map((reg, index) => {
              const isConfirmed = reg.registration_status === 'CONFIRMED';
              const isWaitlisted = reg.registration_status === 'WAITLISTED';

              return (
                <motion.div
                  key={`${reg.title}-${index}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.08 }}
                  className="relative flex flex-col md:flex-row rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/80 backdrop-blur-md overflow-hidden shadow-md dark:shadow-2xl hover:border-amber-400/50 dark:hover:border-stone-700 transition-all duration-300 group"
                >
                  {/* Left Ticket Stub (Main details) */}
                  <div className="flex-1 p-6 flex flex-col justify-between space-y-6">
                    <div>
                      {/* Top Header Row with status stamp */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400 tracking-wider uppercase block">
                            Campus Boarding Credential
                          </span>
                          <h3 className="font-display text-xl font-bold text-stone-950 dark:text-white mt-1 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
                            {reg.title}
                          </h3>
                        </div>

                        {/* Status Stamp */}
                        <div
                          className={`font-mono text-xs font-extrabold uppercase px-2.5 py-1 rounded border tracking-wider rotate-[-2deg] shrink-0 ${
                            isConfirmed
                              ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
                              : isWaitlisted
                              ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-300 dark:border-amber-500/30 text-amber-700 dark:text-amber-400'
                              : 'bg-rose-50 dark:bg-rose-500/10 border-rose-300 dark:border-rose-500/30 text-rose-700 dark:text-rose-400'
                          }`}
                        >
                          {reg.registration_status}
                        </div>
                      </div>

                      {/* Event location & timing metadata */}
                      <div className="mt-4 grid grid-cols-2 gap-3 text-xs font-mono text-stone-600 dark:text-stone-400">
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500 shrink-0" />
                          <span className="truncate">{reg.venue_name || 'CGC Campus Venue'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                          <Calendar className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500 shrink-0" />
                          <span className="truncate tabular-nums">
                            {reg.start_datetime
                              ? new Date(reg.start_datetime).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                })
                              : 'Upcoming'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Metadata & Check-in badge */}
                    <div className="pt-4 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        {reg.checked_in ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-mono font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Checked In at Venue
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-stone-500 dark:text-stone-400 font-mono">
                            <Clock className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500" />
                            Awaiting Entrance Scan
                          </span>
                        )}
                      </div>

                      <div className="font-mono text-stone-800 dark:text-stone-300 font-medium">
                        {reg.amount && reg.amount > 0 ? (
                          <span>₹{Number(reg.amount).toFixed(2)} ({reg.payment_status || 'PAID'})</span>
                        ) : (
                          <span className="text-emerald-600 dark:text-emerald-400">Free Pass</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Perforated Divider (Notches + dashed line) */}
                  <div className="relative flex md:flex-col items-center justify-center">
                    {/* Top notch */}
                    <div className="hidden md:block absolute -top-3 w-6 h-6 rounded-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 z-10" />
                    {/* Bottom notch */}
                    <div className="hidden md:block absolute -bottom-3 w-6 h-6 rounded-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 z-10" />
                    {/* Vertical dashed line */}
                    <div className="hidden md:block h-full border-r-2 border-dashed border-stone-200 dark:border-stone-800 my-4" />
                    {/* Mobile horizontal dashed divider */}
                    <div className="md:hidden w-full border-t-2 border-dashed border-stone-200 dark:border-stone-800 my-2" />
                  </div>

                  {/* Right Stub: Ticket Code & Barcode Visualizer */}
                  <div className="w-full md:w-56 p-6 bg-stone-50/70 dark:bg-stone-950/60 flex flex-col justify-between items-center text-center space-y-4">
                    <div className="w-full">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 block">
                        Ticket Code
                      </span>
                      <p className="mt-1 font-mono text-base font-bold text-amber-600 dark:text-amber-400 tracking-wider">
                        {reg.ticket_code || 'WAITLIST'}
                      </p>
                    </div>

                    {/* Barcode visual representation */}
                    <div className="w-full py-2 px-3 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 flex flex-col items-center gap-1.5 shadow-sm">
                      <div className="flex items-center justify-center gap-1 h-10 w-full opacity-90">
                        {[4, 2, 6, 3, 7, 2, 5, 2, 8, 3, 5, 2, 6, 4, 7, 2, 4, 3, 6, 2, 5, 3].map(
                          (height, i) => (
                            <div
                              key={i}
                              className="bg-stone-800 dark:bg-stone-300 w-1 rounded-sm"
                              style={{ height: `${height * 10}%` }}
                            />
                          )
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-stone-500 tracking-widest">
                        {reg.ticket_code || 'GATE-PASS-WAIT'}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="w-full flex items-center justify-center gap-2">
                      {reg.ticket_code && (
                        <button
                          onClick={() => handleCopyCode(reg.ticket_code!)}
                          className="w-full py-1.5 px-3 text-xs font-mono font-medium rounded-lg bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white transition-colors"
                        >
                          {copiedCode === reg.ticket_code ? 'Copied Code!' : 'Copy Code'}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
};
