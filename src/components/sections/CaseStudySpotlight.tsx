import Link from "next/link";
import { FadeIn } from "@/components/animations";
import { buttonVariants } from "@/components/ui/button";

const disclaimer =
  "All illustrative statistics, certifications, and case studies shown are demonstrations.";

/** Client metadata for the featured (illustrative) project. */
const projectMeta = [
  { term: "Client", value: "Casco Bay Estuary Partnership" },
  { term: "Location", value: "Casco Bay, Maine" },
  { term: "Scope", value: "Delineation, design & permitting" },
  { term: "Year", value: "2024" },
];

const challenge =
  "Decades of tidal restriction and shoreline erosion had fragmented the marsh into open-water pans, weakening nursery habitat for Casco Bay shellfish and pushing the parcel beyond its storm-surge thresholds.";

const solution =
  "We paired bathymetric LiDAR interpretation with fine-scale vegetation and soils surveying to re-establish historic tidal hydrology, then sequenced a joint Army Corps §404 and Maine DEP §401 authorization strategy around in-water work windows.";

const results = [
  { value: "42", label: "Acres restored" },
  { value: "100%", label: "Agency concurrence on first submittal" },
  { value: "11 months", label: "Permit timeline" },
];

/** Supplementary site plate shown in the split-screen media column. */
const siteRecord = [
  { term: "Coordinates", value: "43.69° N, 70.15° W" },
  { term: "Site type", value: "Coastal salt marsh" },
  { term: "Hydrology", value: "Tidal restriction" },
  { term: "Works window", value: "April – October" },
];

/**
 * Featured case study spotlight (docs/TASKS.md Task 3.3).
 *
 * Editorial split-screen on the Forest Green authoritative-callout surface:
 * the narrative column (client metadata, ecological challenge, technical
 * solution, quantifiable results, CTA, disclaimer) sits beside a sticky
 * ivory "site record" plate. Anchors the homepage `/#projects` nav link.
 *
 * Server component; reveals run through the shared `FadeIn` wrapper.
 */
export function CaseStudySpotlight() {
  return (
    <section
      id="projects"
      aria-labelledby="case-study-heading"
      className="bg-brand-forest text-brand-ivory"
    >
      <div className="container-editorial grid items-start gap-10 py-16 md:py-20 lg:grid-cols-2 lg:gap-14 lg:py-24">
        <div>
          <FadeIn>
            <p className="text-brand-sage text-eyebrow">Featured project</p>
            <h2
              id="case-study-heading"
              className="text-display-lg mt-3 text-balance"
            >
              Casco Bay coastal wetland restoration
            </h2>
          </FadeIn>

          <FadeIn delay={0.08}>
            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
              {projectMeta.map((item) => (
                <div key={item.term}>
                  <dt className="text-brand-sage text-eyebrow">{item.term}</dt>
                  <dd className="mt-1.5 text-sm font-medium">{item.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-10 space-y-8">
              <div>
                <h3 className="font-heading text-xl font-semibold">
                  The ecological challenge
                </h3>
                <p className="text-brand-sage mt-2 leading-relaxed">
                  {challenge}
                </p>
              </div>

              <div>
                <h3 className="font-heading text-xl font-semibold">
                  The technical solution
                </h3>
                <p className="text-brand-sage mt-2 leading-relaxed">
                  {solution}
                </p>
              </div>

              <div>
                <h3 className="font-heading text-xl font-semibold">
                  The results
                </h3>
                <ul className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-3">
                  {results.map((result) => (
                    <li
                      key={result.label}
                      className="border-brand-sage/40 border-t pt-4"
                    >
                      <p className="text-display-md">{result.value}</p>
                      <p className="text-brand-sage mt-1.5 text-sm">
                        {result.label}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Link
              href="/contact"
              className={buttonVariants({
                variant: "default",
                size: "lg",
                className:
                  "bg-brand-ivory text-brand-forest hover:bg-brand-ivory/85 mt-10 h-12 px-7 text-base",
              })}
            >
              Request a Consultation
            </Link>

            <p className="text-brand-sage/70 mt-8 max-w-3xl text-xs leading-relaxed">
              {disclaimer}
            </p>
          </FadeIn>
        </div>

        <FadeIn delay={0.12}>
          <div className="border-brand-sage bg-brand-ivory text-brand-forest rounded-xl border p-8 lg:sticky lg:top-24">
            <p className="text-muted-foreground text-eyebrow">Site record</p>
            <p className="text-display-md mt-4">Casco Bay</p>
            <p className="text-muted-foreground mt-1 text-sm">
              Coastal wetlands, Maine
            </p>

            <dl className="mt-6">
              {siteRecord.map((item) => (
                <div
                  key={item.term}
                  className="border-brand-sage/40 flex items-baseline justify-between gap-4 border-t py-3"
                >
                  <dt className="text-muted-foreground text-sm">{item.term}</dt>
                  <dd className="text-right text-sm font-medium">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
