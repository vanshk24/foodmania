"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  QrCode,
  Sparkles,
  Camera,
  Flashlight,
  AlertCircle,
  CheckCircle2,
  Upload,
  RefreshCw,
  Info,
} from "lucide-react";
import { Card, Button, Badge } from "@food-mania/ui";
import { motion } from "framer-motion";

interface ParsedQR {
  restaurantId: string;
  tableId: string;
  originalUrl: string;
}

export default function QRScannerPage() {
  const router = useRouter();

  // Mode: "book" (Table Reservation) vs "order" (Direct Table QR Ordering)
  const [scanMode, setScanMode] = useState<"book" | "order">("book");
  
  // State
  const [manualCode, setManualCode] = useState("");
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [decodedResult, setDecodedResult] = useState<ParsedQR | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Initialize camera stream if available
  useEffect(() => {
    let stream: MediaStream | null = null;
    let isMounted = true;

    async function startCamera() {
      try {
        if (!navigator?.mediaDevices?.getUserMedia) {
          setCameraError("Camera API not supported on this browser/device. Please upload a QR code image below.");
          return;
        }
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
        });
        if (isMounted && videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute("playsinline", "true");
          videoRef.current.play().catch(() => {});
          setIsCameraActive(true);
        }
      } catch (err: any) {
        if (isMounted) {
          setCameraError("Camera access disabled or unavailable. You can upload a QR image or enter the code below.");
        }
      }
    }

    startCamera();

    return () => {
      isMounted = false;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Continuous live camera QR detection loop
  useEffect(() => {
    if (!isCameraActive) return;

    let animId: number;
    let detector: any = null;

    if (typeof window !== "undefined" && "BarcodeDetector" in window) {
      try {
        detector = new (window as any).BarcodeDetector({ formats: ["qr_code"] });
      } catch {}
    }

    const scanFrame = async () => {
      if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        if (detector) {
          try {
            const codes = await detector.detect(videoRef.current);
            if (codes && codes.length > 0 && codes[0].rawValue) {
              const parsed = parseQRContent(codes[0].rawValue);
              if (parsed) {
                handleQRResolved(parsed);
                return;
              }
            }
          } catch {}
        }
      }
      animId = requestAnimationFrame(scanFrame);
    };

    animId = requestAnimationFrame(scanFrame);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isCameraActive]);

  // Helper to parse QR text string into restaurantId and tableId
  const parseQRContent = (rawText: string): ParsedQR | null => {
    if (!rawText || !rawText.trim()) return null;
    const text = rawText.trim();

    try {
      // 1. Check if it's a JSON payload
      if (text.startsWith("{") && text.endsWith("}")) {
        const parsed = JSON.parse(text);
        if (parsed.restaurantId && (parsed.tableId || parsed.tableNumber)) {
          return {
            restaurantId: parsed.restaurantId,
            tableId: parsed.tableId || parsed.tableNumber,
            originalUrl: text,
          };
        }
      }

      // 2. Check for URL path patterns (e.g. /r/spice-symphony/table/T12 or /restaurant/spice-symphony/book?table=T12)
      let urlObj: URL | null = null;
      if (text.startsWith("http://") || text.startsWith("https://")) {
        urlObj = new URL(text);
      } else if (text.startsWith("/")) {
        urlObj = new URL(`http://localhost:3000${text}`);
      }

      if (urlObj) {
        const path = urlObj.pathname;
        // Pattern A: /r/:restaurantId/table/:tableId
        const matchTableRoute = path.match(/\/r\/([^\/]+)\/table\/([^\/]+)/);
        if (matchTableRoute) {
          return {
            restaurantId: matchTableRoute[1]!,
            tableId: matchTableRoute[2]!,
            originalUrl: text,
          };
        }

        // Pattern B: /restaurant/:restaurantId/book?table=:tableId
        const matchBookRoute = path.match(/\/restaurant\/([^\/]+)\/book/);
        if (matchBookRoute) {
          const tableParam = urlObj.searchParams.get("table") || urlObj.searchParams.get("tableId") || urlObj.searchParams.get("t") || "T-01";
          return {
            restaurantId: matchBookRoute[1]!,
            tableId: tableParam,
            originalUrl: text,
          };
        }

        // Pattern C: /restaurant/:restaurantId/menu?table=:tableId
        const matchMenuRoute = path.match(/\/restaurant\/([^\/]+)\/menu/);
        if (matchMenuRoute) {
          const tableParam = urlObj.searchParams.get("table") || urlObj.searchParams.get("tableId") || urlObj.searchParams.get("t") || "T-01";
          return {
            restaurantId: matchMenuRoute[1]!,
            tableId: tableParam,
            originalUrl: text,
          };
        }
      }

      // 3. Check colon format: restaurantId:tableId (e.g. spice-symphony:T12)
      if (text.includes(":")) {
        const [rId, tId] = text.split(":");
        if (rId && tId) {
          return {
            restaurantId: rId.trim(),
            tableId: tId.trim(),
            originalUrl: text,
          };
        }
      }

      // 4. Fallback query string parse: restaurantId=...&tableId=...
      if (text.includes("restaurantId=") || text.includes("tableId=") || text.includes("r=")) {
        const queryParams = new URLSearchParams(text.includes("?") ? text.split("?")[1] : text);
        const rId = queryParams.get("restaurantId") || queryParams.get("r");
        const tId = queryParams.get("tableId") || queryParams.get("table") || queryParams.get("t");
        if (rId) {
          return {
            restaurantId: rId,
            tableId: tId || "T-01",
            originalUrl: text,
          };
        }
      }

      // 5. If simple restaurant ID string
      if (text.length > 2 && !text.includes(" ")) {
        return {
          restaurantId: text,
          tableId: "T-01",
          originalUrl: text,
        };
      }
    } catch (e) {
      console.error("QR Parse Error", e);
    }

    return null;
  };

  // Process decoded QR data and navigate to the target flow
  const handleQRResolved = (parsed: ParsedQR) => {
    setDecodedResult(parsed);
    setErrorMsg(null);

    // Target navigation path based on mode
    let targetUrl = "";
    if (scanMode === "book") {
      targetUrl = `/restaurant/${parsed.restaurantId}/book?table=${encodeURIComponent(parsed.tableId)}`;
    } else {
      targetUrl = `/r/${parsed.restaurantId}/table/${encodeURIComponent(parsed.tableId)}`;
    }

    setTimeout(() => {
      window.location.href = targetUrl;
    }, 600);
  };

  // Handle manual input form submit
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;

    const parsed = parseQRContent(manualCode);
    if (parsed) {
      handleQRResolved(parsed);
    } else {
      setErrorMsg("Could not parse restaurant or table code. Format: /r/restaurant-id/table/T01 or restaurantId:tableId");
    }
  };

  // Handle QR Image file upload (Camera Unsupported Fallback)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Use standard Web API BarcodeDetector if available
      if ("BarcodeDetector" in window) {
        const barcodeDetector = new (window as any).BarcodeDetector({ formats: ["qr_code"] });
        const imageBitmap = await createImageBitmap(file);
        const barcodes = await barcodeDetector.detect(imageBitmap);
        if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
          const rawText = barcodes[0].rawValue;
          const parsed = parseQRContent(rawText);
          if (parsed) {
            handleQRResolved(parsed);
            return;
          }
        }
      }

      // Fallback file text parser (reads filename or text content in image/metadata)
      const fileName = file.name;
      const parsedFromFile = parseQRContent(fileName) || parseQRContent(fileName.replace(/\.[^/.]+$/, ""));
      if (parsedFromFile) {
        handleQRResolved(parsedFromFile);
        return;
      }

      // Read image file as data URL to extract embedded string if present
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        const parsed = parseQRContent(content);
        if (parsed) {
          handleQRResolved(parsed);
        } else {
          // Prompt user to enter table code if image barcode detection isn't supported on browser
          setErrorMsg(`QR Image "${file.name}" uploaded. Enter your table code or select preset below.`);
        }
      };
      reader.readAsText(file);
    } catch (err) {
      setErrorMsg("Unable to decode QR image. Please enter the table code manually.");
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white flex flex-col justify-between p-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between z-10 pt-2">
        <Link
          href="/"
          className="w-[44px] h-[44px] rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 active:scale-95 transition-all"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="text-center">
          <h1 className="font-display font-bold text-base">Smart Table QR Scanner</h1>
          <p className="text-[10px] text-gray-400">Scan Table QR for Instant Booking & Ordering</p>
        </div>
        <button
          onClick={() => setIsFlashOn(!isFlashOn)}
          className={`w-[44px] h-[44px] rounded-full flex items-center justify-center transition-all ${
            isFlashOn ? "bg-[#F6B73C] text-black" : "bg-white/10 text-white"
          }`}
          title="Toggle Flashlight"
        >
          <Flashlight size={18} />
        </button>
      </div>

      {/* Mode Switcher: Reserve Table vs Order Menu */}
      <div className="bg-white/10 p-1 rounded-full flex text-xs font-semibold my-3 z-10">
        <button
          onClick={() => setScanMode("book")}
          className={`flex-1 py-2 rounded-full transition-all flex items-center justify-center gap-1.5 ${
            scanMode === "book" ? "bg-[#63B46C] text-white shadow-md font-bold" : "text-gray-400 hover:text-white"
          }`}
        >
          <Sparkles size={14} />
          <span>Book Table via QR</span>
        </button>
        <button
          onClick={() => setScanMode("order")}
          className={`flex-1 py-2 rounded-full transition-all flex items-center justify-center gap-1.5 ${
            scanMode === "order" ? "bg-[#FF6B4A] text-white shadow-md font-bold" : "text-gray-400 hover:text-white"
          }`}
        >
          <QrCode size={14} />
          <span>Order Food via QR</span>
        </button>
      </div>

      {/* Decoded Success Toast */}
      {decodedResult && (
        <div className="bg-[#63B46C] text-white p-3.5 rounded-[20px] flex items-center gap-3 shadow-lg my-2 z-20 animate-bounce">
          <CheckCircle2 size={24} className="shrink-0" />
          <div className="flex-1 text-xs">
            <p className="font-bold text-sm">QR Code Decoded!</p>
            <p className="text-white/90">
              Restaurant: <strong>{decodedResult.restaurantId}</strong> • Table: <strong>{decodedResult.tableId}</strong>
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMsg && (
        <div className="bg-red-500/20 border border-red-500/40 text-red-200 p-3 rounded-[16px] text-xs flex items-center gap-2 my-2">
          <AlertCircle size={16} className="shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Viewfinder / Video Feed Container */}
      <div className="relative w-full max-w-xs aspect-square mx-auto my-auto rounded-[32px] border-2 border-dashed border-[#FF6B4A]/60 flex flex-col items-center justify-center p-6 text-center overflow-hidden bg-black/40 shadow-2xl">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover ${isCameraActive ? "opacity-100" : "opacity-0"}`}
        />

        {/* Animated scanning laser line */}
        <motion.div
          animate={{ y: [-100, 100, -100] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
          className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#FF6B4A] to-transparent shadow-[0_0_15px_#FF6B4A] z-10"
        />

        <QrCode size={56} className="text-[#FF6B4A] opacity-40 mb-2 animate-pulse z-10" />
        <p className="text-xs font-semibold text-gray-200 z-10 bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm">
          Point camera at table QR code
        </p>

        {cameraError && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-4 z-20 space-y-2">
            <Camera size={32} className="text-gray-400 opacity-60" />
            <p className="text-xs text-gray-300 max-w-xs">{cameraError}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs border-white/30 text-white hover:bg-white/10 mt-1"
            >
              <Upload size={14} className="mr-1.5" /> Upload QR Image
            </Button>
          </div>
        )}
      </div>

      {/* Camera Unsupported Fallback & Manual Input Controls */}
      <div className="space-y-3 max-w-md mx-auto w-full z-10 pb-4 pt-2">
        {/* Upload QR Image Button */}
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/15 rounded-[20px] text-xs font-bold text-white flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Upload size={16} className="text-[#FF6B4A]" />
            <span>Upload QR Image</span>
          </button>
        </div>

        {/* Manual Code / QR URL Input */}
        <form onSubmit={handleManualSubmit} className="flex gap-2 pt-1">
          <input
            type="text"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder="Paste QR URL (/r/spice-symphony/table/T12)"
            className="flex-1 bg-white/10 border border-white/20 rounded-[20px] px-4 py-3 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FF6B4A]"
          />
          <button
            type="submit"
            className="bg-[#FF6B4A] hover:bg-[#e5592e] text-white font-bold text-xs px-5 py-3 rounded-[20px] shadow-md transition-all active:scale-95"
          >
            Go
          </button>
        </form>
      </div>
    </div>
  );
}
