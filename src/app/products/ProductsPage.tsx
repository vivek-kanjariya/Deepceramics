"use client";

import { useState } from "react";
import Image from "next/image";
import Logo from "./logo.png";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products | Tiles, Sanitaryware & Home Solutions | Deep Ceramics.",
  description:
    "Explore premium wall tiles, floor tiles, sanitaryware, bathroom fittings, kitchen solutions, outdoor tiles, and complete home construction solutions from Deep Ceramics. Ahmedabad.",

  keywords: [
    "Tiles Ahmedabad",
    "Wall Tiles",
    "Floor Tiles",
    "Sanitaryware Ahmedabad",
    "Bathroom Fittings",
    "Kitchen Solutions",
    "Outdoor Tiles",
    "Commercial Tiles",
    "Home Construction Solutions",
    "Deep Ceramics",
  ],

  alternates: {
    canonical: "https://deepceramics.in/products",
  },

  openGraph: {
    title: "Products | Deep Ceramics.",
    description:
      "Premium tiles, sanitaryware, fittings, and complete home solutions for residential and commercial projects.",
    url: "https://deepceramics.in/products",
    siteName: "Deep Ceramics.",
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Products | Deep Ceramics.",
    description:
      "Premium tiles, sanitaryware, fittings, and complete home solutions for residential and commercial projects.",
  },
};

const categories = [
  {
    id: "wall-tiles",
    name: "Wall Tiles",
    description: "Transform your walls into modern, elegant surfaces.",
    image:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "floor-tiles",
    name: "Floor Tiles",
    description: "Durable and stylish tiles for every room.",
    image:
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "sanitaryware",
    name: "Sanitaryware",
    description: "Hygienic and modern designs for bathrooms.",
    image:
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "bath-fittings",
    name: "Bathroom Fittings",
    description: "Premium faucets, showers and bath accessories.",
    image:
      "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "kitchen-solutions",
    name: "Kitchen Solutions",
    description: "Stylish and functional kitchen surfaces and fittings.",
    image:
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "end-to-end",
    name: "End-to-End Home Solutions",
    description: "Complete design, supply, and installation handled by us.",
    image:
      "https://images.unsplash.com/photo-1618220912250-f60cd46a28b3?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "outdoor-tiles",
    name: "Outdoor Tiles",
    description: "Weather-resistant tiles perfect for patios and exteriors.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "commercial-projects",
    name: "Commercial Projects",
    description: "High-volume solutions for offices, shops, and showrooms.",
    image:
      "https://images.unsplash.com/photo-1529424301806-4be0bb154e3b?auto=format&fit=crop&w=1600&q=80",
  },
];

export default function ProductsPage() {
  const [active, setActive] = useState(null);

  return (
    <div className="min-h-screen bg-[#F7F7F7] text-[#121212]">
      {/* HEADER */}
      <section className="mx-auto flex max-w-7xl items-center gap-4 px-6 pb-10 pt-16 md:gap-6">
        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-white shadow-lg">
          <Image
            src={Logo}
            alt="Deep Ceramics."
            width={56}
            height={56}
            priority
          />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6F6F6F]">
            Deep Ceramics.
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#FF6A2E] md:text-4xl">
            Surfaces that define your space.
          </h1>
          <p className="mt-3 max-w-xl text-sm text-[#212121] md:text-base">
            Multi-brand tiles, sanitaryware, and complete home solutions curated
            for modern Indian homes and commercial projects.
          </p>
        </div>
      </section>

      {/* GRID */}
      <section className="mx-auto grid max-w-7xl auto-rows-[260px] grid-cols-1 gap-6 px-6 pb-24 md:auto-rows-[280px] md:grid-cols-3">
        {categories.map((cat, index) => (
          <button
            key={cat.id}
            onClick={() => setActive(cat)}
            className={`group relative overflow-hidden rounded-2xl border border-[#1F1F1F] bg-[#1F1F1F] text-left shadow-sm
              transition-transform duration-200 hover:-translate-y-0.5
              ${
                index === 0 || index === 4
                  ? "md:col-span-2 md:row-span-2"
                  : ""
              }`}
          >
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover opacity-80"
              loading="lazy"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/95 via-[#121212]/40 to-transparent" />

            <div className="relative z-10 flex h-full flex-col justify-end p-5 sm:p-6">
              <span className="mb-2 inline-flex rounded-full bg-[#FF6A2E]/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#FF6A2E]">
                Deep | Category
              </span>
              <h2 className="text-xl font-semibold text-white md:text-2xl">
                {cat.name}
              </h2>
              <p className="mt-1 max-w-md text-sm text-[#EDEDED]/85">
                {cat.description}
              </p>
              <span className="mt-3 text-sm font-medium text-[#FF6A2E]">
                View category →
              </span>
            </div>
          </button>
        ))}
      </section>

      {/* MODAL */}
      {active && (
        <div
          onClick={() => setActive(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#121212]/70 px-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <Image
              src={active.image}
              alt={active.name}
              width={800}
              height={400}
              className="h-60 w-full object-cover"
              priority
            />

            <div className="space-y-5 p-6">
              <h3 className="text-2xl font-semibold text-[#FF2E2E]">
                {active.name}
              </h3>
              <p className="text-sm text-[#6F6F6F]">{active.description}</p>

              <div className="flex gap-3">
                {/* <button className="rounded-full bg-[#FF6A2E] px-4 py-1.5 text-sm text-white hover:bg-[#FF2E2E]">
                  Book a consultation
                </button> */}
                <button
                  onClick={() => setActive(null)}
                  className="text-sm text-[#6F6F6F] underline"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
