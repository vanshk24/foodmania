"use client";

import React from "react";
import { LayoutGrid, Tag, Leaf, Star, MapPin } from "lucide-react";

export interface CategoryItem {
  id: string;
  name: string;
  icon: React.ElementType;
  bgColor: string;
  iconColor: string;
}

export const CATEGORIES: CategoryItem[] = [
  { id: "all", name: "All", icon: LayoutGrid, bgColor: "bg-[#EFF7EE]", iconColor: "text-[#63B46C]" },
  { id: "offers", name: "Offers", icon: Tag, bgColor: "bg-[#FFF1EE]", iconColor: "text-[#FF6B4A]" },
  { id: "pure-veg", name: "Pure Veg", icon: Leaf, bgColor: "bg-[#EFF7EE]", iconColor: "text-[#63B46C]" },
  { id: "top-rated", name: "Top Rated", icon: Star, bgColor: "bg-[#FEF9EF]", iconColor: "text-[#F6B73C]" },
  { id: "nearby", name: "Nearby", icon: MapPin, bgColor: "bg-[#F0F7FF]", iconColor: "text-[#68B8F8]" },
];

interface FoodCategoriesProps {
  selectedCategory?: string;
  onSelectCategory?: (id: string) => void;
}

export function FoodCategories({
  selectedCategory = "all",
  onSelectCategory,
}: FoodCategoriesProps) {
  return (
    <div className="py-2">
      {/* Category Icons Row (Matching reference design) */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto scrollbar-none py-1 px-1">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const IconComp = cat.icon;
          return (
            <button
              key={cat.id}
              id={`cat-${cat.id}`}
              onClick={() => onSelectCategory?.(cat.id)}
              className="flex flex-col items-center gap-1.5 group min-w-[64px] flex-shrink-0"
              aria-pressed={isSelected}
            >
              <div
                className={`w-14 h-14 rounded-[20px] flex items-center justify-center transition-all duration-200 ${
                  isSelected
                    ? "bg-[#63B46C] text-white shadow-md scale-105"
                    : `${cat.bgColor} ${cat.iconColor} group-hover:scale-105`
                }`}
              >
                <IconComp size={22} className={isSelected ? "text-white" : cat.iconColor} />
              </div>
              <span
                className={`text-[11px] font-semibold transition-colors ${
                  isSelected ? "text-[#63B46C] font-bold" : "text-[#222222]"
                }`}
              >
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
