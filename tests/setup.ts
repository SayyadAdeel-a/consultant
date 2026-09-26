import "@testing-library/jest-dom/vitest";

/**
 * Global test setup. jsdom matchers are loaded for UI tests; node tests
 * simply skip DOM assertions. Keep setup minimal — heavy scaffolding belongs
 * in individual test files.
 */
