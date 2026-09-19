import React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "primary"
  | "diagnostic"
  | "verified"
  | "warning"
  | "emergency"
  // Legacy aliases for backwards-compatibility:
  | "free"
  | "premium"
  | "success"
  | "danger"
  | "secondary"
  | "outline";

export interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  size?: "sm" | "md";
}

export function Badge({
  variant = "primary",
  children,
  icon,
  className = "",
  size = "md",
}: BadgeProps) {
  const variantClasses: Record<string, { badge: string; dot: string }> = {
    primary: {
      badge: "bg-med-50/90 text-med-800 border-med-200/60",
      dot: "bg-med-600",
    },
    diagnostic: {
      badge: "bg-teal-50 text-teal-800 border-teal-200/60",
      dot: "bg-teal-600",
    },
    verified: {
      badge: "bg-emerald-50 text-emerald-800 border-emerald-200/60",
      dot: "bg-emerald-600",
    },
    warning: {
      badge: "bg-amber-50 text-amber-900 border-amber-200/60",
      dot: "bg-amber-600",
    },
    emergency: {
      badge: "bg-rose-50 text-rose-800 border-rose-200/60",
      dot: "bg-rose-600",
    },
    free: {
      badge: "bg-emerald-50 text-emerald-800 border-emerald-200/60",
      dot: "bg-emerald-600",
    },
    success: {
      badge: "bg-emerald-50 text-emerald-800 border-emerald-200/60",
      dot: "bg-emerald-600",
    },
    premium: {
      badge: "bg-amber-50 text-amber-900 border-amber-200/60",
      dot: "bg-amber-600",
    },
    danger: {
      badge: "bg-rose-50 text-rose-800 border-rose-200/60",
      dot: "bg-rose-600",
    },
    secondary: {
      badge: "bg-slate-100 text-slate-700 border-slate-200/60",
      dot: "bg-slate-500",
    },
    outline: {
      badge: "bg-white/80 text-slate-700 border-slate-200",
      dot: "bg-slate-400",
    },
  };

  const currentVariant = variantClasses[variant] || variantClasses.primary;
  const sizeClasses = size === "sm" ? "text-xs px-2.5 py-0.5" : "text-xs px-3 py-1";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-semibold tracking-wide select-none shadow-xs",
        currentVariant.badge,
        sizeClasses,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", currentVariant.dot)} />
      {icon && <span className="inline-block shrink-0">{icon}</span>}
      {children}
    </span>
  );
}

export default Badge;
