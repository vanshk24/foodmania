"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Clock, Star, ChevronRight, CheckCircle2, MessageSquare, Sparkles, Upload } from "lucide-react";
import { BottomNav } from "@/components/layouts/BottomNav";
import { Card, Badge, Button, Modal } from "@food-mania/ui";
import { eventBus, OrderPayload } from "@food-mania/shared";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function OrdersPage() {
  const [tab, setTab] = useState<"current" | "past">("current");
  const [orders, setOrders] = useState<OrderPayload[]>([]);

  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedOrderForReview, setSelectedOrderForReview] = useState<OrderPayload | null>(null);
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const fetchLiveOrders = () => {
    fetch(`${API_BASE_URL}/orders`)
      .then((res) => res.json())
      .then((json) => {
        const dbOrders = json.data || json;
        if (Array.isArray(dbOrders)) {
          const mapped: OrderPayload[] = dbOrders.map((o: any) => ({
            orderId: o.orderNumber || o.id,
            restaurantId: o.restaurantId,
            restaurantName: o.restaurantName || o.restaurant?.name || "Dining Restaurant",
            tableNumber: o.tableId || (o.deliveryAddress || "Takeaway"),
            customerName: o.customerName || "Customer",
            customerPhone: o.customerPhone || "+91 98765 43210",
            paymentStatus: o.paymentStatus || "PENDING_PAYMENT",
            items: (o.items || []).map((item: any) => ({
              id: item.menuItemId || item.id,
              name: item.name || item.menuItem?.name || "Dish Item",
              price: item.price,
              quantity: item.quantity,
              isVeg: true,
            })),
            totalAmount: o.totalAmount,
            status: (o.status?.toLowerCase() || "pending") as any,
            createdAt: o.createdAt,
            updatedAt: o.updatedAt,
          }));
          setOrders(mapped);
        }
      })
      .catch((err) => console.warn("Backend orders query error:", err));
  };

  useEffect(() => {
    fetchLiveOrders();
    const interval = setInterval(fetchLiveOrders, 2500);
    const unsubscribe = eventBus.subscribe("*", () => {
      fetchLiveOrders();
    });
    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);


  const currentOrders = orders.filter((o) => o.status !== "completed" && o.status !== "cancelled");
  const pastOrders = orders.filter((o) => o.status === "completed" || o.status === "cancelled");

  const openReviewModal = (o: OrderPayload) => {
    setSelectedOrderForReview(o);
    setRating(5);
    setReviewComment("");
    setReviewSubmitted(false);
    setIsReviewModalOpen(true);
  };

  const handleReviewSubmit = async () => {
    try {
      if (selectedOrderForReview) {
        await fetch(`${API_BASE_URL}/reviews`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            restaurantId: selectedOrderForReview.restaurantId,
            rating,
            comment: reviewComment || "Great food and service!",
            customerName: "Gaurav Sharma",
          }),
        });
      }
    } catch (e) {
      console.warn("Review submission API warning:", e);
    }
    setReviewSubmitted(true);
    setTimeout(() => {
      setIsReviewModalOpen(false);
    }, 1800);
  };


  return (
    <div className="min-h-screen bg-[#F5F6FA] pb-24 overflow-x-hidden">
      {/* ── Header Bar ───────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-white px-4 pt-safe-top pb-3 border-b border-gray-100 shadow-sm">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="font-display font-bold text-xl text-[#1A1A2E]">My Orders</h1>
            <Badge variant="orange" size="sm">LIVE EVENTS SYNC</Badge>
          </div>

          <div className="flex bg-[#F8F9FA] p-1 rounded-full text-xs font-semibold border border-gray-100">
            <button
              onClick={() => setTab("current")}
              className={`flex-1 py-2 rounded-full transition-all ${
                tab === "current" ? "bg-[#FF6B00] text-white shadow-sm" : "text-[#4A4A68]"
              }`}
            >
              Active Orders ({currentOrders.length})
            </button>
            <button
              onClick={() => setTab("past")}
              className={`flex-1 py-2 rounded-full transition-all ${
                tab === "past" ? "bg-[#FF6B00] text-white shadow-sm" : "text-[#4A4A68]"
              }`}
            >
              Past Orders ({pastOrders.length})
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Orders Feed ─────────────────────────────────── */}
      <main className="max-w-3xl mx-auto p-4 space-y-4">
        {tab === "current" ? (
          currentOrders.length === 0 ? (
            <Card padding="lg" className="text-center py-12 space-y-3">
              <ShoppingBag size={44} className="text-[#8C8CA1] mx-auto opacity-50" />
              <h3 className="font-display font-bold text-lg text-[#1A1A2E]">No Active Orders</h3>
              <p className="text-xs text-[#8C8CA1] max-w-xs mx-auto">
                Place an order from any restaurant menu to see live real-time status updates!
              </p>
              <Link href="/">
                <Button variant="primary" size="md">Browse Restaurants</Button>
              </Link>
            </Card>
          ) : (
            currentOrders.map((order: any) => (
              <Card key={order.orderId} padding="md" className="space-y-3 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <h3 className="font-display font-bold text-base text-[#1A1A2E]">{order.restaurantName}</h3>
                    <p className="text-xs text-[#8C8CA1]">Order #{order.orderId} • {order.tableNumber}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant="orange" size="md">
                      {order.status.toUpperCase()}
                    </Badge>
                    <span className="text-[10px] font-semibold text-[#8C8CA1]">
                      {order.paymentStatus === "PAID" ? "PAID" : "AWAITING PAYMENT"}
                    </span>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-[#4A4A68]">
                  {order.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between">
                      <span>{item.quantity}x {item.name}</span>
                      <span className="font-semibold text-[#1A1A2E]">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-[#8C8CA1] font-bold uppercase">
                      {order.paymentStatus === "PAID" ? "Total Paid" : "Total Amount"}
                    </p>
                    <p className="font-display font-bold text-base text-[#FF6B00]">₹{order.totalAmount}</p>
                  </div>
                  <Link href={`/orders/${order.orderId}`}>
                    <Button variant="primary" size="sm" className="min-h-[40px]">
                      <span>Track Live Order</span>
                      <ChevronRight size={16} />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))
          )
        ) : (
          pastOrders.length === 0 ? (
            <Card padding="lg" className="text-center py-12 space-y-2">
              <p className="text-xs text-[#8C8CA1]">No past orders found in your dining history.</p>
            </Card>
          ) : (
            pastOrders.map((order) => (
              <Card key={order.orderId} padding="md" className="space-y-3 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <h3 className="font-display font-bold text-base text-[#1A1A2E]">{order.restaurantName}</h3>
                    <p className="text-xs text-[#8C8CA1]">Order #{order.orderId} • {order.tableNumber}</p>
                  </div>
                  <Badge variant={order.status === "completed" ? "success" : "danger"} size="md">
                    {order.status.toUpperCase()}
                  </Badge>
                </div>

                <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                  <span className="font-display font-bold text-sm text-[#1A1A2E]">₹{order.totalAmount}</span>
                  {order.status === "completed" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openReviewModal(order)}
                      className="min-h-[40px]"
                    >
                      <Star size={14} className="text-[#FF6B00] fill-[#FF6B00]" />
                      <span>Rate & Write Review</span>
                    </Button>
                  )}
                </div>
              </Card>
            ))
          )
        )}
      </main>

      {/* ── 9. Review & Rating Modal ──────────────────────────── */}
      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        title={`Review ${selectedOrderForReview?.restaurantName || "Restaurant"}`}
        description="Share your dining experience with the chef and food lovers."
      >
        {reviewSubmitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 bg-[#ECFDF5] text-[#10B981] rounded-full flex items-center justify-center mx-auto text-3xl animate-bounce">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="font-display font-bold text-lg text-[#1A1A2E]">Thank You for Your Feedback!</h3>
            <p className="text-xs text-[#8C8CA1]">
              Your rating of {rating} stars has been published and added to {selectedOrderForReview?.restaurantName}&apos;s profile!
            </p>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            {/* Star Rating Bar */}
            <div className="text-center">
              <p className="text-xs text-[#8C8CA1] font-bold uppercase mb-2">Tap Stars to Rate</p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-125 transition-transform"
                  >
                    <Star
                      size={28}
                      className={star <= rating ? "text-[#FF6B00] fill-[#FF6B00]" : "text-gray-300"}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment Textarea */}
            <div>
              <label className="text-xs font-bold text-[#1A1A2E] block mb-1">Your Review Comment</label>
              <textarea
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="How was the food taste, ambiance, and service speed?"
                className="w-full bg-[#F8F9FA] border border-gray-100 rounded-[12px] p-3 text-xs text-[#1A1A2E] placeholder:text-[#8C8CA1] focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30"
              />
            </div>

            {/* Submit CTA Button */}
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleReviewSubmit}
              className="min-h-[48px]"
            >
              <span>Submit Review</span>
            </Button>
          </div>
        )}
      </Modal>

      <BottomNav />
    </div>
  );
}
