"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

export interface User {
  username: string;
  name: string;
  email: string;
  avatar: string;
  plan: string;
}

const MOCK_USERS: Record<string, { password: string; user: User }> = {
  yash: {
    password: "test@123",
    user: {
      username: "yash",
      name: "Yash",
      email: "yash@traveloop.ai",
      avatar: "https://i.pravatar.cc/150?img=11",
      plan: "Pro Plan",
    },
  },
  yash01: {
    password: "test@123",
    user: {
      username: "yash01",
      name: "Yash 01",
      email: "yash01@traveloop.ai",
      avatar: "https://i.pravatar.cc/150?img=15",
      plan: "Free Plan",
    },
  },
  yash02: {
    password: "test@123",
    user: {
      username: "yash02",
      name: "Yash 02",
      email: "yash02@traveloop.ai",
      avatar: "https://i.pravatar.cc/150?img=22",
      plan: "Free Plan",
    },
  },
  yash03: {
    password: "test@123",
    user: {
      username: "yash03",
      name: "Yash 03",
      email: "yash03@traveloop.ai",
      avatar: "https://i.pravatar.cc/150?img=33",
      plan: "Free Plan",
    },
  },
};

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => false,
  logout: () => {},
  updateUser: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Restore from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("traveloop_user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const entry = MOCK_USERS[username.toLowerCase()];
    if (entry && entry.password === password) {
      setUser(entry.user);
      localStorage.setItem("traveloop_user", JSON.stringify(entry.user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("traveloop_user");
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem("traveloop_user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
