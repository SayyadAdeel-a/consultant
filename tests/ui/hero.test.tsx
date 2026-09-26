import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { CredibilitySection } from "@/components/sections/CredibilitySection";
import { HeroSection } from "@/components/sections/HeroSection";
import { siteConfig } from "@/config/site";

/**
 * Hero & credibility section tests.
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

describe("HeroSection", () => {
  it("renders the editorial eyebrow and display headline", () => {
    const { container } = render(<HeroSection />);

    const section = container.firstChild as HTMLElement;
    expect(section.className).toContain("bg-brand-forest");

    const eyebrow = screen.getByText(
      "Wetland · Permitting · Assessments · Planning",
    );
    expect(eyebrow.className).toContain("text-eyebrow");

    const headline = screen.getByRole("heading", { level: 1 });
    expect(headline).toHaveTextContent(siteConfig.tagline);
    expect(headline.className).toContain("text-display-xl");
  });

  it("renders dual CTAs linking to /contact and /services", () => {
    render(<HeroSection />);

    const primary = screen.getByRole("link", {
      name: "Request a Consultation",
    });
    expect(primary).toHaveAttribute("href", "/contact");
    expect(primary.className).toContain("bg-brand-ivory");

    const secondary = screen.getByRole("link", {
      name: "Explore Our Services",
    });
    expect(secondary).toHaveAttribute("href", "/services");
    expect(secondary.className).toContain("border-brand-sage");
  });
});

describe("CredibilitySection", () => {
  it("renders the 4-column metric grid", () => {
    render(<CredibilitySection />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Credibility, by the numbers",
      }),
    ).toBeInTheDocument();

    const values = ["1,200+", "99.4%", "12", "20+"];
    for (const value of values) {
      expect(screen.getByText(value)).toBeInTheDocument();
    }

    const labels = [
      "Acres delineated",
      "Permitting approval rate",
      "Professional certifications",
      "Years in practice",
    ];
    for (const label of labels) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }

    const grid = screen.getByText("1,200+").closest("ul");
    expect(grid).not.toBeNull();
    expect(grid?.className).toContain("grid-cols-2");
    expect(grid?.className).toContain("md:grid-cols-4");
  });

  it("includes the mandatory illustrative demonstration disclaimer", () => {
    render(<CredibilitySection />);

    expect(
      screen.getByText(
        "All illustrative statistics, certifications, and case studies shown are demonstrations.",
      ),
    ).toBeInTheDocument();
  });
});
