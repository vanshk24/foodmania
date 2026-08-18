"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Store,
  Users,
  BadgeCheck,
  CreditCard,
  FileBarChart,
  LifeBuoy,
  Settings,
  LogOut,
  Shield,
} from "lucide-react";

export const ADMIN_NAV = [
  { label: "Overview", href: "/overview", icon: LayoutDashboard },
  { label: "Restaurants", href: "/restaurants", icon: Store },
  { label: "Users", href: "/users", icon: Users },
  { label: "Subscriptions", href: "/subscriptions", icon: BadgeCheck },
  { label: "Payments", href: "/payments", icon: CreditCard },
  { label: "Reports", href: "/reports", icon: FileBarChart },
  { label: "Support", href: "/support", icon: LifeBuoy },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-white border-r border-gray-100 flex flex-col h-full overflow-y-auto flex-shrink-0 shadow-[2px_0_16px_rgba(0,0,0,0.05)] z-30">
      {/* Brand Header */}
      <div className="p-5 border-b border-gray-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#FF6B00] flex items-center justify-center text-white shadow-sm">
          <Shield size={18} />
        </div>
        <div>
          <h1 className="font-display font-bold text-lg text-[#1A1A2E] leading-tight">
            Food <span className="text-[#FF6B00]">Mania</span>
          </h1>
          <span className="text-[10px] uppercase font-bold text-[#FF6B00] tracking-wider">
            Super Admin
          </span>
        </div>
      </div>

      {/* Stats summary badge */}
      <div className="px-4 py-2 bg-[#F8F9FA] mx-3 my-2 rounded-[8px] border border-gray-100 text-[11px] text-[#4A4A68] flex justify-between items-center">
        <span>Active Tenants</span>
        <span className="font-bold text-[#FF6B00]">847</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {ADMIN_NAV.map((item) => {
          const isActive =
            (item.href === "/overview" && (pathname === "/" || pathname === "/overview")) ||
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href + "/"));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-[10px] text-sm font-medium transition-all ${
                isActive
                  ? "bg-[#FFF3E8] text-[#FF6B00] font-semibold border-l-4 border-[#FF6B00]"
                  : "text-[#4A4A68] hover:bg-[#F8F9FA] hover:text-[#1A1A2E]"
              }`}
            >
              <item.icon size={18} className={isActive ? "text-[#FF6B00]" : "text-[#8C8CA1]"} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-gray-100">
        <button className="w-full flex items-center gap-3 px-[#FFF3E8] py-2.5 rounded-[10px] text-sm font-medium text-[#EF4444] hover:bg-red-50 transition-colors">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
