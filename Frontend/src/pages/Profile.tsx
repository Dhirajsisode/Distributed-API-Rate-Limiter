import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRateLimiter } from '../context/RateLimiterContext';
import {
  User,
  Key,
  Copy,
  Check,
  RefreshCcw,
  Eye,
  EyeOff,
  Laptop,
  Clock,
  ShieldCheck,
  Globe,
} from 'lucide-react';
import { toast } from 'react-toastify';

export const Profile: React.FC = () => {
  const { user, updateApiKey } = useAuth();
  const { metrics } = useRateLimiter();
  const [copied, setCopied] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const handleCopyKey = () => {
    if (!user?.apiKey) return;
    navigator.clipboard.writeText(user.apiKey);
    setCopied(true);
    toast.success('API Key copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerateKey = () => {
    const randomHex = Array.from({ length: 32 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    const newKey = `rl_live_${randomHex}`;
    updateApiKey(newKey);
    toast.success('API Key regenerated successfully!');
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight dark:text-zinc-50 font-outfit">
          Administrator Profile
        </h2>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
          Review administrative access details, API keys, and active user sessions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: VISUAL PROFILE CARD */}
        <div className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-zinc-800/50 flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <img
              src={user?.avatarUrl}
              alt="user avatar"
              className="w-24 h-24 rounded-2xl ring-4 ring-blue-500/20"
            />
            <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-950" />
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-200">{user?.name}</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">{user?.email}</p>
            <span className="inline-block mt-3 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 dark:bg-blue-500/5 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider">
              {user?.role}
            </span>
          </div>

          <div className="w-full border-t border-slate-100 dark:border-zinc-900 pt-4 text-xs text-left space-y-3">
            <div className="flex justify-between items-center text-slate-400 font-semibold">
              <span>Security Level</span>
              <span className="text-slate-800 dark:text-zinc-200">Level 4 (Owner)</span>
            </div>
            <div className="flex justify-between items-center text-slate-400 font-semibold">
              <span>Status</span>
              <span className="text-emerald-500">Active</span>
            </div>
            <div className="flex justify-between items-center text-slate-400 font-semibold">
              <span>Registered IP</span>
              <span className="font-mono text-slate-800 dark:text-zinc-200">{metrics.clientIp}</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CREDENTIAL API KEYS & SESSION METRICS */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* API Key management panel */}
          <div className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-zinc-800/50 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 tracking-wider uppercase flex items-center">
              <Key className="w-4 h-4 mr-2 text-blue-500" />
              Developer API Keys
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-normal">
              Use this key to authorize custom programmatic rate-limiting requests. Keep this private.
            </p>

            <div className="flex items-center space-x-2 bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 rounded-xl p-3">
              <span className="text-slate-400 p-1">
                <Key className="w-4 h-4" />
              </span>
              <input
                type={showKey ? 'text' : 'password'}
                readOnly
                value={user?.apiKey || ''}
                className="bg-transparent border-none text-xs font-mono font-semibold text-slate-850 dark:text-zinc-200 flex-1 focus:outline-none select-all"
              />
              <div className="flex space-x-1.5">
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="p-2 hover:bg-slate-200 dark:hover:bg-zinc-900 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 transition-colors"
                  title={showKey ? 'Hide key' : 'Show key'}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleCopyKey}
                  className="p-2 hover:bg-slate-200 dark:hover:bg-zinc-900 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 transition-colors"
                  title="Copy Key"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleRegenerateKey}
                  className="p-2 hover:bg-slate-200 dark:hover:bg-zinc-900 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 transition-colors"
                  title="Regenerate Key"
                >
                  <RefreshCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* User Active Session device history */}
          <div className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-zinc-800/50 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 tracking-wider uppercase flex items-center">
              <Laptop className="w-4 h-4 mr-2 text-blue-500" />
              Active Sessions
            </h3>
            
            <div className="space-y-4">
              {/* Session 1 */}
              <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100 dark:border-zinc-900 pb-3">
                <div className="flex items-center space-x-3">
                  <Laptop className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="font-bold text-slate-850 dark:text-zinc-250">Vite React Web Application (Current)</p>
                    <p className="text-[10px] text-slate-500 dark:text-zinc-550 flex items-center mt-0.5">
                      <Globe className="w-3 h-3 mr-1" /> {metrics.clientIp}
                    </p>
                  </div>
                </div>
                <span className="text-[9px] bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/5 dark:text-emerald-450 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  Active Now
                </span>
              </div>

              {/* Session 2 */}
              <div className="flex items-center justify-between text-xs py-1 text-slate-500 dark:text-zinc-450">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-slate-400 opacity-60" />
                  <div>
                    <p className="font-bold text-slate-700 dark:text-zinc-400">Spring Boot CLI Session</p>
                    <p className="text-[10px] text-slate-500 dark:text-zinc-550 flex items-center mt-0.5">
                      <ShieldCheck className="w-3 h-3 mr-1" /> Token: local_ssh_agent
                    </p>
                  </div>
                </div>
                <span className="text-[9px] text-slate-400 font-bold uppercase">
                  1 hour ago
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Profile;
