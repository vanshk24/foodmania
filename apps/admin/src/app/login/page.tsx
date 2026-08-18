"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Mail, ArrowRight, KeyRound, Sparkles } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [rememberDevice, setRememberDevice] = useState(true);
  const [step, setStep] = useState<"credentials" | "2fa">("credentials");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (res.ok && json.data?.token) {
        localStorage.setItem("fm_admin_token", json.data.token);
      }
    } catch (err) {
      console.warn("Admin login API warning:", err);
    }
    setLoading(false);
    setStep("2fa");
  };

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, twoFactorCode: otp, role: "SUPER_ADMIN" }),
      });
      const json = await res.json();
      if (res.ok && json.data?.token) {
        localStorage.setItem("fm_admin_token", json.data.token);
        if (rememberDevice) {
          localStorage.setItem("fm_admin_remember", "true");
        }
        router.push("/overview");
      } else {
        setErrorMsg(json.message || "Invalid credentials or 2FA code");
      }
    } catch (err) {
      setErrorMsg("Network error connecting to authentication server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white border border-[#ECECEC] rounded-[28px] shadow-2xl p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-[20px] bg-gradient-to-tr from-[#FF6B4A] to-[#F6B73C] text-white flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck size={28} />
          </div>
          <h1 className="font-display font-bold text-2xl text-[#222222]">
            Food Mania Super Admin
          </h1>
          <p className="text-xs text-[#8C8CA1]">
            Global SaaS Control Plane & Security Console
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-[14px] text-red-600 text-xs font-medium text-center">
            {errorMsg}
          </div>
        )}

        {step === "credentials" ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#8C8CA1] uppercase mb-1">
                Super Admin Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8CA1]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter super admin email"
                  autoComplete="username"
                  className="w-full pl-9 pr-3 py-2.5 rounded-[14px] border border-[#ECECEC] bg-[#FAF9F5] text-xs font-medium text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/30 focus:border-[#FF6B4A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#8C8CA1] uppercase mb-1">
                Password
              </label>
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

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="rememberDevice"
                checked={rememberDevice}
                onChange={(e) => setRememberDevice(e.target.checked)}
                className="rounded border-gray-300 text-[#FF6B4A] focus:ring-[#FF6B4A]"
              />
              <label htmlFor="rememberDevice" className="text-xs font-medium text-gray-600">
                Remember this admin device for 30 days
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#FF6B4A] hover:bg-[#FF5232] text-white font-semibold text-xs rounded-[16px] shadow-sm transition-all flex items-center justify-center gap-2"
            >
              {loading ? "Authenticating..." : "Continue to 2FA Step"}
              <ArrowRight size={16} />
            </button>
          </form>
        ) : (
          <form onSubmit={handle2FASubmit} className="space-y-4 animate-in fade-in duration-200">
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-[14px] text-center">
              <KeyRound size={20} className="mx-auto text-[#FF6B4A] mb-1" />
              <p className="text-xs font-bold text-[#FF6B4A]">Two-Factor Authentication Required</p>
              <p className="text-[11px] text-[#666] mt-0.5">Enter 6-digit TOTP code</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#8C8CA1] uppercase text-center mb-1">
                Authentication Code
              </label>
              <input
                type="text"
                maxLength={6}
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="------"
                autoComplete="one-time-code"
                className="w-full text-center tracking-[0.5em] text-lg font-mono font-bold py-2.5 rounded-[14px] border border-[#ECECEC] bg-[#FAF9F5] text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/30"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#63B46C] hover:bg-[#4B9A54] text-white font-semibold text-xs rounded-[16px] shadow-sm transition-all flex items-center justify-center gap-2"
            >
              {loading ? "Verifying Token..." : "Verify 2FA & Enter Platform Console"}
              <ShieldCheck size={16} />
            </button>
          </form>
        )}

        <div className="pt-2 text-center border-t border-[#ECECEC]">
          <p className="text-[11px] text-[#8C8CA1] flex items-center justify-center gap-1">
            <Sparkles size={12} className="text-[#FF6B4A]" />
            Food Mania PostgreSQL Single Source of Truth
          </p>
        </div>
      </div>
    </div>
  );
}

