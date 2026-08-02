// src/app/api/analytics/pageview/route.js
import { supabaseAdmin } from "../../../../lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { url, visitorId, referrer, userAgent } = await req.json();

    // Get IP address from request headers (if behind proxy, use x-forwarded-for)
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("remote-addr") || null;

    const { error } = await supabaseAdmin.from("page_views").insert([
      {
        url,
        visitor_id: visitorId,
        referrer,
        user_agent: userAgent,
        ip_address: ip,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("Page view insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Page view API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}