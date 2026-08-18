import React from "react";
import { X } from "lucide-react";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  position?: "bottom" | "right";
}

export function Drawer({ isOpen, onClose, title, children, footer, position = "bottom" }: DrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div
        className={`relative bg-white z-10 flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.12)] transition-transform duration-300 ${
          position === "bottom"
            ? "w-full max-h-[85vh] rounded-t-[24px] mt-auto"
            : "h-full w-full max-w-md ml-auto rounded-l-[24px]"
        }`}
      >
        {position === "bottom" && (
          <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto my-3 flex-shrink-0" />
        )}

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          {title && <h3 className="font-display font-bold text-lg text-[#1A1A2E]">{title}</h3>}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#8C8CA1] hover:bg-[#F8F9FA] transition-colors ml-auto"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">{children}</div>

        {footer && <div className="p-4 bg-[#F8F9FA] border-t border-gray-100 flex items-center justify-end gap-3 flex-shrink-0">{footer}</div>}
      </div>
    </div>
  );
}
