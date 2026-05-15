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
                const userData = await getUserProfile(Number(storedUserId));
                setUser(userData);
            } catch (e) {
                console.error("Failed to restore user session");
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
        console.log("AuthContext: Starting login for:", username);
        
        // Викликаємо функцію з api/tmdbApi.ts
        const responseData = await loginUser({ login: username, password: pass });
        
        let userId: number;
        let userData: User;

        if (typeof responseData === 'object' && responseData !== null && 'user_id' in responseData) {
            userData = responseData as User;
            userId = userData.user_id;
        } else {
            userId = Number(responseData);
            userData = await getUserProfile(userId);
        }

        // ОНОВЛЕННЯ СТАНУ (це змусить Navbar перерендеритись миттєво)
        setUser(userData);
        
        // Використовуємо ЄДИНИЙ ключ для всього додатка
        localStorage.setItem('cinelink_user_id', String(userId));
        
        // ПІДКЛЮЧАЄМО СОКЕТИ МИТТЄВО
        RTClient.connect(userId);

    } catch (err: any) {
        console.error("AuthContext Error:", err);
        setError(err.message || "Login failed");
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