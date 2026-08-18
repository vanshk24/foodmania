"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  MapPin,
  CreditCard,
  Bell,
  Star,
  HelpCircle,
  LogOut,
  ChevronRight,
  ShoppingBag,
  Calendar,
  ShieldCheck,
  Check,
  Edit2,
} from "lucide-react";
import { BottomNav } from "@/components/layouts/BottomNav";
import { Avatar, Button, Card, Badge } from "@food-mania/ui";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; name: string; email: string; phone?: string; role: string }>({
    id: "u-customer-1",
    name: "Gaurav Sharma",
    email: "gaurav@example.com",
    phone: "+91 98765 43210",
    role: "CUSTOMER",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("Gaurav Sharma");
  const [editPhone, setEditPhone] = useState("+91 98765 43210");
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("fm_user") || localStorage.getItem("food_mania_user_session");
      if (stored) {
        const u = JSON.parse(stored);
        if (u.name || u.email) {
          setUser((prev) => {
            setEditName(u.name || prev.name);
            setEditPhone(u.phone || prev.phone);
            return { ...prev, ...u };
          });
        }
      }
    } catch {}
  }, []);

  const handleSaveProfile = () => {
    const updated = { ...user, name: editName, phone: editPhone };
    setUser(updated);
    try {
      localStorage.setItem("fm_user", JSON.stringify(updated));
    } catch {}
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("fm_token");
      localStorage.removeItem("fm_user");
      localStorage.removeItem("food_mania_user_session");
    } catch {}
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#F5F6FA] pb-24">
      <header className="sticky top-0 z-30 bg-white px-4 py-3 border-b border-gray-100 shadow-sm text-center">
        <h1 className="font-display font-bold text-lg text-[#1A1A2E]">My Account & Profile</h1>
      </header>

      <main className="max-w-xl mx-auto p-4 space-y-4">
        {/* User Profile Card */}
        <div className="bg-white rounded-[20px] p-5 shadow-sm border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <Avatar name={user.name} size="xl" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-base text-[#1A1A2E]">{user.name}</h2>
                <Badge variant="orange" size="sm">
                  {user.role}
                </Badge>
              </div>
              <p className="text-xs text-[#8C8CA1] mt-0.5">{user.email}</p>
              <p className="text-xs text-[#8C8CA1]">{user.phone || "+91 98765 43210"}</p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2.5 rounded-full bg-[#F8F9FA] hover:bg-[#FFF3E8] hover:text-[#FF6B00] text-[#4A4A68] transition-colors"
            aria-label="Edit Profile"
          >
            <Edit2 size={16} />
          </button>
        </div>

        {/* Edit Profile Drawer / Section */}
        {isEditing && (
          <Card padding="md" className="space-y-3 bg-white border border-[#FF6B00]/30 animate-slide-up">
            <h3 className="font-display font-bold text-sm text-[#1A1A2E]">Edit Profile Information</h3>
            <div className="space-y-2">
              <div>
                <label className="block text-[11px] font-semibold text-[#8C8CA1] uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#F8F9FA] border border-gray-200 rounded-[10px] px-3 py-2 text-xs text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#8C8CA1] uppercase mb-1">Phone Number</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full bg-[#F8F9FA] border border-gray-200 rounded-[10px] px-3 py-2 text-xs text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={handleSaveProfile}>
                  Save Changes
                </Button>
              </div>
            </div>
          </Card>
        )}

        {saveSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-[12px] text-xs font-semibold text-emerald-700 flex items-center gap-2">
            <Check size={16} /> Profile updated successfully!
          </div>
        )}

        {/* Quick Activity Shortcuts */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/orders"
            className="p-4 bg-white rounded-[16px] border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-[#FFF3E8] flex items-center justify-center text-[#FF6B00]">
              <ShoppingBag size={20} />
            </div>
            <div>
              <h4 className="font-display font-bold text-xs text-[#1A1A2E]">My Orders</h4>
              <p className="text-[10px] text-[#8C8CA1]">Track & review</p>
            </div>
          </Link>

          <Link
            href="/bookings"
            className="p-4 bg-white rounded-[16px] border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-[#ECFDF5] flex items-center justify-center text-[#10B981]">
              <Calendar size={20} />
            </div>
            <div>
              <h4 className="font-display font-bold text-xs text-[#1A1A2E]">Table Bookings</h4>
              <p className="text-[10px] text-[#8C8CA1]">View reservations</p>
            </div>
          </Link>
        </div>

        {/* Navigation List */}
        <div className="bg-white rounded-[16px] shadow-sm border border-gray-100 divide-y divide-gray-100 overflow-hidden text-xs text-[#1A1A2E]">
          <Link href="/orders" className="w-full flex items-center justify-between p-3.5 hover:bg-[#FFF3E8]/30 transition-colors">
            <div className="flex items-center gap-3">
              <ShoppingBag size={16} className="text-[#8C8CA1]" />
              <span className="font-medium">Order History & Invoices</span>
            </div>
            <ChevronRight size={16} className="text-[#8C8CA1]" />
          </Link>

          <Link href="/bookings" className="w-full flex items-center justify-between p-3.5 hover:bg-[#FFF3E8]/30 transition-colors">
            <div className="flex items-center gap-3">
              <Calendar size={16} className="text-[#8C8CA1]" />
              <span className="font-medium">Table Reservations</span>
            </div>
            <ChevronRight size={16} className="text-[#8C8CA1]" />
          </Link>

          <Link href="/scan" className="w-full flex items-center justify-between p-3.5 hover:bg-[#FFF3E8]/30 transition-colors">
            <div className="flex items-center gap-3">
              <ShieldCheck size={16} className="text-[#8C8CA1]" />
              <span className="font-medium">Smart QR Scanner</span>
            </div>
            <ChevronRight size={16} className="text-[#8C8CA1]" />
          </Link>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-3 bg-white rounded-[16px] border border-red-100 text-[#EF4444] font-semibold text-xs shadow-sm hover:bg-red-50 transition-colors"
        >
          <LogOut size={16} /> Logout Customer Session
        </button>
      </main>

      <BottomNav />
    </div>
  );
}
