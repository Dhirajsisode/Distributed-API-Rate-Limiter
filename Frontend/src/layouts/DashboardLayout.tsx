import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRateLimiter } from '../context/RateLimiterContext';
import {
  LayoutDashboard,
  BarChart3,
  Activity,
  Send,
  Terminal,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  ShieldCheck,
  Server,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { metrics } = useRateLimiter();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Load and apply theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      // Default to dark mode
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Rate Limiter Monitor', path: '/monitor', icon: Activity },
    { name: 'API Testing', path: '/testing', icon: Send },
    { name: 'Logs', path: '/logs', icon: Terminal },
    { name: 'Settings', path: '/settings', icon: Settings },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  // Helper to generate dynamic breadcrumbs
  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter((p) => p);
    return (
      <div className="flex items-center space-x-1 text-xs md:text-sm text-slate-500 dark:text-zinc-400">
        <span className="hover:text-blue-500 cursor-pointer" onClick={() => navigate('/dashboard')}>
          Console
        </span>
        {paths.map((p, idx) => {
          const pathName = p.charAt(0).toUpperCase() + p.slice(1).replace('-', ' ');
          const routeTo = `/${paths.slice(0, idx + 1).join('/')}`;
          const isLast = idx === paths.length - 1;

          return (
            <React.Fragment key={p}>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-600" />
              <span
                className={`font-medium transition-colors ${
                  isLast 
                    ? 'text-slate-800 dark:text-zinc-200' 
                    : 'hover:text-blue-500 cursor-pointer'
                }`}
                onClick={() => !isLast && navigate(routeTo)}
              >
                {pathName}
              </span>
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 dark:bg-[#09090b] dark:text-zinc-50 font-sans transition-colors duration-300">
      
      {/* --- SIDEBAR FOR DESKTOP --- */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200/60 dark:border-zinc-800/80 bg-white/50 dark:bg-zinc-950/40 backdrop-blur-md sticky top-0 h-screen z-20">
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-200/60 dark:border-zinc-800/80 gap-3">
          <div className="p-1.5 rounded-lg bg-blue-600/10 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-600/20 dark:border-blue-500/20 shadow-inner">
            <ShieldCheck className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-zinc-50 font-outfit">
              RATE LIMITER
            </h1>
            <p className="text-[10px] text-slate-500 dark:text-zinc-500 font-semibold tracking-wider">
              ENTERPRISE SHIELD
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all group duration-200 ${
                  isActive
                    ? 'bg-blue-600/10 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border-l-4 border-blue-600 dark:border-blue-500 shadow-sm'
                    : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100/50 dark:hover:bg-zinc-900/40 hover:text-slate-900 dark:hover:text-zinc-100'
                }`}
              >
                <Icon className={`w-5 h-5 mr-3 transition-transform duration-200 group-hover:scale-105 ${
                  isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-zinc-500 group-hover:text-slate-600 dark:group-hover:text-zinc-300'
                }`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Card footer */}
        <div className="p-4 border-t border-slate-200/60 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-950/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center min-w-0">
              <img
                src={user?.avatarUrl}
                alt="user avatar"
                className="w-9 h-9 rounded-xl ring-2 ring-slate-200 dark:ring-zinc-800"
              />
              <div className="ml-3 min-w-0">
                <p className="text-xs font-semibold text-slate-800 dark:text-zinc-200 truncate leading-none">
                  {user?.name}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-zinc-400 truncate mt-1">
                  {user?.role}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* --- MAIN PAGE WORKSPACE --- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        
        {/* --- NAVBAR --- */}
        <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-slate-200/50 dark:border-zinc-900 bg-white/60 dark:bg-[#09090b]/40 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-900 border border-slate-200/40 dark:border-zinc-800/40"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Breadcrumbs */}
            {getBreadcrumbs()}
          </div>

          <div className="flex items-center space-x-3 md:space-x-4">
            
            {/* Server Online Badge */}
            <div className={`hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold border ${
              metrics.serverStatus === 'Online'
                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/5 dark:text-emerald-400 dark:border-emerald-500/10'
                : 'bg-rose-500/10 text-rose-600 border-rose-500/20 dark:bg-rose-500/5 dark:text-rose-400 dark:border-rose-500/10'
            }`}>
              <Server className={`w-3.5 h-3.5 ${metrics.serverStatus === 'Online' ? 'animate-pulse' : ''}`} />
              <span>API Server: {metrics.serverStatus}</span>
            </div>

            {/* Dark Mode toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 hover:text-blue-500 dark:hover:text-blue-400 transition-all border border-slate-200/30 dark:border-zinc-800/30 shadow-sm"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Profile Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center focus:outline-none"
              >
                <img
                  src={user?.avatarUrl}
                  alt="user avatar"
                  className="w-9 h-9 rounded-xl ring-2 ring-blue-500/20 dark:ring-blue-500/10 cursor-pointer"
                />
              </button>
              
              <AnimatePresence>
                {isProfileMenuOpen && (
                  <>
                    {/* Overlay to close menu */}
                    <div className="fixed inset-0 z-10" onClick={() => setIsProfileMenuOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 rounded-2xl glass-card z-20 py-2 border border-slate-200 dark:border-zinc-800 shadow-xl overflow-hidden"
                    >
                      <div className="px-4 py-2 border-b border-slate-200/50 dark:border-zinc-800/50">
                        <p className="text-xs text-slate-400 dark:text-zinc-500 font-medium">Logged in as</p>
                        <p className="text-sm font-semibold text-slate-800 dark:text-zinc-100 truncate">{user?.name}</p>
                        <p className="text-[10px] text-slate-500 dark:text-zinc-400 truncate leading-none mt-1">{user?.email}</p>
                      </div>
                      
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center w-full px-4 py-2 text-sm text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800/50 transition-colors"
                      >
                        <User className="w-4 h-4 mr-3 text-slate-400" />
                        My Profile
                      </Link>
                      
                      <Link
                        to="/settings"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center w-full px-4 py-2 text-sm text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800/50 transition-colors"
                      >
                        <Settings className="w-4 h-4 mr-3 text-slate-400" />
                        Settings
                      </Link>
                      
                      <div className="border-t border-slate-200/50 dark:border-zinc-800/50 my-1"></div>
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-500/5 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4 mr-3 text-red-500" />
                        Log out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

          </div>
        </header>

        {/* --- PAGE MAIN CONTAINER --- */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* --- SLIDEOUT MOBILE NAVIGATION DRAWER --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-30 lg:hidden"
            />
            
            {/* Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-zinc-950 border-r border-slate-200/60 dark:border-zinc-800/80 z-40 flex flex-col lg:hidden"
            >
              <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200/60 dark:border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <span className="font-extrabold text-sm tracking-wider font-outfit">RATE LIMITER</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                {menuItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-blue-600/10 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border-l-4 border-blue-600 dark:border-blue-500 shadow-sm'
                          : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100/50 dark:hover:bg-zinc-900/40 hover:text-slate-900 dark:hover:text-zinc-100'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-slate-200/60 dark:border-zinc-800/80 bg-slate-50 dark:bg-zinc-900/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img src={user?.avatarUrl} alt="user avatar" className="w-8 h-8 rounded-xl" />
                    <div className="ml-3">
                      <p className="text-xs font-semibold">{user?.name}</p>
                      <p className="text-[10px] text-slate-500">{user?.role}</p>
                    </div>
                  </div>
                  <button onClick={handleLogout} className="p-1 text-slate-400 hover:text-red-500">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default DashboardLayout;
