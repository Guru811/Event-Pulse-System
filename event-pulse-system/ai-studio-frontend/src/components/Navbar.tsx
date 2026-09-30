
import React, { useState } from 'react';
import { User } from '../types';
import { useTheme, ThemeMode } from '../context/ThemeContext';
import { Sun, Moon, Monitor, Plus, ChevronDown, Check } from 'lucide-react';

interface NavbarProps {
  currentTab: 'explore' | 'tickets' | 'stats';
  onSelectTab: (tab: 'explore' | 'tickets' | 'stats') => void;
  activeUser: User;
  onOpenCreateModal: () => void;
  onOpenApiModal: () => void;
  isLiveConnected: boolean;
  totalTicketsCount: number;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  activeUser,
  onOpenCreateModal,
  onOpenApiModal,
  isLiveConnected,
  totalTicketsCount,
  onLogout,
}) => {
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const { theme, resolvedTheme, setTheme } = useTheme();

  const canHostEvent =
    activeUser.role === 'ORGANIZER' ||
    activeUser.role === 'ADMIN';

  const themeOptions: {
    label: string;
    mode: ThemeMode;
    icon: React.ReactNode;
  }[] = [
    { label: 'Light', mode: 'light', icon: <Sun className="w-3.5 h-3.5" /> },
    { label: 'Dark', mode: 'dark', icon: <Moon className="w-3.5 h-3.5" /> },
    { label: 'System', mode: 'system', icon: <Monitor className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md border-b transition-colors duration-200 border-stone-200/80 dark:border-stone-800/80 bg-white/85 dark:bg-stone-950/85">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            onSelectTab('explore');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="font-display text-xl font-bold tracking-tight text-stone-950 dark:text-white hover:text-amber-500 dark:hover:text-amber-400 transition-colors shrink-0 flex items-center gap-2"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 dark:bg-amber-400 animate-pulse" />
          Event Pulse
        </a>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button
            onClick={() => onSelectTab('explore')}
            className={`transition-colors py-1 relative ${
              currentTab === 'explore'
                ? 'text-stone-950 dark:text-white font-semibold'
                : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200'
            }`}
          >
            Explore Events
            {currentTab === 'explore' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 dark:bg-amber-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('tickets')}
            className={`transition-colors py-1 relative flex items-center gap-1.5 ${
              currentTab === 'tickets'
                ? 'text-stone-950 dark:text-white font-semibold'
                : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200'
            }`}
          >
            My Passes
            {totalTicketsCount > 0 && (
              <span className="text-xs font-mono font-medium px-1.5 py-0.2 rounded bg-amber-500/15 dark:bg-amber-400/20 text-amber-700 dark:text-amber-300">
                {totalTicketsCount}
              </span>
            )}
            {currentTab === 'tickets' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 dark:bg-amber-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('stats')}
            className={`transition-colors py-1 relative ${
              currentTab === 'stats'
                ? 'text-stone-950 dark:text-white font-semibold'
                : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200'
            }`}
          >
            Campus Analytics
            {currentTab === 'stats' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 dark:bg-amber-400 rounded-full" />
            )}
          </button>
        </nav>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenApiModal}
            title={
              isLiveConnected
                ? 'Connected to MySQL Backend (localhost:5000)'
                : 'Using In-Memory DBMS Fallback'
            }
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-100/80 dark:bg-stone-900/60 text-stone-700 dark:text-stone-300 hover:border-stone-300 dark:hover:border-stone-700 transition-colors"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isLiveConnected
                  ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]'
                  : 'bg-amber-500'
              }`}
            />
            <span className="font-mono text-[11px] truncate max-w-[90px]">
              {isLiveConnected ? 'API Live' : 'Demo DBMS'}
            </span>
          </button>

          <div className="relative">
            <button
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              title={`Theme: ${theme}`}
              aria-label="Switch Theme"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white hover:border-stone-300 dark:hover:border-stone-700 transition-colors"
            >
              {resolvedTheme === 'dark' ? (
                <Moon className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-amber-500" />
              )}
              <span className="capitalize hidden sm:inline text-[11px] font-mono">
                {theme}
              </span>
              <ChevronDown className="w-3 h-3 text-stone-400" />
            </button>

            {themeDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setThemeDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-36 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xl py-1.5 z-50 text-xs">
                  <div className="px-3 py-1 text-stone-400 dark:text-stone-500 font-mono uppercase tracking-wider text-[10px] border-b border-stone-100 dark:border-stone-800">
                    Theme Mode
                  </div>
                  {themeOptions.map((opt) => (
                    <button
                      key={opt.mode}
                      onClick={() => {
                        setTheme(opt.mode);
                        setThemeDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors ${
                        theme === opt.mode
                          ? 'text-amber-600 dark:text-amber-400 font-semibold'
                          : 'text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {opt.icon}
                        <span>{opt.label}</span>
                      </div>
                      {theme === opt.mode && <Check className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900">
            <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-[10px]">
              {activeUser.full_name.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block max-w-[120px]">
              <p className="text-xs font-semibold text-stone-900 dark:text-stone-100 truncate">
                {activeUser.full_name}
              </p>
              <p className="text-[10px] text-stone-500 font-mono">
                {activeUser.role}
              </p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-900 transition-colors"
          >
            Logout
          </button>

          {canHostEvent && (
            <button
              onClick={onOpenCreateModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-all whitespace-nowrap active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Host Event</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};