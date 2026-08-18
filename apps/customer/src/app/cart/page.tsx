"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Tag,
  ChevronRight,
  ShieldCheck,
  Utensils,
  MapPin,
  Clock,
  Sparkles,
} from "lucide-react";
import { Button, Card, Badge } from "@food-mania/ui";
import { motion, AnimatePresence } from "framer-motion";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  isVeg: boolean;
  image?: string;
  category?: string;
}

export default function CartScreen() {
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantId, setRestaurantId] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState("FOODMANIA20");
  const [isCouponApplied, setIsCouponApplied] = useState(true);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  // Read cart from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("food_mania_customer_cart");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.restaurantName) setRestaurantName(parsed.restaurantName);
        if (parsed.restaurantId) setRestaurantId(parsed.restaurantId);
        if (parsed.items && typeof parsed.items === "object") {
          const loadedList: CartItem[] = Object.values(parsed.items);
          if (loadedList.length > 0) {
            setCartItems(loadedList);
          }
        }
      }
    } catch {}
    setIsLoaded(true);
  }, []);

  const saveCart = (updatedItems: CartItem[]) => {
    try {
      const itemsPayload: Record<string, CartItem> = {};
      updatedItems.forEach((i) => {
        itemsPayload[i.id] = i;
      });
      localStorage.setItem(
        "food_mania_customer_cart",
        JSON.stringify({
          restaurantId,
          restaurantName,
          items: itemsPayload,
        })
      );
    } catch {}
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prev) => {
      const next = prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
      saveCart(next);
      return next;
    });
  };

  const handleClearAll = () => {
    setCartItems([]);
    try {
      localStorage.removeItem("food_mania_customer_cart");
    } catch {}
  };

  const itemTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = isCouponApplied && itemTotal > 0 ? Math.round(itemTotal * 0.2) : 0;
  const taxesAndFees = itemTotal > 0 ? Math.round(itemTotal * 0.05) + 35 : 0;
  const finalTotal = Math.max(0, itemTotal - discountAmount + taxesAndFees);

  return (
    <div className="min-h-screen bg-[#F5F6FA] pb-32">
      {/* ── 1. Sticky Header ───────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 h-14 flex items-center justify-between shadow-sm">
        <Link
          href={`/restaurant/${restaurantId}/menu`}
          className="w-[44px] h-[44px] rounded-full bg-[#F8F9FA] border border-gray-100 flex items-center justify-center text-[#1A1A2E] hover:bg-[#FFF3E8] hover:text-[#FF6B00] active:scale-95 transition-all"
          aria-label="Back to menu"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="text-center">
          <h1 className="font-display font-bold text-base text-[#1A1A2E]">Your Dining Cart</h1>
          <p className="text-[10px] text-[#8C8CA1] font-medium">{restaurantName} • Table 04</p>
        </div>
        <div className="w-[44px] h-[44px] flex items-center justify-center text-[#FF6B00]">
          <ShoppingBag size={22} />
        </div>
      </header>

      {/* ── Main Container ─────────────────────────────────── */}
      <main className="max-w-3xl mx-auto px-4 pt-4 space-y-4">
        {/* ── 2. Restaurant Order Context Card ────────────────── */}
        <Card padding="md" className="border-l-4 border-l-[#FF6B00] bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="orange" size="sm">Dine-In • Table 04</Badge>
                <span className="text-xs text-[#8C8CA1] flex items-center gap-1">
                  <Clock size={12} className="text-[#FF6B00]" /> 15-20 min prep time
                </span>
              </div>
              <h2 className="font-display font-bold text-lg text-[#1A1A2E] mt-1.5">{restaurantName}</h2>
              <p className="text-xs text-[#4A4A68] flex items-center gap-1">
                <MapPin size={12} className="text-[#8C8CA1]" /> Link Road, Andheri West, Mumbai
              </p>
            </div>
            <Link
              href={`/restaurant/${restaurantId}/menu`}
              className="text-xs text-[#FF6B00] font-bold hover:underline flex items-center gap-0.5 p-2"
            >
              <span>+ Add Items</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </Card>

        {/* ── 3. Cart Items List ──────────────────────────────── */}
        <Card padding="md" className="space-y-3 bg-white shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h3 className="font-display font-bold text-base text-[#1A1A2E] flex items-center gap-2">
              <Utensils size={18} className="text-[#FF6B00]" />
              <span>Order Items ({cartItems.length})</span>
            </h3>
            {cartItems.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-xs text-[#EF4444] font-semibold flex items-center gap-1 hover:underline p-1"
              >
                <Trash2 size={13} />
                <span>Clear All</span>
              </button>
            )}
          </div>

          <AnimatePresence>
            {cartItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-10 space-y-3"
              >
                <div className="w-16 h-16 rounded-full bg-[#FFF3E8] text-[#FF6B00] flex items-center justify-center mx-auto text-3xl">
                  🛒
                </div>
                <h4 className="font-display font-bold text-lg text-[#1A1A2E]">Your Cart is Empty</h4>
                <p className="text-xs text-[#8C8CA1] max-w-xs mx-auto">
                  Add delicious artisanal pizzas, brews, and gourmet treats from the menu!
                </p>
                <Link href={`/restaurant/${restaurantId}/menu`}>
                  <Button variant="primary" size="md" className="mt-2">
                    Browse Digital Menu
                  </Button>
                </Link>
              </motion.div>
            ) : (
              cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 border-2 rounded-sm flex items-center justify-center flex-shrink-0 ${
                        item.isVeg ? "border-[#10B981]" : "border-[#EF4444]"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          item.isVeg ? "bg-[#10B981]" : "bg-[#EF4444]"
                        }`}
                      />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-sm text-[#1A1A2E]">{item.name}</h4>
                      <p className="text-xs text-[#FF6B00] font-bold mt-0.5">₹{item.price}</p>
                    </div>
                  </div>

                  {/* Quantity Switcher */}
                  <div className="flex items-center gap-2 bg-[#F8F9FA] rounded-full p-1 border border-gray-100">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-[36px] h-[36px] rounded-full bg-white text-[#1A1A2E] flex items-center justify-center shadow-sm hover:bg-[#FFF3E8] hover:text-[#FF6B00] active:scale-95 transition-all"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-display font-bold text-sm text-[#1A1A2E] w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-[36px] h-[36px] rounded-full bg-[#FF6B00] text-white flex items-center justify-center shadow-sm hover:bg-[#E85F00] active:scale-95 transition-all"
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>

          {cartItems.length > 0 && (
            <div className="pt-2">
              <input
                type="text"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Special Cooking Instructions (e.g., Less spicy, no onions)..."
                className="w-full bg-[#F8F9FA] border border-gray-100 rounded-[12px] px-3.5 py-2.5 text-xs text-[#1A1A2E] placeholder:text-[#8C8CA1] focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 min-h-[44px]"
              />
            </div>
          )}
        </Card>

        {/* ── 4. Promo Coupon Section ──────────────────────────── */}
        {cartItems.length > 0 && (
          <Card padding="md" className="space-y-3 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#FFF3E8] flex items-center justify-center text-[#FF6B00]">
                  <Tag size={16} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-[#1A1A2E]">Apply Promo Coupon</h4>
                  <p className="text-[11px] text-[#8C8CA1]">Get flat discounts on your bill</p>
                </div>
              </div>
              {isCouponApplied ? (
                <Badge variant="success" size="sm">FOODMANIA20 APPLIED</Badge>
              ) : (
                <button
                  onClick={() => setIsCouponApplied(true)}
                  className="text-xs text-[#FF6B00] font-bold hover:underline p-1"
                >
                  Apply Code
                </button>
              )}
            </div>

            {isCouponApplied && (
              <div className="flex items-center justify-between p-2.5 bg-[#ECFDF5] border border-[#10B981]/30 rounded-[12px]">
                <div className="flex items-center gap-2 text-xs text-[#065F46] font-medium">
                  <Sparkles size={14} className="text-[#10B981]" />
                  <span>Coupon &apos;FOODMANIA20&apos; saved you ₹{discountAmount}!</span>
                </div>
                <button
                  onClick={() => setIsCouponApplied(false)}
                  className="text-[11px] text-[#EF4444] font-bold hover:underline"
                >
                  Remove
                </button>
              </div>
            )}
          </Card>
        )}

        {/* ── 5. Payment Bill Breakdown ───────────────────────── */}
        {cartItems.length > 0 && (
          <Card padding="md" className="space-y-2.5 bg-white shadow-sm">
            <h3 className="font-display font-bold text-base text-[#1A1A2E] pb-2 border-b border-gray-100">
              Bill Summary
            </h3>
            <div className="space-y-2 text-xs text-[#4A4A68]">
              <div className="flex justify-between">
                <span>Item Subtotal</span>
                <span className="font-semibold text-[#1A1A2E]">₹{itemTotal}</span>
              </div>
              {isCouponApplied && (
                <div className="flex justify-between text-[#10B981] font-semibold">
                  <span>Promo Discount (20%)</span>
                  <span>- ₹{discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Taxes & Service Charges (5% + ₹35)</span>
                <span className="font-semibold text-[#1A1A2E]">₹{taxesAndFees}</span>
              </div>
              <div className="pt-2 border-t border-gray-100 flex justify-between text-sm font-bold text-[#1A1A2E]">
                <span>To Pay</span>
                <span className="text-[#FF6B00] text-base">₹{finalTotal}</span>
              </div>
            </div>
          </Card>
        )}
      </main>

      {/* ── 6. Fixed Bottom Checkout Action Bar ──────────────── */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-100 p-4 shadow-lg">
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] text-[#8C8CA1] uppercase tracking-wider font-bold">Total Amount</p>
              <p className="font-display font-bold text-xl text-[#1A1A2E]">
                ₹{finalTotal} <span className="text-xs text-[#10B981] font-normal">Saved ₹{discountAmount}</span>
              </p>
            </div>
            <Link href="/checkout" className="flex-1 max-w-xs">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                className="shadow-[0_4px_16px_rgba(255,107,0,0.35)] min-h-[48px]"
              >
                <span>Proceed to Checkout</span>
                <ChevronRight size={18} />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
