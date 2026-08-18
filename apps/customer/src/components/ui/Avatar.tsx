"use client";

import React from "react";
import { Avatar as SharedAvatar, AvatarProps as SharedAvatarProps } from "@food-mania/ui";

export interface CustomerAvatarProps extends SharedAvatarProps {
  initials?: string;
  online?: boolean;
}

export function Avatar({
  src,
  alt = "",
  initials,
  size = "md",
  online,
  className = "",
  ...props
}: CustomerAvatarProps) {
  const badge =
    online !== undefined ? (
      <span
        className={`block rounded-full border-2 border-white ${
          size === "xs" ? "w-2 h-2" : size === "sm" ? "w-2.5 h-2.5" : "w-3 h-3"
        } ${online ? "bg-[#22C55E]" : "bg-[#9CA3AF]"}`}
      />
    ) : undefined;

  return (
    <SharedAvatar
      src={src}
      alt={alt}
      name={initials || alt}
      size={size}
      className={className}
      badge={badge}
      {...props}
    />
  );
}
