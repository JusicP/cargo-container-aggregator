import React, {createContext, useContext, useState, useEffect, useMemo, type ReactNode} from 'react';
import { getUserInfo, refreshAccessToken } from "@/services/api/auth.ts";
import {privateAxiosInstance} from "@/services/axiosInstances.ts";

export type UserRole = 'guest' | 'user' | 'admin';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BANNED';
import {type User, type AuthContextType} from "@/contexts/contextInterfaces.ts"

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!user) {
          const userData = await getUserInfo();
          if (userData) {
            setUser(userData);
          }
        }
      } catch (err) {
        try {
          refreshAccessToken();
        } catch (err) {
          setUser(null);
        }

        const userData = await getUserInfo();
        if (userData) {
          setUser(userData);
        }

      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    isLoading,
  }), [user, isLoading]);

  return (
      <AuthContext.Provider value={contextValue}>
        {children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
