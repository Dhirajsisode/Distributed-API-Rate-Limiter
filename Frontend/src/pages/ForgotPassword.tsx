import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Mail, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

export const ForgotPassword: React.FC = () => {
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('If an account exists, a password reset link has been sent.');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#09090b] overflow-hidden px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-zinc-950/50 to-zinc-950" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-4 shadow-xl">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white font-outfit">
            Reset Password
          </h2>
          <p className="text-zinc-400 text-sm mt-2">
            Enter your email to receive recovery instructions.
          </p>
        </div>

        <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300 tracking-wider">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all focus:border-zinc-700"
                  placeholder="admin@company.com"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold tracking-wide transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
            >
              Send Recovery Link <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <Link to="/login" className="inline-flex items-center text-sm text-zinc-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
