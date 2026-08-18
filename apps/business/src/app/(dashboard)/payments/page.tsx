"use client";

import React, { useState, useEffect } from "react";
import { CreditCard, Download, CheckCircle2, ArrowUpRight, DollarSign, Receipt, Loader2, Banknote } from "lucide-react";
import { Card, Badge, Button } from "@food-mania/ui";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface PaymentTxn {
  id: string;
  orderId: string;
  customerName: string;
  amount: number;
  method: string;
  status: string;
  timestamp: string;
}

export default function BusinessPaymentsPage() {
  const [transactions, setTransactions] = useState<PaymentTxn[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = () => {
    let rId = "";
    try {
      const stored = localStorage.getItem("fm_restaurant_id");
      if (stored) rId = stored;
    } catch {}

    const token = typeof window !== "undefined" ? localStorage.getItem("fm_biz_token") || "" : "";
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    fetch(`${API_BASE_URL}/payments?restaurantId=${encodeURIComponent(rId)}`, { headers })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        const dbPayments = json?.data || json;
        if (Array.isArray(dbPayments) && dbPayments.length > 0) {
          const mapped: PaymentTxn[] = dbPayments.map((p: any) => ({
            id: p.id.slice(0, 8).toUpperCase(),
            orderId: p.orderId,
            customerName: p.userId ? `Customer (${p.userId.slice(0, 6)})` : "Dine-In Customer",
            amount: Number(p.amount),
            method: p.method || "DEV_PAYMENT",
            status: p.status || "SUCCESS",
            timestamp: new Date(p.createdAt).toLocaleString("en-IN", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            }),
          }));
          setTransactions(mapped);
        } else {
          // Fallback to order-derived payments
          fetch(`${API_BASE_URL}/orders?restaurantId=${encodeURIComponent(rId)}`, { headers })
            .then((res) => (res.ok ? res.json() : null))
            .then((oJson) => {
              const orders = oJson?.data || oJson;
              if (Array.isArray(orders)) {
                const mapped: PaymentTxn[] = orders
                  .filter((o: any) => o.paymentStatus === "PAID" || o.paymentStatus === "PAYMENT_PROCESSING")
                  .map((o: any) => ({
                    id: o.id.slice(0, 8).toUpperCase(),
                    orderId: o.orderNumber || o.id,
                    customerName: o.customerName || "Gaurav Sharma",
                    amount: Number(o.totalAmount),
                    method: o.paymentMethod || "Instant UPI",
                    status: o.paymentStatus === "PAID" ? "SUCCESS" : "PROCESSING",
                    timestamp: new Date(o.createdAt).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    }),
                  }));
                setTransactions(mapped);
              }
            })
            .catch(() => {});
        }
      })
      .catch((err) => console.warn("Fetch business payments warning:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleExportInvoices = () => {
    // Export GST invoices report
  };

  const totalGross = transactions.reduce((acc, t) => acc + (t.status === "SUCCESS" || t.status === "settled" ? t.amount : 0), 0);
  const pendingSettlement = transactions.reduce((acc, t) => acc + (t.status === "PENDING" || t.status === "processing" ? t.amount : 0), 0);
  const gstAmount = Math.round(totalGross * 0.05);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-[24px] shadow-card border border-[#ECECEC]">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#222222] flex items-center gap-2">
            <CreditCard className="text-[#63B46C]" />
            <span>Payments & Payout Settlements</span>
          </h1>
          <p className="text-xs text-[#666666] mt-0.5">
            Real-time transaction logs from PostgreSQL for your restaurant orders.
          </p>
        </div>

        <Button variant="primary" size="md" onClick={handleExportInvoices} className="min-h-[44px]">
          <Download size={16} />
          <span>Export GST Reports</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card padding="md" className="space-y-1 bg-white border border-[#ECECEC] shadow-card">
          <p className="text-xs text-[#666666] font-semibold">Today&apos;s Gross Payout</p>
          <p className="font-display font-extrabold text-2xl text-[#222222]">₹{totalGross.toLocaleString("en-IN")}</p>
          <span className="text-[10px] font-bold text-[#63B46C]">Settled into Bank Account</span>
        </Card>

        <Card padding="md" className="space-y-1 bg-white border border-[#ECECEC] shadow-card">
          <p className="text-xs text-[#666666] font-semibold">Pending Settlement</p>
          <p className="font-display font-extrabold text-2xl text-[#FF6B4A]">₹{pendingSettlement.toLocaleString("en-IN")}</p>
          <span className="text-[10px] font-bold text-[#FF6B4A]">Next Payout: Midnight 12 AM</span>
        </Card>

        <Card padding="md" className="space-y-1 bg-white border border-[#ECECEC] shadow-card">
          <p className="text-xs text-[#666666] font-semibold">GST Collected (5%)</p>
          <p className="font-display font-extrabold text-2xl text-[#222222]">₹{gstAmount.toLocaleString("en-IN")}</p>
          <span className="text-[10px] font-bold text-[#68B8F8]">Compliant Invoice Tax</span>
        </Card>
      </div>

      <Card padding="lg" className="bg-white rounded-[24px] border border-[#ECECEC] shadow-card space-y-4">
        <h3 className="font-display font-bold text-base text-[#222222]">Transaction Log History</h3>
        {loading ? (
          <div className="py-12 text-center space-y-2">
            <Loader2 className="animate-spin text-[#63B46C] mx-auto" size={28} />
            <p className="text-xs text-[#8C8CA1]">Loading live PostgreSQL payment transactions...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <Banknote size={36} className="text-[#8C8CA1] mx-auto opacity-50" />
            <p className="font-bold text-sm text-[#222222]">No Payment Transactions Found</p>
            <p className="text-xs text-[#8C8CA1]">Completed payments will appear here in real-time.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3.5 bg-[#FAF9F5] rounded-[18px] border border-[#ECECEC] text-xs">
                <div>
                  <p className="font-bold text-[#222222]">Txn #{tx.id} • Order #{tx.orderId}</p>
                  <p className="text-[10px] text-[#666666]">{tx.customerName} • {tx.method} • {tx.timestamp}</p>
                </div>
                <div className="text-right">
                  <p className="font-display font-extrabold text-sm text-[#63B46C]">₹{tx.amount}</p>
                  <span className="bg-[#EFF7EE] text-[#63B46C] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
