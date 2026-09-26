import { FadeIn } from "@/components/animations";

/**
 * Target sectors. Descriptions must state the environmental-compliance
 * relevance of each sector, not just name it — this copy is illustrative
 * demo content for the template.
 */
const industries = [
  {
    name: "Infrastructure",
    description:
      "Highways, bridges, and utilities routinely cross jurisdictional waters — we keep right-of-way crossings permitted under Clean Water Act sections 404 and 401.",
  },
  {
    name: "Commercial Development",
    description:
      "Site selection and due diligence for retail, office, and mixed-use projects, from Phase I ESAs through stormwater and wetland approvals.",
  },
  {
    name: "Renewable Energy",
    description:
      "Solar, wind, and transmission projects need habitat assessments and avoid-and-minimize strategies before groundbreaking.",
  },
  {
    name: "Municipal/Watershed",
    description:
      "Public agencies rely on watershed-scale planning, flood-resilience studies, and grant-ready environmental documentation.",
  },
];

/**
 * Industries section: editorial two-column layout — heading block on the
 * left, a ruled index of the four target sectors on the right. Ivory
 * contrast surface with hairline dividers (no shadows; elevation comes
 * from crisp 1px rules per docs/DESIGN_SYSTEM.md §5).
 *
 * Server component; reveals run through the shared `FadeIn` wrapper.
 */
export function IndustriesSection() {
  return (
    <section
      aria-labelledby="industries-heading"
      className="border-border bg-background"
    >
      <div className="container-editorial grid gap-10 py-16 md:py-20 lg:grid-cols-[1fr_1.6fr] lg:gap-16 lg:py-24">
        <FadeIn>
          <p className="text-muted-foreground text-eyebrow">Industries</p>
          <h2 id="industries-heading" className="text-display-lg mt-3 max-w-md">
            Sectors we know deeply
          </h2>
          <p className="text-muted-foreground mt-5 max-w-md">
            Environmental compliance looks different in every sector. These are
            the four we work in most often.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <ul className="border-border border-b">
            {industries.map((industry) => (
              <li
                key={industry.name}
                className="border-border grid gap-1 border-t py-6 sm:grid-cols-[minmax(0,14rem)_1fr] sm:gap-6"
              >
                <h3 className="font-heading text-lg font-semibold">
                  {industry.name}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {industry.description}
                </p>
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </section>
  );
}
