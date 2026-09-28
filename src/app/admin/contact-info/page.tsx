import { requireAdmin } from "@/lib/auth/admin";
import { SupabaseNotConfiguredError } from "@/lib/env";
import { createPageMetadata } from "@/lib/seo";
import { AdminSetupPanel } from "../setup-panel";
import { PhoneCall, Mail, MapPin, Clock } from "lucide-react";

export const metadata = createPageMetadata({
  title: "Contact Information",
  description: "Manage official business channels, address, and office hours.",
  path: "/admin/contact-info",
  index: false,
});

export default async function AdminContactInfoPage() {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof SupabaseNotConfiguredError) {
      return <AdminSetupPanel title="Contact Information" />;
    }
    throw error;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-eyebrow text-muted-foreground">Business</p>
        <h1 className="font-heading text-2xl font-semibold mt-1">Contact Information & Channels</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage direct communications channels, physical office locations, and intake hours displayed on the contact page.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
              <Mail className="size-3.5" />
              General Inquiries Email
            </label>
            <input
              type="email"
              defaultValue="inquiries@alderline-env.com"
              className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              readOnly
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
              <PhoneCall className="size-3.5" />
              Main Consultation Hotline
            </label>
            <input
              type="text"
              defaultValue="+1 (555) 382-4190"
              className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              readOnly
            />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
            <MapPin className="size-3.5" />
            Physical Headquarters Office Address
          </label>
          <input
            type="text"
            defaultValue="1420 Harborview Boulevard, Suite 800, Seattle, WA 98101"
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            readOnly
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
            <Clock className="size-3.5" />
            Business & Technical Scoping Hours
          </label>
          <input
            type="text"
            defaultValue="Monday – Friday: 8:00 AM – 5:30 PM PST"
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            readOnly
          />
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
