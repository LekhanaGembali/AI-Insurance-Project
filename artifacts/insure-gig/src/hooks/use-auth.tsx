import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "wouter";

type AuthContextType = {
  token: string | null;
  role: string | null;
  login: (token: string, role: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("insure_gig_token"));
  const [role, setRole] = useState<string | null>(() => localStorage.getItem("insure_gig_role"));
  const [, setLocation] = useLocation();

  const login = (newToken: string, newRole: string) => {
    localStorage.setItem("insure_gig_token", newToken);
    localStorage.setItem("insure_gig_role", newRole);
    setToken(newToken);
    setRole(newRole);
  };

  const logout = () => {
    localStorage.removeItem("insure_gig_token");
    localStorage.removeItem("insure_gig_role");
    setToken(null);
    setRole(null);
    setLocation("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        login,
        logout,
        isAuthenticated: !!token,
        isAdmin: role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
