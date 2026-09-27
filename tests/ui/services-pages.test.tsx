import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import ServicesIndexPage from "@/app/(public)/services/page";
import ServiceDetailPage, {
  generateMetadata,
  generateStaticParams,
} from "@/app/(public)/services/[slug]/page";
import { hasPricingNote, serviceList } from "@/config/services";

/**
 * Service catalog & dynamic detail template tests (docs/TASKS.md Task 4.1).
 *
 * Covers catalog rendering, deep-dive rendering for a known slug, the CMS
 * Pricing Rule (optional note suppressed when null/empty), `notFound()`
 * for unrecognized slugs, static params, and dynamic metadata.
 *
 * The catalog and detail pages are async since Task 9.1 (fail-safe CMS
 * hydration); tests await them before rendering. The reads throw
 * `SupabaseNotConfiguredError` in the test environment and fall back to
 * the static `serviceList` config.
 *
 * `next/link` is stubbed as a plain anchor; `next/navigation` is mocked so
 * `notFound()` throws a deterministic error we can assert against; a
 * minimal `IntersectionObserver` stub supports the shared animation
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

const knownSlugs = [
  "wetland-delineation",
  "environmental-permitting",
  "environmental-assessments",
  "environmental-planning",
];

const detailPage = (slug: string) =>
  ServiceDetailPage({ params: Promise.resolve({ slug }) });

describe("Service catalog (/services)", () => {
  it("renders the four disciplines with badges, deliverables, and links", async () => {
    render(await ServicesIndexPage());

    expect(
      screen.getByRole("heading", { level: 1, name: /move projects forward/ }),
    ).toBeInTheDocument();

    for (const service of serviceList) {
      expect(
        screen.getByRole("heading", { level: 2, name: service.title }),
      ).toBeInTheDocument();

      const link = screen.getByRole("link", {
        name: new RegExp(service.title),
      });
      expect(link).toHaveAttribute("href", `/services/${service.slug}`);

      for (const item of service.deliverables) {
        expect(screen.getByText(item)).toBeInTheDocument();
      }
    }

    // Regulatory framework badges (CWA, NEPA, ASTM) appear across the grid.
    expect(screen.getByText("CWA §404")).toBeInTheDocument();
    expect(screen.getAllByText("NEPA").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("ASTM E1527-21")).toBeInTheDocument();
  });

  it("closes with the consultation CTA banner", async () => {
    render(await ServicesIndexPage());

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
      screen.getByRole("link", { name: /\(207\) 555-0148/ }),
    ).toHaveAttribute("href", "tel:+12075550148");
  });
});

describe("Service detail (/services/[slug])", () => {
  it("renders a rich editorial deep dive for a known slug", async () => {
    render(await detailPage("wetland-delineation"));

    expect(
      screen.getByRole("heading", { level: 1, name: "Wetland Delineation" }),
    ).toBeInTheDocument();

    // Framework badges.
    expect(screen.getByText("CWA §404")).toBeInTheDocument();
    expect(screen.getByText("1987 Corps Manual")).toBeInTheDocument();

    // Problem context.
    expect(
      screen.getByText(/decide whether a project needs a federal permit/),
    ).toBeInTheDocument();

    // Deliverables checklist.
    expect(
      screen.getByText(/Delineation report with boundary exhibits/),
    ).toBeInTheDocument();

    // Methodology milestones.
    expect(
      screen.getByText("Records review & AWT mapping"),
    ).toBeInTheDocument();
    expect(screen.getByText("Concurrence & handoff")).toBeInTheDocument();

    // This service ships a populated pricing note — it must render.
    expect(screen.getByText("Pricing note")).toBeInTheDocument();
    expect(
      screen.getByText(/quoted per project after a records review/),
    ).toBeInTheDocument();
  });

  it("hides the pricing note entirely when the field is null", async () => {
    render(await detailPage("environmental-permitting"));

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Environmental Permitting",
      }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Pricing note")).toBeNull();
    expect(screen.queryByText(/quoted per project/i)).toBeNull();
  });

  it("treats null, empty, and whitespace-only pricing notes as hidden", () => {
    expect(hasPricingNote({ pricingNote: null })).toBe(false);
    expect(hasPricingNote({ pricingNote: "" })).toBe(false);
    expect(hasPricingNote({ pricingNote: "   " })).toBe(false);
    expect(hasPricingNote({ pricingNote: "Quoted per project." })).toBe(true);
  });

  it("calls notFound() for unrecognized slugs", async () => {
    await expect(detailPage("not-a-service")).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("generateStaticParams returns the four known slugs", async () => {
    const paths = await generateStaticParams();
    expect(paths.map((path) => path.slug)).toEqual(knownSlugs);
  });

  it("generateMetadata builds dynamic title, description, and OpenGraph", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "environmental-permitting" }),
    });

    expect(metadata.title).toBe("Environmental Permitting");

    const expected = serviceList.find(
      (service) => service.slug === "environmental-permitting",
    );
    expect(metadata.description).toBe(expected?.summary);
    expect(metadata.alternates?.canonical).toContain(
      "/services/environmental-permitting",
    );
    expect(metadata.openGraph?.title).toContain("Environmental Permitting");
    expect(metadata.openGraph?.images).toBeDefined();
  });
});
