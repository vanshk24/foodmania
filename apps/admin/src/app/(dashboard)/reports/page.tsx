"use client";
import React, { useState } from "react";
import {
  BarChart3, Download, TrendingUp, Users, Store,
  ShoppingBag, Star, Clock, ArrowUp, ArrowDown, FileText
} from "lucide-react";

// ─── Types & Data ─────────────────────────────────────────────────────────────

type TimeRange = "7d" | "30d" | "year";

const KPI_DATA: Record<TimeRange, { revenue: string; orders: number; restaurants: number; customers: number; revenueGrowth: number; ordersGrowth: number }> = {
  "7d":   { revenue: "₹4,82,340",   orders: 3248,  restaurants: 248, customers: 12840, revenueGrowth: 12.4,  ordersGrowth: 8.2  },
  "30d":  { revenue: "₹18,96,200",  orders: 14820, restaurants: 248, customers: 12840, revenueGrowth: 18.7,  ordersGrowth: 15.3 },
  "year": { revenue: "₹2,84,52,000", orders: 182400, restaurants: 248, customers: 12840, revenueGrowth: 34.1, ordersGrowth: 29.6 },
};

const BAR_DATA: Record<TimeRange, { label: string; orders: number; revenue: number }[]> = {
  "7d": [
    { label: "Mon", orders: 380, revenue: 62400 },
    { label: "Tue", orders: 420, revenue: 74200 },
    { label: "Wed", orders: 510, revenue: 88600 },
    { label: "Thu", orders: 490, revenue: 84100 },
    { label: "Fri", orders: 640, revenue: 112800 },
    { label: "Sat", orders: 820, revenue: 148400 },
    { label: "Sun", orders: 760, revenue: 130200 },
  ],
  "30d": [
    { label: "Wk 1", orders: 2240, revenue: 408000 },
    { label: "Wk 2", orders: 2880, revenue: 524400 },
    { label: "Wk 3", orders: 3640, revenue: 662800 },
    { label: "Wk 4", orders: 4200, revenue: 764000 },
  ],
  "year": [
    { label: "Jan", orders: 12400, revenue: 2240000 },
    { label: "Feb", orders: 11800, revenue: 2140000 },
    { label: "Mar", orders: 13200, revenue: 2380000 },
    { label: "Apr", orders: 14600, revenue: 2620000 },
    { label: "May", orders: 15800, revenue: 2840000 },
    { label: "Jun", orders: 17200, revenue: 3080000 },
    { label: "Jul", orders: 18420, revenue: 3320000 },
    { label: "Aug", orders: 16400, revenue: 2960000 },
    { label: "Sep", orders: 14800, revenue: 2660000 },
    { label: "Oct", orders: 16200, revenue: 2920000 },
    { label: "Nov", orders: 18800, revenue: 3380000 },
    { label: "Dec", orders: 22800, revenue: 4100000 },
  ],
};

const TOP_RESTAURANTS = [
  { rank: 1, name: "Spice Symphony",   city: "Mumbai",    revenue: "₹3,12,400", orders: 2340, rating: 4.8 },
  { rank: 2, name: "The Urban Cafe",   city: "Mumbai",    revenue: "₹1,84,520", orders: 1842, rating: 4.6 },
  { rank: 3, name: "Italian Corner",   city: "Bangalore", revenue: "₹1,48,000", orders: 1240, rating: 4.7 },
  { rank: 4, name: "Burger Hub",       city: "Pune",      revenue: "₹92,400",   orders: 980,  rating: 4.5 },
  { rank: 5, name: "Royal Treat Hotel",city: "Mumbai",    revenue: "₹0",        orders: 0,    rating: 0   },
];

const BEST_SELLERS = [
  { rank: 1, item: "Paneer Butter Masala", restaurant: "Spice Symphony",  orders: 840 },
  { rank: 2, item: "Chicken Biryani",       restaurant: "The Urban Cafe",  orders: 720 },
  { rank: 3, item: "Margherita Pizza",      restaurant: "Italian Corner",  orders: 610 },
  { rank: 4, item: "Classic Burger",        restaurant: "Burger Hub",      orders: 540 },
  { rank: 5, item: "Masala Chai",           restaurant: "The Urban Cafe",  orders: 490 },
];

const PEAK_HOURS = [
  { hour: "8 AM",  intensity: 0.15 },
  { hour: "9 AM",  intensity: 0.20 },
  { hour: "10 AM", intensity: 0.25 },
  { hour: "11 AM", intensity: 0.35 },
  { hour: "12 PM", intensity: 0.80 },
  { hour: "1 PM",  intensity: 0.95 },
  { hour: "2 PM",  intensity: 0.70 },
  { hour: "3 PM",  intensity: 0.40 },
  { hour: "4 PM",  intensity: 0.30 },
  { hour: "5 PM",  intensity: 0.45 },
  { hour: "6 PM",  intensity: 0.60 },
  { hour: "7 PM",  intensity: 0.85 },
  { hour: "8 PM",  intensity: 1.00 },
  { hour: "9 PM",  intensity: 0.90 },
  { hour: "10 PM", intensity: 0.65 },
  { hour: "11 PM", intensity: 0.30 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function GrowthBadge({ value }: { value: number }) {
  const positive = value >= 0;
  return (
    <span className={`flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full ${positive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
      {positive ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
      {Math.abs(value)}%
    </span>
  );
}

// ─── Bar Chart ────────────────────────────────────────────────────────────────

function BarChart({ data }: { data: { label: string; orders: number; revenue: number }[] }) {
  const maxOrders = Math.max(...data.map((d) => d.orders));
  return (
    <div className="flex items-end gap-2 h-40 pt-4">
      {data.map((d) => {
        const heightPct = (d.orders / maxOrders) * 100;
        return (
          <div key={d.label} className="flex-1 flex flex-col items-center gap-1 group cursor-pointer">
            <div className="relative w-full flex justify-center">
              {/* Tooltip */}
              <div className="absolute bottom-full mb-1 hidden group-hover:block z-10 bg-[#222222] text-white text-[10px] px-2 py-1 rounded-[8px] whitespace-nowrap pointer-events-none">
                {d.orders.toLocaleString()} orders
              </div>
              <div
                className="w-full max-w-[28px] rounded-t-[6px] transition-all duration-300 group-hover:opacity-80"
                style={{
                  height: `${heightPct}%`,
                  minHeight: 4,
                  background: "linear-gradient(to top, #FF6B4A, #F6B73C)",
                }}
              />
            </div>
            <span className="text-[10px] text-[#8C8CA1] font-medium">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminReportsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");
  const kpi = KPI_DATA[timeRange];
  const bars = BAR_DATA[timeRange];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#222222]">Platform Analytics & Reports</h1>
          <p className="text-sm text-[#8C8CA1] mt-1">Revenue, orders, growth, and performance insights</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              // PDF export action
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold bg-[#FAF9F5] border border-[#ECECEC] text-[#222222] rounded-[12px] hover:border-[#FF6B4A] transition"
          >
            <FileText size={14} /> PDF
          </button>
          <button
            onClick={() => {
              // Excel export action
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold bg-[#FF6B4A] text-white rounded-[12px] hover:bg-[#e5592e] transition"
          >
            <Download size={14} /> Excel
          </button>
        </div>

      </div>

      {/* Time Range Selector */}
      <div className="flex gap-1 bg-white border border-[#ECECEC] rounded-[16px] p-1 w-fit shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        {([["7d", "Last 7 Days"], ["30d", "Last 30 Days"], ["year", "This Year"]] as [TimeRange, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTimeRange(key)}
            className={`px-4 py-2 rounded-[12px] text-sm font-semibold transition-all ${
              timeRange === key
                ? "bg-[#FF6B4A] text-white shadow-sm"
                : "text-[#8C8CA1] hover:text-[#222222]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Platform Revenue", value: kpi.revenue, growth: kpi.revenueGrowth, icon: TrendingUp, color: "#FF6B4A" },
          { label: "Total Orders", value: kpi.orders.toLocaleString(), growth: kpi.ordersGrowth, icon: ShoppingBag, color: "#63B46C" },
          { label: "Active Restaurants", value: kpi.restaurants.toLocaleString(), growth: 4.2, icon: Store, color: "#6366F1" },
          { label: "Total Customers", value: kpi.customers.toLocaleString(), growth: 22.8, icon: Users, color: "#F6B73C" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white border border-[#ECECEC] rounded-[20px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-[12px] flex items-center justify-center" style={{ backgroundColor: `${s.color}18` }}>
                  <Icon size={18} style={{ color: s.color }} />
                </div>
                <GrowthBadge value={s.growth} />
              </div>
              <p className="text-xl font-bold text-[#222222]">{s.value}</p>
              <p className="text-xs text-[#8C8CA1] mt-0.5">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Bar Chart */}
      <div className="bg-white border border-[#ECECEC] rounded-[20px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-[#222222]">Order Volume Trend</h2>
            <p className="text-xs text-[#8C8CA1]">Orders across the selected period</p>
          </div>
          <BarChart3 size={18} className="text-[#FF6B4A]" />
        </div>
        <BarChart data={bars} />
      </div>

      {/* Top Restaurants + Best Sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Restaurants */}
        <div className="bg-white border border-[#ECECEC] rounded-[20px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <h2 className="font-bold text-[#222222] mb-4">Top Performing Restaurants</h2>
          <div className="space-y-2">
            {TOP_RESTAURANTS.map((r) => (
              <div key={r.rank} className="flex items-center gap-3 py-2 border-b border-[#ECECEC] last:border-0">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  r.rank === 1 ? "bg-[#F6B73C] text-white" :
                  r.rank === 2 ? "bg-[#DEDEDE] text-[#666]" :
                  r.rank === 3 ? "bg-[#CD7F32]/20 text-[#CD7F32]" :
                  "bg-[#FAF9F5] text-[#8C8CA1]"
                }`}>
                  {r.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#222222] truncate">{r.name}</p>
                  <p className="text-xs text-[#8C8CA1]">{r.city}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-[#222222]">{r.revenue}</p>
                  <div className="flex items-center gap-1 justify-end">
                    {r.rating > 0 && <Star size={10} className="text-[#F6B73C] fill-[#F6B73C]" />}
                    <span className="text-xs text-[#8C8CA1]">{r.rating > 0 ? r.rating : "New"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Best Sellers */}
        <div className="bg-white border border-[#ECECEC] rounded-[20px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <h2 className="font-bold text-[#222222] mb-4">Best Selling Items</h2>
          <div className="space-y-2">
            {BEST_SELLERS.map((item) => (
              <div key={item.rank} className="flex items-center gap-3 py-2 border-b border-[#ECECEC] last:border-0">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  item.rank === 1 ? "bg-[#F6B73C] text-white" :
                  item.rank === 2 ? "bg-[#DEDEDE] text-[#666]" :
                  item.rank === 3 ? "bg-[#CD7F32]/20 text-[#CD7F32]" :
                  "bg-[#FAF9F5] text-[#8C8CA1]"
                }`}>
                  {item.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#222222] truncate">{item.item}</p>
                  <p className="text-xs text-[#8C8CA1]">{item.restaurant}</p>
                </div>
                <div className="shrink-0">
                  <p className="text-sm font-bold text-[#FF6B4A]">{item.orders.toLocaleString()}</p>
                  <p className="text-[10px] text-[#8C8CA1] text-right">orders</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Peak Hours Heatmap */}
      <div className="bg-white border border-[#ECECEC] rounded-[20px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={18} className="text-[#FF6B4A]" />
          <h2 className="font-bold text-[#222222]">Peak Hours Heatmap</h2>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {PEAK_HOURS.map((h) => (
            <div key={h.hour} className="flex flex-col items-center gap-1">
              <div
                className="w-9 h-9 rounded-[10px] transition-all cursor-default"
                title={`${h.hour}: ${Math.round(h.intensity * 100)}% activity`}
                style={{
                  backgroundColor: `rgba(255, 107, 74, ${0.1 + h.intensity * 0.9})`,
                  border: `1px solid rgba(255, 107, 74, ${0.15 + h.intensity * 0.3})`,
                }}
              />
              <span className="text-[9px] text-[#8C8CA1] font-medium">{h.hour}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-3">
          <span className="text-xs text-[#8C8CA1]">Low</span>
          <div className="flex gap-0.5">
            {[0.1, 0.3, 0.5, 0.7, 0.9].map((v) => (
              <div key={v} className="w-5 h-3 rounded-sm" style={{ backgroundColor: `rgba(255,107,74,${v})` }} />
            ))}
          </div>
          <span className="text-xs text-[#8C8CA1]">High</span>
        </div>
      </div>

      {/* User Growth Section */}
      <div className="bg-white border border-[#ECECEC] rounded-[20px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-[#222222]">User Growth by Cohort</h2>
          <GrowthBadge value={22.8} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "New This Week",  value: 284,    delta: "+18%" },
            { label: "New This Month", value: 1240,   delta: "+22%" },
            { label: "Returning",      value: "68%",  delta: "+3%" },
            { label: "Churned",        value: "4.2%", delta: "-1%" },
          ].map((s) => (
            <div key={s.label} className="bg-[#FAF9F5] border border-[#ECECEC] rounded-[16px] p-4 text-center">
              <p className="text-2xl font-bold text-[#222222]">{s.value}</p>
              <p className="text-[10px] text-[#8C8CA1] mt-0.5">{s.label}</p>
              <p className={`text-xs font-bold mt-1 ${s.delta.startsWith("+") ? "text-green-600" : "text-red-500"}`}>{s.delta}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
