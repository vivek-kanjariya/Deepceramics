"use client";
// src/components/AnalyticsTracker.jsx
import { usePageView } from "../hooks/useAnalytics"; // FIX: named import, not default

export default function AnalyticsTracker() {
  usePageView();
  return null;
}

// NEW DEV