import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getSupabaseServiceRoleConfig } from "@/lib/env";

/**
 * Service-role Supabase client. BYPASSES ROW LEVEL SECURITY.
 *
 * Allowed uses (see docs/BACKEND_SECURITY.md):
 * - Public contact-form intake (inserting inquiries as anonymous visitors)
 * - Controlled administrative maintenance tasks
 *
 * Prohibited uses:
 * - Anywhere reachable from Client Components (guarded by `server-only`)
 * - Generic query helpers exposed to pages without an authorization check
 *
 * This module throws fail-secure when SUPABASE_SERVICE_ROLE_KEY is absent.
 */
export function createAdminClient() {
  const { url, serviceRoleKey } = getSupabaseServiceRoleConfig();
  return createSupabaseClient(url, serviceRoleKey, {
    auth: {
      // The service role is a machine identity; never persist its sessions.
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
