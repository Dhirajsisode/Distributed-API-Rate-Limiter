import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(4, { message: 'Password must be at least 4 characters long' }),
  fullName: z.string().optional(),
});

type LoginSchemaType = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@company.com',
      password: 'admin',
    },
  });

  const onSubmit = async (data: LoginSchemaType) => {
    setIsLoading(true);
    try {
      await login(data.email, data.fullName || 'Enterprise Admin');
      toast.success('Successfully authenticated! Welcome back.');
      navigate('/dashboard');
    } catch {
      toast.error('Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#09090b] overflow-hidden px-4">
      {/* Premium background grid and glowing circles */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-zinc-950/50 to-zinc-950" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          {/* Logo */}
          <div className="inline-flex p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-4 shadow-xl">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white font-outfit">
            Access Shield Console
          </h2>
          <p className="text-zinc-400 text-sm mt-2">
            Distributed API Rate Limiter Controller
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
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
                  {...register('email')}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-950 border text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all ${
                    errors.email ? 'border-red-500/50' : 'border-zinc-800 focus:border-zinc-700'
                  }`}
                  placeholder="admin@company.com"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-400 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300 tracking-wider">
                SECURITY PASSWORD
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  {...register('password')}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-950 border text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all ${
                    errors.password ? 'border-red-500/50' : 'border-zinc-800 focus:border-zinc-700'
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="text-xs text-red-400 font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Hint Box */}
            <div className="bg-blue-950/20 border border-blue-900/30 rounded-xl p-3 text-[11px] text-blue-400 leading-normal">
              <strong>Quick access tip:</strong> Enter any email and password (e.g. <code>admin@company.com</code> / <code>admin</code>) to log in instantly.
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:opacity-50 text-white text-sm font-semibold tracking-wide transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying Credentials...
                </>
              ) : (
                <>
                  Sign In to Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="text-center mt-6 text-xs text-zinc-500 font-semibold tracking-wider">
          PROTECTED BY AES-256 & LOCAL REDIS CLUSTERING
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
