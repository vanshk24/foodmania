import React, { type HTMLAttributes } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const PADDINGS = {
  none: "p-0",
  sm: "p-3",
  md: "p-5",
  lg: "p-6",
};

export function Card({ hoverable = false, padding = "md", className = "", children, ...props }: CardProps) {
  return (
    <div
      className={`bg-white rounded-[14px] shadow-[0_2px_12px_rgba(0,0,0,0.07)] border border-gray-100/80 ${PADDINGS[padding]} ${
        hoverable ? "hover:shadow-[0_6px_24px_rgba(0,0,0,0.12)] transition-shadow duration-200 cursor-pointer" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = "", children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`flex items-center justify-between pb-3 border-b border-gray-100 ${className}`} {...props}>{children}</div>;
}

export function CardTitle({ className = "", children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={`font-display font-bold text-lg text-[#1A1A2E] ${className}`} {...props}>{children}</h3>;
}

export function CardContent({ className = "", children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`pt-3 ${className}`} {...props}>{children}</div>;
}
