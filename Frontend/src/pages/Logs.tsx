import React, { useState, useMemo } from 'react';
import { useRateLimiter } from '../context/RateLimiterContext';
import { RequestLog, HttpMethod } from '../types';
import {
  Search,
  Download,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Filter,
  Trash2,
  Database,
} from 'lucide-react';
import EmptyState from '../components/EmptyState';

type SortField = 'timestamp' | 'responseTime' | 'status';
type SortOrder = 'asc' | 'desc';

export const Logs: React.FC = () => {
  const { logs, clearLogs } = useRateLimiter();

  // Filter and pagination state
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [timeFilter, setTimeFilter] = useState<string>('ALL'); // ALL, 1H, 24H, TODAY

  // Sorting state
  const [sortField, setSortField] = useState<SortField>('timestamp');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 1. Process Logs: Filtering
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Search matching
      const matchesSearch =
        log.url.toLowerCase().includes(search.toLowerCase()) ||
        log.clientIp.includes(search) ||
        String(log.status).includes(search) ||
        log.statusText.toLowerCase().includes(search.toLowerCase());

      // Method matching
      const matchesMethod = methodFilter === 'ALL' || log.method === methodFilter;

      // Status matching
      let matchesStatus = true;
      if (statusFilter === '200') matchesStatus = log.status === 200;
      else if (statusFilter === '429') matchesStatus = log.status === 429;
      else if (statusFilter === 'ERR') matchesStatus = log.status === 0 || log.status >= 500;

      // Type matching
      const matchesType = typeFilter === 'ALL' || log.type === typeFilter;

      // Time range matching
      let matchesTime = true;
      if (timeFilter !== 'ALL') {
        const logTime = new Date(log.timestamp).getTime();
        const now = new Date().getTime();
        if (timeFilter === '1H') {
          matchesTime = now - logTime < 60 * 60 * 1000;
        } else if (timeFilter === '24H') {
          matchesTime = now - logTime < 24 * 60 * 60 * 1000;
        } else if (timeFilter === 'TODAY') {
          const logDate = new Date(log.timestamp).toDateString();
          const today = new Date().toDateString();
          matchesTime = logDate === today;
        }
      }

      return matchesSearch && matchesMethod && matchesStatus && matchesType && matchesTime;
    });
  }, [logs, search, methodFilter, statusFilter, typeFilter, timeFilter]);

  // 2. Process Logs: Sorting
  const sortedLogs = useMemo(() => {
    const sorted = [...filteredLogs];
    sorted.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      // Convert timestamp string to numerical time value for accurate sorting
      if (sortField === 'timestamp') {
        aVal = new Date(a.timestamp).getTime();
        bVal = new Date(b.timestamp).getTime();
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredLogs, sortField, sortOrder]);

  // 3. Process Logs: Pagination slicing
  const paginatedLogs = useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize;
    return sortedLogs.slice(startIdx, startIdx + pageSize);
  }, [sortedLogs, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedLogs.length / pageSize) || 1;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
    setCurrentPage(1); // Reset page on sort
  };

  // CSV Exporter compiles headers + rows and triggers download
  const handleExportCSV = () => {
    if (filteredLogs.length === 0) {
      return;
    }

    const csvHeaders = ['ID', 'Timestamp', 'Client IP', 'Method', 'URL', 'Status', 'Status Text', 'Latency (ms)', 'Allowed', 'Request Source'];
    const csvRows = filteredLogs.map((log) => [
      log.id,
      log.timestamp,
      log.clientIp,
      log.method,
      log.url,
      log.status,
      log.statusText,
      log.responseTime,
      log.allowed ? 'YES' : 'NO',
      log.type,
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map((row) => row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `audit_logs_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header and top export buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight dark:text-zinc-50 font-outfit">
            System Request Logs
          </h2>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Complete audit trail of client API calls, telemetry speeds, and traffic approvals.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={clearLogs}
            disabled={logs.length === 0}
            className="flex items-center px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 hover:bg-red-500/5 hover:text-red-500 dark:hover:text-red-400 text-sm font-medium transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Wipe Logs
          </button>
          
          <button
            onClick={handleExportCSV}
            disabled={filteredLogs.length === 0}
            className="flex items-center px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white text-sm font-semibold tracking-wide shadow-md transition-all disabled:opacity-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV ({filteredLogs.length})
          </button>
        </div>
      </div>

      {/* FILTER CONTROLS GRID */}
      <div className="glass-card p-5 rounded-2xl border border-slate-200/50 dark:border-zinc-800/50 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Search Input */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search path, IP, code..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 rounded-xl text-xs text-slate-800 dark:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Method filter */}
        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={methodFilter}
            onChange={(e) => {
              setMethodFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full py-2.5 px-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 rounded-xl text-xs text-slate-800 dark:text-zinc-300 focus:outline-none"
          >
            <option value="ALL">All Methods</option>
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>

        {/* Status filter */}
        <div className="flex items-center space-x-2">
          <Database className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full py-2.5 px-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 rounded-xl text-xs text-slate-800 dark:text-zinc-300 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="200">200 Allowed</option>
            <option value="429">429 Blocked</option>
            <option value="ERR">Errors (&gt;=500)</option>
          </select>
        </div>

        {/* Request source type filter */}
        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full py-2.5 px-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 rounded-xl text-xs text-slate-800 dark:text-zinc-300 focus:outline-none"
          >
            <option value="ALL">All Sources</option>
            <option value="DASHBOARD_TRIGGER">Dashboard manual</option>
            <option value="API_TEST">Custom API Test</option>
            <option value="BACKGROUND">Background monitor</option>
          </select>
        </div>

        {/* Date Filter */}
        <div className="flex items-center space-x-2">
          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={timeFilter}
            onChange={(e) => {
              setTimeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full py-2.5 px-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 rounded-xl text-xs text-slate-800 dark:text-zinc-300 focus:outline-none"
          >
            <option value="ALL">All Time</option>
            <option value="1H">Last 1 Hour</option>
            <option value="24H">Last 24 Hours</option>
            <option value="TODAY">Today</option>
          </select>
        </div>

      </div>

      {/* AUDIT LOG TABLE GRID */}
      {filteredLogs.length === 0 ? (
        <EmptyState
          isSearch={search !== '' || methodFilter !== 'ALL' || statusFilter !== 'ALL' || typeFilter !== 'ALL' || timeFilter !== 'ALL'}
          title="No logs found"
          description={
            logs.length === 0
              ? 'Request history is empty. Trigger some API requests or wait for background polling to log endpoints.'
              : 'Try clearing your search query or filters to show results.'
          }
        />
      ) : (
        <div className="space-y-4">
          <div className="glass-card rounded-2xl border border-slate-200/50 dark:border-zinc-800/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/50 dark:border-zinc-800/50 text-slate-400 font-semibold uppercase tracking-wider bg-slate-50/50 dark:bg-zinc-950/40">
                    <th className="py-4 px-6">
                      <button
                        onClick={() => handleSort('timestamp')}
                        className="flex items-center hover:text-slate-850 dark:hover:text-zinc-200"
                      >
                        Timestamp
                        <ArrowUpDown className="w-3 h-3 ml-1.5 text-slate-500" />
                      </button>
                    </th>
                    <th className="py-4 px-6">Client IP</th>
                    <th className="py-4 px-6">Method</th>
                    <th className="py-4 px-6">Path</th>
                    <th className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleSort('status')}
                        className="flex items-center hover:text-slate-850 dark:hover:text-zinc-200 mx-auto"
                      >
                        Status
                        <ArrowUpDown className="w-3 h-3 ml-1.5 text-slate-500" />
                      </button>
                    </th>
                    <th className="py-4 px-6">Source</th>
                    <th className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleSort('responseTime')}
                        className="flex items-center hover:text-slate-850 dark:hover:text-zinc-200 ml-auto"
                      >
                        Latency
                        <ArrowUpDown className="w-3 h-3 ml-1.5 text-slate-500" />
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-900">
                  {paginatedLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/10 transition-colors">
                      <td className="py-4 px-6 text-slate-500 dark:text-zinc-400 font-medium">
                        {new Date(log.timestamp).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </td>
                      <td className="py-4 px-6 font-mono text-slate-700 dark:text-zinc-300">
                        {log.clientIp}
                      </td>
                      <td className="py-4 px-6 font-bold">
                        <span className={`px-2 py-0.5 rounded font-mono text-[9px] uppercase ${
                          log.method === 'GET'
                            ? 'bg-blue-500/10 text-blue-500'
                            : log.method === 'POST'
                            ? 'bg-amber-500/10 text-amber-500'
                            : log.method === 'PUT'
                            ? 'bg-purple-500/10 text-purple-500'
                            : 'bg-rose-500/10 text-rose-500'
                        }`}>
                          {log.method}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-mono text-slate-700 dark:text-zinc-300 max-w-xs truncate" title={log.url}>
                        {log.url}
                      </td>
                      <td className="py-4 px-6 text-center font-bold">
                        <span className={`px-2.5 py-0.5 rounded-lg text-[10px] ${
                          log.status === 200
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : log.status === 429
                            ? 'bg-rose-500/10 text-rose-500'
                            : 'bg-slate-500/10 text-slate-400'
                        }`}>
                          {log.status === 0 ? 'FAIL' : log.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-500 dark:text-zinc-500">
                        {log.type === 'BACKGROUND'
                          ? 'Background poll'
                          : log.type === 'DASHBOARD_TRIGGER'
                          ? 'Manual dashboard'
                          : 'API Testing Client'}
                      </td>
                      <td className="py-4 px-6 text-right font-bold text-blue-500 font-outfit">
                        {log.responseTime} ms
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* PAGINATION CONTROLS FOOTER */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold px-2">
            <div className="text-slate-400">
              Showing <span className="text-slate-800 dark:text-zinc-200">{(currentPage - 1) * pageSize + 1}</span> to{' '}
              <span className="text-slate-800 dark:text-zinc-200">
                {Math.min(currentPage * pageSize, filteredLogs.length)}
              </span>{' '}
              of <span className="text-slate-800 dark:text-zinc-200">{filteredLogs.length}</span> records
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-slate-400">Rows per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="py-1 px-2 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 rounded-lg text-slate-800 dark:text-zinc-350 focus:outline-none"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-zinc-850 bg-white dark:bg-zinc-950 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                <span className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-lg">
                  {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-zinc-850 bg-white dark:bg-zinc-950 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logs;
