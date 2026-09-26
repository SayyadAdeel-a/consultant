import { isSupabaseConfigured } from "@/lib/env";

/**
 * Fail-secure setup banner for the admin area. Safe to evaluate during
 * render: NEXT_PUBLIC_* variables are statically inlined at build time, so
 * server and client agree and no effect/state is needed. When Supabase is
 * not configured, administrators see explicit setup guidance instead of
 * being able to attempt privileged operations (which fail server-side).
 */
export function AdminConfigNotice() {
  if (!isSupabaseConfigured()) {
    return (
      <div
        role="status"
        className="border-b border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-900"
      >
        Supabase is not configured — administrative features are disabled. Copy
        <code className="mx-1 rounded bg-amber-100 px-1">.env.example</code>
        to
        <code className="mx-1 rounded bg-amber-100 px-1">.env.local</code>
        and add credentials (see docs/HANDOFF.md → Remaining configuration).
      </div>
    );
  }
  return null;
}
