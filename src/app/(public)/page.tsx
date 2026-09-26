import Link from "next/link";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Home",
  description:
    "IntegraVity — environmental consulting website template. Homepage sections are implemented in Phase 3 of the execution plan.",
  path: "/",
});

/**
 * Homepage scaffold. Section components (hero, services, industries, case
 * study, approach, team, FAQ, contact) are implemented in Phase 3 — see
 * docs/EXECUTION_PLAN.md. Nothing here is CMS-driven yet; live content
 * wiring happens in Phase 6-7 alongside the Supabase schema.
 */
export default function HomePage() {
  const upcoming = [
    ["Hero & credibility", "Immersive hero, expertise stats"],
    ["Services", "Core consulting services grid"],
    ["Industries", "Sectors supported"],
    ["Case study", "Featured project or case study"],
    ["Approach", "Working process and methodology"],
    ["Team", "Technical expertise and profiles"],
    ["FAQ", "Frequently asked questions"],
    ["Contact", "Consultation call to action"],
  ];

  return (
    <>
      <section className="bg-primary text-primary-foreground py-24">
        <div className="container-editorial">
          <p className="text-eyebrow text-primary-foreground/70">
            Environmental consulting
          </p>
          <h1 className="text-display-xl mt-4 max-w-3xl">
            Environmental consulting, engineered with integrity
          </h1>
          <p className="text-primary-foreground/80 mt-6 max-w-2xl text-lg">
            Placeholder homepage. Premium editorial sections are implemented in
            Phase 3 — see docs/EXECUTION_PLAN.md.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="bg-primary-foreground text-primary hover:bg-accent rounded-lg px-6 py-3 font-medium transition-colors"
            >
              Request a consultation
            </Link>
            <Link
              href="/services"
              className="border-primary-foreground/30 hover:bg-primary-foreground/10 rounded-lg border px-6 py-3 font-medium transition-colors"
            >
              Explore services
            </Link>
          </div>
          <ul className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {upcoming.map(([title, desc]) => (
              <li
                key={title}
                className="border-primary-foreground/15 bg-primary-foreground/5 rounded-lg border p-5"
              >
                <p className="font-medium">{title}</p>
                <p className="text-primary-foreground/70 mt-1 text-sm">
                  {desc}
                </p>
              </li>
            ))}
          </ul>
          <p className="text-primary-foreground/50 mt-16 text-xs">
            All company details, projects, statistics and testimonials shown in
            this template are illustrative placeholders unless verified.
          </p>
        </div>
      </section>
    </>
  );
}
