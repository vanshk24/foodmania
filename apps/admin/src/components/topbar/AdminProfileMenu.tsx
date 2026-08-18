"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User, Settings, Shield, Activity, Sun, Moon, Laptop,
  HelpCircle, LogOut, X, Check, Save, Key, Smartphone,
  Clock, Download, Sparkles, ChevronRight, AlertTriangle, Command
} from "lucide-react";

import { Avatar } from "@food-mania/ui";

export function AdminProfileMenu() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<
    "profile" | "security" | "activity" | "help" | "shortcuts" | "logout" | null
  >(null);

  // Profile Form State
  const [profile, setProfile] = useState({
    name: "Antigravity SuperAdmin",
    email: "superadmin@foodmania.com",
    phone: "+91 99000 11223",
    role: "Global Platform Administrator",
    timezone: "Asia/Kolkata (GMT+5:30)",
    language: "English (US)",
    twoFactorEnabled: true,
    photoUrl: "",
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Theme State
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");

  useEffect(() => {
    const savedTheme = (localStorage.getItem("fm_admin_theme") as "light" | "dark" | "system") || "light";
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (t: "light" | "dark" | "system") => {
    localStorage.setItem("fm_admin_theme", t);
    if (t === "dark" || (t === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleLogout = () => {
    setIsMenuOpen(false);
    setActiveModal(null);
    router.push("/login");
  };

  return (
    <>
      {/* Avatar Trigger Button */}
      <div className="relative">
        <button
          id="admin-avatar-trigger"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center gap-2.5 p-1.5 rounded-full hover:bg-[#FAF9F5] border border-transparent hover:border-[#ECECEC] transition-all focus:outline-none"
          aria-label="Open Super Admin menu"
        >
          <Avatar
            src={profile.photoUrl || undefined}
            name={profile.name}
            size="sm"
            className="shadow-sm"
          />
          <div className="hidden lg:block text-left pr-1">
            <p className="text-xs font-bold text-[#222222] leading-none">Super Admin</p>
            <p className="text-[10px] text-[#8C8CA1] mt-0.5">Platform Owner</p>
          </div>
        </button>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsMenuOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-64 bg-white border border-[#ECECEC] rounded-[22px] shadow-2xl z-50 p-2 animate-in fade-in zoom-in-95 duration-150">
              {/* Profile Card Header */}
              <div className="p-3 bg-[#FAF9F5] rounded-[16px] border border-[#ECECEC] mb-1">
                <div className="flex items-center gap-2.5">
                  <Avatar
                    src={profile.photoUrl || undefined}
                    name={profile.name}
                    size="sm"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#222222] truncate">{profile.name}</p>
                    <p className="text-[10px] text-[#8C8CA1] truncate">{profile.email}</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="space-y-0.5 text-xs text-[#222222]">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setActiveModal("profile");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[12px] hover:bg-[#FAF9F5] hover:text-[#FF6B4A] transition-all font-medium"
                >
                  <User size={15} className="text-[#8C8CA1]" />
                  Profile & Account
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setActiveModal("security");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[12px] hover:bg-[#FAF9F5] hover:text-[#FF6B4A] transition-all font-medium"
                >
                  <Shield size={15} className="text-[#8C8CA1]" />
                  Security & 2FA
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setActiveModal("activity");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[12px] hover:bg-[#FAF9F5] hover:text-[#FF6B4A] transition-all font-medium"
                >
                  <Activity size={15} className="text-[#8C8CA1]" />
                  System Activity Log
                </button>

                {/* Theme Selector Pill in Dropdown */}
                <div className="px-3 py-2 flex items-center justify-between border-t border-b border-[#ECECEC] my-1">
                  <span className="text-[11px] font-semibold text-[#8C8CA1]">Theme</span>
                  <div className="flex bg-[#FAF9F5] p-0.5 rounded-full border border-[#ECECEC]">
                    <button
                      onClick={() => handleThemeChange("light")}
                      className={`p-1 rounded-full text-xs transition-all ${
                        theme === "light" ? "bg-white text-[#FF6B4A] shadow-xs" : "text-[#8C8CA1]"
                      }`}
                      title="Light Mode"
                    >
                      <Sun size={13} />
                    </button>
                    <button
                      onClick={() => handleThemeChange("dark")}
                      className={`p-1 rounded-full text-xs transition-all ${
                        theme === "dark" ? "bg-white text-[#FF6B4A] shadow-xs" : "text-[#8C8CA1]"
                      }`}
                      title="Dark Mode"
                    >
                      <Moon size={13} />
                    </button>
                    <button
                      onClick={() => handleThemeChange("system")}
                      className={`p-1 rounded-full text-xs transition-all ${
                        theme === "system" ? "bg-white text-[#FF6B4A] shadow-xs" : "text-[#8C8CA1]"
                      }`}
                      title="System Theme"
                    >
                      <Laptop size={13} />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setActiveModal("shortcuts");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[12px] hover:bg-[#FAF9F5] hover:text-[#FF6B4A] transition-all font-medium"
                >
                  <Command size={15} className="text-[#8C8CA1]" />
                  Keyboard Shortcuts
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setActiveModal("help");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[12px] hover:bg-[#FAF9F5] hover:text-[#FF6B4A] transition-all font-medium"
                >
                  <HelpCircle size={15} className="text-[#8C8CA1]" />
                  Help & Documentation
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setActiveModal("logout");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[12px] text-red-600 hover:bg-red-50 transition-all font-semibold mt-1"
                >
                  <LogOut size={15} />
                  Sign Out
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ─── MODALS & DRAWERS ─── */}

      {/* 1. Profile & Account Settings Modal */}
      {activeModal === "profile" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-[24px] border border-[#ECECEC] shadow-2xl w-full max-w-lg overflow-hidden z-10">
            <div className="px-6 py-4 border-b border-[#ECECEC] flex items-center justify-between bg-[#FAF9F5]">
              <h3 className="font-display font-bold text-sm text-[#222222]">
                Super Admin Profile & Account Settings
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#8C8CA1] hover:text-[#222222]"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="flex items-center gap-4 bg-[#FAF9F5] p-4 rounded-[18px] border border-[#ECECEC]">
                <div className="w-14 h-14 rounded-full bg-[#FF6B4A] text-white font-bold text-lg flex items-center justify-center shadow-md">
                  SA
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#222222]">{profile.name}</h4>
                  <p className="text-xs text-[#8C8CA1]">{profile.role}</p>
                  <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full inline-block mt-1">
                    ✓ 2FA Protected
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#8C8CA1] uppercase mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-[12px] border border-[#ECECEC] bg-[#FAF9F5] text-xs font-medium text-[#222222]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#8C8CA1] uppercase mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-[12px] border border-[#ECECEC] bg-[#FAF9F5] text-xs font-medium text-[#222222]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#8C8CA1] uppercase mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-[12px] border border-[#ECECEC] bg-[#FAF9F5] text-xs font-medium text-[#222222]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#8C8CA1] uppercase mb-1">
                    Timezone
                  </label>
                  <select
                    value={profile.timezone}
                    onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                    className="w-full px-3 py-2 rounded-[12px] border border-[#ECECEC] bg-[#FAF9F5] text-xs font-medium text-[#222222]"
                  >
                    <option>Asia/Kolkata (GMT+5:30)</option>
                    <option>UTC (GMT+0:00)</option>
                    <option>America/New_York (EST)</option>
                  </select>
                </div>
              </div>

              {savedSuccess && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-[12px] text-xs text-green-700 font-semibold flex items-center gap-2">
                  <Check size={16} /> Profile settings updated successfully!
                </div>
              )}

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="flex-1 py-2.5 border border-[#ECECEC] text-[#8C8CA1] rounded-[14px] text-xs font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#FF6B4A] text-white rounded-[14px] text-xs font-semibold hover:bg-[#FF5232] transition-all flex items-center justify-center gap-2"
                >
                  <Save size={14} /> Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Security Modal */}
      {activeModal === "security" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-[24px] border border-[#ECECEC] shadow-2xl w-full max-w-lg overflow-hidden z-10">
            <div className="px-6 py-4 border-b border-[#ECECEC] flex items-center justify-between bg-[#FAF9F5]">
              <h3 className="font-display font-bold text-sm text-[#222222]">
                Security, 2FA & Active Sessions
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#8C8CA1] hover:text-[#222222]"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="p-4 bg-[#FAF9F5] border border-[#ECECEC] rounded-[18px] flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#222222]">Two-Factor Authentication (2FA)</p>
                  <p className="text-[11px] text-[#8C8CA1] mt-0.5">Authenticator App (TOTP) is active</p>
                </div>
                <span className="text-xs font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                  Enabled
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-[#8C8CA1]">Active Login Sessions</p>
                <div className="p-3 bg-white border border-[#ECECEC] rounded-[14px] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Laptop size={18} className="text-[#FF6B4A]" />
                    <div>
                      <p className="text-xs font-bold text-[#222222]">Chrome on Windows 11 (Current)</p>
                      <p className="text-[10px] text-[#8C8CA1]">Mumbai, India · IP 103.22.180.4</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#ECECEC] flex justify-end">
                <button
                  onClick={() => {
                    // Password reset action
                  }}
                  className="px-4 py-2 bg-[#FAF9F5] border border-[#ECECEC] text-[#222222] text-xs font-semibold rounded-[12px] hover:border-[#FF6B4A]"
                >
                  Request Password Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. System Activity Log Modal */}
      {activeModal === "activity" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-[24px] border border-[#ECECEC] shadow-2xl w-full max-w-lg overflow-hidden z-10">
            <div className="px-6 py-4 border-b border-[#ECECEC] flex items-center justify-between bg-[#FAF9F5]">
              <h3 className="font-display font-bold text-sm text-[#222222]">
                Super Admin Activity Log
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#8C8CA1] hover:text-[#222222]"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-3 max-h-[75vh] overflow-y-auto">
              {[
                { action: "Verified Restaurant: The Urban Cafe", time: "10 mins ago", ip: "103.22.180.4" },
                { action: "Updated Commission Rate to 10%", time: "2 hours ago", ip: "103.22.180.4" },
                { action: "Suspended Restaurant: Italian Corner", time: "Yesterday", ip: "103.22.180.4" },
                { action: "Exported Platform Analytics PDF Report", time: "Aug 3, 2026", ip: "103.22.180.4" },
              ].map((log, i) => (
                <div key={i} className="p-3 bg-[#FAF9F5] border border-[#ECECEC] rounded-[14px] flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-[#222222]">{log.action}</p>
                    <p className="text-[10px] text-[#8C8CA1] mt-0.5">{log.time} · IP: {log.ip}</p>
                  </div>
                  <Activity size={14} className="text-[#FF6B4A]" />
                </div>
              ))}

              <button
                onClick={() => {
                  // Export audit trail action
                }}
                className="w-full py-2 bg-[#FAF9F5] border border-[#ECECEC] text-[#FF6B4A] text-xs font-semibold rounded-[12px] flex items-center justify-center gap-1.5"
              >
                <Download size={14} /> Export Audit Trail
              </button>

            </div>
          </div>
        </div>
      )}

      {/* 4. Keyboard Shortcuts Modal */}
      {activeModal === "shortcuts" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-[24px] border border-[#ECECEC] shadow-2xl w-full max-w-md overflow-hidden z-10">
            <div className="px-6 py-4 border-b border-[#ECECEC] flex items-center justify-between bg-[#FAF9F5]">
              <h3 className="font-display font-bold text-sm text-[#222222]">
                Keyboard Shortcuts
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#8C8CA1] hover:text-[#222222]"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-2 text-xs">
              {[
                { key: "Ctrl + K", desc: "Open Global Search Command Palette" },
                { key: "Esc", desc: "Close Modals / Drawers" },
                { key: "Arrow Up / Down", desc: "Navigate Search Results" },
                { key: "Enter", desc: "Select Search Result" },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 bg-[#FAF9F5] border border-[#ECECEC] rounded-[12px]">
                  <span className="text-[#666]">{s.desc}</span>
                  <kbd className="px-2 py-1 bg-white border border-[#ECECEC] rounded font-mono font-bold text-[10px]">
                    {s.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. Help Center Modal */}
      {activeModal === "help" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-[24px] border border-[#ECECEC] shadow-2xl w-full max-w-lg overflow-hidden z-10">
            <div className="px-6 py-4 border-b border-[#ECECEC] flex items-center justify-between bg-[#FAF9F5]">
              <h3 className="font-display font-bold text-sm text-[#222222]">
                Food Mania Admin Help & Documentation
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#8C8CA1] hover:text-[#222222]"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-3 text-xs">
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-[18px]">
                <h4 className="font-bold text-[#FF6B4A]">Food Mania Super Admin Docs v1.0</h4>
                <p className="text-[11px] text-[#666] mt-1">Complete system guide for tenant onboarding, financial settlements, and platform settings.</p>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-[#8C8CA1] uppercase tracking-wider">Quick FAQs</p>
                <details className="p-3 bg-[#FAF9F5] border border-[#ECECEC] rounded-[14px]">
                  <summary className="font-semibold cursor-pointer text-[#222222]">How to verify a new restaurant?</summary>
                  <p className="mt-2 text-[#666] leading-relaxed">Go to Restaurants directory, click "Verify" on pending restaurants. QR codes will be auto-generated.</p>
                </details>
                <details className="p-3 bg-[#FAF9F5] border border-[#ECECEC] rounded-[14px]">
                  <summary className="font-semibold cursor-pointer text-[#222222]">How does platform commission work?</summary>
                  <p className="mt-2 text-[#666] leading-relaxed">Configured in Settings → Financial. Default commission is 10% + 18% GST.</p>
                </details>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Logout Confirmation Modal */}
      {activeModal === "logout" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-[24px] border border-[#ECECEC] shadow-2xl w-full max-w-sm overflow-hidden z-10 p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle size={24} />
            </div>
            <h3 className="font-display font-bold text-base text-[#222222]">Sign Out of Admin Console?</h3>
            <p className="text-xs text-[#8C8CA1] mt-1">Your active session will be ended immediately.</p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 py-2.5 border border-[#ECECEC] text-[#8C8CA1] rounded-[14px] text-xs font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-[14px] text-xs font-semibold hover:bg-red-700 transition-all shadow-sm"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
