import React, { useState } from 'react';
import { LockKeyhole, Mail, User, ArrowRight, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { User as UserType } from '../types';

interface AuthGateProps {
  onAuthenticated: (user: UserType) => void;
}

export const AuthGate: React.FC<AuthGateProps> = ({
  onAuthenticated,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }

    if (mode === 'signup' && !fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    setLoading(true);

    try {
      let user: UserType;

      if (mode === 'login') {
        user = await api.login(
          email.trim(),
          password
        );
      } else {
        user = await api.signup(
          fullName.trim(),
          email.trim(),
          password
        );
      }

      onAuthenticated(user);
    } catch (err: any) {
      setError(
        err?.message ||
        'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (nextMode: 'login' | 'signup') => {
    setMode(nextMode);
    setError('');
  };

  return (
    <div className="min-h-screen bg-stone-950 text-white flex items-center justify-center px-5 py-10 relative overflow-hidden">

      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <span className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />

            <h1 className="font-display text-3xl font-bold tracking-tight">
              Event <span className="text-amber-400">Pulse</span>
            </h1>
          </div>

          <p className="text-stone-400 text-sm">
            Your campus events, all in one place.
          </p>
        </div>

        {/* Card */}
        <div className="bg-stone-900/90 border border-stone-800 rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-xl">

          {/* Tabs */}
          <div className="grid grid-cols-2 bg-stone-950 rounded-xl p-1 mb-7">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`py-2.5 rounded-lg text-sm font-semibold transition-all ${
                mode === 'login'
                  ? 'bg-amber-400 text-stone-950 shadow'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Log in
            </button>

            <button
              type="button"
              onClick={() => switchMode('signup')}
              className={`py-2.5 rounded-lg text-sm font-semibold transition-all ${
                mode === 'signup'
                  ? 'bg-amber-400 text-stone-950 shadow'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Create account
            </button>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold">
              {mode === 'login'
                ? 'Welcome back'
                : 'Create your account'}
            </h2>

            <p className="text-sm text-stone-400 mt-1">
              {mode === 'login'
                ? 'Log in to access your Event Pulse dashboard.'
                : 'Join Event Pulse and start exploring campus events.'}
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-2">
                  Full name
                </label>

                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />

                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-2">
                Email address
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white outline-none focus:border-amber-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-2">
                Password
              </label>

              <div className="relative">
                <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  minLength={6}
                  autoComplete={
                    mode === 'login'
                      ? 'current-password'
                      : 'new-password'
                  }
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white outline-none focus:border-amber-400 transition-colors"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-900/70 bg-red-950/40 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 disabled:opacity-60 disabled:cursor-not-allowed text-stone-950 font-bold rounded-xl py-3.5 transition-all active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {mode === 'login'
                    ? 'Logging in...'
                    : 'Creating account...'}
                </>
              ) : (
                <>
                  {mode === 'login'
                    ? 'Log in'
                    : 'Create account'}

                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {mode === 'login' && (
            <p className="text-center text-xs text-stone-500 mt-6">
              Use an account that exists in your Event Pulse database.
            </p>
          )}

          {mode === 'signup' && (
            <p className="text-center text-xs text-stone-500 mt-6">
              Your account will be stored in the MySQL database.
            </p>
          )}
        </div>

        <p className="text-center text-xs text-stone-600 mt-6">
          Event Pulse • Campus Event Management System
        </p>
      </div>
    </div>
  );
};