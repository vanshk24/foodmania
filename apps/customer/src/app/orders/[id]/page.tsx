"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  MapPin,
  ChefHat,
  Bell,
  ChevronRight,
  Utensils,
  Receipt,
  Sparkles,
  BellRing,
} from "lucide-react";
import { Button, Card, Badge } from "@food-mania/ui";
import { eventBus, OrderPayload, OrderStatus } from "@food-mania/shared";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface OrderTrackingProps {
  params: { id: string };
}

export default function OrderTrackingScreen({ params }: OrderTrackingProps) {
  const [order, setOrder] = useState<OrderPayload | null>(null);
  const [lastEventToast, setLastEventToast] = useState<string | null>(null);

  const fetchOrderDetail = () => {
    fetch(`${API_BASE_URL}/orders/${params.id}`)
      .then((res) => res.json())
      .then((json) => {
        const o = json.data || json;
        if (o && (o.id || o.orderNumber)) {
          const mapped: OrderPayload = {
            orderId: o.orderNumber || o.id,
            restaurantId: o.restaurantId,
            restaurantName: "The Urban Cafe",
            tableNumber: o.tableId ? "Table 04" : (o.deliveryAddress || "Takeaway"),
            customerName: o.customerName || "Customer",
            customerPhone: o.customerPhone || "+91 98765 43210",
            items: (o.items || []).map((item: any) => ({
              id: item.menuItemId || item.id,
              name: item.name || item.menuItem?.name || "Dish Item",
              price: item.price,
              quantity: item.quantity,
              isVeg: true,
            })),
            totalAmount: o.totalAmount,
            status: (o.status?.toLowerCase() || "pending") as OrderStatus,
            createdAt: o.createdAt,
            updatedAt: o.updatedAt,
          };
          setOrder(mapped);
        }
      })
      .catch((err) => console.warn("Backend order detail fetch warning:", err));
  };

  useEffect(() => {
    fetchOrderDetail();
    const interval = setInterval(fetchOrderDetail, 2500);
    const unsubscribe = eventBus.subscribe("*", (msg) => {
      fetchOrderDetail();
      setLastEventToast(`Status Updated Live: ${msg.type}`);
      setTimeout(() => setLastEventToast(null), 4000);
    });

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, [params.id]);

  if (!order) {
    return (
      <div className="min-h-screen bg-[#F5F6FA] flex items-center justify-center p-4 text-center">
        <Card padding="lg" className="space-y-3 max-w-sm">
          <Utensils size={40} className="text-[#FF6B00] mx-auto" />
          <h2 className="font-display font-bold text-lg text-[#1A1A2E]">Loading Order Status...</h2>
          <Link href="/orders">
            <Button variant="outline" size="sm">Back to My Orders</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const rawStatus = (order.status || "pending").toLowerCase();
  const isPending = rawStatus === "pending" || rawStatus === "placed";
  const isAccepted = rawStatus === "accepted";
  const isPreparing = rawStatus === "preparing";
  const isReady = rawStatus === "ready";
  const isDelivered = rawStatus === "delivered" || rawStatus === "completed";

  const progressPercent = isDelivered ? 100 : isReady ? 80 : isPreparing ? 60 : isAccepted ? 40 : 20;

  const getStatusLabel = () => {
    if (isDelivered) return "DELIVERED";
    if (isReady) return "READY";
    if (isPreparing) return "PREPARING";
    if (isAccepted) return "ACCEPTED";
    return "PENDING";
  };

  return (
    <div className="min-h-screen bg-[#F5F6FA] pb-28">
      {/* ── 1. Sticky Header ───────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 h-14 flex items-center justify-between shadow-sm">
        <Link
          href="/orders"
          className="w-[44px] h-[44px] rounded-full bg-[#F8F9FA] border border-gray-100 flex items-center justify-center text-[#1A1A2E] hover:bg-[#FFF3E8] hover:text-[#FF6B00] active:scale-95 transition-all"
          aria-label="Back to orders"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="text-center">
          <h1 className="font-display font-bold text-base text-[#1A1A2E]">Live Order Status</h1>
          <p className="text-[10px] text-[#8C8CA1] font-medium">Order #{order.orderId} • {order.tableNumber}</p>
        </div>
        <button
          onClick={() => {}}
          className="w-[44px] h-[44px] rounded-full bg-[#F8F9FA] border border-gray-100 flex items-center justify-center text-[#FF6B00] hover:bg-[#FFF3E8] transition-colors"
          aria-label="Call waiter"
        >
          <Bell size={20} />
        </button>
      </header>

      {/* ── Main Container ─────────────────────────────────── */}
      <main className="max-w-3xl mx-auto px-4 pt-4 space-y-4">
        {/* Real-time Event Toast Banner */}
        <AnimatePresence>
          {lastEventToast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 bg-[#ECFDF5] border border-[#10B981]/40 rounded-[12px] flex items-center justify-between text-xs text-[#065F46] font-bold shadow-sm"
            >
              <div className="flex items-center gap-2">
                <BellRing size={16} className="animate-bounce text-[#10B981]" />
                <span>{lastEventToast}</span>
              </div>
              <span className="text-[10px] bg-[#10B981] text-white px-2 py-0.5 rounded-full">REALTIME UPDATE</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── 2. Live Status Hero Card ────────────────────────── */}
        <Card padding="lg" className="bg-gradient-to-br from-[#1A1A2E] to-[#2E2E4A] text-white shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#FF6B00] text-white flex items-center justify-center">
                <ChefHat size={22} />
              </div>
              <div>
                <Badge variant={isDelivered ? "success" : "orange"} size="sm">
                  {getStatusLabel()}
                </Badge>
                <h2 className="font-display font-bold text-lg text-white mt-1">{order.restaurantName}</h2>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-300 uppercase tracking-wider font-bold">Status</p>
              <p className="font-display font-bold text-xl text-[#FF6B00]">
                {isDelivered ? "Delivered 🎉" : isReady ? "Ready to Serve!" : isPreparing ? "Preparing 🔥" : isAccepted ? "Accepted 👨‍🍳" : "Pending ⏳"}
              </p>
            </div>
          </div>

          {/* Animated Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-gray-300 font-medium">
              <span>Status: {getStatusLabel()}</span>
              <span>{progressPercent}% Complete</span>
            </div>
            <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden p-0.5">
              <motion.div
                initial={{ width: "20%" }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-[#FF6B00] to-[#10B981] rounded-full shadow-sm"
              />
            </div>
          </div>
        </Card>

        {/* ── 3. Step-by-Step Timeline (Pending -> Accepted -> Preparing -> Ready -> Delivered) ── */}
        <Card padding="md" className="space-y-4 bg-white shadow-sm">
          <h3 className="font-display font-bold text-base text-[#1A1A2E] flex items-center gap-2 border-b border-gray-100 pb-2">
            <Clock size={18} className="text-[#FF6B00]" />
            <span>Order Progression</span>
          </h3>

          <div className="space-y-4 pl-2">
            {/* Step 1: Pending */}
            <div className="flex items-start gap-3.5 relative">
              <div className={`absolute left-4 top-7 bottom-0 w-0.5 ${isAccepted || isPreparing || isReady || isDelivered ? "bg-[#10B981]" : "bg-gray-200"}`} />
              <div className="w-8 h-8 rounded-full bg-[#ECFDF5] text-[#10B981] flex items-center justify-center text-xs font-bold z-10">
                ✓
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-sm text-[#1A1A2E]">1. Pending (Order Placed)</h4>
                  <span className="text-[11px] text-[#8C8CA1]">Saved to PostgreSQL</span>
                </div>
                <p className="text-xs text-[#8C8CA1] mt-0.5">Order received and waiting for kitchen acceptance.</p>
              </div>
            </div>

            {/* Step 2: Accepted */}
            <div className="flex items-start gap-3.5 relative">
              <div className={`absolute left-4 top-7 bottom-0 w-0.5 ${isPreparing || isReady || isDelivered ? "bg-[#10B981]" : "bg-gray-200"}`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10 ${
                isAccepted || isPreparing || isReady || isDelivered
                  ? "bg-[#ECFDF5] text-[#10B981]"
                  : "bg-gray-100 text-gray-400"
              }`}>
                {isAccepted || isPreparing || isReady || isDelivered ? "✓" : "2"}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className={`font-display font-bold text-sm ${isAccepted ? "text-[#FF6B00]" : "text-[#1A1A2E]"}`}>
                    2. Accepted
                  </h4>
                  <span className="text-[11px] text-[#8C8CA1]">{isAccepted ? "Active" : ""}</span>
                </div>
                <p className="text-xs text-[#8C8CA1] mt-0.5">Kitchen manager reviewed and accepted the order ticket.</p>
              </div>
            </div>

            {/* Step 3: Preparing */}
            <div className="flex items-start gap-3.5 relative">
              <div className={`absolute left-4 top-7 bottom-0 w-0.5 ${isReady || isDelivered ? "bg-[#10B981]" : "bg-gray-200"}`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10 ${
                isPreparing
                  ? "bg-[#FFF3E8] text-[#FF6B00] ring-4 ring-[#FF6B00]/20 animate-pulse"
                  : isReady || isDelivered
                  ? "bg-[#ECFDF5] text-[#10B981]"
                  : "bg-gray-100 text-gray-400"
              }`}>
                {isReady || isDelivered ? "✓" : "3"}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className={`font-display font-bold text-sm ${isPreparing ? "text-[#FF6B00]" : "text-[#1A1A2E]"}`}>
                    3. Preparing
                  </h4>
                  <span className="text-[11px] text-[#8C8CA1]">{isPreparing ? "In Progress" : ""}</span>
                </div>
                <p className="text-xs text-[#8C8CA1] mt-0.5">Chef is cooking your dishes in the kitchen.</p>
              </div>
            </div>

            {/* Step 4: Ready */}
            <div className="flex items-start gap-3.5 relative">
              <div className={`absolute left-4 top-7 bottom-0 w-0.5 ${isDelivered ? "bg-[#10B981]" : "bg-gray-200"}`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10 ${
                isDelivered
                  ? "bg-[#ECFDF5] text-[#10B981]"
                  : isReady
                  ? "bg-[#FFF3E8] text-[#FF6B00] ring-4 ring-[#FF6B00]/20 animate-pulse"
                  : "bg-gray-100 text-gray-400"
              }`}>
                {isDelivered ? "✓" : "4"}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className={`font-display font-bold text-sm ${isReady ? "text-[#FF6B00]" : "text-[#1A1A2E]"}`}>
                    4. Ready
                  </h4>
                  <span className="text-[11px] text-[#8C8CA1]">{isReady ? "Ready to Serve" : ""}</span>
                </div>
                <p className="text-xs text-[#8C8CA1] mt-0.5">Dishes are plated and ready for pickup or server delivery.</p>
              </div>
            </div>

            {/* Step 5: Delivered */}
            <div className="flex items-start gap-3.5 relative">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10 ${
                isDelivered
                  ? "bg-[#ECFDF5] text-[#10B981]"
                  : "bg-gray-100 text-gray-400"
              }`}>
                {isDelivered ? "✓" : "5"}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className={`font-display font-bold text-sm ${isDelivered ? "text-[#10B981]" : "text-[#1A1A2E]"}`}>
                    5. Delivered
                  </h4>
                  <span className="text-[11px] text-[#10B981] font-bold">{isDelivered ? "Enjoy your meal!" : ""}</span>
                </div>
                <p className="text-xs text-[#8C8CA1] mt-0.5">Order has been delivered and served to your table.</p>
              </div>
            </div>
          </div>
        </Card>

        {/* ── 4. Ordered Items Breakdown Card ─────────────────── */}
        <Card padding="md" className="space-y-3 bg-white shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h3 className="font-display font-bold text-sm text-[#1A1A2E]">Items in this Order</h3>
            <span className="text-xs text-[#8C8CA1]">{order.items.length} item(s)</span>
          </div>
          <div className="space-y-2">
            {order.items.map((i, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs py-1">
                <span className="text-[#1A1A2E] font-medium">{i.quantity}x {i.name}</span>
                <span className="text-[#4A4A68] font-bold">₹{i.price * i.quantity}</span>
              </div>
            ))}
          </div>
          <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-sm font-bold text-[#1A1A2E]">
            <span>Total Paid</span>
            <span className="text-[#FF6B00]">₹{order.totalAmount}</span>
          </div>
        </Card>
      </main>

      {/* ── 5. Sticky Call Staff Action ──────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-100 p-4 shadow-lg">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Button
            variant="outline"
            size="lg"
            className="flex-1 min-h-[48px]"
            onClick={() => {
              // Call waiter trigger
            }}
          >
            <Bell size={18} />
            <span>Call Waiter</span>
          </Button>
          <Link href="/restaurant/the-urban-cafe/menu" className="flex-1">
            <Button variant="primary" size="lg" fullWidth className="min-h-[48px]">
              <span>+ Add More Items</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
