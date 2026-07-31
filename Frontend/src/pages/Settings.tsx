import React, { useState } from 'react';
import { useRateLimiter } from '../context/RateLimiterContext';
import {
  Settings as SettingsIcon,
  Globe,
  RefreshCw,
  Sliders,
  Database,
  Trash2,
  Check,
} from 'lucide-react';
import { toast } from 'react-toastify';

export const Settings: React.FC = () => {
  const { isPolling, setIsPolling, clearLogs, metrics } = useRateLimiter();

  // Local storage backup configurations for backend URL
  const defaultApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  const [apiUrl, setApiUrl] = useState(() => {
    return localStorage.getItem('override_api_url') || defaultApiUrl;
  });

  const handleSaveApiUrl = () => {
    if (!apiUrl.trim()) {
      toast.error('API URL cannot be empty');
      return;
    }
    
    localStorage.setItem('override_api_url', apiUrl.trim());
    toast.success('API endpoint updated. Please reload the console to apply.');
    
    // Auto trigger reload advice
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleResetApiUrl = () => {
    localStorage.removeItem('override_api_url');
    setApiUrl(defaultApiUrl);
    toast.success('API endpoint reset to environment default.');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight dark:text-zinc-50 font-outfit">
          System settings
        </h2>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
          Adjust console parameters, endpoints, polling cycles, and log limits.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEFT COLUMN: CONNECTION CONFIGS & SYSTEM TUNING */}
        <div className="space-y-6">
          
          {/* Backend Connection Card */}
          <div className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-zinc-800/50 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 tracking-wider uppercase flex items-center">
              <Globe className="w-4 h-4 mr-2 text-blue-500" />
              API Server Integration
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-normal">
              Specify the base address of your Spring Boot REST server. Environment default is{' '}
              <code>{defaultApiUrl}</code>.
            </p>

            <div className="space-y-2">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Backend API Server Endpoint
              </label>
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="http://localhost:8080"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs font-mono text-slate-800 dark:text-zinc-350 focus:outline-none"
              />
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={handleSaveApiUrl}
                className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow transition-colors"
              >
                <Check className="w-3.5 h-3.5 mr-1.5" />
                Apply & Save URL
              </button>
              
              <button
                onClick={handleResetApiUrl}
                className="flex items-center px-4 py-2 border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-lg text-xs font-semibold transition-colors"
              >
                Restore Default
              </button>
            </div>
          </div>

          {/* Polling Stream configurations */}
          <div className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-zinc-800/50 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 tracking-wider uppercase flex items-center">
              <RefreshCw className="w-4 h-4 mr-2 text-blue-500" />
              Polling Interval stream
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-normal">
              Toggle the real-time background ping task. Disabling stops background calls but pauses telemetry updates.
            </p>

            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-zinc-950/40 border border-slate-100 dark:border-zinc-900">
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-zinc-300">Auto Refresh State</p>
                <p className="text-[10px] text-slate-500 dark:text-zinc-500 font-semibold mt-0.5">Auto-checks server status every 3 seconds</p>
              </div>
              <button
                onClick={() => {
                  setIsPolling(!isPolling);
                  toast.success(`Background polling ${!isPolling ? 'enabled' : 'disabled'}`);
                }}
                className={`w-12 h-6 flex items-center rounded-full p-0.5 cursor-pointer transition-colors duration-300 ${
                  isPolling ? 'bg-blue-600' : 'bg-slate-350 dark:bg-zinc-800'
                }`}
              >
                <div
                  className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                    isPolling ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: SPRING BOOT ENVIRONMENT SIMULATED READS */}
        <div className="space-y-6">
          
          {/* Rate Limiter Parameters */}
          <div className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-zinc-800/50 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 tracking-wider uppercase flex items-center">
              <Sliders className="w-4 h-4 mr-2 text-blue-500" />
              Spring Boot Parameters
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-normal">
              Current parameter readings matching your active Spring Boot rate limiter filters:
            </p>

            <div className="space-y-3 pt-2 text-xs">
              {/* Parameter 1 */}
              <div className="flex justify-between items-center py-2.5 border-b border-slate-100 dark:border-zinc-900">
                <span className="text-slate-500 dark:text-zinc-400 font-semibold">Rate Limit Cap</span>
                <span className="font-bold text-slate-800 dark:text-zinc-200">5 Requests / Min</span>
              </div>
              {/* Parameter 2 */}
              <div className="flex justify-between items-center py-2.5 border-b border-slate-100 dark:border-zinc-900">
                <span className="text-slate-500 dark:text-zinc-400 font-semibold">Time Window duration</span>
                <span className="font-bold text-slate-800 dark:text-zinc-200">60,000 ms (60s)</span>
              </div>
              {/* Parameter 3 */}
              <div className="flex justify-between items-center py-2.5 border-b border-slate-100 dark:border-zinc-900">
                <span className="text-slate-500 dark:text-zinc-400 font-semibold">Limiting Scope</span>
                <span className="font-bold text-slate-800 dark:text-zinc-200">Per Client Remote Address (IP)</span>
              </div>
            </div>
          </div>

          {/* Redis Server details */}
          <div className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-zinc-800/50 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 tracking-wider uppercase flex items-center">
              <Database className="w-4 h-4 mr-2 text-blue-500" />
              Redis Cache Storage details
            </h3>
            
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-zinc-900">
                <span className="text-slate-500 dark:text-zinc-400 font-semibold">Redis Host</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-zinc-300">localhost:6379</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-zinc-900">
                <span className="text-slate-500 dark:text-zinc-400 font-semibold">Redis Template Class</span>
                <span className="font-mono text-[10px] text-blue-500">StringRedisTemplate</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-500 dark:text-zinc-400 font-semibold">Connection Status</span>
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                  metrics.serverStatus === 'Online'
                    ? 'bg-emerald-500/10 text-emerald-500'
                    : 'bg-rose-500/10 text-rose-500'
                }`}>
                  {metrics.serverStatus === 'Online' ? 'CONNECTED' : 'DISCONNECTED'}
                </span>
              </div>
            </div>
          </div>

          {/* Log purging controls */}
          <div className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-zinc-800/50 flex justify-between items-center bg-red-500/5 border-red-500/10">
            <div>
              <h4 className="text-xs font-bold text-red-500">System Log Wipe</h4>
              <p className="text-[10px] text-slate-400 mt-1 max-w-xs leading-normal">
                Wipes all logs and graphs from the LocalStorage cache. This cannot be undone.
              </p>
            </div>
            <button
              onClick={clearLogs}
              className="flex items-center px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Wipe Logs
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Settings;
