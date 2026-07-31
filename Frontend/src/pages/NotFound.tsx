import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { motion } from 'framer-motion';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#09090b] overflow-hidden px-4">
      {/* Background visual effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-zinc-950/80 to-zinc-950" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none animate-pulse" />

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative max-w-md w-full bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-8 text-center shadow-2xl z-10 space-y-6"
      >
        <div className="inline-flex p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 animate-bounce">
          <ShieldAlert className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <h1 className="text-6xl font-extrabold font-outfit tracking-tighter text-white">404</h1>
          <h2 className="text-lg font-bold text-zinc-200">Security Access Restricted</h2>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed">
            The resource path you requested does not exist or has been blocklisted by the rate limiter system firewall.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center py-2.5 px-4 rounded-xl border border-zinc-800 hover:bg-zinc-800/50 text-xs font-semibold text-zinc-300 transition-all active:scale-[0.98]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
          
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center justify-center py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-all shadow-md shadow-blue-600/10 active:scale-[0.98]"
          >
            <Home className="w-4 h-4 mr-2" />
            Console Home
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
