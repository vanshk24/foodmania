import React from "react";
import { FolderOpen } from "lucide-react";
import { Button } from "../base/Button";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon = <FolderOpen size={48} className="text-[#FF6B00]/70" />,
  title,
  description,
  actionLabel,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center bg-white rounded-[14px] border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.07)] ${className}`}>
      <div className="w-16 h-16 rounded-full bg-[#FFF3E8] flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-display font-bold text-lg text-[#1A1A2E] mb-1">{title}</h3>
      {description && <p className="text-sm text-[#8C8CA1] max-w-sm mb-5">{description}</p>}
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
