import React from 'react';
import { useRateLimiter } from '../context/RateLimiterContext';
import {
  Activity,
  CheckCircle,
  XCircle,
  Timer,
  Server,
  Zap,
  Globe,
  Users,
  ShieldCheck,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const Dashboard: React.FC = () => {
  const { metrics, triggerRequest, logs, clearLogs, refreshHealth } = useRateLimiter();

  // Prepare chart data from the last 15 requests
  const recentChartData = [...logs]
    .slice(0, 15)
    .reverse()
    .map((log) => ({
      time: new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      latency: log.status > 0 ? log.responseTime : 0,
      allowed: log.allowed ? 1 : 0,
      blocked: !log.allowed && log.status === 429 ? 1 : 0,
    }));

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as any } },
  };

  const dashboardCards = [
    {
      title: 'Total Requests',
      value: metrics.totalRequests,
      icon: Activity,
      desc: 'Cumulative API hits logged',
      colorClass: 'text-blue-500',
      bgClass: 'gradient-card-blue border-blue-500/10 dark:border-blue-500/5',
    },
    {
      title: 'Allowed Requests',
      value: metrics.allowedRequests,
      icon: CheckCircle,
      desc: 'Requests passing limits',
      colorClass: 'text-emerald-500',
      bgClass: 'gradient-card-emerald border-emerald-500/10 dark:border-emerald-500/5',
    },
    {
      title: 'Blocked Requests',
      value: metrics.blockedRequests,
      icon: XCircle,
      desc: 'HTTP 429 rate-limited',
      colorClass: 'text-rose-500',
      bgClass: 'gradient-card-rose border-rose-500/10 dark:border-rose-500/5',
    },
    {
      title: 'Remaining (Window)',
      value: `${metrics.remainingRequests} / 5`,
      icon: ShieldCheck,
      desc: 'Quota left in current window',
      colorClass: 'text-purple-500',
      bgClass: 'gradient-card-purple border-purple-500/10 dark:border-purple-500/5',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome header with primary controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight dark:text-zinc-50 font-outfit flex items-center">
            System Console
            <Sparkles className="w-5 h-5 text-blue-500 ml-2 animate-pulse" />
          </h2>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Real-time tracking of API rate limits, network latency, and node health.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={clearLogs}
            className="flex items-center px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-900 text-sm font-medium transition-colors"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Audit Log
          </button>
          
          <button
            onClick={triggerRequest}
            className="flex items-center px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold tracking-wide shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all"
          >
            <Play className="w-4 h-4 mr-2 fill-current" />
            Trigger API Request
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: idx * 0.05 }}
              className={`glass-card p-6 rounded-2xl flex flex-col justify-between border ${card.bgClass} hover:translate-y-[-2px] transition-all duration-300`}
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 tracking-wider uppercase">
                  {card.title}
                </span>
                <span className={`p-2 rounded-xl bg-white dark:bg-zinc-950 shadow-sm border border-slate-100 dark:border-zinc-800 ${card.colorClass}`}>
                  <Icon className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold font-outfit tracking-tight">
                  {card.value}
                </span>
                <p className="text-xs text-slate-400 dark:text-zinc-500 font-medium mt-1">
                  {card.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Detailed Technical Metrics (Window time, Health, response-time, connections) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Network & Node Status Pane */}
        <div className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-zinc-800/50 flex flex-col justify-between h-full space-y-6">
          <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 tracking-wider uppercase flex items-center">
            Node Telemetry
          </h3>
          
          <div className="space-y-4 flex-1 flex flex-col justify-center">
            {/* Server Status Row */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-950/40 border border-slate-100 dark:border-zinc-900">
              <div className="flex items-center space-x-3">
                <Server className="w-5 h-5 text-slate-400 dark:text-zinc-500" />
                <div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-zinc-300">Server Status</p>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-500 font-medium">Spring Boot instance</p>
                </div>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                metrics.serverStatus === 'Online'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/5 dark:text-emerald-400'
                  : 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/5 dark:text-rose-400'
              }`}>
                {metrics.serverStatus}
              </span>
            </div>

            {/* API Health Row */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-950/40 border border-slate-100 dark:border-zinc-900">
              <div className="flex items-center space-x-3">
                <Zap className="w-5 h-5 text-slate-400 dark:text-zinc-500" />
                <div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-zinc-300">API Health</p>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-500 font-medium">Based on recent latency</p>
                </div>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                metrics.apiHealth === 'Healthy'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/5 dark:text-emerald-400'
                  : metrics.apiHealth === 'Degraded'
                  ? 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/5 dark:text-amber-400'
                  : 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/5 dark:text-rose-400'
              }`}>
                {metrics.apiHealth}
              </span>
            </div>

            {/* Time Window Gauge */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-950/40 border border-slate-100 dark:border-zinc-900">
              <div className="flex items-center space-x-3">
                <Timer className="w-5 h-5 text-slate-400 dark:text-zinc-500" />
                <div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-zinc-300">Window Reset In</p>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-500 font-medium">Fixed 60s sliding window</p>
                </div>
              </div>
              <span className="text-sm font-bold font-outfit text-slate-700 dark:text-zinc-300">
                {metrics.windowTimeRemainingSec}s
              </span>
            </div>
          </div>
        </div>

        {/* Client & Connection details */}
        <div className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-zinc-800/50 flex flex-col justify-between h-full space-y-6">
          <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 tracking-wider uppercase">
            Connection Telemetry
          </h3>
          
          <div className="space-y-4 flex-1 flex flex-col justify-center">
            {/* Response Time Row */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-950/40 border border-slate-100 dark:border-zinc-900">
              <div className="flex items-center space-x-3">
                <Zap className="w-5 h-5 text-slate-400 dark:text-zinc-500" />
                <div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-zinc-300">Response Latency</p>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-500 font-medium">Average HTTP roundtrip</p>
                </div>
              </div>
              <span className="text-sm font-bold font-outfit text-blue-500">
                {metrics.avgResponseTimeMs} ms
              </span>
            </div>

            {/* Client IP Row */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-950/40 border border-slate-100 dark:border-zinc-900">
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-slate-400 dark:text-zinc-500" />
                <div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-zinc-300">Client IP Address</p>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-500 font-medium">Assigned rate limit key</p>
                </div>
              </div>
              <span className="text-xs font-bold font-mono text-slate-700 dark:text-zinc-300 bg-slate-200/50 dark:bg-zinc-900 px-2.5 py-1 rounded-lg">
                {metrics.clientIp}
              </span>
            </div>

            {/* Active Connections */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-950/40 border border-slate-100 dark:border-zinc-900">
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-slate-400 dark:text-zinc-500" />
                <div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-zinc-300">Active Node Peers</p>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-500 font-medium">Distributed connections</p>
                </div>
              </div>
              <span className="text-sm font-bold font-outfit text-slate-700 dark:text-zinc-300">
                {metrics.activeConnections} nodes
              </span>
            </div>
          </div>
        </div>

        {/* Informative Rate Limiter card explaining limits */}
        <div className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-zinc-800/50 flex flex-col justify-between h-full bg-gradient-to-br from-blue-600/5 to-indigo-600/5">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 tracking-wider uppercase">
              Filter Algorithm
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
              The Redis-backed filter intercepts HTTP calls to the Spring Boot endpoint 
              <code>/api/data</code>. Requests are checked against client IP addresses:
            </p>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Limit Threshold</span>
                <span className="font-semibold text-slate-700 dark:text-zinc-300">5 Requests</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Window Interval</span>
                <span className="font-semibold text-slate-700 dark:text-zinc-300">60 Seconds</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Storage Type</span>
                <span className="font-semibold text-blue-500 font-mono">Redis StringTemplate</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-zinc-900 text-[10px] text-slate-400 dark:text-zinc-500 leading-normal">
            To view details of the Redis configuration, navigate to the Settings panel.
          </div>
        </div>

      </div>

      {/* Latency History Graph */}
      <div className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-zinc-800/50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 tracking-wider uppercase">
              API Response Speed History
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
              Tracks the roundtrip latency of the last 15 calls made to the Spring Boot server.
            </p>
          </div>
        </div>
        
        <div className="h-72 w-full">
          {recentChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={recentChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} opacity={0.15}/>
                <XAxis dataKey="time" stroke="#71717a" fontSize={10} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={10} tickLine={false} unit="ms" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(9, 9, 11, 0.9)',
                    borderColor: 'rgba(63, 63, 70, 0.5)',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Area type="monotone" dataKey="latency" name="Latency" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorLatency)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 dark:text-zinc-500 space-y-2">
              <Timer className="w-8 h-8 stroke-1" />
              <p className="text-xs font-semibold">No telemetric data captured yet</p>
              <p className="text-[10px] text-slate-500">Trigger API requests above or enable auto-polling to generate metrics.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
