import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  elevated?: boolean;
  hover?: boolean;
}

export function Card({
  children,
  className = "",
  elevated = false,
  hover = false,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "bg-white border border-slate-200/90 rounded-2xl transition-all duration-200",
        elevated ? "shadow-clinical-md" : "shadow-card",
        hover && "hover:border-slate-300 hover:shadow-card-hover hover:-translate-y-0.5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
