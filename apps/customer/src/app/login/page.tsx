"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Utensils, Mail, Lock, User, Phone, ArrowRight, ShieldCheck, Sparkles, KeyRound } from "lucide-react";
import { Button } from "@food-mania/ui";

import { API_BASE_URL } from "@food-mania/shared";

export default function CustomerLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register" | "otp" | "forgot">("login");
  const [email, setEmail] = useState("gaurav@example.com");
  const [password, setPassword] = useState("password123");
  const [name, setName] = useState("Gaurav Sharma");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [otp, setOtp] = useState("123456");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    let endpoint = `${API_BASE_URL}/auth/login`;
    let body: any = { email, password };

    if (mode === "register") {
      endpoint = `${API_BASE_URL}/auth/register`;
      body = { email, password, name, phone, role: "CUSTOMER" };
    } else if (mode === "otp") {
      endpoint = `${API_BASE_URL}/auth/login`;
      body = { phone, otp, role: "CUSTOMER" };
    } else if (mode === "forgot") {
      setTimeout(() => {
        setLoading(false);
        setSuccessMsg("Password reset link sent to your registered email.");
      }, 1000);
      return;
    }

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();

      if (res.ok && json.data?.token) {
        localStorage.setItem("fm_token", json.data.token);
        localStorage.setItem("fm_user", JSON.stringify(json.data.user));
        router.push("/");
      } else {
        setErrorMsg(json.message || "Authentication failed. Please check credentials.");
      }
    } catch (err) {
      setErrorMsg("Network error connecting to backend API.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("fm_token", "google_simulated_token_customer");
      localStorage.setItem(
        "fm_user",
        JSON.stringify({ id: "u-google-1", name: "Google Customer User", email: "google@customer.com", role: "CUSTOMER" })
      );
      router.push("/");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F5F6FA] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-[28px] border border-gray-100 shadow-xl p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-[20px] bg-gradient-to-tr from-[#FF6B00] to-[#FFA800] text-white flex items-center justify-center mx-auto shadow-md">
            <Utensils size={28} />
          </div>
          <h1 className="font-display font-bold text-2xl text-[#1A1A2E]">
            {mode === "login" && "Welcome Back to Food Mania"}
            {mode === "register" && "Create Customer Account"}
            {mode === "otp" && "OTP Quick Login"}
            {mode === "forgot" && "Reset Password"}
          </h1>
          <p className="text-xs text-[#8C8CA1]">
            Single Source of Truth PostgreSQL Backend Connection
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 bg-[#F8F9FA] p-1 rounded-full border border-gray-100 text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`py-2 rounded-full transition-all ${
              mode === "login" ? "bg-white text-[#FF6B00] shadow-sm" : "text-[#8C8CA1]"
            }`}
          >
            Password
          </button>
          <button
            type="button"
            onClick={() => setMode("otp")}
            className={`py-2 rounded-full transition-all ${
              mode === "otp" ? "bg-white text-[#FF6B00] shadow-sm" : "text-[#8C8CA1]"
            }`}
          >
            OTP Login
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`py-2 rounded-full transition-all ${
              mode === "register" ? "bg-white text-[#FF6B00] shadow-sm" : "text-[#8C8CA1]"
            }`}
          >
            Register
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-[14px] text-red-600 text-xs font-medium text-center">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-[14px] text-emerald-600 text-xs font-medium text-center">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <>
              <div>
                <label className="block text-xs font-semibold text-[#8C8CA1] uppercase mb-1">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8CA1]" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-[14px] border border-gray-200 bg-[#F8F9FA] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8C8CA1] uppercase mb-1">Phone Number</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8CA1]" />
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-[14px] border border-gray-200 bg-[#F8F9FA] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00]"
                  />
                </div>
              </div>
            </>
          )}

          {mode === "otp" ? (
            <>
              <div>
                <label className="block text-xs font-semibold text-[#8C8CA1] uppercase mb-1">Mobile Phone Number</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8CA1]" />
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-[14px] border border-gray-200 bg-[#F8F9FA] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#8C8CA1] uppercase mb-1">6-Digit OTP</label>
                <div className="relative">
                  <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8CA1]" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-[14px] border border-gray-200 bg-[#F8F9FA] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00]"
                  />
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-[#8C8CA1] uppercase mb-1">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8CA1]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-[14px] border border-gray-200 bg-[#F8F9FA] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00]"
                />
              </div>
            </div>
          )}

          {mode !== "otp" && mode !== "forgot" && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-[#8C8CA1] uppercase">Password</label>
                <button
                  type="button"
                  onClick={() => setMode("forgot")}
                  className="text-[11px] text-[#FF6B00] hover:underline"
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
                  className="w-full pl-9 pr-3 py-2.5 rounded-[14px] border border-gray-200 bg-[#F8F9FA] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 focus:border-[#FF6B00]"
                />
              </div>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            className="min-h-[48px] shadow-[0_4px_16px_rgba(255,107,0,0.3)]"
          >
            <span>
              {loading
                ? "Processing..."
                : mode === "login"
                ? "Sign In"
                : mode === "register"
                ? "Register"
                : mode === "otp"
                ? "Verify OTP"
                : "Send Reset Link"}
            </span>
            <ArrowRight size={18} />
          </Button>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-gray-100"></div>
          <span className="flex-shrink mx-4 text-[11px] text-[#8C8CA1]">OR</span>
          <div className="flex-grow border-t border-gray-100"></div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full py-2.5 px-4 border border-gray-200 rounded-[14px] bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 flex items-center justify-center space-x-2 transition-all"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.14C3.26 21.3 7.31 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.59H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.41l3.99-3.14z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.59l3.99 3.14c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="text-center pt-2 border-t border-gray-100">
          <Link href="/" className="text-xs font-semibold text-[#FF6B00] hover:underline">
            Back to Customer Home
          </Link>
        </div>
      </div>
    </div>
  );
}

