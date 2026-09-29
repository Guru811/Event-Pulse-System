import React from 'react';

interface FooterProps {
  onSelectTab: (tab: 'explore' | 'tickets' | 'stats') => void;
  onOpenApiModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, onOpenApiModal }) => {
  return (
    <footer className="border-t border-stone-200 dark:border-stone-900 bg-stone-100/60 dark:bg-stone-950 py-12 text-xs text-stone-500 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand wordmark */}
        <div className="flex flex-col items-center md:items-start gap-1">
          <div className="font-display text-base font-bold text-stone-950 dark:text-white tracking-tight flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400" />
            Event Pulse
          </div>
          <p className="text-stone-500 text-[11px]">
            Campus event management &amp; ticketing showcase
          </p>
        </div>

        {/* Quiet navigation mirror */}
        <div className="flex items-center gap-6 text-stone-600 dark:text-stone-400 font-medium">
          <button
            onClick={() => {
              onSelectTab('explore');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hover:text-stone-950 dark:hover:text-white transition-colors"
          >
            Explore
          </button>
          <button
            onClick={() => {
              onSelectTab('tickets');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hover:text-stone-950 dark:hover:text-white transition-colors"
          >
            My Passes
          </button>
          <button
            onClick={() => {
              onSelectTab('stats');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hover:text-stone-950 dark:hover:text-white transition-colors"
          >
            Analytics
          </button>
          <button
            onClick={onOpenApiModal}
            className="hover:text-stone-950 dark:hover:text-white transition-colors"
          >
            Backend Diagnostics
          </button>
        </div>

        {/* Copyright notice */}
        <div className="text-center md:text-right font-mono text-[11px] text-stone-500 dark:text-stone-600">
          <span>&copy; {new Date().getFullYear()} CGC Campus Life. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};
