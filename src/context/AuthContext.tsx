import React, { createContext, useState, useCallback, useEffect } from 'react';
import { authAPI, setAuthToken, removeAuthToken, getAuthToken } from '../api/client';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signup: (userData: { name: string; email: string; phone: string; password: string }) => Promise<void>;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          const response = await authAPI.getMe();
          setUser(response);
        } catch (error) {
          removeAuthToken();
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const signup = useCallback(async (userData: { name: string; email: string; phone: string; password: string }) => {
    const response = await authAPI.signup(userData);
    setAuthToken(response.token);
    setUser(response.user);
  }, []);

  const login = useCallback(async (credentials: { email: string; password: string }) => {
    const response = await authAPI.login(credentials);
    setAuthToken(response.token);
    setUser(response.user);
  }, []);

  const logout = useCallback(() => {
    removeAuthToken();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, signup, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
