import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getSupabaseServerConfig } from "@/lib/env";

/**
 * Cookie-free anon Supabase client for PUBLIC server reads
 * (docs/TASKS.md Task 9.1).
 *
 * Deliberately separate from `createClient()` in `@/lib/supabase/server`:
 * public pages never need the viewer's session, and avoiding `cookies()`
 * keeps every public route prerenderable (static / ISR) instead of
 * opting into dynamic rendering — a Core Web Vitals requirement for
 * Task 9.1. Row Level Security still applies: the anon role can only
 * read published services, visible homepage sections, and site settings.
 *
 * Throws fail-secure (`SupabaseNotConfiguredError`) when credentials are
 * missing; public callers catch it and fall back to static config so demo
 * builds render without crashing (fail-safe, not fail-secure — public
 * content is not privileged).
 */
export function createPublicClient() {
  const { url, anonKey } = getSupabaseServerConfig();

  return createSupabaseClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
