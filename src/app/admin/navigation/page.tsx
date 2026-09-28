import { requireAdmin } from "@/lib/auth/admin";
import { SupabaseNotConfiguredError } from "@/lib/env";
import { createPageMetadata } from "@/lib/seo";
import { AdminSetupPanel } from "../setup-panel";

export const metadata = createPageMetadata({
  title: "Navigation Settings",
  description: "Manage public navigation links, order, and primary CTA buttons.",
  path: "/admin/navigation",
  index: false,
});

export const NAV_LINKS = [
  { id: "nav-1", label: "About", href: "/about", order: 1, is_active: true },
  { id: "nav-2", label: "Services", href: "/services", order: 2, is_active: true },
  { id: "nav-3", label: "Insights", href: "/blog", order: 3, is_active: true },
  { id: "nav-4", label: "Contact", href: "/contact", order: 4, is_active: true },
];

export default async function AdminNavigationPage() {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof SupabaseNotConfiguredError) {
      return <AdminSetupPanel title="Navigation" />;
    }
    throw error;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-eyebrow text-muted-foreground">Configuration</p>
        <h1 className="font-heading text-2xl font-semibold mt-1">Header Navigation & CTA</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Control header navigation links, display ordering, and primary consultation button labels.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-6">
        <div>
          <h2 className="font-heading text-base font-semibold">Primary Navigation Links</h2>
          <div className="mt-4 overflow-hidden rounded-lg border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/40 text-xs uppercase text-muted-foreground border-b border-border">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Link Label</th>
                  <th className="px-4 py-2.5 font-medium">Target Path</th>
                  <th className="px-4 py-2.5 font-medium">Order</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {NAV_LINKS.map((link) => (
                  <tr key={link.id}>
                    <td className="px-4 py-3 font-medium text-xs text-foreground">{link.label}</td>
                    <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{link.href}</td>
                    <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{link.order}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full bg-brand-sage/40 px-2 py-0.5 text-[10px] font-medium text-brand-forest">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="border-t border-border/60 pt-4">
          <h2 className="font-heading text-base font-semibold">Header Call-to-Action (CTA)</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Button Text</label>
              <input
                type="text"
                defaultValue="Get in Touch"
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                readOnly
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Target URL</label>
              <input
                type="text"
                defaultValue="/contact"
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                readOnly
              />
            </div>
          </div>
        </div>

        <div className="border-t border-border/60 pt-4 flex justify-end">
          <button
            type="button"
            className="rounded-lg bg-brand-forest px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#252B29] transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
