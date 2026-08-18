import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "../base/Button";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message = "An error occurred while loading this section. Please try again.",
  onRetry,
  className = "",
}: ErrorStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center bg-white rounded-[14px] border border-red-100 shadow-[0_2px_12px_rgba(0,0,0,0.07)] ${className}`}>
      <div className="w-14 h-14 rounded-full bg-[#FEE2E2] flex items-center justify-center mb-3 text-[#EF4444]">
        <AlertTriangle size={28} />
      </div>
      <h3 className="font-display font-bold text-base text-[#1A1A2E] mb-1">{title}</h3>
      <p className="text-xs text-[#8C8CA1] max-w-sm mb-4">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          <RefreshCw size={14} className="mr-1.5" />
          Try Again
        </Button>
      )}
    </div>
  );
}
