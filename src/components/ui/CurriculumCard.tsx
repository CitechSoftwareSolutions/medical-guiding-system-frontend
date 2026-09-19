"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export type CurriculumAccent = "blue" | "rose" | "teal" | "purple" | "emerald" | "amber";

export interface CurriculumCardProps {
  title: string;
  description: string;
  count: string;
  icon: React.ElementType;
  accent?: CurriculumAccent;
  href: string;
  actionText?: string;
  eyebrow?: string;
  className?: string;
}

const accentStyles: Record<
  CurriculumAccent,
  {
    iconBox: string;
    badge: string;
    hoverBorder: string;
    accentLine: string;
  }
> = {
  blue: {
    iconBox: "bg-med-50 text-med-600 border-med-200/80 group-hover:bg-med-600 group-hover:text-white",
    badge: "bg-med-50/90 text-med-700 border-med-200/80",
    hoverBorder: "group-hover:border-med-300",
    accentLine: "group-hover:bg-med-600",
  },
  rose: {
    iconBox: "bg-rose-50 text-rose-600 border-rose-200/80 group-hover:bg-rose-600 group-hover:text-white",
    badge: "bg-rose-50/90 text-rose-700 border-rose-200/80",
    hoverBorder: "group-hover:border-rose-300",
    accentLine: "group-hover:bg-rose-600",
  },
  teal: {
    iconBox: "bg-teal-50 text-teal-700 border-teal-200/80 group-hover:bg-clinical-teal group-hover:text-white",
    badge: "bg-teal-50/90 text-teal-800 border-teal-200/80",
    hoverBorder: "group-hover:border-teal-300",
    accentLine: "group-hover:bg-clinical-teal",
  },
  purple: {
    iconBox: "bg-purple-50 text-purple-700 border-purple-200/80 group-hover:bg-purple-600 group-hover:text-white",
    badge: "bg-purple-50/90 text-purple-800 border-purple-200/80",
    hoverBorder: "group-hover:border-purple-300",
    accentLine: "group-hover:bg-purple-600",
  },
  emerald: {
    iconBox: "bg-emerald-50 text-emerald-700 border-emerald-200/80 group-hover:bg-clinical-emerald group-hover:text-white",
    badge: "bg-emerald-50/90 text-emerald-800 border-emerald-200/80",
    hoverBorder: "group-hover:border-emerald-300",
    accentLine: "group-hover:bg-clinical-emerald",
  },
  amber: {
    iconBox: "bg-amber-50 text-amber-700 border-amber-200/80 group-hover:bg-amber-600 group-hover:text-white",
    badge: "bg-amber-50/90 text-amber-800 border-amber-200/80",
    hoverBorder: "group-hover:border-amber-300",
    accentLine: "group-hover:bg-amber-600",
  },
};

export function CurriculumCard({
  title,
  description,
  count,
  icon: Icon,
  accent = "blue",
  href,
  actionText = "Explore Curriculum",
  eyebrow = "Medical Library",
  className,
}: CurriculumCardProps) {
  const theme = accentStyles[accent] || accentStyles.blue;

  return (
    <Link href={href} className="block group h-full">
      <div
        className={cn(
          "h-full bg-white rounded-2xl p-6 border border-slate-200/90 shadow-card transition-all duration-200",
          "hover:shadow-card-hover hover:-translate-y-0.5",
          theme.hoverBorder,
          "flex flex-col justify-between relative overflow-hidden",
          className
        )}
      >
        {/* Subtle top indicator line on hover */}
        <div
          className={cn(
            "absolute top-0 left-0 right-0 h-0.5 bg-transparent transition-colors duration-200",
            theme.accentLine
          )}
        />

        {/* ─── Top Block: Icon & Document Count Metadata ─── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div
              className={cn(
                "w-11 h-11 rounded-xl border flex items-center justify-center transition-all duration-200 shadow-2xs shrink-0",
                theme.iconBox
              )}
            >
              <Icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-105" />
            </div>

            {/* Level 3: Document Count Metadata */}
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 select-none">
              <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{count}</span>
            </div>
          </div>

          {/* ─── Level 1: Curriculum Name & Level 2: Description ─── */}
          <div className="space-y-2">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug tracking-tight group-hover:text-med-700 transition-colors">
              {title}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
              {description}
            </p>
          </div>
        </div>

        {/* ─── Level 4: Hairline Divider & Bottom Action Area ─── */}
        <div className="pt-4 mt-5 border-t border-slate-100/90 flex items-center justify-between text-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            {eyebrow}
          </span>
          <span className="inline-flex items-center gap-1 font-bold text-med-600 group-hover:text-med-700 transition-colors">
            <span>{actionText}</span>
            <ChevronRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default CurriculumCard;
