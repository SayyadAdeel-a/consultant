import { FadeIn } from "@/components/animations";

/**
 * Four-phase consulting methodology. Numbers are editorial display figures;
 * the phase order (Desktop Constraints → Field Delineation → Permitting
 * Strategy → Compliance & Monitoring) is part of the brand narrative and
 * asserted in tests/ui/case-study-approach.test.tsx.
 */
const phases = [
  {
    number: "01",
    title: "Desktop Constraints",
    description:
      "Records review, jurisdictional mapping, and constraint analysis that define the permitting path before anyone enters the field.",
  },
  {
    number: "02",
    title: "Field Delineation",
    description:
      "On-the-ground wetland delineation with vegetation and soils surveying, documented to agency-verified boundary standards.",
  },
  {
    number: "03",
    title: "Permitting Strategy",
    description:
      "Sequenced federal, state, and local applications with concurrence tracking and comment-response management.",
  },
  {
    number: "04",
    title: "Compliance & Monitoring",
    description:
      "Condition compliance, construction oversight, and post-permit monitoring that keep the project defensible through closeout.",
  },
];

/**
 * Approach timeline section (docs/TASKS.md Task 3.3).
 *
 * Editorial 4-column grid on the ivory surface: each step is a hairline
 * top rule, a display-serif step number, phase title, and description.
 * Anchors the homepage `/#approach` nav link.
 *
 * Server component; the whole grid reveals through the shared `FadeIn`
 * wrapper.
 */
export function ApproachSection() {
  return (
    <section
      id="approach"
      aria-labelledby="approach-heading"
      className="border-border bg-background"
    >
      <div className="container-editorial py-16 md:py-20 lg:py-24">
        <FadeIn>
          <p className="text-muted-foreground text-eyebrow">Our approach</p>
          <h2 id="approach-heading" className="text-display-lg mt-3 max-w-3xl">
            From first records review to final monitoring
          </h2>
        </FadeIn>

        <FadeIn delay={0.08}>
          <ol className="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {phases.map((phase) => (
              <li
                key={phase.number}
                className="border-brand-sage border-t pt-5"
              >
                <p className="text-brand-forest text-display-md">
                  {phase.number}
                </p>
                <h3 className="font-heading mt-4 text-lg font-semibold">
                  {phase.title}
                </h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {phase.description}
                </p>
              </li>
            ))}
          </ol>
        </FadeIn>
      </div>
    </section>
  );
}
