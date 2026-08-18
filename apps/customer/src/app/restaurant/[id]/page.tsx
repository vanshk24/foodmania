"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Share2,
  Heart,
  Star,
  MapPin,
  Clock,
  Phone,
  Navigation,
  Utensils,
  Calendar,
  ShoppingBag,
  Leaf,
  Plus,
  Minus,
  CheckCircle2,
  Info,
  Camera,
  MessageSquare,
} from "lucide-react";
import { Button, Badge, Card } from "@food-mania/ui";
import { motion } from "framer-motion";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function RestaurantDetailPage({ params }: { params?: { id?: string } }) {
  const routeParams = useParams();
  const restaurantId = (params?.id || routeParams?.id || "") as string;

  const [restaurant, setRestaurant] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "menu" | "reviews" | "photos" | "info">("overview");

  const [cart, setCart] = useState<Record<string, { id: string; name: string; price: number; quantity: number; isVeg: boolean }>>({});

  // Read cart from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("food_mania_customer_cart");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.items && typeof parsed.items === "object") {
          setCart(parsed.items);
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([
      fetch(`${API_BASE_URL}/restaurants/${restaurantId}`)
        .then((res) => (res.ok ? res.json() : null))
        .catch(() => null),
      fetch(`${API_BASE_URL}/restaurants/${restaurantId}/menu`)
        .then((res) => (res.ok ? res.json() : null))
        .catch(() => null),
      fetch(`${API_BASE_URL}/reviews?restaurantId=${restaurantId}`)
        .then((res) => (res.ok ? res.json() : null))
        .catch(() => null),
    ])
      .then(([restJson, menuJson, revJson]) => {
        if (!isMounted) return;

        const data = restJson?.data || restJson;
        const menuCategoriesData = menuJson?.data || menuJson || [];
        const reviewsData = revJson?.data || revJson || [];

        if (Array.isArray(reviewsData)) {
          setReviews(reviewsData);
        }

        if (data && data.id) {
          const categories = data.categories || [];
          const menuItems = data.menuItems || [];

          let mappedCategories: any[] = [];

          if (Array.isArray(menuCategoriesData) && menuCategoriesData.length > 0) {
            mappedCategories = menuCategoriesData.map((c: any) => ({
              name: c.name,
              items: (c.items || []).map((m: any) => ({
                id: m.id,
                name: m.name,
                price: Number(m.price),
                description: m.description || "Freshly crafted delicious recipe.",
                image: m.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
                isVeg: true,
              })),
            }));
          } else {
            mappedCategories = categories.map((c: any) => ({
              name: c.name,
              items: menuItems
                .filter((m: any) => m.categoryId === c.id)
                .map((m: any) => ({
                  id: m.id,
                  name: m.name,
                  price: Number(m.price),
                  description: m.description || "Freshly crafted delicious recipe.",
                  image: m.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
                  isVeg: true,
                })),
            }));
          }

          if (mappedCategories.length === 0 && menuItems.length > 0) {
            mappedCategories.push({
              name: "Featured Dishes",
              items: menuItems.map((m: any) => ({
                id: m.id,
                name: m.name,
                price: Number(m.price),
                description: m.description || "Freshly crafted delicious recipe.",
                image: m.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
                isVeg: true,
              })),
            });
          }

          setRestaurant({
            id: data.id,
            name: data.name,
            tagline: `${data.cuisine || "Multi-Cuisine"} • ${data.city}`,
            rating: data.rating || 4.8,
            reviewCount: data.reviewCount || 0,
            cuisines: [data.cuisine || "Multi-Cuisine"],
            time: "20-30 min",
            distance: "1.2 km",
            address: data.address || `${data.city}`,
            openNow: data.status === "ACTIVE",
            tags: ["Live Kitchen", "Contactless Ordering", "Verified Partner"],
            phone: data.phone || "",
            about: data.description || `${data.name} is a dining destination in ${data.city} offering freshly prepared recipes with contactless QR ordering.`,
            openTime: data.openingTime || "11:00 AM",
            closeTime: data.closingTime || "11:00 PM",
            priceForTwo: data.minOrder ? `₹${data.minOrder * 2} for two` : "₹800 for two",
            deliveryFee: data.deliveryFee ?? 40,
            image: data.bannerUrl || data.imageUrl || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
            photos: [
              data.bannerUrl || data.imageUrl || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
              data.imageUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
              "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800",
              "https://images.unsplash.com/photo-1544025162-d76694265947?w=800",
            ],
            menuCategories: mappedCategories,
          });
        }
      })
      .catch((err) => console.warn("Restaurant fetch error:", err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [restaurantId]);

  const saveCartToStorage = (updatedCart: Record<string, any>) => {
    try {
      localStorage.setItem(
        "food_mania_customer_cart",
        JSON.stringify({
          restaurantId,
          restaurantName: restaurant?.name || "",
          items: updatedCart,
        })
      );
    } catch {}
  };

  const handleAddToCart = (item: any) => {
    setCart((prev) => {
      const current = prev[item.id];
      const next = {
        ...prev,
        [item.id]: {
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: (current?.quantity || 0) + 1,
          isVeg: item.isVeg !== false,
          image: item.image,
        },
      };
      saveCartToStorage(next);
      return next;
    });
  };

  const handleDecrement = (itemId: string) => {
    setCart((prev) => {
      const current = prev[itemId];
      if (!current) return prev;
      let next = { ...prev };
      if (current.quantity <= 1) {
        delete next[itemId];
      } else {
        next[itemId] = { ...current, quantity: current.quantity - 1 };
      }
      saveCartToStorage(next);
      return next;
    });
  };

  const cartItemsList = Object.values(cart);
  const cartCount = cartItemsList.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cartItemsList.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (loading || !restaurant) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] flex items-center justify-center p-4">
        <div className="text-center space-y-2">
          <p className="text-sm font-semibold text-[#222222]">Loading Restaurant Details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F5] pb-28">
      {/* ── 1. Hero Cover Image Header ───────────────────────── */}
      <div className="relative w-full h-[260px] sm:h-[340px] overflow-hidden">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

        {/* Top Floating Controls */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <Link
            href="/"
            className="w-[44px] h-[44px] rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#222222] hover:bg-white active:scale-95 transition-all shadow-sm"
            aria-label="Back to home"
          >
            <ArrowLeft size={20} />
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (navigator.share) navigator.share({ title: restaurant.name, url: window.location.href }).catch(() => {});
              }}
              className="w-[44px] h-[44px] rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#222222] hover:bg-white active:scale-95 transition-all shadow-sm"
              aria-label="Share restaurant"
            >
              <Share2 size={18} />
            </button>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="w-[44px] h-[44px] rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#222222] hover:bg-white active:scale-95 transition-all shadow-sm"
              aria-label="Add to favorites"
            >
              <Heart size={18} className={isFavorite ? "text-[#EF4444] fill-[#EF4444]" : "text-[#666666]"} />
            </button>
          </div>
        </div>

        {/* Photos Counter Badge */}
        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-[11px] font-medium px-3 py-1 rounded-full z-10">
          📷 {restaurant.photos.length} Photos
        </div>
      </div>

      {/* ── 2. Restaurant Profile Info Card ──────────────────── */}
      <main className="max-w-3xl mx-auto px-4 -mt-6 relative z-20 space-y-4">
        <div className="bg-white rounded-[28px] p-5 shadow-card border border-[#ECECEC] space-y-4">
          {/* Title, Tagline & Open Status */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-display font-extrabold text-2xl text-[#222222]">{restaurant.name}</h1>
              <p className="text-xs text-[#FF6B4A] font-bold mt-0.5">{restaurant.tagline}</p>
              <p className="text-xs text-[#666666] font-medium mt-1">
                ★ {restaurant.rating} ({restaurant.reviewCount} Reviews) • {restaurant.cuisines.join(", ")}
              </p>
              <p className="text-xs text-[#999999] mt-0.5">
                {restaurant.time} • {restaurant.distance} • {restaurant.address}
              </p>
            </div>

            <span className="bg-[#EFF7EE] text-[#63B46C] font-bold text-xs px-3 py-1 rounded-full border border-[#63B46C]/20">
              {restaurant.openNow ? "Open Now" : "Closed"}
            </span>
          </div>

          {/* Feature Tags */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 pt-1">
            {restaurant.tags.map((tag: string) => (
              <span key={tag} className="inline-flex items-center gap-1 bg-[#FAF9F5] text-[#222222] text-[11px] font-bold px-3 py-1 rounded-full border border-[#ECECEC] whitespace-nowrap">
                <Leaf size={12} className="text-[#63B46C]" /> {tag}
              </span>
            ))}
          </div>

          {/* Action Buttons Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#ECECEC]">
            <Link href={`/restaurant/${restaurant.id}/menu`} className="w-full">
              <Button variant="primary" size="md" fullWidth className="min-h-[44px] text-xs">
                <Utensils size={16} />
                <span>View Menu</span>
              </Button>
            </Link>

            <Link href={`/restaurant/${restaurant.id}/book`} className="w-full">
              <Button variant="outline" size="md" fullWidth className="min-h-[44px] text-xs border-[#63B46C] text-[#63B46C] hover:bg-[#EFF7EE]">
                <Calendar size={16} />
                <span>Book Table</span>
              </Button>
            </Link>

            <a href={`tel:${restaurant.phone}`} className="w-full">
              <Button variant="outline" size="md" fullWidth className="min-h-[44px] text-xs">
                <Phone size={16} />
                <span>Call</span>
              </Button>
            </a>

            <button
              onClick={() => {
                window.open(`https://maps.google.com/?q=${encodeURIComponent(restaurant.name + ' ' + (restaurant.address || ''))}`, "_blank");
              }}
              className="w-full"
            >
              <Button variant="outline" size="md" fullWidth className="min-h-[44px] text-xs">
                <Navigation size={16} />
                <span>Directions</span>
              </Button>
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-[#ECECEC] text-xs font-semibold pt-3 overflow-x-auto scrollbar-none">
            {[
              { id: "overview", label: "Overview" },
              { id: "menu", label: "Menu" },
              { id: "reviews", label: `Reviews (${reviews.length})` },
              { id: "photos", label: "Photos" },
              { id: "info", label: "Info" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`pb-3 px-4 transition-all relative whitespace-nowrap ${
                  activeTab === t.id ? "text-[#63B46C] font-bold" : "text-[#999999] hover:text-[#222222]"
                }`}
              >
                {t.label}
                {activeTab === t.id && (
                  <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#63B46C]" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content 1: Overview */}
          {activeTab === "overview" && (
            <div className="space-y-4 text-xs text-[#666666]">
              <div className="space-y-1.5">
                <h3 className="font-display font-bold text-sm text-[#222222]">About {restaurant.name}</h3>
                <p className="leading-relaxed">{restaurant.about}</p>
                <p className="text-[11px] text-[#999999] font-medium">
                  Timings: {restaurant.openTime} – {restaurant.closeTime} • {restaurant.priceForTwo}
                </p>
              </div>
            </div>
          )}

          {/* Tab Content 2: Reviews */}
          {activeTab === "reviews" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-sm text-[#222222]">Customer Reviews</h3>
                <span className="text-xs font-bold text-[#F6B73C] flex items-center gap-1">
                  <Star size={14} className="fill-[#F6B73C]" /> {restaurant.rating} / 5.0
                </span>
              </div>

              {reviews.length === 0 ? (
                <p className="text-xs text-[#8C8CA1] py-4 text-center">No reviews yet. Be the first to review!</p>
              ) : (
                <div className="space-y-2.5">
                  {reviews.map((rev: any) => (
                    <div key={rev.id} className="p-3 bg-[#FAF9F5] rounded-[16px] border border-[#ECECEC] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#222222]">{rev.customerName || "Verified Diner"}</span>
                        <span className="text-[11px] text-[#F6B73C] font-bold">★ {rev.rating}</span>
                      </div>
                      <p className="text-xs text-[#666666]">{rev.comment}</p>
                      {rev.createdAt && (
                        <p className="text-[10px] text-[#999999]">{new Date(rev.createdAt).toLocaleDateString()}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab Content 3: Photos */}
          {activeTab === "photos" && (
            <div className="grid grid-cols-2 gap-3">
              {restaurant.photos.map((photo: string, idx: number) => (
                <div key={idx} className="relative h-28 rounded-[16px] overflow-hidden bg-gray-100">
                  <img
                    src={photo}
                    alt={`Photo ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400";
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Tab Content 4: Info */}
          {activeTab === "info" && (
            <div className="space-y-3 text-xs text-[#4A4A68]">
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="text-[#FF6B4A] mt-0.5" />
                <div>
                  <h4 className="font-bold text-[#222222]">Address</h4>
                  <p>{restaurant.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock size={16} className="text-[#FF6B4A] mt-0.5" />
                <div>
                  <h4 className="font-bold text-[#222222]">Operating Hours</h4>
                  <p>{restaurant.openTime} to {restaurant.closeTime} (Mon - Sun)</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone size={16} className="text-[#FF6B4A] mt-0.5" />
                <div>
                  <h4 className="font-bold text-[#222222]">Contact Phone</h4>
                  <p>{restaurant.phone}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── 3. Menu Preview Section ───────────────────────────── */}
        <div className="bg-white rounded-[28px] p-5 shadow-card border border-[#ECECEC] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-[#222222]">Menu Highlights</h3>
            <Link href={`/restaurant/${restaurant.id}/menu`} className="text-xs text-[#FF6B4A] font-bold hover:underline">
              Full Menu →
            </Link>
          </div>

          {restaurant.menuCategories.map((cat: any) => (
            <div key={cat.name} className="space-y-3">
              <h4 className="font-display font-bold text-xs text-[#999999] uppercase tracking-wider">{cat.name}</h4>
              {cat.items.map((item: any) => {
                const inCart = cart[item.id]?.quantity || 0;
                return (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-[#FAF9F5] rounded-[20px] border border-[#ECECEC]">
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-14 rounded-[16px] overflow-hidden flex-shrink-0 bg-gray-100">
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
                        <h5 className="font-display font-bold text-xs text-[#222222]">{item.name}</h5>
                        <p className="font-display font-bold text-xs text-[#FF6B4A] mt-0.5">₹{item.price}</p>
                        <p className="text-[10px] text-[#999999] line-clamp-1">{item.description}</p>
                      </div>
                    </div>

                    <div>
                      {inCart > 0 ? (
                        <div className="flex items-center gap-1.5 bg-[#FFF3E8] border border-[#FF6B00] rounded-full p-1 text-xs font-bold text-[#FF6B00]">
                          <button
                            onClick={() => handleDecrement(item.id)}
                            className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-[#FF6B00] hover:text-white"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-4 text-center">{inCart}</span>
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-[#FF6B00] hover:text-white"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      ) : (
                        <Button variant="primary" size="sm" onClick={() => handleAddToCart(item)}>
                          + Add
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </main>

      {/* ── 4. Floating Bottom Action Bar ─────────────────────── */}
      {cartCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 max-w-3xl mx-auto z-40">
          <div className="bg-[#FF6B4A] text-white p-4 rounded-[24px] shadow-button flex items-center justify-between animate-slide-up">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} />
              <span className="font-display font-bold text-sm">{cartCount} {cartCount === 1 ? "Item" : "Items"} | ₹{cartTotal}</span>
            </div>
            <Link href="/cart">
              <button className="bg-white text-[#FF6B4A] font-display font-bold text-xs px-5 py-2.5 rounded-[18px] hover:bg-gray-100 active:scale-95 transition-all shadow-sm">
                View Cart
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
