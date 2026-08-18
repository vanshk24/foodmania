"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  TrendingUp,
  Grid,
  Users,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  Clock,
  Calendar,
} from "lucide-react";
import { Card, Badge, Button } from "@food-mania/ui";
import { eventBus, OrderPayload } from "@food-mania/shared";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function BusinessOverviewPage() {
  const [orders, setOrders] = useState<OrderPayload[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [tablesCount, setTablesCount] = useState({ occupied: 0, total: 12 });
  const [selectedTab, setSelectedTab] = useState<"new" | "preparing" | "ready" | "completed">("new");
  const [restaurantData, setRestaurantData] = useState<any>(null);
  const [restaurantId, setRestaurantId] = useState<string>("");

  useEffect(() => {
    let rId = "";
    try {
      const params = new URLSearchParams(window.location.search);
      const urlRid = params.get("restaurantId");
      const storedRid = localStorage.getItem("fm_restaurant_id");
      rId = urlRid || storedRid || "";
    } catch {}
    setRestaurantId(rId);
    if (!rId) return; // no session — don't load any restaurant

    // 1. Fetch Restaurant details & tables
    fetch(`${API_BASE_URL}/restaurants/${rId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        const data = json?.data || json;
        if (data && data.name) {
          setRestaurantData(data);
          try {
            localStorage.setItem("fm_restaurant_name", data.name);
          } catch {}
          if (Array.isArray(data.tables)) {
            const occupied = data.tables.filter((t: any) => t.status?.toLowerCase() === "occupied" || t.status?.toLowerCase() === "reserved").length;
            setTablesCount({ occupied, total: data.tables.length || 12 });
          }
        }
      })
      .catch(() => {});

    // 2. Fetch Live Orders
    const fetchOverviewOrders = () => {
      fetch(`${API_BASE_URL}/orders?restaurantId=${encodeURIComponent(rId)}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((json) => {
          const dbOrders = json?.data || json;
          if (Array.isArray(dbOrders)) {
            const mapped: OrderPayload[] = dbOrders.map((o: any) => ({
              orderId: o.orderNumber || o.id,
              restaurantId: o.restaurantId,
              restaurantName: o.restaurant?.name || (typeof window !== "undefined" ? localStorage.getItem("fm_restaurant_name") : "") || "My Restaurant",
              tableNumber: o.table?.tableNumber ? `Table ${o.table.tableNumber}` : (o.deliveryAddress || "Dine-In"),
              customerName: o.customerName || "Customer",
              customerPhone: o.customerPhone || "",
              items: (o.items || []).map((item: any) => ({
                id: item.menuItemId || item.id,
                name: item.name || item.menuItem?.name || "Dish Item",
                price: Number(item.price),
                quantity: item.quantity,
                isVeg: true,
              })),
              totalAmount: Number(o.totalAmount),
              status: (o.status?.toLowerCase() === "pending" ? "placed" : o.status?.toLowerCase() || "placed") as any,
              createdAt: o.createdAt,
              updatedAt: o.updatedAt,
              dbId: o.id,
            }));
            setOrders(mapped);
          }
        })
        .catch(() => {});
    };

    // 3. Fetch Live Reservations
    const fetchOverviewReservations = () => {
      fetch(`${API_BASE_URL}/bookings?restaurantId=${encodeURIComponent(rId)}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((json) => {
          const dbBookings = json?.data || json;
          if (Array.isArray(dbBookings)) {
            setReservations(dbBookings.slice(0, 4));
          }
        })
        .catch(() => {});
    };

    fetchOverviewOrders();
    fetchOverviewReservations();

    const interval = setInterval(() => {
      fetchOverviewOrders();
      fetchOverviewReservations();
    }, 3000);

    const unsubscribe = eventBus.subscribe("*", () => {
      fetchOverviewOrders();
      fetchOverviewReservations();
    });

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  const handleAccept = async (orderId: string) => {
    const targetOrder = orders.find((o) => o.orderId === orderId);
    const idToUpdate = (targetOrder as any)?.dbId || orderId;
    const token = typeof window !== "undefined" ? localStorage.getItem("fm_biz_token") || "" : "";

    try {
      await fetch(`${API_BASE_URL}/orders/${idToUpdate}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: "ACCEPTED" }),
      });
      setOrders((prev) =>
        prev.map((o) => (o.orderId === orderId ? { ...o, status: "accepted" as any } : o))
      );
    } catch (e) {
      console.warn("Overview order accept error:", e);
    }
  };

  // Dynamic Live Metrics Calculations
  const todayOrdersCount = orders.length;
  const todayRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const activeTablesDisplay = `${tablesCount.occupied} / ${tablesCount.total}`;
  const pendingCount = orders.filter((o) => o.status === "placed" || o.status === "preparing").length;

  const METRICS = [
    { label: "Today's Orders", value: `${todayOrdersCount}`, change: `Live PostgreSQL Orders`, isPositive: true, icon: ShoppingBag, color: "text-[#63B46C]" },
    { label: "Total Revenue", value: `₹${todayRevenue.toLocaleString()}`, change: `Authoritative DB Sum`, isPositive: true, icon: TrendingUp, color: "text-[#FF6B4A]" },
    { label: "Active Tables", value: activeTablesDisplay, change: `${Math.round((tablesCount.occupied / tablesCount.total) * 100)}% Occupied`, isPositive: true, icon: Grid, color: "text-[#F6B73C]" },
    { label: "Pending KOTs", value: `${pendingCount}`, change: `Active Kitchen Tasks`, isPositive: true, icon: Users, color: "text-[#68B8F8]" },
  ];

  const filteredOrders = orders.filter((o) => {
    if (selectedTab === "new") return o.status === "placed";
    if (selectedTab === "preparing") return o.status === "accepted" || o.status === "preparing";
    if (selectedTab === "ready") return o.status === "ready";
    if (selectedTab === "completed") return o.status === "completed";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* ── 1. Top Metrics Cards (Live Backend Calculations) ───── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {METRICS.map((m) => {
          const IconComp = m.icon;
          return (
            <div
              key={m.label}
              className="bg-white rounded-[24px] p-5 border border-[#ECECEC] shadow-card space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#666666]">{m.label}</span>
                <div className={`w-9 h-9 rounded-full bg-[#FAF9F5] flex items-center justify-center ${m.color}`}>
                  <IconComp size={18} />
                </div>
              </div>
              <div>
                <p className="font-display font-extrabold text-2xl text-[#222222]">{m.value}</p>
                <p className="text-[11px] text-[#63B46C] font-bold mt-1">{m.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── 2. Live Orders & Summary Grid ──────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Live Orders Console */}
        <div className="lg:col-span-2 bg-white rounded-[24px] p-6 border border-[#ECECEC] shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-lg text-[#222222]">Live Orders</h3>
            <Link href="/orders" className="text-xs text-[#FF6B4A] font-bold hover:underline">
              View All Orders →
            </Link>
          </div>

          {/* Status Tabs */}
          <div className="flex bg-[#FAF9F5] p-1 rounded-[16px] border border-[#ECECEC] text-xs font-semibold">
            {[
              { id: "new", label: `New (${orders.filter((o) => o.status === "placed").length})` },
              { id: "preparing", label: `Preparing (${orders.filter((o) => o.status === "accepted" || o.status === "preparing").length})` },
              { id: "ready", label: `Ready (${orders.filter((o) => o.status === "ready").length})` },
              { id: "completed", label: `Completed (${orders.filter((o) => o.status === "completed").length})` },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTab(t.id as any)}
                className={`flex-1 py-2 rounded-[12px] transition-all ${
                  selectedTab === t.id ? "bg-[#63B46C] text-white font-bold shadow-sm" : "text-[#666666]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Live Order Rows */}
          <div className="space-y-3">
            {filteredOrders.length === 0 ? (
              <p className="text-xs text-[#8C8CA1] py-8 text-center">No orders currently in {selectedTab} status.</p>
            ) : (
              filteredOrders.slice(0, 5).map((o) => (
                <div
                  key={o.orderId}
                  className="flex items-center justify-between p-3.5 bg-[#FAF9F5] rounded-[18px] border border-[#ECECEC] text-xs text-[#222222]"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[#63B46C]">#{o.orderId}</span>
                    <span className="font-bold">{o.customerName}</span>
                    <span className="bg-white px-2 py-0.5 rounded-full border border-gray-200 text-[#666666]">
                      {o.tableNumber}
                    </span>
                    <span className="text-[#666666]">{o.items.length} items</span>
                    <span className="font-bold text-[#FF6B4A]">₹{o.totalAmount}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {o.status === "placed" ? (
                      <button
                        onClick={() => handleAccept(o.orderId)}
                        className="bg-[#63B46C] hover:bg-[#4B9A54] text-white px-4 py-1.5 rounded-[12px] font-bold text-xs shadow-sm transition-all"
                      >
                        Accept
                      </button>
                    ) : (
                      <span className="bg-[#EFF7EE] text-[#63B46C] font-bold px-3 py-1 rounded-full uppercase text-[10px]">
                        {o.status}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Live Table Reservations */}
        <div className="bg-white rounded-[24px] p-6 border border-[#ECECEC] shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-[#222222]">Live Reservations</h3>
            <Link href="/reservations" className="text-xs text-[#FF6B4A] font-bold hover:underline">
              View All →
            </Link>
          </div>

          <div className="space-y-3">
            {reservations.length === 0 ? (
              <p className="text-xs text-[#8C8CA1] py-8 text-center">No upcoming table reservations.</p>
            ) : (
              reservations.map((r: any) => (
                <div
                  key={r.id || r.bookingCode}
                  className="p-3 bg-[#FAF9F5] rounded-[16px] border border-[#ECECEC] space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#222222]">{r.guestName || "Guest"}</span>
                    <Badge variant="warning" size="sm">
                      {r.tableId ? `Table ${r.tableId}` : "Reserved"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#666666]">
                    <span>{r.guestCount} Guests • {r.timeSlot}</span>
                    <span className="font-mono text-[#63B46C] font-bold">{r.bookingCode}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
