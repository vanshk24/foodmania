"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Heart, ArrowUpDown, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Badge } from "@food-mania/ui";

import { API_BASE_URL } from "@food-mania/shared";

type SortKey = "rating" | "city" | "name";

export function NearbyRestaurants() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortKey>("rating");
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const fetchRestaurants = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/restaurants`);
      const json = await res.json();
      if (res.ok && Array.isArray(json.data)) {
        setRestaurants(json.data);
      } else {
        setError(json.message || "Failed to fetch nearby restaurants");
      }
    } catch (err) {
      setError("Network error connecting to backend API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const sortedRestaurants = [...restaurants].sort((a, b) => {
    if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
    if (sortBy === "city") return a.city.localeCompare(b.city);
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  if (loading) {
    return (
      <div className="py-6 text-center flex flex-col items-center justify-center space-y-2">
        <Loader2 className="animate-spin text-[#FF6B00]" size={28} />
        <p className="text-xs text-[#8C8CA1]">Loading PostgreSQL database restaurants...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-[20px] text-center space-y-2 my-4">
        <AlertCircle className="mx-auto text-red-500" size={24} />
        <p className="text-xs text-red-600 font-medium">{error}</p>
        <button
          onClick={fetchRestaurants}
          className="px-3 py-1.5 bg-red-600 text-white rounded-full text-xs font-semibold inline-flex items-center gap-1"
        >
          <RefreshCw size={12} /> Retry
        </button>
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div className="py-6 text-center text-xs text-[#8C8CA1] bg-white rounded-[20px] p-4 border border-[#ECECEC]">
        No nearby restaurants currently available in PostgreSQL database.
      </div>
    );
  }

  return (
    <div className="py-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <h3 className="font-display font-bold text-base text-[#1A1A2E]">All Restaurants</h3>

        {/* Sort Controls */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
          <span className="text-[11px] text-[#8C8CA1] font-bold uppercase tracking-wider flex items-center gap-1 flex-shrink-0">
            <ArrowUpDown size={12} className="text-[#FF6B00]" />
            Sort:
          </span>
          {[
            { key: "rating", label: "Top Rated ⭐" },
            { key: "city", label: "By City 📍" },
            { key: "name", label: "Name A-Z 🔤" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setSortBy(item.key as SortKey)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all border whitespace-nowrap min-h-[36px] ${
                sortBy === item.key
                  ? "bg-[#FFF3E8] text-[#FF6B00] border-[#FF6B00]"
                  : "bg-white text-[#4A4A68] border-gray-100 hover:bg-gray-100"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {sortedRestaurants.map((rest) => {
          const isFav = favorites[rest.id];
          const coverImg = rest.imageUrl || rest.bannerUrl || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800";
          return (
            <Link key={rest.id} href={`/restaurant/${rest.id}`} className="block">
              <article className="bg-white rounded-[16px] shadow-[0_2px_12px_rgba(0,0,0,0.07)] border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow active:scale-[0.99]">
                <div className="relative w-full h-[150px] overflow-hidden">
                  <img
                    src={coverImg}
                    alt={rest.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800";
                    }}
                  />

                  <div className="absolute top-3 left-3">
                    <span className="bg-[#FF6B00] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                      CODE: {rest.code || "URBAN123"}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => toggleFavorite(rest.id, e)}
                    className="absolute top-3 right-3 w-[40px] h-[40px] rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#1A1A2E] hover:scale-110 active:scale-90 transition-all shadow-sm"
                  >
                    <Heart
                      size={18}
                      className={isFav ? "text-[#EF4444] fill-[#EF4444]" : "text-[#4A4A68]"}
                    />
                  </button>

                  <div className="absolute bottom-3 left-3">
                    <span className="bg-white/90 backdrop-blur-md text-[#15803D] text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                      <span>{rest.status || "ACTIVE"}</span>
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-display font-bold text-base text-[#1A1A2E]">
                        {rest.name}
                      </h4>
                      <p className="text-xs text-[#8C8CA1] mt-0.5">{rest.cuisine || "Multi-Cuisine"}</p>
                    </div>

                    <div className="flex items-center gap-1 bg-[#FFF3E8] px-2 py-1 rounded-md text-xs font-bold text-[#FF6B00]">
                      <Star size={12} className="fill-[#FF6B00]" />
                      <span>{(rest.rating || 4.8).toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 my-3" />

                  <div className="flex items-center justify-between text-xs text-[#4A4A68]">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <MapPin size={13} className="text-[#8C8CA1]" />
                        <span>{rest.city}</span>
                      </span>
                      <span>•</span>
                      <span>{rest.address || "City Center"}</span>
                    </div>

                    <Badge variant="success" size="sm">
                      Verified Partner
                    </Badge>
                  </div>
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

