"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Bell, CheckCircle2, Trash2, X, Store, AlertTriangle,
  CreditCard, ShieldAlert, Bug, QrCode, RefreshCw, Star,
  CheckCheck, Filter
} from "lucide-react";

export interface AdminNotification {
  id: string;
  category: "Restaurants" | "Payments" | "System" | "Support";
  type:
    | "new_restaurant"
    | "sub_expiry"
    | "payment_failed"
    | "restaurant_suspended"
    | "restaurant_verified"
    | "qr_generated"
    | "bug_report"
    | "support_ticket"
    | "review_spike"
    | "system_update";
  title: string;
  description: string;
  timestamp: string;
  timeGroup: "Today" | "Yesterday" | "This Week";
  read: boolean;
  targetHref: string;
}

const INITIAL_NOTIFICATIONS: AdminNotification[] = [
  {
    id: "n-1",
    category: "Restaurants",
    type: "new_restaurant",
    title: "New Restaurant Registration",
    description: "Royal Treat Hotel submitted FSSAI & GST documents for verification.",
    timestamp: "10 minutes ago",
    timeGroup: "Today",
    read: false,
    targetHref: "/restaurants?status=pending",
  },
  {
    id: "n-2",
    category: "Payments",
    type: "payment_failed",
    title: "Subscription Renewal Failed",
    description: "Italian Corner auto-renewal of ₹9,999 failed due to card decline.",
    timestamp: "1 hour ago",
    timeGroup: "Today",
    read: false,
    targetHref: "/payments?status=failed",
  },
  {
    id: "n-3",
    category: "Restaurants",
    type: "restaurant_verified",
    title: "Restaurant Verified",
    description: "The Urban Cafe has been successfully verified & issued active QR codes.",
    timestamp: "3 hours ago",
    timeGroup: "Today",
    read: true,
    targetHref: "/restaurants?status=active",
  },
  {
    id: "n-4",
    category: "Support",
    type: "support_ticket",
    title: "Critical Ticket Escalate",
    description: "Ticket TKT-4002 (Refund not received) escalated by Agent Meera.",
    timestamp: "5 hours ago",
    timeGroup: "Today",
    read: false,
    targetHref: "/support?priority=Critical",
  },
  {
    id: "n-5",
    category: "Restaurants",
    type: "sub_expiry",
    title: "Subscription Expiring Soon",
    description: "Burger Hub Pro plan expires in 4 days (Aug 9, 2026).",
    timestamp: "Yesterday at 4:30 PM",
    timeGroup: "Yesterday",
    read: true,
    targetHref: "/subscriptions?tab=Pro",
  },
  {
    id: "n-6",
    category: "System",
    type: "review_spike",
    title: "5-Star Rating Spike Alert",
    description: "Spice Symphony received 42 five-star reviews in the last 24 hours.",
    timestamp: "Yesterday at 11:15 AM",
    timeGroup: "Yesterday",
    read: true,
    targetHref: "/reports",
  },
  {
    id: "n-7",
    category: "System",
    type: "system_update",
    title: "Platform Maintenance Completed",
    description: "Food Mania v1.4 database indexes and cache cluster updated successfully.",
    timestamp: "Aug 2, 2026",
    timeGroup: "This Week",
    read: true,
    targetHref: "/settings?tab=audit",
  },
  {
    id: "n-8",
    category: "Support",
    type: "bug_report",
    title: "Bug Report Submitted",
    description: "Merchant reported QR table session delay on iOS Safari.",
    timestamp: "Aug 1, 2026",
    timeGroup: "This Week",
    read: true,
    targetHref: "/support",
  },
];

export function AdminNotificationCenter() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AdminNotification[]>(INITIAL_NOTIFICATIONS);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (activeCategory === "All") return true;
      if (activeCategory === "Unread") return !n.read;
      return n.category === activeCategory;
    });
  }, [notifications, activeCategory]);

  const groupedNotifications = useMemo(() => {
    const groups: Record<string, AdminNotification[]> = {
      Today: [],
      Yesterday: [],
      "This Week": [],
    };
    filteredNotifications.forEach((n) => {
      if (!groups[n.timeGroup]) {
        groups[n.timeGroup] = [];
      }
      groups[n.timeGroup]!.push(n);
    });
    return groups;
  }, [filteredNotifications]);

  const handleMarkRead = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleNotificationClick = (n: AdminNotification) => {
    handleMarkRead(n.id);
    setIsOpen(false);
    router.push(n.targetHref);
  };

  const getNotificationIcon = (type: AdminNotification["type"]) => {
    switch (type) {
      case "new_restaurant":
        return <Store size={16} className="text-orange-500" />;
      case "payment_failed":
        return <CreditCard size={16} className="text-red-500" />;
      case "restaurant_verified":
        return <CheckCircle2 size={16} className="text-green-500" />;
      case "support_ticket":
        return <ShieldAlert size={16} className="text-amber-500" />;
      case "sub_expiry":
        return <AlertTriangle size={16} className="text-amber-500" />;
      case "review_spike":
        return <Star size={16} className="text-yellow-500" />;
      case "bug_report":
        return <Bug size={16} className="text-purple-500" />;
      default:
        return <RefreshCw size={16} className="text-blue-500" />;
    }
  };

  return (
    <>
      {/* Bell Trigger Button */}
      <button
        id="notification-bell-trigger"
        onClick={() => setIsOpen(true)}
        className="relative w-[40px] h-[40px] rounded-full bg-[#FAF9F5] border border-[#ECECEC] hover:border-[#FF6B4A]/40 flex items-center justify-center text-[#222222] hover:bg-[#FFF1EE] hover:text-[#FF6B4A] transition-all"
        aria-label="Open notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#FF6B4A] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-xs animate-in zoom-in-50">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Slide-over Notification Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setIsOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white border-l border-[#ECECEC] shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
              {/* Header */}
              <div className="px-5 py-4 border-b border-[#ECECEC] flex items-center justify-between bg-[#FAF9F5]">
                <div className="flex items-center gap-2">
                  <Bell size={18} className="text-[#FF6B4A]" />
                  <h3 className="font-display font-bold text-sm text-[#222222]">
                    Notifications Center
                  </h3>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold bg-[#FF6B4A]/10 text-[#FF6B4A] px-2 py-0.5 rounded-full border border-[#FF6B4A]/20">
                      {unreadCount} unread
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-[11px] font-semibold text-[#FF6B4A] hover:underline px-2 py-1 rounded-md hover:bg-orange-50 transition flex items-center gap-1"
                    >
                      <CheckCheck size={14} />
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[#8C8CA1] hover:text-[#222222] hover:bg-gray-200 transition"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Category Filter Tabs */}
              <div className="flex gap-1 p-2 bg-[#FAF9F5] border-b border-[#ECECEC] overflow-x-auto">
                {["All", "Unread", "Restaurants", "Payments", "Support", "System"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-[12px] text-xs font-semibold whitespace-nowrap transition-all ${
                      activeCategory === cat
                        ? "bg-white text-[#FF6B4A] shadow-xs border border-[#ECECEC]"
                        : "text-[#8C8CA1] hover:text-[#222222]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Notifications List Grouped */}
              <div className="flex-1 overflow-y-auto p-4 space-y-5">
                {Object.entries(groupedNotifications).map(([groupName, items]) => {
                  if (items.length === 0) return null;
                  return (
                    <div key={groupName} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C8CA1]">
                          {groupName}
                        </span>
                        <div className="flex-1 h-[1px] bg-[#ECECEC]" />
                      </div>

                      {items.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => handleNotificationClick(n)}
                          className={`p-3.5 rounded-[18px] border transition-all cursor-pointer relative group ${
                            !n.read
                              ? "bg-[#FFF1EE]/40 border-[#FF6B4A]/30 shadow-xs"
                              : "bg-white border-[#ECECEC] hover:border-[#FF6B4A]/30"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-[12px] bg-white border border-[#ECECEC] flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                              {getNotificationIcon(n.type)}
                            </div>

                            <div className="flex-1 min-w-0 pr-4">
                              <div className="flex items-center justify-between gap-1">
                                <h4 className="text-xs font-bold text-[#222222] truncate">
                                  {n.title}
                                </h4>
                                {!n.read && (
                                  <span className="w-2 h-2 rounded-full bg-[#FF6B4A] shrink-0" />
                                )}
                              </div>
                              <p className="text-[11px] text-[#666666] leading-relaxed mt-0.5 line-clamp-2">
                                {n.description}
                              </p>
                              <span className="text-[10px] text-[#8C8CA1] mt-1.5 block font-medium">
                                {n.timestamp}
                              </span>
                            </div>

                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1 shrink-0">
                              {!n.read && (
                                <button
                                  onClick={(e) => handleMarkRead(n.id, e)}
                                  title="Mark as read"
                                  className="p-1 text-[#8C8CA1] hover:text-[#63B46C] hover:bg-green-50 rounded-md"
                                >
                                  <CheckCircle2 size={14} />
                                </button>
                              )}
                              <button
                                onClick={(e) => handleDelete(n.id, e)}
                                title="Delete"
                                className="p-1 text-[#8C8CA1] hover:text-red-500 hover:bg-red-50 rounded-md"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}

                {filteredNotifications.length === 0 && (
                  <div className="p-12 text-center text-[#8C8CA1]">
                    <Bell size={36} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm font-semibold text-[#222222]">No notifications</p>
                    <p className="text-xs mt-1">You are all caught up!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
