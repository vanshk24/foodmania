"use client";

import React from "react";
import Link from "next/link";
import { Truck, Landmark, Sparkles } from "lucide-react";

export function OffersSection() {
  return (
    <div className="py-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-bold text-base text-[#222222]">Best offers for you</h3>
        <Link href="/explore" className="text-xs text-[#FF6B4A] font-bold hover:underline">
          See all
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Free Delivery Card */}
        <Link href="/explore" className="block">
          <div className="bg-gradient-to-r from-[#EFF7EE] to-[#FEF9EF] p-3.5 rounded-[20px] border border-[#63B46C]/20 shadow-soft hover:shadow-card transition-all flex items-center gap-3">
            <div className="w-11 h-11 rounded-[16px] bg-[#63B46C] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <Truck size={20} />
            </div>
            <div>
              <span className="bg-[#63B46C] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                FREE DELIVERY
              </span>
              <p className="font-display font-bold text-xs text-[#222222] mt-1">On order above ₹199</p>
            </div>
          </div>
        </Link>

        {/* Bank Offer Card */}
        <Link href="/explore" className="block">
          <div className="bg-gradient-to-r from-[#FFF1EE] to-[#FEF9EF] p-3.5 rounded-[20px] border border-[#FF6B4A]/20 shadow-soft hover:shadow-card transition-all flex items-center gap-3">
            <div className="w-11 h-11 rounded-[16px] bg-[#FF6B4A] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <Landmark size={20} />
            </div>
            <div>
              <span className="bg-[#FF6B4A] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                BANK OFFER
              </span>
              <p className="font-display font-bold text-xs text-[#222222] mt-1">10% Instant Discount</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
