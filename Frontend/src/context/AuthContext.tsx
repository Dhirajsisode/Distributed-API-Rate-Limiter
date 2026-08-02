import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import apiClient from '../api/client';
import { toast } from 'react-toastify';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (emailOrUsername: string, password?: string) => Promise<boolean>;
  register: (data: any) => Promise<boolean>;
  logout: () => void;
  updateApiKey: (key: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const response = await apiClient.get('/api/profile');
          const data = response.data;
          setUser({
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            role: data.roles?.[0]?.name?.replace('ROLE_', '') || 'User',
            avatarUrl: data.avatarUrl,
            apiKey: 'rl_live_8f3c7a02b6d1945c58ee76a91176b92a' // Mock API key
          });
        } catch (error) {
          console.error('Session expired', error);
          localStorage.removeItem('auth_token');
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (usernameOrEmail: string, password?: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await apiClient.post('/api/auth/login', { usernameOrEmail, password });
      const { token, firstName, lastName, email, avatarUrl, roles } = res.data;
      
      localStorage.setItem('auth_token', token);
      
      setUser({
        name: `${firstName} ${lastName}`,
        email,
        role: roles?.[0]?.replace('ROLE_', '') || 'User',
        avatarUrl,
        apiKey: 'rl_live_8f3c7a02b6d1945c58ee76a91176b92a'
      });
      setIsLoading(false);
      return true;
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const register = async (data: any): Promise<boolean> => {
    setIsLoading(true);
    try {
      await apiClient.post('/api/auth/register', data);
      setIsLoading(false);
      toast.success('Registration successful! Please login.');
      return true;
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
    apiClient.post('/api/auth/logout').catch(() => {});
  };

  const updateApiKey = (key: string) => {
    if (user) {
      setUser({ ...user, apiKey: key });
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout, updateApiKey }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
export default AuthContext;
