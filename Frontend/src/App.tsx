import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RateLimiterProvider } from './context/RateLimiterContext';
import { ToastContainer } from 'react-toastify';
import { Loader2 } from 'lucide-react';

// Lazy loading components for optimized bundle splitting & performance
const Login = lazy(() => import('./pages/Login'));
const DashboardLayout = lazy(() => import('./layouts/DashboardLayout'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Analytics = lazy(() => import('./pages/Analytics'));
const RateLimiterMonitor = lazy(() => import('./pages/RateLimiterMonitor'));
const ApiTesting = lazy(() => import('./pages/ApiTesting'));
const Logs = lazy(() => import('./pages/Logs'));
const Settings = lazy(() => import('./pages/Settings'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading Screen for Suspense Fallbacks
const PageLoader: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#09090b]">
    <div className="text-center space-y-3">
      <Loader2 className="w-10 h-10 animate-spin text-blue-500 mx-auto" />
      <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Loading Shield Console...</p>
    </div>
  </div>
);

// Protected Route Guard Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RateLimiterProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Authenticate Path */}
              <Route path="/login" element={<Login />} />

              {/* Protected Console Paths */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="monitor" element={<RateLimiterMonitor />} />
                <Route path="testing" element={<ApiTesting />} />
                <Route path="logs" element={<Logs />} />
                <Route path="settings" element={<Settings />} />
                <Route path="profile" element={<Profile />} />
              </Route>

              {/* Wildcard 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>

          {/* Global Alert Notification Center */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </RateLimiterProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
