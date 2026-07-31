import React, { useState } from 'react';
import { useRateLimiter } from '../context/RateLimiterContext';
import { HttpMethod } from '../types';
import {
  Send,
  Copy,
  Download,
  Check,
  Clock,
  Globe,
  Settings,
  Code,
  Plus,
  Trash2,
  Play,
} from 'lucide-react';
import { toast } from 'react-toastify';

interface HeaderRow {
  key: string;
  value: string;
}

export const ApiTesting: React.FC = () => {
  const { executeCustom } = useRateLimiter();
  const [method, setMethod] = useState<HttpMethod>('GET');
  const [path, setPath] = useState('/api/data');
  const [headers, setHeaders] = useState<HeaderRow[]>([
    { key: 'Accept', value: 'application/json' },
  ]);
  const [body, setBody] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // Load request presets to make testing fast and seamless
  const presets = [
    { name: 'Spring Boot Root Ping', method: 'GET' as const, path: '/' },
    { name: 'Spring Boot Rate Limiter Endpoint', method: 'GET' as const, path: '/api/data' },
    { name: 'Test Custom POST (Trigger Error)', method: 'POST' as const, path: '/api/data' },
  ];

  const applyPreset = (preset: typeof presets[0]) => {
    setMethod(preset.method);
    setPath(preset.path);
    if (preset.method === 'POST') {
      setBody('{\n  "name": "tester",\n  "action": "ping"\n}');
    } else {
      setBody('');
    }
  };

  const handleAddHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  const handleHeaderChange = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...headers];
    updated[index][field] = value;
    setHeaders(updated);
  };

  const handleRemoveHeader = (index: number) => {
    const updated = headers.filter((_, i) => i !== index);
    setHeaders(updated);
  };

  const handleSendRequest = async () => {
    setIsLoading(true);
    setResponse(null);
    setCopied(false);

    // Convert key-value headers array to record
    const requestHeaders: Record<string, string> = {};
    headers.forEach((row) => {
      if (row.key.trim()) {
        requestHeaders[row.key.trim()] = row.value.trim();
      }
    });

    try {
      const res = await executeCustom(method, path, requestHeaders, body);
      setResponse(res);
      
      if (res.status === 200) {
        toast.success(`Success! Status: ${res.status}`);
      } else if (res.status === 429) {
        toast.error(`Rate Limited! Status: 429 Too Many Requests`);
      } else {
        toast.warning(`Request finished with status: ${res.status}`);
      }
    } catch {
      toast.error('Network failure or endpoint offline');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!response) return;
    const text = typeof response.data === 'object' ? JSON.stringify(response.data, null, 2) : String(response.data);
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Response body copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!response) return;
    const text = typeof response.data === 'object' ? JSON.stringify(response.data, null, 2) : String(response.data);
    const blob = new Blob([text], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `response_${new Date().getTime()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Response downloaded as JSON file');
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight dark:text-zinc-50 font-outfit">
          API Testing Tool
        </h2>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
          Perform REST requests (GET, POST, PUT, DELETE) against the Spring Boot backend and audit response details.
        </p>
      </div>

      {/* Preset Quick Actions Row */}
      <div className="flex flex-wrap gap-3 items-center">
        <span className="text-xs text-slate-500 dark:text-zinc-500 font-bold uppercase tracking-wider">Presets:</span>
        {presets.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => applyPreset(preset)}
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors font-medium text-slate-700 dark:text-zinc-300"
          >
            {preset.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEFT COLUMN: HTTP CLIENT BUILDER */}
        <div className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-zinc-800/50 space-y-6">
          <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 tracking-wider uppercase">
            Request Builder
          </h3>

          {/* Method and Address Input */}
          <div className="flex space-x-2">
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as HttpMethod)}
              className={`px-4 py-3 rounded-xl border text-sm font-bold bg-slate-100 dark:bg-zinc-950 text-slate-800 dark:text-zinc-200 focus:outline-none transition-all ${
                method === 'GET'
                  ? 'border-emerald-500/30 focus:border-emerald-500'
                  : method === 'POST'
                  ? 'border-amber-500/30 focus:border-amber-500'
                  : method === 'PUT'
                  ? 'border-purple-500/30 focus:border-purple-500'
                  : 'border-rose-500/30 focus:border-rose-500'
              }`}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>

            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-mono text-xs">
                /
              </span>
              <input
                type="text"
                value={path}
                onChange={(e) => setPath(e.target.value)}
                placeholder="api/data"
                className="w-full pl-5 pr-4 py-3 bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm font-mono text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            
            <button
              onClick={handleSendRequest}
              disabled={isLoading}
              className="flex items-center px-5 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white rounded-xl text-sm font-semibold shadow-md active:scale-95 transition-all"
            >
              <Send className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Request Headers configuration */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 tracking-wider uppercase flex items-center">
                <Settings className="w-3.5 h-3.5 mr-1.5" />
                Request Headers
              </span>
              <button
                onClick={handleAddHeader}
                className="flex items-center text-[10px] uppercase font-bold text-blue-500 hover:text-blue-400 hover:bg-blue-500/5 px-2 py-1 rounded"
              >
                <Plus className="w-3 h-3 mr-1" /> Add Row
              </button>
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {headers.map((row, idx) => (
                <div key={idx} className="flex space-x-2">
                  <input
                    type="text"
                    value={row.key}
                    onChange={(e) => handleHeaderChange(idx, 'key', e.target.value)}
                    placeholder="Key"
                    className="w-1/2 px-3 py-2 bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg text-xs font-mono text-slate-800 dark:text-zinc-300 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={row.value}
                    onChange={(e) => handleHeaderChange(idx, 'value', e.target.value)}
                    placeholder="Value"
                    className="w-1/2 px-3 py-2 bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg text-xs font-mono text-slate-800 dark:text-zinc-300 focus:outline-none"
                  />
                  <button
                    onClick={() => handleRemoveHeader(idx)}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Request Body Payload */}
          {['POST', 'PUT'].includes(method) && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 tracking-wider uppercase flex items-center">
                <Code className="w-3.5 h-3.5 mr-1.5" />
                Request Payload (JSON)
              </span>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={`{\n  "example": "data"\n}`}
                rows={6}
                className="w-full p-4 bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl font-mono text-xs text-slate-850 dark:text-zinc-300 focus:outline-none"
              />
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: HTTP RESPONSE VIEWER */}
        <div className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-zinc-800/50 flex flex-col justify-between min-h-[400px]">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 tracking-wider uppercase">
                Response Viewer
              </h3>
              {response && (
                <div className="flex space-x-2">
                  <button
                    onClick={handleCopy}
                    className="p-2 rounded-lg bg-slate-100 dark:bg-zinc-900 border border-slate-200/30 dark:border-zinc-800/30 text-slate-500 hover:text-slate-700 dark:hover:text-zinc-300 transition-all"
                    title="Copy Response Body"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="p-2 rounded-lg bg-slate-100 dark:bg-zinc-900 border border-slate-200/30 dark:border-zinc-800/30 text-slate-500 hover:text-slate-700 dark:hover:text-zinc-300 transition-all"
                    title="Download Response as File"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Response metadata */}
            {response ? (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-4 text-xs font-semibold pb-4 border-b border-slate-200/50 dark:border-zinc-800/50">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-500">Status:</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      response.status >= 200 && response.status < 300
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : response.status === 429
                        ? 'bg-rose-500/10 text-rose-500 animate-bounce'
                        : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      {response.status} {response.statusText}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-500">Duration:</span>
                    <span className="text-blue-500">{response.duration} ms</span>
                  </div>
                </div>

                {/* HTTP Headers */}
                {response.headers && Object.keys(response.headers).length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Response Headers</span>
                    <div className="bg-slate-100 dark:bg-zinc-950/60 rounded-xl p-3 max-h-36 overflow-y-auto font-mono text-[10px] text-slate-600 dark:text-zinc-400 space-y-1 divide-y divide-slate-200/10 dark:divide-zinc-800/10">
                      {Object.entries(response.headers).map(([key, val]) => (
                        <div key={key} className="flex justify-between py-1">
                          <span className="font-semibold text-slate-500">{key}</span>
                          <span className="text-slate-700 dark:text-zinc-300 truncate max-w-xs">{String(val)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Response payload body JSON */}
                <div className="space-y-2">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Response Body</span>
                  <pre className="p-4 bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl font-mono text-xs text-slate-805 dark:text-emerald-400 max-h-60 overflow-y-auto">
                    {typeof response.data === 'object'
                      ? JSON.stringify(response.data, null, 2)
                      : String(response.data)}
                  </pre>
                </div>

              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400 dark:text-zinc-500 py-12 space-y-3">
                <Play className="w-10 h-10 stroke-1 text-slate-300 dark:text-zinc-700 animate-pulse" />
                <p className="text-xs font-semibold">Ready to dispatch requests</p>
                <p className="text-[10px] text-slate-500 dark:text-zinc-500 max-w-xs">
                  Fill in the request builder on the left and click send to test server response times and rate limiting.
                </p>
              </div>
            )}
          </div>
          
          {/* Quick instructions footer */}
          <div className="text-[10px] text-slate-400 dark:text-zinc-500 pt-4 border-t border-slate-200/50 dark:border-zinc-800/50 leading-relaxed mt-4">
            Note: Requests triggered through this tool are recorded in the system logs and affect dashboard analytics stats dynamically.
          </div>
        </div>

      </div>
    </div>
  );
};

export default ApiTesting;
