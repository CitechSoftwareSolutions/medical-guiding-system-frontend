"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { StudentProfile } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  User,
  GraduationCap,
  CreditCard,
  Lock,
  CheckCircle2,
  AlertCircle,
  Building,
  Globe,
  Mail,
  Calendar,
  ShieldCheck,
  LogOut,
  Sparkles,
  KeyRound,
  Check,
  Camera,
  Upload,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

type TabType = "overview" | "academic" | "subscription" | "security";

export default function ProfilePage() {
  const { user, activeSubscription, refreshUser, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<TabType>("overview");

  // File Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // User details state (editable)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isUpdatingDetails, setIsUpdatingDetails] = useState(false);
  const [detailsMsg, setDetailsMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Academic Profile State
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [university, setUniversity] = useState("");
  const [batch, setBatch] = useState("");
  const [year, setYear] = useState("");
  const [country, setCountry] = useState("");

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Password Change State
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [passMsg, setPassMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || "");
      setLastName(user.last_name || "");
    }
  }, [user]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const prof = await api.students.getMeProfile();
        setStudentProfile(prof);
        setUniversity(prof.university || "");
        setBatch(prof.batch || "");
        setYear(prof.year || "");
        setCountry(prof.country || "");
      } catch (err) {
        console.error("Error fetching student profile:", err);
      }
    };
    fetchProfile();
  }, []);

  // Handle direct file upload to backend and DB
  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setDetailsMsg({ text: "Profile picture size should be under 5MB.", type: "error" });
      return;
    }

    setIsUploadingAvatar(true);
    setDetailsMsg(null);

    try {
      await api.auth.uploadAvatar(file);
      await refreshUser();
      setDetailsMsg({ text: "Profile picture uploaded and saved to database successfully!", type: "success" });
    } catch (err: any) {
      setDetailsMsg({ text: err.message || "Failed to upload profile picture", type: "error" });
    } finally {
      setIsUploadingAvatar(false);
      if (e.target) e.target.value = "";
    }
  };

  // Update First Name, Last Name, and Medical University from Overview Tab
  const handleUpdatePersonalDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingDetails(true);
    setDetailsMsg(null);

    try {
      await api.auth.updateMe({
        first_name: firstName,
        last_name: lastName,
      });

      if (studentProfile) {
        await api.students.updateProfile(studentProfile.id, {
          university,
          batch,
          year,
          country,
        });
      }

      await refreshUser();
      setDetailsMsg({ text: "Personal and university details updated successfully!", type: "success" });
    } catch (err: any) {
      setDetailsMsg({ text: err.message || "Failed to update details", type: "error" });
    } finally {
      setIsUpdatingDetails(false);
    }
  };

  // Update Full Academic Profile from Academic Tab
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentProfile) return;
    setIsUpdatingProfile(true);
    setProfileMsg(null);

    try {
      await api.students.updateProfile(studentProfile.id, {
        university,
        batch,
        year,
        country,
      });
      setProfileMsg({ text: "Academic profile updated successfully!", type: "success" });
      await refreshUser();
    } catch (err: any) {
      setProfileMsg({ text: err.message || "Failed to update profile", type: "error" });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg(null);

    if (newPassword.length < 8) {
      setPassMsg({ text: "New password must be at least 8 characters.", type: "error" });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassMsg({ text: "New password and confirmation do not match.", type: "error" });
      return;
    }

    setIsChangingPass(true);

    try {
      await api.auth.changePassword({
        old_password: oldPassword,
        new_password: newPassword,
      });
      setPassMsg({ text: "Password changed successfully!", type: "success" });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPassMsg({ text: err.message || "Failed to change password", type: "error" });
    } finally {
      setIsChangingPass(false);
    }
  };

  const userInitials = `${user?.first_name?.[0] || "U"}${user?.last_name?.[0] || ""}`.toUpperCase();
  const currentPlan = activeSubscription?.plan;
  const planName = currentPlan?.name || "Free Starter";

  const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview & Details", icon: User },
    { id: "academic", label: "Academic Profile", icon: GraduationCap },
    { id: "subscription", label: "Plan & Subscription", icon: CreditCard },
    { id: "security", label: "Security & Password", icon: Lock },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Hidden Global File Input for Avatar Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarFileChange}
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
      />

      {/* 1. Hero Profile Header: Cover banner, Avatar, Name, Role, Uni (if added), Country (if added) with CLEAR VERTICAL GAP */}
      <div className="relative rounded-3xl overflow-hidden bg-white border border-slate-200/90 shadow-sm">
        {/* Top Decorative Cover Image Banner */}
        <div className="h-36 sm:h-44 bg-gradient-to-r from-navy-950 via-med-900 to-med-700 relative" />

        {/* Profile Header Content Area */}
        <div className="px-6 pb-6 pt-0 sm:px-8">
          {/* Avatar Row (overlapping banner) */}
          <div className="relative -mt-16 sm:-mt-20 mb-2 flex items-end">
            <div className="relative shrink-0 group">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden bg-gradient-to-tr from-med-700 via-med-600 to-skyline-500 text-white font-black text-3xl sm:text-4xl flex items-center justify-center shadow-xl ring-4 ring-white relative">
                {isUploadingAvatar ? (
                  <div className="w-8 h-8 border-3 border-white/40 border-t-white rounded-full animate-spin" />
                ) : user?.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={`${user.first_name} ${user.last_name}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  userInitials
                )}

                {/* Hover camera upload overlay */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                  title="Upload profile picture"
                  className="absolute inset-0 bg-navy-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer"
                >
                  <Camera className="w-6 h-6 mb-1 text-white" />
                  <span className="text-[10px] font-bold tracking-wide">Upload Photo</span>
                </button>
              </div>

              <span
                className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full ring-2 ring-emerald-200"
                title="Active"
              />
            </div>
          </div>

          {/* Explicit generous vertical gap between cover image banner and name */}
          <div className="mt-4 sm:mt-5 space-y-1.5 pb-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {user?.first_name} {user?.last_name}
              </h1>
              <span
                className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-med-50 text-med-600 border border-med-200"
                title="Verified Student Member"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary" size="sm">
                <GraduationCap className="w-3.5 h-3.5 mr-1" />
                Medical Student
              </Badge>

              {university ? (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-600 font-medium">
                    {university}
                  </span>
                </>
              ) : null}

              {country ? (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-600 font-medium">
                    {country}
                  </span>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Sub Tabs Navigation Bar */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100/90 backdrop-blur-sm rounded-2xl border border-slate-200/80 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-white text-med-700 shadow-sm border border-slate-200/80"
                  : "text-slate-600 hover:text-navy-900 hover:bg-white/60"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-med-600" : "text-slate-400"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Sub Tabs Content */}

      {/* TAB 1: OVERVIEW & DETAILS */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Card 1: Single Unified Card containing Student ID, Account Role, Account Status, Batch / Cohort, and Registration Date */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-med-600" />
                <h3 className="text-sm font-bold text-navy-900">Student Account & Status</h3>
              </div>
              <span className="text-[11px] text-slate-400">Account Classification</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 pt-1">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Student ID
                </span>
                <p className="text-base font-mono font-bold text-med-700">#{user?.id}</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Account Role
                </span>
                <p className="text-base font-bold text-navy-900">Medical Student</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Account Status
                </span>
                <div className="flex items-center gap-1.5 pt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-sm font-bold text-emerald-700">Active & Verified</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Batch / Cohort
                </span>
                <p className="text-base font-bold text-navy-900">{batch || "Not configured"}</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Registration Date
                </span>
                <p className="text-base font-bold text-navy-900">
                  {user?.created_at ? formatDate(user.created_at) : "Recently"}
                </p>
              </div>
            </div>
          </Card>

          {/* Card 2: Editable Personal & Academic Details (First Name, Last Name, Medical University) */}
          <Card className="p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-med-600" />
                <div>
                  <h3 className="text-sm font-bold text-navy-900">Personal & University Details</h3>
                  <p className="text-[11px] text-slate-400">Update your student name and medical institution</p>
                </div>
              </div>
            </div>

            {detailsMsg && (
              <div
                className={`p-3 rounded-xl flex items-center gap-2 text-xs ${
                  detailsMsg.type === "success"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-rose-50 text-rose-700 border border-rose-200"
                }`}
              >
                {detailsMsg.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                <span>{detailsMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleUpdatePersonalDetails} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  placeholder="Enter first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <Input
                  label="Last Name"
                  placeholder="Enter last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>

              <Input
                label="Medical University"
                placeholder="e.g. Faculty of Medicine, University of Colombo"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                icon={<Building className="w-4 h-4" />}
              />

              <div className="pt-2 flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isUpdatingDetails}
                  className="font-bold shadow-sm"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* TAB 2: ACADEMIC PROFILE */}
      {activeTab === "academic" && (
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-med-600" />
              <div>
                <h3 className="text-sm font-bold text-navy-900">Academic & Educational Credentials</h3>
                <p className="text-[11px] text-slate-400">
                  Keep your medical university, cohort, and study progression up to date.
                </p>
              </div>
            </div>
          </div>

          {profileMsg && (
            <div
              className={`p-3 rounded-xl flex items-center gap-2 text-xs ${
                profileMsg.type === "success"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-rose-50 text-rose-700 border border-rose-200"
              }`}
            >
              {profileMsg.type === "success" ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <span>{profileMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <Input
              label="Medical University / Teaching Hospital"
              placeholder="e.g. Faculty of Medicine, University of Colombo"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              icon={<Building className="w-4 h-4" />}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Batch / Cohort Number"
                placeholder="e.g. Batch 34 / Class of 2026"
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
              />
              <Input
                label="Academic Year"
                placeholder="e.g. Final Year MBBS / 4th Year MD"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>

            <Input
              label="Country of Study"
              placeholder="e.g. Sri Lanka"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              icon={<Globe className="w-4 h-4" />}
            />

            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isUpdatingProfile}
                className="font-bold shadow-sm"
              >
                Save Academic Profile
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* TAB 3: PLAN & SUBSCRIPTION */}
      {activeTab === "subscription" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Current Active Plan Card */}
            <Card className="p-6 space-y-5 lg:col-span-1 bg-gradient-to-b from-white to-blue-50/30 border-med-200/70 shadow-xs flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-med-600" />
                    <h3 className="text-sm font-bold text-navy-900">Active Membership</h3>
                  </div>
                  <Badge variant={activeSubscription ? "success" : "free"}>
                    {activeSubscription ? "Active" : "Free Tier"}
                  </Badge>
                </div>

                <div className="p-4 bg-white border border-med-200/80 rounded-2xl shadow-xs space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Current Tier
                    </span>
                    <p className="text-xl font-black text-navy-900 leading-snug">
                      {planName}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Billing Duration:</span>
                      <span className="font-semibold text-slate-800">
                        {activeSubscription ? `${currentPlan?.duration_days || 30} Days` : "Standard Access"}
                      </span>
                    </div>

                    {activeSubscription && (
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Renewal Date:</span>
                        <span className="font-semibold text-emerald-600">
                          {formatDate(activeSubscription.end_date)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  <Link href="/plans">
                    <Button variant="primary" size="md" className="w-full font-bold shadow-sm gap-1.5">
                      <CreditCard className="w-4 h-4" />
                      {activeSubscription ? "Switch / Extend Plan" : "Upgrade to Pro"}
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            {/* Plan Entitlements & Privileges */}
            <Card className="p-6 lg:col-span-2 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-med-600" />
                  <h3 className="text-sm font-bold text-navy-900">Membership Privileges & Entitlements</h3>
                </div>
                <span className="text-[11px] text-slate-400">Included in your tier</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/70 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-navy-900">Clinical Library Access</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Full access to published clinical guides, anatomy diagrams, and study notes.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/70 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-navy-900">Diagnostic Consultations</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Interactive clinical reasoning simulations and pathology differential breakdowns.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/70 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-navy-900">Doctor Mentee Authorizations</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Receive specialized clinical notes directly authorized by consultant mentors.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/70 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-navy-900">Exam Preparation Guides</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      High-yield clinical summaries for final-year MBBS and clinical board exams.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-med-50/60 border border-med-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-med-900">Need more features or team access?</h4>
                  <p className="text-[11px] text-med-700">Explore our Pro and Annual tiers with expanded privileges.</p>
                </div>
                <Link href="/plans">
                  <Button variant="primary" size="sm" className="font-bold shrink-0">
                    View All Plans
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 4: SECURITY & PASSWORD */}
      {activeTab === "security" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Lock className="w-5 h-5 text-med-600" />
              <div>
                <h3 className="text-sm font-bold text-navy-900">Change Password</h3>
                <p className="text-[11px] text-slate-400">
                  Ensure your account is protected with a secure, BCrypt-encrypted password.
                </p>
              </div>
            </div>

            {passMsg && (
              <div
                className={`p-3 rounded-xl flex items-center gap-2 text-xs ${
                  passMsg.type === "success"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-rose-50 text-rose-700 border border-rose-200"
                }`}
              >
                {passMsg.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                <span>{passMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                placeholder="••••••••••••"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                icon={<KeyRound className="w-4 h-4" />}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="New Password"
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  icon={<Lock className="w-4 h-4" />}
                  required
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  icon={<Lock className="w-4 h-4" />}
                  required
                />
              </div>

              <div className="pt-2 flex justify-start">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isChangingPass}
                  className="font-bold shadow-sm"
                >
                  Update Password
                </Button>
              </div>
            </form>
          </Card>

          {/* Security Overview & Sign Out */}
          <Card className="p-6 space-y-5 lg:col-span-1 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-navy-900">Account Protection</h3>
              </div>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800">BCrypt Password Hashing</span>
                    <p className="text-[11px] text-slate-500">Industry standard cryptographic security.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800">JWT Token Session</span>
                    <p className="text-[11px] text-slate-500">Secure stateless authentication tokens.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Session Control
              </span>
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={logout}
                className="w-full font-bold text-rose-600 border-rose-200 hover:bg-rose-50 gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out of System
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
