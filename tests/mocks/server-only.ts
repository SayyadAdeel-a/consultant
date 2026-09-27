/**
 * Vitest stand-in for the `server-only` package.
 *
 * Next.js aliases the `server-only` specifier at build time — the package
 * is intentionally not present in `node_modules`. The alias in
 * `vitest.config.ts` maps the specifier here so tests can import genuine
 * server modules (e.g. `src/lib/auth/admin.ts`, which opens with
 * `import "server-only"`) without tripping over an unresolvable import.
 *
 * The stub has no side effects, mirroring the package's `react-server`
 * export condition (the client-build entry only throws to prevent real
 * browser bundles from pulling server code — bundlers already guarantee
 * that separation, and this suite audits it explicitly).
 */
export {};
