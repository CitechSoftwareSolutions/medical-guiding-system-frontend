"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useSidebar } from "@/context/SidebarContext";
import { api } from "@/lib/api";
import { NavigationItem } from "@/types";
import {
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  CreditCard,
  FileText,
  UserCheck,
  LogOut,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Activity,
} from "lucide-react";

interface SidebarLink {
  href: string;
  label: string;
  icon: React.ElementType;
}

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  CreditCard,
  FileText,
  UserCheck,
};

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { isDoctor, isAdmin, isOwner, logout } = useAuth();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [dbNavItems, setDbNavItems] = useState<NavigationItem[]>([]);

  const currentMenuType = isDoctor
    ? "sidebar_doctor"
    : isAdmin || isOwner
    ? "sidebar_admin"
    : "sidebar_student";

  const currentRole = isDoctor
    ? "doctor"
    : isAdmin || isOwner
    ? "admin"
    : "student";

  useEffect(() => {
    const fetchSidebarNav = async () => {
      try {
        const items = await api.navigation.list({
          menu_type: currentMenuType,
          target_role: currentRole,
        });
        if (items && items.length > 0) {
          setDbNavItems(items);
        }
      } catch {
        // Fallback to default links
      }
    };
    fetchSidebarNav();
  }, [currentMenuType, currentRole]);

  const defaultStudentLinks: SidebarLink[] = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/documents", label: "Resources", icon: BookOpen },
    { href: "/chat", label: "Clinical Guidance", icon: MessageSquare },
    { href: "/plans", label: "Plans", icon: CreditCard },
  ];

  const defaultDoctorLinks: SidebarLink[] = [
    { href: "/doctor/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/doctor/documents", label: "Documents", icon: FileText },
    { href: "/doctor/grant-access", label: "Student Access", icon: UserCheck },
    { href: "/plans", label: "Plans", icon: CreditCard },
  ];

  const defaultAdminLinks: SidebarLink[] = [
    { href: "/admin/users", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/audit-logs", label: "Audit Logs", icon: FileText },
    { href: "/doctor/documents", label: "Documents", icon: BookOpen },
    { href: "/doctor/grant-access", label: "Student Access", icon: UserCheck },
  ];

  const defaultLinks = isDoctor
    ? defaultDoctorLinks
    : isAdmin || isOwner
    ? defaultAdminLinks
    : defaultStudentLinks;

  // Ordered by display_order key from the database
  const links: SidebarLink[] =
    dbNavItems.length > 0
      ? [...dbNavItems]
          .sort((a, b) => a.display_order - b.display_order)
          .map((item) => ({
            href: item.path,
            label: item.title,
            icon: (item.icon && iconMap[item.icon]) || LayoutDashboard,
          }))
      : defaultLinks;

  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 z-50 bg-gradient-to-b from-med-950 via-[#0A1628] to-slate-950 border-r border-med-800/40 shadow-2xl text-slate-100 flex flex-col justify-between transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div
        className={`h-16 flex items-center border-b border-white/10 px-3.5 shrink-0 transition-all bg-med-950/80 backdrop-blur-md ${
          isCollapsed ? "justify-center" : "justify-between"
        }`}
      >
        {isCollapsed ? (
          <button
            type="button"
            onClick={toggleSidebar}
            title="Expand sidebar"
            className="group relative p-1.5 rounded-xl hover:bg-white/10 transition-all cursor-pointer flex items-center justify-center"
          >
            <div className="w-10 h-10 rounded-xl bg-med-600 flex items-center justify-center text-white shadow-xs group-hover:bg-med-700 transition-all">
              <Activity className="w-5 h-5 group-hover:hidden" />
              <PanelLeftOpen className="w-5 h-5 hidden group-hover:block text-white" />
            </div>
          </button>
        ) : (
          <>
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-med-600 flex items-center justify-center text-white shadow-xs group-hover:bg-med-700 transition-all">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <span className="text-base font-extrabold text-white tracking-tight flex items-center gap-0.5">
                  Med<span className="text-clinical-teal">Guidance</span>
                </span>
                <span className="flex items-center gap-1.5 text-[10px] text-teal-300 font-bold tracking-wider uppercase -mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-clinical-emerald animate-pulse-soft" />
                  Clinical Hub
                </span>
              </div>
            </Link>
            <button
              type="button"
              onClick={toggleSidebar}
              title="Minimize sidebar"
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer border border-transparent hover:border-white/10"
            >
              <PanelLeftClose className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Navigation Section */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {!isCollapsed && (
          <div className="px-2 pt-1 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Navigation
            </span>
          </div>
        )}

        <nav className="space-y-1.5">
          {links.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            if (isCollapsed) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    if (isCollapsed) {
                      toggleSidebar();
                    }
                  }}
                  title={item.label}
                  className="flex items-center justify-center w-full my-1"
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-clinical-teal to-med-600 text-white shadow-md"
                        : "text-slate-300 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </Link>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                  isActive
                    ? "bg-gradient-to-r from-clinical-teal to-med-600 text-white font-bold shadow-md shadow-med-950/40"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      isActive
                        ? "bg-white/20 text-white shadow-2xs"
                        : "bg-white/5 text-slate-300 group-hover:bg-white/15 group-hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-white shrink-0" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Role & Logout Section */}
      <div className={`p-3 border-t border-white/10 bg-[#070e1a]/90 space-y-2 shrink-0 ${isCollapsed ? "flex flex-col items-center" : ""}`}>
        {!isCollapsed && (
          <div className="px-3 py-2 rounded-xl bg-white/10 border border-white/15 shadow-2xs flex items-center justify-between text-xs text-white/90">
            <span className="font-bold truncate">
              {isDoctor ? "Doctor / Educator" : isAdmin ? "Administrator" : "Medical Student"}
            </span>
            <span
              className="w-2 h-2 rounded-full bg-clinical-emerald animate-pulse-soft shrink-0"
              title="Online"
            />
          </div>
        )}

        <button
          onClick={logout}
          title="Sign Out"
          className={`flex items-center ${
            isCollapsed ? "justify-center w-10 h-10" : "gap-2.5 px-3.5 py-2.5 w-full"
          } rounded-xl text-sm font-bold text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 transition-colors cursor-pointer`}
        >
          <LogOut className="w-4 h-4 text-rose-400 shrink-0" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

