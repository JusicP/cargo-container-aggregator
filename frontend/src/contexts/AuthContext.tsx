import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {getUserInfo} from "@/services/api/auth.ts";

// Типи користувачів
export type UserRole = 'guest' | 'user' | 'admin';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BANNED';

export interface User {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  company_name?: string;
  role: UserRole;
  registration_date: string;
  status: UserStatus;
  avatar_photo_id?: number | null;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone_number: string;
  company_name?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  console.log('AuthProvider render:', { user, isLoading });

// Перевірка авторизації при завантаженні додатка
useEffect(() => {
  const checkAuth = async () => {
    try {
      // Для тестування: перевіряємо sessionStorage
      const userData = await getUserInfo();
      if (userData) {
        setUser(userData);
        setIsLoading(false);
        return;
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
      console.log('checkAuth: finished');
    }
  };

  checkAuth();
}, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading
      }}
    >
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