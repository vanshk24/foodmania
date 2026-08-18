"use client";

import React, { useState } from "react";
import { HeaderSection } from "@/components/home/HeaderSection";
import { SearchSection } from "@/components/home/SearchSection";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { FoodCategories } from "@/components/home/FoodCategories";
import { OffersSection } from "@/components/home/OffersSection";
import { NearbyRestaurants } from "@/components/home/NearbyRestaurants";
import { RecommendedRestaurants } from "@/components/home/RecommendedRestaurants";
import { BottomNav } from "@/components/layouts/BottomNav";
import { Modal, Drawer, Button, Badge } from "@food-mania/ui";
import { MapPin, Bell, Mic, SlidersHorizontal, Check, Clock, Sparkles, QrCode, CalendarDays } from "lucide-react";

const POPULAR_LOCATIONS = [
  "Andheri West, Mumbai",
  "Bandra West, Mumbai",
  "Juhu, Mumbai",
  "Powai, Mumbai",
  "Lower Parel, Mumbai",
  "Delhi NCR, India",
  "Bengaluru, Karnataka",
];

const NOTIFICATIONS_LIST = [
  {
    id: "1",
    title: "Table Booking Confirmed!",
    message: "Your table for 4 at The Urban Cafe is confirmed for today at 7:30 PM.",
    time: "10 min ago",
    unread: true,
    icon: "🎉",
  },
  {
    id: "2",
    title: "Flat 20% OFF Offer Available",
    message: "Use code FOODMANIA20 on your next order at Spice Symphony.",
    time: "2 hours ago",
    unread: true,
    icon: "🏷️",
  },
];

export default function CustomerHomeScreen() {
  const [selectedLocation, setSelectedLocation] = useState("Andheri West, Mumbai");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals & Drawers Interactive State
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  // Filter States
  const [selectedCuisine, setSelectedCuisine] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [isVegOnly, setIsVegOnly] = useState<boolean>(false);

  const toggleCuisine = (c: string) => {
    setSelectedCuisine((prev) =>
      prev.includes(c) ? prev.filter((item) => item !== c) : [...prev, c]
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF9F5] pb-24 overflow-x-hidden">
      {/* ── 1. Sticky Header ───────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md px-4 pt-safe-top shadow-soft border-b border-[#ECECEC]">
        <HeaderSection
          location={selectedLocation}
          unreadNotifications={true}
          userInitials="RS"
          onLocationClick={() => setIsLocationModalOpen(true)}
          onNotificationClick={() => setIsNotificationsOpen(true)}
          onProfileClick={() => (window.location.href = "/profile")}
        />

        {/* ── 2. Search Section ─────────────────────────────────── */}
        <SearchSection
          value={searchQuery}
          onChange={setSearchQuery}
          onFilterClick={() => setIsFilterModalOpen(true)}
          onVoiceClick={() => setIsVoiceModalOpen(true)}
        />
      </header>

      {/* ── Main Content Area ───────────────────────────────────── */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-2 space-y-3">
        {/* ── 3. Hero Banner Carousel ───────────────────────────── */}
        <HeroCarousel />

        {/* ── Quick Actions: Scan QR + For Table ─────────── */}
        <div className="grid grid-cols-2 gap-3">
          <a
            href="/scan"
            className="flex items-center gap-3 bg-gradient-to-br from-[#FF6B4A] to-[#e5592e] text-white rounded-[20px] px-4 py-3.5 shadow-md hover:shadow-lg active:scale-95 transition-all"
          >
            <div className="w-9 h-9 rounded-[12px] bg-white/20 flex items-center justify-center shrink-0">
              <QrCode size={18} />
            </div>
            <div>
              <p className="font-bold text-sm leading-tight">Scan QR</p>
              <p className="text-[10px] text-white/70">Table ordering</p>
            </div>
          </a>
          <a
            href="/book"
            className="flex items-center gap-3 bg-gradient-to-br from-[#63B46C] to-[#4B9A54] text-white rounded-[20px] px-4 py-3.5 shadow-md hover:shadow-lg active:scale-95 transition-all"
          >
            <div className="w-9 h-9 rounded-[12px] bg-white/20 flex items-center justify-center shrink-0">
              <CalendarDays size={18} />
            </div>
            <div>
              <p className="font-bold text-sm leading-tight">For Table</p>
              <p className="text-[10px] text-white/70">Book a seat</p>
            </div>
          </a>
        </div>

        {/* ── 4. Food Categories (Horizontal Scroll) ───────────── */}
        <FoodCategories
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* ── 5. Recommended Restaurants ───────────────────────── */}
        <RecommendedRestaurants />

        {/* ── 6. Best Offers Section ────────────────────────────── */}
        <OffersSection />

        {/* ── 7. Nearby Restaurants ─────────────────────────────── */}
        <NearbyRestaurants />

        {/* Spacer for bottom navigation */}
        <div className="h-6" />
      </main>

      {/* ── 8. Bottom Navigation ────────────────────────────────── */}
      <BottomNav />

      {/* ── 9. Location Selection Modal ─────────────────────────── */}
      <Modal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        title="Select Your Location"
        description="Choose a location to discover top dining and delivery options nearby."
      >
        <div className="space-y-2 py-2">
          {POPULAR_LOCATIONS.map((loc) => {
            const isSelected = selectedLocation === loc;
            return (
              <button
                key={loc}
                onClick={() => {
                  setSelectedLocation(loc);
                  setIsLocationModalOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-[16px] text-xs font-semibold transition-all border ${
                  isSelected
                    ? "bg-[#FFF1EE] text-[#FF6B4A] border-[#FF6B4A]"
                    : "bg-[#F8F9FA] text-[#222222] border-gray-100 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MapPin size={18} className={isSelected ? "text-[#FF6B4A]" : "text-[#999999]"} />
                  <span>{loc}</span>
                </div>
                {isSelected && <Check size={18} className="text-[#FF6B4A]" />}
              </button>
            );
          })}
        </div>
      </Modal>

      {/* ── 10. Notifications Drawer ────────────────────────────── */}
      <Drawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        title="Notifications & Updates"
        position="right"
      >
        <div className="space-y-3">
          {NOTIFICATIONS_LIST.map((n) => (
            <div
              key={n.id}
              className={`p-3.5 rounded-[16px] border transition-all ${
                n.unread
                  ? "bg-[#FFF1EE]/60 border-[#FF6B4A]/30"
                  : "bg-[#F8F9FA] border-gray-100"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl select-none">{n.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-display font-bold text-xs text-[#222222]">{n.title}</h4>
                    <span className="text-[10px] text-[#999999]">{n.time}</span>
                  </div>
                  <p className="text-xs text-[#666666] mt-1 leading-relaxed">{n.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Drawer>

      {/* ── 11. Search Filter Modal ─────────────────────────────── */}
      <Modal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        title="Refine Search Filters"
        description="Filter restaurants by dietary preferences, ratings, and cuisines."
        footer={
          <div className="flex items-center gap-3 w-full">
            <Button
              variant="outline"
              fullWidth
              onClick={() => {
                setSelectedCuisine([]);
                setMinRating(0);
                setIsVegOnly(false);
              }}
            >
              Reset All
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={() => setIsFilterModalOpen(false)}
            >
              Apply Filters
            </Button>
          </div>
        }
      >
        <div className="space-y-4 py-2">
          {/* Pure Veg Toggle */}
          <div className="flex items-center justify-between p-3 bg-[#F8F9FA] rounded-[16px] border border-gray-100">
            <div>
              <p className="font-display font-bold text-xs text-[#222222]">Pure Veg Only</p>
              <p className="text-[11px] text-[#999999]">Show 100% Vegetarian certified spots</p>
            </div>
            <button
              onClick={() => setIsVegOnly(!isVegOnly)}
              className={`w-12 h-7 rounded-full p-1 transition-colors ${
                isVegOnly ? "bg-[#63B46C]" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  isVegOnly ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Rating Selector */}
          <div>
            <h4 className="font-display font-bold text-xs text-[#222222] mb-2">Minimum Rating</h4>
            <div className="grid grid-cols-4 gap-2">
              {[0, 3.5, 4.0, 4.5].map((r) => (
                <button
                  key={r}
                  onClick={() => setMinRating(r)}
                  className={`py-2 rounded-[12px] text-xs font-semibold border ${
                    minRating === r
                      ? "bg-[#FF6B4A] text-white border-[#FF6B4A]"
                      : "bg-[#F8F9FA] text-[#666666] border-gray-100"
                  }`}
                >
                  {r === 0 ? "Any Rating" : `${r}+ ⭐`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* ── 12. Voice Search Modal ──────────────────────────────── */}
      <Modal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        title="Voice Search"
      >
        <div className="flex flex-col items-center justify-center py-8 space-y-4 text-center">
          <div className="w-20 h-20 rounded-full bg-[#FFF1EE] text-[#FF6B4A] flex items-center justify-center animate-bounce shadow-lg">
            <Mic size={36} />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-[#222222]">Listening...</h3>
            <p className="text-xs text-[#999999] mt-1">Try saying &quot;Best Italian pizza in Bandra&quot; or &quot;Coffee cafes&quot;</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsVoiceModalOpen(false)}>
            Cancel Voice Search
          </Button>
        </div>
      </Modal>
    </div>
  );
}
