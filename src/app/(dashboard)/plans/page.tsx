"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Plan } from "@/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import {
  Check,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function PlansPage() {
  const { isStudent, activeSubscription, refreshSubscription, refreshNotifications } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Selected plan for checkout modal
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await api.plans.list(true);
        setPlans(data);
      } catch (err) {
        console.error("Error fetching plans:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleSubscribe = async () => {
    if (!selectedPlan) return;
    setIsCheckingOut(true);
    setCheckoutError(null);

    try {
      if (selectedPlan.price > 0) {
        // Create payment transaction which auto-provisions subscription
        await api.payments.create({
          plan_id: selectedPlan.id,
          amount: selectedPlan.price,
          currency: "USD",
          gateway: "stripe_mock",
        });
      } else {
        // Free subscription
        await api.subscriptions.subscribe(selectedPlan.id);
      }

      setCheckoutSuccess(true);
      await refreshSubscription();
      await refreshNotifications();
    } catch (err: any) {
      setCheckoutError(err.message || "Payment processing failed. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  const defaultFallbackFeatures = (planName: string) => {
    if (planName.toLowerCase().includes("free")) {
      return [
        "Access to all Free core documents",
        "Basic clinical guidance consultation",
        "Standard community forum access",
        "View public clinical categories",
      ];
    }
    if (planName.toLowerCase().includes("pro")) {
      return [
        "Full access to 300+ Pro clinical documents",
        "Unlimited Clinical Guidance consultation",
        "Detailed examination notes & auscultation guides",
        "Direct doctor access request entitlement",
        "Priority student support",
      ];
    }
    return [
      "Everything in Pro Monthly plan",
      "Full 365 days unlimited VIP access",
      "Exclusive high-yield exam preparation packages",
      "Direct clinical mentor messaging & webinars",
      "Official certificate of completion",
    ];
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-12">
      {/* Hero Banner with Medical Background Image */}
      <div className="relative rounded-3xl overflow-hidden shadow-clinical-lg border border-med-800/80">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/medical-hero-bg.jpg"
            alt="Medical Guidance Center"
            className="w-full h-full object-cover object-center opacity-25 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-med-950 via-med-950/90 to-med-900/80" />
        </div>

        <div className="relative z-10 px-6 py-12 sm:px-12 sm:py-16 text-center max-w-3xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-clinical-teal select-none">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Subscription Packages</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Choose the Right Plan for{" "}
            <span className="teal-gradient-text">Your Medical Studies</span>
          </h1>

          <p className="text-xs sm:text-sm text-white/75 max-w-xl mx-auto leading-relaxed">
            Upgrade your access to unlock 300+ verified clinical cases, unrestricted 24/7 diagnostic reasoning tools, and doctor-curated exam summaries.
          </p>
        </div>
      </div>

      {/* Pricing Grid */}
      {isLoading ? (
        <div className="text-center py-16 text-xs text-slate-400">Loading subscription plans...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan) => {
            const isCurrent = activeSubscription?.plan_id === plan.id;
            const isPopular = plan.name.toLowerCase().includes("pro");
            const planFeatures = Array.isArray(plan.features) && plan.features.length > 0
              ? plan.features
              : defaultFallbackFeatures(plan.name);

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col justify-between p-6 rounded-2xl transition-all ${
                  isPopular
                    ? "border-2 border-med-600 shadow-clinical-md bg-white"
                    : "border border-slate-200/90 shadow-card bg-white"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-med-600 to-clinical-teal text-white text-xs font-extrabold uppercase px-4 py-1 rounded-full shadow-md tracking-wider">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-extrabold text-slate-900">{plan.name}</h3>
                    {isCurrent && (
                      <Badge variant="verified" size="sm">
                        Current Plan
                      </Badge>
                    )}
                  </div>

                  <div>
                    <span className="text-3xl font-black text-slate-900">
                      {plan.price === 0 ? "Free" : formatCurrency(plan.price)}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-xs text-slate-500 font-semibold ml-1">
                        / {plan.duration_days} days
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed min-h-[32px]">
                    {plan.description || "Essential clinical guidance for medical students."}
                  </p>

                  {/* Feature Checklist */}
                  <ul className="space-y-2.5 pt-3 border-t border-slate-100 text-xs text-slate-700">
                    {planFeatures.map((f: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-clinical-emerald shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-auto">
                  {isCurrent ? (
                    <div className="w-full py-2.5 rounded-xl bg-clinical-emerald-light border border-clinical-emerald-200 text-clinical-emerald text-center font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Active Plan</span>
                    </div>
                  ) : (
                    <Button
                      variant={isPopular ? "primary" : "outline"}
                      size="lg"
                      className={`w-full font-bold ${
                        isPopular
                          ? "bg-med-600 hover:bg-med-700 text-white shadow-md"
                          : "bg-white text-slate-800 hover:text-med-700 hover:bg-med-50 border-slate-300 shadow-2xs"
                      }`}
                      onClick={() => {
                        setSelectedPlan(plan);
                        setCheckoutSuccess(false);
                        setCheckoutError(null);
                      }}
                    >
                      {plan.price === 0 ? "Get Started Free" : isPopular ? "Upgrade to Pro" : "Select Plan"}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Checkout Modal */}
      {selectedPlan && (
        <Modal
          isOpen={!!selectedPlan}
          onClose={() => setSelectedPlan(null)}
          title={`Subscribe to ${selectedPlan.name}`}
          maxWidth="md"
        >
          {checkoutSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Subscription Activated!</h3>
              <p className="text-xs text-slate-500">
                You now have full access to all resources under the <strong>{selectedPlan.name}</strong> tier.
              </p>
              <Button
                variant="primary"
                size="md"
                className="w-full font-bold mt-2 text-white bg-med-600 hover:bg-med-700"
                onClick={() => setSelectedPlan(null)}
              >
                Go to Resources Library
              </Button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-medium">Selected Tier</p>
                  <p className="text-base font-bold text-slate-900">{selectedPlan.name}</p>
                  <p className="text-[11px] text-slate-400">Duration: {selectedPlan.duration_days} days</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-med-700">
                    {selectedPlan.price === 0 ? "Free" : formatCurrency(selectedPlan.price)}
                  </p>
                </div>
              </div>

              {checkoutError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{checkoutError}</span>
                </div>
              )}

              <div className="text-[11px] text-slate-500 space-y-1">
                <div className="flex items-center gap-1.5 text-clinical-emerald font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Encrypted Instant Payment Simulation</span>
                </div>
                <p>Includes immediate unlock of Pro documents, notes, and AI guidance.</p>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <Button
                  variant="outline"
                  size="md"
                  className="flex-1 font-bold text-slate-700 hover:text-slate-900 border-slate-300"
                  onClick={() => setSelectedPlan(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  className="flex-1 font-bold shadow-xs text-white bg-med-600 hover:bg-med-700"
                  isLoading={isCheckingOut}
                  onClick={handleSubscribe}
                >
                  Confirm &amp; Activate
                </Button>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
