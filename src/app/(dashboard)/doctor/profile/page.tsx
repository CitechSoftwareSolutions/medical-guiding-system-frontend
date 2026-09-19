"use client";

import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { DoctorProfile } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  User,
  Stethoscope,
  Award,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Mail,
  Calendar,
  CreditCard,
  LogOut,
  Lock,
  KeyRound,
  ShieldCheck,
  Camera,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

type DoctorTabType = "overview" | "credentials" | "security";

export default function DoctorProfilePage() {
  const { user, refreshUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<DoctorTabType>("overview");
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(null);

  // File Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Personal editable details
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isUpdatingPersonal, setIsUpdatingPersonal] = useState(false);
  const [personalMsg, setPersonalMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Clinical Credentials State
  const [licenseNumber, setLicenseNumber] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [qualification, setQualification] = useState("");
  const [experienceYears, setExperienceYears] = useState<number>(0);
  const [bio, setBio] = useState("");

  const [isUpdating, setIsUpdating] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; type: "success" | "error" } | null>(null);

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
        const prof = await api.doctors.getMeProfile();
        setDoctorProfile(prof);
        setLicenseNumber(prof.license_number || "");
        setSpecialization(prof.specialization || "");
        setQualification(prof.qualification || "");
        setExperienceYears(prof.experience_years || 0);
        setBio(prof.bio || "");
      } catch (err) {
        console.error("Error fetching doctor profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setPersonalMsg({ text: "Profile picture size should be under 5MB.", type: "error" });
      return;
    }

    setIsUploadingAvatar(true);
    setPersonalMsg(null);

    try {
      await api.auth.uploadAvatar(file);
      await refreshUser();
      setPersonalMsg({ text: "Profile picture uploaded and saved successfully!", type: "success" });
    } catch (err: any) {
      setPersonalMsg({ text: err.message || "Failed to upload profile picture", type: "error" });
    } finally {
      setIsUploadingAvatar(false);
      if (e.target) e.target.value = "";
    }
  };

  const handleUpdatePersonal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingPersonal(true);
    setPersonalMsg(null);

    try {
      await api.auth.updateMe({
        first_name: firstName,
        last_name: lastName,
      });
      if (doctorProfile) {
        await api.doctors.updateProfile(doctorProfile.id, {
          specialization,
          license_number: licenseNumber,
          qualification,
          experience_years: experienceYears,
          bio,
        });
      }
      await refreshUser();
      setPersonalMsg({ text: "Personal details updated successfully!", type: "success" });
    } catch (err: any) {
      setPersonalMsg({ text: err.message || "Failed to update details", type: "error" });
    } finally {
      setIsUpdatingPersonal(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorProfile) return;
    setIsUpdating(true);
    setFeedback(null);

    try {
      await api.doctors.updateProfile(doctorProfile.id, {
        license_number: licenseNumber,
        specialization,
        qualification,
        experience_years: experienceYears,
        bio,
      });
      setFeedback({ text: "Doctor credentials updated successfully!", type: "success" });
      await refreshUser();
    } catch (err: any) {
      setFeedback({ text: err.message || "Failed to update profile", type: "error" });
    } finally {
      setIsUpdating(false);
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

  const userInitials = `${user?.first_name?.[0] || "D"}${user?.last_name?.[0] || "R"}`.toUpperCase();

  const tabs: { id: DoctorTabType; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview & Details", icon: User },
    { id: "credentials", label: "Clinical Credentials", icon: Award },
    { id: "security", label: "Security & Password", icon: Lock },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarFileChange}
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
      />

      {/* 1. Hero Profile Header with Clear Vertical Gap and Avatar Display */}
      <div className="relative rounded-3xl overflow-hidden bg-white border border-slate-200/90 shadow-sm">
        {/* Top Decorative Cover Image Banner */}
        <div className="h-36 sm:h-44 bg-gradient-to-r from-navy-950 via-med-900 to-med-700 relative" />

        {/* Profile Card Content Area */}
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
                    alt={`Dr. ${user.first_name} ${user.last_name}`}
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
                title="Verified Educator"
              />
            </div>
          </div>

          {/* Generous vertical gap between cover banner and doctor name */}
          <div className="mt-4 sm:mt-5 space-y-1.5 pb-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Dr. {user?.first_name} {user?.last_name}
              </h1>
              <span
                className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200"
                title="Verified Clinical Educator"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary" size="sm">
                <Stethoscope className="w-3.5 h-3.5 mr-1" />
                Doctor & Clinical Educator
              </Badge>

              {specialization && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-600 font-medium">
                    {specialization}
                  </span>
                </>
              )}

              {licenseNumber && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-500 font-mono">
                    {licenseNumber}
                  </span>
                </>
              )}
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
          {/* Card 1: Single Unified Card for Doctor Account & Status */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-med-600" />
                <h3 className="text-sm font-bold text-navy-900">Doctor Account & Status</h3>
              </div>
              <span className="text-[11px] text-slate-400">Clinical Classification</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 pt-1">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Doctor ID</span>
                <p className="text-base font-mono font-bold text-med-700">#{user?.id}</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Clinical Role</span>
                <p className="text-base font-bold text-navy-900">Medical Educator</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Account Status</span>
                <div className="flex items-center gap-1.5 pt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-sm font-bold text-emerald-700">Verified & Active</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Specialization</span>
                <p className="text-base font-bold text-navy-900">{specialization || "Clinical Medicine"}</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Registration Date</span>
                <p className="text-base font-bold text-navy-900">
                  {user?.created_at ? formatDate(user.created_at) : "Recently"}
                </p>
              </div>
            </div>
          </Card>

          {/* Card 2: Editable Doctor Personal Details */}
          <Card className="p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-med-600" />
                <div>
                  <h3 className="text-sm font-bold text-navy-900">Personal & Doctor Details</h3>
                  <p className="text-[11px] text-slate-400">Update your clinical title and professional name</p>
                </div>
              </div>
            </div>

            {personalMsg && (
              <div
                className={`p-3 rounded-xl flex items-center gap-2 text-xs ${
                  personalMsg.type === "success"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-rose-50 text-rose-700 border border-rose-200"
                }`}
              >
                {personalMsg.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                <span>{personalMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleUpdatePersonal} className="space-y-4">
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

              <div className="pt-2 flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isUpdatingPersonal}
                  className="font-bold shadow-sm"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* TAB 2: CLINICAL CREDENTIALS */}
      {activeTab === "credentials" && (
        <Card className="p-6 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Award className="w-5 h-5 text-med-600" />
            <div>
              <h3 className="text-sm font-bold text-navy-900">Clinical License & Credentials</h3>
              <p className="text-[11px] text-slate-400">
                Provide your medical council details and clinical specialization for student mentees.
              </p>
            </div>
          </div>

          {feedback && (
            <div
              className={`p-4 rounded-xl flex items-center gap-2.5 text-xs ${
                feedback.type === "success"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-rose-50 text-rose-700 border border-rose-200"
              }`}
            >
              {feedback.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{feedback.text}</span>
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Medical License Number"
                placeholder="e.g. SLMC-884920 / GMC-77491"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                icon={<FileCheck className="w-4 h-4" />}
              />
              <Input
                label="Clinical Specialization"
                placeholder="e.g. Cardiology & Intensive Care"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                icon={<Stethoscope className="w-4 h-4" />}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Qualifications / Degrees"
                placeholder="e.g. MBBS, MD, MRCP (UK), FACC"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                icon={<Award className="w-4 h-4" />}
              />
              <Input
                label="Years of Clinical Experience"
                type="number"
                min={0}
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Professional Biography & Mentorship Focus
              </label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Senior Consultant mentoring medical students in internal medicine, cardiac auscultation, and bedside clinical techniques..."
                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800 focus:outline-none focus:border-med-500"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" variant="primary" size="md" isLoading={isUpdating} className="font-bold shadow-sm">
                Save Doctor Profile
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* TAB 3: SECURITY & PASSWORD */}
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

          <Card className="p-6 space-y-5 lg:col-span-1 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-navy-900">Doctor Account Protection</h3>
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
                    <span className="font-semibold text-slate-800">Clinical Access Key</span>
                    <p className="text-[11px] text-slate-500">JWT token with doctor privilege claims.</p>
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
                Sign Out
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
