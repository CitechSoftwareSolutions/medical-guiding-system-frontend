"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";
import { Sidebar } from "@/components/layout/Sidebar";

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isMounted } = useAuth();
  const { isCollapsed } = useSidebar();
  const router = useRouter();

  useEffect(() => {
    if (isMounted && !isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, isMounted, router]);

  if (!isMounted || (isLoading && !user)) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-med-200 border-t-med-600 rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Loading Medical Workspace...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-[calc(100vh-4rem)] relative bg-slate-100/90">
      {/* Attractive Hospital & Clinical Center Ambient Image Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <img
          src="/images/medical-lab-bg.jpg"
          alt=""
          className="w-full h-full object-cover object-center opacity-[0.08] mix-blend-multiply filter blur-[0.5px]"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100/90 via-slate-50/70 to-med-50/30" />
      </div>

      <Sidebar />
      <main
        className={`relative z-10 transition-all duration-300 ${
          isCollapsed ? "ml-20" : "ml-64"
        } p-6 md:p-8 max-w-7xl overflow-x-hidden min-h-[calc(100vh-4rem)]`}
      >
        {children}
      </main>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayoutContent>{children}</DashboardLayoutContent>;
}
