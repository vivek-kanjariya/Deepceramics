"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";

export default function MapWithFallback({ embedSrc, fallbackLink }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <a
        href={fallbackLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-3 h-64 w-full rounded-3xl bg-gray-100 border border-[#EAEAEA] hover:bg-gray-200 transition-colors text-[#6F6F6F] hover:text-[#121212]"
      >
        <MapPin size={20} />
        <span className="text-sm font-medium">Open in Google Maps</span>
      </a>
    );
  }

  return (
    <div className="rounded-3xl overflow-hidden border border-[#EAEAEA] shadow-sm">
      <iframe
        src={embedSrc}
        width="100%"
        height="300"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        onError={() => setFailed(true)}
        title="Deep Ceramics Showroom Location"
      />
    </div>
  );
}