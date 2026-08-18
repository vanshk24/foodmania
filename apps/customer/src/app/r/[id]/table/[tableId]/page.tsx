"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  BellRing,
  Droplets,
  Receipt,
  Users,
  Sparkles,
  Leaf,
  Plus,
  CheckCircle2,
  Share2,
  Calendar,
  Utensils,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { Button, Card, Badge, Modal } from "@food-mania/ui";
import { mockRestaurantRepo, eventBus, ServiceRequestPayload } from "@food-mania/shared";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface SmartQRTablePageProps {
  params: { id: string; tableId: string };
}

export default function SmartQRTablePage({ params }: SmartQRTablePageProps) {
  const router = useRouter();
  const [restaurant, setRestaurant] = useState<any>({
    id: params.id,
    name: "Loading Restaurant...",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800",
    menuCategories: [],
  });

  React.useEffect(() => {
    fetch(`${API_BASE_URL}/restaurants/${params.id}`)
      .then((res) => res.json())
      .then((json) => {
        const data = json.data || json;
        if (data && data.name) {
          setRestaurant({
            id: data.id,
            name: data.name,
            image: data.imageUrl || "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800",
            menuCategories: (data.categories || []).map((c: any) => ({
              name: c.name,
              items: (data.menuItems || [])
                .filter((m: any) => m.categoryId === c.id)
                .map((m: any) => ({
                  id: m.id,
                  name: m.name,
                  price: m.price,
                  description: m.description,
                  image: m.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
                  isVeg: true,
                })),
            })),
          });
        }
      })
      .catch((e) => console.warn("QR table restaurant fetch warning:", e));
  }, [params.id]);

  const tableNumber = params.tableId ? params.tableId.toUpperCase() : "T01";

  const [dietFilter, setDietFilter] = useState("All");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isSplitBillOpen, setIsSplitBillOpen] = useState(false);
  const [splitCount, setSplitCount] = useState(3);
  const [totalBillAmount, setTotalBillAmount] = useState(1280);

  const [isBillRequested, setIsBillRequested] = useState(false);
  const [cartCount, setCartCount] = useState(2);
  const [cartTotal, setCartTotal] = useState(598);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCallWaiter = () => {
    const payload: ServiceRequestPayload = {
      requestId: `req-${Date.now()}`,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      tableNumber,
      type: "waiter",
      note: "Customer requested waiter assistance.",
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    eventBus.publish("WAITER_CALL_CREATED", payload);
    showToast(`🔔 Waiter notified for ${tableNumber}! Assisting shortly.`);
  };

  const handleRequestWater = () => {
    const payload: ServiceRequestPayload = {
      requestId: `req-${Date.now()}`,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      tableNumber,
      type: "water",
      note: "Customer requested fresh drinking water.",
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    eventBus.publish("SERVICE_REQUEST_CREATED", payload);
    showToast(`💧 Fresh water request sent for ${tableNumber}.`);
  };

  const handleRequestBill = () => {
    const payload: ServiceRequestPayload = {
      requestId: `req-${Date.now()}`,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      tableNumber,
      type: "bill",
      note: "Customer requested final bill receipt.",
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    eventBus.publish("BILL_REQUEST_CREATED", payload);
    setIsBillRequested(true);
    showToast(`🧾 Final Bill requested for ${tableNumber}!`);
  };

  const DIET_FILTERS = ["All", "Pure Veg", "Jain", "Vegan", "Gluten-Free", "High Protein"];

  return (
    <div className="min-h-screen bg-[#FAF9F5] pb-28">
      {/* ── 1. Sticky Smart Header ──────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#ECECEC] px-4 h-14 flex items-center justify-between shadow-soft">
        <Link
          href="/"
          className="w-[44px] h-[44px] rounded-full bg-[#FAF9F5] border border-[#ECECEC] flex items-center justify-center text-[#222222] hover:bg-[#EFF7EE] active:scale-95 transition-all"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#63B46C] animate-pulse" />
            <h1 className="font-display font-bold text-sm text-[#222222]">Table {tableNumber}</h1>
          </div>
          <p className="text-[10px] text-[#666666] font-medium">{restaurant.name} • Dine-In Session</p>
        </div>
        <div className="w-10" />
      </header>

      {/* Realtime Toast Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-4 right-4 z-50 max-w-md mx-auto p-3.5 bg-[#222222] text-white rounded-[20px] shadow-lg flex items-center justify-between text-xs font-bold"
          >
            <span>{toastMessage}</span>
            <span className="text-[10px] bg-[#63B46C] text-white px-2 py-0.5 rounded-full">SENT</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-3xl mx-auto px-4 pt-4 space-y-4">
        {/* ── 2. Smart Session Active Card ────────────────────── */}
        <div className="bg-gradient-to-r from-[#63B46C] to-[#4B9A54] text-white p-5 rounded-[28px] shadow-card space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-extrabold tracking-wider bg-white/20 px-2.5 py-1 rounded-full">
                SMART TABLE SESSION ACTIVE
              </span>
              <h2 className="font-display font-extrabold text-xl mt-1.5">{restaurant.name}</h2>
              <p className="text-xs text-white/80 font-medium">Auto-detected Table {tableNumber} • Rooftop Section</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
              {tableNumber}
            </div>
          </div>

          {/* Quick Dining Action Buttons */}
          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-white/20 text-center">
            <button
              onClick={handleCallWaiter}
              className="p-2.5 bg-white/10 hover:bg-white/20 active:scale-95 rounded-[18px] transition-all flex flex-col items-center gap-1"
            >
              <BellRing size={18} />
              <span className="text-[10px] font-bold">Call Waiter</span>
            </button>

            <button
              onClick={handleRequestWater}
              className="p-2.5 bg-white/10 hover:bg-white/20 active:scale-95 rounded-[18px] transition-all flex flex-col items-center gap-1"
            >
              <Droplets size={18} />
              <span className="text-[10px] font-bold">Water</span>
            </button>

            <button
              onClick={handleRequestBill}
              className="p-2.5 bg-white/10 hover:bg-white/20 active:scale-95 rounded-[18px] transition-all flex flex-col items-center gap-1"
            >
              <Receipt size={18} />
              <span className="text-[10px] font-bold">Bill</span>
            </button>

            <button
              onClick={() => setIsSplitBillOpen(true)}
              className="p-2.5 bg-white/10 hover:bg-white/20 active:scale-95 rounded-[18px] transition-all flex flex-col items-center gap-1"
            >
              <Users size={18} />
              <span className="text-[10px] font-bold">Split Bill</span>
            </button>
          </div>
        </div>

        {/* ── 3. AI Recommended Dishes Section ────────────────── */}
        <Card padding="md" className="space-y-3 bg-white border border-[#ECECEC] shadow-card">
          <div className="flex items-center justify-between border-b border-[#ECECEC] pb-2">
            <h3 className="font-display font-bold text-sm text-[#222222] flex items-center gap-1.5">
              <Sparkles size={16} className="text-[#FF6B4A]" />
              <span>AI Chef Recommendations for Evening</span>
            </h3>
            <Badge variant="orange" size="sm">POPULAR AT TABLE {tableNumber}</Badge>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {restaurant.menuCategories[0]?.items.slice(0, 2).map((item: any) => (
              <div key={item.id} className="p-3 bg-[#FAF9F5] rounded-[20px] border border-[#ECECEC] space-y-2">
                <div className="relative w-full h-24 rounded-[14px] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400";
                    }}
                  />
                </div>
                <div>
                  <h4 className="font-display font-bold text-xs text-[#222222] line-clamp-1">{item.name}</h4>
                  <p className="font-display font-extrabold text-xs text-[#FF6B4A] mt-0.5">₹{item.price}</p>
                </div>
                <Button variant="primary" size="sm" fullWidth onClick={() => showToast(`Added ${item.name} to Table ${tableNumber} order!`)}>
                  + Add to Table
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* ── 4. Dietary Filters Horizontal Pills ──────────────── */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          {DIET_FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setDietFilter(filter)}
              className={`px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border min-h-[38px] ${
                dietFilter === filter
                  ? "bg-[#63B46C] text-white border-[#63B46C] shadow-sm"
                  : "bg-white text-[#666666] border-[#ECECEC] hover:bg-gray-100"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* ── 5. Dynamic Digital Menu Categories ─────────────── */}
        <div className="space-y-3">
          {restaurant.menuCategories.map((cat: any) => (
            <Card key={cat.name} padding="md" className="space-y-3 bg-white border border-[#ECECEC] shadow-card">
              <h3 className="font-display font-bold text-sm text-[#222222] uppercase tracking-wider">{cat.name}</h3>
              <div className="space-y-3">
                {cat.items.map((dish: any) => (
                  <div key={dish.id} className="flex items-center justify-between p-3 bg-[#FAF9F5] rounded-[20px] border border-[#ECECEC]">
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-14 rounded-[16px] overflow-hidden flex-shrink-0">
                        <img
                          src={dish.image}
                          alt={dish.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400";
                          }}
                        />
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-xs text-[#222222]">{dish.name}</h4>
                        <p className="font-display font-extrabold text-xs text-[#FF6B4A] mt-0.5">₹{dish.price}</p>
                        <p className="text-[10px] text-[#999999] line-clamp-1">{dish.description}</p>
                      </div>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        try {
                          const existingCart = localStorage.getItem("food_mania_customer_cart");
                          let cartObj: any = { restaurantId: params.id || "the-urban-cafe", restaurantName: restaurant.name, tableNumber, items: {} };
                          if (existingCart) {
                            try { cartObj = JSON.parse(existingCart); } catch {}
                          }
                          cartObj.restaurantId = params.id || "the-urban-cafe";
                          cartObj.restaurantName = restaurant.name;
                          cartObj.tableNumber = tableNumber;
                          cartObj.items = cartObj.items || {};
                          cartObj.items[dish.id] = {
                            id: dish.id,
                            name: dish.name,
                            price: dish.price,
                            quantity: (cartObj.items[dish.id]?.quantity || 0) + 1,
                            isVeg: dish.isVeg || true,
                          };
                          localStorage.setItem("food_mania_customer_cart", JSON.stringify(cartObj));
                          setCartCount((prev) => prev + 1);
                          setCartTotal((prev) => prev + dish.price);
                        } catch {}
                        showToast(`Added ${dish.name} to Table ${tableNumber}!`);
                      }}
                    >
                      + Add
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Sticky Cart / Checkout Bottom Bar */}
        <div className="fixed bottom-4 inset-x-4 max-w-lg mx-auto z-40">
          <div className="p-3.5 bg-[#222222] text-white rounded-[24px] shadow-xl flex items-center justify-between border border-white/10 backdrop-blur-md">
            <div>
              <p className="text-[11px] text-gray-400 font-medium">Ordering for <strong className="text-white">Table {tableNumber}</strong></p>
              <p className="font-display font-extrabold text-sm text-[#63B46C]">₹{cartTotal}</p>
            </div>
            <Link
              href="/checkout"
              className="px-5 py-2.5 bg-[#63B46C] hover:bg-[#529e5a] text-white font-bold text-xs rounded-full shadow-md transition-all active:scale-95 flex items-center gap-1.5"
            >
              <span>View Order & Checkout</span>
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </main>

      {/* ── 6. Split Bill Calculator Modal ──────────────────── */}
      <Modal isOpen={isSplitBillOpen} onClose={() => setIsSplitBillOpen(false)} title="Split Bill Calculator">
        <div className="py-3 space-y-4 text-xs text-[#222222]">
          <div className="p-4 bg-[#FAF9F5] rounded-[20px] border border-[#ECECEC] space-y-2 text-center">
            <p className="text-[#666666]">Table {tableNumber} Total Bill</p>
            <p className="font-display font-extrabold text-2xl text-[#63B46C]">₹{totalBillAmount}</p>
          </div>

          <div>
            <label className="font-bold block mb-1">Number of People at Table</label>
            <div className="flex items-center justify-between bg-[#FAF9F5] border border-[#ECECEC] rounded-[18px] px-4 py-2">
              <button onClick={() => setSplitCount(Math.max(1, splitCount - 1))} className="w-8 h-8 rounded-full bg-white font-bold text-lg">-</button>
              <span className="font-bold text-sm">{splitCount} Guests</span>
              <button onClick={() => setSplitCount(splitCount + 1)} className="w-8 h-8 rounded-full bg-[#63B46C] text-white font-bold text-lg">+</button>
            </div>
          </div>

          <div className="p-4 bg-[#EFF7EE] border border-[#63B46C]/30 rounded-[20px] flex items-center justify-between">
            <span>Per Person Share:</span>
            <strong className="font-display font-extrabold text-lg text-[#63B46C]">₹{Math.round(totalBillAmount / splitCount)}</strong>
          </div>

          <Button variant="primary" size="lg" fullWidth onClick={() => { setIsSplitBillOpen(false); showToast("Split Bill request sent to Table guests!"); }}>
            Share UPI Payment Link
          </Button>
        </div>
      </Modal>

      {/* ── 7. Request Bill Receipt Modal ───────────────────── */}
      <Modal isOpen={isBillRequested} onClose={() => setIsBillRequested(false)} title={`Table ${tableNumber} Final Bill`}>
        <div className="py-3 space-y-4 text-xs text-[#222222]">
          <div className="p-4 bg-[#FAF9F5] rounded-[20px] border border-[#ECECEC] space-y-2">
            <div className="flex justify-between"><span>Restaurant:</span> <strong>{restaurant.name}</strong></div>
            <div className="flex justify-between"><span>Table Number:</span> <strong className="text-[#FF6B4A]">{tableNumber}</strong></div>
            <div className="flex justify-between"><span>Truffle Mushroom Pizza x 1:</span> <span>₹650</span></div>
            <div className="flex justify-between"><span>Cheese Burst Pizza x 1:</span> <span>₹349</span></div>
            <div className="flex justify-between"><span>Artisanal Cold Brew x 1:</span> <span>₹240</span></div>
            <div className="border-t border-[#ECECEC] pt-2 flex justify-between font-bold text-sm">
              <span>Total Payable:</span>
              <span className="text-[#63B46C]">₹{totalBillAmount}</span>
            </div>
          </div>

          <Button variant="primary" size="lg" fullWidth onClick={() => (window.location.href = "/checkout")}>
            Pay Now via Instant UPI / Card
          </Button>
        </div>
      </Modal>

      {/* ── 8. Bottom Sticky Cart Action Bar ──────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#ECECEC] p-4 shadow-lg">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] text-[#999999] uppercase font-bold">Table {tableNumber} Cart</p>
            <p className="font-display font-bold text-sm text-[#222222]">{cartCount} Items | ₹{cartTotal}</p>
          </div>
          <Link href="/cart">
            <Button variant="primary" size="lg" className="min-h-[48px] px-6">
              <span>Place Table Order</span>
              <ChevronRight size={18} />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
