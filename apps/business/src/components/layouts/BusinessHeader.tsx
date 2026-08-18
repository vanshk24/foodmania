"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Search, Bell, Menu, BellRing, LogOut } from "lucide-react";
import { eventBus } from "@food-mania/shared";
import { Avatar } from "@food-mania/ui";
import { motion, AnimatePresence } from "framer-motion";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface BusinessHeaderProps {
  restaurantName?: string;
  userName?: string;
  onMobileMenuClick?: () => void;
}

export function BusinessHeader({
  restaurantName,
  userName,
  onMobileMenuClick,
}: BusinessHeaderProps) {
  const [liveBanner, setLiveBanner] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(2);
  const [displayUser, setDisplayUser] = useState(userName || "Restaurant Owner");
  const [displayResto, setDisplayResto] = useState(restaurantName || "Restaurant Partner");

  useEffect(() => {
    try {
      const storedUserRaw = localStorage.getItem("fm_biz_user");
      const storedRestoName = localStorage.getItem("fm_restaurant_name");
      const storedRid = localStorage.getItem("fm_restaurant_id");

      if (storedUserRaw) {
        const u = JSON.parse(storedUserRaw);
        if (u.name) setDisplayUser(u.name);
      }
      if (storedRestoName) {
        setDisplayResto(storedRestoName);
      } else if (storedRid) {
        fetch(`${API_BASE_URL}/restaurants/${storedRid}`)
          .then((res) => (res.ok ? res.json() : null))
          .then((json) => {
            const name = json?.data?.name || json?.name;
            if (name) {
              setDisplayResto(name);
              localStorage.setItem("fm_restaurant_name", name);
            }
          })
          .catch(() => {});
      }
    } catch {}

    const unsubscribe = eventBus.subscribe("*", (msg) => {
      if (msg.type === "WAITER_CALL_CREATED") {
        setLiveBanner(`🔔 WAITER CALL from Table ${msg.payload.tableNumber}!`);
        setUnreadCount((c) => c + 1);
        setTimeout(() => setLiveBanner(null), 5000);
      } else if (msg.type === "SERVICE_REQUEST_CREATED") {
        setLiveBanner(`💧 SERVICE REQUEST (${msg.payload.type.toUpperCase()}) from Table ${msg.payload.tableNumber}!`);
        setUnreadCount((c) => c + 1);
        setTimeout(() => setLiveBanner(null), 5000);
      } else if (msg.type === "BILL_REQUEST_CREATED") {
        setLiveBanner(`🧾 BILL REQUESTED for Table ${msg.payload.tableNumber}!`);
        setUnreadCount((c) => c + 1);
        setTimeout(() => setLiveBanner(null), 5000);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-[#ECECEC] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-soft">
      {/* Left: Mobile Hamburger Menu & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={onMobileMenuClick}
          className="lg:hidden w-[44px] h-[44px] rounded-full bg-[#FAF9F5] border border-[#ECECEC] flex items-center justify-center text-[#222222] hover:bg-[#EFF7EE] active:scale-95 transition-all"
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>

        {/* Search Input with ⌘K Badge */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#999999]" />
          <input
            type="search"
            placeholder="Search orders, tables..."
            className="w-full bg-[#FAF9F5] border border-[#ECECEC] rounded-[18px] pl-10 pr-10 sm:pr-12 py-2 text-xs text-[#222222] placeholder:text-[#999999] focus:outline-none focus:ring-2 focus:ring-[#63B46C]/30 focus:bg-white transition-all min-h-[40px]"
          />
          <kbd className="hidden sm:block absolute right-3 top-1/2 -translate-y-1/2 bg-white border border-[#ECECEC] rounded-[6px] px-1.5 py-0.5 text-[10px] text-[#999999] font-mono shadow-2xs">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Center Live Alert Notification Toast */}
      <AnimatePresence>
        {liveBanner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#FFF1EE] border border-[#FF6B4A]/40 rounded-full text-xs font-bold text-[#FF6B4A] shadow-xs animate-bounce"
          >
            <BellRing size={16} />
            <span>{liveBanner}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right User & Notification Profile */}
      <div className="flex items-center gap-3 ml-2">
        {/* Notification Bell */}
        <button
          onClick={() => setUnreadCount(0)}
          className="w-[44px] h-[44px] rounded-full bg-[#FAF9F5] border border-[#ECECEC] flex items-center justify-center text-[#222222] hover:bg-[#EFF7EE] hover:text-[#63B46C] transition-all relative"
        >

          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 min-w-4 h-4 px-1 bg-[#FF6B4A] text-white text-[9px] font-extrabold rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Info & Avatar */}
        <div className="flex items-center gap-2.5">
          <Avatar
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80"
            name={displayUser}
            size="md"
            className="shrink-0"
          />
          <div className="hidden md:block text-left">
            <p className="font-display font-bold text-xs text-[#222222] leading-snug">{displayUser}</p>
            <p className="text-[10px] text-[#666666] font-medium leading-none">{displayResto}</p>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={() => {
            localStorage.removeItem("fm_biz_token");
            localStorage.removeItem("fm_restaurant_id");
            localStorage.removeItem("fm_restaurant_name");
            localStorage.removeItem("fm_biz_user");
            window.location.href = "/login";
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-[14px] bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-all border border-red-200 ml-1 cursor-pointer"
          title="Sign Out of Business Portal"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
