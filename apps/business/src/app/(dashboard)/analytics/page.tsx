"use client";

import React, { useState } from "react";
import { BarChart3, TrendingUp, Download, Calendar, DollarSign, Users, Award } from "lucide-react";
import { Card, Badge, Button } from "@food-mania/ui";

export default function BusinessAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d");

  const handleDownloadReport = () => {
    // Download report action
  };


  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-[24px] shadow-card border border-[#ECECEC]">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#222222] flex items-center gap-2">
            <BarChart3 className="text-[#FF6B4A]" />
            <span>Executive Business Analytics</span>
          </h1>
          <p className="text-xs text-[#666666] mt-0.5">
            Real-time revenue metrics, peak dining hours, table turnover rates, and sales trends.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-[#FAF9F5] border border-[#ECECEC] rounded-[16px] px-3 py-2 text-xs font-semibold text-[#222222]"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="year">This Year</option>
          </select>

          <Button variant="primary" size="md" onClick={handleDownloadReport} className="min-h-[40px]">
            <Download size={16} />
            <span>Export Report</span>
          </Button>
        </div>
      </div>

      {/* Analytics Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Gross Revenue", val: "₹1,84,520", trend: "+14.2% vs last week", color: "text-[#63B46C]" },
          { label: "Average Order Value (AOV)", val: "₹680", trend: "+4.8% vs last week", color: "text-[#FF6B4A]" },
          { label: "Table Turnover Rate", val: "3.4x / day", trend: "Optimal occupancy", color: "text-[#F6B73C]" },
          { label: "Net Profit Margin", val: "32.4%", trend: "Healthy ROI", color: "text-[#68B8F8]" },
        ].map((m) => (
          <div key={m.label} className="bg-white rounded-[24px] p-5 border border-[#ECECEC] shadow-card space-y-2">
            <p className="text-xs text-[#666666] font-semibold">{m.label}</p>
            <p className="font-display font-extrabold text-2xl text-[#222222]">{m.val}</p>
            <p className={`text-[11px] font-bold ${m.color}`}>{m.trend}</p>
          </div>
        ))}
      </div>

      {/* Sales Trend Bar Visualizer */}
      <Card padding="lg" className="bg-white rounded-[24px] border border-[#ECECEC] shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-base text-[#222222]">Weekly Revenue & Order Trends</h3>
          <Badge variant="success" size="sm">LIVE REVENUE DATA</Badge>
        </div>

        <div className="h-48 flex items-end justify-between gap-3 pt-6 px-4 border-b border-[#ECECEC] pb-4">
          {[
            { day: "Mon", height: "45%", val: "₹18.4k" },
            { day: "Tue", height: "60%", val: "₹24.2k" },
            { day: "Wed", height: "55%", val: "₹21.0k" },
            { day: "Thu", height: "75%", val: "₹31.5k" },
            { day: "Fri", height: "90%", val: "₹38.9k" },
            { day: "Sat", height: "100%", val: "₹42.8k" },
            { day: "Sun", height: "85%", val: "₹36.2k" },
          ].map((bar) => (
            <div key={bar.day} className="flex-1 flex flex-col items-center gap-2 group">
              <span className="text-[10px] text-[#666666] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                {bar.val}
              </span>
              <div
                style={{ height: bar.height }}
                className="w-full bg-gradient-to-t from-[#63B46C] to-[#7DD6C4] rounded-t-[12px] group-hover:from-[#FF6B4A] group-hover:to-[#FF8B73] transition-all shadow-sm"
              />
              <span className="text-xs text-[#222222] font-semibold">{bar.day}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
