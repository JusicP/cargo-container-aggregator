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
        const res = await refreshAccessToken();
        console.log(res);
        const accessToken = res.acces_token;
        if (accessToken) {
          privateAxiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          const userData = await getUserInfo()
          setUser(userData);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setUser(null);
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
