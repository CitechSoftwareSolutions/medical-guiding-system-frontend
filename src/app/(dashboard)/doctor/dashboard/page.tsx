"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Document, StudentProfile, Plan } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MetricCard } from "@/components/ui/MetricCard";
import {
  ArrowLeft,
  Stethoscope,
  Upload,
  BookOpen,
  Users,
  CreditCard,
  UserCheck,
  Plus,
  ArrowRight,
  FileText,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function DoctorDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docs, studs, plns] = await Promise.all([
          api.documents.list(),
          api.students.list(0, 10).catch(() => []),
          api.plans.list(false),
        ]);
        setDocuments(docs);
        setStudents(studs);
        setPlans(plns);
      } catch (err) {
        console.error("Doctor dashboard error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Back Action Button */}
      <div className="flex items-center">
        <button
          type="button"
          onClick={() => router.back()}
          title="Go back to previous page"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-med-700 bg-white hover:bg-med-50 border border-slate-200/80 hover:border-med-200 shadow-xs transition-all cursor-pointer group"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-slate-500 group-hover:text-med-600 transition-transform group-hover:-translate-x-0.5" />
          <span>Back</span>
        </button>
      </div>

      {/* Welcome Banner — Layered Medical Hero */}
      <div className="relative rounded-2xl overflow-hidden shadow-clinical-lg border border-med-800/50">
        <div className="hero-gradient-bg p-8 text-white relative">
          <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
            <img
              src="/images/medical-hero-bg.jpg"
              alt=""
              className="w-full h-full object-cover mix-blend-overlay"
            />
          </div>
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-clinical-teal select-none">
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Doctor &amp; Clinical Educator Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome, Dr. {user?.first_name} {user?.last_name}!
            </h1>
            <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
              Manage your medical curriculum documents, grant individual access to student mentees, and publish subscription learning packages.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="/doctor/documents">
                <Button variant="white" size="sm" className="font-bold shadow">
                  <Upload className="w-4 h-4 mr-1.5" />
                  Upload New Resource
                </Button>
              </Link>
              <Link href="/doctor/grant-access">
                <Button variant="ghost" size="sm" className="border border-white/40 text-white hover:bg-white/10 backdrop-blur-sm">
                  <UserCheck className="w-4 h-4 mr-1.5" />
                  Grant Student Access
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row — Standardized Reusable Clinical MetricCards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Metric 1: Published Materials */}
        <MetricCard
          category="Curriculum Repository"
          icon={BookOpen}
          iconColor="bg-med-50 text-med-600 border-med-200/80"
          label="Published Materials"
          value={documents.length}
          supportingText="Clinical guides & lecture notes"
          action={
            <Link
              href="/doctor/documents"
              className="text-xs font-bold text-med-600 hover:text-med-700 inline-flex items-center gap-1 group/link"
            >
              Manage Resources
              <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
            </Link>
          }
        />

        {/* Metric 2: Registered Students */}
        <MetricCard
          category="Cohort Engagement"
          icon={Users}
          iconColor="bg-teal-50 text-teal-700 border-teal-200/80"
          label="Registered Students"
          value={students.length}
          supportingText="Mentees in active clinical training"
          action={
            <Link
              href="/doctor/grant-access"
              className="text-xs font-bold text-clinical-teal hover:text-teal-700 inline-flex items-center gap-1 group/link"
            >
              Grant Mentee Access
              <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
            </Link>
          }
        />

        {/* Metric 3: Active Curriculum Plans */}
        <MetricCard
          category="Subscription Tiers"
          icon={CreditCard}
          iconColor="bg-emerald-50 text-emerald-700 border-emerald-200/80"
          label="Active Curriculum Plans"
          value={plans.length}
          supportingText="Core, Standard & Pro tiers"
          action={
            <Link
              href="/plans"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 group/link"
            >
              View Plan Offerings
              <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
            </Link>
          }
        />
      </div>

      {/* Uploaded Materials Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Your Published Clinical Materials</h3>
            <p className="text-xs text-slate-500">Manage curriculum visibility, attachments, and access rights</p>
          </div>
          <Link href="/doctor/documents">
            <Button variant="outline" size="sm" className="gap-1 font-bold">
              Manage All <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 rounded-xl shimmer-skeleton" />
            ))}
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-500">
            You haven&apos;t uploaded any documents yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200/80 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3 px-2">Title</th>
                  <th className="pb-3 px-2">Category</th>
                  <th className="pb-3 px-2">Access Tier</th>
                  <th className="pb-3 px-2 text-right">Published</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                {documents.slice(0, 5).map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-2 font-bold text-slate-900 text-sm">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="truncate max-w-xs">{d.title}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        {d.category?.name || "General"}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <Badge variant={d.visibility === "free" ? "free" : "premium"} size="sm">
                        {d.visibility}
                      </Badge>
                    </td>
                    <td className="py-3 px-2 text-right text-slate-500 font-mono text-xs">
                      {formatDate(d.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

