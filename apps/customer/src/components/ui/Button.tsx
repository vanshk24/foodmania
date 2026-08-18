"use client";

import { type ButtonHTMLAttributes, forwardRef } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  loading?: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      fullWidth = false,
      loading = false,
      disabled,
      className = "",
      children,
      ...props
    },
    ref,
  ) => {
    const base =
      "inline-flex items-center justify-center font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none";

    const variants = {
      primary:
        "bg-primary text-white shadow-button hover:bg-primary-600 active:scale-[0.97] active:shadow-none rounded-lg",
      secondary:
        "bg-white text-primary border border-primary hover:bg-primary-light active:scale-[0.97] rounded-lg",
      ghost:
        "bg-transparent text-primary hover:bg-primary-light active:scale-[0.97] rounded-md",
      danger:
        "bg-danger text-white hover:bg-red-600 active:scale-[0.97] rounded-lg",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm gap-1.5",
      md: "px-6 py-3.5 text-base gap-2",
      lg: "px-8 py-4 text-base gap-2",
    };

    return (
      <button
        ref={ref}
        disabled={disabled ?? loading}
        className={[base, variants[variant], sizes[size], fullWidth ? "w-full" : "", className].join(" ")}
        {...props}
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            {children}
          </span>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
