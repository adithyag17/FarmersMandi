import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, getCurrentUser, logout } from "../services/authService";

interface AuthContextType {
  isAuthenticated: boolean;
  user: Record<string, unknown> | null;
  loading: boolean;
  logout: () => void;
  setUser: (user: Record<string, unknown> | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  loading: true,
  logout: () => {},
  setUser: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for token expiration if not "remember me"
    const tokenExpiration = localStorage.getItem("tokenExpiration");
    if (tokenExpiration && new Date().getTime() > parseInt(tokenExpiration)) {
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
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate("/login");
  };

  const value = {
    isAuthenticated: !!user,
    user,
    loading,
    logout: handleLogout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
