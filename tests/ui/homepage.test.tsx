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

describe("Homepage structure", () => {
  it("assembles the complete nine-section narrative", () => {
    const { container } = render(<HomePage />);

    expect(container.querySelectorAll("section")).toHaveLength(9);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Environmental consulting/,
      }),
    ).toBeInTheDocument();

    // Nav anchor contracts: /#projects, /#approach, /#faq (+ #team).
    for (const id of ["projects", "approach", "team", "faq"]) {
      expect(container.querySelector(`#${id}`)).not.toBeNull();
    }
  });

  it("presents section headings in narrative order", () => {
    render(<HomePage />);

    expect(
      screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent),
    ).toEqual([
      "Credibility, by the numbers",
      "Four disciplines, one defensible record",
      "Sectors we know deeply",
      "Casco Bay coastal wetland restoration",
      "From first records review to final monitoring",
      "Certified scientists and engineers",
      "Questions, answered",
      "Tell us about your site",
    ]);
  });
});

describe("TeamSection", () => {
  it("features credentialed scientists and engineers with agency backgrounds", () => {
    render(<HomePage />);

    expect(document.getElementById("team")).not.toBeNull();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Certified scientists and engineers",
      }),
    ).toBeInTheDocument();

    for (const credential of ["PWS", "PE", "CPSS", "CEP"]) {
      expect(screen.getByText(credential)).toBeInTheDocument();
    }

    expect(screen.getByText("Dr. Elena Marsh")).toBeInTheDocument();
    expect(screen.getByText("Daniel Okafor")).toBeInTheDocument();
    expect(
      screen.getByText(/Army Corps of Engineers, New England District/),
    ).toBeInTheDocument();
    expect(screen.getByText(/state soil scientist/)).toBeInTheDocument();
  });
});

describe("FaqSection", () => {
  const questionTrigger = (pattern: RegExp) =>
    screen.getByRole("button", { name: pattern });

  it("toggles answers with aria-expanded and aria-controls wiring", () => {
    render(<HomePage />);

    expect(document.getElementById("faq")).not.toBeNull();
    expect(screen.getAllByRole("button")).toHaveLength(4);

    const first = questionTrigger(/Which regulations govern a wetland/);
    const second = questionTrigger(/When is an ASTM Phase I ESA required/);

    // First question open by default; its answer is in the rendered HTML.
    expect(first).toHaveAttribute("aria-expanded", "true");
    expect(second).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.getByText(/1987 Corps Wetland Delineation Manual/),
    ).toBeInTheDocument();

    const panelId = second.getAttribute("aria-controls");
    expect(panelId).toBeTruthy();
    expect(panelId && document.getElementById(panelId)).toBeNull();

    fireEvent.click(second);

    expect(second).toHaveAttribute("aria-expanded", "true");
    expect(first).toHaveAttribute("aria-expanded", "false");
    expect(panelId && document.getElementById(panelId)).not.toBeNull();
    expect(screen.getByText(/ASTM E1527-21/)).toBeInTheDocument();
  });

  it("navigates between questions with arrow keys", () => {
    render(<HomePage />);

    const first = questionTrigger(/Which regulations govern/);
    const second = questionTrigger(/When is an ASTM/);
    const third = questionTrigger(/How long does environmental permitting/);
    const fourth = questionTrigger(/Why is there no fixed price list/);

    first.focus();
    expect(first).toHaveFocus();

    fireEvent.keyDown(first, { key: "ArrowDown" });
    expect(second).toHaveFocus();

    fireEvent.keyDown(second, { key: "End" });
    expect(fourth).toHaveFocus();

    fireEvent.keyDown(fourth, { key: "ArrowUp" });
    expect(third).toHaveFocus();

    fireEvent.keyDown(third, { key: "Home" });
    expect(first).toHaveFocus();
  });
});

describe("ConsultationCta", () => {
  it("closes with a banner offering consultation, phone, and email channels", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Tell us about your site",
      }),
    ).toBeInTheDocument();

    const consultationLinks = screen.getAllByRole("link", {
      name: /Request a Consultation/i,
    });
    expect(consultationLinks.length).toBeGreaterThan(0);
    for (const link of consultationLinks) {
      expect(link).toHaveAttribute("href", "/contact");
    }

    expect(
      screen.getByRole("link", { name: /\(207\) 555-0148/ }),
    ).toHaveAttribute("href", "tel:+12075550148");
    expect(
      screen.getByRole("link", { name: /inquiries@integravity\.example/ }),
    ).toHaveAttribute("href", "mailto:inquiries@integravity.example");
  });
});
