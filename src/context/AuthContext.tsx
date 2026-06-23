import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginUser, getUserProfile, User } from '../api/tmdbApi';
import { RTClient } from '../api/RTClient';

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delayMs = 3000
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err: any) {
      const status = err?.response?.status ?? err?.status;
      const isLastAttempt = i === retries - 1;
      if (status === 503 && !isLastAttempt) {
        console.warn(`бекенд недоступний, спроба ${i + 2}/${retries} через ${delayMs / 1000}с...`);
        await new Promise(res => setTimeout(res, delayMs));
      } else {
        throw err;
      }
    }
  }
  throw new Error('fetchWithRetry: всі спроби вичерпано');
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const storedUserId = localStorage.getItem('cinelink_user_id');
      if (storedUserId) {
        setLoading(true);
        try {
          const userData = await fetchWithRetry(() => getUserProfile(Number(storedUserId)));
          setUser(userData);
        } catch (e) {
          console.error('Failed to restore user session');
          localStorage.removeItem('cinelink_user_id');
        } finally {
          setLoading(false);
        }
      }
    };
    checkUser();
  }, []);

  const login = async (username: string, pass: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log('AuthContext: Starting login for:', username);

      const responseData = await fetchWithRetry(() => loginUser({ login: username, password: pass }));

      let userId: number;
      let userData: User;

      if (typeof responseData === 'object' && responseData !== null && 'user_id' in responseData) {
        userData = responseData as User;
        userId = userData.user_id;
      } else {
        userId = Number(responseData);
        userData = await fetchWithRetry(() => getUserProfile(userId));
      }

      setUser(userData);
      localStorage.setItem('cinelink_user_id', String(userId));
      RTClient.connect(userId);

    } catch (err: any) {
      console.error('AuthContext Error:', err);
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
      
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cinelink_user_id');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
