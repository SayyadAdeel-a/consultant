import { requireAdmin } from "@/lib/auth/admin";
import { SupabaseNotConfiguredError } from "@/lib/env";
import { createPageMetadata } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";
import { AdminSetupPanel } from "../setup-panel";
import { VisualContactEditor } from "@/components/admin/VisualContactEditor";

export const metadata = createPageMetadata({
  title: "Edit Contact Information",
  description: "Visual editor for official business communication channels, office address, and hours.",
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

  let email = "inquiries@alderline-env.com";
  let phone = "+1 (555) 382-4190";
  let address = "1420 Harborview Boulevard, Suite 800, Seattle, WA 98101";
  const hours = "Monday – Friday: 8:00 AM – 5:30 PM PST";
  const responseGuarantee = "Guaranteed consultation callback within 1 business day";

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("site_settings")
      .select("contact_email, contact_phone, office_address")
      .single();

    if (data) {
      if (data.contact_email) email = data.contact_email;
      if (data.contact_phone) phone = data.contact_phone;
      if (data.office_address) address = data.office_address;
    }
  } catch (err) {
    console.error("[admin] contact info read fallback:", err);
  }

  return (
    <div className="mx-auto max-w-6xl">
      <VisualContactEditor
        initialEmail={email}
        initialPhone={phone}
        initialAddress={address}
        initialHours={hours}
        initialResponseGuarantee={responseGuarantee}
      />
    </div>
  );
}
