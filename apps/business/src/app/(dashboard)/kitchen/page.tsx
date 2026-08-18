"use client";

import React, { useState, useEffect } from "react";
import { ChefHat, Clock, CheckCircle2, Bell, Sparkles, UserCheck, Loader2 } from "lucide-react";
import { Card, Badge, Button } from "@food-mania/ui";
import { eventBus, OrderPayload, OrderStatus } from "@food-mania/shared";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function BusinessKitchenPage() {
  const [orders, setOrders] = useState<OrderPayload[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchKitchenOrders = () => {
    let rId = "";
    try {
      const stored = localStorage.getItem("fm_restaurant_id");
      if (stored) rId = stored;
    } catch {}

    fetch(`${API_BASE_URL}/orders?restaurantId=${encodeURIComponent(rId)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        const dbOrders = json?.data || json;
        if (Array.isArray(dbOrders)) {
          const mapped: OrderPayload[] = dbOrders.map((o: any) => {
            const raw = (o.status || "pending").toLowerCase();
            const normalized =
              raw === "pending"
                ? "placed"
                : raw === "delivered"
                ? "completed"
                : raw;

            return {
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
              status: normalized as OrderStatus,
              createdAt: o.createdAt,
              updatedAt: o.updatedAt,
              dbId: o.id,
            };
          });
          setOrders(mapped);
        }
      })
      .catch((err) => console.warn("Kitchen orders query error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchKitchenOrders();
    const interval = setInterval(fetchKitchenOrders, 2500);
    const unsubscribe = eventBus.subscribe("*", () => {
      fetchKitchenOrders();
    });
    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  const handleAdvanceStatus = async (orderId: string, nextStatus: string) => {
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
        body: JSON.stringify({ status: nextStatus.toUpperCase() }),
      });
      fetchKitchenOrders();
    } catch (e) {
      console.warn("Backend status update warning:", e);
    }
  };

  const COLUMNS: Array<{ id: OrderStatus; label: string; bg: string }> = [
    { id: "placed", label: "1. Pending KOT", bg: "bg-[#FFF1EE]" },
    { id: "accepted", label: "2. Accepted", bg: "bg-[#FEF9EF]" },
    { id: "preparing", label: "3. In Kitchen", bg: "bg-[#FFF3E8]" },
    { id: "ready", label: "4. Ready to Serve", bg: "bg-[#EFF7EE]" },
    { id: "completed", label: "5. Delivered", bg: "bg-gray-100" },
  ];

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-[24px] shadow-card border border-[#ECECEC]">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#222222] flex items-center gap-2">
            <ChefHat className="text-[#FF6B4A]" />
            <span>Kitchen Display System (KDS Kanban)</span>
          </h1>
          <p className="text-xs text-[#666666] mt-0.5">
            Real-time kitchen order tickets synchronized with PostgreSQL database.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success" size="md">Live Sync Active</Badge>
          <span className="text-xs font-bold text-[#FF6B4A]">{orders.length} Total Orders</span>
        </div>
      </div>

      {/* Kanban Board Columns */}
      {loading ? (
        <div className="py-20 text-center space-y-2 bg-white rounded-[24px] border border-[#ECECEC]">
          <Loader2 className="animate-spin text-[#FF6B4A] mx-auto" size={32} />
          <p className="text-xs text-[#8C8CA1]">Loading live kitchen orders...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {COLUMNS.map((col) => {
            const colOrders = orders.filter((o) => o.status === col.id);
            return (
              <div
                key={col.id}
                className="bg-white rounded-[24px] p-4 border border-[#ECECEC] shadow-card flex flex-col min-h-[500px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#ECECEC]">
                  <h3 className="font-display font-bold text-xs text-[#222222] uppercase tracking-wider">{col.label}</h3>
                  <span className="w-5 h-5 rounded-full bg-[#FAF9F5] border border-[#ECECEC] text-[11px] font-extrabold text-[#FF6B4A] flex items-center justify-center">
                    {colOrders.length}
                  </span>
                </div>

                {/* Column Cards */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {colOrders.length === 0 ? (
                    <p className="text-[11px] text-[#999999] text-center py-8">No tickets</p>
                  ) : (
                    colOrders.map((o) => (
                      <Card
                        key={o.orderId}
                        padding="sm"
                        className={`border border-[#ECECEC] shadow-xs space-y-2.5 ${col.bg}`}
                      >
                        <div className="flex items-center justify-between border-b border-black/5 pb-2">
                          <span className="font-display font-extrabold text-sm text-[#222222]">#{o.orderId}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#222222] shadow-2xs">
                            {o.tableNumber}
                          </span>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-1 text-xs">
                          {o.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between font-medium text-[#222222]">
                              <span>{item.quantity}x {item.name}</span>
                              <span className="text-[#666666]">₹{item.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>

                        {/* Next Action Button */}
                        <div className="pt-2 border-t border-black/5 flex justify-end">
                          {col.id === "placed" && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleAdvanceStatus(o.orderId, "ACCEPTED")}
                              className="w-full text-xs min-h-[36px] bg-[#63B46C] hover:bg-[#4B9A54]"
                            >
                              Accept Order
                            </Button>
                          )}
                          {col.id === "accepted" && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleAdvanceStatus(o.orderId, "PREPARING")}
                              className="w-full text-xs min-h-[36px] bg-[#FF6B4A] hover:bg-[#FF5232]"
                            >
                              Start Preparing
                            </Button>
                          )}
                          {col.id === "preparing" && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleAdvanceStatus(o.orderId, "READY")}
                              className="w-full text-xs min-h-[36px] bg-[#F6B73C] hover:bg-[#E5A62B]"
                            >
                              Mark Ready
                            </Button>
                          )}
                          {col.id === "ready" && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleAdvanceStatus(o.orderId, "COMPLETED")}
                              className="w-full text-xs min-h-[36px] bg-emerald-600 hover:bg-emerald-700"
                            >
                              Deliver Order
                            </Button>
                          )}
                          {col.id === "completed" && (
                            <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                              <CheckCircle2 size={12} /> Order Delivered
                            </span>
                          )}
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
