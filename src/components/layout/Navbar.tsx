"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useSidebar } from "@/context/SidebarContext";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";
import { api } from "@/lib/api";
import { NavigationItem } from "@/types";
import {
  Activity,
  Home,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isDoctor, isAdmin, isOwner, isMounted, logout } = useAuth();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navItems, setNavItems] = useState<NavigationItem[]>([]);

  const dashboardPath = isDoctor
    ? "/doctor/dashboard"
    : isAdmin || isOwner
    ? "/admin/users"
    : "/dashboard";

  useEffect(() => {
    const fetchNav = async () => {
      try {
        const items = await api.navigation.list({ menu_type: "top_navbar" });
        if (items && items.length > 0) {
          setNavItems(items);
        }
      } catch {
        // Fallback default navigation
      }
    };
    fetchNav();
  }, []);

  const defaultLinks = [
    { title: "Home", path: "/" },
    { title: "About", path: "/about" },
    { title: "Services", path: "/services" },
    { title: "Contact", path: "/contact" },
  ];

  const activeLinks = navItems.length > 0 ? navItems : defaultLinks;

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
  if (isAuthPage) return null;

  const isDashboardRoute =
    isMounted &&
    (pathname.startsWith("/dashboard") ||
      pathname.startsWith("/doctor") ||
      pathname.startsWith("/admin") ||
      pathname === "/documents" ||
      pathname === "/chat" ||
      pathname === "/plans" ||
      pathname === "/profile" ||
      pathname === "/notifications") &&
    !!user;

  const isPublicHeroPage =
    pathname === "/" ||
    pathname === "/about" ||
    pathname === "/services" ||
    pathname === "/contact";

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isPublicHeroPage
          ? "border-b border-white/10 bg-med-950/25 backdrop-blur-sm text-white shadow-md"
          : "border-b border-med-800/40 bg-gradient-to-r from-med-950 via-[#0B1A30] to-med-900 backdrop-blur-xl text-white shadow-md"
      } ${isDashboardRoute ? (isCollapsed ? "pl-20" : "pl-64") : ""}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Navigation: Brand, Sidebar Toggle, & Menu Links */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Show Brand Logo on Public routes */}
            {!isDashboardRoute && (
              <Link href="/" className="flex items-center gap-2 group mr-2">
                <div className="w-9 h-9 rounded-xl bg-med-600 flex items-center justify-center text-white shadow-xs group-hover:bg-med-700 transition-all">
                  <Activity className="w-5 h-5" />
                </div>
                <span className="text-base sm:text-lg font-extrabold tracking-tight hidden md:inline text-white">
                  Med<span className="text-clinical-teal">Guidance</span>
                </span>
              </Link>
            )}

            {/* Unified Top Bar Menu Links: Home, About, Services, Contact */}
            <nav className="hidden sm:flex items-center gap-1">
              {activeLinks.map((link) => {
                const isActive = link.path === "/" ? pathname === "/" : pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "text-white bg-white/20 font-bold border border-white/25 shadow-xs"
                        : "text-slate-200 hover:text-white hover:bg-white/15 hover:shadow-2xs"
                    }`}
                  >
                    {link.title}
                  </Link>
                );
              })}
            </nav>
          </div>


          {/* Right Action Icons & Direct Profile Page Link */}
          <div className="hidden md:flex items-center gap-3">
            {isMounted && user ? (
              <div className="flex items-center gap-3">
                {/* Interactive Notification Popover (Fixed: No Redirect) */}
                <NotificationDropdown isDark={true} />

                {/* Direct Link to Full Profile Page (Profile Photo + First Name) */}
                <Link
                  href={isDoctor ? "/doctor/profile" : "/profile"}
                  className="flex items-center gap-2 p-1 pl-1.5 pr-3 rounded-2xl transition-all border border-white/20 hover:border-white/30 bg-white/10 hover:bg-white/15 text-white shadow-2xs group cursor-pointer"
                  title="View Full Profile Page"
                >
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-med-700 text-white font-bold flex items-center justify-center text-xs shadow-2xs ring-2 ring-white/30 group-hover:bg-med-800 transition-colors">
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt={user.first_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        `${user.first_name?.[0]?.toUpperCase() || "U"}${user.last_name?.[0]?.toUpperCase() || ""}`
                      )}
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-clinical-emerald border-2 border-slate-900 rounded-full" />
                  </div>
                  <span className="text-sm font-bold leading-none text-white group-hover:text-clinical-teal transition-colors">
                    {user.first_name}
                  </span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/10 hover:text-white text-sm font-bold"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    variant="primary"
                    size="sm"
                    className="bg-clinical-teal hover:bg-clinical-teal/90 text-white font-bold text-sm border-0 shadow-md"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-white hover:text-white/80"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-med-950/98 backdrop-blur-xl text-white px-4 pt-3 pb-6 space-y-3 shadow-2xl">
          {(!isMounted || !user) ? (
            <>
              <Link
                href="/"
                className="block px-3 py-2 rounded-lg text-sm font-medium text-white hover:bg-white/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 rounded-lg text-sm font-medium text-white hover:bg-white/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/services"
                className="block px-3 py-2 rounded-lg text-sm font-medium text-white hover:bg-white/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 rounded-lg text-sm font-medium text-white hover:bg-white/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="pt-2 flex flex-col gap-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full bg-clinical-teal text-white border-0">
                    Get Started
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="space-y-1">
              {isDashboardRoute ? (
                <Link
                  href="/"
                  className="block px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 text-white hover:bg-white/10"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Home className="w-4 h-4 text-slate-300" />
                  <span>Home</span>
                </Link>
              ) : (
                <Link
                  href={dashboardPath}
                  className="block px-3 py-2 rounded-lg text-sm font-bold text-white bg-clinical-teal hover:bg-clinical-teal/90 flex items-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LayoutDashboard className="w-4 h-4 text-white" />
                  <span>Dashboard</span>
                </Link>
              )}
            </div>
          )}

          <div className="pt-4 border-t border-white/10">
            {isMounted && user ? (
              <div className="space-y-2">
                <Link
                  href={isDoctor ? "/doctor/profile" : "/profile"}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-white hover:bg-white/10"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Profile ({user.first_name} {user.last_name})
                </Link>
                <Button variant="outline" size="md" className="w-full text-rose-400 border-white/20 hover:bg-white/10" onClick={logout}>
                  Sign Out
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </header>
  );
};
