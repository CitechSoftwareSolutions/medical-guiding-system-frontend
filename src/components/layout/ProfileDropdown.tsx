"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { CreditCard } from "lucide-react";

export const ProfileDropdown: React.FC = () => {
  const {
    user,
    isDoctor,
    isStudent,
    isOwner,
    activeSubscription,
  } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!user) return null;

  const userInitials = `${user.first_name?.[0] || "U"}${user.last_name?.[0] || ""}`.toUpperCase();

  const planName = isStudent
    ? activeSubscription?.plan?.name || "Free Starter"
    : isDoctor
    ? "Verified Physician"
    : isOwner
    ? "Platform Owner"
    : "System Admin";

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Top Navigation Capsule Trigger: Profile Photo + First Name Only */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User Profile Menu"
        className={`flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-2xl transition-all cursor-pointer border ${
          isOpen
            ? "bg-med-50 border-med-300 ring-2 ring-med-100 shadow-xs"
            : "bg-white hover:bg-slate-50 border-slate-200/80 hover:border-slate-300"
        }`}
      >
        {/* Profile Photo Avatar with Status Indicator */}
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-med-700 via-med-600 to-skyline-500 text-white font-black flex items-center justify-center text-xs shadow-sm ring-2 ring-white">
            {userInitials}
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
        </div>

        {/* First Name Only */}
        <span className="text-xs font-bold text-slate-800 leading-none">
          {user.first_name}
        </span>
      </button>

      {/* Pop-up Window: Attractive & Focused on Name, ID Number, and Plan Type */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-72 sm:w-76 bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden z-50 animate-in fade-in zoom-in-95">
          {/* Decorative Gradient Top Header */}
          <div className="h-16 bg-gradient-to-r from-navy-950 via-med-900 to-med-700 relative" />

          {/* Profile Card Body */}
          <div className="px-5 pb-5 -mt-8 flex flex-col items-center text-center space-y-3">
            {/* Profile Picture Avatar */}
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-med-700 via-med-600 to-skyline-500 text-white font-black text-xl flex items-center justify-center shadow-lg ring-4 ring-white">
                {userInitials}
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full ring-1 ring-emerald-300" />
            </div>

            {/* Main Topic: Full Name */}
            <div className="space-y-0.5">
              <h2 className="text-base font-black text-navy-900 tracking-tight">
                {isDoctor ? `Dr. ${user.first_name} ${user.last_name}` : `${user.first_name} ${user.last_name}`}
              </h2>
              <span className="text-[11px] font-bold text-slate-400 font-mono block">
                ID: #{user.id}
              </span>
            </div>

            {/* Plan Type Card */}
            <div className="w-full p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between">
              <div className="text-left space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Plan Type
                </span>
                <p className="text-xs font-black text-med-700 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-med-600" />
                  {planName}
                </p>
              </div>

              {isStudent && (
                <Link
                  href="/plans"
                  onClick={() => setIsOpen(false)}
                  className="text-[11px] font-bold text-med-600 hover:text-med-800 bg-white border border-slate-200 px-2.5 py-1 rounded-xl shadow-xs hover:border-med-300 transition-all"
                >
                  {activeSubscription ? "Manage" : "Upgrade"}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
