// src/app/api/analytics/filter/route.js
import { supabaseAdmin } from "../../../../src/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { filterType, filterValue, visitorId } = await req.json();

    const { error } = await supabaseAdmin.from("filter_usage").insert([
      {
        filter_type: filterType,
        filter_value: filterValue,
        visitor_id: visitorId,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("Filter usage insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Filter API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// NEW DEPLOYMENT