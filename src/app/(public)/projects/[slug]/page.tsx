import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { FadeIn } from "@/components/animations";
import { ConsultationCta } from "@/components/sections";
import {
  caseStudies,
  caseStudyList,
  type CaseStudyDetail,
} from "@/config/projects";
import { resolvePublicIdentity } from "@/lib/data/identity";
import {
  getProjectBySlug,
  getPublishedProjects,
  getSiteSettings,
  hydrateProjectDetail,
} from "@/lib/data/public";
import { createPageMetadata } from "@/lib/seo";

const disclaimer =
  "All illustrative statistics, certifications, and case studies shown are demonstrations.";

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Prerender case-study slugs at build time. Task 10.1: published CMS
 * rows are merged with the static spotlight slug (deduplicated) — the
 * homepage links to the static case study, so it stays prerendered even
 * once the CMS has rows of its own. Unknown slugs still route through
 * the page at request time (default `dynamicParams`) and are rejected
 * with `notFound()` below.
 */
export async function generateStaticParams() {
  const read = await getPublishedProjects();
  const cmsSlugs = (read.data ?? []).map((project) => project.slug);
  const slugs = [
    ...new Set([...cmsSlugs, ...caseStudyList.map((project) => project.slug)]),
  ];
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const read = await getProjectBySlug(slug);
  const fallback = caseStudies[slug];
  // CMS rows win when configured and published (`meta_title`/
  // `meta_description` first); unpublished rows and demo mode fall to
  // static config. Unknown slugs still resolve metadata (the page itself
  // 404s below); fall back to catalog-level copy rather than leaking the
  // raw slug.
  const cms = read.data?.isPublished ? read.data : undefined;
  const title = cms
    ? (cms.metaTitle ?? cms.title)
    : (fallback?.title ?? "Case studies");
  const description = cms
    ? (cms.metaDescription ?? cms.summary)
    : (fallback?.summary ??
      "Ecological restoration, permitting, and assessment case studies from IntegraVity — illustrative project records.");

  return createPageMetadata({
    title,
    description,
    path: `/projects/${slug}`,
  });
}

/**
 * Dynamic case study template (docs/TASKS.md Task 10.1).
 *
 * Editorial case-study read per AGENTS.md §4.4 — the whole article sits
 * in `.container-prose` (max 44rem) and presents the narrative as
 * challenge → solution → results, mirroring the homepage
 * `CaseStudySpotlight`.
 *
 * Data source — the CMS distinguishes *unpublished* from *never
 * created* (the schema seeds no `projects` rows, so a raw
 * published-only read would 404 the demo slug the homepage links to):
 * - row exists and is published → the row is the authority;
 * - row exists and is unpublished → `notFound()` (an unpublished case
 *   study is never resurrected from static config);
 * - no row for the slug → the static spotlight config, byte-identical
 *   to the homepage section (covers demo mode, fresh installs, and the
 *   template's own featured case study);
 * - Supabase unavailable (demo mode / query failure) → static config;
 *   unknown slugs → `notFound()`.
 * - The closing banner resolves contact channels from `site_settings`.
 */
export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const [projectRead, settingsRead] = await Promise.all([
    getProjectBySlug(slug),
    getSiteSettings(),
  ]);
  const staticStudy = caseStudies[slug];

  // `data` is non-null only when the read succeeded (fail-safe contract).
  const row = projectRead.data;

  let study: CaseStudyDetail;
  if (row) {
    // The CMS is the authority: an unpublished row 404s even if a
    // static case study shares its slug.
    if (!row.isPublished) notFound();
    study = hydrateProjectDetail(row);
  } else if (staticStudy) {
    // No row exists (fresh install / template demo) or Supabase is
    // unavailable (demo mode / query failure) → static fallback.
    study = staticStudy;
  } else {
    notFound();
  }

  const identity = resolvePublicIdentity(settingsRead.data);
  const meta = [
    { term: "Client", value: study.client },
    { term: "Location", value: study.location },
    { term: "Scope", value: study.scope },
    { term: "Year", value: study.year },
  ].filter((entry) => entry.value);

  return (
    <>
      {/* Case study hero */}
      <section className="py-16 md:py-20">
        <div className="container-prose">
          <FadeIn>
            <Link
              href="/#projects"
              className="text-muted-foreground hover:text-brand-forest inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              Back to projects
            </Link>

            <p className="text-muted-foreground text-eyebrow mt-8">
              Case study
            </p>
            <h1 className="text-display-lg mt-3 text-balance">{study.title}</h1>
            <p className="text-muted-foreground mt-5 text-lg leading-relaxed">
              {study.summary}
            </p>

            <dl className="border-brand-sage mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-t pt-6 sm:grid-cols-4">
              {meta.map((entry) => (
                <div key={entry.term}>
                  <dt className="text-muted-foreground text-eyebrow">
                    {entry.term}
                  </dt>
                  <dd className="text-foreground mt-1.5 text-sm font-medium">
                    {entry.value}
                  </dd>
                </div>
              ))}
            </dl>
          </FadeIn>

          {/* Narrative: challenge → solution → results */}
          <div className="mt-14 space-y-12">
            {study.challenge.length > 0 && (
              <FadeIn delay={0.08}>
                <h2 className="text-display-md">The ecological challenge</h2>
                <div className="mt-4 space-y-4">
                  {study.challenge.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-muted-foreground leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </FadeIn>
            )}

            {study.solution.length > 0 && (
              <FadeIn delay={0.12}>
                <h2 className="text-display-md">The technical solution</h2>
                <div className="mt-4 space-y-4">
                  {study.solution.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-muted-foreground leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </FadeIn>
            )}

            {(study.results.length > 0 || study.metrics.length > 0) && (
              <FadeIn delay={0.16}>
                <h2 className="text-display-md">The results</h2>
                {study.results.length > 0 ? (
                  <div className="mt-4 space-y-4">
                    {study.results.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="text-muted-foreground leading-relaxed"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ) : (
                  <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
                    {study.metrics.map((metric) => (
                      <li
                        key={metric.label}
                        className="border-brand-sage border-t pt-4"
                      >
                        <p className="text-display-md">{metric.value}</p>
                        <p className="text-muted-foreground mt-1.5 text-sm">
                          {metric.label}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </FadeIn>
            )}
          </div>

          <p className="text-muted-foreground mt-14 text-xs leading-relaxed">
            {disclaimer}
          </p>
        </div>
      </section>

      <ConsultationCta identity={identity} />
    </>
  );
}
