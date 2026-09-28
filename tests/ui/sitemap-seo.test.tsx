import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
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
import type { AnchorHTMLAttributes, ReactNode } from "react";
import HomePage from "@/app/(public)/page";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { serviceList } from "@/config/services";
import { getSiteUrl, SupabaseNotConfiguredError } from "@/lib/env";
import { resolvePublicIdentity } from "@/lib/data/identity";
import { createPublicClient } from "@/lib/supabase/public";
import type { SiteSettingsRecord } from "@/types/cms";
import nextConfig from "../../next.config";

/**
 * Dynamic sitemap, SEO, and public CMS binding tests
 * (docs/TASKS.md Task 9.1).
 *
 * Covers:
 * - dynamic sitemap generation from mocked Supabase records (published
 *   services and case studies with `updated_at` as `lastModified`);
 * - graceful fallback to `@/config/services` when Supabase is
 *   unconfigured or the query fails;
 * - robots.txt directives (`/admin/*`, `/api/*` disallow);
 * - the identity view-model merge (CMS row vs. static defaults);
 * - homepage section-visibility gating and its fail-safe fallback;
 * - static Core Web Vitals guards (no raw `<img>` in public sources,
 *   reduced-motion support, modern image formats).
 *
 * `next/link` is stubbed as a plain anchor; `@/lib/supabase/public` is
 * mocked so every read is deterministic; a minimal `IntersectionObserver`
 * stub supports the shared `FadeIn` / `SlideUp` wrappers.
 */
vi.mock("next/link", () => ({
  default: ({
    children,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement> & { children?: ReactNode }) => (
    <a {...props}>{children}</a>
  ),
}));

vi.mock("@/lib/supabase/public", () => ({
  createPublicClient: vi.fn(),
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

/** Default: Supabase unavailable (matches the vitest environment). */
beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(createPublicClient).mockImplementation(() => {
    throw new SupabaseNotConfiguredError("test");
  });
});

const base = getSiteUrl();

const SETTINGS_ROW: SiteSettingsRecord = {
  id: "settings-1",
  company_name: "Marsh & Tide Environmental",
  tagline: "Science that survives review",
  description: "Full-service environmental practice for regulated sites.",
  contact_email: "hello@marshintide.example",
  contact_phone: "+1 (207) 555-0999",
  office_address: "9 Tide Court\nPortland, ME 04101",
  social_links: { linkedin: "https://linkedin.com/company/marsh-tide" },
  cta_settings: {
    primaryLabel: "Start a project",
    primaryHref: "/contact#form",
    secondaryLabel: "See services",
    secondaryHref: "/services",
  },
};

type FakeTable = { rows?: unknown[]; error?: { message: string } };

/**
 * Chainable fake covering the chains the public fetchers use:
 * `from().select()` + optional `.eq()` / `.order()` / `.limit()`,
 * awaited as a thenable resolving `{ data, error }`.
 */
function createSupabaseFake(tables: Record<string, FakeTable>) {
  const from = vi.fn((table: string) => {
    const result: FakeTable = tables[table] ?? { rows: [] };
    const builder = {
      select: vi.fn(() => builder),
      eq: vi.fn(() => builder),
      order: vi.fn(() => builder),
      limit: vi.fn(() => builder),
      then: (
        onFulfilled?: (value: unknown) => unknown,
        onRejected?: (reason: unknown) => unknown,
      ) =>
        Promise.resolve(
          result.error
            ? { data: null, error: result.error }
            : { data: result.rows ?? [], error: null },
        ).then(onFulfilled, onRejected),
    };
    return builder;
  });
  return { from };
}

describe("Dynamic sitemap (/sitemap.xml)", () => {
  const cmsServices = [
    { slug: "cms-wetland-restoration", updated_at: "2026-09-01T10:00:00.000Z" },
    { slug: "cms-coastal-permitting", updated_at: "2026-09-15T08:30:00.000Z" },
  ];
  const cmsProjects = [
    { slug: "tidal-marsh-restoration", updated_at: "2026-09-20T12:00:00.000Z" },
  ];

  it("appends published CMS services and case studies with lastModified", async () => {
    vi.mocked(createPublicClient).mockImplementation(
      () =>
        createSupabaseFake({
          services: { rows: cmsServices },
          projects: { rows: cmsProjects },
        }) as never,
    );

    const entries = await sitemap();
    const urls = entries.map((entry) => entry.url);

    // Static routes remain.
    expect(urls).toContain(`${base}/`);
    expect(urls).toContain(`${base}/services`);
    expect(urls).toContain(`${base}/contact`);

    // CMS records appended with their slugs.
    expect(urls).toContain(`${base}/services/cms-wetland-restoration`);
    expect(urls).toContain(`${base}/services/cms-coastal-permitting`);
    expect(urls).toContain(`${base}/projects/tidal-marsh-restoration`);

    // CMS rows are the source of truth — static-only slugs are not
    // duplicated alongside the live catalog.
    expect(urls).not.toContain(`${base}/services/environmental-planning`);

    const entry = entries.find(
      (item) => item.url === `${base}/services/cms-wetland-restoration`,
    );
    expect(entry?.lastModified).toEqual(new Date("2026-09-01T10:00:00.000Z"));
    expect(entry?.changeFrequency).toBe("monthly");
  });

  it("falls back to the static serviceList when Supabase is unconfigured", async () => {
    const entries = await sitemap();
    const urls = entries.map((entry) => entry.url);

    for (const service of serviceList) {
      expect(urls).toContain(`${base}/services/${service.slug}`);
    }
    // No static case-study fallback exists — no project entries appear.
    expect(urls.some((url) => url.includes("/projects/"))).toBe(false);
  });

  it("falls back to the static serviceList when the query fails", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.mocked(createPublicClient).mockImplementation(
      () =>
        createSupabaseFake({
          services: { error: { message: "boom" } },
          projects: { error: { message: "boom" } },
        }) as never,
    );

    try {
      const entries = await sitemap();
      const urls = entries.map((entry) => entry.url);

      for (const service of serviceList) {
        expect(urls).toContain(`${base}/services/${service.slug}`);
      }
      expect(urls.some((url) => url.includes("/projects/"))).toBe(false);
      expect(warn).toHaveBeenCalled();
    } finally {
      warn.mockRestore();
    }
  });
});

describe("robots.txt directives", () => {
  it("allows the public site and disallows admin and API surfaces", () => {
    const config = robots();
    const rule = Array.isArray(config.rules) ? config.rules[0] : config.rules;

    expect(rule.allow).toBe("/");
    expect(rule.disallow).toContain("/admin");
    expect(rule.disallow).toContain("/admin/*");
    expect(rule.disallow).toContain("/api/*");
    expect(config.sitemap).toBe(`${base}/sitemap.xml`);
  });
});

describe("Public identity resolver", () => {
  it("prefers every field provided by the site_settings row", () => {
    const identity = resolvePublicIdentity(SETTINGS_ROW);

    expect(identity.name).toBe("Marsh & Tide Environmental");
    expect(identity.tagline).toBe("Science that survives review");
    expect(identity.description).toBe(
      "Full-service environmental practice for regulated sites.",
    );
    expect(identity.addressLines).toEqual([
      "9 Tide Court",
      "Portland, ME 04101",
    ]);
    expect(identity.email).toBe("hello@marshintide.example");
    expect(identity.phone).toBe("+1 (207) 555-0999");
    expect(identity.phoneHref).toBe("tel:+12075550999");
    expect(identity.socialLinks).toEqual([
      { label: "LinkedIn", href: "https://linkedin.com/company/marsh-tide" },
    ]);
    expect(identity.primaryCta).toEqual({
      label: "Start a project",
      href: "/contact#form",
    });
    expect(identity.secondaryCta).toEqual({
      label: "See services",
      href: "/services",
    });
  });

  it("falls back to the static defaults when settings are absent", () => {
    const identity = resolvePublicIdentity(null);

    expect(identity.name).toBe("Alderline Environmental");
    expect(identity.tagline).toBe(
      "Environmental insight. Practical solutions.",
    );
    expect(identity.addressLines).toEqual([
      "14 Marshview Lane, Suite 300",
      "Portland, Maine 04101",
    ]);
    expect(identity.email).toBe("inquiries@integravity.example");
    expect(identity.phone).toBe("(207) 555-0148");
    expect(identity.phoneHref).toBe("tel:+12075550148");
    expect(identity.socialLinks).toEqual([]);
    expect(identity.primaryCta).toEqual({
      label: "Request a Consultation",
      href: "/contact",
    });
    expect(identity.secondaryCta).toEqual({
      label: "Explore Our Services",
      href: "/services",
    });
  });
});

describe("Homepage section visibility & identity binding", () => {
  const allSections = [
    "hero",
    "credibility",
    "services",
    "industries",
    "projects",
    "approach",
    "team",
    "faq",
    "cta",
  ];

  it("excludes hidden sections and renders the CMS identity", async () => {
    // RLS only returns visible rows — `faq` is absent, i.e. hidden.
    const visibleKeys = allSections
      .filter((key) => key !== "faq")
      .map((section_key) => ({ section_key, is_visible: true }));

    vi.mocked(createPublicClient).mockImplementation(
      () =>
        createSupabaseFake({
          homepage_sections: { rows: visibleKeys },
          site_settings: { rows: [SETTINGS_ROW] },
        }) as never,
    );

    const { container } = render(await HomePage());

    expect(container.querySelectorAll("section")).toHaveLength(6);
    expect(
      screen.queryByRole("heading", { name: /questions/i }),
    ).toBeNull();

    // Identity flows to the hero headline and CTA pair.
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Science that survives review",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: "Start a project" }).length,
    ).toBeGreaterThan(0);
  });

  it("renders all nine sections when Supabase is unconfigured", async () => {
    const { container } = render(await HomePage());

    expect(container.querySelectorAll("section")).toHaveLength(7);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Environmental consulting/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /questions/i }),
    ).toBeInTheDocument();
  });

  it("seeds all nine section keys so admin visibility toggles work", () => {
    // Task 10.1 seed migration: every homepage key must exist exactly
    // once, visible by default, and idempotently (ON CONFLICT), so a
    // fresh deployment's /admin/content toggles are immediately active.
    const sql = readFileSync(
      join(
        process.cwd(),
        "supabase",
        "migrations",
        "20260927000002_seed_homepage_sections.sql",
      ),
      "utf8",
    );

    for (const key of allSections) {
      expect
        .soft(sql, `seed missing section_key '${key}'`)
        .toContain(`('${key}',`);
    }
    expect(sql).toContain("ON CONFLICT (section_key) DO NOTHING");
    expect(sql.match(/, TRUE, \d+\)/g)).toHaveLength(allSections.length);
  });
});

describe("Core Web Vitals & image optimization guards", () => {
  const publicUiRoots = [
    "src/components/sections",
    "src/components/layout",
    "src/components/ui",
    "src/components/animations",
    "src/components/forms",
    "src/app/(public)",
  ];

  const collectSourceFiles = (dir: string): string[] =>
    readdirSync(dir, { recursive: true, withFileTypes: true }).flatMap(
      (entry) => {
        const path = join(entry.parentPath, entry.name);
        if (entry.isDirectory()) return collectSourceFiles(path);
        return /\.(tsx|ts)$/.test(entry.name) ? [path] : [];
      },
    );

  it("keeps raw <img> elements out of public UI sources", () => {
    // Any media rendered on public pages must go through next/image
    // (explicit dimensions, AVIF/WebP, priority for above-the-fold
    // imagery) — a raw <img> would break that contract.
    for (const root of publicUiRoots) {
      for (const file of collectSourceFiles(join(process.cwd(), root))) {
        expect.soft(readFileSync(file, "utf8"), file).not.toMatch(/<img[\s>]/);
      }
    }
  });

  it("ships prefers-reduced-motion support for public animations", () => {
    const css = readFileSync(
      join(process.cwd(), "src/app/globals.css"),
      "utf8",
    );
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
  });

  it("negotiates modern image formats in next.config", () => {
    expect(nextConfig.images?.formats).toEqual(["image/avif", "image/webp"]);
  });
});
