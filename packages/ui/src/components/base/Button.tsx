import React, { type ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  loading?: boolean;
}

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
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-[12px]";

    const variants = {
      primary:
        "bg-[#FF6B00] text-white shadow-[0_4px_14px_rgba(255,107,0,0.35)] hover:bg-[#E85F00] active:scale-[0.97]",
      secondary:
        "bg-white text-[#FF6B00] border border-[#FF6B00] hover:bg-[#FFF3E8] active:scale-[0.97]",
      ghost:
        "bg-transparent text-[#FF6B00] hover:bg-[#FFF3E8] active:scale-[0.97]",
      danger:
        "bg-[#EF4444] text-white hover:bg-red-600 active:scale-[0.97]",
      outline:
        "bg-white text-[#1A1A2E] border border-[#E5E7EB] hover:bg-[#F8F9FA] active:scale-[0.97]",
    };

    const sizes = {
      sm: "px-3.5 py-1.5 text-xs gap-1.5",
      md: "px-5 py-3 text-sm gap-2",
      lg: "px-7 py-3.5 text-base gap-2.5",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${base} ${variants[variant]} ${sizes[size]} ${
          fullWidth ? "w-full" : ""
        } ${className}`}
        {...props}
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
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
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            {children}
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
