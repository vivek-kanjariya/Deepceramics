// src/app/contact/ContactPageClient.jsx
"use client";

import { useState, useEffect, memo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
  Shield,
  Truck,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// ─── HELPERS ──────────────────────────────────────────────────
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
      alert("Unable to copy. Please copy manually.");
    }
    document.body.removeChild(textarea);
  }
};

// ─── COMPONENTS ──────────────────────────────────────────────
const ContactCard = memo(function ContactCard({
  icon: Icon,
  title,
  content,
  link,
  copyText,
  badge,
}) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    if (copyText) copyToClipboard(copyText, setCopied);
  };

  const colorClass =
    title === "Phone"
      ? "bg-green-50 text-green-600"
      : title === "Email"
      ? "bg-blue-50 text-blue-600"
      : "bg-orange-50 text-orange-600";

  return (
    <div className="rounded-2xl border border-[#EAEAEA] bg-white p-5 shadow-sm transition hover:shadow-md group">
      <div className="flex items-start gap-3">
        <div className={`rounded-full p-2 ${colorClass}`}>
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
              aria-label={
                title === "Phone" ? `Call ${content}` : title === "Email" ? `Email ${content}` : undefined
              }
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
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {copied ? "Copied to clipboard" : ""}
      </div>
    </div>
  );
});
ContactCard.displayName = "ContactCard";

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

function MapSkeleton() {
  return <div className="animate-pulse bg-gray-200 h-64 w-full rounded-3xl" />;
}

function MapWithFallback({ embedSrc, fallbackLink }) {
  const [error, setError] = useState(false);

  return (
    <div className="overflow-hidden rounded-3xl border border-[#EAEAEA] bg-white shadow-md">
      <div className="flex items-center justify-between border-b border-[#EAEAEA] px-6 py-4">
        <div>
          <h3 className="text-sm font-semibold">Ahmedabad Showroom</h3>
          <p className="mt-1 text-xs text-[#6F6F6F]">
            Visit us for premium tile & sanitary solutions
          </p>
        </div>
        <span className="rounded-full bg-[#FFF1EA] px-3 py-1 text-xs font-medium text-[#FF6A2E]">
          Open Now
        </span>
      </div>
      <div className="relative h-64 w-full overflow-hidden bg-gray-100">
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 p-4 text-center">
            <MapPin className="text-gray-400 mb-2" size={32} />
            <p className="text-sm text-gray-500">Could not load map</p>
            <a
              href={fallbackLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-sm text-[#FF6A2E] hover:underline"
            >
              View on Google Maps →
            </a>
          </div>
        ) : (
          <iframe
            title="Ahmedabad Showroom Location"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full w-full border-0"
            src={embedSrc}
            onError={() => setError(true)}
          />
        )}
      </div>
    </div>
  );
}

// ─── CONTACT FORM ─────────────────────────────────────────────
const WEB3FORMS_ACCESS_KEY = "a737a164-c2af-444a-8411-329e47d96058";

function ContactForm({ defaultMessage = "", productName = "", sku = "" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [offline, setOffline] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", message: defaultMessage });
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({ show: false, type: "", message: "" });
  const [successRef, setSuccessRef] = useState(null);

  useEffect(() => {
    const handleOffline = () => setOffline(true);
    const handleOnline = () => setOffline(false);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, message: defaultMessage }));
  }, [defaultMessage]);

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "name":
        if (!value.trim()) error = "Name is required";
        else if (value.trim().length < 2) error = "Minimum 2 characters";
        break;
      case "phone":
        if (!value.trim()) error = "Phone is required";
        else if (!/^[0-9+\-\s()]+$/.test(value)) error = "Invalid phone";
        break;
      case "message":
        if (!value.trim()) error = "Message is required";
        else if (value.trim().length < 10) error = "Minimum 10 characters";
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (offline) {
      setNotification({ show: true, type: "error", message: "You're offline. Please reconnect and try again." });
      setTimeout(() => setNotification({ show: false, type: "", message: "" }), 5000);
      return;
    }

    const tempErrors = {};
    if (formData.name.trim().length < 2) tempErrors.name = "Invalid name";
    if (!/^[0-9+\-\s()]+$/.test(formData.phone)) tempErrors.phone = "Invalid phone";
    if (formData.message.trim().length < 10) tempErrors.message = "Message too short";

    setErrors(tempErrors);
    if (Object.keys(tempErrors).length > 0) return;

    setLoading(true);

    let fullMessage = formData.message;
    if (productName || sku) {
      fullMessage += "\n\n--- Product Details ---";
      if (productName) fullMessage += `\nProduct: ${productName}`;
      if (sku) fullMessage += `\nSKU: ${sku}`;
    }

    const subject = productName
      ? `New Inquiry from ${formData.name} — Product: ${productName}`
      : `New Inquiry from ${formData.name} — Deep Ceramics.`;

    const payload = {
      access_key: WEB3FORMS_ACCESS_KEY,
      subject,
      from_name: "Deep Ceramics. Website",
      name: formData.name,
      phone: formData.phone,
      message: fullMessage,
      product_name: productName || "Not specified",
      product_sku: sku || "Not specified",
      botcheck: "",
    };

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (data.success) {
        const ref = `DEEP-${Date.now().toString(36).toUpperCase()}`;
        setSuccessRef(ref);
        setNotification({ show: true, type: "success", message: "Request submitted successfully!" });
        setFormData({ name: "", phone: "", message: "" });
        setErrors({});
        setTimeout(() => {
          setSuccessRef(null);
          setNotification({ show: false, type: "", message: "" });
          router.push("/products");
        }, 5000);
      } else {
        setNotification({ show: true, type: "error", message: data.message || "Submission failed" });
      }
    } catch (error) {
      console.error(error);
      setNotification({ show: true, type: "error", message: "Network error. Please try again." });
    } finally {
      setLoading(false);
      setTimeout(() => {
        if (notification.type !== "success") {
          setNotification({ show: false, type: "", message: "" });
        }
      }, 4000);
    }
  };

  return (
    <div className="rounded-2xl border border-[#EAEAEA] bg-white p-6 shadow-md lg:p-8">
      {notification.show && (
        <div
          className={`mb-6 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {notification.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{notification.message}</span>
          {notification.type === "success" && successRef && (
            <span className="ml-auto text-xs opacity-80">Ref: {successRef}</span>
          )}
        </div>
      )}
      {offline && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-yellow-50 px-4 py-3 text-sm text-yellow-700 border border-yellow-200">
          <AlertCircle size={18} /> You're offline. Please check your connection.
        </div>
      )}

      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-[#121212]">Send an Inquiry</h2>
          <p className="mt-1 text-sm text-[#6F6F6F]">Fill out the form and our team will get back to you shortly.</p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#6F6F6F] bg-[#F7F7F7] px-3 py-1.5 rounded-full">
          <Shield size={14} className="text-green-600" /> Secure
          <span className="mx-1">•</span>
          <Clock size={14} className="text-[#FF6A2E]" /> Avg. 2h response
        </div>
      </div>

      <input type="checkbox" name="botcheck" style={{ display: "none" }} readOnly />

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-[#121212]">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className={`w-full rounded-xl border bg-[#F7F7F7] px-4 py-3 text-sm outline-none transition focus:border-[#FF6A2E] focus:bg-white ${
              errors.name ? "border-red-500" : "border-[#EAEAEA]"
            }`}
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-[#121212]">Phone Number</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91 98765 43210"
            className={`w-full rounded-xl border bg-[#F7F7F7] px-4 py-3 text-sm outline-none transition focus:border-[#FF6A2E] focus:bg-white ${
              errors.phone ? "border-red-500" : "border-[#EAEAEA]"
            }`}
          />
          {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-[#121212]">Message</label>
          <textarea
            rows={5}
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us about your project..."
            className={`w-full resize-none rounded-xl border bg-[#F7F7F7] px-4 py-3 text-sm outline-none transition focus:border-[#FF6A2E] focus:bg-white ${
              errors.message ? "border-red-500" : "border-[#EAEAEA]"
            }`}
          />
          <div className="mt-1 flex justify-between text-xs text-[#9A9A9A]">
            {errors.message ? <span className="text-red-500">{errors.message}</span> : <span />}
            <span>{formData.message.length}/1000</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || offline}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FF6A2E] to-[#FF2E2E] px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:opacity-95 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Submitting...
            </>
          ) : (
            <>
              Submit Inquiry <span>→</span>
            </>
          )}
        </button>
        <div className="mt-2 flex items-center justify-center gap-2 text-xs text-[#6F6F6F] sm:hidden">
          <Shield size={14} className="text-green-600" /> Secure
          <span className="mx-1">•</span>
          <Clock size={14} className="text-[#FF6A2E]" /> Avg. 2h response
        </div>
      </form>
      <div className="mt-6 border-t border-[#EAEAEA] pt-4 text-xs text-[#9A9A9A]">
        Your information remains secure and is only used to respond to your inquiry. It won't be shared with any third‑party services.
      </div>
    </div>
  );
}

// ─── MAIN CLIENT COMPONENT ────────────────────────────────────
export default function ContactPageClient() {
  const searchParams = useSearchParams();
  const productName = sanitizeParam(searchParams.get("name"), 100);
  const rawSku = sanitizeParam(searchParams.get("sku"), 30);
  const sku = validateSku(rawSku);
  const category = sanitizeParam(searchParams.get("category"), 50);

  const [openStatus, setOpenStatus] = useState(getOpenStatus());
  const shouldReduceMotion = useReducedMotion();

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
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6F6F6F]">Deep Ceramics.</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#FF6A2E] sm:text-5xl">Contact Us</h1>
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
          <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-10">
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
                <p className="mt-1 text-xs text-[#6F6F6F] pl-12">{openStatus.until}</p>
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

            <ContactForm defaultMessage={defaultMessage} productName={productName} sku={sku} />

            <div className="mt-6 hidden lg:block">
              <TrustSignals />
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}