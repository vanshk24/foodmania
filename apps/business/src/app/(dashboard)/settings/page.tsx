"use client";

import React, { useState, useEffect } from "react";
import {
  Settings, Save, QrCode, Building2, Clock, ShieldCheck, Sparkles,
  Phone, MapPin, Utensils, ImageIcon, RefreshCw, CheckCircle2,
} from "lucide-react";
import { Card, Badge, Button } from "@food-mania/ui";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function getStoredRid(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("fm_restaurant_id") || "";
}
function getStoredToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("fm_biz_token") || "";
}

const INPUT_CLS =
  "w-full bg-[#FAF9F5] border border-[#ECECEC] rounded-[16px] px-3 py-2.5 text-sm text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/30 focus:border-[#FF6B4A] transition";

export default function BusinessProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedOk, setSavedOk] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    cuisine: "",
    phone: "",
    address: "",
    city: "",
    imageUrl: "",
    bannerUrl: "",
    deliveryFee: 40,
    minOrder: 200,
  });

  // Load existing profile from API
  useEffect(() => {
    const rid = getStoredRid();
    if (!rid) { setLoading(false); return; }

    fetch(`${API_BASE_URL}/restaurants/${rid}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        const d = json?.data || json;
        if (d && d.id) {
          setForm({
            name: d.name || "",
            cuisine: d.cuisine || "Multi-Cuisine",
            phone: d.phone || "",
            address: d.address || "",
            city: d.city || "",
            imageUrl: d.imageUrl || "",
            bannerUrl: d.bannerUrl || "",
            deliveryFee: d.deliveryFee ?? 40,
            minOrder: d.minOrder ?? 200,
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    const rid = getStoredRid();
    if (!rid) { setError("Restaurant session missing. Please log in again."); return; }

    setSaving(true);
    setError(null);
    try {
      const token = getStoredToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE_URL}/restaurants/${rid}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({
          name: form.name,
          cuisine: form.cuisine,
          phone: form.phone,
          address: form.address,
          city: form.city,
          imageUrl: form.imageUrl || undefined,
          bannerUrl: form.bannerUrl || undefined,
          deliveryFee: Number(form.deliveryFee),
          minOrder: Number(form.minOrder),
        }),
      });

      if (res.ok) {
        setSavedOk(true);
        if (form.name) localStorage.setItem("fm_restaurant_name", form.name);
        setTimeout(() => setSavedOk(false), 3000);
      } else {
        const json = await res.json().catch(() => ({}));
        setError(json.message || "Failed to save profile.");
      }
    } catch {
      setError("Network error. Please check the server is running.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-[#8C8CA1]">
        <RefreshCw className="animate-spin mr-2" size={18} /> Loading profile…
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-[24px] shadow-card border border-[#ECECEC]">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#222222] flex items-center gap-2">
            <Settings className="text-[#63B46C]" />
            <span>Restaurant Profile &amp; Settings</span>
          </h1>
          <p className="text-xs text-[#666666] mt-0.5">
            Manage your restaurant identity, contact info, images and delivery settings.
          </p>
        </div>
        <Button variant="primary" size="md" onClick={handleSave} disabled={saving} className="min-h-[44px]">
          {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
          <span>{savedOk ? "Saved!" : saving ? "Saving…" : "Save Profile"}</span>
        </Button>
      </div>

      {savedOk && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-[14px] px-4 py-2.5 text-sm font-semibold">
          <CheckCircle2 size={16} /> Profile saved successfully!
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-[14px] px-4 py-2.5 text-sm font-semibold">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Identity */}
        <Card padding="md" className="space-y-4 bg-white border border-[#ECECEC] shadow-card">
          <h3 className="font-display font-bold text-base text-[#222222] flex items-center gap-2">
            <Building2 size={18} className="text-[#FF6B4A]" />
            <span>Restaurant Identity</span>
          </h3>
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-[#222222] block mb-1">Restaurant Name *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={INPUT_CLS} />
            </div>
            <div>
              <label className="font-bold text-[#222222] block mb-1">Cuisine / Category</label>
              <input type="text" placeholder="e.g. North Indian, Continental" value={form.cuisine} onChange={(e) => setForm({ ...form, cuisine: e.target.value })} className={INPUT_CLS} />
            </div>
          </div>
        </Card>

        {/* Contact & Location */}
        <Card padding="md" className="space-y-4 bg-white border border-[#ECECEC] shadow-card">
          <h3 className="font-display font-bold text-base text-[#222222] flex items-center gap-2">
            <MapPin size={18} className="text-[#63B46C]" />
            <span>Contact &amp; Location</span>
          </h3>
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-[#222222] block mb-1">Phone</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={INPUT_CLS} />
            </div>
            <div>
              <label className="font-bold text-[#222222] block mb-1">City</label>
              <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={INPUT_CLS} />
            </div>
            <div>
              <label className="font-bold text-[#222222] block mb-1">Full Address</label>
              <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={INPUT_CLS} />
            </div>
          </div>
        </Card>

        {/* Images */}
        <Card padding="md" className="space-y-4 bg-white border border-[#ECECEC] shadow-card">
          <h3 className="font-display font-bold text-base text-[#222222] flex items-center gap-2">
            <ImageIcon size={18} className="text-[#FF6B4A]" />
            <span>Profile &amp; Cover Images</span>
          </h3>
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-[#222222] block mb-1">Logo / Profile Image URL</label>
              <input type="url" placeholder="https://…" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className={INPUT_CLS} />
              {form.imageUrl && (
                <img src={form.imageUrl} alt="logo preview" className="mt-2 h-16 w-16 object-cover rounded-[12px] border border-[#ECECEC]" />
              )}
            </div>
            <div>
              <label className="font-bold text-[#222222] block mb-1">Cover / Banner Image URL</label>
              <input type="url" placeholder="https://…" value={form.bannerUrl} onChange={(e) => setForm({ ...form, bannerUrl: e.target.value })} className={INPUT_CLS} />
              {form.bannerUrl && (
                <img src={form.bannerUrl} alt="banner preview" className="mt-2 h-20 w-full object-cover rounded-[12px] border border-[#ECECEC]" />
              )}
            </div>
          </div>
        </Card>

        {/* Delivery Settings */}
        <Card padding="md" className="space-y-4 bg-white border border-[#ECECEC] shadow-card">
          <h3 className="font-display font-bold text-base text-[#222222] flex items-center gap-2">
            <Utensils size={18} className="text-[#63B46C]" />
            <span>Delivery &amp; Order Settings</span>
          </h3>
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-[#222222] block mb-1">Delivery Fee (₹)</label>
              <input type="number" min={0} value={form.deliveryFee} onChange={(e) => setForm({ ...form, deliveryFee: Number(e.target.value) })} className={INPUT_CLS} />
            </div>
            <div>
              <label className="font-bold text-[#222222] block mb-1">Minimum Order Amount (₹)</label>
              <input type="number" min={0} value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: Number(e.target.value) })} className={INPUT_CLS} />
            </div>
            <div className="p-4 bg-[#EFF7EE] rounded-[20px] border border-[#63B46C]/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#63B46C]">Digital Table QR Code Generator</span>
                <Badge variant="success" size="sm">Active</Badge>
              </div>
              <p className="text-[11px] text-[#666666]">
                QR codes generated automatically for all tables allowing direct contactless ordering.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
