"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChefHat, Lock, Mail, Building2, ArrowRight, ShieldCheck, KeyRound } from "lucide-react";
import { Button } from "@food-mania/ui";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function BusinessLoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"OWNER" | "STAFF">("OWNER");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      const json = await res.json();

      if (res.ok && json.data?.token) {
        localStorage.setItem("fm_biz_token", json.data.token);
        const resId = json.data.user?.restaurantId || json.data.restaurant?.id || json.data.restaurant?.slug;
        const resName = json.data.restaurant?.name || json.data.user?.name;

        if (resId) {
          localStorage.setItem("fm_restaurant_id", resId);
        }
        if (resName) {
          localStorage.setItem("fm_restaurant_name", resName);
        }
        localStorage.setItem("fm_biz_user", JSON.stringify(json.data.user));
        router.push(resId ? `/overview?restaurantId=${resId}` : "/overview");
      } else {
        setErrorMsg(json.message || "Invalid email or password");
      }
    } catch (err) {
      setErrorMsg("Network error connecting to authentication service");
    } finally {
      setLoading(false);
    }
  };

  const handlePreset = (type: "owner" | "staff") => {
    if (type === "owner") {
      setRole("OWNER");
      setEmail("rohit@urbancafe.com");
      setPassword("owner123");
    } else {
      setRole("STAFF");
      setEmail("staff@urbancafe.com");
      setPassword("staff123");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white border border-[#ECECEC] rounded-[28px] shadow-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-[20px] bg-gradient-to-tr from-[#FF6B4A] to-[#F6B73C] text-white flex items-center justify-center mx-auto shadow-md">
            <ChefHat size={28} />
          </div>
          <h1 className="font-display font-bold text-2xl text-[#222222]">
            Business Portal Login
          </h1>
          <p className="text-xs text-[#8C8CA1]">
            Restaurant Owner & Staff Operating System
          </p>
        </div>

        {/* Role Selector */}
        <div className="flex bg-[#FAF9F5] p-1 rounded-full border border-[#ECECEC] text-xs font-semibold">
          <button
            type="button"
            onClick={() => setRole("OWNER")}
            className={`flex-1 py-2 rounded-full transition-all ${
              role === "OWNER" ? "bg-white text-[#FF6B4A] shadow-sm font-bold" : "text-[#8C8CA1]"
            }`}
          >
            Restaurant Owner
          </button>
          <button
            type="button"
            onClick={() => setRole("STAFF")}
            className={`flex-1 py-2 rounded-full transition-all ${
              role === "STAFF" ? "bg-white text-[#FF6B4A] shadow-sm font-bold" : "text-[#8C8CA1]"
            }`}
          >
            Staff Login
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-[14px] text-red-600 text-xs font-medium text-center">
            {errorMsg}
          </div>
        )}

        {forgotSent && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-[14px] text-emerald-600 text-xs font-medium text-center">
            Password reset instructions sent to restaurant admin.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#8C8CA1] uppercase mb-1">Business Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8CA1]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter business email"
                autoComplete="username"
                className="w-full pl-9 pr-3 py-2.5 rounded-[14px] border border-[#ECECEC] bg-[#FAF9F5] text-xs font-medium text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/30 focus:border-[#FF6B4A]"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-[#8C8CA1] uppercase">Password</label>
              <button
                type="button"
                onClick={() => setForgotSent(true)}
                className="text-[11px] text-[#FF6B4A] hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8CA1]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
                className="w-full pl-9 pr-3 py-2.5 rounded-[14px] border border-[#ECECEC] bg-[#FAF9F5] text-xs font-medium text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/30 focus:border-[#FF6B4A]"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            className="min-h-[48px] bg-[#FF6B4A] hover:bg-[#FF5232]"
          >
            <span>{loading ? "Authenticating..." : `Sign In as ${role === "OWNER" ? "Owner" : "Staff"}`}</span>
            <ArrowRight size={18} />
          </Button>
        </form>

        <div className="pt-3 border-t border-[#ECECEC] text-center space-y-2">
          <p className="text-xs text-[#666666]">
            New Restaurant?{" "}
            <a
              href="/register"
              className="font-bold text-[#FF6B4A] hover:underline"
            >
              Create Restaurant Account / Sign Up
            </a>
          </p>
        </div>

        <div className="pt-2 text-center border-t border-[#ECECEC]">
          <p className="text-[11px] text-[#8C8CA1]">Quick Preset Demo Logins:</p>
          <div className="flex space-x-2 mt-2 justify-center">
            <button
              onClick={() => handlePreset("owner")}
              className="text-[11px] px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200 font-medium"
            >
              Owner: rohit@urbancafe.com
            </button>
            <button
              onClick={() => handlePreset("staff")}
              className="text-[11px] px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200 font-medium"
            >
              Staff: staff@urbancafe.com
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

