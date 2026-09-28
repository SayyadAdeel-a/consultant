import { requireAdmin } from "@/lib/auth/admin";
import { SupabaseNotConfiguredError } from "@/lib/env";
import { createPageMetadata } from "@/lib/seo";
import { AdminSetupPanel } from "../setup-panel";
import { faqContent } from "@/lib/alderline-content";
import { HelpCircle } from "lucide-react";

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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-eyebrow text-muted-foreground">Website</p>
          <h1 className="font-heading text-2xl font-semibold mt-1">Frequently Asked Questions</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage client engagement and regulatory questions displayed in the public accordion.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-forest px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#252B29] transition-colors"
        >
          <HelpCircle className="size-3.5" />
          Add Question
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-xs">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wide">
              <th className="px-4 py-3 font-medium">Question</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Answer Summary</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((faq) => (
              <tr key={faq.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 max-w-xs">
                  <p className="font-medium text-foreground text-xs">{faq.question}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs text-foreground">
                    {faq.category}
                  </span>
                </td>
                <td className="px-4 py-3 max-w-md text-xs text-muted-foreground line-clamp-2">
                  {faq.answer}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-full bg-brand-sage/40 px-2 py-0.5 text-[11px] font-medium text-brand-forest">
                    Published
                  </span>
                </td>
                <td className="px-4 py-3 text-xs font-mono text-muted-foreground">
                  {faq.order}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    className="text-xs font-semibold text-brand-forest hover:underline"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
