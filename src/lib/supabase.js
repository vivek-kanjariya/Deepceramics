// src/lib/supabase.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// ✅ Validate required keys
if (!supabaseUrl) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL in .env.local");
if (!supabaseAnonKey) throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local");

// Client-side (browser) – uses anon key
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side (API routes) – uses service role key (bypasses RLS)
// If the service key is missing, we still create the client (will fail when used)
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey || supabaseAnonKey // fallback to anon if service key not set (optional)
);