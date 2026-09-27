import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/forms";
import { getAdminUser } from "@/lib/auth/admin";
import { SupabaseNotConfiguredError } from "@/lib/env";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Login",
  description: "Administrator sign-in for the IntegraVity admin console.",
  path: "/admin/login",
  index: false,
});

/**
 * Administrator sign-in (docs/TASKS.md Task 6.1).
 *
 * Already-authenticated admins skip the form and land on /admin. When
 * Supabase is unconfigured (demo mode) the guard resolves to null and the
 * form still renders — submitting then returns the fail-secure
 * "not configured" error from the `loginAdmin` action.
 */
export default async function AdminLoginPage() {
  const admin = await getAdminUser().catch((error: unknown) => {
    if (error instanceof SupabaseNotConfiguredError) return null;
    throw error;
  });

  if (admin) redirect("/admin");

  return (
    <div className="grid min-h-[70vh] place-items-center px-4 py-10">
      <AdminLoginForm />
    </div>
  );
}
