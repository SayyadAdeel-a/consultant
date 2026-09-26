import Link from "next/link";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Services",
  description:
    "Environmental consulting services — wetland delineation, permitting, assessments and planning. Service pages are implemented in Phase 4.",
  path: "/services",
});

/**
 * Services index scaffold. CMS-driven service data (Phase 6-7) will populate
 * this listing; for now it presents the planned service families so the
 * dynamic route contract is discoverable.
 */
export default function ServicesIndexPage() {
  const plannedServices = [
    {
      slug: "wetland-delineation",
      title: "Wetland Delineation",
      blurb:
        "Field delineation and reporting for permitting and land-use decisions.",
    },
    {
      slug: "environmental-permitting",
      title: "Environmental Permitting",
      blurb: "Permit strategy, applications and agency coordination.",
    },
    {
      slug: "environmental-assessments",
      title: "Environmental Assessments",
      blurb: "Phase I / Phase II assessments and site characterizations.",
    },
    {
      slug: "environmental-planning",
      title: "Environmental Planning",
      blurb: "Land-use planning, resource management and compliance planning.",
    },
  ];

  return (
    <section className="py-24">
      <div className="container-editorial">
        <p className="text-eyebrow text-muted-foreground">Services</p>
        <h1 className="text-display-lg mt-3 max-w-2xl">
          Consulting services that move projects forward
        </h1>
        <p className="text-muted-foreground mt-5 max-w-2xl text-lg">
          Scaffold listing — individual service pages are implemented in Phase 4
          and served from the CMS in Phase 7.
        </p>
        <ul className="mt-14 grid gap-6 sm:grid-cols-2">
          {plannedServices.map((s) => (
            <li
              key={s.slug}
              className="border-border bg-card rounded-xl border p-7"
            >
              <h2 className="font-heading text-xl font-semibold">{s.title}</h2>
              <p className="text-muted-foreground mt-2 text-sm">{s.blurb}</p>
              <p className="text-muted-foreground/70 mt-4 text-sm">
                Planned route:{" "}
                <code className="bg-muted rounded px-1.5 py-0.5">
                  /services/{s.slug}
                </code>
              </p>
            </li>
          ))}
        </ul>
        <p className="text-muted-foreground/70 mt-12 text-xs">
          Need help now?{" "}
          <Link href="/contact" className="hover:text-foreground underline">
            Contact the team
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
