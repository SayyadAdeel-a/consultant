import { requireAdmin } from "@/lib/auth/admin";
import { SupabaseNotConfiguredError } from "@/lib/env";
import { createPageMetadata } from "@/lib/seo";
import { AdminSetupPanel } from "../setup-panel";
import { ShieldAlert } from "lucide-react";

export const metadata = createPageMetadata({
  title: "Footer Configuration",
  description: "Manage footer navigation, legal notices, and demonstration disclosure.",
  path: "/admin/footer",
  index: false,
});

export default async function AdminFooterPage() {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof SupabaseNotConfiguredError) {
      return <AdminSetupPanel title="Footer" />;
    }
    throw error;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-eyebrow text-muted-foreground">Configuration</p>
        <h1 className="font-heading text-2xl font-semibold mt-1">Footer & Demonstration Disclosure</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Configure copyright notices, utility links, and demonstration data disclosures.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-6">
        <div>
          <label className="text-xs font-semibold uppercase text-muted-foreground">Copyright Notice</label>
          <input
            type="text"
            defaultValue="© 2026 Alderline Environmental Consulting LLC. All rights reserved."
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            readOnly
          />
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="size-4 text-amber-700" />
            <h3 className="font-heading text-sm font-semibold text-amber-900">Demonstration Disclosure Banner</h3>
          </div>
          <p className="text-xs text-amber-800/80 mt-1">
            Clearly discloses to evaluating buyers that all portfolio metrics, client names, and personnel profiles are illustrative demonstration examples.
          </p>
          <textarea
            defaultValue="Demonstration Template: Alderline Environmental is an illustrative website template. Case studies, client quotes, personnel, and statistics are fictional examples created to display template capabilities."
            rows={3}
            className="mt-3 w-full rounded-lg border border-amber-300/80 bg-white px-3 py-2 text-xs text-foreground"
            readOnly
          />
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[11px] font-medium text-amber-900">Disclosure Visibility: Enabled</span>
            <span className="inline-flex items-center rounded-full bg-amber-200/80 px-2 py-0.5 text-[10px] font-semibold text-amber-900">
              Active in Footer
            </span>
          </div>
        </div>

        <div>
          <h2 className="font-heading text-base font-semibold">Utility Links</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 text-xs">
            <div className="p-2.5 rounded-lg border border-border bg-background">Privacy Policy (/utility/privacy-policy)</div>
            <div className="p-2.5 rounded-lg border border-border bg-background">Terms of Service (/utility/terms-conditions)</div>
            <div className="p-2.5 rounded-lg border border-border bg-background">Style Guide (/utility/style-guide)</div>
            <div className="p-2.5 rounded-lg border border-border bg-background">License (/utility/license)</div>
          </div>
        </div>

        <div className="border-t border-border/60 pt-4 flex justify-end">
          <button
            type="button"
            className="rounded-lg bg-brand-forest px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#252B29] transition-colors"
          >
            Save Footer Settings
          </button>
        </div>
      </div>
    </div>
  );
}
