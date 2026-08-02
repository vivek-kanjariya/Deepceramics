"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default function Dashboard() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    tiles: 0,
    images: 0,
    categories: 0,
    users: 1,
    pageViewsToday: 0,
    uniqueVisitorsToday: 0,
  });
  const [analytics, setAnalytics] = useState({
    mostViewedTile: null,
    topSearch: null,
    storageCount: 0,
    tileCount: 0,
    pageViewCount: 0,
  });
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [error, setError] = useState("");
  const abortRef = useRef(null);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }, [router]);

  const fetchDashboardStats = useCallback(async () => {
    try {
      const { count: tileCount, error: tileError } = await supabase
        .from("tiles")
        .select("*", { count: "exact", head: true });

      const { data: files, error: storageError } = await supabase
        .storage
        .from("tile-images")
        .list();

      const { data: categoryRows, error: categoryError } = await supabase
        .from("tiles")
        .select("category_id");

      if (tileError) console.error("Tile count error:", tileError);
      if (storageError) console.error("Storage list error:", storageError);
      if (categoryError) console.error("Category fetch error:", categoryError);

      setStats((prev) => ({
        ...prev,
        ...(tileError ? {} : { tiles: tileCount || 0 }),
        ...(storageError ? {} : { images: files?.length || 0 }),
        ...(categoryError || !categoryRows
          ? {}
          : {
              categories: new Set(categoryRows.map((r) => r.category_id)).size,
            }),
      }));
    } catch (err) {
      console.error("Failed to load dashboard metrics:", err);
    }
  }, []);

  const fetchAnalytics = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/admin/stats", {
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`Analytics API responded with ${res.status}`);
      const data = await res.json();

      setAnalytics({
        mostViewedTile: data.mostViewedTile ?? null,
        topSearch: data.topSearch ?? null,
        storageCount: data.storageCount ?? 0,
        tileCount: data.tileCount ?? 0,
        pageViewCount: data.pageViewCount ?? 0,
      });

      setStats((prev) => ({
        ...prev,
        pageViewsToday: data.pageViewsToday ?? prev.pageViewsToday,
        uniqueVisitorsToday: data.uniqueVisitorsToday ?? prev.uniqueVisitorsToday,
      }));
    } catch (err) {
      if (err.name === "AbortError") return;
      console.error("Analytics fetch error:", err);
      setError("Failed to load analytics data. Please refresh to try again.");
    } finally {
      setLoadingAnalytics(false);
    }
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/admin/login");
      } else {
        setCheckingAuth(false);
        fetchDashboardStats();
        fetchAnalytics();
      }
    };
    checkUser();
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, [router, fetchDashboardStats, fetchAnalytics]);

  const hasSearched = useRef(false);
  useEffect(() => {
    if (!hasSearched.current) {
      if (searchQuery !== "") hasSearched.current = true;
      return;
    }
    if (searchQuery.trim() === "") return;
    router.push(`/admin/tiles?q=${encodeURIComponent(searchQuery.trim())}`);
  }, [searchQuery, router]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500 font-medium">Verifying credentials...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-5">
          <h1 className="text-2xl font-bold">Deep Ceramics Admin</h1>
          <button
            onClick={logout}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* ==== STATS CARDS (Original 4) ==== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card title="Tiles" value={stats.tiles.toString()} />
          <Card title="Images" value={stats.images.toString()} />
          <Card
            title="Categories"
            value={stats.categories.toString()}
            action={{ label: "Manage categories", href: "/admin/categories" }}
            router={router}
          />
          <Card title="Users" value={stats.users.toString()} />
        </div>

        {/* ==== ANALYTICS CARDS (only numbers) ==== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
          <Card title="Page Views (Today)" value={stats.pageViewsToday.toString()} />
          <Card title="Unique Visitors (Today)" value={stats.uniqueVisitorsToday.toString()} />
          <Card
            title="Most Viewed Tile"
            value={analytics.mostViewedTile?.name ?? "—"}
            action={
              analytics.mostViewedTile
                ? {
                    label: "View",
                    href: `/admin/tiles/${analytics.mostViewedTile.id}`,
                  }
                : null
            }
            router={router}
          />
          <Card title="Top Search" value={analytics.topSearch?.query ?? "—"} />
        </div>

        {/* ==== STORAGE & HEALTH CARDS ==== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
          <Card title="Storage Files" value={analytics.storageCount.toString()} />
          <Card title="Total Tiles" value={analytics.tileCount.toString()} />
          <Card title="Total Page Views" value={analytics.pageViewCount.toString()} />
        </div>

        {/* ==== SEARCH BAR ==== */}
        <div className="mt-8 bg-white rounded-xl shadow p-6">
          <input
            type="text"
            placeholder="Search tiles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border rounded-lg p-3 outline-none focus:border-black transition-all"
          />
        </div>

        {/* ==== ACTION BUTTONS ==== */}
        <div className="mt-8 flex flex-wrap gap-4">
          <button
            onClick={() => router.push("/admin/upload")}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            + Add Tile
          </button>
          <button
            onClick={() => router.push("/admin/bulk-upload")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Bulk Upload
          </button>
          <button
            onClick={() => router.push("/admin/tiles")}
            className="bg-white border px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Manage Tiles
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg text-sm">
            ⚠️ {error}
          </div>
        )}
      </div>
    </main>
  );
}

function Card({ title, value, action, router }) {
  return (
    <div className="bg-white rounded-xl shadow p-5 border border-gray-100">
      <h2 className="text-gray-500 text-sm font-medium">{title}</h2>
      <p className="text-3xl font-bold mt-2 text-gray-900">{value}</p>
      {action && router && (
        <button
          onClick={() => router.push(action.href)}
          className="mt-3 text-xs text-gray-500 border border-gray-200 rounded px-2 py-1 hover:bg-gray-50 transition-colors"
        >
          {action.label} →
        </button>
      )}
    </div>
  );
}