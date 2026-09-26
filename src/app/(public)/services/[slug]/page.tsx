import Link from "next/link";
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Dynamic service page scaffold (Phase 4 implements the full experience;
 * Phase 6-7 connect it to the CMS). Next 16: params is a Promise and must
 * be awaited — do not destructure synchronously.
 *
 * generateStaticParams intentionally returns [] for now: with dynamicParams
 * left at its default (true), unknown slugs still render through this page
 * at request time. When the Supabase schema lands, this returns the slugs
 * of published services for static generation.
 */
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  return createPageMetadata({
    title: "Service",
    description: `Environmental consulting service: ${slug}. Full service experience is implemented in Phase 4.`,
    path: `/services/${slug}`,
  });
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;

  // Fail-safe placeholder: any slug renders the scaffold. When CMS data
  // lands (Phase 6), unknown slugs must call notFound() instead.
  const planned: Record<string, { title: string; blurb: string }> = {
    "wetland-delineation": {
      title: "Wetland Delineation",
      blurb:
        "Field delineation and reporting supporting permitting and land-use decisions.",
    },
    "environmental-permitting": {
      title: "Environmental Permitting",
      blurb: "Permit strategy, applications and agency coordination.",
    },
    "environmental-assessments": {
      title: "Environmental Assessments",
      blurb: "Phase I / Phase II assessments and site characterizations.",
    },
    "environmental-planning": {
      title: "Environmental Planning",
      blurb: "Land-use planning, resource management and compliance planning.",
    },
  };

  const service = planned[slug];

  return (
    <section className="py-24">
      <div className="container-editorial">
        <p className="text-eyebrow text-muted-foreground">Service</p>
        <h1 className="text-display-lg mt-3">
          {service ? service.title : `Service: ${slug}`}
        </h1>
        <p className="text-muted-foreground mt-5 max-w-2xl text-lg">
          {service
            ? service.blurb
            : "Placeholder for a CMS-managed service page. Implemented in Phase 4; content served from the CMS in Phase 7."}
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/contact"
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-6 py-3 font-medium transition-colors"
          >
            Discuss this service
          </Link>
          <Link
            href="/services"
            className="border-border hover:bg-muted rounded-lg border px-6 py-3 font-medium transition-colors"
          >
            All services
          </Link>
        </div>
        <p className="text-muted-foreground/70 mt-14 text-xs">
          Route:{" "}
          <code className="bg-muted rounded px-1.5 py-0.5">
            /services/{slug}
          </code>
        </p>
      </div>
    </section>
  );
}
