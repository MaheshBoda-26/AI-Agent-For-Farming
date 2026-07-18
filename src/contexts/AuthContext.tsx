import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { api } from '@/integrations/api';

interface User {
  _id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  receiveAlerts: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName?: string, receiveAlerts?: boolean) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (password: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount, check if we have a stored token and fetch user
  useEffect(() => {
    const token = api.getToken();
    if (token) {
      api.get('/auth/me')
        .then((data) => {
          setUser(data.user);
        })
        .catch(() => {
          // Token is invalid/expired — clean it up silently
          api.clearToken();
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }

    // Listen for storage events (token cleared by API interceptor or other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_token' && !e.newValue) {
        setUser(null);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const signUp = useCallback(async (email: string, password: string, displayName?: string, receiveAlerts?: boolean) => {
    try {
      const data = await api.post('/auth/signup', { email, password, displayName, receiveAlerts }, { skipAutoLogout: true });
      api.setToken(data.token);
      setUser(data.user);
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err : new Error('Signup failed') };
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const data = await api.post('/auth/signin', { email, password }, { skipAutoLogout: true });
      api.setToken(data.token);
      setUser(data.user);
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err : new Error('Signin failed') };
    }
  }, []);

  const signOut = useCallback(async () => {
    api.clearToken();
    setUser(null);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    try {
      await api.post('/auth/reset-password', { email });
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err : new Error('Reset failed') };
    }
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    try {
      await api.post('/auth/update-password', { password });
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err : new Error('Update failed') };
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, resetPassword, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
