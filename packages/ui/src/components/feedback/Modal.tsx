import React from "react";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

const MAX_WIDTHS = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

export function Modal({ isOpen, onClose, title, description, children, footer, maxWidth = "md" }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div
        className={`relative w-full ${MAX_WIDTHS[maxWidth]} bg-white rounded-[18px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] p-6 overflow-hidden z-10 animate-scale-in`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between gap-4 pb-3">
          <div>
            {title && <h2 className="font-display font-bold text-xl text-[#1A1A2E]">{title}</h2>}
            {description && <p className="text-xs text-[#8C8CA1] mt-0.5">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#8C8CA1] hover:bg-[#F8F9FA] hover:text-[#1A1A2E] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="py-2">{children}</div>

        {footer && <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
}
