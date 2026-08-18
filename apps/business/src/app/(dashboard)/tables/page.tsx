"use client";

import React, { useState, useEffect } from "react";
import { Grid, Sparkles, RefreshCw, Layers, CheckCircle2, Loader2, QrCode, ExternalLink } from "lucide-react";
import { Card, Badge, Button, Modal } from "@food-mania/ui";
import { RestaurantTable, TableStatus } from "@food-mania/shared";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function BusinessTablesPage() {
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQRTable, setSelectedQRTable] = useState<RestaurantTable | null>(null);
  const [currentRestaurantId, setCurrentRestaurantId] = useState("");

  const fetchLiveTables = () => {
    let rId = "";
    try {
      const stored = localStorage.getItem("fm_restaurant_id");
      if (stored) rId = stored;
      if (!rId) {
        const u = localStorage.getItem("fm_biz_user");
        if (u) {
          const parsed = JSON.parse(u);
          if (parsed.restaurantId) rId = parsed.restaurantId;
        }
      }
      if (!rId) {
        const params = new URLSearchParams(window.location.search);
        rId = params.get("restaurantId") || "";
      }
    } catch {}
    setCurrentRestaurantId(rId);

    fetch(`${API_BASE_URL}/restaurants/${rId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        const data = json?.data || json;
        if (data && Array.isArray(data.tables) && data.tables.length > 0) {
          setTables(
            data.tables.map((t: any) => ({
              id: t.id,
              tableNumber: t.tableNumber,
              capacity: t.capacity,
              status: (t.status?.toLowerCase() || "available") as TableStatus,
              section: "Indoor",
              customerName: t.customerName,
              customerPhone: t.customerPhone,
              qrCodeUrl: `http://localhost:3000/r/${rId}/table/${t.tableNumber.toLowerCase()}`,
            }))
          );
        } else if (rId) {
          // Generate placeholder tables for this restaurant (no DB rows yet)
          const generated: RestaurantTable[] = Array.from({ length: 12 }, (_, i) => ({
            id: `t-${i + 1}`,
            tableNumber: `T-${String(i + 1).padStart(2, "0")}`,
            capacity: (i % 3 + 1) * 2,
            status: "available" as TableStatus,
            section: i < 6 ? "Indoor" : "Rooftop",
            qrCodeUrl: `http://localhost:3000/r/${rId}/table/t-${String(i + 1).padStart(2, "0")}`,
          }));
          setTables(generated);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLiveTables();
    const interval = setInterval(fetchLiveTables, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleToggleTableStatus = async (tableId: string, currentStatus: TableStatus) => {
    const nextStatusMap: Record<TableStatus, TableStatus> = {
      available: "reserved",
      reserved: "occupied",
      occupied: "cleaning",
      cleaning: "available",
      selected: "available",
    };

    const nextStatus = nextStatusMap[currentStatus];
    const updatedTables = tables.map((t) => (t.id === tableId ? { ...t, status: nextStatus } : t));
    setTables(updatedTables);
    const token = typeof window !== "undefined" ? localStorage.getItem("fm_biz_token") || "" : "";

    try {
      await fetch(`${API_BASE_URL}/restaurants/tables/${tableId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: nextStatus.toUpperCase() }),
      });
    } catch (e) {
      console.warn("Table status backend update warning:", e);
    }
  };

  const availableCount = tables.filter((t) => t.status === "available").length;
  const reservedCount = tables.filter((t) => t.status === "reserved").length;
  const occupiedCount = tables.filter((t) => t.status === "occupied").length;

  return (
    <div className="space-y-5 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-[24px] shadow-card border border-[#ECECEC]">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#222222] flex items-center gap-2">
            <Grid className="text-[#63B46C]" />
            <span>Interactive Floor Management</span>
          </h1>
          <p className="text-xs text-[#666666] mt-0.5">
            Real-time table status grid synced with customer bookings, table QR scans, and dining flow in PostgreSQL.
          </p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
          <Badge variant="success" size="md">{availableCount} Available</Badge>
          <Badge variant="warning" size="md">{reservedCount} Reserved</Badge>
          <Badge variant="danger" size="md">{occupiedCount} Occupied</Badge>
        </div>
      </div>

      {/* Tables Interactive Grid */}
      <Card padding="lg" className="space-y-4 bg-white border border-[#ECECEC] shadow-card">
        <div className="flex items-center justify-between border-b border-[#ECECEC] pb-3">
          <h3 className="font-display font-bold text-base text-[#222222]">Floor Layout ({tables.length} Tables)</h3>
          <span className="text-xs text-[#666666]">Click card to cycle status • Click QR to view Table QR code</span>
        </div>

        {loading ? (
          <div className="py-16 text-center space-y-2">
            <Loader2 className="animate-spin text-[#63B46C] mx-auto" size={28} />
            <p className="text-xs text-[#8C8CA1]">Loading live table status...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {tables.map((table) => {
              const bgClass =
                table.status === "available"
                  ? "bg-[#EFF7EE] border-[#63B46C] text-[#63B46C]"
                  : table.status === "reserved"
                  ? "bg-[#FEF9EF] border-[#F6B73C] text-[#F6B73C]"
                  : table.status === "occupied"
                  ? "bg-[#FFF1EE] border-[#FF6B4A] text-[#FF6B4A]"
                  : "bg-gray-100 border-gray-300 text-gray-600";

              return (
                <div
                  key={table.id}
                  className={`p-4 rounded-[20px] border-2 flex flex-col items-center justify-between min-h-[125px] transition-all shadow-xs relative group ${bgClass}`}
                >
                  <div
                    onClick={() => handleToggleTableStatus(table.id, table.status)}
                    className="w-full flex flex-col items-center cursor-pointer"
                  >
                    <span className="font-display font-extrabold text-sm">{table.tableNumber}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">{table.status}</span>
                    <span className="text-[10px] text-gray-500 font-medium">{table.capacity} Seats</span>
                    {(table as any).customerName && (
                      <span className="text-[11px] font-bold text-[#222222] truncate max-w-[95%] mt-1.5 bg-white/90 px-2 py-0.5 rounded-md border border-current shadow-2xs">
                        👤 {(table as any).customerName}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedQRTable(table);
                    }}
                    className="mt-2 flex items-center gap-1 text-[10px] font-bold bg-white px-2 py-1 rounded-full border border-current shadow-2xs hover:scale-105 active:scale-95 transition-all"
                  >
                    <QrCode size={12} />
                    <span>View QR</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* View Table QR Code Modal */}
      {selectedQRTable && (
        <Modal isOpen={!!selectedQRTable} onClose={() => setSelectedQRTable(null)} title={`Table ${selectedQRTable.tableNumber} QR Code`}>
          <div className="py-4 space-y-4 text-center text-[#222222]">
            <div className="p-5 bg-[#FAF9F5] border border-[#ECECEC] rounded-[24px] space-y-3 flex flex-col items-center">
              <div className="relative w-48 h-48 bg-white p-3 rounded-[20px] shadow-md border border-gray-200">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=http://localhost:3000/r/${currentRestaurantId}/table/${selectedQRTable.tableNumber.toLowerCase()}`}
                  alt={`Table ${selectedQRTable.tableNumber} QR Code`}
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <h4 className="font-display font-bold text-lg text-[#222222]">Table {selectedQRTable.tableNumber}</h4>
                <p className="text-xs text-[#666666]">{currentRestaurantId} • {selectedQRTable.capacity} Seats</p>
                {(selectedQRTable as any).customerName && (
                  <p className="text-xs font-bold text-[#FF6B4A] mt-1">
                    Booked for: {(selectedQRTable as any).customerName} {(selectedQRTable as any).customerPhone ? `(${(selectedQRTable as any).customerPhone})` : ""}
                  </p>
                )}
              </div>
            </div>

            <div className="p-3 bg-[#EFF7EE] border border-[#63B46C]/30 rounded-[16px] text-xs text-[#63B46C] font-semibold break-all text-left">
              <span className="block text-[10px] text-[#666666] font-normal mb-0.5">Scanned Customer URL:</span>
              http://localhost:3000/r/{currentRestaurantId}/table/{selectedQRTable.tableNumber.toLowerCase()}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="md"
                fullWidth
                onClick={() => window.open(`http://localhost:3000/r/${currentRestaurantId}/table/${selectedQRTable.tableNumber.toLowerCase()}`, "_blank")}
              >
                <ExternalLink size={14} className="mr-1" /> Test Scan Entry
              </Button>
              <Button variant="primary" size="md" fullWidth onClick={() => setSelectedQRTable(null)}>
                Done
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
