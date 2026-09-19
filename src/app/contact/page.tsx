"use client";

import React, { useState } from "react";
import {
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
  };

  return (
    <div className="overflow-x-hidden">
      {/* ─── Hero Header with Medical Photography ─── */}
      <section className="relative min-h-[380px] flex items-center overflow-hidden -mt-16 pt-32 pb-16 sm:pb-20">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/images/medical-hero-bg.jpg"
            alt="Contact MedGuidance Team"
            className="w-full h-full object-cover object-center scale-100 brightness-[0.88] contrast-[1.08]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-med-950/92 via-med-950/75 to-med-950/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-med-950/90 via-transparent to-med-950/60" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl space-y-4">
          <div className="text-xs font-bold uppercase tracking-widest text-teal-300 select-none">
            Contact Us
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight drop-shadow-sm">
            Get in Touch with Our Clinical Team
          </h1>
          <p className="text-base sm:text-lg text-white/85 leading-relaxed max-w-2xl mx-auto drop-shadow-xs">
            Have questions regarding medical subscriptions, institutional packages, or doctor onboarding? We are here to assist.
          </p>
        </div>
      </section>

      {/* ─── Contact Form & Details ─── */}
      <div className="space-y-16 py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <div className="space-y-4 lg:col-span-1">
            <Card className="p-6 space-y-4 border-slate-200/90 shadow-card hover:shadow-card-hover transition-all">
              <div className="flex items-start gap-3.5">
                <div className="p-3 bg-med-50 text-med-600 rounded-xl">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">Clinical Headquarters</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Medical Guidance Platform
                    <br />
                    Colombo / Kandy Healthcare Center
                    <br />
                    Sri Lanka
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-4 border-slate-200/90 shadow-card hover:shadow-card-hover transition-all">
              <div className="flex items-start gap-3.5">
                <div className="p-3 bg-med-50 text-med-600 rounded-xl">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">Email Support</h4>
                  <p className="text-xs text-slate-600 mt-1 font-medium">support@medguidance.org</p>
                  <p className="text-xs text-slate-600 font-medium">academic@medguidance.org</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-4 border-slate-200/90 shadow-card hover:shadow-card-hover transition-all">
              <div className="flex items-start gap-3.5">
                <div className="p-3 bg-med-50 text-med-600 rounded-xl">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">Support Hours</h4>
                  <p className="text-xs text-slate-600 mt-1">Monday – Friday: 8:00 AM – 6:00 PM</p>
                  <p className="text-xs text-slate-600">Saturday: 9:00 AM – 1:00 PM</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="p-8 lg:col-span-2 border-slate-200/90 shadow-card">
            {isSent ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Message Received</h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Thank you for reaching out. A medical education coordinator will review your inquiry and respond within 24 hours.
                </p>
                <Button variant="outline" size="sm" onClick={() => setIsSent(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Send an Inquiry</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    placeholder="Dr. / Student Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="name@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <Input
                  label="Subject"
                  placeholder="Inquiry regarding clinical subscription or note access"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Please describe your question or clinical mentorship requirements..."
                    className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-800 focus:outline-none focus:border-med-500 focus:ring-2 focus:ring-med-100"
                    required
                  />
                </div>

                <div className="pt-2">
                  <Button type="submit" variant="primary" size="lg" className="font-bold shadow-md gap-2">
                    <Send className="w-4 h-4" />
                    Submit Inquiry
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
