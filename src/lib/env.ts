/**
 * Centralized environment-variable access with fail-secure behavior.
 *
 * Rules (see docs/BACKEND_SECURITY.md):
 * - NEXT_PUBLIC_* variables are browser-safe and may be referenced anywhere.
 * - SUPABASE_SERVICE_ROLE_KEY must NEVER be imported by client components.
 * - Admin/server modules call the *Server functions below, which throw at
 *   request time when required secrets are missing (fail secure). Public
 *   placeholder pages must still render without credentials.
 * - Never hardcode credentials or invent placeholder secrets in code.
 */

/** Thrown when privileged code runs without configured credentials. */
export class SupabaseNotConfiguredError extends Error {
  constructor(context: string) {
    super(
      `Supabase is not configured (${context}). Set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY (and SUPABASE_SERVICE_ROLE_KEY where required) in .env.local. See .env.example.`,
    );
    this.name = "SupabaseNotConfiguredError";
  }
}

/** Browser-safe values. Empty strings are fine; features degrade gracefully. */
export function getPublicSupabaseConfig(): {
  url: string;
  anonKey: string;
} {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  };
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

/**
 * Server-only: URL + anon key for server clients that respect RLS.
 * Throws fail-secure when credentials are absent.
 */
export function getSupabaseServerConfig(): {
  url: string;
  anonKey: string;
} {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new SupabaseNotConfiguredError("server client");
  }
  return { url, anonKey };
}

/**
 * Server-only: service-role client config. Bypasses RLS — restrict usage to
 * controlled server contexts (e.g. contact intake, media housekeeping).
 * Throws fail-secure when the secret is absent.
 */
export function getSupabaseServiceRoleConfig(): {
  url: string;
  serviceRoleKey: string;
} {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new SupabaseNotConfiguredError("service-role client");
  }
  return { url, serviceRoleKey };
}

/** Public site URL, falling back to localhost in development. */
export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}
