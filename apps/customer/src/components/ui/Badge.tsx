import type { HTMLAttributes } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "orange" | "gray";
type BadgeSize = "sm" | "md";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
}

// ── Variant Config ────────────────────────────────────────────────────────────
const VARIANTS: Record<BadgeVariant, string> = {
  default:  "bg-[#F0F0F0] text-[#4A4A68]",
  success:  "bg-[#DCFCE7] text-[#15803D]",
  warning:  "bg-[#FEF3C7] text-[#D97706]",
  danger:   "bg-[#FEE2E2] text-[#DC2626]",
  info:     "bg-[#DBEAFE] text-[#1D4ED8]",
  orange:   "bg-[#FF6B00] text-white",
  gray:     "bg-[#F3F4F6] text-[#6B7280]",
};

const DOT_COLORS: Record<BadgeVariant, string> = {
  default: "bg-[#6B7280]",
  success: "bg-[#22C55E]",
  warning: "bg-[#F59E0B]",
  danger:  "bg-[#EF4444]",
  info:    "bg-[#3B82F6]",
  orange:  "bg-white",
  gray:    "bg-[#9CA3AF]",
};

// ── Badge ─────────────────────────────────────────────────────────────────────
export function Badge({ variant = "default", size = "md", dot = false, className = "", children, ...props }: BadgeProps) {
  const sizeClass = size === "sm" ? "text-[10px] px-2 py-0.5" : "text-[12px] px-2.5 py-1";

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 font-semibold rounded-full",
        VARIANTS[variant],
        sizeClass,
        className,
      ].join(" ")}
      {...props}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${DOT_COLORS[variant]}`} />}
      {children}
    </span>
  );
}
