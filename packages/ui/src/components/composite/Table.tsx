import React, { type TableHTMLAttributes, type HTMLAttributes } from "react";

export function Table({ className = "", children, ...props }: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto rounded-[14px] border border-gray-100 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.07)]">
      <table className={`w-full text-left text-sm text-[#1A1A2E] ${className}`} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ className = "", children, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={`bg-[#F8F9FA] text-xs font-semibold uppercase tracking-wider text-[#4A4A68] border-b border-gray-100 ${className}`} {...props}>{children}</thead>;
}

export function TableBody({ className = "", children, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={`divide-y divide-gray-100 ${className}`} {...props}>{children}</tbody>;
}

export function TableRow({ className = "", children, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={`hover:bg-[#FFF3E8]/30 transition-colors ${className}`} {...props}>{children}</tr>;
}

export function TableHead({ className = "", children, ...props }: HTMLAttributes<HTMLTableCellElement>) {
  return <th className={`px-4 py-3.5 ${className}`} {...props}>{children}</th>;
}

export function TableCell({ className = "", children, ...props }: HTMLAttributes<HTMLTableCellElement>) {
  return <td className={`px-4 py-3.5 font-medium ${className}`} {...props}>{children}</td>;
}
