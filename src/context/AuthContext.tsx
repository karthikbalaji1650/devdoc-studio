import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthContextType } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock database of users
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'admin@doccraft.com': {
    password: 'admin123',
    user: {
      id: '1',
      username: 'admin',
      email: 'admin@doccraft.com',
      role: 'admin',
    },
  },
  'user@doccraft.com': {
    password: 'user123',
    user: {
      id: '2',
      username: 'user',
      email: 'user@doccraft.com',
      role: 'user',
    },
  },
};

const AUTH_STORAGE_KEY = 'doccraft_auth_user_v1';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to load saved user', e);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const userRecord = MOCK_USERS[email];

    if (!userRecord || userRecord.password !== password) {
      setIsLoading(false);
      throw new Error('Invalid email or password');
    }

    const loggedInUser = userRecord.user;
    setUser(loggedInUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(loggedInUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const getAllUsers = (): User[] => {
    return Object.values(MOCK_USERS).map(record => record.user);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    setUser,
    getAllUsers,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
