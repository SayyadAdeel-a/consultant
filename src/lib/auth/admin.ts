import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

/**
 * Server-side authorization gate for the /admin area.
 *
 * Security model (docs/BACKEND_SECURITY.md):
 * 1. `proxy.ts` performs a cheap cookie-presence check for UX-level routing.
 * 2. Every admin layout/page/action calls `requireAdmin()` here — the real
 *    authorization boundary. Hiding UI is never treated as authorization.
 * 3. Database writes additionally rely on Supabase RLS policies tied to the
 *    `admin_profiles` table, so a stale or forged client state still cannot
 *    mutate privileged data.
 */

export type AdminUser = {
  id: string;
  email: string;
};

/**
 * Returns the authenticated admin user, or null when not signed in.
 * Cached per request so multiple gates share one Supabase round-trip.
 * Throws fail-secure when Supabase credentials are unconfigured.
 */
export const getAdminUser = cache(async (): Promise<AdminUser | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user?.email) return null;

  const isAdmin = await hasAdminProfile(supabase, data.user.id);
  if (!isAdmin) return null;

  return { id: data.user.id, email: data.user.email };
});

/** Gate for admin pages: redirects to /admin/login when unauthorized. */
export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getAdminUser();
  if (!admin) redirect("/admin/login");
  return admin;
}

/** Gate for admin server actions/route handlers: throws instead of redirect. */
export async function assertAdmin(): Promise<AdminUser> {
  const admin = await getAdminUser();
  if (!admin) {
    throw new Error("Unauthorized: administrator privileges required.");
  }
  return admin;
}

async function hasAdminProfile(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
) {
  const { data, error } = await supabase
    .from("admin_profiles")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) {
    // Fail secure: treat any lookup problem (e.g. table missing during
    // initialization) as unauthorized rather than authorized.
    console.error("admin profile lookup failed:", error.message);
    return false;
  }
  return Boolean(data);
}
