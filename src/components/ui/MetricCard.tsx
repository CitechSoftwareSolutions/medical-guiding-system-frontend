"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface MetricCardProps {
  label: string;
  value: string | number;
  category?: string;
  icon: React.ElementType;
  iconColor?: string;
  supportingText?: string;
  action?: React.ReactNode;
  className?: string;
}

export function MetricCard({
  label,
  value,
  category,
  icon: Icon,
  iconColor = "bg-med-50 text-med-600 border-med-200/80",
  supportingText,
  action,
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "bg-white border border-slate-200/90 rounded-2xl p-5 shadow-card",
        "hover:border-slate-300 hover:shadow-card-hover transition-all duration-200",
        "flex flex-col justify-between space-y-4",
        className
      )}
    >
      {/* Top: Icon & Category */}
      <div className="flex items-center justify-between gap-2">
        <div
          className={cn(
            "w-10 h-10 rounded-xl border flex items-center justify-center transition-colors shadow-2xs shrink-0",
            iconColor
          )}
        >
          <Icon className="w-4 h-4" />
        </div>
        {category && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 select-none">
            {category}
          </span>
        )}
      </div>

      {/* Middle: Dominant Number & Metric Name */}
      <div className="space-y-1">
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {value}
        </p>
        {supportingText && (
          <p className="text-xs text-slate-500">{supportingText}</p>
        )}
      </div>

      {/* Bottom: Hairline divider & action or supporting metadata */}
      {action && (
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          {action}
        </div>
      )}
    </div>
  );
}

export default MetricCard;
