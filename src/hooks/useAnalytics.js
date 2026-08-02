// src/hooks/useAnalytics.js
import { useEffect } from "react";
import { usePathname } from "next/navigation";

// FIX: Named export (not default). AnalyticsTracker imports { usePageView } from here.
export function usePageView() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    fetch("/api/analytics/pageview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname }),
    }).catch((err) => {
      console.error("Page view tracking failed:", err);
    });
  }, [pathname]);
}