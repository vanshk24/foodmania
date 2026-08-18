"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, Mic, SlidersHorizontal, Clock, TrendingUp, Utensils, X, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SearchSectionProps {
  value?: string;
  onChange?: (val: string) => void;
  onFilterClick?: () => void;
  onVoiceClick?: () => void;
}

const RECENT_SEARCHES = [
  "Truffle Mushroom Pizza",
  "Rooftop cafes in Bandra",
  "Artisanal Cold Brew",
  "North Indian Thali",
];

const TRENDING_SEARCHES = [
  { term: "Wood-fired Pizza", category: "Dish", emoji: "🍕" },
  { term: "The Urban Cafe", category: "Restaurant", emoji: "☕" },
  { term: "Italian Cuisines", category: "Cuisine", emoji: "🍝" },
  { term: "Pure Veg Thali", category: "Dietary", emoji: "🫓" },
];

const QUICK_DISH_SUGGESTIONS = [
  "Burger",
  "Cold Brew",
  "Sushi",
  "Butter Chicken",
  "Dim Sum",
  "Tiramisu",
];

export function SearchSection({
  value = "",
  onChange,
  onFilterClick,
  onVoiceClick,
}: SearchSectionProps) {
  const [internalVal, setInternalVal] = useState(value);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInternalVal(val);
    onChange?.(val);
    setIsDropdownOpen(true);
  };

  const handleSelectSearchTerm = (term: string) => {
    setInternalVal(term);
    onChange?.(term);
    setIsDropdownOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="py-2 max-w-5xl mx-auto relative" ref={dropdownRef}>
      <div className="relative flex items-center gap-2">
        {/* Input container */}
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C8CA1] pointer-events-none"
            aria-hidden="true"
          />
          <input
            id="restaurant-search-input"
            type="search"
            value={internalVal}
            onChange={handleChange}
            onFocus={() => setIsDropdownOpen(true)}
            placeholder="Search restaurants, dishes, cuisines, locations..."
            className="w-full bg-[#F8F9FA] text-[#1A1A2E] placeholder:text-[#8C8CA1] border border-gray-100 rounded-[12px] pl-10 pr-11 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00] focus:bg-white transition-all shadow-sm min-h-[44px]"
            aria-label="Search restaurants, cuisines, dishes"
          />

          {internalVal ? (
            <button
              type="button"
              onClick={() => {
                setInternalVal("");
                onChange?.("");
              }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C8CA1] hover:text-[#1A1A2E]"
            >
              <X size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={onVoiceClick}
              className="absolute right-1 top-1/2 -translate-y-1/2 w-[40px] h-[40px] flex items-center justify-center text-[#8C8CA1] hover:text-[#FF6B00] active:scale-95 transition-all rounded-full"
              title="Voice Search"
              aria-label="Voice Search"
            >
              <Mic size={18} />
            </button>
          )}
        </div>

        {/* Filter button */}
        <button
          id="search-filter-button"
          onClick={onFilterClick}
          className="w-[44px] h-[44px] flex items-center justify-center rounded-[12px] bg-[#FF6B00] text-white shadow-[0_4px_14px_rgba(255,107,0,0.35)] hover:bg-[#E85F00] active:scale-[0.96] transition-all flex-shrink-0"
          aria-label="Open Filters"
        >
          <SlidersHorizontal size={18} />
        </button>
      </div>

      {/* ── Live Search Dropdown Panel (Apple / Stripe Design) ── */}
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 z-50 mt-2 bg-white rounded-[18px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-gray-100 p-4 space-y-4 max-h-[70vh] overflow-y-auto"
          >
            {/* Quick Dish Pills */}
            <div>
              <p className="text-[11px] text-[#8C8CA1] uppercase tracking-wider font-bold mb-2">Popular Dishes</p>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_DISH_SUGGESTIONS.map((dish) => (
                  <button
                    key={dish}
                    onClick={() => handleSelectSearchTerm(dish)}
                    className="px-3 py-1 bg-[#F8F9FA] hover:bg-[#FFF3E8] hover:text-[#FF6B00] text-[#4A4A68] rounded-full text-xs font-semibold border border-gray-100 transition-all min-h-[36px]"
                  >
                    {dish}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Searches */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] text-[#8C8CA1] uppercase tracking-wider font-bold flex items-center gap-1">
                  <Clock size={12} className="text-[#FF6B00]" />
                  <span>Recent Searches</span>
                </p>
              </div>
              <div className="space-y-1">
                {RECENT_SEARCHES.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSelectSearchTerm(term)}
                    className="w-full text-left flex items-center justify-between p-2 rounded-[10px] hover:bg-[#F8F9FA] text-xs text-[#1A1A2E] transition-colors"
                  >
                    <span>{term}</span>
                    <span className="text-[10px] text-[#8C8CA1]">History</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Trending Searches */}
            <div>
              <p className="text-[11px] text-[#8C8CA1] uppercase tracking-wider font-bold flex items-center gap-1 mb-2">
                <TrendingUp size={12} className="text-[#FF6B00]" />
                <span>Trending Now</span>
              </p>
              <div className="grid grid-cols-2 gap-2">
                {TRENDING_SEARCHES.map((item) => (
                  <button
                    key={item.term}
                    onClick={() => handleSelectSearchTerm(item.term)}
                    className="flex items-center gap-2 p-2 bg-[#F8F9FA] hover:bg-[#FFF3E8] rounded-[10px] text-xs text-[#1A1A2E] transition-colors border border-gray-50"
                  >
                    <span className="text-sm select-none">{item.emoji}</span>
                    <div className="text-left truncate">
                      <p className="font-bold truncate">{item.term}</p>
                      <p className="text-[9px] text-[#8C8CA1]">{item.category}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
