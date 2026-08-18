"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Heart, Loader2, AlertCircle, RefreshCw } from "lucide-react";

import { API_BASE_URL } from "@food-mania/shared";

export function RecommendedRestaurants() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
        setError(json.message || "Failed to load restaurants");
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

  if (loading) {
    return (
      <div className="py-6 text-center flex flex-col items-center justify-center space-y-2">
        <Loader2 className="animate-spin text-[#FF6B4A]" size={28} />
        <p className="text-xs text-[#8C8CA1]">Loading restaurants from PostgreSQL...</p>
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
        No restaurants found in database.
      </div>
    );
  }

  return (
    <div className="py-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-bold text-base text-[#222222]">Recommended for you</h3>
        <Link href="/explore" className="text-xs text-[#FF6B4A] font-bold hover:underline">
          See all ({restaurants.length})
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {restaurants.map((rest) => {
          const isFav = favorites[rest.id];
          const bgImage = rest.imageUrl || rest.bannerUrl || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800";
          return (
            <Link key={rest.id} href={`/restaurant/${rest.id}`} className="block">
              <article className="bg-white rounded-[24px] shadow-card border border-[#ECECEC] overflow-hidden cursor-pointer hover:shadow-card-hover hover:-translate-y-1 transition-all">
                <div className="relative w-full h-[140px] overflow-hidden">
                  <img
                    src={bgImage}
                    alt={rest.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800";
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => toggleFavorite(rest.id, e)}
                    className="absolute top-3 right-3 w-[36px] h-[36px] rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#222222] hover:scale-110 active:scale-90 transition-transform shadow-sm"
                  >
                    <Heart
                      size={16}
                      className={isFav ? "text-[#EF4444] fill-[#EF4444]" : "text-[#666666]"}
                    />
                  </button>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-display font-bold text-base text-[#222222]">
                        {rest.name}
                      </h4>
                      <p className="text-xs text-[#666666] mt-0.5">{rest.cuisine || "Multi-Cuisine"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#666666] font-medium">
                    <span className="flex items-center gap-1 text-[#F6B73C] font-bold">
                      <Star size={13} className="fill-[#F6B73C]" />
                      <span>{rest.rating || 4.8}</span>
                      <span className="text-[#999999] font-normal">({rest.reviewCount || 12})</span>
                    </span>
                    <span>•</span>
                    <span>{rest.city}</span>
                    <span>•</span>
                    <span>Code: {rest.code || "N/A"}</span>
                  </div>

                  <div className="pt-1">
                    <span className="inline-block bg-[#FFF1EE] text-[#FF6B4A] text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-[#FF6B4A]/20">
                      ₹{rest.deliveryFee || 40} Delivery • Min ₹{rest.minOrder || 200}
                    </span>
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

