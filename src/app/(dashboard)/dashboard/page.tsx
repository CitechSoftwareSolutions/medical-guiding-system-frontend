"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Document, StudentDocument } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MetricCard } from "@/components/ui/MetricCard";
import {
  ArrowLeft,
  MessageSquare,
  Calendar,
  CreditCard,
  ExternalLink,
  FileText,
  ArrowRight,
  Stethoscope,
  Clock,
  Activity,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function StudentDashboardPage() {
  const router = useRouter();
  const { user, activeSubscription } = useAuth();
  const [recentDocs, setRecentDocs] = useState<Document[]>([]);
  const [myGrantedDocs, setMyGrantedDocs] = useState<StudentDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Typewriter writing animation for headline
  const targetHeadline = "Ready to accelerate your clinical studies today?";
  const [typedHeadline, setTypedHeadline] = useState("");
  const [isTypingDone, setIsTypingDone] = useState(false);

  useEffect(() => {
    let index = 0;
    setTypedHeadline("");
    setIsTypingDone(false);
    const interval = setInterval(() => {
      if (index < targetHeadline.length) {
        setTypedHeadline(targetHeadline.slice(0, index + 1));
        index++;
      } else {
        setIsTypingDone(true);
        clearInterval(interval);
      }
    }, 45);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allDocs, myDocs] = await Promise.all([
          api.documents.list({ limit: 4 }),
          api.documents.getMyStudentDocs().catch(() => []),
        ]);
        setRecentDocs(allDocs);
        setMyGrantedDocs(myDocs);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
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
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-med-700 bg-white hover:bg-med-50 border border-slate-200/80 hover:border-med-200 shadow-xs transition-all cursor-pointer group"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-slate-500 group-hover:text-med-600 transition-transform group-hover:-translate-x-0.5" />
          <span>Back</span>
        </button>
      </div>

      {/* Welcome Banner — Layered Medical Hero with Typewriter text */}
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
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white flex items-center min-h-[44px]">
              <span>{typedHeadline}</span>
              {!isTypingDone && (
                <span className="inline-block w-0.5 h-7 ml-1 bg-clinical-teal animate-pulse" />
              )}
            </h1>
            <p className="text-xs sm:text-sm text-white/75 leading-relaxed max-w-xl">
              Explore verified clinical notes, review examination guidelines, or consult the interactive diagnostic guidance tool.
            </p>
          </div>
        </div>
      </div>

      {/* Overview Cards — Standardized Reusable Clinical MetricCards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Metric 1: Subscription Tier */}
        <MetricCard
          category="Account Status"
          icon={CreditCard}
          iconColor="bg-med-50 text-med-600 border-med-200/80"
          label="Subscription Tier"
          value={activeSubscription?.plan?.name || "Free Starter"}
          action={
            activeSubscription ? (
              <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                Renews {formatDate(activeSubscription.end_date)}
              </span>
            ) : (
              <Link
                href="/plans"
                className="text-xs font-bold text-med-600 hover:text-med-700 inline-flex items-center gap-1 group/link"
              >
                Upgrade to Pro
                <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
              </Link>
            )
          }
        />

        {/* Metric 2: Clinical Resources */}
        <MetricCard
          category="Curriculum Repository"
          icon={FileText}
          iconColor="bg-emerald-50 text-emerald-700 border-emerald-200/80"
          label="Clinical Resources"
          value={`${myGrantedDocs.length + (activeSubscription ? 50 : 5)} Notes`}
          supportingText="Verified syllabus coverage & exam guides"
          action={
            <Link
              href="/documents"
              className="text-xs font-bold text-med-600 hover:text-med-700 inline-flex items-center gap-1 group/link"
            >
              Browse Repository
              <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
            </Link>
          }
        />

        {/* Metric 3: Diagnostic Guidance */}
        <MetricCard
          category="Clinical Consultation"
          icon={MessageSquare}
          iconColor="bg-teal-50 text-teal-700 border-teal-200/80"
          label="Clinical Guidance"
          value="24/7 Consultation"
          supportingText="Interactive differential diagnoses"
          action={
            <Link
              href="/chat"
              className="text-xs font-bold text-clinical-teal hover:text-teal-700 inline-flex items-center gap-1 group/link"
            >
              Open Diagnostic Assistant
              <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
            </Link>
          }
        />
      </div>

      {/* Recent Resources */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recently Published Clinical Documents</h3>
            <p className="text-xs text-slate-500">Curated materials from certified clinical educators</p>
          </div>
          <Link href="/documents">
            <Button variant="ghost" size="sm" className="gap-1 text-med-600 font-bold">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-36 rounded-2xl shimmer-skeleton" />
            ))}
          </div>
        ) : recentDocs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-500 shadow-xs">
            No clinical documents published yet. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentDocs.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-card hover:border-slate-300 hover:shadow-card-hover transition-all flex flex-col justify-between space-y-3.5 group"
              >
                {/* 1. Header Row: Category Eyebrow & Status Badge */}
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-med-700">
                    <Stethoscope className="w-3.5 h-3.5 text-med-600 shrink-0" />
                    {doc.category?.name || "General Medicine"}
                  </span>
                  <Badge variant={doc.visibility === "free" ? "free" : "premium"}>
                    {doc.visibility === "free" ? "Free" : "Pro"}
                  </Badge>
                </div>

                {/* 2. Title & Description */}
                <div className="space-y-1.5">
                  <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug group-hover:text-med-700 transition-colors">
                    {doc.title}
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                    {doc.description || "Detailed diagnostic protocol and examination guidance."}
                  </p>
                </div>

                {/* 3. Divider & Metadata / Action Row */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-sm">
                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {formatDate(doc.created_at)}
                  </span>
                  <Link
                    href={`/documents?id=${doc.id}`}
                    className="inline-flex items-center gap-1 text-sm font-bold text-med-600 hover:text-med-700 group-hover:translate-x-0.5 transition-transform"
                  >
                    Study Note <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

