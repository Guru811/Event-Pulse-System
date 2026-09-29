import React, { useState } from 'react';
import { api } from '../services/api';
import { X, Server, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ApiStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLiveConnected: boolean;
  onConnectionChange: (isLive: boolean) => void;
}

export const ApiStatusModal: React.FC<ApiStatusModalProps> = ({
  isOpen,
  onClose,
  isLiveConnected,
  onConnectionChange,
}) => {
  const [apiUrl, setApiUrl] = useState<string>(api.getBaseUrl());
  const [testing, setTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const isOk = await api.checkHealth();
      onConnectionChange(isOk);
      if (isOk) {
        setTestResult('Successfully connected to Express + MySQL backend on ' + api.getBaseUrl());
      } else {
        setTestResult(
          `Could not connect to ${api.getBaseUrl()}. Fallback DBMS mode remains active with seeded MySQL data.`
        );
      }
    } catch (err: any) {
      setTestResult(err.message || 'Connection attempt failed.');
      onConnectionChange(false);
    } finally {
      setTesting(false);
    }
  };

  const handleSaveUrl = () => {
    api.setBaseUrl(apiUrl);
    handleTestConnection();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-950/70 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-2xl overflow-hidden z-10 p-6 space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-4">
            <div className="flex items-center gap-2.5">
              <Server className="w-5 h-5 text-amber-500 dark:text-amber-400" />
              <div>
                <h3 className="font-display text-base font-bold text-stone-950 dark:text-white">Backend Connection Status</h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">Node.js + Express + MySQL Integration</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-stone-950 dark:text-stone-400 dark:hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Current Status Box */}
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 text-xs ${
              isLiveConnected
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                : 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-500/30 text-amber-800 dark:text-amber-300'
            }`}
          >
            {isLiveConnected ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            )}
            <div>
              <p className="font-semibold text-stone-900 dark:text-white">
                {isLiveConnected
                  ? 'Live Express/MySQL Server Connected'
                  : 'Operating in Dual-Mode / Local DBMS Fallback'}
              </p>
              <p className="mt-1 text-stone-600 dark:text-stone-300 leading-relaxed">
                {isLiveConnected
                  ? `Queries and mutations execute live against the active Express backend at ${api.getBaseUrl()}.`
                  : `Targeting ${api.getBaseUrl()}. If your local backend is not yet started, Event Pulse seamlessly simulates all tables, views, stored procedures, and triggers locally with full fidelity.`}
              </p>
            </div>
          </div>

          {/* API Base URL Setting */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-stone-700 dark:text-stone-300">
              API Base URL (Default: http://localhost:5000/api)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="http://localhost:5000/api"
                className="flex-1 px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg text-xs text-stone-900 dark:text-white focus:outline-none focus:border-amber-400 font-mono shadow-sm"
              />
              <button
                onClick={handleSaveUrl}
                className="px-3 py-2 bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-900 dark:text-white rounded-lg text-xs font-medium transition-colors"
              >
                Save
              </button>
            </div>
          </div>

          {/* Test Result Message */}
          {testResult && (
            <div className="p-3 bg-stone-50 dark:bg-stone-950 rounded-lg border border-stone-200 dark:border-stone-800 text-xs font-mono text-stone-700 dark:text-stone-300">
              {testResult}
            </div>
          )}

          {/* Endpoints schema reference */}
          <div className="space-y-2 text-xs">
            <span className="font-mono text-stone-500 dark:text-stone-400 text-[11px] uppercase tracking-wider block">
              Configured MySQL API Endpoints
            </span>
            <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 font-mono text-[11px] text-stone-600 dark:text-stone-400 space-y-1">
              <div><span className="text-emerald-600 dark:text-emerald-400 font-semibold">GET</span>  /api/events (vw_event_summary)</div>
              <div><span className="text-emerald-600 dark:text-emerald-400 font-semibold">GET</span>  /api/events/:id (+ sessions)</div>
              <div><span className="text-amber-600 dark:text-amber-400 font-semibold">POST</span> /api/events (Create event)</div>
              <div><span className="text-emerald-600 dark:text-emerald-400 font-semibold">GET</span>  /api/users (Users list)</div>
              <div><span className="text-amber-600 dark:text-amber-400 font-semibold">POST</span> /api/registrations (sp_register_for_event)</div>
              <div><span className="text-emerald-600 dark:text-emerald-400 font-semibold">GET</span>  /api/registrations/user/:userId (vw_my_registrations)</div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
            <button
              onClick={handleTestConnection}
              disabled={testing}
              className="px-4 py-2 text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50 shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
              <span>{testing ? 'Probing :5000...' : 'Ping Backend Now'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 text-xs text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white transition-colors"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
