// src/app/api/analytics/search/route.js
import { supabaseAdmin } from "../../../../lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { query, resultCount, filters, visitorId } = await req.json();

    const { error } = await supabaseAdmin.from("search_queries").insert([
      {
        query,
        result_count: resultCount,
        filters: filters || {},
        visitor_id: visitorId,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("Search insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Search API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}