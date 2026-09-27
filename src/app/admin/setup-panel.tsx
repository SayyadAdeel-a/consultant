import { AdminConfigNotice } from "./config-notice";

/**
 * Fail-secure setup panel for admin pages that cannot run without
 * Supabase (docs/TASKS.md Task 7.2). Rendered when the page's
 * `requireAdmin()` gate throws `SupabaseNotConfiguredError`, so demo
 * builds show explicit guidance instead of an unhandled exception.
 */
export function AdminSetupPanel({ title }: { title: string }) {
  return (
    <div className="mx-auto max-w-5xl">
      <p className="text-eyebrow text-muted-foreground">Admin console</p>
      <h1 className="font-heading mt-2 text-2xl font-semibold">{title}</h1>
      <div className="border-border bg-card mt-6 rounded-xl border p-6">
        <h2 className="font-heading text-lg font-semibold">
          Configuration required
        </h2>
        <p className="text-muted-foreground mt-2 text-sm">
          This admin surface requires a configured Supabase project.
          Administrative features fail secure until credentials are added.
        </p>
        <div className="mt-4">
          <AdminConfigNotice />
        </div>
      </div>
    </div>
  );
}
