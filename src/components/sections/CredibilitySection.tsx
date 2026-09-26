import { FadeIn } from "@/components/animations";

/**
 * Credibility metrics. Illustrative demo figures — the mandatory
 * disclaimer below must remain in place (see docs/PROJECT_BRIEF.md).
 */
const metrics = [
  { value: "1,200+", label: "Acres delineated" },
  { value: "99.4%", label: "Permitting approval rate" },
  { value: "12", label: "Professional certifications" },
  { value: "20+", label: "Years in practice" },
];

const disclaimer =
  "All illustrative statistics, certifications, and case studies shown are demonstrations.";

/**
 * Credibility metrics strip.
 *
 * Warm Ivory contrast surface beneath the Forest Green hero: a 4-column
 * metric grid with Sage hairline rules, editorial `text-display-md`
 * figures, and the mandatory illustrative-content disclaimer.
 *
 * Server component: the grid is revealed through the client `FadeIn`
 * wrapper, which receives server-rendered children.
 */
export function CredibilitySection() {
  return (
    <section
      aria-labelledby="credibility-heading"
      className="border-border bg-background border-b"
    >
      <div className="container-editorial py-16 md:py-20">
        <FadeIn>
          <h2
            id="credibility-heading"
            className="text-muted-foreground text-eyebrow"
          >
            Credibility, by the numbers
          </h2>

          <ul className="mt-8 grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4 md:gap-x-10">
            {metrics.map((metric) => (
              <li
                key={metric.label}
                className="border-brand-sage border-t pt-5"
              >
                <p className="text-brand-forest text-display-md">
                  {metric.value}
                </p>
                <p className="text-muted-foreground mt-2 text-sm">
                  {metric.label}
                </p>
              </li>
            ))}
          </ul>

          <p className="text-muted-foreground mt-10 max-w-3xl text-xs leading-relaxed">
            {disclaimer}
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
