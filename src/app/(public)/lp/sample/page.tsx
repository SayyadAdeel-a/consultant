import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Sample Landing",
  description: "Placeholder landing page for marketing tests.",
  path: "/lp/sample",
});

export default function SampleLandingPage() {
  return (
    <section className="py-24">
      <div className="container-editorial">
        <h1 className="text-display-md">Sample landing page</h1>
        <p className="text-muted-foreground mt-4 max-w-2xl">
          Placeholder for future campaign landing pages. Uses the same public
          layout and design tokens.
        </p>
      </div>
    </section>
  );
}
