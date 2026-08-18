"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Grid,
  UtensilsCrossed,
  ChefHat,
  Calendar,
  Users,
  BarChart3,
  Megaphone,
  CreditCard,
  UserCheck,
  Settings,
  Sparkles,
  Leaf,
  LogOut,
} from "lucide-react";

const NAV_ITEMS = [
  { id: "overview", label: "Dashboard", href: "/overview", icon: LayoutDashboard },
  { id: "orders", label: "Orders", href: "/orders", icon: ShoppingBag, badge: "8" },
  { id: "tables", label: "Tables", href: "/tables", icon: Grid },
  { id: "menu", label: "Menu", href: "/menu", icon: UtensilsCrossed },
  { id: "kitchen", label: "Kitchen", href: "/kitchen", icon: ChefHat },
  { id: "reservations", label: "Reservations", href: "/reservations", icon: Calendar },
  { id: "customers", label: "Customers", href: "/customers", icon: Users },
  { id: "analytics", label: "Analytics", href: "/analytics", icon: BarChart3 },
  { id: "marketing", label: "Marketing", href: "/marketing", icon: Megaphone },
  { id: "payments", label: "Payments", href: "/payments", icon: CreditCard },
  { id: "staff", label: "Staff", href: "/staff", icon: UserCheck },
  { id: "settings", label: "Settings", href: "/settings", icon: Settings },
];

export function BusinessSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-[#ECECEC] h-full flex flex-col justify-between p-4 flex-shrink-0 overflow-y-auto">
      <div className="space-y-6">
        {/* Brand Logo Header (Matching reference design) */}
        <Link href="/overview" className="flex items-center gap-1 px-3 py-2 group">
          <div className="font-display font-extrabold text-2xl tracking-tight flex items-center">
            <span className="text-[#63B46C]">Food</span>
            <span className="text-[#FF6B4A] italic ml-0.5">Mania</span>
            <Leaf size={16} className="text-[#63B46C] fill-[#63B46C]/30 ml-0.5 -mt-2 group-hover:rotate-12 transition-transform" />
          </div>
        </Link>

        {/* Sidebar Nav Links */}
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/overview" && pathname?.startsWith(item.href));
            const IconComp = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-[16px] text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#EFF7EE] text-[#63B46C] font-bold shadow-sm"
                    : "text-[#666666] hover:bg-[#FAF9F5] hover:text-[#222222]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconComp size={18} className={isActive ? "text-[#63B46C]" : "text-[#999999]"} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="w-5 h-5 rounded-full bg-[#FF6B4A] text-white text-[10px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                localStorage.removeItem("fm_biz_token");
                localStorage.removeItem("food_mania_business_session");
                window.location.href = "/login";
              }
            }}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-[16px] text-xs font-semibold text-red-600 hover:bg-red-50 transition-all mt-2"
          >
            <div className="flex items-center gap-3">
              <LogOut size={18} className="text-red-500" />
              <span>Sign Out</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Bottom "Go Premium" Card (Matching reference design) */}
      <div className="bg-gradient-to-br from-[#EFF7EE] to-[#FEF9EF] p-4 rounded-[20px] border border-[#63B46C]/20 space-y-2 relative overflow-hidden mt-6">
        <div className="flex items-center gap-1.5 text-[#63B46C] font-bold text-xs">
          <Sparkles size={16} />
          <span>Go Premium</span>
        </div>
        <p className="text-[11px] text-[#666666] leading-tight font-medium">
          Unlock more power for your restaurant
        </p>
        <button
          onClick={() => {
            // Upgrade premium action
          }}
          className="w-full bg-[#63B46C] hover:bg-[#4B9A54] text-white font-display font-bold text-xs py-2 rounded-[14px] shadow-sm transition-all min-h-[36px]"
        >

          Upgrade Now
        </button>
      </div>
    </aside>
  );
}
