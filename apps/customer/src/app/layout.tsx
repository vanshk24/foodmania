import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";

import "./globals.css";

// ── Fonts ────────────────────────────────────────────────────────────────────
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

// ── Metadata ─────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: "Food Mania — Scan. Order. Enjoy.",
    template: "%s | Food Mania",
  },
  description:
    "Discover restaurants, reserve tables, scan QR codes to order, and pay online — all in one place. Food Mania makes dining effortless.",
  keywords: [
    "restaurant discovery",
    "table booking",
    "QR ordering",
    "digital menu",
    "food delivery",
    "restaurant near me",
    "Food Mania",
  ],
  authors: [{ name: "Food Mania" }],
  creator: "Food Mania",
  metadataBase: new URL(process.env["NEXT_PUBLIC_APP_URL"] ?? "https://foodmania.com"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://foodmania.com",
    title: "Food Mania — Scan. Order. Enjoy.",
    description: "Discover restaurants, reserve tables, and order food with a QR scan.",
    siteName: "Food Mania",
  },
  twitter: {
    card: "summary_large_image",
    title: "Food Mania — Scan. Order. Enjoy.",
    description: "Discover restaurants, reserve tables, and order food with a QR scan.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#FF6B00",
};

// ── Root Layout ───────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakartaSans.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased bg-[#F5F6FA] text-[#1A1A2E]">
        {children}
      </body>
    </html>
  );
}
