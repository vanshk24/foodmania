"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Search,
  Plus,
  Minus,
  ShoppingBag,
  ChevronRight,
  X,
  Check,
  Utensils,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Badge, Button, Card } from "@food-mania/ui";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  categoryName?: string;
  price: number;
  description: string;
  image: string;
  isVeg: boolean;
  isAvailable: boolean;
  isBestseller?: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  count: number;
}

const NON_VEG_KEYWORDS = ["chicken", "beef", "pork", "salmon", "meat", "wings", "bacon", "pepperoni", "fish", "prawn", "mutton"];

export default function SmartDigitalMenuPage({ params }: { params?: { id?: string } }) {
  const routeParams = useParams();
  const restaurantId = (params?.id || routeParams?.id || "the-urban-cafe") as string;

  const [restaurantName, setRestaurantName] = useState("The Urban Cafe");
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([
    { id: "all", name: "All Dishes", count: 0 },
  ]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [vegOnly, setVegOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("food_mania_customer_cart");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed.items === "object") {
          const loadedCart: Record<string, number> = {};
          Object.entries(parsed.items).forEach(([k, v]: [string, any]) => {
            loadedCart[k] = typeof v === "number" ? v : v.quantity || 1;
          });
          setCart(loadedCart);
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    Promise.all([
      fetch(`${API_BASE_URL}/restaurants/${restaurantId}`)
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
      fetch(`${API_BASE_URL}/restaurants/${restaurantId}/menu`)
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
    ])
      .then(([restJson, menuJson]) => {
        if (!isMounted) return;

        const restData = restJson?.data || restJson;
        if (restData?.name) {
          setRestaurantName(restData.name);
        }

        const menuData = menuJson?.data || menuJson || [];
        const itemsList: MenuItem[] = [];
        const categoriesList: MenuCategory[] = [];

        if (Array.isArray(menuData) && menuData.length > 0) {
          menuData.forEach((cat: any) => {
            const catItems = Array.isArray(cat.items) ? cat.items : [];
            categoriesList.push({
              id: cat.id,
              name: cat.name,
              count: catItems.length,
            });

            catItems.forEach((m: any) => {
              const text = `${m.name} ${m.description || ""}`.toLowerCase();
              const isNonVeg = NON_VEG_KEYWORDS.some((kw) => text.includes(kw));

              itemsList.push({
                id: m.id,
                name: m.name,
                category: cat.id,
                categoryName: cat.name,
                price: Number(m.price),
                description: m.description || "Fresh specialty dish prepared to order.",
                image: m.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
                isVeg: !isNonVeg,
                isAvailable: m.isAvailable !== false,
                isBestseller: Number(m.price) > 400,
              });
            });
          });
        } else if (restData && Array.isArray(restData.menuItems) && restData.menuItems.length > 0) {
          const cats = restData.categories || [];
          cats.forEach((c: any) => {
            const matchingItems = restData.menuItems.filter((m: any) => m.categoryId === c.id);
            categoriesList.push({
              id: c.id,
              name: c.name,
              count: matchingItems.length,
            });
          });

          restData.menuItems.forEach((m: any) => {
            const text = `${m.name} ${m.description || ""}`.toLowerCase();
            const isNonVeg = NON_VEG_KEYWORDS.some((kw) => text.includes(kw));
            itemsList.push({
              id: m.id,
              name: m.name,
              category: m.categoryId,
              price: Number(m.price),
              description: m.description || "Fresh specialty dish prepared to order.",
              image: m.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
              isVeg: !isNonVeg,
              isAvailable: m.isAvailable !== false,
              isBestseller: Number(m.price) > 400,
            });
          });
        }

        const allCategory: MenuCategory = {
          id: "all",
          name: "All Dishes",
          count: itemsList.length,
        };

        setMenuCategories([allCategory, ...categoriesList]);
        setMenuItems(itemsList);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Menu loading error:", err);
        setError("Failed to load restaurant menu. Please try again.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [restaurantId]);

  // Persist cart to localStorage on change
  const saveCartToStorage = (updatedCart: Record<string, number>) => {
    try {
      const itemsPayload: Record<string, any> = {};
      Object.entries(updatedCart).forEach(([id, qty]) => {
        const item = menuItems.find((i) => i.id === id);
        if (item && qty > 0) {
          itemsPayload[id] = {
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: qty,
            isVeg: item.isVeg,
            image: item.image,
          };
        }
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

  // Cart calculations
  const totalItemsCount = Object.values(cart).reduce((sum, count) => sum + count, 0);
  const totalPrice = Object.entries(cart).reduce((sum, [id, count]) => {
    const item = menuItems.find((i) => i.id === id);
    return sum + (item ? item.price * count : 0);
  }, 0);

  const handleAddToCart = (item: MenuItem) => {
    setCart((prev) => {
      const next = { ...prev, [item.id]: (prev[item.id] || 0) + 1 };
      saveCartToStorage(next);
      return next;
    });
  };

  const handleDecrement = (itemId: string) => {
    setCart((prev) => {
      const current = prev[itemId] || 0;
      let next: Record<string, number>;
      if (current <= 1) {
        next = { ...prev };
        delete next[itemId];
      } else {
        next = { ...prev, [itemId]: current - 1 };
      }
      saveCartToStorage(next);
      return next;
    });
  };

  const filteredItems = menuItems.filter((item) => {
    if (activeCategory !== "all" && item.category !== activeCategory) return false;
    if (vegOnly && !item.isVeg) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const displayCategories =
    activeCategory === "all"
      ? menuCategories.filter((c) => c.id !== "all")
      : menuCategories.filter((c) => c.id === activeCategory);

  return (
    <div className="min-h-screen bg-[#F5F6FA] pb-28">
      {/* ── Sticky Top Header ─────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 pt-3 pb-2 shadow-sm space-y-2.5">
        {/* Top Info Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={`/restaurant/${restaurantId}`}
              className="w-9 h-9 rounded-full bg-[#F8F9FA] border border-gray-100 flex items-center justify-center text-[#1A1A2E] hover:bg-[#FFF3E8] hover:text-[#FF6B00] transition-colors"
              aria-label="Back to restaurant"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="font-display font-bold text-base text-[#1A1A2E]">{restaurantName}</h1>
              <p className="text-[11px] text-[#FF6B00] font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                Live Digital Menu • Verified Prices
              </p>
            </div>
          </div>

          {/* Veg Only Toggle */}
          <button
            onClick={() => setVegOnly(!vegOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
              vegOnly
                ? "bg-[#DCFCE7] text-[#15803D] border-[#22C55E]"
                : "bg-[#F8F9FA] text-[#4A4A68] border-gray-200"
            }`}
          >
            <span
              className={`w-3 h-3 rounded-full border flex items-center justify-center ${
                vegOnly ? "border-[#15803D] bg-[#22C55E]" : "border-gray-400"
              }`}
            >
              {vegOnly && <Check size={8} className="text-white" />}
            </span>
            <span>Veg Only</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C8CA1]" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dishes, ingredients, beverages..."
            className="w-full bg-[#F8F9FA] border border-gray-100 rounded-[10px] pl-9 pr-4 py-2 text-xs text-[#1A1A2E] placeholder:text-[#8C8CA1] focus:outline-none focus:border-[#FF6B00]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Category Horizontal Pills */}
        <div className="-mx-4 px-4 overflow-x-auto scrollbar-none pb-1">
          <div className="flex items-center gap-2 w-max">
            {menuCategories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#FF6B00] text-white shadow-sm"
                      : "bg-[#F0F0F0] text-[#4A4A68] hover:bg-gray-200"
                  }`}
                >
                  {cat.name} ({cat.count})
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* ── Main Menu List ────────────────────────────────────── */}
      <main className="max-w-2xl mx-auto px-4 pt-4 space-y-6">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
            <Loader2 className="animate-spin text-[#FF6B00]" size={36} />
            <p className="text-xs text-[#8C8CA1] font-medium">Loading live menu from PostgreSQL...</p>
          </div>
        ) : error ? (
          <div className="py-16 text-center space-y-3 bg-white rounded-[20px] p-6 border border-red-100">
            <AlertCircle size={40} className="text-red-500 mx-auto" />
            <p className="text-sm font-semibold text-[#1A1A2E]">{error}</p>
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-white rounded-[20px] p-6 border border-gray-100">
            <Utensils size={40} className="text-[#8C8CA1] mx-auto opacity-50" />
            <h3 className="font-display font-bold text-base text-[#1A1A2E]">No Dishes Found</h3>
            <p className="text-xs text-[#8C8CA1] max-w-xs mx-auto">
              {vegOnly
                ? "No pure vegetarian items match your current filter or search."
                : "No menu items match your search. Try different keywords or reset filters."}
            </p>
            {(searchQuery || vegOnly || activeCategory !== "all") && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setVegOnly(false);
                  setActiveCategory("all");
                }}
              >
                Reset All Filters
              </Button>
            )}
          </div>
        ) : (
          displayCategories.map((cat) => {
            const items = filteredItems.filter((i) => i.category === cat.id);
            if (items.length === 0) return null;

            return (
              <section key={cat.id} id={`sec-${cat.id}`} className="space-y-3">
                <h2 className="font-display font-bold text-lg text-[#1A1A2E] flex items-center justify-between border-b border-gray-200 pb-2">
                  <span>{cat.name}</span>
                  <span className="text-xs text-[#8C8CA1] font-medium">{items.length} items</span>
                </h2>

                <div className="space-y-3">
                  {items.map((item) => {
                    const qty = cart[item.id] || 0;
                    return (
                      <Card key={item.id} padding="sm" className="flex items-center gap-3 bg-white shadow-sm hover:shadow-md transition-all">
                        {/* Image Preview */}
                        <div className="relative w-24 h-24 rounded-[12px] overflow-hidden flex-shrink-0 bg-gray-100">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src =
                                "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400";
                            }}
                          />
                          {item.isBestseller && (
                            <span className="absolute top-1 left-1 bg-[#FF6B00] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                              Popular
                            </span>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 pr-1">
                          {/* Veg / Non-Veg Icon */}
                          <div className="flex items-center gap-1.5 mb-1">
                            <span
                              className={`w-3.5 h-3.5 border flex items-center justify-center p-0.5 ${
                                item.isVeg ? "border-[#22C55E]" : "border-[#EF4444]"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  item.isVeg ? "bg-[#22C55E]" : "bg-[#EF4444]"
                                }`}
                              />
                            </span>
                            <span className="text-[11px] font-semibold text-[#8C8CA1]">
                              {item.isVeg ? "Pure Veg" : "Non-Veg"}
                            </span>
                          </div>

                          <h3 className="font-display font-bold text-sm text-[#1A1A2E] truncate">
                            {item.name}
                          </h3>
                          <p className="text-xs font-bold text-[#FF6B00] mt-0.5">₹{item.price}</p>
                          <p className="text-[11px] text-[#8C8CA1] line-clamp-2 mt-1 leading-snug">
                            {item.description}
                          </p>
                        </div>

                        {/* Add Button / Counter */}
                        <div className="flex-shrink-0">
                          {qty > 0 ? (
                            <div className="flex items-center bg-[#FFF3E8] border border-[#FF6B00] rounded-[10px] p-1 font-bold text-xs text-[#FF6B00]">
                              <button
                                onClick={() => handleDecrement(item.id)}
                                className="w-7 h-7 flex items-center justify-center hover:bg-[#FF6B00] hover:text-white rounded-[6px] transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="w-6 text-center">{qty}</span>
                              <button
                                onClick={() => handleAddToCart(item)}
                                className="w-7 h-7 flex items-center justify-center hover:bg-[#FF6B00] hover:text-white rounded-[6px] transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          ) : (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleAddToCart(item)}
                              className="min-h-[36px]"
                            >
                              + ADD
                            </Button>
                          )}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </section>
            );
          })
        )}
      </main>

      {/* ── Sticky Bottom Cart Bar ────────────────────────────── */}
      {totalItemsCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-transparent pointer-events-none">
          <div className="max-w-2xl mx-auto pointer-events-auto">
            <div className="bg-[#FF6B00] text-white rounded-[16px] p-4 shadow-[0_8px_32px_rgba(255,107,0,0.4)] flex items-center justify-between animate-slide-up">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <ShoppingBag size={20} />
                </div>
                <div>
                  <p className="font-display font-bold text-sm">
                    {totalItemsCount} {totalItemsCount === 1 ? "Item" : "Items"} • ₹{totalPrice}
                  </p>
                  <p className="text-[11px] text-white/80">{restaurantName} • Direct Digital Order</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/cart"
                  className="bg-white/20 text-white font-bold text-xs px-3 py-2.5 rounded-[10px] hover:bg-white/30 transition-all flex items-center gap-1"
                >
                  <span>Cart</span>
                </Link>
                <Link
                  href="/checkout"
                  className="bg-white text-[#FF6B00] font-bold text-xs px-4 py-2.5 rounded-[10px] hover:bg-orange-50 active:scale-[0.96] transition-all flex items-center gap-1 shadow-sm"
                >
                  <span>Checkout</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
