import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { render, screen } from "@testing-library/react";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import CaseStudyPage, {
  generateMetadata,
  generateStaticParams,
} from "@/app/(public)/projects/[slug]/page";
import { caseStudies, featuredCaseStudy } from "@/config/projects";
import { SupabaseNotConfiguredError } from "@/lib/env";
import { createPublicClient } from "@/lib/supabase/public";

/**
 * Dynamic case study route tests (docs/TASKS.md Task 10.1).
 *
 * Covers:
 * - the static fallback in demo mode, byte-matching the homepage
 *   `CaseStudySpotlight` (title, client metadata, challenge/solution,
 *   results metrics, disclaimer) inside `.container-prose`;
 * - fail-safe `notFound()` for unrecognized slugs (demo mode and with
 *   the CMS configured);
 * - `generateStaticParams()` / `generateMetadata()` on both paths;
 * - CMS hydration: published rows drive the narrative, `results` prose
 *   replaces the demo metric grid, and empty text fields fall back to
 *   the static copy for the same slug.
 *
 * `next/link` is stubbed as a plain anchor; `next/navigation` is mocked
 * so `notFound()` throws a deterministic error; `@/lib/supabase/public`
 * is mocked so every read is deterministic (default: unconfigured); a
 * minimal `IntersectionObserver` stub supports the shared `FadeIn`
 * wrappers.
 */
vi.mock("next/link", () => ({
  default: ({
    children,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement> & { children?: ReactNode }) => (
    <a {...props}>{children}</a>
  ),
}));

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("@/lib/supabase/public", () => ({
  createPublicClient: vi.fn(),
}));

class MockIntersectionObserver {
  root = null;
  rootMargin = "";
  thresholds: number[] = [];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

beforeAll(() => {
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
});

afterAll(() => {
  vi.unstubAllGlobals();
});

/** Default: Supabase unavailable (matches the vitest environment). */
beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(createPublicClient).mockImplementation(() => {
    throw new SupabaseNotConfiguredError("test");
  });
});

type FakeTable = { rows?: unknown[]; error?: { message: string } };

/**
 * Chainable fake covering the chains the public fetchers use:
 * `from().select()` + `.eq()` filters (applied to raw columns) /
 * `.order()` / `.limit()`, awaited as a thenable resolving
 * `{ data, error }`.
 */
function createSupabaseFake(tables: Record<string, FakeTable>) {
  const from = vi.fn((table: string) => {
    const result: FakeTable = tables[table] ?? { rows: [] };
    const filters: [string, unknown][] = [];
    const builder = {
      select: vi.fn(() => builder),
      eq: vi.fn((column: string, value: unknown) => {
        filters.push([column, value]);
        return builder;
      }),
      order: vi.fn(() => builder),
      limit: vi.fn(() => builder),
      then: (
        onFulfilled?: (value: unknown) => unknown,
        onRejected?: (reason: unknown) => unknown,
      ) =>
        Promise.resolve(
          result.error
            ? { data: null, error: result.error }
            : {
                data: (result.rows ?? []).filter((row) =>
                  filters.every(
                    ([column, value]) =>
                      (row as Record<string, unknown>)[column] === value,
                  ),
                ),
                error: null,
              },
        ).then(onFulfilled, onRejected),
    };
    return builder;
  });
  return { from };
}

const detailPage = (slug: string) =>
  CaseStudyPage({ params: Promise.resolve({ slug }) });

const disclaimer =
  "All illustrative statistics, certifications, and case studies shown are demonstrations.";

/** Published CMS row exercising hydration (a different slug than the demo). */
const PROJECT_ROW = {
  slug: "riverside-marina-mitigation",
  title: "Riverside Marina Wetland Mitigation",
  client_type: "Municipal",
  location: "Portland, Maine",
  summary: "Compensatory mitigation design for a working waterfront.",
  challenge:
    "Dredged channels had displaced the marsh fringe behind the marina bulkhead.\n\nPermit clocks were already running against the boating season.",
  solution:
    "We designed a living shoreline with engineered toe protection and sequenced installation around in-water work windows.",
  results:
    "The municipality secured agency approval in a single review cycle and broke ground on schedule.",
  completed_year: 2025,
  meta_title: "Riverside Marina Mitigation | Case Study",
  meta_description: "Municipal compensatory mitigation in one review cycle.",
  is_published: true,
  display_order: 1,
};

describe("Case study detail (/projects/[slug]) — static fallback", () => {
  it("renders the spotlight case study in .container-prose", async () => {
    const { container } = render(await detailPage(featuredCaseStudy.slug));

    expect(container.querySelector(".container-prose")).not.toBeNull();

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: featuredCaseStudy.title,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "The ecological challenge",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "The technical solution" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "The results" }),
    ).toBeInTheDocument();

    // Client metadata mirrors the spotlight's project plate.
    expect(screen.getByText(featuredCaseStudy.client)).toBeInTheDocument();
    expect(screen.getByText(featuredCaseStudy.location)).toBeInTheDocument();
    expect(screen.getByText(featuredCaseStudy.scope)).toBeInTheDocument();
    expect(screen.getByText(featuredCaseStudy.year)).toBeInTheDocument();

    // Narrative + results metrics, byte-identical to the homepage spotlight.
    expect(
      screen.getByText(/tidal restriction and shoreline erosion/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/bathymetric LiDAR interpretation/),
    ).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("Acres restored")).toBeInTheDocument();
    expect(screen.getByText("11 months")).toBeInTheDocument();
    expect(screen.getByText(disclaimer)).toBeInTheDocument();

    // Back link returns to the homepage #projects anchor.
    expect(
      screen.getByRole("link", { name: "Back to projects" }),
    ).toHaveAttribute("href", "/#projects");

    // Closing consultation banner with the static identity.
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Tell us about your site",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Request a Consultation/i }),
    ).toHaveAttribute("href", "/contact");
    expect(
      screen.getByRole("link", { name: "(207) 555-0148" }),
    ).toHaveAttribute("href", "tel:+12075550148");
  });

  it("calls notFound() for unrecognized slugs in demo mode", async () => {
    await expect(detailPage("not-a-case-study")).rejects.toThrow(
      "NEXT_NOT_FOUND",
    );
  });

  it("generateStaticParams falls back to the static spotlight slug", async () => {
    const paths = await generateStaticParams();
    expect(paths.map((path) => path.slug)).toEqual([featuredCaseStudy.slug]);
  });

  it("generateMetadata builds static title, description, and canonical", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: featuredCaseStudy.slug }),
    });

    expect(metadata.title).toBe(featuredCaseStudy.title);
    expect(metadata.description).toBe(featuredCaseStudy.summary);
    expect(metadata.alternates?.canonical).toContain(
      `/projects/${featuredCaseStudy.slug}`,
    );
    expect(metadata.openGraph?.title).toContain(featuredCaseStudy.title);
  });
});

describe("Case study detail (/projects/[slug]) — CMS authority", () => {
  it("hydrates a published row into the narrative template", async () => {
    vi.mocked(createPublicClient).mockImplementation(
      () => createSupabaseFake({ projects: { rows: [PROJECT_ROW] } }) as never,
    );

    const { container } = render(await detailPage(PROJECT_ROW.slug));

    expect(container.querySelector(".container-prose")).not.toBeNull();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: PROJECT_ROW.title,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(PROJECT_ROW.summary)).toBeInTheDocument();
    expect(screen.getByText(PROJECT_ROW.client_type)).toBeInTheDocument();
    expect(screen.getByText(PROJECT_ROW.location)).toBeInTheDocument();
    expect(screen.getByText("2025")).toBeInTheDocument();

    // Multi-paragraph CMS text renders as narrative prose.
    expect(screen.getByText(/displaced the marsh fringe/)).toBeInTheDocument();
    expect(screen.getByText(/boating season/)).toBeInTheDocument();
    expect(
      screen.getByText(/single review cycle and broke ground/),
    ).toBeInTheDocument();

    // CMS-authored results replace the demo metric grid entirely.
    expect(screen.queryByText("Acres restored")).toBeNull();
    expect(screen.queryByText("Delineation, design & permitting")).toBeNull();
  });

  it("falls back to static copy for empty fields of the featured slug", async () => {
    const emptyRow = {
      ...PROJECT_ROW,
      slug: featuredCaseStudy.slug,
      title: featuredCaseStudy.title,
      summary: "",
      challenge: "",
      solution: "",
      results: "",
      client_type: "",
      location: "",
      completed_year: 0,
      meta_title: null,
      meta_description: null,
    };
    vi.mocked(createPublicClient).mockImplementation(
      () => createSupabaseFake({ projects: { rows: [emptyRow] } }) as never,
    );

    render(await detailPage(featuredCaseStudy.slug));

    // Empty text fields resurrect the static spotlight narrative…
    expect(
      screen.getByText(/tidal restriction and shoreline erosion/),
    ).toBeInTheDocument();
    expect(screen.getByText(featuredCaseStudy.client)).toBeInTheDocument();
    // …and empty results bring the demo metrics back (never mixed).
    expect(screen.getByText("Acres restored")).toBeInTheDocument();
    expect(
      screen.queryByText(/single review cycle and broke ground/),
    ).toBeNull();
  });

  it("calls notFound() for a slug with no project row when configured", async () => {
    vi.mocked(createPublicClient).mockImplementation(
      () => createSupabaseFake({ projects: { rows: [PROJECT_ROW] } }) as never,
    );

    await expect(detailPage("unpublished-case-study")).rejects.toThrow(
      "NEXT_NOT_FOUND",
    );
  });

  it("keeps an unpublished row hidden behind notFound()", async () => {
    // Authority rule: a row that exists but is unpublished must 404 even
    // when a static case study shares its slug — static config can never
    // resurrect CMS content an admin disabled.
    const unpublished = {
      ...PROJECT_ROW,
      slug: featuredCaseStudy.slug,
      is_published: false,
    };
    vi.mocked(createPublicClient).mockImplementation(
      () => createSupabaseFake({ projects: { rows: [unpublished] } }) as never,
    );

    await expect(detailPage(featuredCaseStudy.slug)).rejects.toThrow(
      "NEXT_NOT_FOUND",
    );
  });

  it("renders the static case study while the CMS table is unseeded", async () => {
    // The schema ships no `projects` seed — a configured but fresh
    // database must not 404 the demo slug the homepage links to.
    vi.mocked(createPublicClient).mockImplementation(
      () => createSupabaseFake({ projects: { rows: [] } }) as never,
    );

    const { container } = render(await detailPage(featuredCaseStudy.slug));

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: featuredCaseStudy.title,
      }),
    ).toBeInTheDocument();
    expect(container.querySelector(".container-prose")).not.toBeNull();
    expect(screen.getByText("Acres restored")).toBeInTheDocument();
  });

  it("merges published CMS slugs with the static spotlight slug", async () => {
    vi.mocked(createPublicClient).mockImplementation(
      () =>
        createSupabaseFake({
          projects: { rows: [PROJECT_ROW, { ...PROJECT_ROW, slug: "second" }] },
        }) as never,
    );

    const paths = await generateStaticParams();
    expect(paths.map((path) => path.slug)).toEqual([
      PROJECT_ROW.slug,
      "second",
      featuredCaseStudy.slug,
    ]);
  });

  it("generateMetadata prefers meta_title / meta_description", async () => {
    vi.mocked(createPublicClient).mockImplementation(
      () => createSupabaseFake({ projects: { rows: [PROJECT_ROW] } }) as never,
    );

    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: PROJECT_ROW.slug }),
    });

    expect(metadata.title).toBe(PROJECT_ROW.meta_title);
    expect(metadata.description).toBe(PROJECT_ROW.meta_description);
    expect(metadata.alternates?.canonical).toContain(
      `/projects/${PROJECT_ROW.slug}`,
    );
  });
});

describe("Static case study config", () => {
  it("exposes exactly one statically-linked case study by slug", () => {
    expect(Object.keys(caseStudies)).toEqual([featuredCaseStudy.slug]);
    expect(featuredCaseStudy.metrics.length).toBeGreaterThan(0);
    expect(featuredCaseStudy.results).toHaveLength(0);
  });
});
