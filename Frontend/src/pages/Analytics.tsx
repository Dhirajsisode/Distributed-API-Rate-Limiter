import React, { useState } from 'react';
import { useRateLimiter } from '../context/RateLimiterContext';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { BarChart3, TrendingUp, AlertTriangle, Play, Loader2, Sparkles, HelpCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import EmptyState from '../components/EmptyState';

export const Analytics: React.FC = () => {
  const { logs, triggerRequest, metrics } = useRateLimiter();
  const [isSimulating, setIsSimulating] = useState(false);

  // Simulation Stress Test - Fires 10 real calls rapidly to build authentic analytics
  const runStressTest = async () => {
    setIsSimulating(true);
    toast.info('Starting Stress Test: Sending 10 requests to Spring Boot...');
    
    for (let i = 0; i < 10; i++) {
      await triggerRequest();
      // Small delay between calls to simulate client speed
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
    
    toast.success('Stress Test completed! Analytics updated.');
    setIsSimulating(false);
  };

  // 1. Calculations: Allowed vs Blocked Pie Chart
  const allowedCount = logs.filter((log) => log.allowed).length;
  const blockedCount = logs.filter((log) => log.status === 429).length;
  const pieData = [
    { name: 'Allowed Requests', value: allowedCount || 0 },
    { name: 'Blocked Requests', value: blockedCount || 0 },
  ];
  const COLORS = ['#10b981', '#f43f5e'];

  // 2. Calculations: Requests Over Time (grouped by last 10 minutes/seconds)
  const timeSeriesData = [...logs]
    .slice(0, 30)
    .reverse()
    .map((log) => ({
      time: new Date(log.timestamp).toLocaleTimeString([], { minute: '2-digit', second: '2-digit' }),
      allowed: log.allowed ? 1 : 0,
      blocked: log.status === 429 ? 1 : 0,
      latency: log.status > 0 ? log.responseTime : 0,
    }));

  // 3. Calculations: Hourly Requests distribution (group by hours 00-23)
  const hourlyCounts = Array.from({ length: 24 }, (_, i) => ({
    hour: `${String(i).padStart(2, '0')}:00`,
    Allowed: 0,
    Blocked: 0,
  }));
  
  logs.forEach((log) => {
    const hour = new Date(log.timestamp).getHours();
    if (log.allowed) {
      hourlyCounts[hour].Allowed += 1;
    } else if (log.status === 429) {
      hourlyCounts[hour].Blocked += 1;
    }
  });

  const activeHourlyData = hourlyCounts.filter((h) => h.Allowed > 0 || h.Blocked > 0);

  // 4. Calculations: Weekly Requests (group by weekdays)
  const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeklyCounts = weekdayNames.map((day) => ({
    day,
    Allowed: 0,
    Blocked: 0,
  }));

  logs.forEach((log) => {
    const dayIndex = new Date(log.timestamp).getDay();
    if (log.allowed) {
      weeklyCounts[dayIndex].Allowed += 1;
    } else if (log.status === 429) {
      weeklyCounts[dayIndex].Blocked += 1;
    }
  });

  // 5. Calculations: Daily Requests (last 7 calendar days)
  const dailyMap: Record<string, { date: string; Allowed: number; Blocked: number }> = {};
  logs.forEach((log) => {
    const dateStr = new Date(log.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' });
    if (!dailyMap[dateStr]) {
      dailyMap[dateStr] = { date: dateStr, Allowed: 0, Blocked: 0 };
    }
    if (log.allowed) {
      dailyMap[dateStr].Allowed += 1;
    } else if (log.status === 429) {
      dailyMap[dateStr].Blocked += 1;
    }
  });
  const dailyData = Object.values(dailyMap).reverse();

  // 6. Calculations: Monthly Requests (group by month names)
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyCounts = monthNames.map((month) => ({
    month,
    Allowed: 0,
    Blocked: 0,
  }));

  logs.forEach((log) => {
    const monthIndex = new Date(log.timestamp).getMonth();
    if (log.allowed) {
      monthlyCounts[monthIndex].Allowed += 1;
    } else if (log.status === 429) {
      monthlyCounts[monthIndex].Blocked += 1;
    }
  });
  const activeMonthlyData = monthlyCounts.filter((m) => m.Allowed > 0 || m.Blocked > 0);

  // 7. Calculations: API Endpoints Usage
  const pathMap: Record<string, { path: string; Allowed: number; Blocked: number }> = {};
  logs.forEach((log) => {
    if (!pathMap[log.url]) {
      pathMap[log.url] = { path: log.url, Allowed: 0, Blocked: 0 };
    }
    if (log.allowed) {
      pathMap[log.url].Allowed += 1;
    } else if (log.status === 429) {
      pathMap[log.url].Blocked += 1;
    }
  });
  const apiUsageData = Object.values(pathMap);

  // 8. Calculations: Top Requesting Clients IP Addresses
  const ipMap: Record<string, { ip: string; total: number; allowed: number; blocked: number }> = {};
  logs.forEach((log) => {
    if (!ipMap[log.clientIp]) {
      ipMap[log.clientIp] = { ip: log.clientIp, total: 0, allowed: 0, blocked: 0 };
    }
    ipMap[log.clientIp].total += 1;
    if (log.allowed) {
      ipMap[log.clientIp].allowed += 1;
    } else if (log.status === 429) {
      ipMap[log.clientIp].blocked += 1;
    }
  });
  const topClientsData = Object.values(ipMap)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  const hasLogs = logs.length > 0;

  return (
    <div className="space-y-8">
      {/* Header and simulation triggers */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight dark:text-zinc-50 font-outfit">
            Security & Load Analytics
          </h2>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Aggregated traffic statistics processed locally from live Spring Boot request logs.
          </p>
        </div>
        <div>
          <button
            onClick={runStressTest}
            disabled={isSimulating}
            className="flex items-center px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white text-sm font-semibold tracking-wide shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
          >
            {isSimulating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Stress Testing ({logs.length} logs)...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2 fill-current" />
                Run Simulation Stress Test
              </>
            )}
          </button>
        </div>
      </div>

      {!hasLogs ? (
        <EmptyState
          title="No analytical data found"
          description="Analytics are generated dynamically from requests sent to your Spring Boot backend. Run the Stress Test or click trigger request to populate the console charts."
          actionButton={
            <button
              onClick={runStressTest}
              className="inline-flex items-center px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow"
            >
              Run Stress Test Now
            </button>
          }
        />
      ) : (
        <div className="space-y-8">
          
          {/* TOP GRID: Traffic trends + Allowed vs Blocked ratio */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Allowed vs Blocked Pie Chart */}
            <div className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-zinc-800/50 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 tracking-wider uppercase">
                  Allowed vs Blocked Ratio
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                  Distribution of passed vs rejected requests.
                </p>
              </div>
              <div className="h-56 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(9, 9, 11, 0.9)',
                        borderColor: 'rgba(63, 63, 70, 0.5)',
                        borderRadius: '0.75rem',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Visual Label in the center of the ring */}
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold font-outfit">{logs.length}</span>
                  <span className="text-[10px] text-slate-500 dark:text-zinc-500 uppercase tracking-widest font-semibold">Total Hits</span>
                </div>
              </div>
              <div className="flex justify-center space-x-6 text-xs font-semibold">
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 mr-2" />
                  <span className="text-slate-600 dark:text-zinc-400">Allowed ({allowedCount})</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-rose-500 mr-2" />
                  <span className="text-slate-600 dark:text-zinc-400">Blocked ({blockedCount})</span>
                </div>
              </div>
            </div>

            {/* Live Traffic Stream Over Time */}
            <div className="lg:col-span-2 glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-zinc-800/50">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 tracking-wider uppercase">
                  Real-time Traffic stream
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                  Visualization of recent traffic logs.
                </p>
              </div>
              <div className="h-64 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timeSeriesData} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorAllowed" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorBlocked" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} opacity={0.15}/>
                    <XAxis dataKey="time" stroke="#71717a" fontSize={10} tickLine={false} />
                    <YAxis stroke="#71717a" fontSize={10} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(9, 9, 11, 0.9)',
                        borderColor: 'rgba(63, 63, 70, 0.5)',
                        borderRadius: '0.75rem',
                        color: '#fff',
                        fontSize: '12px'
                      }}
                    />
                    <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', fontWeight: 600 }} />
                    <Area type="monotone" dataKey="allowed" name="Allowed Requests" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorAllowed)" />
                    <Area type="monotone" dataKey="blocked" name="Blocked (Rate Limit)" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorBlocked)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* MIDDLE GRID: Time based distributions (Hourly, Daily, Weekly, Monthly) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Hourly Distribution */}
            <div className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-zinc-800/50">
              <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 tracking-wider uppercase mb-4">
                Hourly Requests Distribution
              </h3>
              <div className="h-64 w-full">
                {activeHourlyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activeHourlyData} margin={{ left: -30 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} opacity={0.15}/>
                      <XAxis dataKey="hour" stroke="#71717a" fontSize={10} tickLine={false} />
                      <YAxis stroke="#71717a" fontSize={10} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(9, 9, 11, 0.9)',
                          borderColor: 'rgba(63, 63, 70, 0.5)',
                          borderRadius: '0.75rem',
                        }}
                      />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                      <Bar dataKey="Allowed" fill="#10b981" stackId="a" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="Blocked" fill="#f43f5e" stackId="a" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-slate-400">
                    No hourly log records.
                  </div>
                )}
              </div>
            </div>

            {/* Daily Traffic Trends */}
            <div className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-zinc-800/50">
              <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 tracking-wider uppercase mb-4">
                Daily Requests Trend
              </h3>
              <div className="h-64 w-full">
                {dailyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dailyData} margin={{ left: -30 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} opacity={0.15}/>
                      <XAxis dataKey="date" stroke="#71717a" fontSize={10} tickLine={false} />
                      <YAxis stroke="#71717a" fontSize={10} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(9, 9, 11, 0.9)',
                          borderColor: 'rgba(63, 63, 70, 0.5)',
                          borderRadius: '0.75rem',
                        }}
                      />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                      <Line type="monotone" dataKey="Allowed" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="Blocked" stroke="#f43f5e" strokeWidth={2.5} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-slate-400">
                    No daily log records.
                  </div>
                )}
              </div>
            </div>

            {/* Weekly Traffic distribution */}
            <div className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-zinc-800/50">
              <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 tracking-wider uppercase mb-4">
                Weekly Traffic Distribution
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyCounts} margin={{ left: -30 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} opacity={0.15}/>
                    <XAxis dataKey="day" stroke="#71717a" fontSize={10} tickLine={false} />
                    <YAxis stroke="#71717a" fontSize={10} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(9, 9, 11, 0.9)',
                        borderColor: 'rgba(63, 63, 70, 0.5)',
                        borderRadius: '0.75rem',
                      }}
                    />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                    <Bar dataKey="Allowed" fill="#10b981" stackId="a" />
                    <Bar dataKey="Blocked" fill="#f43f5e" stackId="a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Monthly Trend */}
            <div className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-zinc-800/50">
              <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 tracking-wider uppercase mb-4">
                Monthly Traffic Trend
              </h3>
              <div className="h-64 w-full">
                {activeMonthlyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={activeMonthlyData} margin={{ left: -30 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} opacity={0.15}/>
                      <XAxis dataKey="month" stroke="#71717a" fontSize={10} tickLine={false} />
                      <YAxis stroke="#71717a" fontSize={10} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(9, 9, 11, 0.9)',
                          borderColor: 'rgba(63, 63, 70, 0.5)',
                          borderRadius: '0.75rem',
                        }}
                      />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                      <Line type="monotone" dataKey="Allowed" stroke="#10b981" strokeWidth={2} />
                      <Line type="monotone" dataKey="Blocked" stroke="#f43f5e" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-slate-400">
                    No monthly log records.
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* BOTTOM GRID: API endpoint Usage + Top requesting IPs table */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* API Endpoints usage */}
            <div className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-zinc-800/50">
              <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 tracking-wider uppercase mb-4">
                API Endpoint Hits
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={apiUsageData} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} opacity={0.15}/>
                    <XAxis type="number" stroke="#71717a" fontSize={10} tickLine={false} />
                    <YAxis dataKey="path" type="category" stroke="#71717a" fontSize={10} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(9, 9, 11, 0.9)',
                        borderColor: 'rgba(63, 63, 70, 0.5)',
                        borderRadius: '0.75rem',
                      }}
                    />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                    <Bar dataKey="Allowed" fill="#10b981" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="Blocked" fill="#f43f5e" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top requesting IP clients table */}
            <div className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-zinc-800/50">
              <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 tracking-wider uppercase mb-4">
                Top Client Requesting IPs
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200/50 dark:border-zinc-800/50 text-slate-400 font-semibold uppercase tracking-wider">
                      <th className="pb-3">Client IP Address</th>
                      <th className="pb-3 text-center">Allowed</th>
                      <th className="pb-3 text-center">Blocked</th>
                      <th className="pb-3 text-right">Total Hits</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-zinc-900">
                    {topClientsData.map((client, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/10 transition-colors">
                        <td className="py-4 font-mono font-bold text-slate-700 dark:text-zinc-300">
                          {client.ip}
                          {client.ip === metrics.clientIp && (
                            <span className="ml-2 text-[9px] bg-blue-500/10 text-blue-500 dark:bg-blue-500/5 dark:text-blue-400 px-1.5 py-0.5 rounded font-sans uppercase font-bold">
                              You
                            </span>
                          )}
                        </td>
                        <td className="py-4 text-center text-emerald-500 font-semibold">{client.allowed}</td>
                        <td className="py-4 text-center text-rose-500 font-semibold">{client.blocked}</td>
                        <td className="py-4 text-right font-bold text-slate-900 dark:text-zinc-150">{client.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
};

export default Analytics;
