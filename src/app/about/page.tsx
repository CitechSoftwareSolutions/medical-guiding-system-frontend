import React from "react";
import Link from "next/link";
import {
  Activity,
  Award,
  CheckCircle2,
  GraduationCap,
  Heart,
  Shield,
  Stethoscope,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function AboutPage() {
  return (
    <div className="overflow-x-hidden">
      {/* ─── Hero Header with Medical Photography ─── */}
      <section className="relative min-h-[380px] flex items-center overflow-hidden -mt-16 pt-32 pb-16 sm:pb-20">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/images/medical-hero-bg.jpg"
            alt="About MedGuidance Clinical Center"
            className="w-full h-full object-cover object-center scale-100 brightness-[0.88] contrast-[1.08]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-med-950/92 via-med-950/75 to-med-950/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-med-950/90 via-transparent to-med-950/60" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl space-y-4">
          <div className="text-xs font-bold uppercase tracking-widest text-teal-300 select-none">
            About MedGuidance
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight drop-shadow-sm">
            Empowering Healthcare Education Through Expert Clinical Guidance
          </h1>
          <p className="text-base sm:text-lg text-white/85 leading-relaxed max-w-2xl mx-auto drop-shadow-xs">
            MedGuidance is a dedicated clinical mentorship platform connecting medical students with certified physicians, curated examination resources, and diagnostic knowledge.
          </p>
        </div>
      </section>

      {/* ─── Main Content Body ─── */}
      <div className="space-y-16 py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-8 space-y-4 border-slate-200/90 shadow-card hover:shadow-card-hover transition-all">
            <div className="w-12 h-12 rounded-xl bg-med-50 text-med-600 flex items-center justify-center shadow-xs">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Our Mission</h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              To bridge the gap between textbook medical theory and bedside clinical acumen by providing medical students around the world with accessible, verified clinical materials, direct physician feedback, and structured diagnostic frameworks.
            </p>
          </Card>

          <Card className="p-8 space-y-4 border-slate-200/90 shadow-card hover:shadow-card-hover transition-all">
            <div className="w-12 h-12 rounded-xl bg-clinical-teal-light text-clinical-teal flex items-center justify-center shadow-xs">
              <Stethoscope className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Physician-Led Mentorship</h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Every clinical document, case analysis, and diagnostic flowchart on our platform is authored, reviewed, and approved by certified medical practitioners to ensure accuracy and exam alignment.
            </p>
          </Card>
        </div>

        {/* Core Values */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Our Educational Principles
            </h2>
            <p className="text-sm text-slate-500">
              Delivering the highest standard of medical education.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Card className="p-6 space-y-3 shadow-card card-hover-lift">
              <Shield className="w-8 h-8 text-med-600" />
              <h4 className="text-base sm:text-lg font-bold text-slate-900">Evidence-Based Clinical Data</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Updated clinical protocols, drug classifications, and guidelines based on international medical consensus.
              </p>
            </Card>

            <Card className="p-6 space-y-3 shadow-card card-hover-lift">
              <Users className="w-8 h-8 text-med-600" />
              <h4 className="text-base sm:text-lg font-bold text-slate-900">Direct Mentorship Access</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Doctors can grant individual access to student mentees and conduct specialized clinical discussions.
              </p>
            </Card>

            <Card className="p-6 space-y-3 shadow-card card-hover-lift">
              <Award className="w-8 h-8 text-med-600" />
              <h4 className="text-base sm:text-lg font-bold text-slate-900">Licensing Exam Alignment</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Tailored summaries and high-yield notes for MBBS, USMLE, PLAB, and AMC licensing exam preparation.
              </p>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-3xl bg-gradient-to-r from-med-950 via-[#0A1A30] to-med-900 border border-med-800/60 p-8 sm:p-12 text-center text-white space-y-4 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <img
              src="/images/medical-hero-bg.jpg"
              alt=""
              className="w-full h-full object-cover brightness-110"
            />
          </div>
          <div className="relative z-10 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black">
              Join the MedGuidance Community Today
            </h2>
            <p className="text-sm text-white/80 max-w-lg mx-auto">
              Sign up as a student to access clinical study resources or as a doctor to mentor the next generation.
            </p>
            <div className="pt-2 flex justify-center gap-4">
              <Link href="/register">
                <Button variant="white" size="lg" className="font-bold shadow-lg">
                  Get Started
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="border-white/40 text-white hover:bg-white/10 font-bold">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
