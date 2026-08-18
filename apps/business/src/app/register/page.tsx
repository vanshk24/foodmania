"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChefHat, Building2, User, Mail, Phone, Lock, MapPin, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@food-mania/ui";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function BusinessRegisterPage() {
  const router = useRouter();

  const [restaurantName, setRestaurantName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Mumbai");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    code: string;
    slug: string;
    token: string;
    restaurantId: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Client-side validations
    if (!restaurantName.trim()) {
      setErrorMsg("Please enter your restaurant name");
      return;
    }
    if (!ownerName.trim()) {
      setErrorMsg("Please enter the owner full name");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Please enter a valid business email address");
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/register-restaurant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantName: restaurantName.trim(),
          ownerName: ownerName.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          city: city.trim(),
          address: address.trim() || undefined,
          password,
        }),
      });

      const json = await res.json();

      if (res.ok && json.data) {
        const { user, restaurant, token } = json.data;
        setSuccessData({
          code: restaurant.code,
          slug: restaurant.slug,
          token,
          restaurantId: restaurant.id,
        });

        // Store tokens for immediate access
        localStorage.setItem("fm_biz_token", token);
        localStorage.setItem("fm_restaurant_id", restaurant.id);
        localStorage.setItem("fm_biz_user", JSON.stringify(user));
      } else {
        setErrorMsg(json.message || "Failed to register restaurant account");
      }
    } catch (err) {
      setErrorMsg("Network error connecting to registration service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] flex flex-col justify-center items-center p-4 py-8">
      <div className="w-full max-w-xl bg-white border border-[#ECECEC] rounded-[28px] shadow-2xl p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-[20px] bg-gradient-to-tr from-[#FF6B4A] to-[#F6B73C] text-white flex items-center justify-center mx-auto shadow-md">
            <ChefHat size={28} />
          </div>
          <h1 className="font-display font-bold text-2xl text-[#222222]">
            Create Restaurant Account
          </h1>
          <p className="text-xs text-[#8C8CA1]">
            Register your venue on Food Mania operating system
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-[14px] text-red-600 text-xs font-medium flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successData ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-[20px] text-center space-y-4">
            <CheckCircle2 size={48} className="text-emerald-500 mx-auto" />
            <div className="space-y-1">
              <h3 className="font-display font-bold text-lg text-emerald-900">
                Restaurant Registered Successfully!
              </h3>
              <p className="text-xs text-emerald-700">
                Your restaurant is active and ready for digital orders.
              </p>
            </div>

            <div className="bg-white p-4 rounded-[14px] border border-emerald-200 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#666666]">Assigned Passcode:</span>
                <span className="font-mono font-bold text-[#FF6B4A] bg-[#FFF1EE] px-2 py-0.5 rounded">
                  {successData.code}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666666]">Restaurant URL Slug:</span>
                <span className="font-mono font-semibold text-[#222222]">{successData.slug}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={() => router.push(`/overview?restaurantId=${successData.restaurantId}`)}
                className="bg-[#63B46C] hover:bg-[#52a15b]"
              >
                Go to Business Dashboard
              </Button>
              <Button
                variant="outline"
                size="md"
                fullWidth
                onClick={() => router.push("/login")}
              >
                Go to Login Page
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#8C8CA1] uppercase mb-1">
                  Restaurant Name *
                </label>
                <div className="relative">
                  <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8CA1]" />
                  <input
                    type="text"
                    required
                    value={restaurantName}
                    onChange={(e) => setRestaurantName(e.target.value)}
                    placeholder="e.g. Royal Spice Bistro"
                    className="w-full pl-9 pr-3 py-2.5 rounded-[14px] border border-[#ECECEC] bg-[#FAF9F5] font-medium text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/30 focus:border-[#FF6B4A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8C8CA1] uppercase mb-1">
                  Owner Full Name *
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8CA1]" />
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="e.g. Vikram Sharma"
                    className="w-full pl-9 pr-3 py-2.5 rounded-[14px] border border-[#ECECEC] bg-[#FAF9F5] font-medium text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/30 focus:border-[#FF6B4A]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#8C8CA1] uppercase mb-1">
                  Business Email *
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8CA1]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="owner@restaurant.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-[14px] border border-[#ECECEC] bg-[#FAF9F5] font-medium text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/30 focus:border-[#FF6B4A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8C8CA1] uppercase mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8CA1]" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3 py-2.5 rounded-[14px] border border-[#ECECEC] bg-[#FAF9F5] font-medium text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/30 focus:border-[#FF6B4A]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#8C8CA1] uppercase mb-1">
                  City
                </label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8CA1]" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Mumbai, Delhi, Bengaluru"
                    className="w-full pl-9 pr-3 py-2.5 rounded-[14px] border border-[#ECECEC] bg-[#FAF9F5] font-medium text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/30 focus:border-[#FF6B4A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8C8CA1] uppercase mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 42 Bandra West"
                  className="w-full px-3 py-2.5 rounded-[14px] border border-[#ECECEC] bg-[#FAF9F5] font-medium text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/30 focus:border-[#FF6B4A]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#8C8CA1] uppercase mb-1">
                  Account Password *
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8CA1]" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full pl-9 pr-3 py-2.5 rounded-[14px] border border-[#ECECEC] bg-[#FAF9F5] font-medium text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/30 focus:border-[#FF6B4A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8C8CA1] uppercase mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8CA1]" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full pl-9 pr-3 py-2.5 rounded-[14px] border border-[#ECECEC] bg-[#FAF9F5] font-medium text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/30 focus:border-[#FF6B4A]"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={loading}
              className="min-h-[48px] bg-[#FF6B4A] hover:bg-[#FF5232] mt-4"
            >
              <span>{loading ? "Registering Restaurant..." : "Register Restaurant & Start"}</span>
              <ArrowRight size={18} />
            </Button>
          </form>
        )}

        <div className="pt-2 text-center border-t border-[#ECECEC]">
          <p className="text-xs text-[#666666]">
            Already have a restaurant account?{" "}
            <a href="/login" className="font-bold text-[#FF6B4A] hover:underline">
              Sign In to Business Portal
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
