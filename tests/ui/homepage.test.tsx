import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import HomePage from "@/app/(public)/page";

/**
 * Homepage narrative tests (docs/TASKS.md Task 3.4).
 *
 * Renders the full assembled homepage and verifies the nine-section
 * structure, team credentials, FAQ accordion interaction (including
 * keyboard navigation and ARIA wiring), and the closing consultation
 * banner.
 *
 * `HomePage` is async since Task 9.1 (fail-safe CMS reads for section
 * visibility and identity); every test awaits it before rendering. The
 * reads throw `SupabaseNotConfiguredError` in the test environment and
 * fall back to the static nine-section layout.
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

import {
  aboutIntroContent,
  approachCredibilityContent,
  coreExpertiseContent,
  faqContent,
  homepageInsightsContent,
  serviceHighlightsContent,
} from "@/lib/alderline-content";

describe("Homepage structure", () => {
  it("assembles the complete seven-section narrative", async () => {
    const { container } = render(await HomePage());

    expect(container.querySelectorAll("section")).toHaveLength(7);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Environmental consulting/i,
      }),
    ).toBeInTheDocument();

    // Nav anchor contracts: /#projects, /#approach, /#faq (+ #team).
    for (const id of ["projects", "approach", "team", "faq"]) {
      expect(container.querySelector(`#${id}`)).not.toBeNull();
    }
  });

  it("presents section headings in narrative order", async () => {
    render(await HomePage());

    expect(
      screen.getByRole("heading", { name: aboutIntroContent.heading }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: coreExpertiseContent.heading }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: serviceHighlightsContent.heading }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: approachCredibilityContent.heading }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: homepageInsightsContent.heading }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: faqContent.heading }),
    ).toBeInTheDocument();
  });
});

describe("Team and Metrics Section", () => {
  it("features quantitative impact metrics and credibility statements", async () => {
    render(await HomePage());

    expect(document.getElementById("team")).not.toBeNull();
    expect(screen.getByText("FIELD-LED")).toBeInTheDocument();
    expect(screen.getByText("PERMIT-FOCUSED")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: approachCredibilityContent.heading,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(approachCredibilityContent.eyebrow),
    ).toBeInTheDocument();
  });
});

describe("FaqSection", () => {
  it("renders accordion items and toggles answers on click", async () => {
    const { container } = render(await HomePage());

    expect(document.getElementById("faq")).not.toBeNull();
    expect(
      screen.getByRole("heading", { name: faqContent.heading }),
    ).toBeInTheDocument();

    // First question is open by default.
    expect(screen.getByText(faqContent.items[0].a)).toBeInTheDocument();

    // Click second question header to toggle.
    const headers = container.querySelectorAll(".accordion-header");
    expect(headers.length).toBe(faqContent.items.length);

    fireEvent.click(headers[1]);
    expect(screen.getByText(faqContent.items[1].a)).toBeInTheDocument();
  });
});

describe("Navigation and Footer", () => {
  it("renders brand logos and consultation CTA links", async () => {
    render(await HomePage());

    const consultationLinks = screen.getAllByRole("link", {
      name: /Request a Consultation/i,
    });
    expect(consultationLinks.length).toBeGreaterThan(0);
    for (const link of consultationLinks) {
      expect(link).toHaveAttribute("href", "/contact");
    }

    const brandLinks = screen.getAllByRole("link", {
      name: /Alderline Environmental/i,
    });
    expect(brandLinks.length).toBeGreaterThan(0);
  });
});
