import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { CaseStudySpotlight } from "@/components/sections/CaseStudySpotlight";
import { ApproachSection } from "@/components/sections/ApproachSection";

/**
 * Case study & approach section tests.
 *
 * `next/link` is stubbed as a plain anchor for deterministic jsdom
 * rendering; a minimal `IntersectionObserver` stub supports the shared
 * `FadeIn` / `SlideUp` scroll-reveal wrappers (`whileInView` observes on
 * mount).
 */
vi.mock("next/link", () => ({
  default: ({
    children,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement> & { children?: ReactNode }) => (
    <a {...props}>{children}</a>
  ),
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

const disclaimer =
  "All illustrative statistics, certifications, and case studies shown are demonstrations.";

describe("CaseStudySpotlight", () => {
  it("features the Casco Bay project with client metadata and the /#projects anchor", () => {
    const { container } = render(<CaseStudySpotlight />);

    expect(container.firstChild).toHaveAttribute("id", "projects");
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Casco Bay coastal wetland restoration",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Casco Bay Estuary Partnership"),
    ).toBeInTheDocument();
    expect(screen.getByText("Casco Bay, Maine")).toBeInTheDocument();
    expect(
      screen.getByText("Delineation, design & permitting"),
    ).toBeInTheDocument();
  });

  it("presents the ecological challenge and technical solution", () => {
    render(<CaseStudySpotlight />);

    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "The ecological challenge",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/tidal restriction and shoreline erosion/),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { level: 3, name: "The technical solution" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/bathymetric LiDAR interpretation/),
    ).toBeInTheDocument();
  });

  it("shows quantifiable results for acres, concurrence, and timeline", () => {
    render(<CaseStudySpotlight />);

    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("Acres restored")).toBeInTheDocument();
    expect(screen.getByText("100%")).toBeInTheDocument();
    expect(
      screen.getByText(/Agency concurrence on first submittal/),
    ).toBeInTheDocument();
    expect(screen.getByText("11 months")).toBeInTheDocument();
    expect(screen.getByText("Permit timeline")).toBeInTheDocument();
  });

  it("renders the consultation CTA and mandatory disclaimer", () => {
    render(<CaseStudySpotlight />);

    const cta = screen.getByRole("link", { name: "Request a Consultation" });
    expect(cta).toHaveAttribute("href", "/contact");
    expect(screen.getByText(disclaimer)).toBeInTheDocument();
  });
});

describe("ApproachSection", () => {
  it("lists the four methodology phases in order behind the /#approach anchor", () => {
    const { container } = render(<ApproachSection />);

    expect(container.firstChild).toHaveAttribute("id", "approach");

    const headings = screen.getAllByRole("heading", { level: 3 });
    expect(headings.map((heading) => heading.textContent)).toEqual([
      "Desktop Constraints",
      "Field Delineation",
      "Permitting Strategy",
      "Compliance & Monitoring",
    ]);
  });

  it("renders step numbers with hairline borders and phase descriptions", () => {
    render(<ApproachSection />);

    for (const number of ["01", "02", "03", "04"]) {
      expect(screen.getByText(number)).toBeInTheDocument();
    }

    const firstStep = screen.getByText("01").closest("li");
    expect(firstStep?.className).toContain("border-t");
    expect(firstStep?.className).toContain("border-brand-sage");

    expect(
      screen.getByText(/jurisdictional mapping, and constraint analysis/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/vegetation and soils surveying/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/concurrence tracking and comment-response/),
    ).toBeInTheDocument();
    expect(screen.getByText(/post-permit monitoring/)).toBeInTheDocument();
  });
});
