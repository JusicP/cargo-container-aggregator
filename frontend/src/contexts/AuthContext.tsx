import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

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
      const mockUserData = sessionStorage.getItem('mockUser');
      if (mockUserData) {
        const userData = JSON.parse(mockUserData);
        console.log('Loaded user from sessionStorage:', userData);
        setUser(userData);
        setIsLoading(false);
        return;
      }

      // ТИМЧАСОВО ЗАКОМЕНТОВАНО ДЛЯ MOCK ТЕСТУВАННЯ
        // Видаляємо старі дані з localStorage (міграція)
        // localStorage.removeItem('authToken');
        // localStorage.removeItem('userData');
        
        // console.log('checkAuth: making request to /user/me');
        
        // const response = await fetch(`${API_URL}/user/me`, {
        //   method: 'GET',
        //   credentials: 'include',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        // });

        // if (response.ok) {
        //   const data = await response.json();
        //   console.log('checkAuth: user data received', data);
        //   setUser(data);
        // } else {
        //   console.log('checkAuth: no user found');
        //   setUser(null);
        // }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
      console.log('checkAuth: finished');
    }
  };

  checkAuth();
}, []);

const login = async (email: string, password: string) => {
  try {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: 1,
      name: email.includes('admin') ? 'Admin User' : 'Test User',
      email,
      phone_number: '+380991112233',
      company_name: email.includes('admin') ? undefined : 'Test Company',
      role: email.includes('admin') ? 'admin' : 'user',
      registration_date: new Date().toISOString(),
      status: 'ACTIVE',
      avatar_photo_id: null,
    };
    
    console.log('Mock user created:', mockUser);
    // Зберігаємо в sessionStorage для тестування
    sessionStorage.setItem('mockUser', JSON.stringify(mockUser));
    setUser(mockUser);
    console.log('User set in context');
  } catch (error) {
    throw new Error('Помилка входу');
  } finally {
    setIsLoading(false);
  }
};

const logout = async () => {
  try {
    // Видаляємо з sessionStorage
    sessionStorage.removeItem('mockUser');
  } catch (error) {
    console.error('Logout failed:', error);
  } finally {
    setUser(null);
  }
};

  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true);
      
      // MOCK логіка для тестування
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        phone_number: userData.phone_number,
        company_name: userData.company_name,
        role: 'user',
        registration_date: new Date().toISOString(),
        status: 'ACTIVE',
        avatar_photo_id: null,
      };
      
      console.log('Mock user registered:', newUser);
      setUser(newUser);
    } catch (error) {
      throw new Error('Помилка реєстрації');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register
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