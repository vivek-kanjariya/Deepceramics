// src/app/admin/logs/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default function AdminLogs() {
  const router = useRouter();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/admin/login");
        return;
      }
      // fetch logs (just a test)
      setLoading(false);
    };
    checkUser();
  }, [router]);

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Admin Logs</h1>
        <p className="text-gray-600">This is a test page.</p>
        <button
          onClick={() => router.push("/admin/dashboard")}
          className="mt-4 text-sm text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}