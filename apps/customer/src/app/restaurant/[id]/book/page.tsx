"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Utensils,
  MapPin,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button, Card, Badge, Modal } from "@food-mania/ui";
import { motion } from "framer-motion";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const TIME_SLOTS = ["06:30 PM", "07:00 PM", "07:30 PM", "08:00 PM", "08:30 PM", "09:00 PM", "09:30 PM"];
const SEATING_PREFERENCES = ["Rooftop", "Window", "Indoor", "Outdoor", "Family", "AC"] as const;
const OCCASIONS = ["Casual Dining", "Birthday Party", "Anniversary", "Business Dinner", "Family Reunion"];

export default function BookTablePage({ params }: { params?: { id?: string } }) {
  const routeParams = useParams();
  const restaurantId = (params?.id || routeParams?.id || "") as string;

  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantAddress, setRestaurantAddress] = useState("");

  // Form State
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]!);
  const [selectedTime, setSelectedTime] = useState("07:30 PM");
  const [guestCount, setGuestCount] = useState(2);
  const [seatingPref, setSeatingPref] = useState<typeof SEATING_PREFERENCES[number]>("Rooftop");
  const [selectedOccasion, setSelectedOccasion] = useState("Casual Dining");
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [specialRequest, setSpecialRequest] = useState("");
  const [selectedTableNumber, setSelectedTableNumber] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // Read table query parameter if scanned from QR
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const tableFromUrl = urlParams.get("table") || urlParams.get("tableId") || urlParams.get("t");
      if (tableFromUrl) {
        setSelectedTableNumber(tableFromUrl);
      }
    } catch {}

    // Read restaurant info
    if (restaurantId) {
      fetch(`${API_BASE_URL}/restaurants/${restaurantId}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((json) => {
          const data = json?.data || json;
          if (data?.name) {
            setRestaurantName(data.name);
            if (data.address) setRestaurantAddress(data.address);
          }
        })
        .catch(() => {});
    }

    // Read user info if available
    try {
      const stored = localStorage.getItem("fm_user") || localStorage.getItem("food_mania_user_session");
      if (stored) {
        const u = JSON.parse(stored);
        if (u.name) setGuestName(u.name);
        if (u.phone) setGuestPhone(u.phone);
      }
    } catch {}
  }, [restaurantId]);

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`${API_BASE_URL}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId,
          guestName,
          guestPhone,
          guestCount,
          bookingDate: selectedDate,
          timeSlot: selectedTime,
          tableId: selectedTableNumber,
          specialRequests: specialRequest || undefined,
        }),
      });
      const json = await res.json();
      const bookingData = json.data || json;

      if (res.ok && bookingData) {
        setCreatedBooking({
          bookingCode: bookingData.bookingCode || "BK-84920",
          restaurantId,
          restaurantName,
          guestName,
          guestPhone,
          guestCount,
          bookingDate: selectedDate,
          timeSlot: selectedTime,
          tableNumber: selectedTableNumber,
          status: bookingData.status || "CONFIRMED",
        });
        setIsSuccessModalOpen(true);
      } else {
        setErrorMsg(json.message || "Failed to confirm table booking. Please try again.");
      }
    } catch (err) {
      setErrorMsg("Network error connecting to table booking service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6FA] pb-32">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 h-14 flex items-center justify-between shadow-sm">
        <Link
          href={`/restaurant/${restaurantId}`}
          className="w-9 h-9 rounded-full bg-[#F8F9FA] border border-gray-100 flex items-center justify-center text-[#1A1A2E] hover:bg-[#FFF3E8] hover:text-[#FF6B00] transition-colors"
          aria-label="Back"
        >
          <ArrowLeft size={18} />
        </Link>
        <div className="text-center">
          <h1 className="font-display font-bold text-base text-[#1A1A2E]">Book a Table</h1>
          <p className="text-[10px] text-[#8C8CA1] font-medium">{restaurantName}</p>
        </div>
        <div className="w-9 h-9 flex items-center justify-center text-[#FF6B00]">
          <Calendar size={20} />
        </div>
      </header>

      <main className="max-w-xl mx-auto p-4 space-y-4">
        {/* Restaurant Summary Header Card */}
        <Card padding="md" className="bg-white shadow-sm border border-gray-100 space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-base text-[#1A1A2E]">{restaurantName}</h2>
            <Badge variant="orange" size="sm">Instant Confirmation</Badge>
          </div>
          <p className="text-xs text-[#8C8CA1] flex items-center gap-1">
            <MapPin size={12} /> {restaurantAddress}
          </p>
        </Card>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-[14px] text-xs font-semibold text-red-600 flex items-center gap-2">
            <AlertCircle size={16} /> {errorMsg}
          </div>
        )}

        <form onSubmit={handleConfirmBooking} className="space-y-4">
          {/* Date & Time Selection */}
          <Card padding="md" className="bg-white shadow-sm border border-gray-100 space-y-3">
            <h3 className="font-display font-bold text-sm text-[#1A1A2E] flex items-center gap-2">
              <Calendar size={16} className="text-[#FF6B00]" />
              <span>Select Date & Time</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#8C8CA1] uppercase mb-1">Reservation Date</label>
                <input
                  type="date"
                  required
                  value={selectedDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-[#F8F9FA] border border-gray-200 rounded-[12px] px-3 py-2 text-xs text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#8C8CA1] uppercase mb-1">Time Slot</label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full bg-[#F8F9FA] border border-gray-200 rounded-[12px] px-3 py-2 text-xs text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30"
                >
                  {TIME_SLOTS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          {/* Guest Count & Preference */}
          <Card padding="md" className="bg-white shadow-sm border border-gray-100 space-y-3">
            <h3 className="font-display font-bold text-sm text-[#1A1A2E] flex items-center gap-2">
              <Users size={16} className="text-[#FF6B00]" />
              <span>Guests & Preferences</span>
            </h3>

            <div>
              <label className="block text-[11px] font-semibold text-[#8C8CA1] uppercase mb-2">Number of Guests</label>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {[1, 2, 4, 6, 8, 10, 12].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setGuestCount(num)}
                    className={`min-w-[44px] h-10 rounded-[10px] text-xs font-bold transition-all ${
                      guestCount === num
                        ? "bg-[#FF6B00] text-white shadow-sm"
                        : "bg-[#F8F9FA] border border-gray-200 text-[#4A4A68] hover:bg-gray-100"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-semibold text-[#8C8CA1] uppercase mb-1">Seating Area</label>
                <select
                  value={seatingPref}
                  onChange={(e) => setSeatingPref(e.target.value as any)}
                  className="w-full bg-[#F8F9FA] border border-gray-200 rounded-[12px] px-3 py-2 text-xs text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30"
                >
                  {SEATING_PREFERENCES.map((s) => (
                    <option key={s} value={s}>
                      {s} Seating
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#8C8CA1] uppercase mb-1">Dining Occasion</label>
                <select
                  value={selectedOccasion}
                  onChange={(e) => setSelectedOccasion(e.target.value)}
                  className="w-full bg-[#F8F9FA] border border-gray-200 rounded-[12px] px-3 py-2 text-xs text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30"
                >
                  {OCCASIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          {/* Guest Contact Details */}
          <Card padding="md" className="bg-white shadow-sm border border-gray-100 space-y-3">
            <h3 className="font-display font-bold text-sm text-[#1A1A2E]">Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#8C8CA1] uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full bg-[#F8F9FA] border border-gray-200 rounded-[12px] px-3 py-2 text-xs text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#8C8CA1] uppercase mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="w-full bg-[#F8F9FA] border border-gray-200 rounded-[12px] px-3 py-2 text-xs text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#8C8CA1] uppercase mb-1">Special Requests (Optional)</label>
              <input
                type="text"
                value={specialRequest}
                onChange={(e) => setSpecialRequest(e.target.value)}
                placeholder="e.g. Quiet table, high chair, birthday surprise..."
                className="w-full bg-[#F8F9FA] border border-gray-200 rounded-[12px] px-3 py-2 text-xs text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30"
              />
            </div>
          </Card>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={loading}
            className="shadow-[0_4px_16px_rgba(255,107,0,0.35)] min-h-[48px]"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 size={18} className="animate-spin" /> Reserving Table in DB...
              </span>
            ) : (
              <span>Confirm Table Reservation</span>
            )}
          </Button>
        </form>

        {/* Booking Confirmed Modal */}
        {isSuccessModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-[24px] p-6 max-w-sm w-full text-center space-y-4 shadow-2xl animate-scale-up">
              <div className="w-16 h-16 bg-[#ECFDF5] text-[#10B981] rounded-full flex items-center justify-center mx-auto text-3xl">
                <CheckCircle2 size={36} />
              </div>
              <div>
                <Badge variant="success" size="md" className="mb-1">
                  BOOKING {createdBooking?.bookingCode}
                </Badge>
                <h3 className="font-display font-bold text-xl text-[#1A1A2E]">Table Reserved!</h3>
                <p className="text-xs text-[#8C8CA1] mt-1">
                  Your table at <strong className="text-[#1A1A2E]">{restaurantName}</strong> has been confirmed.
                </p>
              </div>

              <div className="p-3 bg-[#F8F9FA] rounded-[14px] text-xs text-left space-y-1.5 border border-gray-100">
                <div className="flex justify-between">
                  <span className="text-[#8C8CA1]">Date & Time</span>
                  <span className="font-bold text-[#1A1A2E]">{createdBooking?.bookingDate} • {createdBooking?.timeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8C8CA1]">Party Size</span>
                  <span className="font-bold text-[#1A1A2E]">{createdBooking?.guestCount} Guests</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8C8CA1]">Guest</span>
                  <span className="font-bold text-[#1A1A2E]">{createdBooking?.guestName}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Link href="/bookings" className="w-full">
                  <Button variant="primary" size="md" fullWidth>
                    View My Bookings
                  </Button>
                </Link>
                <Button variant="outline" size="md" fullWidth onClick={() => setIsSuccessModalOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
