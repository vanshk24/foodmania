import React, { type InputHTMLAttributes, forwardRef, useState } from "react";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, leftIcon, rightIcon, fullWidth = true, className = "", id, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    const computedType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className={fullWidth ? "w-full" : ""}>
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-[#1A1A2E] mb-1.5 uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C8CA1] pointer-events-none">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={computedType}
            className={[
              "w-full bg-[#F8F9FA] border rounded-[10px] px-4 py-2.5 text-sm text-[#1A1A2E]",
              "placeholder:text-[#8C8CA1] transition-all duration-150",
              "focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00] focus:bg-white",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              error ? "border-[#EF4444] bg-[#FEE2E2]/20" : "border-[#E5E7EB]",
              leftIcon ? "pl-10" : "",
              rightIcon || isPassword ? "pr-10" : "",
              className,
            ].join(" ")}
            {...props}
          />

          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
            {isPassword ? (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[#8C8CA1] hover:text-[#4A4A68] transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            ) : rightIcon ? (
              <div className="text-[#8C8CA1]">{rightIcon}</div>
            ) : null}
          </div>
        </div>

        {error && (
          <p className="mt-1.5 text-xs text-[#EF4444] flex items-center gap-1">
            <AlertCircle size={12} />
            {error}
          </p>
        )}

        {hint && !error && <p className="mt-1.5 text-xs text-[#8C8CA1]">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
