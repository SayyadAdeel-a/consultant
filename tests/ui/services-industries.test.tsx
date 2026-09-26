import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { IndustriesSection } from "@/components/sections/IndustriesSection";

/**
 * Services grid & industries section tests.
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

const serviceFixtures = [
  { title: "Wetland Delineation", slug: "wetland-delineation" },
  { title: "Environmental Permitting", slug: "environmental-permitting" },
  { title: "Phase I/II ESAs", slug: "environmental-assessments" },
  { title: "Ecological Planning", slug: "environmental-planning" },
];

describe("ServicesGrid", () => {
  it("renders all four core services as card headings", () => {
    render(<ServicesGrid />);

    for (const service of serviceFixtures) {
      expect(
        screen.getByRole("heading", { level: 3, name: service.title }),
      ).toBeInTheDocument();
    }
  });

  it("links each card to its /services/[slug] route", () => {
    render(<ServicesGrid />);

    for (const service of serviceFixtures) {
      const link = screen.getByRole("link", {
        name: new RegExp(service.title),
      });
      expect(link).toHaveAttribute("href", `/services/${service.slug}`);
    }
  });

  it("renders an icon inside every card", () => {
    render(<ServicesGrid />);

    for (const service of serviceFixtures) {
      const link = screen.getByRole("link", {
        name: new RegExp(service.title),
      });
      expect(link.querySelector("svg.lucide")).not.toBeNull();
    }
  });

  it("uses clean 1px borders with sage hover transitions", () => {
    render(<ServicesGrid />);

    const card = screen.getByRole("link", { name: /Wetland Delineation/ });
    expect(card.className).toContain("border");
    expect(card.className).toContain("hover:border-brand-sage");
    expect(card.className).toContain("duration-300");
  });
});

describe("IndustriesSection", () => {
  it("renders the section heading and all four target sectors", () => {
    render(<IndustriesSection />);

    expect(
      screen.getByRole("heading", { level: 2, name: "Sectors we know deeply" }),
    ).toBeInTheDocument();

    const sectors = [
      "Infrastructure",
      "Commercial Development",
      "Renewable Energy",
      "Municipal/Watershed",
    ];
    for (const sector of sectors) {
      expect(
        screen.getByRole("heading", { level: 3, name: sector }),
      ).toBeInTheDocument();
    }
  });

  it("describes the environmental compliance relevance of each sector", () => {
    render(<IndustriesSection />);

    expect(
      screen.getByText(/Clean Water Act sections 404 and 401/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Phase I ESAs through stormwater and wetland approvals/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/avoid-and-minimize strategies before groundbreaking/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/watershed-scale planning, flood-resilience studies/),
    ).toBeInTheDocument();
  });
});
