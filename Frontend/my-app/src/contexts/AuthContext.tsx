import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, getCurrentUser, logout } from "../services/authService";

// Define a proper user type instead of using Record<string, unknown>
interface User {
  id?: string | number;
  [key: string]: any; // Allow for additional properties
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  logout: () => void;
  setUser: (user: User | null) => void;
}

// Default context value
const defaultContextValue: AuthContextType = {
  isAuthenticated: false,
  user: null,
  loading: true,
  logout: () => {},
  setUser: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultContextValue);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = () => {
      // Check for token expiration if not "remember me"
      const tokenExpiration = localStorage.getItem("tokenExpiration");
      if (
        tokenExpiration &&
        new Date().getTime() > parseInt(tokenExpiration, 10)
      ) {
        // Token expired, log out user
        handleLogout();
        return;
      }

      // Load user from localStorage
      const savedUser = getCurrentUser();
      const token = getToken();

      if (savedUser && token) {
        setUser(savedUser);
      }

      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate("/login");
  };

  const value: AuthContextType = {
    isAuthenticated: !!user,
    user,
    loading,
    logout: handleLogout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
