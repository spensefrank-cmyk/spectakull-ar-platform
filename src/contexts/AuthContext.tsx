'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'pro' | 'enterprise';
  storageUsed: number;
  storageLimit: number;
  projectCount: number;
  projectLimit: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('spectakull_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('spectakull_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For demo purposes, accept any email/password combination
      // In a real app, this would validate against a backend
      const mockUser: User = {
        id: `user_${Date.now()}`,
        name: email.split('@')[0],
        email,
        plan: email.includes('enterprise') ? 'enterprise' : email.includes('pro') ? 'pro' : 'free',
        storageUsed: 150, // MB
        storageLimit: email.includes('enterprise') ? -1 : email.includes('pro') ? 10000 : 1000, // MB (-1 = unlimited)
        projectCount: 3,
        projectLimit: email.includes('enterprise') ? -1 : email.includes('pro') ? 100 : 10 // (-1 = unlimited)
      };

      setUser(mockUser);
      localStorage.setItem('spectakull_user', JSON.stringify(mockUser));
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For demo purposes, create a new user
      const newUser: User = {
        id: `user_${Date.now()}`,
        name,
        email,
        plan: 'free',
        storageUsed: 0,
        storageLimit: 1000, // 1GB for free accounts
        projectCount: 0,
        projectLimit: 10
      };

      setUser(newUser);
      localStorage.setItem('spectakull_user', JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('spectakull_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
