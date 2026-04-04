import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getToken, getRole, clearAuth } from "../lib/api";

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  token: string | null;
  role: string | null;
  login: (token: string, role: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isAdmin: false,
  token: null,
  role: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(getToken());
  const [role, setRole] = useState<string | null>(getRole());

  const isAuthenticated = !!token;
  const isAdmin = role === "admin";

  function login(newToken: string, newRole: string) {
    localStorage.setItem("insure_gig_token", newToken);
    localStorage.setItem("insure_gig_role", newRole);
    setToken(newToken);
    setRole(newRole);
  }

  function logout() {
    clearAuth();
    setToken(null);
    setRole(null);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
