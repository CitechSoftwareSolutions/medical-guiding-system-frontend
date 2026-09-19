import React from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "success"
  | "danger"
  | "white";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  isLoading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) {
  const sizeClasses: Record<ButtonSize, string> = {
    sm: "px-3.5 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const variantClasses: Record<ButtonVariant, string> = {
    primary:
      "bg-med-600 hover:bg-med-700 text-white border border-med-600 hover:border-med-700 shadow-xs",
    secondary:
      "bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200 shadow-2xs",
    outline:
      "bg-white text-slate-700 hover:text-med-700 hover:bg-med-50 border border-slate-300 hover:border-med-300 shadow-2xs",
    ghost: "text-slate-700 hover:text-med-700 hover:bg-slate-100 bg-transparent border border-transparent",
    success:
      "bg-clinical-emerald hover:bg-emerald-700 text-white border border-clinical-emerald shadow-xs",
    danger:
      "bg-rose-600 hover:bg-rose-700 text-white border border-rose-600 shadow-xs",
    white:
      "bg-white text-med-700 hover:bg-slate-100 hover:text-med-800 border border-transparent shadow-md",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none",
        sizeClasses[size],
        variantClasses[variant] || variantClasses.primary,
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}

export default Button;
