"use client";

import React from "react";
import { ShieldCheck, Menu } from "lucide-react";
import { AdminGlobalSearch } from "@/components/topbar/AdminGlobalSearch";
import { AdminNotificationCenter } from "@/components/topbar/AdminNotificationCenter";
import { AdminProfileMenu } from "@/components/topbar/AdminProfileMenu";

interface AdminHeaderProps {
  onMobileMenuClick?: () => void;
}

export function AdminHeader({ onMobileMenuClick }: AdminHeaderProps) {
  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-[#ECECEC] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Mobile Toggle & Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuClick}
          className="lg:hidden w-[40px] h-[40px] rounded-full bg-[#FAF9F5] border border-[#ECECEC] flex items-center justify-center text-[#222222] hover:bg-[#EFF7EE] active:scale-95 transition-all"
          aria-label="Toggle admin menu"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-2">
          <h2 className="font-display font-bold text-sm sm:text-base text-[#222222]">
            Super Admin Console
          </h2>
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-[#63B46C] bg-[#EFF7EE] px-2.5 py-0.5 rounded-full border border-[#63B46C]/20">
            <ShieldCheck size={12} /> Healthy
          </span>
        </div>
      </div>

      {/* Right: Global Search, Notifications, Admin Profile Menu */}
      <div className="flex items-center gap-3">
        {/* 1. Global Search Command Palette */}
        <AdminGlobalSearch />

        {/* 2. Notification Center */}
        <AdminNotificationCenter />

        {/* 3. Super Admin Profile Menu */}
        <AdminProfileMenu />
      </div>
    </header>
  );
}
