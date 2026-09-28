import { requireAdmin } from "@/lib/auth/admin";
import { SupabaseNotConfiguredError } from "@/lib/env";
import { createPageMetadata } from "@/lib/seo";
import { AdminSetupPanel } from "../setup-panel";
import { faqContent } from "@/lib/alderline-content";
import { VisualFaqsManager } from "@/components/admin/VisualFaqsManager";

export const metadata = createPageMetadata({
  title: "FAQs Management",
  description: "Manage frequently asked questions and regulatory answers.",
  path: "/admin/faqs",
  index: false,
});

export default async function AdminFaqsPage() {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof SupabaseNotConfiguredError) {
      return <AdminSetupPanel title="FAQs" />;
    }
    throw error;
  }

  const items = faqContent.items.map((item, idx) => ({
    id: `faq-${idx + 1}`,
    question: item.q,
    answer: item.a,
    category: idx < 2 ? "Field Science" : idx < 4 ? "Permitting" : "Engagement",
    order: idx + 1,
    is_published: true,
  }));

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="text-eyebrow text-muted-foreground">Website</p>
        <h1 className="font-heading text-2xl font-semibold mt-1">Frequently Asked Questions</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage client engagement and regulatory questions displayed in the public accordion.
        </p>
      </div>

      <VisualFaqsManager initialFaqs={items} />
    </div>
  );
}
