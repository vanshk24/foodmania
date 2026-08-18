"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Clock, Users, MapPin, CheckCircle2, AlertCircle, Loader2, Plus } from "lucide-react";
import { BottomNav } from "@/components/layouts/BottomNav";
import { Button, Card, Badge } from "@food-mania/ui";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export interface BookingRecord {
  id: string;
  bookingCode: string;
  restaurantId: string;
  restaurantName?: string;
  guestName: string;
  guestPhone: string;
  guestCount: number;
  bookingDate: string;
  timeSlot: string;
  status: string;
  tableId?: string;
  specialRequests?: string;
}

export default function BookingsPage() {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/bookings`);
      const json = await res.json();
      if (res.ok && Array.isArray(json.data)) {
        setBookings(json.data);
      } else {
        setError(json.message || "Failed to load bookings");
      }
    } catch (err) {
      setError("Network error connecting to booking service.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const upcomingBookings = bookings.filter(
    (b) => b.status === "CONFIRMED" || b.status === "PENDING"
  );
  const pastBookings = bookings.filter(
    (b) => b.status === "COMPLETED" || b.status === "CANCELLED"
  );

  const displayedList = tab === "upcoming" ? upcomingBookings : pastBookings;

  return (
    <div className="min-h-screen bg-[#F5F6FA] pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white px-4 pt-4 pb-2 border-b border-gray-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="font-display font-bold text-xl text-[#1A1A2E]">My Table Bookings</h1>
          <Link href="/scan">
            <Button variant="primary" size="sm" className="text-xs">
              <Plus size={14} /> Book Table
            </Button>
          </Link>
        </div>

        <div className="flex bg-[#F0F0F0] p-1 rounded-full text-xs font-semibold">
          <button
            onClick={() => setTab("upcoming")}
            className={`flex-1 py-1.5 rounded-full transition-colors ${
              tab === "upcoming" ? "bg-[#FF6B00] text-white shadow-sm" : "text-[#4A4A68]"
            }`}
          >
            Upcoming ({upcomingBookings.length})
          </button>
          <button
            onClick={() => setTab("past")}
            className={`flex-1 py-1.5 rounded-full transition-colors ${
              tab === "past" ? "bg-[#FF6B00] text-white shadow-sm" : "text-[#4A4A68]"
            }`}
          >
            Past ({pastBookings.length})
          </button>
        </div>
      </header>

      <main className="p-4 space-y-3">
        {loading ? (
          <div className="py-16 text-center space-y-2">
            <Loader2 className="animate-spin text-[#FF6B00] mx-auto" size={28} />
            <p className="text-xs text-[#8C8CA1]">Loading live table bookings...</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-[14px] text-center space-y-2">
            <AlertCircle className="mx-auto text-red-500" size={24} />
            <p className="text-xs text-red-600 font-medium">{error}</p>
            <Button variant="outline" size="sm" onClick={fetchBookings}>
              Retry
            </Button>
          </div>
        ) : displayedList.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-[16px] border border-gray-100 p-6 space-y-3">
            <Calendar size={40} className="text-[#8C8CA1] mx-auto opacity-50" />
            <h3 className="font-display font-bold text-base text-[#1A1A2E]">
              No {tab === "upcoming" ? "Upcoming" : "Past"} Bookings
            </h3>
            <p className="text-xs text-[#8C8CA1] max-w-xs mx-auto">
              Reserve your favorite table instantly with contactless QR ordering at top dining spots!
            </p>
            <Link href="/scan">
              <Button variant="primary" size="md" className="mt-2">
                Reserve a Table
              </Button>
            </Link>
          </div>
        ) : (
          displayedList.map((b) => {
            const statusBg =
              b.status === "CONFIRMED"
                ? "bg-[#DCFCE7] text-[#15803D]"
                : b.status === "COMPLETED"
                ? "bg-[#EFF6FF] text-[#2563EB]"
                : b.status === "CANCELLED"
                ? "bg-[#FEE2E2] text-[#EF4444]"
                : "bg-[#FEF3C7] text-[#D97706]";

            return (
              <div
                key={b.id}
                className="bg-white rounded-[16px] p-4 shadow-sm border border-gray-100 space-y-3 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                  <div>
                    <h3 className="font-display font-bold text-base text-[#1A1A2E]">
                      {b.restaurantName || (b.restaurantId ? `Restaurant (${b.restaurantId})` : "Dining Restaurant")}
                    </h3>
                    <p className="text-xs text-[#8C8CA1] flex items-center gap-1 mt-0.5">
                      <MapPin size={12} /> Booking Ref: <strong className="text-[#1A1A2E] font-mono">{b.bookingCode}</strong>
                    </p>
                  </div>
                  <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${statusBg}`}>
                    <CheckCircle2 size={12} /> {b.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-[#4A4A68]">
                  <div className="flex items-center gap-1.5 bg-[#F8F9FA] p-2 rounded-lg">
                    <Calendar size={14} className="text-[#FF6B00]" />
                    <span>{b.bookingDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#F8F9FA] p-2 rounded-lg">
                    <Clock size={14} className="text-[#FF6B00]" />
                    <span>{b.timeSlot}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#F8F9FA] p-2 rounded-lg">
                    <Users size={14} className="text-[#FF6B00]" />
                    <span>{b.guestCount} People</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#F8F9FA] p-2 rounded-lg font-semibold text-[#FF6B00]">
                    <span>{b.tableId || "Table Reserved"}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </main>

      <BottomNav />
    </div>
  );
}
