"use client";
import React, { useState, useMemo } from "react";
import {
  CreditCard,
  TrendingUp,
  Download,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Calendar,
  Zap,
  Shield,
  Star,
  ChevronDown,
  ArrowUpRight,
} from "lucide-react";
import { Card, Badge, Button, Modal } from "@food-mania/ui";
import {
  ADMIN_SUBSCRIPTIONS,
  AdminSubscription,
  SubscriptionPlan,
  SubscriptionStatus,
} from "@food-mania/shared";

// ─── Types ────────────────────────────────────────────────────────────────────

type PlanTab = "All" | SubscriptionPlan;
type StatusOption = "All" | SubscriptionStatus;

// ─── Constants ────────────────────────────────────────────────────────────────

const PLAN_TABS: { label: string; value: PlanTab; price?: string }[] = [
  { label: "All Plans", value: "All" },
  { label: "Basic", value: "Basic", price: "₹1,999" },
  { label: "Pro", value: "Pro", price: "₹4,999" },
  { label: "Enterprise", value: "Enterprise", price: "₹9,999" },
];

const STATUS_OPTIONS: { label: string; value: StatusOption }[] = [
  { label: "All Statuses", value: "All" },
  { label: "Active", value: "active" },
  { label: "Trial", value: "trial" },
  { label: "Expired", value: "expired" },
  { label: "Cancelled", value: "cancelled" },
];

const PRICING_PLANS = [
  {
    plan: "Basic" as SubscriptionPlan,
    price: "₹1,999",
    icon: Zap,
    color: "#6B7280",
    bgColor: "#F9FAFB",
    features: [
      "Up to 10 tables",
      "QR Menu (digital)",
      "Basic analytics",
      "Email support",
      "1 staff login",
    ],
  },
  {
    plan: "Pro" as SubscriptionPlan,
    price: "₹4,999",
    icon: Star,
    color: "#FF6B4A",
    bgColor: "#FFF4F1",
    features: [
      "Up to 30 tables",
      "QR Menu + Ordering",
      "Advanced analytics",
      "Priority support",
      "5 staff logins",
      "Custom branding",
      "Customer reviews",
    ],
    popular: true,
  },
  {
    plan: "Enterprise" as SubscriptionPlan,
    price: "₹9,999",
    icon: Shield,
    color: "#63B46C",
    bgColor: "#F0FAF1",
    features: [
      "Unlimited tables",
      "Full QR suite",
      "White-label reports",
      "Dedicated account mgr",
      "Unlimited staff logins",
      "API access",
      "Multi-branch support",
      "SLA guarantee",
    ],
  },
];

// ─── Helper Utilities ─────────────────────────────────────────────────────────

function formatCurrency(amount: number): string {
  return `\u20b9${amount.toLocaleString("en-IN")}`;
}

function formatDate(dateStr: string): string {
  if (dateStr === "N/A") return "N/A";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function daysUntil(dateStr: string): number {
  if (dateStr === "N/A") return Infinity;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function getPlanBadgeVariant(plan: SubscriptionPlan): "gray" | "orange" | "success" {
  if (plan === "Basic") return "gray";
  if (plan === "Pro") return "orange";
  return "success";
}

function getStatusBadgeVariant(
  status: SubscriptionStatus
): "success" | "danger" | "warning" | "gray" {
  switch (status) {
    case "active":
      return "success";
    case "expired":
      return "danger";
    case "trial":
      return "warning";
    case "cancelled":
      return "gray";
  }
}

function getStatusIcon(status: SubscriptionStatus) {
  switch (status) {
    case "active":
      return <CheckCircle2 size={12} />;
    case "expired":
      return <XCircle size={12} />;
    case "trial":
      return <RefreshCw size={12} />;
    case "cancelled":
      return <XCircle size={12} />;
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  color,
  icon: Icon,
}: {
  label: string;
  value: string;
  sub?: string;
  color: string;
  icon: React.ElementType;
}) {
  return (
    <Card className="flex-1 min-w-[180px]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-[#8C8CA1] font-medium mb-1">{label}</p>
          <p className="font-display font-bold text-2xl text-[#1A1A2E]">{value}</p>
          {sub && <p className="text-xs text-[#8C8CA1] mt-0.5">{sub}</p>}
        </div>
        <div
          className="w-10 h-10 rounded-[12px] flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${color}18` }}
        >
          <Icon size={20} style={{ color }} />
        </div>
      </div>
    </Card>
  );
}

function RenewalAlert({ sub }: { sub: AdminSubscription }) {
  const days = daysUntil(sub.nextRenewal);
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-[#FEF3C7] border border-[#F6B73C] rounded-[12px] text-sm">
      <AlertTriangle size={16} className="text-[#D97706] flex-shrink-0" />
      <span className="text-[#92400E] font-medium">
        <strong>{sub.restaurantName}</strong> — {sub.plan} subscription renews in{" "}
        <strong>{days} day{days !== 1 ? "s" : ""}</strong> ({formatDate(sub.nextRenewal)}). Monthly: {formatCurrency(sub.monthlyAmount)}.
      </span>
    </div>
  );
}

// ─── Plan Selector Modal ──────────────────────────────────────────────────────

function UpgradePlanModal({
  isOpen,
  sub,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  sub: AdminSubscription | null;
  onClose: () => void;
  onConfirm: (id: string, plan: SubscriptionPlan) => void;
}) {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

  React.useEffect(() => {
    if (sub) setSelectedPlan(sub.plan);
  }, [sub]);

  if (!sub) return null;

  const eligiblePlans = PRICING_PLANS.filter((p) => p.plan !== sub.plan);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upgrade Subscription Plan"
      description={`Change plan for ${sub.restaurantName}`}
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={!selectedPlan || selectedPlan === sub.plan}
            onClick={() => {
              if (selectedPlan) {
                onConfirm(sub.id, selectedPlan);
                onClose();
              }
            }}
          >
            Confirm Upgrade
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <p className="text-xs text-[#8C8CA1]">
          Current plan:{" "}
          <Badge variant={getPlanBadgeVariant(sub.plan)} size="sm">
            {sub.plan}
          </Badge>{" "}
          — {formatCurrency(sub.monthlyAmount)}/mo
        </p>
        <div className="grid gap-3">
          {eligiblePlans.map(({ plan, price, icon: Icon, color, bgColor, features }) => (
            <button
              key={plan}
              onClick={() => setSelectedPlan(plan)}
              className={`w-full text-left p-4 rounded-[14px] border-2 transition-all duration-150 ${
                selectedPlan === plan
                  ? "border-[#FF6B4A] bg-[#FFF4F1]"
                  : "border-[#ECECEC] hover:border-gray-300"
              }`}
              style={{ backgroundColor: selectedPlan === plan ? "#FFF4F1" : bgColor }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-[8px] flex items-center justify-center"
                    style={{ backgroundColor: `${color}22` }}
                  >
                    <Icon size={14} style={{ color }} />
                  </div>
                  <span className="font-display font-bold text-[#1A1A2E]">{plan}</span>
                </div>
                <span className="font-bold text-sm" style={{ color }}>
                  {price}/mo
                </span>
              </div>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
                {features.slice(0, 4).map((f) => (
                  <li key={f} className="flex items-center gap-1.5 text-xs text-[#5A5A7A]">
                    <CheckCircle2 size={10} style={{ color }} />
                    {f}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
}

// ─── Subscription Card ────────────────────────────────────────────────────────

function SubscriptionCard({
  sub,
  onUpgrade,
  onCancel,
  onInvoice,
}: {
  sub: AdminSubscription;
  onUpgrade: (sub: AdminSubscription) => void;
  onCancel: (sub: AdminSubscription) => void;
  onInvoice: (sub: AdminSubscription) => void;
}) {
  const renewalDays = daysUntil(sub.nextRenewal);
  const isExpiringSoon = renewalDays <= 14 && renewalDays >= 0 && sub.status === "active";

  return (
    <Card
      hoverable
      className={`transition-all duration-200 ${
        isExpiringSoon ? "border-[#F6B73C] ring-1 ring-[#F6B73C]/30" : ""
      }`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-[12px] bg-[#FF6B4A]/10 flex items-center justify-center flex-shrink-0">
            <CreditCard size={18} className="text-[#FF6B4A]" />
          </div>
          <div className="min-w-0">
            <p className="font-display font-bold text-[#1A1A2E] truncate">{sub.restaurantName}</p>
            <p className="text-xs text-[#8C8CA1] mt-0.5">ID: {sub.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Badge variant={getPlanBadgeVariant(sub.plan)} dot>
            {sub.plan}
          </Badge>
          <Badge variant={getStatusBadgeVariant(sub.status)} dot>
            <span className="flex items-center gap-1">
              {getStatusIcon(sub.status)}
              {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
            </span>
          </Badge>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-4 text-xs">
        <div>
          <p className="text-[#8C8CA1] mb-0.5">Start Date</p>
          <p className="font-semibold text-[#1A1A2E] flex items-center gap-1">
            <Calendar size={11} className="text-[#8C8CA1]" />
            {formatDate(sub.startDate)}
          </p>
        </div>
        <div>
          <p className="text-[#8C8CA1] mb-0.5">End Date</p>
          <p className="font-semibold text-[#1A1A2E] flex items-center gap-1">
            <Calendar size={11} className="text-[#8C8CA1]" />
            {formatDate(sub.endDate)}
          </p>
        </div>
        <div>
          <p className="text-[#8C8CA1] mb-0.5">Monthly Amount</p>
          <p className="font-bold text-[#FF6B4A]">{formatCurrency(sub.monthlyAmount)}</p>
        </div>
        <div>
          <p className="text-[#8C8CA1] mb-0.5">Next Renewal</p>
          <p
            className={`font-semibold flex items-center gap-1 ${
              isExpiringSoon ? "text-[#D97706]" : "text-[#1A1A2E]"
            }`}
          >
            {isExpiringSoon && <AlertTriangle size={11} />}
            {formatDate(sub.nextRenewal)}
          </p>
        </div>
      </div>

      {/* Expiring soon ribbon */}
      {isExpiringSoon && (
        <div className="flex items-center gap-1.5 px-3 py-2 bg-[#FEF3C7] rounded-[8px] mb-4 text-xs text-[#92400E] font-medium">
          <AlertTriangle size={12} className="text-[#D97706]" />
          Renewing in {renewalDays} day{renewalDays !== 1 ? "s" : ""}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-[#ECECEC]">
        <Button
          variant="secondary"
          size="sm"
          className="flex-1 text-xs"
          onClick={() => onUpgrade(sub)}
        >
          <ArrowUpRight size={13} />
          Upgrade Plan
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={() => onInvoice(sub)}
        >
          <Download size={13} />
          Invoice
        </Button>
        {sub.status !== "cancelled" && sub.status !== "expired" && (
          <Button
            variant="danger"
            size="sm"
            className="text-xs"
            onClick={() => onCancel(sub)}
          >
            <XCircle size={13} />
            Cancel
          </Button>
        )}
      </div>
    </Card>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<AdminSubscription[]>(ADMIN_SUBSCRIPTIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [planFilter, setPlanFilter] = useState<PlanTab>("All");
  const [statusFilter, setStatusFilter] = useState<StatusOption>("All");
  const [upgradeTarget, setUpgradeTarget] = useState<AdminSubscription | null>(null);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);

  React.useEffect(() => {
    fetch(`${API_BASE_URL}/admin/subscriptions`)
      .then((res) => res.json())
      .then((json) => {
        const dbSubs = json.data || json;
        if (Array.isArray(dbSubs) && dbSubs.length > 0) {
          const mapped: AdminSubscription[] = dbSubs.map((s: any) => ({
            id: s.id,
            restaurantId: s.restaurantId,
            restaurantName: s.restaurantName || "The Urban Cafe",
            plan: (s.plan?.charAt(0).toUpperCase() + s.plan?.slice(1).toLowerCase() === "Basic" ? "Basic" : s.plan?.toUpperCase() === "ENTERPRISE" ? "Enterprise" : "Pro") as SubscriptionPlan,
            status: (s.status?.toLowerCase() || "active") as SubscriptionStatus,
            startDate: s.startDate ? new Date(s.startDate).toISOString().split("T")[0]! : "2026-01-01",
            endDate: s.endDate ? new Date(s.endDate).toISOString().split("T")[0]! : "2026-12-31",
            nextRenewal: s.endDate ? new Date(s.endDate).toISOString().split("T")[0]! : "2026-09-01",
            monthlyAmount: s.monthlyAmount || 4999,
            paidAmount: s.paidAmount || s.monthlyAmount || 4999,
            paymentMethod: "Card Ending in 4242",
            autoRenew: true,
          }));
          setSubscriptions(mapped);
        }
      })
      .catch((err) => console.warn("Subscriptions fetch warning:", err));
  }, []);

  // ─── Derived stats ───────────────────────────────────────────────────────

  const stats = useMemo(() => {
    const active = subscriptions.filter((s) => s.status === "active").length;
    const trial = subscriptions.filter((s) => s.status === "trial").length;
    const expiringSoon = subscriptions.filter(
      (s) => s.status === "active" && daysUntil(s.nextRenewal) <= 14
    ).length;
    const monthlyRevenue = subscriptions
      .filter((s) => s.status === "active")
      .reduce((sum, s) => sum + s.monthlyAmount, 0);
    return { active, trial, expiringSoon, monthlyRevenue };
  }, [subscriptions]);

  // ─── Filtered list ───────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    return subscriptions.filter((s) => {
      const matchPlan = planFilter === "All" || s.plan === planFilter;
      const matchStatus = statusFilter === "All" || s.status === statusFilter;
      return matchPlan && matchStatus;
    });
  }, [subscriptions, planFilter, statusFilter]);

  // ─── Renewal alerts (expiring <= 14 days, active only) ──────────────────

  const renewalAlerts = useMemo(
    () =>
      subscriptions.filter(
        (s) => s.status === "active" && daysUntil(s.nextRenewal) <= 14 && daysUntil(s.nextRenewal) >= 0
      ),
    [subscriptions]
  );

  // ─── Handlers ────────────────────────────────────────────────────────────

  function handleUpgradeOpen(sub: AdminSubscription) {
    setUpgradeTarget(sub);
    setIsUpgradeOpen(true);
  }

  function handleUpgradeConfirm(id: string, plan: SubscriptionPlan) {
    const PLAN_PRICES: Record<SubscriptionPlan, number> = {
      Basic: 1999,
      Pro: 4999,
      Enterprise: 9999,
    };
    setSubscriptions((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, plan, monthlyAmount: PLAN_PRICES[plan] } : s
      )
    );
  }

  function handleCancel(sub: AdminSubscription) {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === sub.id ? { ...s, status: "cancelled" as SubscriptionStatus } : s))
    );
  }

  function handleInvoice(sub: AdminSubscription) {
    // Invoice download action
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#FAF9F5]">
      <div className="space-y-6 p-1">
        {/* Page Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display font-bold text-2xl text-[#1A1A2E]">
              Subscription Management
            </h1>
            <p className="text-sm text-[#8C8CA1] mt-0.5">
              Monitor plans, renewals, and billing across all restaurant tenants.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Export subscription report
            }}
          >
            <Download size={14} />
            Export
          </Button>

        </div>

        {/* Renewal Alerts */}
        {renewalAlerts.length > 0 && (
          <div className="space-y-2">
            {renewalAlerts.map((sub) => (
              <RenewalAlert key={sub.id} sub={sub} />
            ))}
          </div>
        )}

        {/* Stats Row */}
        <div className="flex flex-wrap gap-4">
          <StatCard
            label="Total Active"
            value={String(stats.active)}
            sub="Paid subscriptions"
            color="#63B46C"
            icon={CheckCircle2}
          />
          <StatCard
            label="Expiring Soon"
            value={String(stats.expiringSoon)}
            sub="Within 14 days"
            color="#F6B73C"
            icon={AlertTriangle}
          />
          <StatCard
            label="On Trial"
            value={String(stats.trial)}
            sub="Free trial period"
            color="#6B7280"
            icon={RefreshCw}
          />
          <StatCard
            label="Monthly Revenue"
            value={formatCurrency(stats.monthlyRevenue)}
            sub="From active plans"
            color="#FF6B4A"
            icon={TrendingUp}
          />
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Plan Tabs */}
          <div className="flex items-center gap-1 bg-white border border-[#ECECEC] rounded-[14px] p-1">
            {PLAN_TABS.map(({ label, value, price }) => (
              <button
                key={value}
                onClick={() => setPlanFilter(value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-xs font-semibold transition-all duration-150 ${
                  planFilter === value
                    ? "bg-[#FF6B4A] text-white shadow-sm"
                    : "text-[#5A5A7A] hover:bg-[#FAF9F5]"
                }`}
              >
                {label}
                {price && (
                  <span
                    className={`text-[10px] ${
                      planFilter === value ? "opacity-80" : "text-[#8C8CA1]"
                    }`}
                  >
                    {price}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Status dropdown */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusOption)}
              className="appearance-none bg-white border border-[#ECECEC] rounded-[12px] px-4 py-2 pr-8 text-xs font-semibold text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/30 cursor-pointer"
            >
              {STATUS_OPTIONS.map(({ label, value }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={13}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C8CA1] pointer-events-none"
            />
          </div>

          <span className="text-xs text-[#8C8CA1] ml-auto">
            {filtered.length} subscription{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Subscription Grid */}
        {filtered.length === 0 ? (
          <Card className="py-16 text-center">
            <CreditCard size={40} className="text-[#ECECEC] mx-auto mb-3" />
            <p className="font-display font-bold text-[#1A1A2E]">No subscriptions found</p>
            <p className="text-xs text-[#8C8CA1] mt-1">
              Try adjusting your plan or status filter.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((sub) => (
              <SubscriptionCard
                key={sub.id}
                sub={sub}
                onUpgrade={handleUpgradeOpen}
                onCancel={handleCancel}
                onInvoice={handleInvoice}
              />
            ))}
          </div>
        )}

        {/* Pricing Plans Section */}
        <div className="mt-4">
          <div className="mb-4">
            <h2 className="font-display font-bold text-xl text-[#1A1A2E]">Pricing Plans</h2>
            <p className="text-xs text-[#8C8CA1] mt-0.5">
              Available subscription tiers for restaurant partners.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PRICING_PLANS.map(({ plan, price, icon: Icon, color, bgColor, features, popular }) => (
              <div
                key={plan}
                className={`relative rounded-[24px] border-2 p-6 transition-all duration-200 ${
                  popular
                    ? "border-[#FF6B4A] shadow-[0_8px_32px_rgba(255,107,74,0.15)]"
                    : "border-[#ECECEC] hover:border-gray-300 hover:shadow-md"
                }`}
                style={{ backgroundColor: bgColor }}
              >
                {popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-[#FF6B4A] text-white text-[10px] font-bold px-3 py-1 rounded-full">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                <div
                  className="w-10 h-10 rounded-[12px] flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${color}20` }}
                >
                  <Icon size={20} style={{ color }} />
                </div>
                <h3 className="font-display font-bold text-lg text-[#1A1A2E]">{plan}</h3>
                <p className="font-bold text-2xl mt-1" style={{ color }}>
                  {price}
                  <span className="text-sm font-medium text-[#8C8CA1]">/mo</span>
                </p>
                <ul className="space-y-2 mt-4">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-[#5A5A7A]">
                      <CheckCircle2 size={12} style={{ color }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-4 border-t border-[#ECECEC]">
                  <p className="text-xs text-[#8C8CA1]">
                    {subscriptions.filter((s) => s.plan === plan && s.status === "active").length}{" "}
                    active restaurant{subscriptions.filter((s) => s.plan === plan && s.status === "active").length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      <UpgradePlanModal
        isOpen={isUpgradeOpen}
        sub={upgradeTarget}
        onClose={() => {
          setIsUpgradeOpen(false);
          setUpgradeTarget(null);
        }}
        onConfirm={handleUpgradeConfirm}
      />
    </div>
  );
}
