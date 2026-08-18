"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, QrCode, Tag, Leaf } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const BANNERS = [
  {
    id: 1,
    badge: "TODAY'S SPECIAL",
    title: "Fresh Flavors Exciting Offers",
    discount: "Flat 30% OFF",
    subtitle: "On Your First Order",
    cta: "ORDER NOW",
    href: "/explore",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80",
    bgGradient: "linear-gradient(135deg, #FEF9EF 0%, #FFF1EE 100%)",
  },
  {
    id: 2,
    badge: "DINE-IN EXPERIENCE",
    title: "Artisanal Pizzas & Fresh Brews",
    discount: "Flat 20% OFF",
    subtitle: "At Top Rated Restaurants",
    cta: "EXPLORE PLACES",
    href: "/explore",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80",
    bgGradient: "linear-gradient(135deg, #EFF7EE 0%, #FEF9EF 100%)",
  },
];

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const banner = BANNERS[currentSlide]!;

  return (
    <div className="relative my-3">
      <div className="relative rounded-[24px] overflow-hidden min-h-[170px] border border-[#ECECEC] shadow-card">
        <AnimatePresence mode="wait">
          <motion.div
            key={banner.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35, ease: [0, 0, 0.2, 1] }}
            className="p-5 flex items-center justify-between min-h-[170px] relative overflow-hidden"
            style={{ background: banner.bgGradient }}
          >
            {/* Ambient Decorative Leaves */}
            <div className="absolute top-2 right-36 opacity-20 pointer-events-none">
              <Leaf size={60} className="text-[#63B46C]" />
            </div>

            {/* Left Content Column */}
            <div className="space-y-2 max-w-[60%] z-10">
              <div className="inline-flex items-center gap-1 bg-[#63B46C]/15 text-[#63B46C] px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider">
                <Sparkles size={11} />
                <span>{banner.badge}</span>
              </div>

              <h2 className="font-display font-bold text-[#222222] text-xl sm:text-2xl leading-tight">
                {banner.title}
              </h2>

              <div className="space-y-0.5">
                <p className="font-display font-extrabold text-[#FF6B4A] text-sm sm:text-base">
                  {banner.discount}
                </p>
                <p className="text-[11px] text-[#666666] font-medium">{banner.subtitle}</p>
              </div>

              <div className="pt-1">
                <Link
                  id={`hero-cta-${banner.id}`}
                  href={banner.href}
                  className="inline-flex items-center gap-1.5 bg-[#FF6B4A] text-white font-display font-bold text-xs px-4 py-2 rounded-[18px] shadow-button hover:bg-[#FF5232] active:scale-[0.97] transition-all min-h-[40px]"
                >
                  <span>{banner.cta}</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>

            {/* Right Food Image (Matching reference mockup circle format) */}
            <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden shadow-md border-4 border-white flex-shrink-0 z-10">
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                className="object-cover"
                sizes="160px"
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination Dots */}
      <div className="flex items-center justify-center gap-1.5 mt-2.5">
        {BANNERS.map((b, idx) => (
          <button
            key={b.id}
            onClick={() => setCurrentSlide(idx)}
            className={`transition-all duration-300 rounded-full ${
              currentSlide === idx
                ? "w-6 h-2 bg-[#63B46C]"
                : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
