"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Calendar, ShoppingBag, User } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  const NAV_ITEMS = [
    { id: "home", label: "Home", href: "/", icon: Home },
    { id: "explore", label: "Explore", href: "/explore", icon: Compass },
    { id: "bookings", label: "Bookings", href: "/restaurant/the-urban-cafe/book", icon: Calendar },
    { id: "orders", label: "Orders", href: "/orders", icon: ShoppingBag },
    { id: "profile", label: "Profile", href: "/profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#ECECEC] py-2 px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
          const IconComp = item.icon;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center gap-1 min-w-[56px] min-h-[44px] justify-center transition-all ${
                isActive ? "text-[#63B46C]" : "text-[#999999] hover:text-[#222222]"
              }`}
            >
              <div
                className={`p-1 rounded-full transition-transform ${
                  isActive ? "bg-[#EFF7EE] scale-110" : ""
                }`}
              >
                <IconComp size={20} className={isActive ? "text-[#63B46C]" : "text-[#999999]"} />
              </div>
              <span className={`text-[10px] font-medium ${isActive ? "font-bold text-[#63B46C]" : ""}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
