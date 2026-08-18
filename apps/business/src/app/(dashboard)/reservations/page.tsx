"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  BellRing,
  MapPin,
  Sparkles,
  UserCheck,
  Loader2,
} from "lucide-react";
import { Card, Badge, Button } from "@food-mania/ui";
import { eventBus, BookingPayload, BookingStatus } from "@food-mania/shared";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function BusinessReservationsPage() {
  const [bookings, setBookings] = useState<BookingPayload[]>([]);
  const [filterTab, setFilterTab] = useState<"today" | "upcoming" | "completed" | "cancelled">("today");
  const [loading, setLoading] = useState(true);
  const [lastEventToast, setLastEventToast] = useState<string | null>(null);

  const fetchBookings = () => {
    let rId = "";
    try {
      const stored = localStorage.getItem("fm_restaurant_id");
      if (stored) rId = stored;
    } catch {}

    fetch(`${API_BASE_URL}/bookings?restaurantId=${encodeURIComponent(rId)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        const dbBookings = json?.data || json;
        if (Array.isArray(dbBookings)) {
          const mapped: BookingPayload[] = dbBookings.map((b: any) => ({
            bookingId: b.bookingCode || b.id,
            restaurantId: b.restaurantId,
            restaurantName: b.restaurant?.name || (typeof window !== "undefined" ? localStorage.getItem("fm_restaurant_name") : "") || "My Restaurant",
            customerName: b.guestName,
            customerPhone: b.guestPhone,
            guestCount: b.guestCount,
            date: new Date(b.bookingDate).toISOString().split("T")[0]!,
            timeSlot: b.timeSlot,
            tableNumber: b.tableId ? `Table ${b.tableId}` : "Table 04",
            seatingPreference: "Rooftop",
            status: (b.status?.toLowerCase() || "confirmed") as BookingStatus,
            createdAt: b.createdAt,
            updatedAt: b.updatedAt,
            dbId: b.id,
          }));
          setBookings(mapped);
        }
      })
      .catch((err) => console.warn("Backend bookings fetch warning:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
    const interval = setInterval(fetchBookings, 3000);
    const unsubscribe = eventBus.subscribe("*", (msg) => {
      fetchBookings();
      if (msg.type?.startsWith("BOOKING_")) {
        setLastEventToast(`Live Booking Event: ${msg.type}`);
        setTimeout(() => setLastEventToast(null), 4000);
      }
    });

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  const handleStatusChange = async (booking: BookingPayload, newStatus: BookingStatus) => {
    const idToPatch = (booking as any).dbId || booking.bookingId;
    const token = typeof window !== "undefined" ? localStorage.getItem("fm_biz_token") || "" : "";

    try {
      await fetch(`${API_BASE_URL}/bookings/${idToPatch}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: newStatus.toUpperCase() }),
      });
      fetchBookings();
    } catch (e) {
      console.warn("Booking status update warning:", e);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filterTab === "today") return b.status === "pending" || b.status === "confirmed" || b.status === "arrived";
    if (filterTab === "completed") return b.status === "completed";
    if (filterTab === "cancelled") return b.status === "rejected" || b.status === "cancelled";
    return true;
  });

  return (
    <div className="space-y-5 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-[24px] shadow-card border border-[#ECECEC]">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#222222] flex items-center gap-2">
            <Calendar className="text-[#63B46C]" />
            <span>Table Reservations Console</span>
          </h1>
          <p className="text-xs text-[#666666] mt-0.5">
            Manage customer table reservations, guest counts, and seating assignments in PostgreSQL.
          </p>
        </div>

        {/* Live Notification Event Toast */}
        <AnimatePresence>
          {lastEventToast && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-center gap-2 px-3.5 py-2 bg-[#EFF7EE] border border-[#63B46C]/30 rounded-full text-xs font-bold text-[#63B46C] shadow-xs"
            >
              <BellRing size={16} />
              <span>{lastEventToast}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex bg-white p-1.5 rounded-[20px] border border-[#ECECEC] text-xs font-semibold max-w-lg shadow-card">
        {[
          { id: "today", label: `Active / Today (${bookings.filter((b) => b.status === "pending" || b.status === "confirmed" || b.status === "arrived").length})` },
          { id: "completed", label: `Completed (${bookings.filter((b) => b.status === "completed").length})` },
          { id: "cancelled", label: `Cancelled (${bookings.filter((b) => b.status === "rejected" || b.status === "cancelled").length})` },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setFilterTab(t.id as any)}
            className={`flex-1 py-2 rounded-[14px] transition-all ${
              filterTab === t.id ? "bg-[#63B46C] text-white font-bold shadow-sm" : "text-[#666666] hover:bg-gray-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Reservations List */}
      {loading ? (
        <div className="py-16 text-center space-y-2 bg-white rounded-[24px] border border-[#ECECEC]">
          <Loader2 className="animate-spin text-[#63B46C] mx-auto" size={32} />
          <p className="text-xs text-[#8C8CA1]">Loading live table bookings...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-[24px] border border-[#ECECEC] space-y-3">
          <Calendar size={40} className="text-[#8C8CA1] mx-auto opacity-50" />
          <h3 className="font-display font-bold text-base text-[#222222]">No Reservations Found</h3>
          <p className="text-xs text-[#8C8CA1]">There are no table reservations matching this filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBookings.map((booking) => {
            const statusBadgeVariant =
              booking.status === "confirmed" || booking.status === "arrived"
                ? "success"
                : booking.status === "completed"
                ? "info"
                : booking.status === "rejected" || booking.status === "cancelled"
                ? "danger"
                : "warning";

            return (
              <Card key={booking.bookingId} padding="md" className="bg-white border border-[#ECECEC] shadow-card space-y-3">
                <div className="flex items-start justify-between border-b border-[#ECECEC] pb-2.5">
                  <div>
                    <h3 className="font-display font-bold text-base text-[#222222]">{booking.customerName}</h3>
                    <p className="text-xs text-[#666666] mt-0.5">{booking.customerPhone}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={statusBadgeVariant as any} size="sm">
                      {booking.status.toUpperCase()}
                    </Badge>
                    <p className="text-[10px] text-[#999999] font-mono mt-1">Ref: {booking.bookingId}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs text-[#666666]">
                  <div className="flex items-center gap-1.5 bg-[#FAF9F5] p-2 rounded-[12px] border border-[#ECECEC]">
                    <Calendar size={14} className="text-[#63B46C]" />
                    <span>{booking.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#FAF9F5] p-2 rounded-[12px] border border-[#ECECEC]">
                    <Clock size={14} className="text-[#63B46C]" />
                    <span>{booking.timeSlot}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#FAF9F5] p-2 rounded-[12px] border border-[#ECECEC]">
                    <Users size={14} className="text-[#63B46C]" />
                    <span>{booking.guestCount} Guests</span>
                  </div>
                </div>

                {/* Status Transition Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-1">
                  {booking.status === "pending" || booking.status === "confirmed" ? (
                    <>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleStatusChange(booking, "completed")}
                        className="bg-[#63B46C] hover:bg-[#4B9A54]"
                      >
                        <CheckCircle2 size={14} />
                        <span>Complete Reservation</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(booking, "cancelled")}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <XCircle size={14} />
                        <span>Cancel</span>
                      </Button>
                    </>
                  ) : null}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
