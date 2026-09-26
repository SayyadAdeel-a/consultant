import Link from "next/link";
import { createPageMetadata } from "@/lib/seo";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata = createPageMetadata({
  title: "Admin Dashboard",
  description: "Administrative area.",
  path: "/admin",
  index: false,
});

/**
 * Dashboard scaffold. Gate + live stats are implemented in Phase 7 (CMS).
 * For now the page renders status information so an unconfigured deploy
 * shows a coherent admin surface rather than a broken one.
 */
export default function AdminDashboardPage() {
  const supabaseReady = isSupabaseConfigured();

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-heading text-2xl font-semibold">Dashboard</h1>
      <p className="text-muted-foreground mt-2 text-sm">
        Scaffold — dashboard widgets (inquiries, media, content health) land in
        Phase 7 alongside the CMS implementation.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          ["Inquiries", "—", "Contact form lands in Phase 5"],
          ["Services", "—", "CMS wiring lands in Phase 7"],
          ["Media assets", "—", "Media library lands in Phase 7"],
        ].map(([label, value, note]) => (
          <div
            key={label}
            className="border-border bg-card rounded-xl border p-5"
          >
            <p className="text-muted-foreground text-sm font-medium">{label}</p>
            <p className="font-heading mt-1 text-2xl font-semibold">{value}</p>
            <p className="text-muted-foreground/80 mt-2 text-xs">{note}</p>
          </div>
        ))}
      </div>

      <div className="border-border bg-card mt-8 rounded-xl border p-6">
        <h2 className="font-heading text-lg font-semibold">
          Environment status
        </h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <dt className="text-muted-foreground">Supabase configuration:</dt>
            <dd
              className={
                supabaseReady
                  ? "text-foreground font-medium"
                  : "font-medium text-amber-700"
              }
            >
              {supabaseReady ? "Configured" : "Not configured"}
            </dd>
          </div>
          {!supabaseReady && (
            <dd className="text-muted-foreground">
              Add Supabase credentials to <code>.env.local</code> (see
              .env.example and docs/HANDOFF.md). Administrative operations fail
              securely until then.
            </dd>
          )}
        </dl>
      </div>

      <p className="text-muted-foreground/70 mt-6 text-xs">
        Return to{" "}
        <Link href="/" className="hover:text-foreground underline">
          public site
        </Link>
      </p>
    </div>
  );
}
