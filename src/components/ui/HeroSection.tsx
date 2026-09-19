import React from "react";
import { Button } from "./Button";

export interface HeroSectionProps {
  title: string;
  subtitle: string;
  eyebrow?: string;
  ctaLabel?: string;
  secondaryLabel?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  className?: string;
}

export function HeroSection({
  title,
  subtitle,
  eyebrow = "Clinical Learning & Physician Mentorship",
  ctaLabel = "Start Study Session",
  secondaryLabel = "Browse Resources",
  onPrimaryClick,
  onSecondaryClick,
  className = "",
}: HeroSectionProps) {
  return (
    <section
      className={`bg-gradient-to-r from-med-900 via-med-900 to-med-800 text-white rounded-2xl border border-med-800/80 p-8 sm:p-12 shadow-clinical-lg ${className}`}
    >
      {/* Eyebrow */}
      <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 bg-white/10 border border-white/20 rounded-md shadow-2xs">
        <span className="w-2 h-2 rounded-full bg-med-300" />
        <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-med-50">
          {eyebrow}
        </span>
      </div>

      {/* Headline */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-4 text-white">
        {title}
      </h1>

      {/* Subtitle */}
      <p className="text-base sm:text-lg text-med-100 mb-8 max-w-2xl leading-relaxed">
        {subtitle}
      </p>

      {/* CTAs */}
      <div className="flex flex-wrap gap-3">
        <Button variant="secondary" onClick={onPrimaryClick}>
          {ctaLabel}
        </Button>
        <Button
          variant="ghost"
          className="border border-white/40 text-white hover:bg-white/10"
          onClick={onSecondaryClick}
        >
          {secondaryLabel}
        </Button>
      </div>
    </section>
  );
}

export default HeroSection;
