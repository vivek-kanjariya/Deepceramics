"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";  // ← change from @/lib/supabase to relative path

const MasterContext = createContext();

export function MasterProvider({ children }) {
  const [masters, setMasters] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMasters = async () => {
      try {
        const [categoriesRes, sizesRes, finishesRes, colorsRes, seriesRes] = await Promise.all([
          supabase.from("categories").select("id, name").order("name"),
          supabase.from("sizes").select("id, label").order("label"),
          supabase.from("finishes").select("id, name").order("name"),
          supabase.from("colors").select("id, name").order("name"),
          supabase.from("series").select("id, name").order("name"),
        ]);

        setMasters({
          categories: categoriesRes.data || [],
          sizes: sizesRes.data || [],
          finishes: finishesRes.data || [],
          colors: colorsRes.data || [],
          series: seriesRes.data || [],
        });
      } catch (error) {
        console.error("Failed to fetch masters:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMasters();
  }, []);

  return (
    <MasterContext.Provider value={{ masters, loading }}>
      {children}
    </MasterContext.Provider>
  );
}

export function useMasters() {
  const context = useContext(MasterContext);
  if (!context) {
    throw new Error("useMasters must be used within a MasterProvider");
  }
  return context;
}