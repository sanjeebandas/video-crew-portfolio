import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { getToken, setToken, removeToken } from "../utils/helpers";
import api from "../services/api";

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
  validateToken: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Validate token with backend
  const validateToken = async (): Promise<boolean> => {
    try {
      const token = getToken();
      if (!token) return false;

      // Call backend to validate token
      await api.get("/auth/validate", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return true;
    } catch (error) {
      // Token is invalid or expired
      logout();
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getToken();
      if (token) {
        const isValid = await validateToken();
        setIsAuthenticated(isValid);
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (token: string) => {
    setToken(token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    removeToken();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout, validateToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
