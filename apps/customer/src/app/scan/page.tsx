"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, QrCode, Sparkles, Camera, Flashlight, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, Button, Badge } from "@food-mania/ui";
import { motion } from "framer-motion";

export default function QRScannerPage() {
  const [manualCode, setManualCode] = useState("");
  const [isFlashOn, setIsFlashOn] = useState(false);

  const DEMO_PRESETS = [
    { label: "Table T01 • The Urban Cafe", url: "/r/the-urban-cafe/table/T01" },
    { label: "Table T12 • Spice Symphony", url: "/r/spice-symphony/table/T12" },
    { label: "Table T08 • Royal Treat", url: "/r/royal-treat/table/T08" },
    { label: "Table T04 • Burger Hub", url: "/r/burger-hub/table/T04" },
  ];

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    window.location.href = manualCode.startsWith("/") ? manualCode : `/${manualCode}`;
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white flex flex-col justify-between p-4">
      {/* Header */}
      <div className="flex items-center justify-between z-10 pt-2">
        <Link
          href="/"
          className="w-[44px] h-[44px] rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 active:scale-95 transition-all"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="text-center">
          <h1 className="font-display font-bold text-base">Smart QR Scanner</h1>
          <p className="text-[10px] text-gray-400">Scan Table QR to Open Menu & Session</p>
        </div>
        <button
          onClick={() => setIsFlashOn(!isFlashOn)}
          className={`w-[44px] h-[44px] rounded-full flex items-center justify-center transition-all ${
            isFlashOn ? "bg-[#F6B73C] text-black" : "bg-white/10 text-white"
          }`}
        >
          <Flashlight size={18} />
        </button>
      </div>

      {/* Animated Viewfinder */}
      <div className="relative w-full max-w-xs aspect-square mx-auto my-auto rounded-[32px] border-2 border-dashed border-[#FF6B4A]/60 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
        {/* Scanning laser line */}
        <motion.div
          animate={{ y: [-100, 100, -100] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
          className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#FF6B4A] to-transparent shadow-[0_0_15px_#FF6B4A]"
        />

        <QrCode size={64} className="text-[#FF6B4A] opacity-40 mb-3 animate-pulse" />
        <p className="text-xs font-semibold text-gray-300">Point camera at table QR code</p>
        <p className="text-[10px] text-gray-500 mt-1">Automatic table & restaurant detection</p>
      </div>

      {/* Demo Simulation Presets */}
      <div className="space-y-3 max-w-md mx-auto w-full z-10 pb-4">
        <div className="flex items-center justify-between text-xs text-gray-400 font-bold px-1">
          <span>Tap Demo Preset to Scan:</span>
          <Badge variant="orange" size="sm">FAST DEMO</Badge>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {DEMO_PRESETS.map((p) => (
            <Link key={p.url} href={p.url}>
              <button className="w-full p-3 bg-white/10 hover:bg-[#FF6B4A] rounded-[18px] text-xs font-bold transition-all text-left border border-white/10 flex items-center justify-between">
                <span>{p.label}</span>
                <span>→</span>
              </button>
            </Link>
          ))}
        </div>

        {/* Manual Code Input */}
        <form onSubmit={handleManualSubmit} className="pt-2 flex gap-2">
          <input
            type="text"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder="or paste QR URL (/r/burger-hub/table/T04)"
            className="flex-1 bg-white/10 border border-white/20 rounded-[18px] px-3.5 py-2.5 text-xs text-white placeholder:text-gray-500 focus:outline-none"
          />
          <button type="submit" className="bg-[#FF6B4A] text-white font-bold text-xs px-4 py-2.5 rounded-[18px]">
            Go
          </button>
        </form>
      </div>
    </div>
  );
}
