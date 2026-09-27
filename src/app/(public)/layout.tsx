import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { resolvePublicIdentity } from "@/lib/data/identity";
import { getSiteSettings } from "@/lib/data/public";

/**
 * Public site layout: header + footer + main content area.
 * The admin area intentionally lives outside this layout.
 *
 * Task 9.1 — resolves the identity view-model (brand, address, contact
 * channels, social links, CTAs) from the CMS `site_settings` row and
 * passes it to both chrome components. The read is fail-safe: demo mode
 * or a query failure yields the static defaults from `@/config/site`.
 *
 * `revalidate` gives every public route a five-minute ISR backstop so
 * identity edits reach all pages even where admin actions do not purge
 * explicitly (`/services*`, `/lp/sample`) — settings saves also purge
 * `/` and `/contact` immediately.
 */
export const revalidate = 300;

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: settings } = await getSiteSettings();
  const identity = resolvePublicIdentity(settings);

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <Header identity={identity} />

      <main id="main-content" className="flex-1">
        {children}
      </main>

      <Footer identity={identity} />
    </div>
  );
}
