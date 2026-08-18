"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, Clock, ChevronRight } from "lucide-react";

export interface RestaurantCardProps {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  cuisine: string[];
  distance: string;
  openNow: boolean;
  openTime?: string;
  closeTime?: string;
  priceRange?: string;
  dietary: "veg" | "non-veg" | "mixed";
  availableTables?: number;
  waitTime?: string;
  offer?: string;
  onClick?: () => void;
}

function DietaryBadge({ type }: { type: RestaurantCardProps["dietary"] }) {
  const config = {
    veg: { dot: "bg-[#22C55E]", label: "Pure Veg" },
    "non-veg": { dot: "bg-[#EF4444]", label: "Non Veg" },
    mixed: { dot: "bg-[#F59E0B]", label: "Veg & Non-Veg" },
  };
  const { dot, label } = config[type];
  return (
    <span className="inline-flex items-center gap-1">
      <span className={`w-2 h-2 rounded-full ${dot} flex-shrink-0`} />
      <span className="text-xs text-[#8C8CA1]">{label}</span>
    </span>
  );
}

export function RestaurantCard({
  id,
  name,
  image,
  rating,
  reviewCount,
  cuisine,
  distance,
  openNow,
  openTime,
  closeTime,
  dietary,
  availableTables,
  offer,
}: RestaurantCardProps) {
  return (
    <Link href={`/restaurant/${id}`} className="block">
      <article className="bg-white rounded-[16px] shadow-[0_2px_12px_rgba(0,0,0,0.07)] border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow active:scale-[0.99]">
        <div className="relative w-full h-[160px] overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800";
            }}
          />

          {offer && (
            <div className="absolute top-3 left-3">
              <span className="bg-[#FF6B00] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                {offer}
              </span>
            </div>
          )}

          <div className="absolute top-3 right-3">
            <span
              className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                openNow
                  ? "bg-[#DCFCE7] text-[#15803D]"
                  : "bg-[#FEE2E2] text-[#DC2626]"
              }`}
            >
              {openNow ? "Open" : "Closed"}
            </span>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display font-bold text-[16px] text-[#1A1A2E] leading-snug line-clamp-1">
              {name}
            </h3>
            <ChevronRight size={18} className="text-[#8C8CA1] flex-shrink-0 mt-0.5" />
          </div>

          <p className="text-[13px] text-[#8C8CA1] mt-0.5 line-clamp-1">
            {cuisine.join(" • ")}
          </p>

          <div className="mt-1.5">
            <DietaryBadge type={dietary} />
          </div>

          <div className="border-t border-gray-100 my-3" />

          <div className="flex items-center justify-between text-[13px]">
            <div className="flex items-center gap-1">
              <Star size={14} className="text-[#FF6B00] fill-[#FF6B00]" />
              <span className="font-bold text-[#1A1A2E]">{rating.toFixed(1)}</span>
              <span className="text-[#8C8CA1]">
                ({reviewCount >= 1000 ? `${(reviewCount / 1000).toFixed(1)}k` : reviewCount})
              </span>
            </div>

            <div className="flex items-center gap-1 text-[#8C8CA1]">
              <MapPin size={13} />
              <span>{distance}</span>
            </div>

            {openTime && closeTime && (
              <div className="flex items-center gap-1 text-[#8C8CA1]">
                <Clock size={13} />
                <span>
                  {openTime} – {closeTime}
                </span>
              </div>
            )}

            {availableTables !== undefined && (
              <div className="flex items-center gap-1">
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    availableTables > 0
                      ? "bg-[#DCFCE7] text-[#15803D]"
                      : "bg-[#FEE2E2] text-[#DC2626]"
                  }`}
                >
                  {availableTables > 0 ? `${availableTables} tables` : "Full"}
                </span>
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
