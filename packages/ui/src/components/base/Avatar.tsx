"use client";

import React, { useState } from "react";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null | undefined;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  className?: string;
  fallbackBg?: string;
  badge?: React.ReactNode;
}

const SIZE_PIXELS: Record<AvatarSize, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
};

const SIZE_CLASSES: Record<AvatarSize, { container: string; text: string }> = {
  xs: { container: "w-6 h-6 min-w-[24px] min-h-[24px] max-w-[24px] max-h-[24px]", text: "text-[10px]" },
  sm: { container: "w-8 h-8 min-w-[32px] min-h-[32px] max-w-[32px] max-h-[32px]", text: "text-xs" },
  md: { container: "w-10 h-10 min-w-[40px] min-h-[40px] max-w-[40px] max-h-[40px]", text: "text-sm" },
  lg: { container: "w-12 h-12 min-w-[48px] min-h-[48px] max-w-[48px] max-h-[48px]", text: "text-base" },
  xl: { container: "w-16 h-16 min-w-[64px] min-h-[64px] max-w-[64px] max-h-[64px]", text: "text-lg" },
};

function getInitials(name?: string, alt?: string): string {
  const sourceStr = name || alt || "";
  if (!sourceStr.trim()) return "?";
  const parts = sourceStr.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0]!.slice(0, 2).toUpperCase();
  }
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "User avatar",
  name,
  size = "md",
  className = "",
  fallbackBg,
  badge,
  style,
  ...props
}) => {
  const [imageError, setImageError] = useState(false);

  const px = SIZE_PIXELS[size] || 40;
  const sizeConfig = SIZE_CLASSES[size] || SIZE_CLASSES.md;
  const initials = getInitials(name, alt);
  const showImage = Boolean(src) && !imageError;

  return (
    <div
      className={`relative inline-block shrink-0 flex-shrink-0 ${className}`}
      style={{
        width: `${px}px`,
        height: `${px}px`,
        minWidth: `${px}px`,
        minHeight: `${px}px`,
        maxWidth: `${px}px`,
        maxHeight: `${px}px`,
        flexShrink: 0,
        ...style,
      }}
      {...props}
    >
      <div
        className={`relative overflow-hidden rounded-full shrink-0 flex-shrink-0 flex items-center justify-center font-bold select-none ${
          sizeConfig.container
        } ${
          !showImage
            ? fallbackBg ||
              "bg-gradient-to-br from-[#FF6B4A] to-[#FF886C] text-white shadow-sm"
            : "bg-[#F3F4F6]"
        }`}
        style={{
          width: `${px}px`,
          height: `${px}px`,
          minWidth: `${px}px`,
          minHeight: `${px}px`,
          maxWidth: `${px}px`,
          maxHeight: `${px}px`,
          borderRadius: "9999px",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {showImage ? (
          <img
            src={src!}
            alt={alt || name || "Avatar"}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover block rounded-full"
            style={{
              width: `${px}px`,
              height: `${px}px`,
              minWidth: `${px}px`,
              minHeight: `${px}px`,
              maxWidth: `${px}px`,
              maxHeight: `${px}px`,
              objectFit: "cover",
              display: "block",
              borderRadius: "9999px",
            }}
          />
        ) : (
          <span className={`leading-none font-semibold ${sizeConfig.text}`}>
            {initials}
          </span>
        )}
      </div>

      {badge && (
        <div className="absolute -bottom-0.5 -right-0.5 z-10 shrink-0 flex-shrink-0">
          {badge}
        </div>
      )}
    </div>
  );
};
