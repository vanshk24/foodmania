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
  ChevronDown,
  Banknote,
  Percent,
  Clock,
  ReceiptText,
} from "lucide-react";
import { Card, Badge, Button, Modal } from "@food-mania/ui";
import {
  ADMIN_PAYMENTS,
  AdminPaymentTxn,
  PaymentStatus,
} from "@food-mania/shared";

// ─── Types ────────────────────────────────────────────────────────────────────

type MethodFilter = "All" | AdminPaymentTxn["method"];
type StatusFilter = "All" | PaymentStatus;

// ─── Constants ────────────────────────────────────────────────────────────────

const METHOD_PILLS: { label: string; value: MethodFilter }[] = [
  { label: "All", value: "All" },
  { label: "UPI", value: "UPI" },
  { label: "Card", value: "Card" },
  { label: "Cash", value: "Cash" },
  { label: "Wallet", value: "Wallet" },
];

const STATUS_OPTIONS: { label: string; value: StatusFilter }[] = [
  { label: "All Statuses", value: "All" },
  { label: "Success", value: "success" },
  { label: "Failed", value: "failed" },
  { label: "Refunded", value: "refunded" },
  { label: "Pending", value: "pending" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(amount: number): string {
  return `\u20b9${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function getMethodBadgeVariant(method: AdminPaymentTxn["method"]): "info" | "success" | "gray" | "warning" {
  switch (method) {
    case "UPI":
      return "info";
    case "Card":
      return "success";
    case "Cash":
      return "gray";
    case "Wallet":
      return "warning";
  }
}

function getStatusBadgeVariant(status: PaymentStatus): "success" | "danger" | "warning" | "gray" {
  switch (status) {
    case "success":
      return "success";
    case "failed":
      return "danger";
    case "refunded":
      return "warning";
    case "pending":
      return "gray";
  }
}

function getStatusIcon(status: PaymentStatus) {
  switch (status) {
    case "success":
      return <CheckCircle2 size={12} />;
    case "failed":
      return <XCircle size={12} />;
    case "refunded":
      return <RefreshCw size={12} />;
    case "pending":
      return <Clock size={12} />;
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MetricCard({
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
    <Card className="flex-1 min-w-[200px]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-[#8C8CA1] font-medium mb-1">{label}</p>
          <p className="font-display font-bold text-xl text-[#1A1A2E] leading-tight">{value}</p>
          {sub && <p className="text-[10px] text-[#8C8CA1] mt-0.5">{sub}</p>}
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

// ─── Refund Approval Modal ────────────────────────────────────────────────────

function RefundModal({
  isOpen,
  txn,
  onClose,
  onApprove,
}: {
  isOpen: boolean;
  txn: AdminPaymentTxn | null;
  onClose: () => void;
  onApprove: (id: string) => void;
}) {
  if (!txn) return null;
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Refund Management"
      description={`Transaction ${txn.id}`}
      maxWidth="sm"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              onApprove(txn.id);
              onClose();
            }}
          >
            <RefreshCw size={13} />
            Acknowledge (Not Processed)
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="bg-[#FFF4F1] rounded-[12px] p-4 text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-[#8C8CA1]">Restaurant</span>
            <span className="font-semibold text-[#1A1A2E]">{txn.restaurantName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8C8CA1]">Customer</span>
            <span className="font-semibold text-[#1A1A2E]">{txn.customerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8C8CA1]">Amount</span>
            <span className="font-bold text-[#FF6B4A]">{formatCurrency(txn.amount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8C8CA1]">Method</span>
            <Badge variant={getMethodBadgeVariant(txn.method)} size="sm">
              {txn.method}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8C8CA1]">Date</span>
            <span className="font-semibold text-[#1A1A2E]">{formatDate(txn.date)}</span>
          </div>
        </div>
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-[10px] text-xs text-amber-800 space-y-1">
          <div className="font-bold">⚠️ Gateway Integration Pending (Phase 6.2)</div>
          <p>
            Automated bank/UPI refund processing requires live Razorpay gateway integration. In Phase 6.1 foundation, automated payouts and gateway refund reversals are not yet executed.
          </p>
        </div>
      </div>
    </Modal>
  );
}

// ─── Transaction Row ──────────────────────────────────────────────────────────

function TransactionRow({
  txn,
  onRefund,
}: {
  txn: AdminPaymentTxn;
  onRefund: (txn: AdminPaymentTxn) => void;
}) {
  return (
    <tr className="border-b border-[#ECECEC] hover:bg-[#FAF9F5] transition-colors group">
      {/* TXN ID */}
      <td className="px-4 py-3 text-xs font-mono text-[#5A5A7A] whitespace-nowrap">
        {txn.id}
      </td>
      {/* Restaurant */}
      <td className="px-4 py-3">
        <p className="text-xs font-semibold text-[#1A1A2E] whitespace-nowrap">{txn.restaurantName}</p>
      </td>
      {/* Customer */}
      <td className="px-4 py-3">
        <p className="text-xs text-[#5A5A7A] whitespace-nowrap">{txn.customerName}</p>
      </td>
      {/* Amount */}
      <td className="px-4 py-3 text-right">
        <p className="text-xs font-bold text-[#1A1A2E] whitespace-nowrap">
          {formatCurrency(txn.amount)}
        </p>
      </td>
      {/* Commission */}
      <td className="px-4 py-3 text-right">
        <p className="text-xs font-semibold text-[#FF6B4A] whitespace-nowrap">
          {formatCurrency(txn.commission)}
        </p>
      </td>
      {/* GST */}
      <td className="px-4 py-3 text-right">
        <p className="text-xs text-[#63B46C] font-semibold whitespace-nowrap">
          {formatCurrency(txn.gst)}
        </p>
      </td>
      {/* Net Settlement */}
      <td className="px-4 py-3 text-right">
        <p className="text-xs font-bold text-[#1A1A2E] whitespace-nowrap">
          {formatCurrency(txn.netSettlement)}
        </p>
      </td>
      {/* Method */}
      <td className="px-4 py-3">
        <Badge variant={getMethodBadgeVariant(txn.method)} size="sm">
          {txn.method}
        </Badge>
      </td>
      {/* Status */}
      <td className="px-4 py-3">
        <Badge variant={getStatusBadgeVariant(txn.status)} size="sm" dot>
          <span className="flex items-center gap-1">
            {getStatusIcon(txn.status)}
            {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
          </span>
        </Badge>
      </td>
      {/* Date */}
      <td className="px-4 py-3 text-xs text-[#8C8CA1] whitespace-nowrap">
        {formatDate(txn.date)}
      </td>
      {/* Actions */}
      <td className="px-4 py-3">
        {txn.status === "refunded" && (
          <Button
            variant="outline"
            size="sm"
            className="text-[10px] whitespace-nowrap"
            onClick={() => onRefund(txn)}
          >
            <RefreshCw size={11} />
            Approve Refund
          </Button>
        )}
      </td>
    </tr>
  );
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function AdminPaymentsPage() {
  const [transactions, setTransactions] = useState<AdminPaymentTxn[]>(ADMIN_PAYMENTS);

  React.useEffect(() => {
    fetch(`${API_BASE_URL}/orders`)
      .then((res) => res.json())
      .then((json) => {
        const dbOrders = json.data || json;
        if (Array.isArray(dbOrders) && dbOrders.length > 0) {
          const mapped: AdminPaymentTxn[] = dbOrders.map((o: any, idx: number) => ({
            id: `TXN-${o.orderNumber || o.id.slice(0, 6)}`,
            restaurantName: o.restaurantId === "the-urban-cafe" ? "The Urban Cafe" : "Burger Hub",
            customerName: "Gaurav Sharma",
            amount: o.totalAmount,
            platformFee: Number((o.totalAmount * 0.05).toFixed(2)),
            commission: Number((o.totalAmount * 0.05).toFixed(2)),
            gst: Number((o.totalAmount * 0.18).toFixed(2)),
            netSettlement: Number((o.totalAmount * 0.95).toFixed(2)),
            method: idx % 2 === 0 ? "UPI" : "Card",
            status: o.paymentStatus?.toLowerCase() === "paid" ? "success" : "pending",
            date: o.createdAt,
            orderId: o.orderNumber || o.id,
          }));
          setTransactions(mapped);

        }
      })
      .catch((err) => console.warn("Backend orders fetch error in Admin Payments:", err));
  }, []);

  const [methodFilter, setMethodFilter] = useState<MethodFilter>("All");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [refundTarget, setRefundTarget] = useState<AdminPaymentTxn | null>(null);

  const [isRefundOpen, setIsRefundOpen] = useState(false);

  // ─── Aggregated metrics ──────────────────────────────────────────────────

  const metrics = useMemo(() => {
    const totalRevenue = transactions.reduce((s, t) => s + t.amount, 0);
    const totalCommission = transactions.reduce((s, t) => s + t.commission, 0);
    const totalGst = transactions.reduce((s, t) => s + t.gst, 0);
    const pendingSettlement = transactions
      .filter((t) => t.status === "pending")
      .reduce((s, t) => s + t.netSettlement, 0);
    return { totalRevenue, totalCommission, totalGst, pendingSettlement };
  }, [transactions]);

  // ─── Filtered transactions ───────────────────────────────────────────────

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchMethod = methodFilter === "All" || t.method === methodFilter;
      const matchStatus = statusFilter === "All" || t.status === statusFilter;
      return matchMethod && matchStatus;
    });
  }, [transactions, methodFilter, statusFilter]);

  // ─── Handlers ────────────────────────────────────────────────────────────

  function handleRefundOpen(txn: AdminPaymentTxn) {
    setRefundTarget(txn);
    setIsRefundOpen(true);
  }

  function handleRefundApprove(id: string) {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "success" as PaymentStatus } : t))
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#FAF9F5]">
      <div className="space-y-6 p-1">
        {/* Page Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display font-bold text-2xl text-[#1A1A2E]">
              Platform Financial Control
            </h1>
            <p className="text-sm text-[#8C8CA1] mt-0.5">
              Monitor all transactions, commissions, GST, and settlement activity.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Statements export action
            }}
          >
            <Download size={14} />
            Export Statements
          </Button>

        </div>

        {/* Metric Cards */}
        <div className="flex flex-wrap gap-4">
          <MetricCard
            label="Total Platform Revenue"
            value={formatCurrency(metrics.totalRevenue)}
            sub="Sum of all transaction amounts"
            color="#FF6B4A"
            icon={TrendingUp}
          />
          <MetricCard
            label="Total Commission Earned"
            value={formatCurrency(metrics.totalCommission)}
            sub="Platform's share (10%)"
            color="#63B46C"
            icon={Percent}
          />
          <MetricCard
            label="GST Collected"
            value={formatCurrency(metrics.totalGst)}
            sub="Tax collected on orders"
            color="#F6B73C"
            icon={ReceiptText}
          />
          <MetricCard
            label="Pending Settlement"
            value={formatCurrency(metrics.pendingSettlement)}
            sub="Awaiting bank transfer"
            color="#6B7280"
            icon={Clock}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Method Pills */}
          <div className="flex items-center gap-1 bg-white border border-[#ECECEC] rounded-[14px] p-1">
            {METHOD_PILLS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setMethodFilter(value)}
                className={`px-3 py-1.5 rounded-[10px] text-xs font-semibold transition-all duration-150 ${
                  methodFilter === value
                    ? "bg-[#FF6B4A] text-white shadow-sm"
                    : "text-[#5A5A7A] hover:bg-[#FAF9F5]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
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
            {filtered.length} transaction{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Transactions Table */}
        {filtered.length === 0 ? (
          <Card className="py-16 text-center">
            <Banknote size={40} className="text-[#ECECEC] mx-auto mb-3" />
            <p className="font-display font-bold text-[#1A1A2E]">No transactions found</p>
            <p className="text-xs text-[#8C8CA1] mt-1">
              Try adjusting your method or status filter.
            </p>
          </Card>
        ) : (
          <Card padding="none" className="overflow-hidden">
            {/* Table Header */}
            <div className="px-4 py-3 border-b border-[#ECECEC] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard size={16} className="text-[#FF6B4A]" />
                <span className="font-display font-bold text-sm text-[#1A1A2E]">
                  Transaction Ledger
                </span>
              </div>
              <span className="text-xs text-[#8C8CA1] bg-[#FAF9F5] px-2 py-1 rounded-full">
                {filtered.length} entries
              </span>
            </div>

            {/* Scrollable table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="bg-[#FAF9F5] border-b border-[#ECECEC]">
                    {[
                      "TXN ID",
                      "Restaurant",
                      "Customer",
                      "Amount",
                      "Commission",
                      "GST",
                      "Net Settlement",
                      "Method",
                      "Status",
                      "Date",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className={`px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-[#8C8CA1] whitespace-nowrap ${
                          ["Amount", "Commission", "GST", "Net Settlement"].includes(h)
                            ? "text-right"
                            : "text-left"
                        }`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((txn) => (
                    <TransactionRow
                      key={txn.id}
                      txn={txn}
                      onRefund={handleRefundOpen}
                    />
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-[#FAF9F5] border-t-2 border-[#ECECEC]">
                    <td colSpan={3} className="px-4 py-3 text-xs font-bold text-[#5A5A7A]">
                      Totals ({filtered.length} transactions)
                    </td>
                    <td className="px-4 py-3 text-right text-xs font-bold text-[#1A1A2E]">
                      {formatCurrency(filtered.reduce((s, t) => s + t.amount, 0))}
                    </td>
                    <td className="px-4 py-3 text-right text-xs font-bold text-[#FF6B4A]">
                      {formatCurrency(filtered.reduce((s, t) => s + t.commission, 0))}
                    </td>
                    <td className="px-4 py-3 text-right text-xs font-bold text-[#63B46C]">
                      {formatCurrency(filtered.reduce((s, t) => s + t.gst, 0))}
                    </td>
                    <td className="px-4 py-3 text-right text-xs font-bold text-[#1A1A2E]">
                      {formatCurrency(filtered.reduce((s, t) => s + t.netSettlement, 0))}
                    </td>
                    <td colSpan={4} />
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>
        )}

        {/* Revenue Breakdown Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          {/* By Method */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <CreditCard size={15} className="text-[#FF6B4A]" />
              <h3 className="font-display font-bold text-sm text-[#1A1A2E]">By Payment Method</h3>
            </div>
            <div className="space-y-2">
              {(["UPI", "Card", "Cash", "Wallet"] as AdminPaymentTxn["method"][]).map((method) => {
                const methodTxns = transactions.filter((t) => t.method === method);
                const total = methodTxns.reduce((s, t) => s + t.amount, 0);
                return (
                  <div key={method} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Badge variant={getMethodBadgeVariant(method)} size="sm">
                        {method}
                      </Badge>
                      <span className="text-[#8C8CA1]">{methodTxns.length} txn{methodTxns.length !== 1 ? "s" : ""}</span>
                    </div>
                    <span className="font-semibold text-[#1A1A2E]">{formatCurrency(total)}</span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* By Status */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 size={15} className="text-[#63B46C]" />
              <h3 className="font-display font-bold text-sm text-[#1A1A2E]">By Status</h3>
            </div>
            <div className="space-y-2">
              {(["success", "failed", "refunded", "pending"] as PaymentStatus[]).map((status) => {
                const statusTxns = transactions.filter((t) => t.status === status);
                const total = statusTxns.reduce((s, t) => s + t.amount, 0);
                return (
                  <div key={status} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusBadgeVariant(status)} size="sm" dot>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Badge>
                      <span className="text-[#8C8CA1]">{statusTxns.length} txn{statusTxns.length !== 1 ? "s" : ""}</span>
                    </div>
                    <span className="font-semibold text-[#1A1A2E]">{formatCurrency(total)}</span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Commission Breakdown */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Percent size={15} className="text-[#F6B73C]" />
              <h3 className="font-display font-bold text-sm text-[#1A1A2E]">Revenue Breakdown</h3>
            </div>
            <div className="space-y-3">
              {[
                {
                  label: "Gross Revenue",
                  value: transactions.reduce((s, t) => s + t.amount, 0),
                  color: "#1A1A2E",
                },
                {
                  label: "Platform Commission",
                  value: transactions.reduce((s, t) => s + t.commission, 0),
                  color: "#FF6B4A",
                },
                {
                  label: "GST Collected",
                  value: transactions.reduce((s, t) => s + t.gst, 0),
                  color: "#63B46C",
                },
                {
                  label: "Restaurant Payout",
                  value: transactions.reduce((s, t) => s + t.netSettlement, 0),
                  color: "#6B7280",
                },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-[#5A5A7A]">{label}</span>
                  </div>
                  <span className="font-bold" style={{ color }}>
                    {formatCurrency(value)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Refund Modal */}
      <RefundModal
        isOpen={isRefundOpen}
        txn={refundTarget}
        onClose={() => {
          setIsRefundOpen(false);
          setRefundTarget(null);
        }}
        onApprove={handleRefundApprove}
      />
    </div>
  );
}
