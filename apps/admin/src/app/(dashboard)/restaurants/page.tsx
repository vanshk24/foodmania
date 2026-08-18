"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Store, Search, Plus, CheckCircle2, XCircle, Star,
  Eye, QrCode, TrendingUp, AlertTriangle, X,
  MapPin, Phone, Mail, ShieldCheck, Loader2, Trash2
} from "lucide-react";
import {
  AdminRestaurant,
  RestaurantStatus,
  SubscriptionPlan,
} from "@food-mania/shared";

import { getApiBaseUrl } from "@food-mania/shared";

const API_BASE_URL = getApiBaseUrl();

// ─── Helper Token Getter ───────────────────────────────────────────────────

function getAdminToken(): string {
  if (typeof window === "undefined") return "";
  try {
    return (
      localStorage.getItem("fm_admin_token") ||
      localStorage.getItem("fm_token") ||
      localStorage.getItem("food_mania_token") ||
      ""
    );
  } catch {
    return "";
  }
}

// ─── Types ──────────────────────────────────────────────────────────────────

interface AddRestaurantForm {
  name: string;
  ownerName: string;
  ownerEmail: string;
  ownerPassword?: string;
  phone: string;
  city: string;
  address: string;
  cuisine: string;
  description: string;
  openingTime: string;
  closingTime: string;
  plan: SubscriptionPlan;
}

const INITIAL_FORM: AddRestaurantForm = {
  name: "",
  ownerName: "",
  ownerEmail: "",
  ownerPassword: "",
  phone: "",
  city: "",
  address: "",
  cuisine: "Multi-Cuisine",
  description: "",
  openingTime: "11:00 AM",
  closingTime: "11:00 PM",
  plan: "Basic",
};

function slugify(str: string) {
  return str.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

function PlanBadge({ plan }: { plan: SubscriptionPlan }) {
  const styles: Record<SubscriptionPlan, string> = {
    Basic: "bg-gray-100 text-gray-600",
    Pro: "bg-orange-50 text-orange-600",
    Enterprise: "bg-green-50 text-green-700",
  };
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${styles[plan]}`}>
      {plan}
    </span>
  );
}

function StatusBadge({ status }: { status: RestaurantStatus }) {
  const styles: Record<RestaurantStatus, string> = {
    active: "bg-green-50 text-green-700",
    suspended: "bg-red-50 text-red-600",
    pending: "bg-yellow-50 text-yellow-700",
    rejected: "bg-gray-100 text-gray-500",
  };
  const labels: Record<RestaurantStatus, string> = {
    active: "Active",
    suspended: "Suspended",
    pending: "Pending",
    rejected: "Rejected",
  };
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

function RestaurantCard({
  restaurant,
  onVerify,
  onToggleSuspend,
  onOpenImageUpload,
  onDelete,
}: {
  restaurant: AdminRestaurant & { imageUrl?: string };
  onVerify: (id: string) => void;
  onToggleSuspend: (id: string) => void;
  onOpenImageUpload: (restaurant: AdminRestaurant) => void;
  onDelete: (id: string, name: string) => void;
}) {
  return (
    <div className="bg-white border border-[#ECECEC] rounded-[20px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.09)] transition-all group">
      {restaurant.imageUrl && (
        <div className="relative w-full h-32 rounded-[14px] overflow-hidden mb-3 border border-[#ECECEC]">
          <img src={restaurant.imageUrl} alt={restaurant.name} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-10 h-10 rounded-[14px] bg-[#FF6B4A]/10 flex items-center justify-center shrink-0">
            <Store size={18} className="text-[#FF6B4A]" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-sm text-[#222222] truncate">{restaurant.name}</h3>
            <p className="text-xs text-[#8C8CA1] flex items-center gap-1">
              <MapPin size={10} />
              {restaurant.city}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <PlanBadge plan={restaurant.plan} />
          <StatusBadge status={restaurant.status} />
        </div>
      </div>

      <div className="bg-[#FAF9F5] rounded-[12px] p-2.5 mb-3 space-y-1">
        <p className="text-xs text-[#222222] font-medium flex items-center gap-1.5">
          <span className="text-[#8C8CA1]">Owner:</span> {restaurant.ownerName}
        </p>
        <p className="text-xs text-[#8C8CA1] flex items-center gap-1.5">
          <Mail size={10} /> {restaurant.ownerEmail}
        </p>
        <p className="text-xs text-[#8C8CA1] flex items-center gap-1.5">
          <Phone size={10} /> {restaurant.phone}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center">
          <p className="text-xs text-[#8C8CA1]">Revenue</p>
          <p className="text-sm font-bold text-[#222222]">₹{restaurant.revenue.toLocaleString("en-IN")}</p>
        </div>
        <div className="text-center border-x border-[#ECECEC]">
          <p className="text-xs text-[#8C8CA1]">Orders</p>
          <p className="text-sm font-bold text-[#222222]">{restaurant.ordersCount.toLocaleString()}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-[#8C8CA1]">Rating</p>
          <p className="text-sm font-bold text-[#222222] flex items-center justify-center gap-0.5">
            <Star size={12} className="text-[#F6B73C] fill-[#F6B73C]" />
            {restaurant.reviewRating > 0 ? restaurant.reviewRating : "—"}
          </p>
        </div>
      </div>

      <div className="flex gap-2 mb-3">
        <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${restaurant.verified ? "bg-green-50 text-green-700" : "bg-red-50 text-red-500"}`}>
          {restaurant.verified ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
          {restaurant.verified ? "Verified" : "Unverified"}
        </div>
        <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${restaurant.qrActive ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-400"}`}>
          <QrCode size={11} />
          QR {restaurant.qrActive ? "On" : "Off"}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {!restaurant.verified && restaurant.status !== "rejected" && (
          <button
            onClick={() => onVerify(restaurant.id)}
            className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 bg-[#63B46C] text-white rounded-[10px] hover:bg-[#50a05a] transition"
          >
            <ShieldCheck size={12} /> Verify
          </button>
        )}
        <button
          onClick={() => onToggleSuspend(restaurant.id)}
          className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-[10px] border transition ${
            restaurant.status === "suspended"
              ? "border-[#63B46C] text-[#63B46C] hover:bg-green-50"
              : "border-[#FF6B4A] text-[#FF6B4A] hover:bg-red-50"
          }`}
        >
          {restaurant.status === "suspended" ? "Reactivate" : "Deactivate / Suspend"}
        </button>
        <button
          onClick={() => onOpenImageUpload(restaurant)}
          className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 bg-[#FFF3E8] text-[#FF6B4A] border border-[#FF6B4A]/30 rounded-[10px] hover:bg-[#FF6B4A] hover:text-white transition"
        >
          Set Image
        </button>
        <button
          onClick={() => onDelete(restaurant.id, restaurant.name)}
          className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-[10px] hover:bg-red-600 hover:text-white transition"
          title="Delete Restaurant"
        >
          <Trash2 size={12} /> Delete
        </button>
        <button
          onClick={() => {
            window.open(`http://localhost:3001/overview?restaurantId=${restaurant.id}`, "_blank");
          }}
          className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 bg-[#FAF9F5] border border-[#ECECEC] text-[#222222] rounded-[10px] hover:border-[#FF6B4A] transition ml-auto"
        >
          <Eye size={12} /> Business Dashboard
        </button>
      </div>
    </div>
  );
}

function AddRestaurantModal({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (r: AdminRestaurant) => void;
}) {
  const [form, setForm] = useState<AddRestaurantForm>(INITIAL_FORM);

  const handleSubmit = () => {
    if (!form.name || !form.ownerName || !form.city) return;
    const newR = {
      id: slugify(form.name),
      name: form.name,
      ownerName: form.ownerName,
      ownerEmail: form.ownerEmail || `owner.${slugify(form.name)}@foodmania.com`,
      ...(form.ownerPassword ? { ownerPassword: form.ownerPassword } : {}),
      phone: form.phone || "+91 98765 43210",
      city: form.city,
      ...(form.address ? { address: form.address } : {}),
      cuisine: form.cuisine || "Multi-Cuisine",
      ...(form.description ? { description: form.description } : {}),
      openingTime: form.openingTime || "11:00 AM",
      closingTime: form.closingTime || "11:00 PM",
      plan: form.plan,
      status: "pending" as const,
      verified: false,
      qrActive: false,
      ordersCount: 0,
      tablesCount: 0,
      revenue: 0,
      reviewRating: 0,
      joinedDate: new Date().toISOString().split("T")[0] ?? "",
    };
    onAdd(newR);
    setForm(INITIAL_FORM);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-[24px] w-full max-w-md shadow-2xl border border-[#ECECEC]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ECECEC]">
          <h2 className="font-bold text-[#222222]">Add New Restaurant</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-[#666]">
            <X size={16} />
          </button>
        </div>
        <div className="p-6 space-y-3 max-h-[70vh] overflow-y-auto">
          {(
            [
              ["Restaurant Name *", "name", "text"],
              ["Owner Name *", "ownerName", "text"],
              ["Owner Email", "ownerEmail", "email"],
              ["Owner Password", "ownerPassword", "password"],
              ["Phone", "phone", "tel"],
              ["City *", "city", "text"],
              ["Full Address", "address", "text"],
              ["Cuisine / Category", "cuisine", "text"],
              ["Opening Time", "openingTime", "text"],
              ["Closing Time", "closingTime", "text"],
            ] as [string, keyof AddRestaurantForm, string][]
          ).map(([label, key, type]) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-[#8C8CA1] uppercase tracking-wide mb-1">
                {label}
              </label>
              <input
                type={type}
                placeholder={key === "ownerPassword" ? "Secure password (min 8 chars)" : key === "cuisine" ? "e.g. North Indian, Continental" : key === "openingTime" ? "e.g. 11:00 AM" : key === "closingTime" ? "e.g. 11:00 PM" : ""}
                value={form[key] as string}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full px-3 py-2 rounded-[12px] border border-[#ECECEC] bg-[#FAF9F5] text-sm text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/30 focus:border-[#FF6B4A] transition"
              />
            </div>
          ))}
          {/* Description textarea */}
          <div>
            <label className="block text-xs font-semibold text-[#8C8CA1] uppercase tracking-wide mb-1">
              Description / About
            </label>
            <textarea
              rows={2}
              placeholder="Brief description of your restaurant..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 rounded-[12px] border border-[#ECECEC] bg-[#FAF9F5] text-sm text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/30 focus:border-[#FF6B4A] transition resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#8C8CA1] uppercase tracking-wide mb-1">
              Subscription Plan
            </label>
            <select
              value={form.plan}
              onChange={(e) => setForm({ ...form, plan: e.target.value as SubscriptionPlan })}
              className="w-full px-3 py-2 rounded-[12px] border border-[#ECECEC] bg-[#FAF9F5] text-sm text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/30 focus:border-[#FF6B4A] transition"
            >
              <option value="Basic">Basic — ₹1,999/mo</option>
              <option value="Pro">Pro — ₹4,999/mo</option>
              <option value="Enterprise">Enterprise — ₹9,999/mo</option>
            </select>
          </div>
        </div>
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-[#ECECEC] rounded-[12px] text-sm font-semibold text-[#8C8CA1] hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-2.5 bg-[#FF6B4A] text-white rounded-[12px] text-sm font-semibold hover:bg-[#e5592e] transition"
          >
            Add Restaurant
          </button>
        </div>
      </div>
    </div>
  );
}

function ImageUploadModal({
  restaurant,
  open,
  onClose,
  onSave,
}: {
  restaurant: (AdminRestaurant & { imageUrl?: string }) | null;
  open: boolean;
  onClose: () => void;
  onSave: (id: string, imageUrl: string) => void;
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (restaurant?.imageUrl) {
      setPreviewUrl(restaurant.imageUrl);
    } else {
      setPreviewUrl("");
    }
    setSelectedFile(null);
    setError(null);
  }, [restaurant]);

  if (!open || !restaurant) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate MIME type
    if (!file.type.startsWith("image/")) {
      setError("Invalid file type. Please select an image file (JPEG, PNG, WebP, etc.).");
      return;
    }

    // Validate file size (< 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit. Please select a smaller image.");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPreviewUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!previewUrl) {
      setError("Please select an image first.");
      return;
    }

    setUploading(true);
    try {
      const token = getAdminToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE_URL}/admin/restaurants/${restaurant.id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ imageUrl: previewUrl }),
      });

      if (res.ok) {
        onSave(restaurant.id, previewUrl);
        onClose();
      } else {
        setError("Failed to update profile image. Try again.");
      }
    } catch (e) {
      setError("Network error updating restaurant image.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-[24px] w-full max-w-md shadow-2xl border border-[#ECECEC]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ECECEC]">
          <h2 className="font-bold text-[#222222]">Set Profile Image — {restaurant.name}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-[#666]">
            <X size={16} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-[12px] text-xs text-red-600 font-medium">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#8C8CA1] uppercase tracking-wide">
              Select Restaurant Image (Max 5MB)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-xs text-[#222222] file:mr-3 file:py-2 file:px-4 file:rounded-[10px] file:border-0 file:text-xs file:font-semibold file:bg-[#FF6B4A]/10 file:text-[#FF6B4A] hover:file:bg-[#FF6B4A]/20 cursor-pointer"
            />
          </div>

          {previewUrl && (
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-[#8C8CA1] uppercase">Preview</span>
              <div className="relative w-full h-44 rounded-[16px] overflow-hidden border border-[#ECECEC] bg-[#FAF9F5]">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            </div>
          )}
        </div>
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-[#ECECEC] rounded-[12px] text-sm font-semibold text-[#8C8CA1] hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={uploading}
            className="flex-1 py-2.5 bg-[#FF6B4A] text-white rounded-[12px] text-sm font-semibold hover:bg-[#e5592e] transition disabled:opacity-50"
          >
            {uploading ? "Saving..." : "Save Image"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminRestaurantsPage() {
  const [restaurants, setRestaurants] = useState<(AdminRestaurant & { imageUrl?: string })[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("All");
  const [planFilter, setPlanFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedImageRestaurant, setSelectedImageRestaurant] = useState<(AdminRestaurant & { imageUrl?: string }) | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRestaurants = () => {
    setLoading(true);
    const token = getAdminToken();
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    fetch(`${API_BASE_URL}/admin/restaurants`, { headers })
      .then((res) => res.json())
      .then((json) => {
        const dbRestos = json.data || json;
        if (Array.isArray(dbRestos)) {
          const mapped = dbRestos.map((r: any) => ({
            id: r.id,
            name: r.name,
            ownerName: r.ownerName || "Restaurant Owner",
            ownerEmail: r.ownerEmail || "owner@foodmania.com",
            phone: r.phone || "+91 98765 00000",
            city: r.city || "Mumbai",
            plan: "Pro" as SubscriptionPlan,
            status: r.status?.toLowerCase() === "active" ? ("active" as RestaurantStatus) : ("suspended" as RestaurantStatus),
            verified: true,
            qrActive: r.status?.toLowerCase() === "active",
            ordersCount: r.ordersCount || 0,
            tablesCount: r.tablesCount || 0,
            revenue: (r.ordersCount || 0) * 650,
            reviewRating: r.rating || 4.8,
            joinedDate: r.createdAt ? new Date(r.createdAt).toISOString().split("T")[0]! : new Date().toISOString().split("T")[0]!,
            imageUrl: r.imageUrl || undefined,
          }));
          setRestaurants(mapped);
        }
      })
      .catch((err) => console.warn("Backend restaurants fetch warning:", err))
      .finally(() => setLoading(false));
  };

  React.useEffect(() => {
    fetchRestaurants();
  }, []);

  const cities = ["All", ...Array.from(new Set(restaurants.map((r) => r.city)))];

  const filtered = useMemo(() => {
    return restaurants.filter((r) => {
      const q = searchQuery.toLowerCase();
      const matchQ =
        !q || r.name.toLowerCase().includes(q) || r.ownerName.toLowerCase().includes(q) || r.city.toLowerCase().includes(q);
      const matchCity = cityFilter === "All" || r.city === cityFilter;
      const matchPlan = planFilter === "All" || r.plan === planFilter;
      const matchStatus = statusFilter === "All" || r.status === statusFilter;
      return matchQ && matchCity && matchPlan && matchStatus;
    });
  }, [restaurants, searchQuery, cityFilter, planFilter, statusFilter]);

  const handleVerify = (id: string) => {
    const token = getAdminToken();
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    setRestaurants((rs) => rs.map((r) => (r.id === id ? { ...r, verified: true, status: "active", qrActive: true } : r)));
    fetch(`${API_BASE_URL}/admin/restaurants/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ status: "ACTIVE" }),
    }).catch((e) => console.warn("Verify patch error:", e));
  };

  const handleToggleSuspend = (id: string) => {
    const token = getAdminToken();
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    setRestaurants((rs) =>
      rs.map((r) => {
        if (r.id !== id) return r;
        const nextStatus = r.status === "suspended" ? "active" : "suspended";
        fetch(`${API_BASE_URL}/admin/restaurants/${id}`, {
          method: "PATCH",
          headers,
          body: JSON.stringify({ status: nextStatus.toUpperCase() }),
        }).catch(() => {});
        return { ...r, status: nextStatus, qrActive: nextStatus === "active" };
      })
    );
  };

  const handleAdd = async (r: AdminRestaurant) => {
    const token = getAdminToken();
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    try {
      const res = await fetch(`${API_BASE_URL}/admin/restaurants`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: r.name,
          slug: r.id,
          city: r.city,
          ownerName: r.ownerName,
          ownerEmail: r.ownerEmail,
          ownerPassword: (r as any).ownerPassword || "owner123",
          phone: r.phone,
        }),
      });
      if (res.ok) {
        fetchRestaurants();
      }
    } catch (e) {
      console.warn("Restaurant add warning:", e);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    const token = getAdminToken();
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    try {
      const res = await fetch(`${API_BASE_URL}/admin/restaurants/${id}`, {
        method: "DELETE",
        headers,
      });

      if (res.ok) {
        setRestaurants((prev) => prev.filter((r) => r.id !== id));
      } else {
        const json = await res.json().catch(() => ({}));
        alert(json.message || "Failed to delete restaurant.");
      }
    } catch (e) {
      alert("Network error communicating with server while deleting restaurant.");
    }
  };

  const handleImageSave = (id: string, imageUrl: string) => {
    setRestaurants((rs) => rs.map((r) => (r.id === id ? { ...r, imageUrl } : r)));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#222222]">Restaurant Partners</h1>
          <p className="text-sm text-[#8C8CA1] mt-1">Manage onboarded restaurants, profile images, verification, & subscriptions</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#FF6B4A] hover:bg-[#e5592e] text-white text-sm font-bold rounded-[14px] shadow-sm transition"
        >
          <Plus size={16} /> Add Restaurant
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-[#ECECEC] rounded-[20px] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C8CA1]" />
          <input
            type="text"
            placeholder="Search by restaurant name, owner, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-[12px] border border-[#ECECEC] bg-[#FAF9F5] text-sm text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/30 focus:border-[#FF6B4A] transition"
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-2 bg-white rounded-[24px] border border-[#ECECEC]">
          <Loader2 className="animate-spin text-[#FF6B4A] mx-auto" size={32} />
          <p className="text-xs text-[#8C8CA1]">Loading PostgreSQL partner restaurants...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[24px] border border-[#ECECEC] space-y-3">
          <Store size={40} className="text-[#8C8CA1] mx-auto opacity-50" />
          <h3 className="font-bold text-[#222222]">No Restaurants Found</h3>
          <p className="text-xs text-[#8C8CA1]">Add your first restaurant or adjust your search filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((r) => (
            <RestaurantCard
              key={r.id}
              restaurant={r}
              onVerify={handleVerify}
              onToggleSuspend={handleToggleSuspend}
              onOpenImageUpload={(target) => setSelectedImageRestaurant(target)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <AddRestaurantModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAdd}
      />

      <ImageUploadModal
        restaurant={selectedImageRestaurant}
        open={!!selectedImageRestaurant}
        onClose={() => setSelectedImageRestaurant(null)}
        onSave={handleImageSave}
      />
    </div>
  );
}
