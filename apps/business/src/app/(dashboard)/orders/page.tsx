"use client";

import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  Clock,
  Utensils,
  CheckCircle2,
  ChefHat,
  BellRing,
  XCircle,
  Sparkles,
  Filter,
  Search,
  CreditCard,
  Calendar,
  ShieldAlert,
} from "lucide-react";
import { Card, Badge, Button } from "@food-mania/ui";
import { eventBus, OrderPayload, OrderStatus } from "@food-mania/shared";
import { motion, AnimatePresence } from "framer-motion";

export type PaymentLifecycleStatus = "PENDING_PAYMENT" | "PAYMENT_PROCESSING" | "PAID" | "PAYMENT_FAILED" | "REFUNDED";

export interface BusinessOrder extends OrderPayload {
  dbId: string;
  paymentStatus: PaymentLifecycleStatus;
  paymentMethod?: string;
  paymentAmount?: number;
  paymentTime?: string;
  gatewayPaymentId?: string;
}

const STATUS_FILTERS: Array<{ id: string; label: string }> = [
  { id: "all", label: "All Orders" },
  { id: "placed", label: "New Incoming" },
  { id: "accepted", label: "Accepted" },
  { id: "preparing", label: "In Kitchen" },
  { id: "ready", label: "Ready to Serve" },
  { id: "completed", label: "Completed" },
];

import { getApiBaseUrl } from "@food-mania/shared";

const API_BASE_URL = getApiBaseUrl();

export default function BusinessOrdersPage() {
  const [orders, setOrders] = useState<BusinessOrder[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [lastEventToast, setLastEventToast] = useState<string | null>(null);

  const fetchBusinessOrders = () => {
    let restaurantId = "";
    let token = "";
    if (typeof window !== "undefined") {
      try {
        const storedId = localStorage.getItem("fm_restaurant_id");
        if (storedId) restaurantId = storedId;
        if (!restaurantId) {
          const u = localStorage.getItem("fm_biz_user");
          if (u) {
            const parsed = JSON.parse(u);
            if (parsed.restaurantId) restaurantId = parsed.restaurantId;
          }
        }
        token = localStorage.getItem("fm_token") || localStorage.getItem("food_mania_token") || "";
      } catch {}
    }

    const qStr = restaurantId ? `?restaurantId=${encodeURIComponent(restaurantId)}` : "";
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    fetch(`${API_BASE_URL}/orders${qStr}`, { headers })
      .then((res) => res.json())
      .then((json) => {
        const dbOrders = json.data || json;
        if (Array.isArray(dbOrders)) {
          const mapped: BusinessOrder[] = dbOrders.map((o: any) => ({
            orderId: o.orderNumber || o.id,
            restaurantId: o.restaurantId,
            restaurantName: o.restaurant?.name || (typeof window !== "undefined" ? localStorage.getItem("fm_restaurant_name") : "") || "My Restaurant",
            tableNumber: o.table?.tableNumber ? `Table ${o.table.tableNumber}` : (o.deliveryAddress || "Dine-In"),
            customerName: o.customerName || "Customer",
            customerPhone: o.customerPhone || "",
            items: (o.items || []).map((item: any) => ({
              id: item.menuItemId || item.id,
              name: item.name || item.menuItem?.name || "Dish Item",
              price: item.price,
              quantity: item.quantity,
              isVeg: true,
            })),
            totalAmount: o.totalAmount,
            status: (o.status?.toLowerCase() === "pending" ? "placed" : o.status?.toLowerCase() || "placed") as OrderStatus,
            paymentStatus: (o.paymentStatus || "PENDING_PAYMENT") as PaymentLifecycleStatus,
            paymentMethod: o.paymentMethod || o.payment?.method || "CARD",
            paymentAmount: o.payment?.amount || o.totalAmount,
            paymentTime: o.payment?.createdAt || o.createdAt,
            gatewayPaymentId: o.payment?.gatewayPaymentId || undefined,
            createdAt: o.createdAt,
            updatedAt: o.updatedAt,
            dbId: o.id,
          }));
          setOrders(mapped);
        }
      })
      .catch((err) => console.warn("Backend orders fetch warning:", err));
  };

  useEffect(() => {
    fetchBusinessOrders();
    const interval = setInterval(fetchBusinessOrders, 2500);
    const unsubscribe = eventBus.subscribe("*", (msg) => {
      fetchBusinessOrders();
      setLastEventToast(`Real-Time Event: ${msg.type} for Order #${(msg.payload as OrderPayload).orderId || (msg.payload as any).orderId}`);
      setTimeout(() => setLastEventToast(null), 4000);
    });

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  const handleStatusChange = (orderId: string, nextStatus: OrderStatus) => {
    const targetOrder = orders.find((o) => o.orderId === orderId);
    const idToUpdate = targetOrder?.dbId || orderId;
    const token = typeof window !== "undefined" ? localStorage.getItem("fm_biz_token") || "" : "";

    fetch(`${API_BASE_URL}/orders/${idToUpdate}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ status: nextStatus.toUpperCase() }),
    })
      .then(() => fetchBusinessOrders())
      .catch((e) => console.warn("Backend order status patch warning:", e));
  };

  const filteredOrders = orders.filter((o) => {
    const matchesFilter = selectedFilter === "all" || o.status === selectedFilter;
    const matchesSearch =
      o.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.tableNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getPaymentBadge = (status: PaymentLifecycleStatus) => {
    switch (status) {
      case "PAID":
        return { label: "PAID", variant: "success" as const, bg: "bg-[#ECFDF5] text-[#10B981] border-[#10B981]/30" };
      case "PAYMENT_PROCESSING":
        return { label: "PROCESSING", variant: "info" as const, bg: "bg-[#EFF6FF] text-[#3B82F6] border-[#3B82F6]/30" };
      case "PAYMENT_FAILED":
        return { label: "PAYMENT FAILED", variant: "danger" as const, bg: "bg-[#FEF2F2] text-[#EF4444] border-[#EF4444]/30" };
      case "REFUNDED":
        return { label: "REFUNDED", variant: "danger" as const, bg: "bg-[#FAF5FF] text-[#8B5CF6] border-[#8B5CF6]/30" };
      case "PENDING_PAYMENT":
      default:
        return { label: "PENDING PAYMENT", variant: "orange" as const, bg: "bg-[#FFF7ED] text-[#EA580C] border-[#EA580C]/30" };
    }
  };

  return (
    <div className="space-y-5">
      {/* ── Header Bar ───────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-[16px] shadow-sm border border-gray-100">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#1A1A2E] flex items-center gap-2">
            <ShoppingBag className="text-[#FF6B00]" />
            <span>Live Orders Console</span>
          </h1>
          <p className="text-xs text-[#8C8CA1] mt-0.5">
            Real-time PostgreSQL feed with server-verified totals, payment state, and kitchen routing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="orange" size="md">
            LIVE EVENTS ACTIVE
          </Badge>
          <Badge variant="success" size="md">
            {orders.filter((o) => o.status !== "completed" && o.status !== "cancelled").length} Active Orders
          </Badge>
        </div>
      </div>

      {/* Real-time Event Toast Banner */}
      <AnimatePresence>
        {lastEventToast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 bg-[#FFF3E8] border border-[#FF6B00]/40 rounded-[12px] flex items-center justify-between text-xs text-[#FF6B00] font-bold shadow-sm"
          >
            <div className="flex items-center gap-2">
              <BellRing size={16} className="animate-bounce text-[#FF6B00]" />
              <span>{lastEventToast}</span>
            </div>
            <span className="text-[10px] bg-[#FF6B00] text-white px-2 py-0.5 rounded-full">BROADCASTED</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Search & Filter Controls ─────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none w-full sm:w-auto pb-1">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id)}
              className={`px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedFilter === f.id
                  ? "bg-[#FF6B00] text-white border-[#FF6B00] shadow-sm"
                  : "bg-white text-[#4A4A68] border-gray-100 hover:bg-gray-100"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8CA1]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order ID, table..."
            className="w-full bg-white border border-gray-100 rounded-[10px] pl-9 pr-3 py-2 text-xs text-[#1A1A2E] placeholder:text-[#8C8CA1] focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 min-h-[40px]"
          />
        </div>
      </div>

      {/* ── Orders Grid ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredOrders.length === 0 ? (
            <div className="col-span-full py-12 text-center bg-white rounded-[16px] border border-gray-100 shadow-sm">
              <Utensils size={40} className="text-[#8C8CA1] mx-auto mb-2 opacity-50" />
              <h3 className="font-display font-bold text-base text-[#1A1A2E]">No Orders Found</h3>
              <p className="text-xs text-[#8C8CA1] mt-1">No orders match the selected status filter.</p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const statusBadgeVariant =
                order.status === "completed"
                  ? "success"
                  : order.status === "preparing"
                  ? "warning"
                  : order.status === "placed"
                  ? "orange"
                  : order.status === "cancelled"
                  ? "danger"
                  : "info";

              const payBadge = getPaymentBadge(order.paymentStatus);

              return (
                <motion.div
                  key={order.orderId}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-[16px] border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col justify-between"
                >
                  {/* Card Header */}
                  <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-[#FFF3E8]/30 to-white">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-base text-[#1A1A2E]">
                          #{order.orderId}
                        </span>
                        <Badge variant="orange" size="sm">
                          {order.tableNumber}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-[#8C8CA1] font-medium mt-0.5">
                        {order.customerName} • {order.customerPhone}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <Badge variant={statusBadgeVariant} size="md">
                        {order.status.toUpperCase()}
                      </Badge>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${payBadge.bg}`}>
                        {payBadge.label}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-4 space-y-2 flex-1">
                    <div className="space-y-1.5 text-xs text-[#1A1A2E]">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center py-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#FF6B00]">{item.quantity}x</span>
                            <span>{item.name}</span>
                          </div>
                          <span className="font-semibold text-[#8C8CA1]">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    {order.specialInstructions && (
                      <div className="mt-2 p-2 bg-[#FFF3E8]/60 border border-[#FF6B00]/20 rounded-[8px] text-[11px] text-[#FF6B00]">
                        <strong>Note:</strong> {order.specialInstructions}
                      </div>
                    )}

                    {/* ── Business Payment Visibility Block ──────────── */}
                    <div className="mt-3 pt-2.5 border-t border-dashed border-gray-200 text-[11px] space-y-1 text-[#4A4A68] bg-[#F8F9FA] p-2.5 rounded-[10px]">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-1 text-[#8C8CA1]">
                          <CreditCard size={12} />
                          <span>Payment Mode</span>
                        </span>
                        <span className="font-bold text-[#1A1A2E] uppercase">{order.paymentMethod || "CARD"}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-[#8C8CA1]">Payment State</span>
                        <span className="font-semibold text-[#1A1A2E]">{order.paymentStatus}</span>
                      </div>

                      {order.gatewayPaymentId && (
                        <div className="flex justify-between items-center">
                          <span className="text-[#8C8CA1]">Gateway Txn ID</span>
                          <span className="font-mono text-[10px] text-[#3B82F6]">{order.gatewayPaymentId}</span>
                        </div>
                      )}

                      {order.paymentTime && (
                        <div className="flex justify-between items-center text-[10px] text-[#8C8CA1]">
                          <span>Timestamp</span>
                          <span>{new Date(order.paymentTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer & Action Triggers */}
                  <div className="p-4 bg-[#F8F9FA] border-t border-gray-100 space-y-3">
                    <div className="flex justify-between items-center text-xs font-bold text-[#1A1A2E]">
                      <span>Server Total</span>
                      <span className="text-[#FF6B00] text-sm">₹{order.totalAmount}</span>
                    </div>

                    {/* Real-time Status Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {order.status === "placed" && (
                        <>
                          <Button
                            variant="primary"
                            size="sm"
                            fullWidth
                            onClick={() => handleStatusChange(order.orderId, "accepted")}
                          >
                            Accept Order
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            fullWidth
                            onClick={() => handleStatusChange(order.orderId, "cancelled")}
                          >
                            Reject
                          </Button>
                        </>
                      )}

                      {order.status === "accepted" && (
                        <Button
                          variant="primary"
                          size="sm"
                          fullWidth
                          className="col-span-2"
                          onClick={() => handleStatusChange(order.orderId, "preparing")}
                        >
                          <ChefHat size={14} />
                          <span>Start Preparing</span>
                        </Button>
                      )}

                      {order.status === "preparing" && (
                        <Button
                          variant="primary"
                          size="sm"
                          fullWidth
                          className="col-span-2"
                          onClick={() => handleStatusChange(order.orderId, "ready")}
                        >
                          <BellRing size={14} />
                          <span>Mark Ready to Serve</span>
                        </Button>
                      )}

                      {order.status === "ready" && (
                        <Button
                          variant="primary"
                          size="sm"
                          fullWidth
                          className="col-span-2 bg-[#10B981] hover:bg-[#059669]"
                          onClick={() => handleStatusChange(order.orderId, "completed")}
                        >
                          <CheckCircle2 size={14} />
                          <span>Mark Completed</span>
                        </Button>
                      )}

                      {order.status === "completed" && (
                        <div className="col-span-2 text-center text-xs text-[#10B981] font-bold py-1 bg-[#ECFDF5] rounded-[8px]">
                          ✓ Order Completed
                        </div>
                      )}

                      {order.status === "cancelled" && (
                        <div className="col-span-2 text-center text-xs text-[#EF4444] font-bold py-1 bg-[#FEE2E2] rounded-[8px]">
                          ✕ Order Cancelled
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
