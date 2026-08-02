"use client";

import { useState, useEffect, memo, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useReducedMotion } from "framer-motion";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Copy,
  Check,
  ChevronRight,
  Star,
  Shield,
  Truck,
  Loader2,
} from "lucide-react";
import ContactForm from "./ContactForm";
import MapWithFallback from "./MapWithFallback";
import Script from "next/script";

// ─── Helpers ────────────────────────────────────────────────────
const sanitizeParam = (value, maxLength = 100) =>
  value?.trim().slice(0, maxLength) || "";

const validateSku = (sku) => /^[A-Z0-9-]*$/.test(sku) ? sku : "";

const getOpenStatus = () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const totalMinutes = hours * 60 + minutes;

  const open = 9 * 60;
  const close = 20 * 60;
  const isOpen = totalMinutes >= open && totalMinutes < close;

  const closeHours = Math.floor(close / 60);
  const closeMinutes = close % 60;
  const closeAmPm = closeHours >= 12 ? "PM" : "AM";
  const displayClose = `${closeHours > 12 ? closeHours - 12 : closeHours}:${String(closeMinutes).padStart(2, "0")} ${closeAmPm}`;

  return {
    isOpen,
    statusText: isOpen ? "Open Now" : "Closed",
    statusColor: isOpen ? "text-green-700 bg-green-50" : "text-red-700 bg-red-50",
    until: isOpen ? `Open until ${displayClose}` : "Closed for today",
  };
};

// ─── Clipboard with fallback ──────────────────────────────────
const copyToClipboard = async (text, setCopied) => {
  try {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  } catch (_) {
    // Fallback
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {
      // Still failed – show a temporary alert
      alert("Unable to copy. Please copy manually.");
    }
    document.body.removeChild(textarea);
  }
};

// ─── Contact Card (memoized) ──────────────────────────────────
const ContactCard = memo(function ContactCard({ icon: Icon, title, content, link, copyText, badge }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (copyText) {
      copyToClipboard(copyText, setCopied);
    }
  };

  return (
    <div className="rounded-2xl border border-[#EAEAEA] bg-white p-5 shadow-sm transition hover:shadow-md group">
      <div className="flex items-start gap-3">
        <div className={`rounded-full p-2 ${title === "Phone" ? "bg-green-50 text-green-600" :
                          title === "Email" ? "bg-blue-50 text-blue-600" :
                          "bg-orange-50 text-orange-600"}`}>
          <Icon size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#9A9A9A]">
            {title}
          </p>
          {link ? (
            <a
              href={link}
              target={link.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              aria-label={title === "Phone" ? `Call ${content}` : title === "Email" ? `Email ${content}` : undefined}
              className="mt-1 text-sm font-medium text-[#121212] hover:text-[#FF6A2E] transition-colors flex items-center gap-1 group"
            >
              {content}
              <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          ) : (
            <p className="mt-1 text-sm text-[#121212]">{content}</p>
          )}
        </div>
        {copyText && (
          <button
            onClick={handleCopy}
            className="flex-shrink-0 p-1 rounded hover:bg-gray-100 transition-colors"
            aria-label="Copy to clipboard"
          >
            {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} className="text-gray-400" />}
          </button>
        )}
      </div>
      {badge && (
        <div className="mt-2">
          <span className={`inline-block text-xs px-2.5 py-1 rounded-full ${badge.color}`}>
            {badge.text}
          </span>
        </div>
      )}
      {/* Accessibility live region for copy feedback */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {copied ? "Copied to clipboard" : ""}
      </div>
    </div>
  );
});
ContactCard.displayName = "ContactCard";

// ─── Trust Signals (memoized) ──────────────────────────────────
const TrustSignals = memo(function TrustSignals() {
  return (
    <div className="p-4 bg-white rounded-xl border border-[#EAEAEA] space-y-2">
      <p className="font-semibold text-[#121212]">Why Choose Deep Ceramics</p>
      <ul className="space-y-1.5 text-sm text-[#6F6F6F]">
        <li className="flex items-center gap-2">
          <Check size={16} className="text-green-600 flex-shrink-0" />
          Premium Brands (Kajaria, Somany, CERA)
        </li>
        <li className="flex items-center gap-2">
          <Check size={16} className="text-green-600 flex-shrink-0" />
          Expert Advice & Project Guidance
        </li>
        <li className="flex items-center gap-2">
          <Check size={16} className="text-green-600 flex-shrink-0" />
          Competitive Pricing & Bulk Discounts
        </li>
        <li className="flex items-center gap-2">
          <Check size={16} className="text-green-600 flex-shrink-0" />
          Fast Delivery & Reliable Service
        </li>
      </ul>
    </div>
  );
});
TrustSignals.displayName = "TrustSignals";

// ─── Map Skeleton ──────────────────────────────────────────────
function MapSkeleton() {
  return (
    <div className="animate-pulse bg-gray-200 h-64 w-full rounded-3xl" />
  );
}

// ─── Main Component ────────────────────────────────────────────
export default function ContactPageContent() {
  const searchParams = useSearchParams();
  const productName = sanitizeParam(searchParams.get("name"), 100);
  const rawSku = sanitizeParam(searchParams.get("sku"), 30);
  const sku = validateSku(rawSku);
  const category = sanitizeParam(searchParams.get("category"), 50);

  const [openStatus, setOpenStatus] = useState(getOpenStatus());
  const shouldReduceMotion = useReducedMotion();

  // Update open status every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setOpenStatus(getOpenStatus());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const defaultMessage = productName
    ? `I'm interested in ${productName}${sku ? ` (SKU: ${sku})` : ""}. Please provide more details about this product.`
    : "";

  const fadeUp = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: { opacity: 1, y: 0 },
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.08 } },
  };

  return (
    <>
      {/* ─── LocalBusiness JSON‑LD ───────────────────────────── */}
      <Script
        id="local-business-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Deep Ceramics.",
            image: "https://deepceramics.in/logo.png",
            telephone: "+91 98989 54803",
            email: "deepceramics@gmail.com",
            priceRange: "₹₹",
            address: {
              "@type": "PostalAddress",
              streetAddress: "19/8 Mahalaxmi Ind Estate, SG Highway, Gota",
              addressLocality: "Ahmedabad",
              addressRegion: "Gujarat",
              postalCode: "382481",
              addressCountry: "IN",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: 23.09053,
              longitude: 72.52305,
            },
            openingHoursSpecification: [
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                opens: "09:00",
                closes: "20:00",
              },
            ],
            sameAs: [
              "https://www.facebook.com/deeptradingnco",
              "https://www.instagram.com/deeptradingnco",
            ],
          }),
        }}
      />

      <div className="min-h-screen bg-[#F7F7F7] text-[#121212]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="py-4 text-sm text-[#6F6F6F] flex items-center gap-2" aria-label="Breadcrumb">
            <a href="/" className="hover:text-[#121212] transition-colors">Home</a>
            <ChevronRight size={14} className="text-[#9A9A9A]" />
            <span className="text-[#121212] font-medium">Contact</span>
          </nav>

          {/* Hero */}
          <motion.section
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.4 }}
            className="py-12 lg:py-20"
          >
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6F6F6F]">
                Deep Ceramics.
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#FF6A2E] sm:text-5xl">
                Contact Us
              </h1>
              <p className="mt-2 text-sm text-[#6F6F6F] flex flex-wrap gap-x-3 gap-y-1">
                <span>Luxury Tiles</span>
                <span className="text-[#9A9A9A]">•</span>
                <span>Sanitaryware</span>
                <span className="text-[#9A9A9A]">•</span>
                <span>Bath Fittings</span>
              </p>
              <p className="mt-5 text-base leading-relaxed text-[#6F6F6F] sm:text-lg">
                Whether you’re planning a new space or upgrading an existing one,
                our team is ready to help with our end-to-end solutions.
              </p>
              <div className="mt-6 p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-[#EAEAEA]">
                <p className="text-sm font-medium text-[#121212]">
                  💬 Need help selecting tiles? Our experts will contact you within 24 hours.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Main Grid */}
          <section className="grid grid-cols-1 items-start gap-10 pb-16 lg:grid-cols-[1fr_480px] lg:gap-16">
            {/* Left Column */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="space-y-10"
            >
              <motion.div variants={fadeUp}>
                <h2 className="text-2xl font-semibold tracking-tight">Visit Our Showroom</h2>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-[#6F6F6F]">
                  Experience materials, finishes, and premium solutions in person
                  with expert guidance from our team.
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="grid gap-4 sm:grid-cols-2">
                <ContactCard
                  icon={MapPin}
                  title="Address"
                  content="19/8 Mahalaxmi Ind Estate, SG Highway, Gota, Ahmedabad"
                  link="https://maps.google.com/maps?daddr=19/8+Mahalaxmi+Ind+Estate,+SG+Highway,+Gota,+Ahmedabad"
                  copyText="19/8 Mahalaxmi Ind Estate, SG Highway, Gota, Ahmedabad"
                />
                <ContactCard
                  icon={Phone}
                  title="Phone"
                  content="+91 98989 54803"
                  link="tel:+919898954803"
                  copyText="+919898954803"
                />
                <ContactCard
                  icon={Phone}
                  title="Phone"
                  content="+91 99741 65307"
                  link="tel:+919974165307"
                  copyText="+919974165307"
                />
                <ContactCard
                  icon={Mail}
                  title="Email"
                  content="deepceramics@gmail.com"
                  link="mailto:deepceramics@gmail.com"
                  copyText="deepceramics@gmail.com"
                />
                <div className="sm:col-span-2">
                  <ContactCard
                    icon={Clock}
                    title="Working Hours"
                    content="Monday – Sunday • 9:00 AM – 8:00 PM"
                    badge={{
                      text: openStatus.statusText,
                      color: openStatus.isOpen ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700",
                    }}
                  />
                  <p className="mt-1 text-xs text-[#6F6F6F] pl-12">
                    {openStatus.until}
                  </p>
                </div>
              </motion.div>

              <motion.div variants={fadeUp}>
                <Suspense fallback={<MapSkeleton />}>
                  <MapWithFallback
                    embedSrc="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24689.925148142553!2d72.5230525745136!3d23.090530194892732!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e833c8d0cf63f%3A0x5a0631a9075c6bf4!2sDEEP%20TRADING%20COMPANY!5e0!3m2!1sen!2sin!4v1768113210948!5m2!1sen!2sin"
                    fallbackLink="https://maps.google.com/maps?q=19/8+Mahalaxmi+Ind+Estate,+SG+Highway,+Gota,+Ahmedabad"
                  />
                </Suspense>
              </motion.div>

              <motion.div variants={fadeUp} className="lg:hidden">
                <TrustSignals />
              </motion.div>
            </motion.div>

            {/* Right Column: Form */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="lg:sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto lg:overflow-visible"
            >
              {/* Product Context */}
              {productName && (
                <div className="mb-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-[#EAEAEA] shadow-sm space-y-2">
                  <p className="text-xs text-[#6F6F6F] uppercase tracking-wider">Selected Product</p>
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#121212]">{productName}</p>
                      {sku && <p className="text-sm text-[#6F6F6F]">SKU: {sku}</p>}
                      {category && <p className="text-sm text-[#6F6F6F]">Category: {category}</p>}
                    </div>
                  </div>
                </div>
              )}

              <ContactForm
                defaultMessage={defaultMessage}
                productName={productName}
                sku={sku}
              />

              <div className="mt-6 hidden lg:block">
                <TrustSignals />
              </div>
            </motion.div>
          </section>
        </div>
      </div>
    </>
  );
}