// src/app/api/analytics/tileview/route.js
import { supabaseAdmin } from "../../../../lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { tileId, visitorId } = await req.json();
    if (!tileId) {
      return NextResponse.json({ error: "tileId required" }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from("tile_views").insert([
      {
        tile_id: tileId,
        visitor_id: visitorId,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("Tile view insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Tile view API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}