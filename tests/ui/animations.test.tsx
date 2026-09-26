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
import { useReducedMotion } from "motion/react";
import {
  DEFAULT_DURATION,
  EASE_OUT_EXPO,
  FadeIn,
  SlideUp,
} from "@/components/animations";

/**
 * Animation wrapper tests.
 *
 * `motion/react` keeps its real component implementations but swaps
 * `useReducedMotion` for a mock, so both branches (animated vs. static)
 * are deterministic under jsdom. A minimal `IntersectionObserver` stub is
 * installed because `whileInView` observes elements on mount.
 */
vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return {
    ...actual,
    useReducedMotion: vi.fn(() => false),
  };
});

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

beforeEach(() => {
  vi.mocked(useReducedMotion).mockReturnValue(false);
});

describe("FadeIn", () => {
  it("renders its children", () => {
    render(
      <FadeIn>
        <p>Section body</p>
      </FadeIn>,
    );

    expect(screen.getByText("Section body")).toBeInTheDocument();
  });

  it("applies className and starts hidden until revealed on scroll", () => {
    const { container } = render(
      <FadeIn className="pt-8">
        <p>Section body</p>
      </FadeIn>,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.tagName).toBe("DIV");
    expect(wrapper.className).toContain("pt-8");
    expect(wrapper.style.opacity).toBe("0");
  });

  it("renders an un-animated div when reduced motion is preferred", () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);

    const { container } = render(
      <FadeIn className="pt-8" delay={0.2} duration={0.4}>
        <p>Section body</p>
      </FadeIn>,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.tagName).toBe("DIV");
    expect(wrapper.className).toContain("pt-8");
    expect(screen.getByText("Section body")).toBeInTheDocument();
    // No motion styles are applied at all.
    expect(wrapper.getAttribute("style")).toBeNull();
    expect(wrapper.style.opacity).toBe("");
  });
});

describe("SlideUp", () => {
  it("renders its children", () => {
    render(
      <SlideUp>
        <p>Rising content</p>
      </SlideUp>,
    );

    expect(screen.getByText("Rising content")).toBeInTheDocument();
  });

  it("starts hidden with a 16px vertical offset until revealed", () => {
    const { container } = render(
      <SlideUp className="py-6">
        <p>Rising content</p>
      </SlideUp>,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.tagName).toBe("DIV");
    expect(wrapper.className).toContain("py-6");
    expect(wrapper.style.opacity).toBe("0");
    expect(wrapper.style.transform).toContain("16px");
  });

  it("renders an un-animated div when reduced motion is preferred", () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);

    const { container } = render(
      <SlideUp className="py-6" delay={0.1}>
        <p>Rising content</p>
      </SlideUp>,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.tagName).toBe("DIV");
    expect(wrapper.className).toContain("py-6");
    expect(screen.getByText("Rising content")).toBeInTheDocument();
    // No motion styles are applied at all.
    expect(wrapper.getAttribute("style")).toBeNull();
    expect(wrapper.style.transform).toBe("");
  });
});

describe("design-system motion contract", () => {
  it("uses the out-expo easing curve and an in-range default duration", () => {
    expect(EASE_OUT_EXPO).toEqual([0.16, 1, 0.3, 1]);
    expect(DEFAULT_DURATION).toBeGreaterThanOrEqual(0.3);
    expect(DEFAULT_DURATION).toBeLessThanOrEqual(0.4);
  });
});
