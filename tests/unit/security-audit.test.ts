// @vitest-environment jsdom

/**
 * Security regression & boundary verification suite (docs/TASKS.md Task 8.1).
 *
 * Enforces the architectural boundaries and fail-closed guarantees of
 * docs/BACKEND_SECURITY.md / AGENTS.md §5 as executable checks:
 *
 * 1. Client bundle & secret isolation — `SUPABASE_SERVICE_ROLE_KEY` and the
 *    service-role admin client must never appear under src/components/,
 *    src/hooks/, or src/config/ (static source scan of the actual files
 *    shipped to the browser).
 * 2. Unauthenticated admin mutations — every CMS Server Action must reject
 *    through the genuine `assertAdmin()` gate (the real auth module runs;
 *    only Supabase's session is simulated) before touching the data plane.
 * 3. RLS — statically enforced from the migrations, the source of truth for
 *    database policy (no live database in the unit suite): anonymous access
 *    to `public.inquiries` is INSERT-only; every read-capable policy is
 *    `is_admin()`-gated, so an unauthenticated query yields zero rows or a
 *    permission error by construction.
 * 4. Honeypot — `submitInquiry` must discard `companyWebsite`-populated
 *    submissions with a fake success and zero database calls.
 * 5. Upload boundary — `mediaUploadSchema` blocks disallowed MIME types and
 *    files above 5MB before any storage access.
 * 6. CMS pricing rule — blank/null/whitespace-only pricing notes must not
 *    produce DOM nodes in the public service template.
 *
 * The jsdom environment (per-file pragma) exists for §6's DOM assertions;
 * everything else is environment-agnostic (source scans, SQL parsing,
 * schema/action invocation).
 */

import "@testing-library/jest-dom/vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { render, screen } from "@testing-library/react";
import {
  createElement,
  type AnchorHTMLAttributes,
  type ReactNode,
} from "react";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { submitInquiry, type ContactFormState } from "@/app/actions/contact";
import {
  toggleSectionVisibility,
  updateHomepageSection,
} from "@/app/actions/content";
import { uploadMediaAsset, deleteMediaAsset } from "@/app/actions/media";
import {
  updateInquiryNotes,
  updateInquiryStatus,
} from "@/app/actions/inquiries";
import {
  toggleProjectFeatured,
  toggleProjectPublished,
  upsertProject,
} from "@/app/actions/projects";
import { toggleServicePublished, upsertService } from "@/app/actions/services";
import { updateSiteSettings } from "@/app/actions/settings";
import ServicePage from "@/app/(public)/services/[slug]/page";
import { hasPricingNote, serviceList, services } from "@/config/services";
import { assertAdmin } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";
import { mediaUploadSchema } from "@/lib/validations/media";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const SAMPLE_ID = "11111111-1111-4111-8111-111111111111";
const UNAUTHORIZED_MESSAGE = "Unauthorized: administrator privileges required.";

// The gate and navigation are genuine; only framework internals are faked.
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`Unexpected redirect from a Server Action: ${url}`);
  }),
  notFound: vi.fn(() => {
    throw new Error("Unexpected notFound() during security audit render");
  }),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  })),
  usePathname: vi.fn(() => "/"),
  useSearchParams: vi.fn(() => new URLSearchParams()),
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement> & { children?: ReactNode }) =>
    createElement("a", props, children),
}));

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));

/** Every data-plane touch observed while the session is unauthenticated. */
let dataAccesses: string[] = [];

beforeEach(() => {
  vi.clearAllMocks();
  dataAccesses = [];

  // Unauthenticated Supabase session: `auth.getUser()` yields no user, so
  // the real `getAdminUser()` returns null and `assertAdmin()` throws.
  // Any table/storage access on this client throws immediately AND is
  // recorded — a gate that lets payloads reach the data plane fails loud.
  vi.mocked(createClient).mockResolvedValue({
    auth: {
      getUser: vi.fn(async () => ({ data: { user: null }, error: null })),
    },
    from: vi.fn((table: string) => {
      dataAccesses.push(`table:${table}`);
      throw new Error(
        `Unexpected data access on "${table}" without an admin session.`,
      );
    }),
    storage: {
      from: vi.fn((bucket: string) => {
        dataAccesses.push(`storage:${bucket}`);
        throw new Error(
          `Unexpected storage access on "${bucket}" without an admin session.`,
        );
      }),
    },
  } as never);
});

/**
 * framer-motion's `whileInView` wrappers observe elements on mount; jsdom
 * ships no IntersectionObserver (same stub as the UI suites).
 */
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

// ---------------------------------------------------------------------------
// 1. Client bundle & secret isolation audit
// ---------------------------------------------------------------------------
describe("client bundle & secret isolation audit", () => {
  const AUDITED_ROOTS = ["src/components", "src/hooks", "src/config"];

  function listSourceFiles(dir: string): string[] {
    if (!existsSync(dir)) return [];
    const files: string[] = [];
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...listSourceFiles(full));
      } else if (
        entry.isFile() &&
        /\.(ts|tsx|js|jsx|mjs|cjs)$/.test(entry.name)
      ) {
        files.push(full);
      }
    }
    return files;
  }

  const auditedFiles = AUDITED_ROOTS.flatMap((rel) =>
    listSourceFiles(path.join(ROOT, rel)),
  );

  it("scans the intended scope (guards against a vacuous audit)", () => {
    expect(auditedFiles.length).toBeGreaterThanOrEqual(40);
  });

  it("never references SUPABASE_SERVICE_ROLE_KEY or the service-role admin client", () => {
    const offenders = auditedFiles.filter((file) => {
      const source = readFileSync(file, "utf8");
      return (
        source.includes("SUPABASE_SERVICE_ROLE_KEY") ||
        /lib\/supabase\/admin/.test(source)
      );
    });

    expect(
      offenders.map((file) => path.relative(ROOT, file).replace(/\\/g, "/")),
    ).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// 2. Unauthenticated admin mutation protection
// ---------------------------------------------------------------------------
describe("unauthenticated admin mutation protection", () => {
  async function expectRejectedAtTheGate(
    invoke: () => Promise<unknown>,
  ): Promise<void> {
    await expect(invoke()).rejects.toThrow(UNAUTHORIZED_MESSAGE);
    // Fail-closed: no table/storage access, no cache revalidation, and
    // admin actions must never redirect (they throw instead).
    expect(dataAccesses).toEqual([]);
    expect(vi.mocked(revalidatePath)).not.toHaveBeenCalled();
    expect(vi.mocked(redirect)).not.toHaveBeenCalled();
  }

  it("assertAdmin() itself rejects cleanly without a session", async () => {
    await expect(assertAdmin()).rejects.toThrow(UNAUTHORIZED_MESSAGE);
    expect(dataAccesses).toEqual([]);
  });

  const UNAUTHENTICATED_CALLS: Array<[string, () => Promise<unknown>]> = [
    ["updateInquiryStatus", () => updateInquiryStatus(SAMPLE_ID, "archived")],
    [
      "updateInquiryNotes",
      () => updateInquiryNotes(SAMPLE_ID, "Follow up Monday"),
    ],
    ["toggleServicePublished", () => toggleServicePublished(SAMPLE_ID, true)],
    ["upsertService", () => upsertService(new FormData())],
    ["toggleProjectPublished", () => toggleProjectPublished(SAMPLE_ID, true)],
    ["toggleProjectFeatured", () => toggleProjectFeatured(SAMPLE_ID, true)],
    ["upsertProject", () => upsertProject(new FormData())],
    ["updateSiteSettings", () => updateSiteSettings(new FormData())],
    [
      "toggleSectionVisibility",
      () => toggleSectionVisibility(SAMPLE_ID, false),
    ],
    ["updateHomepageSection", () => updateHomepageSection(new FormData())],
    ["uploadMediaAsset", () => uploadMediaAsset(new FormData())],
    ["deleteMediaAsset", () => deleteMediaAsset(SAMPLE_ID, "media/asset.jpg")],
  ];

  it.each(UNAUTHENTICATED_CALLS)(
    "rejects %s through assertAdmin() before touching the data plane",
    async (_label, invoke) => {
      await expectRejectedAtTheGate(invoke);
    },
  );
});

// ---------------------------------------------------------------------------
// 3. Database Row Level Security guarantees (static migration enforcement)
// ---------------------------------------------------------------------------
describe("database row level security guarantees", () => {
  const migrationsDir = path.join(ROOT, "supabase", "migrations");
  const migrationSql = readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort()
    .map((file) => readFileSync(path.join(migrationsDir, file), "utf8"))
    .join("\n");

  /** Every `CREATE POLICY` statement that governs `public.inquiries`. */
  const inquiryPolicies =
    migrationSql.match(/CREATE POLICY[^;]+ON public\.inquiries[^;]*;/gi) ?? [];

  it("enables RLS on public.inquiries and never disables it", () => {
    expect(migrationSql).toMatch(
      /ALTER TABLE public\.inquiries ENABLE ROW LEVEL SECURITY/i,
    );
    expect(migrationSql).not.toMatch(
      /ALTER TABLE public\.inquiries DISABLE ROW LEVEL SECURITY/i,
    );
  });

  it("grants anonymous visitors INSERT only — every read path is admin-gated", () => {
    const insertPolicies = inquiryPolicies.filter((policy) =>
      /FOR INSERT/i.test(policy),
    );
    const readPolicies = inquiryPolicies.filter((policy) =>
      /FOR (SELECT|ALL)/i.test(policy),
    );

    // Contact intake: anon may insert, nothing more.
    expect(insertPolicies).toHaveLength(1);
    expect(insertPolicies[0]).toMatch(/TO anon, authenticated/i);
    expect(insertPolicies[0]).toMatch(/WITH CHECK \(TRUE\)/i);
    expect(insertPolicies[0]).not.toMatch(/FOR (SELECT|ALL)/i);

    // Every read-capable policy must target authenticated admins under
    // `is_admin()` — an unauthenticated SELECT therefore matches no policy
    // and returns zero rows / raises a permission error.
    expect(readPolicies.length).toBeGreaterThanOrEqual(1);
    for (const policy of readPolicies) {
      expect(policy).toMatch(/TO authenticated/i);
      expect(policy).not.toMatch(/TO\s+(anon|public)\b/i);
      expect(policy).toMatch(/USING \(public\.is_admin\(\)\)/i);
    }
  });
});

// ---------------------------------------------------------------------------
// 4. Honeypot anti-spam verification
// ---------------------------------------------------------------------------
describe("honeypot anti-spam verification", () => {
  it("discards companyWebsite submissions with fake success and zero database calls", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    try {
      const formData = new FormData();
      // Honeypot: humans never see this field (BACKEND_SECURITY §6.2).
      formData.set("companyWebsite", "https://spam.example");
      // Deliberately INVALID required fields: the discard must happen
      // BEFORE validation, so the bot still receives the success response.
      formData.set("name", "");
      formData.set("message", "");

      const idle: ContactFormState = {
        status: "idle",
        message: null,
        fieldErrors: null,
      };
      const result = await submitInquiry(idle, formData);

      expect(result.status).toBe("success");
      expect(result.message).toBeTruthy();
      expect(result.fieldErrors).toBeNull();
      // Zero database calls: no client, no table access.
      expect(vi.mocked(createClient)).not.toHaveBeenCalled();
      expect(dataAccesses).toEqual([]);
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("Honeypot"));
    } finally {
      warnSpy.mockRestore();
    }
  });
});

// ---------------------------------------------------------------------------
// 5. File upload boundary verification
// ---------------------------------------------------------------------------
describe("file upload boundary (mediaUploadSchema)", () => {
  function parseUpload(file: File) {
    return mediaUploadSchema.safeParse({
      file,
      alt: "Survey photograph",
      caption: "",
    });
  }

  it.each(["application/javascript", "text/html", "application/x-msdownload"])(
    "blocks uploads with the %s MIME type",
    (mimeType) => {
      const result = parseUpload(
        new File(["payload"], "payload.bin", { type: mimeType }),
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.map((issue) => issue.message)).toContain(
          "Only JPEG, PNG, WebP, or SVG image files are allowed.",
        );
      }
    },
  );

  it("rejects files exceeding the 5MB limit", () => {
    const result = parseUpload(
      new File([new Uint8Array(5 * 1024 * 1024 + 1)], "panorama.png", {
        type: "image/png",
      }),
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.message)).toContain(
        "File must be 5MB or smaller.",
      );
    }
  });

  it("rejects an empty (malformed, zero-byte) file", () => {
    const result = parseUpload(
      new File([], "empty.png", { type: "image/png" }),
    );

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.message)).toContain(
        "The selected file is empty.",
      );
    }
  });

  it("accepts a compliant image within the limit (positive control)", () => {
    const result = parseUpload(
      new File(["png-bytes"], "site-photo.png", { type: "image/png" }),
    );

    expect(result.success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 6. CMS pricing rule protection
// ---------------------------------------------------------------------------
describe("CMS pricing rule protection", () => {
  it("hasPricingNote() treats null, blank, and whitespace-only notes as undisplayable", () => {
    expect(hasPricingNote({ pricingNote: null })).toBe(false);
    expect(hasPricingNote({ pricingNote: "" })).toBe(false);
    expect(hasPricingNote({ pricingNote: "   " })).toBe(false);
    expect(hasPricingNote({ pricingNote: "\n\t  \n" })).toBe(false);
    expect(hasPricingNote({ pricingNote: "Quoted per project." })).toBe(true);
  });

  async function renderServicePage(slug: string): Promise<void> {
    const tree = await ServicePage({ params: Promise.resolve({ slug }) });
    render(tree);
  }

  it("renders the pricing block when the note is populated (positive control)", async () => {
    const populatedNote =
      serviceList.find((service) => service.slug === "wetland-delineation")
        ?.pricingNote ?? "";
    expect(populatedNote).not.toBe("");

    await renderServicePage("wetland-delineation");

    expect(screen.getByText("Pricing note")).toBeInTheDocument();
    expect(screen.getByText(populatedNote)).toBeInTheDocument();
  });

  it("renders no pricing DOM nodes for a null pricing note", async () => {
    await renderServicePage("environmental-permitting");

    expect(screen.queryByText("Pricing note")).not.toBeInTheDocument();
  });

  it("renders no pricing DOM nodes for a whitespace-only pricing note", async () => {
    const service = services["wetland-delineation"];
    const original = service.pricingNote;
    service.pricingNote = "   \n\t  ";

    try {
      await renderServicePage("wetland-delineation");

      expect(screen.queryByText("Pricing note")).not.toBeInTheDocument();
      // The page still renders around the hidden block.
      expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    } finally {
      service.pricingNote = original;
    }
  });
});
