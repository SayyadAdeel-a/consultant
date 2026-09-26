import { createBrowserClient } from "@supabase/ssr";
import { getPublicSupabaseConfig, isSupabaseConfigured } from "@/lib/env";

/**
 * Browser-side Supabase client (anon key, RLS enforced).
 *
 * Only use in Client Components for interactions that are safe to expose:
 * the admin login form, optimistic UI, etc. All privileged work must run on
 * the server (see server.ts / admin.ts). Returns null when Supabase is not
 * configured so the UI can degrade gracefully instead of crashing.
 */
export function createClient() {
  if (!isSupabaseConfigured()) return null;
  const { url, anonKey } = getPublicSupabaseConfig();
  return createBrowserClient(url, anonKey);
}
