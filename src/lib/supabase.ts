import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

let supabaseAnonInstance: SupabaseClient | null = null;
let supabaseServiceInstance: SupabaseClient | null = null;

/**
 * Client-side Supabase client (anon key). Use in client components.
 */
export function getSupabase(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  if (!supabaseAnonInstance) {
    supabaseAnonInstance = createClient(supabaseUrl, supabaseAnonKey);
  }

  return supabaseAnonInstance;
}

/**
 * Server-side Supabase client (service role key). Bypasses RLS.
 * Use in API routes and server actions only.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseServiceKey) {
    // Fall back to anon key if service key not configured
    return getSupabase();
  }

  if (!supabaseServiceInstance) {
    supabaseServiceInstance = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }

  return supabaseServiceInstance;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}
