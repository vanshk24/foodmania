"use client";
import React, { useState } from "react";
import {
  Settings, Shield, Bell, CreditCard, Package, Zap,
  Globe, Key, Server, Eye, EyeOff, Save, ChevronRight,
  Palette, Mail, Smartphone, Database, RefreshCw, Lock,
  CheckCircle2, AlertTriangle, Users, Sliders
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

interface PlatformConfig {
  name: string;
  supportEmail: string;
  supportPhone: string;
  logoUrl: string;
  primaryColor: string;
  accentColor: string;
  maintenanceMode: boolean;
  newRegistrations: boolean;
  qrOrdering: boolean;
  tableBooking: boolean;
  loyaltyProgram: boolean;
  pushNotifications: boolean;
}

interface FinancialConfig {
  commissionPercent: number;
  gstPercent: number;
  paymentGateway: "Razorpay" | "Stripe" | "PayU";
  settlementCycle: "Daily" | "Weekly" | "Monthly";
  minSettlementAmount: number;
}

interface AuditLog {
  id: string;
  admin: string;
  action: string;
  module: string;
  timestamp: string;
  result: "success" | "warning";
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const INITIAL_PLATFORM: PlatformConfig = {
  name: "Food Mania",
  supportEmail: "support@foodmania.in",
  supportPhone: "+91 1800-FOOD-MNI",
  logoUrl: "",
  primaryColor: "#FF6B4A",
  accentColor: "#63B46C",
  maintenanceMode: false,
  newRegistrations: true,
  qrOrdering: true,
  tableBooking: true,
  loyaltyProgram: true,
  pushNotifications: true,
};

const INITIAL_FINANCIAL: FinancialConfig = {
  commissionPercent: 10,
  gstPercent: 18,
  paymentGateway: "Razorpay",
  settlementCycle: "Daily",
  minSettlementAmount: 500,
};

const AUDIT_LOGS: AuditLog[] = [
  {
    id: "a-1",
    admin: "SuperAdmin",
    action: "Updated commission rate to 10%",
    module: "Financial",
    timestamp: "2026-08-04 17:30:00",
    result: "success",
  },
  {
    id: "a-2",
    admin: "SuperAdmin",
    action: "Suspended restaurant: Italian Corner",
    module: "Restaurants",
    timestamp: "2026-08-04 16:15:00",
    result: "success",
  },
  {
    id: "a-3",
    admin: "Agent Meera",
    action: "Resolved ticket TKT-4002",
    module: "Support",
    timestamp: "2026-08-04 14:45:00",
    result: "success",
  },
  {
    id: "a-4",
    admin: "SuperAdmin",
    action: "Maintenance mode toggle — FAILED",
    module: "Platform",
    timestamp: "2026-08-03 10:00:00",
    result: "warning",
  },
];

type SettingTab = "platform" | "financial" | "notifications" | "security" | "api" | "audit";

const TABS: { id: SettingTab; label: string; icon: React.ElementType }[] = [
  { id: "platform", label: "Platform", icon: Globe },
  { id: "financial", label: "Financial", icon: CreditCard },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "api", label: "API & Keys", icon: Key },
  { id: "audit", label: "Audit Logs", icon: Database },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#ECECEC] last:border-0">
      <div>
        <p className="text-sm font-semibold text-[#222222]">{label}</p>
        {description && <p className="text-xs text-[#8C8CA1] mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
          checked ? "bg-[#63B46C]" : "bg-[#DEDEDE]"
        }`}
        aria-label={label}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

function SettingField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-semibold text-[#8C8CA1] uppercase tracking-wide mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 rounded-[12px] border border-[#ECECEC] bg-[#FAF9F5] text-[#222222] text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/30 focus:border-[#FF6B4A] transition"
      />
    </div>
  );
}

function SaveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-5 py-2.5 bg-[#FF6B4A] text-white text-sm font-semibold rounded-[12px] hover:bg-[#e5592e] transition-all shadow-sm mt-4"
    >
      <Save size={15} />
      Save Changes
    </button>
  );
}

// ─── Tab Panels ───────────────────────────────────────────────────────────────

function PlatformTab({
  config,
  setConfig,
}: {
  config: PlatformConfig;
  setConfig: (c: PlatformConfig) => void;
}) {
  const [saved, setSaved] = useState(false);
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  return (
    <div>
      <h3 className="font-bold text-[#222222] mb-4">Platform Configuration</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        <SettingField
          label="Platform Name"
          value={config.name}
          onChange={(v) => setConfig({ ...config, name: v })}
        />
        <SettingField
          label="Support Email"
          value={config.supportEmail}
          onChange={(v) => setConfig({ ...config, supportEmail: v })}
          type="email"
        />
        <SettingField
          label="Support Phone"
          value={config.supportPhone}
          onChange={(v) => setConfig({ ...config, supportPhone: v })}
        />
        <SettingField
          label="Brand Primary Color"
          value={config.primaryColor}
          onChange={(v) => setConfig({ ...config, primaryColor: v })}
        />
      </div>

      <h4 className="font-semibold text-[#222222] text-sm mt-4 mb-2">Feature Flags</h4>
      <div className="bg-[#FAF9F5] rounded-[16px] border border-[#ECECEC] px-4">
        <Toggle
          checked={config.maintenanceMode}
          onChange={(v) => setConfig({ ...config, maintenanceMode: v })}
          label="Maintenance Mode"
          description="Disables all customer-facing pages"
        />
        <Toggle
          checked={config.newRegistrations}
          onChange={(v) => setConfig({ ...config, newRegistrations: v })}
          label="New Restaurant Registrations"
          description="Allow new restaurants to sign up"
        />
        <Toggle
          checked={config.qrOrdering}
          onChange={(v) => setConfig({ ...config, qrOrdering: v })}
          label="QR Ordering System"
          description="Enable smart QR table ordering"
        />
        <Toggle
          checked={config.tableBooking}
          onChange={(v) => setConfig({ ...config, tableBooking: v })}
          label="Table Booking System"
          description="Enable advance table reservations"
        />
        <Toggle
          checked={config.loyaltyProgram}
          onChange={(v) => setConfig({ ...config, loyaltyProgram: v })}
          label="Loyalty Program"
          description="Customer points & rewards system"
        />
      </div>

      {config.maintenanceMode && (
        <div className="mt-4 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-[12px] px-4 py-3">
          <AlertTriangle size={16} className="text-amber-600 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-700 font-medium">
            Maintenance mode is ON. All customer-facing pages are currently disabled.
          </p>
        </div>
      )}

      <SaveButton onClick={handleSave} />
      {saved && (
        <p className="mt-2 flex items-center gap-1 text-xs text-[#63B46C] font-semibold">
          <CheckCircle2 size={14} /> Platform settings saved successfully
        </p>
      )}
    </div>
  );
}

function FinancialTab({
  config,
  setConfig,
}: {
  config: FinancialConfig;
  setConfig: (c: FinancialConfig) => void;
}) {
  const [saved, setSaved] = useState(false);
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  return (
    <div>
      <h3 className="font-bold text-[#222222] mb-4">Financial Configuration</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        <SettingField
          label="Platform Commission %"
          value={config.commissionPercent}
          onChange={(v) => setConfig({ ...config, commissionPercent: Number(v) })}
          type="number"
        />
        <SettingField
          label="GST %"
          value={config.gstPercent}
          onChange={(v) => setConfig({ ...config, gstPercent: Number(v) })}
          type="number"
        />
        <SettingField
          label="Minimum Settlement Amount (₹)"
          value={config.minSettlementAmount}
          onChange={(v) => setConfig({ ...config, minSettlementAmount: Number(v) })}
          type="number"
        />
      </div>

      <div className="mb-4">
        <label className="block text-xs font-semibold text-[#8C8CA1] uppercase tracking-wide mb-2">
          Payment Gateway
        </label>
        <div className="flex gap-2 flex-wrap">
          {(["Razorpay", "Stripe", "PayU"] as const).map((g) => (
            <button
              key={g}
              onClick={() => setConfig({ ...config, paymentGateway: g })}
              className={`px-4 py-2 rounded-[12px] text-sm font-semibold border transition ${
                config.paymentGateway === g
                  ? "bg-[#FF6B4A] text-white border-[#FF6B4A]"
                  : "bg-white text-[#222222] border-[#ECECEC] hover:border-[#FF6B4A]"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-semibold text-[#8C8CA1] uppercase tracking-wide mb-2">
          Settlement Cycle
        </label>
        <div className="flex gap-2">
          {(["Daily", "Weekly", "Monthly"] as const).map((c) => (
            <button
              key={c}
              onClick={() => setConfig({ ...config, settlementCycle: c })}
              className={`px-4 py-2 rounded-[12px] text-sm font-semibold border transition ${
                config.settlementCycle === c
                  ? "bg-[#63B46C] text-white border-[#63B46C]"
                  : "bg-white text-[#222222] border-[#ECECEC] hover:border-[#63B46C]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 bg-[#FAF9F5] border border-[#ECECEC] rounded-[16px] p-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-xs text-[#8C8CA1]">Commission Revenue (Today)</p>
          <p className="text-xl font-bold text-[#FF6B4A]">₹18,960</p>
        </div>
        <div>
          <p className="text-xs text-[#8C8CA1]">GST Collected (Today)</p>
          <p className="text-xl font-bold text-[#63B46C]">₹34,128</p>
        </div>
        <div>
          <p className="text-xs text-[#8C8CA1]">Pending Settlements</p>
          <p className="text-xl font-bold text-[#F6B73C]">₹1,24,500</p>
        </div>
      </div>

      <SaveButton onClick={handleSave} />
      {saved && (
        <p className="mt-2 flex items-center gap-1 text-xs text-[#63B46C] font-semibold">
          <CheckCircle2 size={14} /> Financial settings saved
        </p>
      )}
    </div>
  );
}

function NotificationsTab() {
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [newOrder, setNewOrder] = useState(true);
  const [newBooking, setNewBooking] = useState(true);
  const [newRestaurant, setNewRestaurant] = useState(true);
  const [paymentAlert, setPaymentAlert] = useState(true);
  const [saved, setSaved] = useState(false);

  return (
    <div>
      <h3 className="font-bold text-[#222222] mb-4">Notification Channels</h3>
      <div className="bg-[#FAF9F5] rounded-[16px] border border-[#ECECEC] px-4 mb-6">
        <Toggle checked={emailEnabled} onChange={setEmailEnabled} label="Email Notifications" description="Send via SMTP / SendGrid" />
        <Toggle checked={smsEnabled} onChange={setSmsEnabled} label="SMS Notifications" description="Send via Twilio / MSG91" />
        <Toggle checked={pushEnabled} onChange={setPushEnabled} label="Push Notifications" description="Firebase Cloud Messaging" />
      </div>

      <h4 className="font-semibold text-[#222222] text-sm mb-2">Admin Alert Triggers</h4>
      <div className="bg-[#FAF9F5] rounded-[16px] border border-[#ECECEC] px-4">
        <Toggle checked={newOrder} onChange={setNewOrder} label="New Order Placed" />
        <Toggle checked={newBooking} onChange={setNewBooking} label="New Table Booking" />
        <Toggle checked={newRestaurant} onChange={setNewRestaurant} label="New Restaurant Registration" />
        <Toggle checked={paymentAlert} onChange={setPaymentAlert} label="Payment Failed Alert" />
      </div>
      <SaveButton onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }} />
      {saved && <p className="mt-2 flex items-center gap-1 text-xs text-[#63B46C] font-semibold"><CheckCircle2 size={14} /> Saved</p>}
    </div>
  );
}

function SecurityTab() {
  const [show2FA, setShow2FA] = useState(false);
  const [showIpWhitelist, setShowIpWhitelist] = useState(false);
  const [twoFA, setTwoFA] = useState(true);
  const [ipWhitelist, setIpWhitelist] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [saved, setSaved] = useState(false);

  const roles = [
    { role: "Super Admin", count: 1, permissions: "All" },
    { role: "Admin", count: 3, permissions: "All except Settings" },
    { role: "Support Agent", count: 8, permissions: "Support, Reports (read)" },
    { role: "Finance Manager", count: 2, permissions: "Payments, Reports" },
  ];

  return (
    <div>
      <h3 className="font-bold text-[#222222] mb-4">Security Settings</h3>
      <div className="bg-[#FAF9F5] rounded-[16px] border border-[#ECECEC] px-4 mb-6">
        <Toggle checked={twoFA} onChange={setTwoFA} label="Two-Factor Authentication (2FA)" description="Require OTP for all admin logins" />
        <Toggle checked={ipWhitelist} onChange={setIpWhitelist} label="IP Whitelist" description="Restrict access to specific IPs" />
      </div>

      <SettingField label="Session Timeout (minutes)" value={sessionTimeout} onChange={setSessionTimeout} type="number" />

      <h4 className="font-semibold text-[#222222] text-sm mt-4 mb-2">Roles & Permissions</h4>
      <div className="space-y-2">
        {roles.map((r) => (
          <div key={r.role} className="flex items-center justify-between bg-white border border-[#ECECEC] rounded-[14px] px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#FF6B4A]/10 flex items-center justify-center">
                <Users size={14} className="text-[#FF6B4A]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#222222]">{r.role}</p>
                <p className="text-xs text-[#8C8CA1]">{r.permissions}</p>
              </div>
            </div>
            <span className="text-xs bg-[#FAF9F5] border border-[#ECECEC] px-2 py-1 rounded-full text-[#8C8CA1]">{r.count} users</span>
          </div>
        ))}
      </div>
      <SaveButton onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }} />
      {saved && <p className="mt-2 flex items-center gap-1 text-xs text-[#63B46C] font-semibold"><CheckCircle2 size={14} /> Saved</p>}
    </div>
  );
}

function ApiTab() {
  const [showKey, setShowKey] = useState(false);
  const apiKey = "fm_live_sk_xxxxxxxxx9a2b3c4d5e6f7";
  const masked = "fm_live_sk_***********************";

  const integrations = [
    { name: "Razorpay", key: "rzp_live_***", status: "Connected" },
    { name: "MSG91 SMS", key: "msg91_***", status: "Connected" },
    { name: "SendGrid Email", key: "SG.***", status: "Connected" },
    { name: "Firebase FCM", key: "AAAA:***", status: "Connected" },
    { name: "AWS S3 Storage", key: "AKIA***", status: "Not Configured" },
    { name: "Cloudflare CDN", key: "—", status: "Not Configured" },
  ];

  return (
    <div>
      <h3 className="font-bold text-[#222222] mb-4">API Keys & Integrations</h3>

      <div className="bg-[#1A1A2E] rounded-[16px] p-4 mb-6">
        <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Platform Master API Key</p>
        <div className="flex items-center gap-2">
          <code className="text-[#FF6B4A] font-mono text-sm flex-1">
            {showKey ? apiKey : masked}
          </code>
          <button
            onClick={() => setShowKey(!showKey)}
            className="text-gray-400 hover:text-white transition"
          >
            {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          <button
            onClick={() => navigator.clipboard.writeText(apiKey).catch(() => {})}
            className="text-gray-400 hover:text-white transition"
          >
            <RefreshCw size={14} />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">Keep this key secret. Rotate if compromised.</p>
      </div>

      <h4 className="font-semibold text-[#222222] text-sm mb-2">Connected Integrations</h4>
      <div className="space-y-2">
        {integrations.map((i) => (
          <div key={i.name} className="flex items-center justify-between bg-white border border-[#ECECEC] rounded-[14px] px-4 py-3">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${i.status === "Connected" ? "bg-[#63B46C]" : "bg-[#DEDEDE]"}`} />
              <div>
                <p className="text-sm font-semibold text-[#222222]">{i.name}</p>
                <p className="text-xs text-[#8C8CA1] font-mono">{i.key}</p>
              </div>
            </div>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${i.status === "Connected" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-400"}`}>
              {i.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AuditTab() {
  return (
    <div>
      <h3 className="font-bold text-[#222222] mb-4">Audit Logs</h3>
      <div className="space-y-2">
        {AUDIT_LOGS.map((log) => (
          <div key={log.id} className="flex items-start gap-3 bg-white border border-[#ECECEC] rounded-[14px] px-4 py-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${log.result === "success" ? "bg-green-50" : "bg-amber-50"}`}>
              {log.result === "success"
                ? <CheckCircle2 size={14} className="text-green-600" />
                : <AlertTriangle size={14} className="text-amber-600" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[#222222]">{log.action}</p>
              <p className="text-xs text-[#8C8CA1] mt-0.5">{log.admin} · {log.module} · {log.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => {
          // Export audit logs action
        }}
        className="mt-4 flex items-center gap-2 px-4 py-2 text-sm text-[#FF6B4A] border border-[#FF6B4A] rounded-[12px] hover:bg-[#FF6B4A]/5 transition font-semibold"
      >
        <Database size={14} />
        Export Audit Logs
      </button>

    </div>
  );
}

// ─── Main Settings Page ───────────────────────────────────────────────────────

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingTab>("platform");
  const [platform, setPlatform] = useState<PlatformConfig>(INITIAL_PLATFORM);
  const [financial, setFinancial] = useState<FinancialConfig>(INITIAL_FINANCIAL);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl text-[#222222] flex items-center gap-2">
          <Settings size={24} className="text-[#FF6B4A]" />
          Platform Settings
        </h1>
        <p className="text-sm text-[#8C8CA1] mt-1">
          Global configuration for the Food Mania platform
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-[#FAF9F5] border border-[#ECECEC] rounded-[16px] p-1 overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-[12px] text-sm font-semibold whitespace-nowrap transition-all ${
                active
                  ? "bg-white text-[#FF6B4A] shadow-sm border border-[#ECECEC]"
                  : "text-[#8C8CA1] hover:text-[#222222]"
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-[24px] border border-[#ECECEC] shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-6">
        {activeTab === "platform" && (
          <PlatformTab config={platform} setConfig={setPlatform} />
        )}
        {activeTab === "financial" && (
          <FinancialTab config={financial} setConfig={setFinancial} />
        )}
        {activeTab === "notifications" && <NotificationsTab />}
        {activeTab === "security" && <SecurityTab />}
        {activeTab === "api" && <ApiTab />}
        {activeTab === "audit" && <AuditTab />}
      </div>
    </div>
  );
}
