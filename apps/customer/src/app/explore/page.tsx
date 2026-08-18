"use client";

import React, { useState } from "react";
import { Search, MapPin, SlidersHorizontal, Compass } from "lucide-react";
import { BottomNav } from "@/components/layouts/BottomNav";
import { RestaurantCard } from "@/components/common/RestaurantCard";

const MOCK_EXPLORE_RESTAURANTS = [
  {
    id: "exp-1",
    name: "The Urban Cafe",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
    rating: 4.6,
    reviewCount: 3200,
    cuisine: ["North Indian", "Cafe", "Continental"],
    distance: "1.2 km",
    openNow: true,
    openTime: "10:00 AM",
    closeTime: "11:00 PM",
    priceRange: "₹₹" as const,
    dietary: "mixed" as const,
    availableTables: 6,
    offer: "20% Off",
  },
  {
    id: "exp-2",
    name: "Spice Symphony",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    rating: 4.8,
    reviewCount: 892,
    cuisine: ["South Indian", "Biryani"],
    distance: "2.1 km",
    openNow: true,
    openTime: "11:00 AM",
    closeTime: "11:30 PM",
    priceRange: "₹" as const,
    dietary: "veg" as const,
    availableTables: 4,
  },
];

export default function ExplorePage() {
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen bg-[#F5F6FA] pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white px-4 py-3 border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Compass size={22} className="text-[#FF6B00]" />
          <h1 className="font-display font-bold text-xl text-[#1A1A2E]">Explore Restaurants</h1>
        </div>
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C8CA1]" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by cuisine, dish or restaurant..."
            className="w-full bg-[#F8F9FA] border border-[#E5E7EB] rounded-[10px] pl-10 pr-10 py-2.5 text-sm text-[#1A1A2E] focus:outline-none focus:border-[#FF6B00]"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#FF6B00]">
            <SlidersHorizontal size={16} />
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#8C8CA1] uppercase tracking-wider">
            Showing All Places
          </span>
          <span className="text-xs text-[#FF6B00] font-semibold cursor-pointer">Filter Map</span>
        </div>

        <div className="space-y-4">
          {MOCK_EXPLORE_RESTAURANTS.map((item) => (
            <RestaurantCard key={item.id} {...item} />
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
