"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import {
  Activity,
  BookOpen,
  MessageSquare,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  FileText,
  GraduationCap,
  HeartPulse,
  LayoutDashboard,
  Pill,
  Shield,
  Stethoscope,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DiagnosisCard } from "@/components/ui/DiagnosisCard";
import { CurriculumCard, CurriculumAccent } from "@/components/ui/CurriculumCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function HomePage() {
  const { user, isDoctor, isMounted } = useAuth();
  const [docCount, setDocCount] = useState<number | null>(null);
  const [categoryCount, setCategoryCount] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      api.documents.list({ limit: 100 }),
      api.categories.list(),
    ])
      .then(([docs, cats]) => {
        if (mounted) {
          if (Array.isArray(docs)) setDocCount(docs.length);
          if (Array.isArray(cats)) setCategoryCount(cats.length);
        }
      })
      .catch((err) => {
        console.error("Failed to load live metrics:", err);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const categories: {
    name: string;
    desc: string;
    icon: React.ElementType;
    count: string;
    accent: CurriculumAccent;
  }[] = [
    {
      name: "Anatomy & Histology",
      desc: "Gross anatomy dissections, organ systems, and tissue slides",
      icon: HeartPulse,
      count: "48 Documents",
      accent: "blue",
    },
    {
      name: "Clinical Cardiology",
      desc: "Heart auscultation, 12-lead ECG strips, and coronary syndromes",
      icon: Activity,
      count: "62 Documents",
      accent: "rose",
    },
    {
      name: "Pharmacology",
      desc: "Drug classifications, mechanism of action charts, toxicities",
      icon: Pill,
      count: "55 Documents",
      accent: "teal",
    },
    {
      name: "General Pathology",
      desc: "Cellular adaptations, inflammation, oncology diagnostics",
      icon: BookOpen,
      count: "39 Documents",
      accent: "purple",
    },
    {
      name: "Internal Medicine",
      desc: "Diagnostic flowcharts, patient examination protocols",
      icon: Stethoscope,
      count: "74 Documents",
      accent: "emerald",
    },
    {
      name: "Surgery & Trauma",
      desc: "Operative procedures, trauma resuscitation guidelines",
      icon: Shield,
      count: "31 Documents",
      accent: "amber",
    },
  ];

  const features = [
    {
      title: "Verified Clinical Content",
      desc: "High-yield lecture notes, examination walkthroughs, and case studies curated by certified doctors.",
      icon: Stethoscope,
      iconClass: "bg-med-50 text-med-600 group-hover:bg-med-600 group-hover:text-white",
    },
    {
      title: "Interactive Clinical Guidance",
      desc: "Ask complex clinical questions, clarify differential diagnoses, and get step-by-step reasoning 24/7.",
      icon: MessageSquare,
      iconClass: "bg-clinical-teal-light text-clinical-teal group-hover:bg-clinical-teal group-hover:text-white",
    },
    {
      title: "Tiered Flexible Access",
      desc: "Enjoy free core summaries or unlock full high-yield masterclasses with flexible student plans.",
      icon: CreditCard,
      iconClass: "bg-amber-50 text-amber-700 group-hover:bg-amber-600 group-hover:text-white",
    },
    {
      title: "Direct Doctor Mentorship",
      desc: "Doctors can grant individual access to student mentees and publish specialized notes for exams.",
      icon: GraduationCap,
      iconClass: "bg-purple-50 text-purple-700 group-hover:bg-purple-600 group-hover:text-white",
    },
  ];

  const stats = [
    {
      value: docCount !== null && docCount > 0 ? `${docCount}+` : "300+",
      label: "Clinical Documents",
      color: "text-white",
    },
    {
      value: "24/7",
      label: "Diagnostic Guidance",
      color: "text-clinical-teal-400",
    },
    {
      value: categoryCount !== null && categoryCount > 0 ? `${categoryCount}` : "100%",
      label: "Verified Curriculums",
      color: "text-clinical-emerald-500",
    },
  ];

  return (
    <div className="overflow-x-hidden">
      {/* ─── Hero — High-Fidelity Photographic Medical Background with Transparent Topbar ─── */}
      <section className="relative min-h-[660px] flex items-center overflow-hidden -mt-16 pt-32 sm:pt-36 pb-24 sm:pb-28">
        {/* Real High-Resolution Clinical Photography Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/images/medical-hero-bg.jpg"
            alt="Medical Guidance Clinical Center"
            className="w-full h-full object-cover object-center scale-100 brightness-[0.88] contrast-[1.08] transition-transform duration-1000"
          />
          {/* Subtle directional vignette: preserves photographic clarity while keeping text 100% sharp */}
          <div className="absolute inset-0 bg-gradient-to-r from-med-950/92 via-med-950/72 to-med-950/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-med-950 via-transparent to-med-950/60" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] drop-shadow-sm">
              Master Clinical Medicine{" "}
              <span className="teal-gradient-text">with Expert Guidance</span>
              {" "}&amp; Physician Mentorship
            </h1>

            <p className="text-base sm:text-lg text-white/85 leading-relaxed max-w-2xl mx-auto drop-shadow-xs">
              Access high-yield medical documents, learn directly from experienced doctors, and accelerate your exam preparation with structured clinical guidance.
            </p>

            <div className="flex items-center justify-center pt-2">
              <Link href={isMounted && user ? (isDoctor ? "/doctor/dashboard" : "/dashboard") : "/dashboard"}>
                <Button
                  variant="white"
                  size="lg"
                  className="font-extrabold px-8 py-4 shadow-xl hover:shadow-2xl transition-all duration-200 text-sm tracking-wide group"
                >
                  <LayoutDashboard className="w-4 h-4 mr-2 text-med-700 group-hover:scale-110 transition-transform" />
                  <span>Go to Dashboard</span>
                  <ChevronRight className="w-4 h-4 ml-2 text-med-700 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Live Stats Bar in Hero */}
            <div className="grid grid-cols-3 gap-6 pt-10 border-t border-white/20 max-w-xl mx-auto">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className={`text-2xl sm:text-3xl font-black ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-white/70 font-semibold uppercase tracking-wider mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Capabilities Grid — Professional Clinical Cards ──────────── */}
      <section className="bg-slate-50/70 py-20 border-y border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Clinical Capabilities"
            eyebrowIcon={Activity}
            title="Built Specifically for"
            highlightText="Medical Education"
            description="Standardized clinical resources, diagnostic reasoning tools, and educator-led cohorts for MBBS and postgraduate candidates."
            align="center"
            className="mb-12"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-card hover:border-slate-300 hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3.5">
                    <div className={`w-10 h-10 rounded-xl ${f.iconClass} flex items-center justify-center transition-colors shadow-2xs`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-med-700 transition-colors">
                      {f.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {f.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-med-600 group-hover:text-med-700">
                    <span>Explore Capability</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Stats Banner — Dark Section ─────────────────────── */}
      <section className="bg-med-950 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: docCount !== null && docCount > 0 ? `${docCount}+` : "300+", label: "Clinical Documents", color: "text-white" },
              { value: "50+", label: "Verified Doctors", color: "text-clinical-teal" },
              { value: "1200+", label: "Active Students", color: "text-clinical-emerald" },
              { value: categoryCount !== null && categoryCount > 0 ? `${categoryCount}` : "24/7", label: categoryCount !== null && categoryCount > 0 ? "Verified Curriculums" : "Diagnostic Guidance", color: "text-clinical-amber" },
            ].map((stat) => (
              <div key={stat.label} className="space-y-1">
                <p className={`text-3xl sm:text-4xl font-black ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-white/50 font-semibold uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Curriculum Library — Substantially Redesigned Cards ──────── */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Curriculum Library"
            eyebrowIcon={BookOpen}
            title="Explore Medical"
            highlightText="Disciplines"
            description="Access structured medical learning resources across major clinical and academic disciplines."
            align="left"
            action={
              <Link href="/documents">
                <Button variant="outline" size="sm" className="gap-1 font-bold shadow-2xs">
                  View All Resources <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            }
            className="mb-12"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((c) => (
              <CurriculumCard
                key={c.name}
                title={c.name}
                description={c.desc}
                count={c.count}
                icon={c.icon}
                accent={c.accent}
                href={`/documents?category=${encodeURIComponent(c.name)}`}
                eyebrow="Medical Curriculum"
                actionText="Explore Curriculum"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Clinical Guidance Spotlight ─────────────────────── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl card-gradient-dark p-8 sm:p-12 shadow-clinical-lg relative overflow-hidden border border-med-800/60">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative z-10">
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-clinical-teal select-none">
                  <Stethoscope className="w-4 h-4" />
                  <span>Diagnostic Consultation Engine</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white">
                  Review clinical cases and{" "}
                  <span className="teal-gradient-text">differential diagnosis</span>{" "}
                  reasoning 24/7.
                </h2>
                <p className="text-sm text-white/70 leading-relaxed">
                  Structured clinical diagnostic workflows, drug mechanisms, and high-yield reviews before your viva examinations.
                </p>
                <ul className="space-y-3 text-sm text-white/80">
                  {[
                    "Instant differential diagnoses breakdown",
                    "High-yield exam summaries & mnemonic generation",
                    "Interactive question answering tailored to MBBS level",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-clinical-emerald shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-2">
                  <Link href="/chat">
                    <Button variant="white" size="lg" className="font-bold shadow-lg">
                      Start Consultation
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-white/60 px-1">
                  <span className="font-bold uppercase tracking-wider">High-Yield Clinical Contrast</span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-clinical-teal">USMLE / Viva High-Yield</span>
                </div>
                <DiagnosisCard
                  title="Cardiac Murmurs: Aortic Stenosis vs Mitral Regurgitation"
                  condition1={{
                    name: "Aortic Stenosis (AS)",
                    features: [
                      "Harsh crescendo-decrescendo systolic murmur",
                      "Right 2nd intercostal space at sternal border",
                      "Radiation to bilateral carotid arteries",
                      "Pulsus parvus et tardus (delayed carotid pulse)",
                    ],
                  }}
                  condition2={{
                    name: "Mitral Regurgitation (MR)",
                    features: [
                      "Blowing holosystolic murmur over the cardiac apex",
                      "Radiation to the left axilla",
                      "Murmur intensity unchanged during inspiration",
                      "Frequently post-MI (papillary muscle) or MVP",
                    ],
                  }}
                  onCompare={() => {
                    if (typeof window !== "undefined") {
                      window.location.href = "/chat";
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Bottom CTA ───────────────────────────────────────── */}
      <section className="py-20 bg-slate-50/80 border-t border-slate-200/70">
        <div className="max-w-5xl mx-auto px-4">
          <div className="rounded-3xl overflow-hidden relative bg-gradient-to-r from-med-950 via-[#0A1A30] to-med-900 border border-med-800/60 p-10 sm:p-16 text-center space-y-6 shadow-2xl">
            <div className="absolute inset-0 opacity-25 pointer-events-none overflow-hidden">
              <img
                src="/images/medical-hero-bg.jpg"
                alt="Clinical Excellence"
                className="w-full h-full object-cover object-center brightness-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-med-950 via-transparent to-med-950/80" />
            </div>
            <div className="relative z-10 space-y-5">
              <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-teal-300 select-none">
                <Users className="w-4 h-4" />
                <span>Academic Community</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Ready to Elevate Your{" "}
                <span className="teal-gradient-text">Medical Knowledge?</span>
              </h2>
              <p className="text-sm text-white/70 max-w-xl mx-auto leading-relaxed">
                Join hundreds of medical students, clinical mentors, and healthcare professionals learning on the Medical Guidance System today.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
                {isMounted && user ? (
                  <Link href={isDoctor ? "/doctor/dashboard" : "/dashboard"}>
                    <Button variant="white" size="lg" className="shadow-lg font-bold">
                      Go to My Medical Workspace
                      <ChevronRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/register">
                      <Button variant="white" size="lg" className="shadow-lg font-bold">
                        Create Your Free Account
                        <ChevronRight className="w-4 h-4 ml-1.5" />
                      </Button>
                    </Link>
                    <Link href="/login">
                      <Button variant="outline" size="lg" className="border-white/40 text-white hover:bg-white/10 backdrop-blur-sm font-bold">
                        Sign In
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
