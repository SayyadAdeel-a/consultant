import Link from "next/link";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Page not found",
  description: "The page you requested could not be found.",
  path: "/404",
  index: false,
});

export default function NotFound() {
  return (
    <section className="grid min-h-[60vh] place-items-center py-24">
      <div className="container-editorial text-center">
        <p className="text-eyebrow text-muted-foreground">404</p>
        <h1 className="text-display-md mt-3">This page could not be found</h1>
        <p className="text-muted-foreground mt-4">
          The link may be outdated. Try the homepage or the services overview.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/"
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-6 py-3 font-medium"
          >
            Back to homepage
          </Link>
          <Link
            href="/services"
            className="border-border hover:bg-muted rounded-lg border px-6 py-3 font-medium"
          >
            View services
          </Link>
        </div>
      </div>
    </section>
  );
}
