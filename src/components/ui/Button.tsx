"use client";
import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline" | "success";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, disabled, ...props }, ref) => {
    const base = "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0b0e1a] disabled:opacity-50 disabled:cursor-not-allowed select-none";
    const variants = {
      primary:   "bg-indigo-600 text-white hover:bg-indigo-500 focus:ring-indigo-500 shadow-lg shadow-indigo-900/30",
      secondary: "bg-[#1e2536] text-slate-300 hover:bg-[#263047] border border-[#2a3347] focus:ring-slate-600",
      danger:    "bg-red-600/90 text-white hover:bg-red-500 focus:ring-red-500 shadow-lg shadow-red-900/30",
      success:   "bg-emerald-600/90 text-white hover:bg-emerald-500 focus:ring-emerald-500 shadow-lg shadow-emerald-900/30",
      ghost:     "text-slate-400 hover:text-slate-200 hover:bg-white/5 focus:ring-slate-600",
      outline:   "border border-[#2a3347] text-slate-300 hover:bg-[#1e2536] hover:border-[#3d4f70] focus:ring-slate-600",
    };
    const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2 text-sm", lg: "px-5 py-2.5 text-sm" };
    return (
      <button ref={ref} className={cn(base, variants[variant], sizes[size], className)} disabled={disabled || loading} {...props}>
        {loading && <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
export default Button;
