"use client";

import React, { useState, useEffect } from "react";
import { Store, Users, ShoppingBag, CreditCard, Loader2, AlertCircle, RefreshCw } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function getAdminToken(): string {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem("fm_admin_token") || "";
  } catch {
    return "";
  }
}

export default function AdminOverviewPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getAdminToken();
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE_URL}/admin/analytics`, { headers });
      const json = await res.json();
      if (res.ok && json.data) {
        setAnalytics(json.data);
      } else {
        setError(json.message || "Failed to load admin analytics");
      }
    } catch (err) {
      setError("Network error connecting to backend API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="py-12 text-center flex flex-col items-center justify-center space-y-2">
        <Loader2 className="animate-spin text-[#FF6B4A]" size={32} />
        <p className="text-xs text-[#8C8CA1]">Fetching PostgreSQL platform metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-[20px] text-center space-y-2 my-4">
        <AlertCircle className="mx-auto text-red-500" size={24} />
        <p className="text-xs text-red-600 font-medium">{error}</p>
        <button
          onClick={fetchAnalytics}
          className="px-3 py-1.5 bg-red-600 text-white rounded-full text-xs font-semibold inline-flex items-center gap-1"
        >
          <RefreshCw size={12} /> Retry
        </button>
      </div>
    );
  }

  const STATS = [
    { label: "Active Restaurants", value: analytics?.totalRestaurants || 0, change: "Live in DB", icon: Store },
    { label: "Registered Users", value: analytics?.totalUsers || 0, change: "Live in DB", icon: Users },
    { label: "Total Orders Placed", value: analytics?.totalOrders || 0, change: "Live in DB", icon: ShoppingBag },
    { label: "Gross Platform Revenue", value: `₹${(analytics?.totalGrossRevenue || 0).toLocaleString()}`, change: "5% platform fee", icon: CreditCard },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-[#1A1A2E]">Platform Overview</h1>
        <p className="text-sm text-[#8C8CA1]">PostgreSQL Single Source of Truth Metrics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat, idx) => {
          const IconComp = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-[14px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.07)] border border-gray-100 flex items-center justify-between"
            >
              <div>
                <p className="text-xs text-[#8C8CA1] font-semibold">{stat.label}</p>
                <h3 className="font-display font-bold text-2xl text-[#1A1A2E] mt-1">{stat.value}</h3>
                <span className="text-xs text-[#22C55E] font-semibold">{stat.change}</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#FFF3E8] flex items-center justify-center text-[#FF6B00]">
                <IconComp size={20} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-[14px] p-8 shadow-[0_2px_12px_rgba(0,0,0,0.07)] border border-gray-100 text-center space-y-2">
        <h3 className="font-display font-bold text-lg text-[#1A1A2E]">SaaS Control Plane Synchronized</h3>
        <p className="text-xs text-[#8C8CA1]">
          Connected to Express REST API engine running at {API_BASE_URL}.
        </p>
      </div>
    </div>
  );
}
