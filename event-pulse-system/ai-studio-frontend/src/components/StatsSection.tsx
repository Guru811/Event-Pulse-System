import React, { useMemo } from 'react';
import { EventSummary } from '../types';
import { useTheme } from '../context/ThemeContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Users, Ticket, TrendingUp, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

interface StatsSectionProps {
  events: EventSummary[];
}

export const StatsSection: React.FC<StatsSectionProps> = ({ events }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  // Aggregate data by category
  const categoryStats = useMemo(() => {
    const map: Record<string, { category: string; maxSeats: number; seatsFilled: number }> = {};

    events.forEach((ev) => {
      const cat = ev.category_name || 'Other';
      if (!map[cat]) {
        map[cat] = { category: cat, maxSeats: 0, seatsFilled: 0 };
      }
      map[cat].maxSeats += ev.max_attendees;
      map[cat].seatsFilled += Math.max(0, ev.max_attendees - ev.seats_left);
    });

    return Object.values(map);
  }, [events]);

  // Aggregate status distribution
  const statusStats = useMemo(() => {
    const counts: Record<string, number> = {
      PUBLISHED: 0,
      ONGOING: 0,
      COMPLETED: 0,
      CANCELLED: 0,
    };

    events.forEach((ev) => {
      if (counts[ev.status] !== undefined) {
        counts[ev.status]++;
      } else {
        counts[ev.status] = 1;
      }
    });

    return [
      { name: 'Published', value: counts.PUBLISHED, color: isDark ? '#38bdf8' : '#0284c7' },
      { name: 'Ongoing', value: counts.ONGOING, color: '#f59e0b' },
      { name: 'Completed', value: counts.COMPLETED, color: isDark ? '#10b981' : '#059669' },
      { name: 'Cancelled', value: counts.CANCELLED, color: '#f43f5e' },
    ].filter((item) => item.value > 0);
  }, [events, isDark]);

  // Key metrics
  const totalCapacity = events.reduce((sum, e) => sum + e.max_attendees, 0);
  const totalFilled = events.reduce(
    (sum, e) => sum + Math.max(0, e.max_attendees - e.seats_left),
    0
  );
  const fillRate = totalCapacity > 0 ? Math.round((totalFilled / totalCapacity) * 100) : 0;

  return (
    <section id="stats" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="pb-8 border-b border-stone-200 dark:border-stone-800">
        <span className="text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold">
          Database Aggregates &amp; Trends
        </span>
        <h2 className="mt-1 font-display text-3xl sm:text-4xl font-bold tracking-tight text-stone-950 dark:text-white">
          Campus Event Pulse Analytics
        </h2>
        <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
          Live DBMS aggregation computed from MySQL views (`vw_event_summary` and attendance joins).
        </p>
      </div>

      {/* KPI Stat Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/60 shadow-sm backdrop-blur-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-stone-500 dark:text-stone-400">Total Hosted Events</span>
            <Calendar className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          </div>
          <p className="mt-3 font-mono text-3xl font-bold text-stone-950 dark:text-white tabular-nums">
            {events.length}
          </p>
          <span className="mt-1 text-[11px] font-mono text-stone-500 block">
            Across 4 Campus Disciplines
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/60 shadow-sm backdrop-blur-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-stone-500 dark:text-stone-400">Seats Reserved</span>
            <Ticket className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
          </div>
          <p className="mt-3 font-mono text-3xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
            {totalFilled}
          </p>
          <span className="mt-1 text-[11px] font-mono text-stone-500 block">
            Verified Attendee Passes
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/60 shadow-sm backdrop-blur-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-stone-500 dark:text-stone-400">Campus Capacity</span>
            <Users className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          </div>
          <p className="mt-3 font-mono text-3xl font-bold text-cyan-700 dark:text-cyan-400 tabular-nums">
            {totalCapacity}
          </p>
          <span className="mt-1 text-[11px] font-mono text-stone-500 block">
            Max Auditorium &amp; Hall Capacity
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/60 shadow-sm backdrop-blur-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-stone-500 dark:text-stone-400">Overall Attendance Fill</span>
            <TrendingUp className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          </div>
          <p className="mt-3 font-mono text-3xl font-bold text-amber-600 dark:text-amber-400 tabular-nums">
            {fillRate}%
          </p>
          <span className="mt-1 text-[11px] font-mono text-stone-500 block">
            High Campus Engagement
          </span>
        </motion.div>
      </div>

      {/* Visual Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Category Capacity vs Filled Chart */}
        <div className="lg:col-span-8 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/60 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display text-base font-bold text-stone-950 dark:text-white">
                Seat Allocation by Category
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Comparison of total allocated venue capacity vs booked passes
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400">
                <span className="w-2.5 h-2.5 rounded bg-stone-300 dark:bg-stone-700" /> Total Capacity
              </span>
              <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                <span className="w-2.5 h-2.5 rounded bg-amber-400" /> Reserved Seats
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryStats}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <XAxis
                  dataKey="category"
                  stroke={isDark ? '#78716c' : '#a8a29e'}
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: isDark ? '#292524' : '#e7e5e4' }}
                />
                <YAxis
                  stroke={isDark ? '#78716c' : '#a8a29e'}
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: isDark ? '#292524' : '#e7e5e4' }}
                />
                <Tooltip
                  cursor={{ fill: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)' }}
                  contentStyle={{
                    backgroundColor: isDark ? '#1c1917' : '#ffffff',
                    borderColor: isDark ? '#292524' : '#e7e5e4',
                    borderRadius: '0.75rem',
                    color: isDark ? '#f5f5f4' : '#1c1917',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Bar
                  dataKey="maxSeats"
                  fill={isDark ? '#44403c' : '#e7e5e4'}
                  radius={[4, 4, 0, 0]}
                  name="Max Seats"
                />
                <Bar
                  dataKey="seatsFilled"
                  fill="#f59e0b"
                  radius={[4, 4, 0, 0]}
                  name="Reserved Seats"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Pie Chart */}
        <div className="lg:col-span-4 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/60 shadow-sm backdrop-blur-sm flex flex-col justify-between">
          <div>
            <h3 className="font-display text-base font-bold text-stone-950 dark:text-white">Event Lifecycle States</h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">Current status breakdown in campus database</p>
          </div>

          <div className="h-52 w-full flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#1c1917' : '#ffffff',
                    borderColor: isDark ? '#292524' : '#e7e5e4',
                    borderRadius: '0.75rem',
                    color: isDark ? '#f5f5f4' : '#1c1917',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800/80 text-xs font-mono">
            {statusStats.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-stone-700 dark:text-stone-300">{item.name}</span>
                </div>
                <span className="text-stone-500 dark:text-stone-400 tabular-nums font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
