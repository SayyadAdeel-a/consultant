import { NextResponse, type NextRequest } from "next/server";

/**
 * Edge-of-network session/proxy layer (Next.js 16 renamed middleware to
 * proxy.ts). Responsibilities:
 *
 * 1. Update Supabase auth cookies when sessions refresh in flight.
 * 2. Cheap redirect for /admin routes when no session cookie exists (UX).
 *
 * IMPORTANT: This is NOT the authorization boundary. Every admin page and
 * server action independently calls `requireAdmin()` / `assertAdmin()`
 * (src/lib/auth/admin.ts), which verifies the session and admin profile
 * server-side. Absence of a cookie here is only a fast-path redirect.
 *
 * This module must stay runnable without Supabase credentials: when they
 * are missing it passes requests through untouched, so the public demo
 * works and admin pages fail via their own fail-secure gates.
 */
const SUPABASE_COOKIE_PREFIX = "sb-";

function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request });

  if (!isSupabaseConfigured()) {
    return response;
  }

  const { createServerClient } = await import("@supabase/ssr");
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  // Refreshes the auth token if expired; writes Set-Cookie on `response`.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const hasSessionCookie = request.cookies
    .getAll()
    .some(
      (c) =>
        c.name.startsWith(SUPABASE_COOKIE_PREFIX) ||
        c.name === "alderline_admin_session",
    );

  // UX fast-path only — real verification happens in requireAdmin().
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!user && !hasSessionCookie) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Run on all app routes except static assets and Next internals.
    "/((?!_next/static|_next/image|favicon.ico|images|icons|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
