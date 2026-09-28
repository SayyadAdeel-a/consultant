import { requireAdmin } from "@/lib/auth/admin";
import { SupabaseNotConfiguredError } from "@/lib/env";
import { createPageMetadata } from "@/lib/seo";
import { AdminSetupPanel } from "../setup-panel";
import { ShieldCheck, Key, Lock } from "lucide-react";

export const metadata = createPageMetadata({
  title: "Administrator Account",
  description: "Manage administrator profile, credentials, and session security.",
  path: "/admin/account",
  index: false,
});

export default async function AdminAccountPage() {
  let admin;
  try {
    admin = await requireAdmin();
  } catch (error) {
    if (error instanceof SupabaseNotConfiguredError) {
      return <AdminSetupPanel title="Account" />;
    }
    throw error;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-eyebrow text-muted-foreground">Configuration</p>
        <h1 className="font-heading text-2xl font-semibold mt-1">Administrator Profile & Security</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Review your authenticated identity, access privileges, and security parameters.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-4 border-b border-border/60 pb-6">
          <div className="flex size-14 items-center justify-center rounded-full bg-brand-sage/40 text-brand-forest font-bold text-lg">
            {admin.email.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 className="font-heading text-base font-semibold">{admin.email}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-sage/40 px-2 py-0.5 text-[10px] font-semibold text-brand-forest">
                <ShieldCheck className="size-3" />
                Verified Administrator
              </span>
              <span className="text-xs font-mono text-muted-foreground">ID: {admin.id.substring(0, 12)}…</span>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="p-4 rounded-lg border border-border bg-muted/20">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
              <Key className="size-3.5" />
              Authentication Tier
            </div>
            <p className="font-heading text-base font-semibold mt-1">Supabase SSR Auth</p>
            <p className="text-xs text-muted-foreground mt-1">HttpOnly encrypted cookies with PKCE flow</p>
          </div>

          <div className="p-4 rounded-lg border border-border bg-muted/20">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
              <Lock className="size-3.5" />
              Authorization Scope
            </div>
            <p className="font-heading text-base font-semibold mt-1">Full Administrative Access</p>
            <p className="text-xs text-muted-foreground mt-1">PostgreSQL Row-Level Security bypass via role</p>
          </div>
        </div>

        <div className="border-t border-border/60 pt-4">
          <h3 className="font-heading text-sm font-semibold">Security Best Practices</h3>
          <ul className="mt-2 space-y-1 text-xs text-muted-foreground list-disc list-inside">
            <li>Privileged database credentials remain exclusively on the server runtime.</li>
            <li>Inquiry records and client leads are shielded from public read access.</li>
            <li>All administrative server actions verify session identity before mutation.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
