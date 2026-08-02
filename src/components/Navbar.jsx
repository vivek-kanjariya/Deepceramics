"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggle = () => setOpen((o) => !o);
  const close = () => setOpen(false);

  useEffect(() => {
    const handler = () => {
      setScrolled(window.scrollY > 10);
    };

    handler();
    window.addEventListener("scroll", handler);

    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    // { href: "/gallery", label: "Gallery" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <motion.nav
      className="sticky top-0 z-40"
      animate={{
        backgroundColor: scrolled
          ? "rgba(247,247,247,0.96)"
          : "rgba(247,247,247,1)",
        boxShadow: scrolled
          ? "0 8px 20px rgba(0,0,0,0.06)"
          : "0 0 0 rgba(0,0,0,0)",
      }}
      transition={{ duration: 0.25 }}
    >
      <div className="border-b border-[#EDEDED]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:py-3.5">

          {/* Logo / Brand */}
          <Link
            href="/"
            aria-label="Deep Ceramics Home"
            className="flex items-center gap-2 text-base font-semibold text-[#121212] sm:text-lg"
          >
            <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-[#FFFFFF] shadow-sm">
              <Image
                src="/logo.png"
                alt="Deep Ceramics. Logo"
                width={36}
                height={36}
                className="h-8 w-auto object-contain"
                priority
              />
            </span>

            <span className="leading-tight">
              <span className="block text-sm font-semibold tracking-tight">
                Deep Ceramics.
              </span>

              <span className="block text-[11px] font-normal text-[#6F6F6F]">
                Tiles &amp; Home Solutions
              </span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden items-center gap-6 text-sm text-[#6F6F6F] md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-label={l.label}
                className="transition-colors hover:text-[#FF6A2E]"
              >
                {l.label}
              </Link>
            ))}

            <Link
              href="/contact"
              aria-label="Get Quote"
              className="rounded-full bg-[#FF6A2E] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#FF2E2E]"
            >
              Get Quote
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={toggle}
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            className="inline-flex items-center justify-center rounded-md p-2 text-[#121212] hover:bg-[#EDEDED] md:hidden"
          >
            <div className="space-y-1.5">
              <span className="block h-0.5 w-5 bg-[#121212]" />
              <span className="block h-0.5 w-5 bg-[#121212]" />
              <span className="block h-0.5 w-5 bg-[#121212]" />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0, y: -10 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden border-b border-[#EDEDED] bg-[#F7F7F7] md:hidden"
          >
            <div className="mx-auto max-w-6xl space-y-2 px-4 py-3 text-sm text-[#121212]">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-label={l.label}
                  onClick={close}
                  className="block rounded-md px-2 py-2 transition-colors hover:bg-[#EDEDED]"
                >
                  {l.label}
                </Link>
              ))}

              <Link
                href="/contact"
                aria-label="Get Quote"
                onClick={close}
                className="mt-2 block rounded-full bg-[#FF6A2E] px-4 py-2 text-center text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#FF2E2E]"
              >
                Get Quote
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}