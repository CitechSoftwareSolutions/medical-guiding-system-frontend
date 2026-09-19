import React from "react";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  CreditCard,
  MessageSquare,
  Shield,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function ServicesPage() {
  const services = [
    {
      title: "Clinical Document Repository",
      desc: "Comprehensive database of peer-reviewed clinical guidelines, anatomical dissection notes, ECG strips, and pharmacology mechanisms.",
      icon: BookOpen,
      features: [
        "Cardiology, Neurology, Pharmacology & Surgery categories",
        "Free core summaries and Pro in-depth clinical notes",
        "Downloadable references in PDF and document formats",
      ],
    },
    {
      title: "Interactive Clinical Guidance",
      desc: "Structured diagnostic reasoning and clinical consultation tool helping medical students explore differentials and symptoms.",
      icon: MessageSquare,
      features: [
        "Step-by-step physical examination protocols",
        "Differential diagnoses comparison guides",
        "Clinical pharmacology and drug mechanism breakdowns",
      ],
    },
    {
      title: "Direct Doctor Mentorship",
      desc: "Empowering senior doctors to publish specialized study packs and grant direct access to their clinical student batches.",
      icon: Stethoscope,
      features: [
        "Individual student mentorship authorization",
        "Doctor credential and license verification",
        "Custom clinical notes distribution",
      ],
    },
    {
      title: "Flexible Subscription Programs",
      desc: "Affordable access tiers designed for medical universities, teaching hospitals, and individual students preparing for licensing exams.",
      icon: CreditCard,
      features: [
        "Free starter student access",
        "Monthly Pro memberships with full clinical archive",
        "Institutional student packages",
      ],
    },
  ];

  return (
    <div className="overflow-x-hidden">
      {/* ─── Hero Header with Medical Photography ─── */}
      <section className="relative min-h-[380px] flex items-center overflow-hidden -mt-16 pt-32 pb-16 sm:pb-20">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/images/medical-hero-bg.jpg"
            alt="MedGuidance Clinical Services"
            className="w-full h-full object-cover object-center scale-100 brightness-[0.88] contrast-[1.08]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-med-950/92 via-med-950/75 to-med-950/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-med-950/90 via-transparent to-med-950/60" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl space-y-4">
          <div className="text-xs font-bold uppercase tracking-widest text-teal-300 select-none">
            Our Services
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight drop-shadow-sm">
            Comprehensive Medical Education Services
          </h1>
          <p className="text-base sm:text-lg text-white/85 leading-relaxed max-w-2xl mx-auto drop-shadow-xs">
            From verified case archives to interactive diagnostic discussions, explore how MedGuidance supports clinical training.
          </p>
        </div>
      </section>

      {/* ─── Services Grid ─── */}
      <div className="space-y-16 py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <Card key={i} className="p-8 space-y-5 border-slate-200/90 shadow-card hover:shadow-card-hover transition-all">
                <div className="w-12 h-12 rounded-xl bg-med-50 text-med-600 flex items-center justify-center shadow-xs">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{s.title}</h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">{s.desc}</p>
                <ul className="space-y-2.5 pt-3 border-t border-slate-100 text-sm text-slate-700">
                  {s.features.map((f, fi) => (
                    <li key={fi} className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-clinical-emerald shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>

        {/* Action Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-med-950 via-[#0A1A30] to-med-900 border border-med-800/60 text-white p-8 sm:p-12 text-center space-y-4 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <img
              src="/images/medical-hero-bg.jpg"
              alt=""
              className="w-full h-full object-cover brightness-110"
            />
          </div>
          <div className="relative z-10 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black">
              Need a Custom Clinical Training Package?
            </h2>
            <p className="text-sm text-white/80 max-w-lg mx-auto">
              We collaborate with medical schools and teaching hospitals to configure dedicated curricula and mentee cohort access.
            </p>
            <div className="pt-2">
              <Link href="/contact">
                <Button variant="white" size="lg" className="font-bold shadow-lg">
                  Contact Clinical Coordinator
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
