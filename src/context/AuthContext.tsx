"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, findUserByEmail, addUser } from "../lib/db";

interface AuthContextType {
  user: User | null;
  isLoaded: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("currentUser");
      }
    }
    setIsLoaded(true);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const foundUser = await findUserByEmail(email);

      if (!foundUser) {
        return { success: false, error: "Użytkownik nie istnieje" };
      }

      if (foundUser.password !== password) {
        return { success: false, error: "Nieprawidłowe hasło" };
      }

      setUser(foundUser);
      localStorage.setItem("currentUser", JSON.stringify(foundUser));
      return { success: true };
    } catch {
      return { success: false, error: "Błąd podczas logowania" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    try {
      const existingUser = await findUserByEmail(email);

      if (existingUser) {
        return { success: false, error: "Użytkownik o tym emailu już istnieje" };
      }

      const newUser: User = {
        id: `u${Date.now()}`,
        firstName,
        lastName,
        email,
        password,
      };

      await addUser(newUser);
      setUser(newUser);
      localStorage.setItem("currentUser", JSON.stringify(newUser));
      return { success: true };
    } catch {
      return { success: false, error: "Błąd podczas rejestracji" };
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoaded, login, logout, register }}>
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
