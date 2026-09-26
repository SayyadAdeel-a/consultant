import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Contact",
  description:
    "Contact IntegraVity for environmental consulting inquiries. Form backend, validation and spam protection are implemented in Phase 5.",
  path: "/contact",
});

/**
 * Contact page scaffold. The form is implemented in Phase 5 with a server
 * action posting into `inquiries` (see docs/CMS_SCHEMA.md), Zod validation
 * (src/lib/validations/contact.ts), honeypot + rate limiting per
 * docs/BACKEND_SECURITY.md.
 */
export default function ContactPage() {
  return (
    <section className="py-24">
      <div className="container-editorial">
        <p className="text-eyebrow text-muted-foreground">Contact</p>
        <h1 className="text-display-lg mt-3 max-w-2xl">
          Start a conversation about your project
        </h1>
        <p className="text-muted-foreground mt-5 max-w-2xl text-lg">
          Scaffold page. The inquiry form, server-side validation, spam
          protection and secure storage are implemented in Phase 5 of
          docs/EXECUTION_PLAN.md.
        </p>

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <div className="border-border bg-card rounded-xl border p-8">
            <h2 className="font-heading text-xl font-semibold">
              What happens next
            </h2>
            <ol className="text-muted-foreground mt-4 space-y-3 text-sm">
              <li>
                <span className="text-foreground font-medium">1. Submit</span> —
                the form will securely store your inquiry (Phase 5).
              </li>
              <li>
                <span className="text-foreground font-medium">2. Review</span> —
                administrators will see it in /admin/inquiries with status
                tracking.
              </li>
              <li>
                <span className="text-foreground font-medium">3. Response</span>{" "}
                — a consultant replies by email.
              </li>
            </ol>
          </div>

          <div className="border-border bg-muted/40 rounded-xl border p-8">
            <h2 className="font-heading text-xl font-semibold">
              Placeholder contact details
            </h2>
            <p className="text-muted-foreground mt-4 text-sm">
              Live contact information will be managed via the CMS
              (/admin/settings) once Supabase is configured. Details shown in
              this template are illustrative unless verified.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
