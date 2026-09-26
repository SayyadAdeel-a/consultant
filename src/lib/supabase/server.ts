import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseServerConfig } from "@/lib/env";

/**
 * Server-side Supabase client for Server Components, Server Actions, and
 * Route Handlers. Uses the anon key; the caller's session (via cookies)
 * determines privileges and Row Level Security is always enforced.
 *
 * Throws fail-secure when Supabase credentials are missing, so admin
 * features cannot silently fall back to unauthenticated behavior.
 */
export async function createClient() {
  const { url, anonKey } = getSupabaseServerConfig();
  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component render pass where cookies are
          // read-only; safe to ignore because `proxy.ts` refreshes sessions.
        }
      },
    },
  });
}
