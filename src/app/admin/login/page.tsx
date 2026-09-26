import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Login",
  description: "Administrator sign-in.",
  path: "/admin/login",
  index: false,
});

/**
 * Login scaffold. Supabase email/password sign-in, session establishment and
 * post-login redirect are implemented in Phase 6 (auth wiring). No client
 * component is mounted yet because sign-in requires configured credentials.
 */
export default function AdminLoginPage() {
  return (
    <div className="grid min-h-[70vh] place-items-center">
      <div className="border-border bg-card w-full max-w-sm rounded-xl border p-8 shadow-sm">
        <h1 className="font-heading text-xl font-semibold">
          Administrator sign-in
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Authentication is implemented in Phase 6 (Supabase Auth). Public
          registration is disabled by design; accounts are provisioned through a
          controlled process (see docs/BACKEND_SECURITY.md).
        </p>
        <div className="bg-muted text-muted-foreground mt-6 rounded-lg p-4 text-xs">
          This screen intentionally exposes no authentication mechanism until
          Supabase credentials are configured. It fails secure.
        </div>
      </div>
    </div>
  );
}
