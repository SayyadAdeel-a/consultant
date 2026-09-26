import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

/**
 * Vitest configuration.
 *
 * Two projects:
 * - `node`: pure logic tests (validation schemas, utilities, security
 *   helpers) — fast, no DOM.
 * - `ui`: component tests in jsdom via Testing Library.
 *
 * Extend src/lib/validations, src/lib/utilities, and src/lib/auth tests as
 * implementation progresses (see docs/TASKS.md).
 */
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src/lib/**", "src/config/**"],
      exclude: ["src/lib/supabase/**", "src/types/**"],
    },
    projects: [
      {
        test: {
          name: "node",
          environment: "node",
          globals: true,
          include: ["tests/unit/**/*.test.ts"],
        },
      },
      {
        test: {
          name: "ui",
          environment: "jsdom",
          globals: true,
          include: ["tests/ui/**/*.test.tsx"],
          setupFiles: ["./tests/setup.ts"],
        },
      },
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
