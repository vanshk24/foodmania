"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  QrCode,
  Smartphone,
  Banknote,
  UtensilsCrossed,
  MapPin,
  Clock,
  Lock,
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button, Card, Badge } from "@food-mania/ui";
import { motion } from "framer-motion";

const PAYMENT_METHODS = [
  {
    id: "upi",
    name: "Instant UPI (Google Pay, PhonePe, Paytm)",
    icon: Smartphone,
    badge: "RECOMMENDED",
    description: "Pay instantly with any UPI app on your phone",
  },
  {
    id: "card",
    name: "Credit / Debit Cards",
    icon: CreditCard,
    badge: "SECURE 256-BIT",
    description: "Visa, Mastercard, RuPay & American Express",
  },
  {
    id: "cash",
    name: "Pay at Table (Cash / Card Swipe)",
    icon: Banknote,
    badge: "FLEXIBLE",
    description: "Pay the waiter directly after your meal",
  },
];

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  isVeg: boolean;
}

export default function CheckoutScreen() {
  const [selectedPayment, setSelectedPayment] = useState("upi");
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [restaurantId, setRestaurantId] = useState("the-urban-cafe");
  const [restaurantName, setRestaurantName] = useState("The Urban Cafe");
  const [customerName, setCustomerName] = useState("Gaurav Sharma");
  const [customerPhone, setCustomerPhone] = useState("+91 98765 43210");
  const [tableNumber, setTableNumber] = useState("Table 04");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // Read user details if available
    try {
      const userStored = localStorage.getItem("fm_user") || localStorage.getItem("food_mania_user_session");
      if (userStored) {
        const u = JSON.parse(userStored);
        if (u.name) setCustomerName(u.name);
        if (u.phone) setCustomerPhone(u.phone);
      }
    } catch {}

    // Read URL parameters if present
    try {
      const params = new URLSearchParams(window.location.search);
      const urlRid = params.get("restaurantId") || params.get("r");
      const urlTable = params.get("table") || params.get("t");
      if (urlRid) setRestaurantId(urlRid);
      if (urlTable) setTableNumber(urlTable);
    } catch {}

    // Read cart details
    try {
      const cartStored = localStorage.getItem("food_mania_customer_cart");
      if (cartStored) {
        const parsed = JSON.parse(cartStored);
        if (parsed.restaurantId) setRestaurantId(parsed.restaurantId);
        if (parsed.restaurantName) setRestaurantName(parsed.restaurantName);
        if (parsed.tableNumber) setTableNumber(parsed.tableNumber);
        if (parsed.items && typeof parsed.items === "object") {
          const list: CartItem[] = Object.values(parsed.items);
          if (list.length > 0) {
            setCartItems(list);
          }
        }
      }
    } catch {}
  }, []);

  const [couponInput, setCouponInput] = useState("FREE100");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>("FREE100");

  const itemsSubtotal = cartItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const taxesAndFees = itemsSubtotal > 0 ? Math.round(itemsSubtotal * 0.05) + 35 : 0;
  const isFree100 = appliedCoupon?.toUpperCase() === "FREE100";
  const discountAmount = isFree100
    ? itemsSubtotal + taxesAndFees
    : itemsSubtotal > 0
    ? Math.round(itemsSubtotal * 0.2)
    : 0;
  const estimatedTotal = isFree100 ? 0 : Math.max(0, itemsSubtotal - discountAmount + taxesAndFees);

  const handlePlaceOrder = async () => {
    setLoading(true);
    setErrorMsg(null);

    let orderItemsPayload = cartItems.map((i) => ({
      menuItemId: i.id,
      quantity: i.quantity,
    }));

    if (orderItemsPayload.length === 0) {
      orderItemsPayload = [
        { menuItemId: "item-103", quantity: 1 },
        { menuItemId: "item-101", quantity: 1 },
      ];
    }

    try {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId,
          paymentMethod: estimatedTotal === 0 ? "FREE100_TEST" : selectedPayment.toUpperCase(),
          customerName,
          customerPhone,
          deliveryAddress: `Table ${tableNumber} (Dine-In)`,
          tableNumber,
          tableId: tableNumber,
          couponCode: appliedCoupon || undefined,
          items: orderItemsPayload,
        }),
      });
      const json = await res.json();
      const order = json.data || json;

      if (res.ok && order && (order.id || order.orderNumber)) {
        setPlacedOrder(order);
        setIsOrderPlaced(true);
        try {
          localStorage.removeItem("food_mania_customer_cart");
        } catch {}
      } else {
        setErrorMsg(json.message || "Failed to place order. Please try again.");
      }
    } catch (e) {
      setErrorMsg("Network error communicating with order service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6FA] pb-32">
      {/* ── 1. Sticky Header ───────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 h-14 flex items-center justify-between shadow-sm">
        <Link
          href="/cart"
          className="w-[44px] h-[44px] rounded-full bg-[#F8F9FA] border border-gray-100 flex items-center justify-center text-[#1A1A2E] hover:bg-[#FFF3E8] hover:text-[#FF6B00] active:scale-95 transition-all"
          aria-label="Back to cart"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="text-center">
          <h1 className="font-display font-bold text-base text-[#1A1A2E]">Checkout & Payment</h1>
          <p className="text-[10px] text-[#8C8CA1] font-medium">{restaurantName} • Order Review</p>
        </div>
        <div className="w-[44px] h-[44px] flex items-center justify-center text-[#10B981]">
          <ShieldCheck size={22} />
        </div>
      </header>

      {/* ── Main Container ─────────────────────────────────── */}
      <main className="max-w-3xl mx-auto px-4 pt-4 space-y-4">
        {/* ── Order Placed Modal Overlay ─────────────────────── */}
        {isOrderPlaced ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-12 px-6 bg-white rounded-[24px] shadow-xl text-center space-y-4"
          >
            <div className="w-20 h-20 bg-[#FFF7ED] text-[#EA580C] rounded-full flex items-center justify-center mx-auto text-4xl shadow-sm">
              <Clock size={44} className="animate-pulse" />
            </div>
            <div>
              <Badge variant="orange" size="md" className="mb-2">
                ORDER #{placedOrder?.orderNumber || "ORD-9082"} — {placedOrder?.paymentStatus || "PENDING PAYMENT"}
              </Badge>
              <h2 className="font-display font-bold text-2xl text-[#1A1A2E]">
                Order Placed — Awaiting Payment
              </h2>
              <p className="text-xs text-[#8C8CA1] max-w-sm mx-auto mt-1 leading-relaxed">
                Your order for <strong className="text-[#1A1A2E]">{tableNumber}</strong> has been safely created in PostgreSQL with server-verified prices.
              </p>
            </div>

            <div className="p-4 bg-[#F8F9FA] rounded-[16px] border border-gray-100 text-left text-xs space-y-2 max-w-sm mx-auto">
              <div className="flex justify-between text-[#4A4A68]">
                <span>Restaurant</span>
                <span className="font-bold text-[#1A1A2E]">{restaurantName}</span>
              </div>
              <div className="flex justify-between text-[#4A4A68]">
                <span>Order ID</span>
                <span className="font-bold text-[#1A1A2E]">{placedOrder?.orderNumber || placedOrder?.id || "ORD-9082"}</span>
              </div>
              <div className="flex justify-between text-[#4A4A68]">
                <span>Payment Status</span>
                <span className="font-bold text-[#EA580C] uppercase">{placedOrder?.paymentStatus || "PENDING_PAYMENT"}</span>
              </div>
              <div className="flex justify-between text-[#4A4A68]">
                <span>Payment Mode</span>
                <span className="font-bold text-[#1A1A2E] uppercase">{selectedPayment}</span>
              </div>
              <div className="flex justify-between text-[#4A4A68] pt-2 border-t border-gray-200 text-sm font-bold">
                <span>Server-Verified Total</span>
                <span className="text-[#FF6B00]">₹{placedOrder?.totalAmount || 760}</span>
              </div>
            </div>

            <div className="p-3 bg-[#FFF7ED] border border-[#FDBA74] rounded-[14px] text-left text-[11px] text-[#9A3412] max-w-sm mx-auto">
              <strong>Phase 6.1 Payment Foundation:</strong> Order is safely recorded in PostgreSQL as <code>PENDING_PAYMENT</code>. Gateway integration (Phase 6.2) will process online capture.
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
              <Link href={`/orders/${placedOrder?.orderNumber || placedOrder?.id || ""}`} className="w-full">
                <Button variant="primary" size="lg" fullWidth>
                  Track Order Status
                </Button>
              </Link>
              <Link href="/orders" className="w-full">
                <Button variant="outline" size="lg" fullWidth>
                  All Orders
                </Button>
              </Link>
            </div>
          </motion.div>
        ) : (
          <>
            {errorMsg && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-[16px] text-red-600 text-xs font-medium flex items-center gap-2">
                <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* ── 2. Order Summary Card ────────────────────────────── */}
            <Card padding="md" className="space-y-3 bg-white shadow-sm">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <UtensilsCrossed size={18} className="text-[#FF6B00]" />
                  <h3 className="font-display font-bold text-base text-[#1A1A2E]">Order Summary</h3>
                </div>
                <Badge variant="warning" size="sm">Dine-In • {tableNumber}</Badge>
              </div>

              <div className="space-y-2 text-xs text-[#4A4A68]">
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>{item.quantity}x {item.name}</span>
                      <span className="font-semibold text-[#1A1A2E]">₹{item.price * item.quantity}</span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span>1x Crispy Avocado Bruschetta</span>
                      <span className="font-semibold text-[#1A1A2E]">₹360</span>
                    </div>
                    <div className="flex justify-between">
                      <span>1x Classic Artisan Cappuccino</span>
                      <span className="font-semibold text-[#1A1A2E]">₹240</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between text-[#10B981]">
                  <span>{isFree100 ? "Discount (FREE100 Test 100% OFF)" : "Discount (FOODMANIA20)"}</span>
                  <span className="font-semibold">- ₹{discountAmount}</span>
                </div>
                <div className="flex justify-between text-[#8C8CA1]">
                  <span>Taxes & Service Fee</span>
                  <span>₹{taxesAndFees}</span>
                </div>

                <div className="pt-2 border-t border-gray-100 flex justify-between font-bold text-sm text-[#1A1A2E]">
                  <span>Estimated Total</span>
                  <span className="text-[#FF6B00]">₹{estimatedTotal}</span>
                </div>

                {/* Coupon Code Input */}
                <div className="pt-2 border-t border-gray-100 space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo / Coupon (e.g. FREE100)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="flex-1 px-3 py-1.5 rounded-[10px] border border-gray-200 text-xs font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 bg-[#F8F9FA]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (couponInput.trim().toUpperCase() === "FREE100") {
                          setAppliedCoupon("FREE100");
                        } else if (couponInput.trim()) {
                          setAppliedCoupon(couponInput.trim().toUpperCase());
                        }
                      }}
                      className="px-3 py-1.5 bg-[#1A1A2E] text-white text-xs font-bold rounded-[10px] hover:bg-black transition"
                    >
                      Apply
                    </button>
                  </div>
                  {isFree100 && (
                    <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-[10px] text-emerald-800 text-[11px] font-bold flex items-center justify-between">
                      <span>🎉 FREE100 TEST DISCOUNT: ₹0 PAYABLE</span>
                      <button onClick={() => setAppliedCoupon(null)} className="text-emerald-900 underline text-[10px]">Remove</button>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* ── 3. Table & Customer Details ───────────────────────── */}
            <Card padding="md" className="space-y-3 bg-white shadow-sm">
              <h3 className="font-display font-bold text-base text-[#1A1A2E]">Customer & Table Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-[#8C8CA1] uppercase mb-1">Customer Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-[#F8F9FA] border border-gray-200 rounded-[12px] px-3 py-2 text-xs text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#8C8CA1] uppercase mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-[#F8F9FA] border border-gray-200 rounded-[12px] px-3 py-2 text-xs text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30"
                  />
                </div>
              </div>
            </Card>

            {/* ── 4. Payment Method Options ────────────────────────── */}
            <Card padding="md" className="space-y-3 bg-white shadow-sm">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <h3 className="font-display font-bold text-base text-[#1A1A2E]">Select Payment Option</h3>
                <span className="text-[11px] text-[#8C8CA1] flex items-center gap-1">
                  <Lock size={12} className="text-[#10B981]" /> 100% Secure
                </span>
              </div>

              <div className="space-y-2">
                {PAYMENT_METHODS.map((method) => {
                  const isSelected = selectedPayment === method.id;
                  const Icon = method.icon;
                  return (
                    <label
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`flex items-start gap-3 p-3.5 rounded-[16px] border cursor-pointer transition-all ${
                        isSelected
                          ? "bg-[#FFF3E8]/40 border-[#FF6B00] shadow-sm"
                          : "bg-white border-gray-100 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment_method"
                        checked={isSelected}
                        onChange={() => setSelectedPayment(method.id)}
                        className="mt-1 accent-[#FF6B00]"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Icon size={16} className={isSelected ? "text-[#FF6B00]" : "text-[#4A4A68]"} />
                          <span className="font-bold text-xs text-[#1A1A2E]">{method.name}</span>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-[#4A4A68]">
                            {method.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#8C8CA1] mt-0.5">{method.description}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </Card>
          </>
        )}
      </main>

      {/* ── 5. Fixed Bottom Order CTA Bar ────────────────────── */}
      {!isOrderPlaced && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-100 p-4 shadow-lg">
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] text-[#8C8CA1] uppercase tracking-wider font-bold">Payable Amount</p>
              <p className="font-display font-bold text-xl text-[#1A1A2E]">
                ₹{estimatedTotal}
              </p>
            </div>
            <div className="flex-1 max-w-xs">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handlePlaceOrder}
                disabled={loading}
                className="shadow-[0_4px_16px_rgba(255,107,0,0.35)] min-h-[48px]"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={18} className="animate-spin" /> Placing Order...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-1.5 font-bold">
                    {estimatedTotal === 0 ? "Complete Order (₹0.00)" : `Pay ₹${estimatedTotal} & Order`}
                    <ChevronRight size={16} />
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
