import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, name: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // 1. При завантаженні сайту перевіряємо, чи ми вже входили раніше
  useEffect(() => {
    const storedUser = localStorage.getItem('cinelink_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 2. Функція Входу
  const login = (email: string, name: string = "User") => {
    // Імітуємо вхід
    const newUser = { email, name };
    setUser(newUser);
    localStorage.setItem('cinelink_user', JSON.stringify(newUser)); // Зберігаємо в браузері
  };

  // 3. Функція Виходу
  const logout = () => {
    setUser(null);
    localStorage.removeItem('cinelink_user'); // Видаляємо з пам'яті
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
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