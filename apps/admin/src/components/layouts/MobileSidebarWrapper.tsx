"use client";
// Isolated client component for mobile sidebar toggle only.
// Keeping this as a Client Component means the parent layout can remain a Server Component,
// which preserves Next.js App Router CSS preload hints and avoids hydration-driven CSS loss.
import React, { useState } from "react";
import { AdminSidebar } from "@/components/layouts/AdminSidebar";
import { AdminHeader } from "@/components/layouts/AdminHeader";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function MobileSidebarWrapper({ children }: { children: React.ReactNode }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#FAF9F5] text-[#222222] overflow-hidden">
      {/* Desktop Fixed Sidebar — always visible on lg+ */}
      <div className="hidden lg:block h-screen sticky top-0 flex-shrink-0">
        <AdminSidebar />
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed top-0 bottom-0 left-0 z-50 w-72 bg-white shadow-2xl lg:hidden overflow-y-auto"
            >
              <div className="p-4 flex items-center justify-between border-b border-[#ECECEC]">
                <span className="font-display font-bold text-sm text-[#222222]">Admin Control Panel</span>
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-[#666666] hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>
              <AdminSidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Admin Content */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto min-w-0">
        <AdminHeader onMobileMenuClick={() => setIsMobileSidebarOpen(true)} />
        <main className="p-4 sm:p-6 flex-1 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
