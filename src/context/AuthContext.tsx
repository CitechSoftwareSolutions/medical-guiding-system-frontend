"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User, StudentSubscription, Notification } from "@/types";
import { api } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isMounted: boolean;
  role: string | null;
  isDoctor: boolean;
  isStudent: boolean;
  isAdmin: boolean;
  isOwner: boolean;
  activeSubscription: StudentSubscription | null;
  notifications: Notification[];
  unreadCount: number;
  login: (token: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [activeSubscription, setActiveSubscription] = useState<StudentSubscription | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const userRoles = user?.user_roles?.map((ur) => ur.role.name) || [];
  const isDoctor = userRoles.includes("Doctor");
  const isStudent = userRoles.includes("Student");
  const isAdmin = userRoles.includes("Admin");
  const isOwner = userRoles.includes("Owner");
  const role = userRoles[0] || null;

  const refreshNotifications = useCallback(async () => {
    try {
      if (typeof window !== "undefined" && localStorage.getItem("token")) {
        const notifs = await api.notifications.list();
        setNotifications(notifs);
      }
    } catch {
      // ignore
    }
  }, []);

  const refreshSubscription = useCallback(async () => {
    try {
      if (typeof window !== "undefined" && localStorage.getItem("token")) {
        const sub = await api.subscriptions.getMySubscription();
        setActiveSubscription(sub);
      }
    } catch {
      setActiveSubscription(null);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const savedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!savedToken) {
      setUser(null);
      setToken(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("med_user");
      }
      setIsLoading(false);
      return;
    }

    try {
      setToken(savedToken);
      const userData = await api.auth.getMe();
      setUser(userData);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("med_user", JSON.stringify(userData));
        } catch {}
      }
      setIsLoading(false);

      const roles = userData.user_roles?.map((ur) => ur.role.name) || [];
      const promises: Promise<any>[] = [refreshNotifications()];
      if (roles.includes("Student")) {
        promises.push(refreshSubscription());
      }
      Promise.allSettled(promises);
    } catch {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("med_user");
      }
      setUser(null);
      setToken(null);
      setIsLoading(false);
    }
  }, [refreshSubscription, refreshNotifications]);

  useEffect(() => {
    setIsMounted(true);
    const savedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const cachedUser = typeof window !== "undefined" ? localStorage.getItem("med_user") : null;

    if (savedToken) {
      setToken(savedToken);
      if (cachedUser) {
        try {
          setUser(JSON.parse(cachedUser));
        } catch {
          // ignore
        }
      }
      refreshUser();
    } else {
      setIsLoading(false);
    }
  }, [refreshUser]);

  const login = async (newToken: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", newToken);
    }
    setToken(newToken);
    await refreshUser();
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("med_user");
    }
    setToken(null);
    setUser(null);
    setActiveSubscription(null);
    setNotifications([]);
    window.location.href = "/login";
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isMounted,
        role,
        isDoctor,
        isStudent,
        isAdmin,
        isOwner,
        activeSubscription,
        notifications,
        unreadCount,
        login,
        logout,
        refreshUser,
        refreshSubscription,
        refreshNotifications,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
