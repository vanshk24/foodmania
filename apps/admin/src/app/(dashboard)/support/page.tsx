"use client";
import React, { useState, useMemo } from "react";
import {
  MessageSquare, Search, Plus, AlertTriangle, CheckCircle2,
  ArrowUp, Clock, User, Store, CreditCard, Wrench,
  ChevronDown, X, Send
} from "lucide-react";
import { SUPPORT_TICKETS, SupportTicket, SupportTicketStatus } from "@food-mania/shared";

// ─── Types ──────────────────────────────────────────────────────────────────

type Priority = "Low" | "Medium" | "High" | "Critical";
type Category = "Payment" | "Order" | "Booking" | "Technical" | "Other";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function priorityStyle(p: Priority): string {
  return {
    Critical: "bg-red-50 text-red-600 border border-red-200",
    High:     "bg-orange-50 text-orange-600 border border-orange-200",
    Medium:   "bg-yellow-50 text-yellow-700 border border-yellow-200",
    Low:      "bg-green-50 text-green-700 border border-green-200",
  }[p];
}

function statusStyle(s: SupportTicketStatus): string {
  return {
    open:        "bg-blue-50 text-blue-700",
    in_progress: "bg-orange-50 text-orange-600",
    resolved:    "bg-green-50 text-green-700",
    closed:      "bg-gray-100 text-gray-500",
    escalated:   "bg-red-50 text-red-600",
  }[s];
}

function statusLabel(s: SupportTicketStatus): string {
  return {
    open: "Open", in_progress: "In Progress",
    resolved: "Resolved", closed: "Closed", escalated: "Escalated",
  }[s];
}

function categoryIcon(c: Category) {
  const m: Record<Category, React.ElementType> = {
    Payment: CreditCard, Order: Store, Booking: Clock,
    Technical: Wrench, Other: MessageSquare,
  };
  const Icon = m[c];
  return <Icon size={12} />;
}

function slaHours(createdAt: string): number {
  return Math.round((Date.now() - new Date(createdAt).getTime()) / 3_600_000);
}

// ─── Ticket Detail Drawer ─────────────────────────────────────────────────────

function TicketDrawer({
  ticket,
  open,
  onClose,
  onStatusChange,
}: {
  ticket: SupportTicket | null;
  open: boolean;
  onClose: () => void;
  onStatusChange: (id: string, status: SupportTicketStatus) => void;
}) {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<{ author: string; text: string; time: string }[]>([]);

  if (!open || !ticket) return null;

  const handleAddNote = () => {
    if (!note.trim()) return;
    setNotes((n) => [...n, { author: "Admin", text: note, time: new Date().toLocaleTimeString() }]);
    setNote("");
  };

  const sla = slaHours(ticket.createdAt);
  const slaBreached = sla > 24 && ticket.status !== "resolved" && ticket.status !== "closed";

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-[400px] bg-white shadow-2xl border-l border-[#ECECEC] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#ECECEC] shrink-0">
          <div>
            <h2 className="font-bold text-[#222222]">Ticket {ticket.id}</h2>
            <p className="text-xs text-[#8C8CA1]">Created {new Date(ticket.createdAt).toLocaleDateString()}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
            <X size={16} className="text-[#666]" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Subject */}
          <div>
            <p className="text-xs font-semibold text-[#8C8CA1] uppercase tracking-wide mb-1">Subject</p>
            <p className="text-sm font-semibold text-[#222222]">{ticket.subject}</p>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${priorityStyle(ticket.priority as Priority)}`}>
              {ticket.priority}
            </span>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${statusStyle(ticket.status)}`}>
              {statusLabel(ticket.status)}
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-[#FAF9F5] border border-[#ECECEC] text-[#8C8CA1] flex items-center gap-1">
              {categoryIcon(ticket.category as Category)} {ticket.category}
            </span>
          </div>

          {/* SLA */}
          <div className={`flex items-center gap-2 px-3 py-2 rounded-[12px] ${slaBreached ? "bg-red-50 border border-red-200" : "bg-[#FAF9F5] border border-[#ECECEC]"}`}>
            <Clock size={14} className={slaBreached ? "text-red-500" : "text-[#8C8CA1]"} />
            <p className={`text-xs font-semibold ${slaBreached ? "text-red-600" : "text-[#8C8CA1]"}`}>
              SLA: {sla}h elapsed {slaBreached ? "— BREACHED" : ""}
            </p>
          </div>

          {/* Details */}
          <div className="bg-[#FAF9F5] rounded-[14px] p-3 space-y-2">
            <p className="text-xs text-[#8C8CA1] flex items-center gap-2"><User size={12} /> {ticket.customerName}</p>
            <p className="text-xs text-[#8C8CA1] flex items-center gap-2"><Store size={12} /> {ticket.restaurantName}</p>
            <p className="text-xs text-[#8C8CA1] flex items-center gap-2"><User size={12} /> Assigned: {ticket.assignedTo}</p>
          </div>

          {/* Action Buttons */}
          {ticket.status !== "resolved" && ticket.status !== "closed" && (
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => onStatusChange(ticket.id, "resolved")}
                className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 bg-[#63B46C] text-white rounded-[10px] hover:bg-[#50a05a] transition"
              >
                <CheckCircle2 size={12} /> Resolve
              </button>
              {ticket.status !== "escalated" && (
                <button
                  onClick={() => onStatusChange(ticket.id, "escalated")}
                  className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-[10px] hover:bg-red-100 transition"
                >
                  <ArrowUp size={12} /> Escalate
                </button>
              )}
              <button
                onClick={() => onStatusChange(ticket.id, "closed")}
                className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 bg-[#FAF9F5] border border-[#ECECEC] text-[#666] rounded-[10px] hover:border-[#ccc] transition"
              >
                Close
              </button>
            </div>
          )}
          {(ticket.status === "resolved" || ticket.status === "closed") && (
            <button
              onClick={() => onStatusChange(ticket.id, "open")}
              className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-[10px] hover:bg-blue-100 transition"
            >
              Reopen Ticket
            </button>
          )}

          {/* Internal Notes */}
          <div>
            <p className="text-xs font-semibold text-[#8C8CA1] uppercase tracking-wide mb-2">Internal Notes</p>
            {notes.length > 0 ? (
              <div className="space-y-2 mb-2">
                {notes.map((n, i) => (
                  <div key={i} className="bg-yellow-50 border border-yellow-200 rounded-[12px] px-3 py-2">
                    <p className="text-xs font-semibold text-yellow-800">{n.author} · {n.time}</p>
                    <p className="text-xs text-yellow-700 mt-0.5">{n.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#BDBDBD] mb-2">No internal notes yet</p>
            )}
            <div className="flex gap-2">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add internal note..."
                rows={2}
                className="flex-1 px-3 py-2 rounded-[12px] border border-[#ECECEC] bg-[#FAF9F5] text-sm text-[#222222] placeholder-[#BDBDBD] resize-none focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/30 focus:border-[#FF6B4A] transition"
              />
              <button
                onClick={handleAddNote}
                className="px-3 py-2 bg-[#FF6B4A] text-white rounded-[12px] hover:bg-[#e5592e] transition self-end"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Assign Agent Modal ───────────────────────────────────────────────────────

function AssignModal({
  open,
  ticketId,
  onClose,
  onAssign,
}: {
  open: boolean;
  ticketId: string;
  onClose: () => void;
  onAssign: (id: string, agent: string) => void;
}) {
  const [agent, setAgent] = useState("");
  const AGENTS = ["Agent Meera", "Agent Rohit", "Agent Priya", "Agent Vikram", "Agent Ananya"];

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-[24px] w-full max-w-sm shadow-2xl border border-[#ECECEC]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ECECEC]">
          <h2 className="font-bold text-[#222222]">Assign Agent</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
            <X size={16} className="text-[#666]" />
          </button>
        </div>
        <div className="p-6">
          <p className="text-xs text-[#8C8CA1] mb-3">Select an agent for ticket {ticketId}</p>
          <div className="space-y-2">
            {AGENTS.map((a) => (
              <button
                key={a}
                onClick={() => setAgent(a)}
                className={`w-full text-left px-3 py-2.5 rounded-[12px] text-sm font-medium border transition ${
                  agent === a
                    ? "bg-[#FF6B4A]/5 border-[#FF6B4A] text-[#FF6B4A]"
                    : "border-[#ECECEC] text-[#222222] hover:border-[#FF6B4A]"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={onClose} className="flex-1 py-2.5 border border-[#ECECEC] rounded-[12px] text-sm font-semibold text-[#8C8CA1]">
              Cancel
            </button>
            <button
              disabled={!agent}
              onClick={() => { if (agent) { onAssign(ticketId, agent); onClose(); } }}
              className="flex-1 py-2.5 bg-[#FF6B4A] text-white rounded-[12px] text-sm font-semibold disabled:opacity-40 hover:bg-[#e5592e] transition"
            >
              Assign
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── New Ticket Modal ─────────────────────────────────────────────────────────

function NewTicketModal({ open, onClose, onAdd }: { open: boolean; onClose: () => void; onAdd: (t: SupportTicket) => void }) {
  const [customer, setCustomer] = useState("");
  const [restaurant, setRestaurant] = useState("");
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState<Category>("Order");
  const [priority, setPriority] = useState<Priority>("Medium");

  const handleAdd = () => {
    if (!customer || !subject) return;
    const newTicket: SupportTicket = {
      id: `TKT-${Math.floor(4000 + Math.random() * 9000)}`,
      customerName: customer,
      restaurantName: restaurant || "N/A",
      subject,
      category,
      priority,
      status: "open",
      assignedTo: "Unassigned",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onAdd(newTicket);
    setCustomer(""); setRestaurant(""); setSubject("");
    onClose();
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-[24px] w-full max-w-md shadow-2xl border border-[#ECECEC]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ECECEC]">
          <h2 className="font-bold text-[#222222]">New Support Ticket</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
            <X size={16} className="text-[#666]" />
          </button>
        </div>
        <div className="p-6 space-y-3">
          {[
            ["Customer Name", customer, setCustomer, "text"] as const,
            ["Restaurant Name", restaurant, setRestaurant, "text"] as const,
            ["Subject", subject, setSubject, "text"] as const,
          ].map(([label, value, setter]) => (
            <div key={label}>
              <label className="block text-xs font-semibold text-[#8C8CA1] uppercase tracking-wide mb-1">{label}</label>
              <input
                type="text"
                value={value}
                onChange={(e) => (setter as (v: string) => void)(e.target.value)}
                className="w-full px-3 py-2 rounded-[12px] border border-[#ECECEC] bg-[#FAF9F5] text-sm text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/30 focus:border-[#FF6B4A] transition"
              />
            </div>
          ))}
          <div>
            <label className="block text-xs font-semibold text-[#8C8CA1] uppercase tracking-wide mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full px-3 py-2 rounded-[12px] border border-[#ECECEC] bg-[#FAF9F5] text-sm text-[#222222] focus:outline-none"
            >
              {(["Payment", "Order", "Booking", "Technical", "Other"] as Category[]).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#8C8CA1] uppercase tracking-wide mb-1">Priority</label>
            <div className="flex gap-2">
              {(["Low", "Medium", "High", "Critical"] as Priority[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`flex-1 py-1.5 rounded-[10px] text-xs font-semibold border transition ${
                    priority === p ? priorityStyle(p) : "border-[#ECECEC] text-[#8C8CA1]"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border border-[#ECECEC] rounded-[12px] text-sm font-semibold text-[#8C8CA1]">
            Cancel
          </button>
          <button onClick={handleAdd} className="flex-1 py-2.5 bg-[#FF6B4A] text-white rounded-[12px] text-sm font-semibold hover:bg-[#e5592e] transition">
            Create Ticket
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Ticket Card ──────────────────────────────────────────────────────────────

function TicketCard({
  ticket,
  onView,
  onAssign,
  onResolve,
  onEscalate,
}: {
  ticket: SupportTicket;
  onView: (t: SupportTicket) => void;
  onAssign: (id: string) => void;
  onResolve: (id: string) => void;
  onEscalate: (id: string) => void;
}) {
  const sla = slaHours(ticket.createdAt);
  const slaBreached = sla > 24 && ticket.status !== "resolved" && ticket.status !== "closed";

  return (
    <div className={`bg-white border rounded-[20px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)] transition-all hover:shadow-[0_4px_20px_rgba(0,0,0,0.09)] ${slaBreached ? "border-red-200" : "border-[#ECECEC]"}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-[#FF6B4A] bg-orange-50 px-2 py-0.5 rounded-full">
            {ticket.id}
          </span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${priorityStyle(ticket.priority as Priority)}`}>
            {ticket.priority}
          </span>
        </div>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusStyle(ticket.status)}`}>
          {statusLabel(ticket.status)}
        </span>
      </div>

      {/* Subject */}
      <p className="text-sm font-semibold text-[#222222] mb-1 line-clamp-2">{ticket.subject}</p>

      {/* Meta */}
      <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-[#8C8CA1] mb-2">
        <span className="flex items-center gap-1"><User size={10} /> {ticket.customerName}</span>
        <span className="flex items-center gap-1"><Store size={10} /> {ticket.restaurantName}</span>
      </div>

      {/* Category + SLA */}
      <div className="flex items-center justify-between mb-3">
        <span className="flex items-center gap-1 text-xs text-[#8C8CA1] bg-[#FAF9F5] border border-[#ECECEC] px-2 py-0.5 rounded-full">
          {categoryIcon(ticket.category as Category)} {ticket.category}
        </span>
        <span className={`flex items-center gap-1 text-xs font-medium ${slaBreached ? "text-red-500" : "text-[#8C8CA1]"}`}>
          <Clock size={10} /> {sla}h {slaBreached ? "⚠️" : ""}
        </span>
      </div>

      {/* Assigned */}
      <p className="text-xs text-[#8C8CA1] mb-3">
        👤 {ticket.assignedTo}
      </p>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onView(ticket)}
          className="text-xs font-semibold px-3 py-1.5 bg-[#FAF9F5] border border-[#ECECEC] text-[#222222] rounded-[10px] hover:border-[#FF6B4A] transition"
        >
          Details
        </button>
        <button
          onClick={() => onAssign(ticket.id)}
          className="text-xs font-semibold px-3 py-1.5 bg-[#FAF9F5] border border-[#ECECEC] text-[#222222] rounded-[10px] hover:border-[#FF6B4A] transition"
        >
          Assign
        </button>
        {ticket.status !== "resolved" && ticket.status !== "closed" && (
          <>
            <button
              onClick={() => onResolve(ticket.id)}
              className="text-xs font-semibold px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-[10px] hover:bg-green-100 transition"
            >
              <CheckCircle2 size={11} className="inline mr-1" />Resolve
            </button>
            {ticket.status !== "escalated" && (
              <button
                onClick={() => onEscalate(ticket.id)}
                className="text-xs font-semibold px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-[10px] hover:bg-red-100 transition"
              >
                <ArrowUp size={11} className="inline mr-1" />Escalate
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>(SUPPORT_TICKETS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [drawerTicket, setDrawerTicket] = useState<SupportTicket | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [assignModalId, setAssignModalId] = useState<string | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return tickets.filter((t) => {
      const matchQ = !q || t.customerName.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q) || t.id.toLowerCase().includes(q);
      const matchStatus = statusFilter === "All" || t.status === statusFilter;
      const matchPriority = priorityFilter === "All" || t.priority === priorityFilter;
      return matchQ && matchStatus && matchPriority;
    });
  }, [tickets, searchQuery, statusFilter, priorityFilter]);

  const updateStatus = (id: string, status: SupportTicketStatus) => {
    setTickets((ts) => ts.map((t) => t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t));
    // Update drawer ticket too
    setDrawerTicket((dt) => dt && dt.id === id ? { ...dt, status } : dt);
  };

  const assignAgent = (id: string, agent: string) => {
    setTickets((ts) => ts.map((t) => t.id === id ? { ...t, assignedTo: agent, status: "in_progress" } : t));
    setDrawerTicket((dt) => dt && dt.id === id ? { ...dt, assignedTo: agent, status: "in_progress" } : dt);
  };

  const openCount = tickets.filter((t) => t.status === "open").length;
  const inProgressCount = tickets.filter((t) => t.status === "in_progress").length;
  const criticalCount = tickets.filter((t) => t.priority === "Critical").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#222222]">Support Operations Center</h1>
          <p className="text-sm text-[#8C8CA1] mt-1">Manage customer tickets, assignments, and SLA tracking</p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#FF6B4A] text-white text-sm font-semibold rounded-[14px] hover:bg-[#e5592e] transition shadow-sm"
        >
          <Plus size={16} /> New Ticket
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Tickets", value: tickets.length, icon: MessageSquare, color: "#6366F1" },
          { label: "Open", value: openCount, icon: AlertTriangle, color: "#F6B73C" },
          { label: "In Progress", value: inProgressCount, icon: Clock, color: "#FF6B4A" },
          { label: "Critical", value: criticalCount, icon: ArrowUp, color: "#EF4444" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white border border-[#ECECEC] rounded-[18px] p-4 flex items-center gap-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <div className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0" style={{ backgroundColor: `${s.color}18` }}>
                <Icon size={18} style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-xl font-bold text-[#222222]">{s.value}</p>
                <p className="text-xs text-[#8C8CA1]">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white border border-[#ECECEC] rounded-[18px] p-3 flex flex-wrap gap-2 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="flex-1 min-w-[180px] relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8CA1]" />
          <input
            placeholder="Search tickets, customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-[12px] bg-[#FAF9F5] border border-[#ECECEC] text-sm text-[#222222] placeholder-[#BDBDBD] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/30 focus:border-[#FF6B4A] transition"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-[12px] border border-[#ECECEC] bg-[#FAF9F5] text-sm text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/30 transition"
        >
          {["All", "open", "in_progress", "escalated", "resolved", "closed"].map((s) => (
            <option key={s} value={s}>Status: {s}</option>
          ))}
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-3 py-2 rounded-[12px] border border-[#ECECEC] bg-[#FAF9F5] text-sm text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/30 transition"
        >
          {["All", "Critical", "High", "Medium", "Low"].map((p) => (
            <option key={p} value={p}>Priority: {p}</option>
          ))}
        </select>
      </div>

      {/* Count */}
      <p className="text-xs text-[#8C8CA1]">Showing {filtered.length} of {tickets.length} tickets</p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((t) => (
            <TicketCard
              key={t.id}
              ticket={t}
              onView={(ticket) => { setDrawerTicket(ticket); setDrawerOpen(true); }}
              onAssign={(id) => setAssignModalId(id)}
              onResolve={(id) => updateStatus(id, "resolved")}
              onEscalate={(id) => updateStatus(id, "escalated")}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-[#ECECEC] rounded-[20px] p-12 text-center">
          <MessageSquare size={48} className="text-[#DEDEDE] mx-auto mb-3" />
          <h3 className="font-bold text-[#8C8CA1]">No tickets found</h3>
          <p className="text-sm text-[#BDBDBD] mt-1">Adjust your search or filters</p>
        </div>
      )}

      {/* Ticket Detail Drawer */}
      <TicketDrawer
        ticket={drawerTicket}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onStatusChange={updateStatus}
      />

      {/* Assign Modal */}
      <AssignModal
        open={assignModalId !== null}
        ticketId={assignModalId ?? ""}
        onClose={() => setAssignModalId(null)}
        onAssign={assignAgent}
      />

      {/* New Ticket Modal */}
      <NewTicketModal
        open={showNewModal}
        onClose={() => setShowNewModal(false)}
        onAdd={(t) => setTickets((ts) => [t, ...ts])}
      />
    </div>
  );
}
