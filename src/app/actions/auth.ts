"use server";

import { redirect } from "next/navigation";
import { SupabaseNotConfiguredError } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { adminLoginSchema, flattenAuthIssues } from "@/lib/validations/auth";

/**
 * Administrative authentication Server Actions (docs/TASKS.md Task 6.1).
 *
 * Security model (docs/BACKEND_SECURITY.md):
 * - `adminLoginSchema` validates before any network call.
 * - `signInWithPassword` establishes the Supabase session; the server
 *   client writes the auth cookies for the current response.
 * - FAIL-SECURE: an authenticated user must also hold a row in
 *   `public.admin_profiles`. The lookup mirrors `hasAdminProfile()` in
 *   `src/lib/auth/admin.ts` (RLS `is_admin()` filters non-admins down to
 *   zero rows, so the check stays safe with the anon client). Non-admins
 *   and lookup failures are signed back out immediately and receive an
 *   access-denied error — a valid password alone never grants /admin.
 * - `redirect()` is deliberately called OUTSIDE the try/catch: Next throws
 *   a control-flow exception that must never be swallowed by a handler.
 */

export type AdminLoginState = {
  status: "idle" | "error";
  message: string | null;
  fieldErrors: Record<string, string> | null;
};

export async function loginAdmin(
  _prevState: AdminLoginState,
  formData: FormData,
): Promise<AdminLoginState> {
  const parsed = adminLoginSchema.safeParse({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      fieldErrors: flattenAuthIssues(parsed.error),
    };
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });

    if (error || !data.user) {
      console.warn("[auth] sign-in failed (invalid credentials)");
      return {
        status: "error",
        message: "Invalid email or password.",
        fieldErrors: null,
      };
    }

    // Fail-secure admin_profiles check (mirrors hasAdminProfile()).
    const { data: profile, error: profileError } = await supabase
      .from("admin_profiles")
      .select("user_id")
      .eq("user_id", data.user.id)
      .maybeSingle();

    if (profileError) {
      await supabase.auth.signOut();
      console.error(
        "[auth] admin profile lookup failed:",
        profileError.message,
      );
      return {
        status: "error",
        message: "Unable to verify administrator access. Please try again.",
        fieldErrors: null,
      };
    }

    if (!profile) {
      await supabase.auth.signOut();
      console.warn(
        "[auth] authenticated non-admin user was denied /admin access",
      );
      return {
        status: "error",
        message: "Access denied — this account is not an administrator.",
        fieldErrors: null,
      };
    }
  } catch (error) {
    if (error instanceof SupabaseNotConfiguredError) {
      return {
        status: "error",
        message:
          "Authentication is not configured. Add Supabase credentials to .env.local (see .env.example).",
        fieldErrors: null,
      };
    }
    console.error("[auth] unexpected sign-in error:", error);
    return {
      status: "error",
      message: "Sign-in failed unexpectedly. Please try again.",
      fieldErrors: null,
    };
  }

  // Reached only after the admin profile was verified.
  redirect("/admin");
}

export async function logoutAdmin(): Promise<void> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    if (error) console.error("[auth] sign-out failed:", error.message);
  } catch (error) {
    if (!(error instanceof SupabaseNotConfiguredError)) {
      console.error("[auth] unexpected sign-out error:", error);
    }
    // Unconfigured/demo mode: there is no session to clear — still leave.
  }
  redirect("/admin/login");
}
