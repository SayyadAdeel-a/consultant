import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

/**
 * Global test setup. jsdom matchers are loaded for UI tests; node tests
 * simply skip DOM assertions. Keep setup minimal — heavy scaffolding belongs
 * in individual test files.
 */
if (typeof window !== "undefined" && !window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}
