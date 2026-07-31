import React from 'react';
import { useRateLimiter } from '../context/RateLimiterContext';
import { Play, Pause, Activity, Globe, ShieldAlert, ShieldCheck, Timer, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export const RateLimiterMonitor: React.FC = () => {
  const { logs, metrics, isPolling, setIsPolling, refreshHealth } = useRateLimiter();

  // Filter logs for /api/data to focus on rate limit checks
  const monitorLogs = logs.filter(
    (log) => log.url === '/api/data' && (log.type === 'BACKGROUND' || log.type === 'DASHBOARD_TRIGGER' || log.type === 'MONITOR')
  );

  const currentCount = 5 - metrics.remainingRequests;
  const statusPercent = (currentCount / 5) * 100;

  return (
    <div className="space-y-8">
      {/* Header and Pause/Play toggler */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight dark:text-zinc-50 font-outfit">
            Rate Limiter Monitor
          </h2>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Live client tracking window. Auto-refreshes every 3 seconds using actual Spring Boot telemetry.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={refreshHealth}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-500 transition-colors"
            title="Refresh Health Now"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setIsPolling(!isPolling)}
            className={`flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold tracking-wide shadow-md transition-all active:scale-[0.98] ${
              isPolling
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isPolling ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause Auto-Refresh
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2 fill-current" />
                Resume Auto-Refresh (3s)
              </>
            )}
          </button>
        </div>
      </div>

      {/* Current Quota Gauge cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left: Interactive Radial or Bar Gauge */}
        <div className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-zinc-800/50 flex flex-col justify-between md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 tracking-wider uppercase">
              Current Client Rate Quota
            </h3>
            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
              isPolling ? 'bg-emerald-500/10 text-emerald-500 animate-pulse' : 'bg-slate-500/10 text-slate-400'
            }`}>
              {isPolling ? 'Live Polling' : 'Paused'}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 py-4">
            {/* Visual Gauge Bar / Info */}
            <div className="flex-1 w-full space-y-4">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-400">Request Limit Usage</span>
                <span className={metrics.remainingRequests === 0 ? 'text-rose-500' : 'text-blue-500'}>
                  {currentCount} of 5 requests used
                </span>
              </div>
              
              {/* Progress Bar container */}
              <div className="w-full bg-slate-200 dark:bg-zinc-800 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-300/30 dark:border-zinc-700/20">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${statusPercent}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className={`h-full rounded-full ${
                    metrics.remainingRequests === 0
                      ? 'bg-gradient-to-r from-red-500 to-rose-600'
                      : metrics.remainingRequests <= 2
                      ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                      : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs pt-2">
                <div className="bg-slate-50 dark:bg-zinc-950/40 p-3 rounded-xl border border-slate-100 dark:border-zinc-900">
                  <span className="text-slate-400 block mb-0.5">Remaining quota</span>
                  <span className="text-lg font-bold font-outfit text-slate-800 dark:text-zinc-200">
                    {metrics.remainingRequests} calls
                  </span>
                </div>
                <div className="bg-slate-50 dark:bg-zinc-950/40 p-3 rounded-xl border border-slate-100 dark:border-zinc-900">
                  <span className="text-slate-400 block mb-0.5">Window Reset</span>
                  <span className="text-lg font-bold font-outfit text-slate-800 dark:text-zinc-200 flex items-center">
                    <Timer className="w-4 h-4 mr-1.5 text-blue-500" />
                    {metrics.windowTimeRemainingSec}s
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Client Details Card */}
        <div className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-zinc-800/50 flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 tracking-wider uppercase mb-4">
            Monitoring Target
          </h3>
          
          <div className="space-y-4 flex-1 flex flex-col justify-center">
            {/* IP Address */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold flex items-center">
                <Globe className="w-4 h-4 mr-2 text-slate-500" />
                Client IP
              </span>
              <span className="text-xs font-mono font-bold text-slate-700 dark:text-zinc-300 bg-slate-100 dark:bg-zinc-950 px-2 py-1 rounded">
                {metrics.clientIp}
              </span>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold flex items-center">
                <Activity className="w-4 h-4 mr-2 text-slate-500" />
                Filter Status
              </span>
              <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full ${
                metrics.remainingRequests === 0
                  ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                  : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
              }`}>
                {metrics.remainingRequests === 0 ? 'Rate Limited (429)' : 'Active (Healthy)'}
              </span>
            </div>

            {/* Current speed */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold flex items-center">
                <Timer className="w-4 h-4 mr-2 text-slate-500" />
                Response Speed
              </span>
              <span className="text-xs font-bold text-blue-500">
                {metrics.avgResponseTimeMs} ms avg
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Monitor Timeline logs Table */}
      <div className="glass-card rounded-2xl border border-slate-200/50 dark:border-zinc-800/50 overflow-hidden">
        <div className="p-6 border-b border-slate-200/50 dark:border-zinc-800/50 bg-white/40 dark:bg-zinc-950/20">
          <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 tracking-wider uppercase">
            Live Stream Feed
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Detailed log of auto-refresh queries pinging `/api/data` on the backend.
          </p>
        </div>

        <div className="overflow-x-auto">
          {monitorLogs.length > 0 ? (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200/50 dark:border-zinc-800/50 text-slate-400 font-semibold uppercase tracking-wider bg-slate-50/50 dark:bg-zinc-950/40">
                  <th className="py-3 px-6">Timestamp</th>
                  <th className="py-3 px-6">Client IP Address</th>
                  <th className="py-3 px-6 text-center">Status Code</th>
                  <th className="py-3 px-6">Rate Limit Status</th>
                  <th className="py-3 px-6 text-right">Response Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-900">
                {monitorLogs.slice(0, 20).map((log) => {
                  const date = new Date(log.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  });
                  return (
                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/10 transition-colors">
                      <td className="py-4 px-6 text-slate-500 dark:text-zinc-400 font-medium">
                        {date}
                      </td>
                      <td className="py-4 px-6 font-mono font-bold text-slate-700 dark:text-zinc-300">
                        {log.clientIp}
                      </td>
                      <td className="py-4 px-6 text-center font-bold">
                        <span className={`px-2.5 py-0.5 rounded-lg text-[10px] ${
                          log.status === 200
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : 'bg-rose-500/10 text-rose-500'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-semibold flex items-center gap-1.5">
                        {log.allowed ? (
                          <>
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            <span className="text-emerald-500">Allowed</span>
                          </>
                        ) : (
                          <>
                            <ShieldAlert className="w-4 h-4 text-rose-500" />
                            <span className="text-rose-500">Too Many Requests</span>
                          </>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right font-bold text-blue-500 font-outfit">
                        {log.responseTime} ms
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-slate-400 dark:text-zinc-500 space-y-2">
              <Activity className="w-8 h-8 mx-auto stroke-1 animate-pulse" />
              <p className="text-xs font-semibold">No live monitor logs captured yet</p>
              <p className="text-[10px] text-slate-500">Make sure auto-refresh is active and the server is running.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RateLimiterMonitor;
