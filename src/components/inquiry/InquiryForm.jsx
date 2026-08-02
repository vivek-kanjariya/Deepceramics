// src/components/inquiry/InquiryForm.jsx
"use client";

import { useRouter } from "next/navigation";

export default function InquiryForm({ tile }) {
  const router = useRouter();

  const handleInquire = () => {
    const params = new URLSearchParams();
    if (tile) {
      params.set("product", tile.slug);
      params.set("name", tile.name);
      if (tile.sku) params.set("sku", tile.sku);
    }
    router.push(`/contact?${params.toString()}`);
  };

  return (
    <button
      onClick={handleInquire}
      className="w-full sm:w-auto bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
    >
      Get Quote
    </button>
  );
}