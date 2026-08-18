"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search, Store, User, CreditCard, Shield, MapPin,
  Sparkles, Tag, ArrowRight, CornerDownLeft, X, Command
} from "lucide-react";
import {
  ADMIN_RESTAURANTS,
  ADMIN_USERS,
  ADMIN_SUBSCRIPTIONS,
  ADMIN_PAYMENTS,
  SUPPORT_TICKETS,
} from "@food-mania/shared";

interface SearchResultItem {
  id: string;
  category: "restaurant" | "user" | "subscription" | "payment" | "support";
  title: string;
  subtitle: string;
  locationOrMeta?: string;
  badge?: string;
  badgeColor?: string;
  statusBadge?: string;
  targetHref: string;
}

export function AdminGlobalSearch() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [rawQuery, setRawQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  // 300ms Debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(rawQuery.trim());
    }, 300);
    return () => clearTimeout(handler);
  }, [rawQuery]);

  // Ctrl + K Global Shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setRawQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Search Computation
  const results: SearchResultItem[] = useMemo(() => {
    if (!debouncedQuery) return [];
    const q = debouncedQuery.toLowerCase();
    const list: SearchResultItem[] = [];

    // 1. Search Restaurants & Owners & Cities
    ADMIN_RESTAURANTS.forEach((r) => {
      if (
        r.name.toLowerCase().includes(q) ||
        r.ownerName.toLowerCase().includes(q) ||
        r.ownerEmail.toLowerCase().includes(q) ||
        r.city.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.plan.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q) ||
        r.phone.includes(q)
      ) {
        list.push({
          id: `r-${r.id}`,
          category: "restaurant",
          title: r.name,
          subtitle: `Owner: ${r.ownerName} (${r.ownerEmail})`,
          locationOrMeta: r.city,
          badge: r.plan,
          badgeColor:
            r.plan === "Enterprise"
              ? "bg-green-100 text-green-700"
              : r.plan === "Pro"
              ? "bg-orange-100 text-orange-700"
              : "bg-gray-100 text-gray-700",
          statusBadge: r.status,
          targetHref: `/restaurants?search=${encodeURIComponent(r.name)}`,
        });
      }
    });

    // 2. Search Customers
    ADMIN_USERS.forEach((u) => {
      if (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.includes(q) ||
        u.favouriteRestaurant.toLowerCase().includes(q)
      ) {
        list.push({
          id: `u-${u.id}`,
          category: "user",
          title: u.name,
          subtitle: `${u.email} · ${u.phone}`,
          locationOrMeta: `Fav: ${u.favouriteRestaurant}`,
          badge: `${u.totalOrders} Orders`,
          badgeColor: "bg-purple-100 text-purple-700",
          statusBadge: u.status,
          targetHref: `/users?search=${encodeURIComponent(u.name)}`,
        });
      }
    });

    // 3. Search Subscriptions
    ADMIN_SUBSCRIPTIONS.forEach((s) => {
      if (
        s.restaurantName.toLowerCase().includes(q) ||
        s.plan.toLowerCase().includes(q) ||
        s.status.toLowerCase().includes(q)
      ) {
        list.push({
          id: `sub-${s.id}`,
          category: "subscription",
          title: `${s.restaurantName} Subscription`,
          subtitle: `Plan: ${s.plan} (₹${s.monthlyAmount}/mo)`,
          locationOrMeta: `Renewal: ${s.nextRenewal}`,
          badge: s.plan,
          badgeColor: "bg-[#FF6B4A]/10 text-[#FF6B4A]",
          statusBadge: s.status,
          targetHref: `/subscriptions?search=${encodeURIComponent(s.restaurantName)}`,
        });
      }
    });

    // 4. Search Payments
    ADMIN_PAYMENTS.forEach((p) => {
      if (
        p.id.toLowerCase().includes(q) ||
        p.restaurantName.toLowerCase().includes(q) ||
        p.customerName.toLowerCase().includes(q) ||
        p.method.toLowerCase().includes(q)
      ) {
        list.push({
          id: `pay-${p.id}`,
          category: "payment",
          title: `Payment TXN: ${p.id}`,
          subtitle: `${p.restaurantName} · Customer: ${p.customerName}`,
          locationOrMeta: `₹${p.amount} via ${p.method}`,
          badge: p.method,
          badgeColor: "bg-blue-100 text-blue-700",
          statusBadge: p.status,
          targetHref: `/payments?search=${encodeURIComponent(p.id)}`,
        });
      }
    });

    // 5. Search Support Tickets
    SUPPORT_TICKETS.forEach((t) => {
      if (
        t.id.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.customerName.toLowerCase().includes(q) ||
        t.restaurantName.toLowerCase().includes(q)
      ) {
        list.push({
          id: `tkt-${t.id}`,
          category: "support",
          title: `Ticket ${t.id}: ${t.subject}`,
          subtitle: `${t.customerName} · ${t.restaurantName}`,
          locationOrMeta: `Priority: ${t.priority}`,
          badge: t.category,
          badgeColor: "bg-amber-100 text-amber-700",
          statusBadge: t.status,
          targetHref: `/support?search=${encodeURIComponent(t.id)}`,
        });
      }
    });

    return list.slice(0, 10);
  }, [debouncedQuery]);

  // Reset keyboard selection on query change
  useEffect(() => {
    setSelectedIndex(0);
  }, [debouncedQuery]);

  // Keyboard navigation inside dropdown
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = results[selectedIndex];
      if (selected) {
        setIsOpen(false);
        router.push(selected.targetHref);
      }
    }
  };

  const handleSelectResult = (targetHref: string) => {
    setIsOpen(false);
    router.push(targetHref);
  };

  return (
    <>
      {/* Search Input Trigger in Navbar */}
      <div className="relative">
        <button
          id="global-search-trigger"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 bg-[#FAF9F5] border border-[#ECECEC] hover:border-[#FF6B4A]/40 rounded-[16px] px-3 py-1.5 text-xs text-[#8C8CA1] hover:text-[#222222] transition-all min-h-[38px] w-48 sm:w-64"
        >
          <Search size={15} className="text-[#8C8CA1] shrink-0" />
          <span className="truncate text-left flex-1">Search restaurants, users...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-white border border-[#ECECEC] rounded-md text-[#8C8CA1] shadow-2xs">
            <Command size={10} />K
          </kbd>
        </button>
      </div>

      {/* Full Modal Command Palette */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className="fixed inset-0"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative bg-white border border-[#ECECEC] rounded-[24px] shadow-2xl w-full max-w-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-150">
            {/* Search Input Header */}
            <div className="flex items-center px-4 py-3 border-b border-[#ECECEC] gap-3">
              <Search size={18} className="text-[#FF6B4A] shrink-0" />
              <input
                id="global-search-input"
                ref={inputRef}
                type="text"
                value={rawQuery}
                onChange={(e) => setRawQuery(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Type to search restaurants, owners, users, cities, payments..."
                className="w-full text-sm font-medium text-[#222222] placeholder-[#8C8CA1] bg-transparent focus:outline-none"
              />
              {rawQuery ? (
                <button
                  onClick={() => setRawQuery("")}
                  className="p-1 text-[#8C8CA1] hover:text-[#222222] rounded-full hover:bg-gray-100"
                >
                  <X size={16} />
                </button>
              ) : (
                <span className="text-[10px] font-semibold text-[#8C8CA1] bg-[#FAF9F5] px-2 py-1 rounded-md border border-[#ECECEC]">
                  ESC to close
                </span>
              )}
            </div>

            {/* Results Body */}
            <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
              {!rawQuery && (
                <div className="p-6 text-center text-[#8C8CA1]">
                  <Sparkles size={28} className="mx-auto mb-2 text-[#FF6B4A]/60" />
                  <p className="text-xs font-semibold text-[#222222]">Super Admin Command Palette</p>
                  <p className="text-[11px] mt-1">Search by restaurant name, owner name, city, payment ID, or ticket number</p>
                  <div className="flex justify-center gap-2 mt-4 flex-wrap text-[10px]">
                    <span className="bg-[#FAF9F5] border border-[#ECECEC] px-2 py-1 rounded-full text-[#666]">Try: "Urban Cafe"</span>
                    <span className="bg-[#FAF9F5] border border-[#ECECEC] px-2 py-1 rounded-full text-[#666]">Try: "Mumbai"</span>
                    <span className="bg-[#FAF9F5] border border-[#ECECEC] px-2 py-1 rounded-full text-[#666]">Try: "Rohit"</span>
                    <span className="bg-[#FAF9F5] border border-[#ECECEC] px-2 py-1 rounded-full text-[#666]">Try: "Enterprise"</span>
                  </div>
                </div>
              )}

              {rawQuery && results.length === 0 && (
                <div className="p-8 text-center text-[#8C8CA1]">
                  <Search size={32} className="mx-auto mb-2 opacity-40" />
                  <p className="text-sm font-semibold text-[#222222]">No matching results</p>
                  <p className="text-xs mt-1">No restaurants, users, or transactions matched "{rawQuery}"</p>
                </div>
              )}

              {results.map((res, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={res.id}
                    onClick={() => handleSelectResult(res.targetHref)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center gap-3 p-3 rounded-[16px] cursor-pointer transition-all ${
                      isSelected
                        ? "bg-[#FF6B4A]/10 border border-[#FF6B4A]/30 shadow-xs"
                        : "hover:bg-[#FAF9F5] border border-transparent"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-[12px] flex items-center justify-center shrink-0 ${
                        res.category === "restaurant"
                          ? "bg-orange-100 text-[#FF6B4A]"
                          : res.category === "user"
                          ? "bg-purple-100 text-purple-600"
                          : res.category === "subscription"
                          ? "bg-green-100 text-green-600"
                          : res.category === "payment"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-amber-100 text-amber-600"
                      }`}
                    >
                      {res.category === "restaurant" && <Store size={18} />}
                      {res.category === "user" && <User size={18} />}
                      {res.category === "subscription" && <Tag size={18} />}
                      {res.category === "payment" && <CreditCard size={18} />}
                      {res.category === "support" && <Shield size={18} />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-[#222222] truncate">
                          {res.title}
                        </span>
                        {res.badge && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${res.badgeColor}`}>
                            {res.badge}
                          </span>
                        )}
                        {res.statusBadge && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 capitalize">
                            {res.statusBadge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#8C8CA1] truncate mt-0.5">
                        {res.subtitle}
                      </p>
                    </div>

                    {res.locationOrMeta && (
                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-[#8C8CA1] flex items-center gap-0.5">
                          <MapPin size={10} />
                          {res.locationOrMeta}
                        </span>
                      </div>
                    )}

                    <div className="shrink-0 text-[#8C8CA1]">
                      <ArrowRight size={14} className={isSelected ? "text-[#FF6B4A]" : "opacity-40"} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            {results.length > 0 && (
              <div className="px-4 py-2 bg-[#FAF9F5] border-t border-[#ECECEC] flex items-center justify-between text-[11px] text-[#8C8CA1]">
                <span>Showing {results.length} search results</span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white border border-[#ECECEC] rounded text-[10px]">↑</kbd>
                    <kbd className="px-1.5 py-0.5 bg-white border border-[#ECECEC] rounded text-[10px]">↓</kbd> navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white border border-[#ECECEC] rounded text-[10px] flex items-center gap-0.5">
                      <CornerDownLeft size={10} /> Enter
                    </kbd> open
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
