"use client";

import React from "react";
import Link from "next/link";
import { MapPin, ChevronDown, Bell, Leaf } from "lucide-react";

interface HeaderSectionProps {
  location?: string;
  unreadNotifications?: boolean;
  userInitials?: string;
  userAvatar?: string;
  onLocationClick?: () => void;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
}

export function HeaderSection({
  location = "Andheri West, Mumbai",
  unreadNotifications = true,
  userInitials = "RS",
  onLocationClick,
  onNotificationClick,
  onProfileClick,
}: HeaderSectionProps) {
  return (
    <div className="flex items-center justify-between h-14 max-w-5xl mx-auto px-1">
      {/* Brand Logo & Deliver To Info */}
      <div className="flex items-center gap-3">
        {/* Brand Logo (Matching reference design: Green Food + Coral Mania) */}
        <Link href="/" className="flex items-center gap-1 group">
          <div className="font-display font-extrabold text-xl tracking-tight flex items-center">
            <span className="text-[#63B46C]">Food</span>
            <span className="text-[#FF6B4A] italic ml-0.5">Mania</span>
            <Leaf size={14} className="text-[#63B46C] fill-[#63B46C]/30 ml-0.5 -mt-2 group-hover:rotate-12 transition-transform" />
          </div>
        </Link>

        {/* Location Picker (Deliver to...) */}
        <button
          id="location-selector"
          onClick={onLocationClick || (() => {})}
          className="flex items-center gap-1.5 min-h-[44px] px-2.5 py-1 rounded-full bg-[#F8F9FA] border border-gray-100 hover:bg-[#FFF1EE] transition-all text-left"
          aria-label="Change location"
        >
          <MapPin size={15} className="text-[#63B46C] flex-shrink-0" />
          <div>
            <p className="text-[9px] text-[#999999] uppercase tracking-wider font-bold leading-none">Deliver to</p>
            <div className="flex items-center gap-0.5">
              <span className="font-display font-bold text-xs text-[#222222] truncate max-w-[110px] sm:max-w-[180px]">{location}</span>
              <ChevronDown size={12} className="text-[#999999] flex-shrink-0" />
            </div>
          </div>
        </button>
      </div>

      {/* Right Actions: Notification Bell + User Profile Avatar */}
      <div className="flex items-center gap-2">
        {/* Notification Bell */}
        <button
          id="notifications-bell"
          onClick={onNotificationClick || (() => {})}
          className="w-[44px] h-[44px] flex items-center justify-center rounded-full bg-[#F8F9FA] border border-gray-100 hover:bg-[#FFF1EE] hover:text-[#FF6B4A] active:scale-95 transition-all relative"
          aria-label="View notifications"
        >

          <Bell size={18} className="text-[#222222]" />
          {unreadNotifications && (
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-[#FF6B4A] rounded-full ring-2 ring-white" />
          )}
        </button>

        {/* User Avatar */}
        <Link href="/profile" id="user-profile-avatar" aria-label="User profile">
          <div
            onClick={onProfileClick}
            className="w-[44px] h-[44px] rounded-full bg-gradient-to-tr from-[#FF6B4A] to-[#FF8B73] text-white font-display font-bold text-sm flex items-center justify-center shadow-soft hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          >
            {userInitials}
          </div>
        </Link>
      </div>
    </div>
  );
}
