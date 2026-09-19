"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface SectionHeaderProps {
  eyebrow?: string;
  eyebrowIcon?: React.ElementType;
  title: string;
  highlightText?: string;
  description?: string;
  action?: React.ReactNode;
  align?: "center" | "left";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  eyebrowIcon: EyebrowIcon,
  title,
  highlightText,
  description,
  action,
  align = "center",
  className,
}: SectionHeaderProps) {
  const isCenter = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        isCenter ? "text-center items-center" : "text-left items-start sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className={cn("space-y-3", isCenter ? "max-w-2xl mx-auto" : "max-w-2xl")}>
        {/* Eyebrow */}
        {eyebrow && (
          <div
            className={cn(
              "flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-med-600 select-none",
              isCenter && "mx-auto justify-center"
            )}
          >
            {EyebrowIcon && <EyebrowIcon className="w-3.5 h-3.5 text-med-600 shrink-0" />}
            <span>{eyebrow}</span>
          </div>
        )}

        {/* Title */}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {title}{" "}
          {highlightText && (
            <span className="med-gradient-text">{highlightText}</span>
          )}
        </h2>

        {/* Description */}
        {description && (
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Optional action (e.g. "View All Resources →") */}
      {action && <div className="shrink-0 pt-2 sm:pt-0">{action}</div>}
    </div>
  );
}

export default SectionHeader;
