import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserSummary, AuthResponse } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: UserSummary | null;
  token: string | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (fullName: string, email: string, pass: string, role?: string) => Promise<void>;
  logout: () => Promise<void>;
  isStudent: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSummary | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('accessToken'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMe = async () => {
      if (token) {
        try {
          const resp = await api.get<UserSummary>('/auth/me');
          setUser(resp.data);
          localStorage.setItem('user', JSON.stringify(resp.data));
        } catch (err: any) {
          // Only force logout if the backend explicitly rejected the token with 401
          // Do not kick user out on network failure or when backend is offline
          if (err.response?.status === 401) {
            logout();
          }
        }
      }
      setLoading(false);
    };
    fetchMe();
  }, [token]);

  const handleAuthSuccess = (data: AuthResponse) => {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    setToken(data.accessToken);
    setUser(data.user);
  };

  const login = async (email: string, pass: string) => {
    const resp = await api.post<AuthResponse>('/auth/login', { email, password: pass });
    handleAuthSuccess(resp.data);
  };

  const register = async (fullName: string, email: string, pass: string, role: string = 'STUDENT') => {
    const resp = await api.post<AuthResponse>('/auth/register', { fullName, email, password: pass, role });
    handleAuthSuccess(resp.data);
  };

  const logout = async () => {
    try {
      if (token) {
        await api.post('/auth/logout');
      }
    } catch {
      // Ignore logout request errors on client clear
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
    }
  };

  const isStudent = user ? user.roles.includes('ROLE_STUDENT') : false;
  const isAdmin = user ? user.roles.includes('ROLE_ADMIN') : false;

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isStudent, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
