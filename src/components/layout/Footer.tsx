"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useSidebar } from "@/context/SidebarContext";
import { Activity, Shield, Sparkles, HeartPulse, GraduationCap, BookOpen, Stethoscope } from "lucide-react";

export const Footer: React.FC = () => {
  const pathname = usePathname();
  const { user, isMounted } = useAuth();
  const { isCollapsed } = useSidebar();

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

  return (
    <footer
      className={`w-full bg-gradient-to-b from-[#071324] via-med-950 to-[#030914] text-slate-300 border-t border-med-800/50 py-14 transition-all duration-300 ${
        isDashboardRoute ? (isCollapsed ? "md:pl-20" : "md:pl-64") : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Column */}
          <div className="space-y-4 sm:col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-med-600 flex items-center justify-center text-white shadow-xs group-hover:bg-med-700 transition-all">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-extrabold text-white tracking-tight flex items-center gap-0.5">
                  Med<span className="text-clinical-teal">Guidance</span>
                </span>
                <span className="flex items-center gap-1.5 text-[10px] text-teal-300 font-bold tracking-wider uppercase -mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-clinical-emerald animate-pulse-soft" />
                  Clinical Academic System
                </span>
              </div>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Authoritative clinical education platform for MBBS candidates and physician mentors. Verified high-yield study resources, curriculum guidance, and 24/7 diagnostic support.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-teal-400 font-semibold">
              <Shield className="w-4 h-4 text-clinical-teal shrink-0" />
              <span>Institutional Medical Standards</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-med-400" />
              <span>Learning Resources</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <Link href="/documents" className="hover:text-white hover:underline transition-colors flex items-center gap-1.5">
                  <HeartPulse className="w-3.5 h-3.5 text-slate-400" />
                  Anatomy & Physiology
                </Link>
              </li>
              <li>
                <Link href="/documents" className="hover:text-white hover:underline transition-colors flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-slate-400" />
                  Clinical Cardiology
                </Link>
              </li>
              <li>
                <Link href="/documents" className="hover:text-white hover:underline transition-colors flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 text-slate-400" />
                  Internal Medicine Notes
                </Link>
              </li>
              <li>
                <Link href="/chat" className="hover:text-white hover:underline transition-colors flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-clinical-teal" />
                  AI Clinical Consultation
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Roles */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-clinical-teal" />
              <span>Platform & Access</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <Link href="/plans" className="hover:text-white hover:underline transition-colors">
                  Student Subscription Plans
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white hover:underline transition-colors">
                  Physician Educator Signup
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white hover:underline transition-colors">
                  Mentee Workspace Sign In
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white hover:underline transition-colors">
                  Institutional Partnerships
                </Link>
              </li>
            </ul>
          </div>

          {/* Verification & Standards */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-clinical-emerald" />
              <span>Quality & Ethics</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Curriculums are verified by certified clinical specialists. Designed strictly for educational reference and clinical licensure preparation.
            </p>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-300 leading-normal">
              <span className="font-bold text-white">Clinical Note:</span> Educational guidance system for medical examinations and clinical training.
            </div>
          </div>
        </div>

        {/* Centered Copyright & Status */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} Medical Guidance System. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <Link href="/about" className="hover:text-white transition-colors">About System</Link>
            <span>•</span>
            <Link href="/services" className="hover:text-white transition-colors">Services</Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-white transition-colors">Contact Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
