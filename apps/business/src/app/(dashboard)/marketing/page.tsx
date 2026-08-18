"use client";

import React, { useState } from "react";
import { Megaphone, Tag, Plus, Send, CheckCircle2, Percent } from "lucide-react";
import { Card, Badge, Button, Modal } from "@food-mania/ui";

interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  maxDiscount: number;
  minOrder: number;
  usesCount: number;
  status: "active" | "expired";
}

const INITIAL_COUPONS: Coupon[] = [
  { id: "cp-1", code: "FOODMANIA20", discountPercent: 20, maxDiscount: 120, minOrder: 399, usesCount: 142, status: "active" },
  { id: "cp-2", code: "WELCOME100", discountPercent: 15, maxDiscount: 100, minOrder: 299, usesCount: 89, status: "active" },
];

export default function BusinessMarketingPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(20);
  const [minOrder, setMinOrder] = useState(299);

  const handleCreateCoupon = () => {
    if (!code.trim()) return;
    const newCoupon: Coupon = {
      id: `cp-${Date.now()}`,
      code: code.toUpperCase(),
      discountPercent,
      maxDiscount: 150,
      minOrder,
      usesCount: 0,
      status: "active",
    };
    setCoupons([newCoupon, ...coupons]);
    setCode("");
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-[24px] shadow-card border border-[#ECECEC]">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#222222] flex items-center gap-2">
            <Megaphone className="text-[#FF6B4A]" />
            <span>Marketing & Promo Campaigns</span>
          </h1>
          <p className="text-xs text-[#666666] mt-0.5">
            Create discount promo codes, send push notifications, and drive customer retention.
          </p>
        </div>

        <Button variant="primary" size="md" onClick={() => setIsModalOpen(true)} className="min-h-[44px]">
          <Plus size={18} />
          <span>Create Promo Coupon</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {coupons.map((c) => (
          <Card key={c.id} padding="md" className="space-y-3 bg-white border border-[#ECECEC] shadow-card">
            <div className="flex items-center justify-between border-b border-[#ECECEC] pb-3">
              <div className="flex items-center gap-2">
                <Tag size={18} className="text-[#FF6B4A]" />
                <span className="font-display font-bold text-base text-[#222222]">{c.code}</span>
              </div>
              <Badge variant="success" size="sm">{c.status.toUpperCase()}</Badge>
            </div>

            <div className="space-y-1 text-xs text-[#666666]">
              <div className="flex justify-between"><span>Discount:</span> <strong className="text-[#63B46C]">{c.discountPercent}% OFF (up to ₹{c.maxDiscount})</strong></div>
              <div className="flex justify-between"><span>Min Order Amount:</span> <strong className="text-[#222222]">₹{c.minOrder}</strong></div>
              <div className="flex justify-between"><span>Total Redemptions:</span> <strong className="text-[#FF6B4A]">{c.usesCount} times</strong></div>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Promo Coupon">
        <div className="space-y-4 py-2">
          <div>
            <label className="text-xs font-bold text-[#222222] block mb-1">Coupon Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. SUMMER25"
              className="w-full bg-[#FAF9F5] border border-[#ECECEC] rounded-[18px] p-3 text-xs font-bold text-[#222222] uppercase focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#222222] block mb-1">Discount %</label>
              <input
                type="number"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                className="w-full bg-[#FAF9F5] border border-[#ECECEC] rounded-[18px] p-3 text-xs text-[#222222] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#222222] block mb-1">Min Order (₹)</label>
              <input
                type="number"
                value={minOrder}
                onChange={(e) => setMinOrder(Number(e.target.value))}
                className="w-full bg-[#FAF9F5] border border-[#ECECEC] rounded-[18px] p-3 text-xs text-[#222222] focus:outline-none"
              />
            </div>
          </div>

          <Button variant="primary" size="lg" fullWidth onClick={handleCreateCoupon} className="min-h-[48px]">
            <span>Publish Promo Code</span>
          </Button>
        </div>
      </Modal>
    </div>
  );
}
