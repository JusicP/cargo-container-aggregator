import React, {createContext, useContext, useState, useEffect, useMemo, type ReactNode} from 'react';
import { loginRequest, getUserInfo, refreshAccessToken } from "@/services/api/authImperative.ts";
import {privateAxiosInstance} from "@/services/axiosInstances.ts";

export type UserRole = 'guest' | 'user' | 'admin';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BANNED';
import {type User, type AuthContextType} from "@/contexts/contextInterfaces.ts"

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
<<<<<<< HEAD
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

=======
        const {res} = await refreshAccessToken();
        const accessToken = res.access_token;
        if (accessToken) {
          privateAxiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          const userData = await getUserInfo();
          setUser(userData);
        }
      } catch (err) {
        setUser(null);
>>>>>>> 657cb92 (feat: adding custom hooks & modifying context)
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    user,
    setUser,
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
