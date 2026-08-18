"use client";
import React, { useState, useMemo } from "react";
import {
  Users, Search, Download, Ban, Eye, CheckCircle2,
  XCircle, Star, Phone, Mail, ShoppingBag, Gift,
  Calendar, X, Clock, Loader2
} from "lucide-react";
import { AdminUser, UserStatus } from "@food-mania/shared";

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

// ─── Status Badge ──────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: UserStatus }) {
  const styles: Record<UserStatus, string> = {
    active: "bg-green-50 text-green-700",
    suspended: "bg-yellow-50 text-yellow-700",
    banned: "bg-red-50 text-red-600",
  };
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// ─── User Drawer ──────────────────────────────────────────────────────────────

function UserDrawer({
  user,
  open,
  onClose,
}: {
  user: AdminUser | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!open || !user) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-white shadow-2xl border-l border-[#ECECEC] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#ECECEC]">
          <h2 className="font-bold text-[#222222]">User Profile</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
            <X size={16} className="text-[#666]" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF6B4A] to-[#F6B73C] flex items-center justify-center text-white text-2xl font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-[#222222]">{user.name}</h3>
              <StatusBadge status={user.status} />
            </div>
          </div>

          <div className="bg-[#FAF9F5] rounded-[16px] p-4 space-y-2">
            <p className="text-xs text-[#8C8CA1] flex items-center gap-2"><Mail size={12} /> {user.email}</p>
            <p className="text-xs text-[#8C8CA1] flex items-center gap-2"><Phone size={12} /> {user.phone}</p>
            <p className="text-xs text-[#8C8CA1] flex items-center gap-2"><Calendar size={12} /> Joined {user.joinedDate}</p>
            <p className="text-xs text-[#8C8CA1] flex items-center gap-2"><Clock size={12} /> Last active: {user.lastActive}</p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Orders", value: user.totalOrders, icon: ShoppingBag, color: "#FF6B4A" },
              { label: "Spend", value: `₹${(user.totalSpend / 1000).toFixed(1)}k`, icon: Star, color: "#F6B73C" },
              { label: "Points", value: user.loyaltyPoints, icon: Gift, color: "#63B46C" },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="bg-white border border-[#ECECEC] rounded-[14px] p-3 text-center">
                  <Icon size={16} className="mx-auto mb-1" style={{ color: s.color }} />
                  <p className="text-sm font-bold text-[#222222]">{s.value}</p>
                  <p className="text-xs text-[#8C8CA1]">{s.label}</p>
                </div>
              );
            })}
          </div>

          <div>
            <p className="text-xs font-semibold text-[#8C8CA1] uppercase tracking-wide mb-2">Favourite Restaurant</p>
            <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-[12px] px-3 py-2">
              <Star size={14} className="text-[#F6B73C] fill-[#F6B73C]" />
              <span className="text-sm font-semibold text-[#222222]">{user.favouriteRestaurant}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function UserCard({
  user,
  onView,
  onToggleSuspend,
  onBan,
}: {
  user: AdminUser;
  onView: (u: AdminUser) => void;
  onToggleSuspend: (id: string) => void;
  onBan: (id: string) => void;
}) {
  return (
    <div className="bg-white border border-[#ECECEC] rounded-[20px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B4A] to-[#F6B73C] flex items-center justify-center text-white font-bold text-sm">
            {user.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#222222]">{user.name}</h3>
            <p className="text-xs text-[#8C8CA1]">{user.email}</p>
          </div>
        </div>
        <StatusBadge status={user.status} />
      </div>

      <div className="bg-[#FAF9F5] rounded-[12px] p-2.5 mb-3 flex items-center justify-between text-xs">
        <span className="text-[#8C8CA1] flex items-center gap-1"><Phone size={10} /> {user.phone}</span>
        <span className="font-bold text-[#FF6B4A]">{user.totalOrders} Orders</span>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onView(user)}
          className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 bg-[#FAF9F5] border border-[#ECECEC] text-[#222222] rounded-[10px] hover:border-[#FF6B4A] transition"
        >
          <Eye size={12} /> Profile
        </button>
        {user.status !== "banned" && (
          <button
            onClick={() => onToggleSuspend(user.id)}
            className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-[10px] border transition ${
              user.status === "suspended"
                ? "border-[#63B46C] text-[#63B46C] hover:bg-green-50"
                : "border-[#F6B73C] text-[#F6B73C] hover:bg-yellow-50"
            }`}
          >
            {user.status === "suspended" ? "Activate" : "Suspend"}
          </button>
        )}
        {user.status !== "banned" && (
          <button
            onClick={() => onBan(user.id)}
            className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 border border-red-200 text-red-500 rounded-[10px] hover:bg-red-50 transition"
          >
            <Ban size={12} /> Ban
          </button>
        )}
      </div>
    </div>
  );
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [drawerUser, setDrawerUser] = useState<AdminUser | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    setLoading(true);
    const token = getAdminToken();
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    fetch(`${API_BASE_URL}/admin/users`, { headers })
      .then((res) => res.json())
      .then((json) => {
        const dbUsers = json.data || json;
        if (Array.isArray(dbUsers)) {
          const mapped: AdminUser[] = dbUsers.map((u: any) => ({
            id: u.id,
            name: u.name || "Customer",
            phone: u.phone || "+91 98765 43210",
            email: u.email,
            status: (u.role === "BANNED" ? "banned" : u.status === "SUSPENDED" ? "suspended" : "active") as UserStatus,
            totalOrders: u.totalOrders || 0,
            totalSpend: u.totalSpend || (u.totalOrders || 0) * 450,
            loyaltyPoints: (u.totalOrders || 0) * 50,
            favouriteRestaurant: "The Urban Cafe",
            joinedDate: u.createdAt ? new Date(u.createdAt).toISOString().split("T")[0]! : new Date().toISOString().split("T")[0]!,
            lastActive: "Today",
          }));
          setUsers(mapped);
        }
      })
      .catch((err) => console.warn("Backend users fetch warning:", err))
      .finally(() => setLoading(false));
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return users.filter((u) => {
      const matchQ = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.phone.includes(q);
      const matchStatus = statusFilter === "All" || u.status === statusFilter;
      return matchQ && matchStatus;
    });
  }, [users, searchQuery, statusFilter]);

  const handleToggleSuspend = (id: string) => {
    const token = getAdminToken();
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const targetUser = users.find((u) => u.id === id);
    const nextStatus = targetUser?.status === "suspended" ? "ACTIVE" : "SUSPENDED";

    fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ status: nextStatus }),
    })
      .then(() => fetchUsers())
      .catch((e) => console.warn("User status patch warning:", e));

    setUsers((us) =>
      us.map((u) => (u.id === id ? { ...u, status: nextStatus.toLowerCase() as any } : u))
    );
  };

  const handleBan = (id: string) => {
    const token = getAdminToken();
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ role: "BANNED" }),
    })
      .then(() => fetchUsers())
      .catch((e) => console.warn("User ban patch warning:", e));

    setUsers((us) => us.map((u) => (u.id === id ? { ...u, status: "banned" } : u)));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#222222]">Customer Directory</h1>
          <p className="text-sm text-[#8C8CA1] mt-1">Manage all registered customer accounts & moderation</p>
        </div>
      </div>

      <div className="bg-white border border-[#ECECEC] rounded-[20px] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C8CA1]" />
          <input
            type="text"
            placeholder="Search by customer name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-[12px] border border-[#ECECEC] bg-[#FAF9F5] text-sm text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/30 focus:border-[#FF6B4A] transition"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-2 bg-white rounded-[24px] border border-[#ECECEC]">
          <Loader2 className="animate-spin text-[#FF6B4A] mx-auto" size={32} />
          <p className="text-xs text-[#8C8CA1]">Loading registered users from PostgreSQL...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[24px] border border-[#ECECEC] space-y-3">
          <Users size={40} className="text-[#8C8CA1] mx-auto opacity-50" />
          <h3 className="font-bold text-[#222222]">No Users Found</h3>
          <p className="text-xs text-[#8C8CA1]">No customer records matching search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((u) => (
            <UserCard
              key={u.id}
              user={u}
              onView={(user) => {
                setDrawerUser(user);
                setDrawerOpen(true);
              }}
              onToggleSuspend={handleToggleSuspend}
              onBan={handleBan}
            />
          ))}
        </div>
      )}

      <UserDrawer
        user={drawerUser}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setDrawerUser(null);
        }}
      />
    </div>
  );
}
