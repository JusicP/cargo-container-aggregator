import React, {createContext, useContext, useState, useEffect, useMemo, type ReactNode} from 'react';
import { loginRequest, getUserInfo, refreshAccessToken } from "@/services/api/authImperative.ts";
import {privateAxiosInstance} from "@/services/axiosInstances.ts";

export type UserRole = 'guest' | 'user' | 'admin';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BANNED';
import {type User, type AuthContextType} from "@/contexts/contextInterfaces.ts"
import {tokenManager} from "@/contexts/tokenManager.ts";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
<<<<<<< HEAD
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
=======
        // on reload fetch user token from server cookie
        const { res } = await refreshAccessToken();
        if (res.access_token) {
          setAccessToken(res.access_token);
          privateAxiosInstance.defaults.headers.common["Authorization"] =
              `Bearer ${res.access_token}`;

>>>>>>> 7919c88 (feat: adding manager for the token subscription (auth context))
          const userData = await getUserInfo();
          setUser(userData);
        }
      } catch {
        setUser(null);
<<<<<<< HEAD
>>>>>>> 657cb92 (feat: adding custom hooks & modifying context)
=======
        setAccessToken(null);
>>>>>>> 7919c88 (feat: adding manager for the token subscription (auth context))
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  useEffect(() => {
    tokenManager.subscribe((token) => {
      console.log("[AuthProvider] token received from tokenManager:", token);
      setAccessToken(token);
    });
  }, []);

  useEffect(() => {
    console.log("[AuthProvider] pushing token to tokenManager:", accessToken);
    tokenManager.setToken(accessToken);
  }, [accessToken]);

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    delete privateAxiosInstance.defaults.headers.common["Authorization"];
  };

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    user,
    setUser,
    accessToken,
    setAccessToken,
    logout,
    isAuthenticated: !!accessToken,
    isLoading,
  }), [user, accessToken, isLoading]);

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
