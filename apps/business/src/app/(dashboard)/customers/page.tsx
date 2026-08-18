"use client";

import React, { useState } from "react";
import { Users, Search, Star, Award, History, Heart, Plus } from "lucide-react";
import { Card, Badge, Button, Drawer } from "@food-mania/ui";

interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalVisits: number;
  totalSpend: number;
  loyaltyPoints: number;
  favouriteDish: string;
  lastVisit: string;
}

const CUSTOMERS: CustomerRecord[] = [
  {
    id: "c-1",
    name: "Rahul Sharma",
    phone: "+91 98765 43210",
    email: "rahul.sharma@example.com",
    totalVisits: 14,
    totalSpend: 12480,
    loyaltyPoints: 340,
    favouriteDish: "Truffle Mushroom Pizza",
    lastVisit: "Today",
  },
  {
    id: "c-2",
    name: "Priya Patel",
    phone: "+91 98123 45678",
    email: "priya.patel@example.com",
    totalVisits: 8,
    totalSpend: 6840,
    loyaltyPoints: 180,
    favouriteDish: "Avocado Toast Sourdough",
    lastVisit: "Yesterday",
  },
  {
    id: "c-3",
    name: "Vikram Malhotra",
    phone: "+91 98999 11223",
    email: "vikram.m@example.com",
    totalVisits: 22,
    totalSpend: 24500,
    loyaltyPoints: 620,
    favouriteDish: "Wood-Fired Margherita",
    lastVisit: "3 days ago",
  },
];

export default function BusinessCustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null);

  const filteredCustomers = CUSTOMERS.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-[24px] shadow-card border border-[#ECECEC]">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#222222] flex items-center gap-2">
            <Users className="text-[#63B46C]" />
            <span>Customer Relationship Directory (CRM)</span>
          </h1>
          <p className="text-xs text-[#666666] mt-0.5">
            Track dining frequency, lifetime spend, loyalty rewards, and customer preferences.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#999999]" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customer name or phone..."
            className="w-full bg-[#FAF9F5] border border-[#ECECEC] rounded-[18px] pl-10 pr-3 py-2 text-xs text-[#222222] placeholder:text-[#999999] focus:outline-none focus:ring-2 focus:ring-[#63B46C]/30 min-h-[40px]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredCustomers.map((c) => (
          <Card key={c.id} padding="md" className="space-y-3 bg-white border border-[#ECECEC] shadow-card">
            <div className="flex items-center justify-between border-b border-[#ECECEC] pb-3">
              <div>
                <h3 className="font-display font-bold text-base text-[#222222]">{c.name}</h3>
                <p className="text-xs text-[#666666]">{c.phone}</p>
              </div>
              <Badge variant="orange" size="sm">{c.loyaltyPoints} PTS</Badge>
            </div>

            <div className="space-y-1.5 text-xs text-[#666666]">
              <div className="flex justify-between"><span>Total Dining Visits:</span> <strong className="text-[#222222]">{c.totalVisits} Visits</strong></div>
              <div className="flex justify-between"><span>Lifetime Spend:</span> <strong className="text-[#63B46C]">₹{c.totalSpend}</strong></div>
              <div className="flex justify-between"><span>Favourite Dish:</span> <strong className="text-[#FF6B4A]">{c.favouriteDish}</strong></div>
            </div>

            <Button variant="outline" size="sm" fullWidth onClick={() => setSelectedCustomer(c)} className="min-h-[38px]">
              <History size={14} />
              <span>View History & Rewards</span>
            </Button>
          </Card>
        ))}
      </div>

      {/* History Drawer */}
      <Drawer
        isOpen={Boolean(selectedCustomer)}
        onClose={() => setSelectedCustomer(null)}
        title={selectedCustomer?.name || "Customer Profile"}
        position="right"
      >
        <div className="space-y-4 text-xs text-[#222222]">
          <div className="p-4 bg-[#FAF9F5] rounded-[20px] border border-[#ECECEC] space-y-2">
            <p><strong>Phone:</strong> {selectedCustomer?.phone}</p>
            <p><strong>Email:</strong> {selectedCustomer?.email}</p>
            <p><strong>Loyalty Balance:</strong> <span className="text-[#FF6B4A] font-bold">{selectedCustomer?.loyaltyPoints} Points</span></p>
            <p><strong>Total Lifetime Spend:</strong> <span className="text-[#63B46C] font-bold">₹{selectedCustomer?.totalSpend}</span></p>
          </div>

          <div>
            <h4 className="font-display font-bold text-sm mb-2">Recent Visits & Orders</h4>
            <div className="space-y-2">
              <div className="p-3 bg-white border border-[#ECECEC] rounded-[16px] flex justify-between">
                <div>
                  <p className="font-bold">Order #FM-9082</p>
                  <p className="text-[10px] text-[#666666]">Truffle Mushroom Pizza x 1</p>
                </div>
                <span className="font-bold text-[#FF6B4A]">₹848</span>
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
