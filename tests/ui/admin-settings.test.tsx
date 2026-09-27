import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { updateSiteSettings } from "@/app/actions/settings";
import AdminSettingsPage from "@/app/admin/settings/page";
import { SettingsForm } from "@/components/admin";
import { assertAdmin, requireAdmin } from "@/lib/auth/admin";
import { SupabaseNotConfiguredError } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { SiteSettingsRecord } from "@/types/cms";

// The auth gate and Supabase client are mocked so the real page, form,
// and Server Action run against scripted results. `assertAdmin` is
// mocked because the real module imports `server-only`.
vi.mock("@/lib/auth/admin", () => ({
  requireAdmin: vi.fn(),
  getAdminUser: vi.fn(),
  assertAdmin: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    const error = new Error(`NEXT_REDIRECT:${url}`);
    error.name = "RedirectError";
    throw error;
  }),
}));

const SETTINGS_ROW: SiteSettingsRecord = {
  id: "settings-1",
  company_name: "Marsh & Tide Environmental",
  tagline: "Field science. Lasting outcomes.",
  description:
    "Coastal resilience consulting for working waterfronts and tidal systems.",
  contact_email: "hello@marshandtide.example",
  contact_phone: "(207) 555-0142",
  office_address: "9 Harbor Street, Portland, ME 04101",
  social_links: {
    linkedin: "https://linkedin.com/company/marsh-tide",
    twitter: "https://x.com/marshandtide",
  },
  cta_settings: {
    primaryLabel: "Start a project",
    primaryHref: "/contact",
    secondaryLabel: "Browse our work",
    secondaryHref: "/services",
  },
};

const VALID_SETTINGS_INPUT = {
  company_name: "Marsh & Tide Environmental",
  tagline: "Field science. Lasting outcomes.",
  description: "Coastal resilience consulting for working waterfronts.",
  contact_email: "hello@marshandtide.example",
  contact_phone: "",
  office_address: "9 Harbor Street, Portland, ME 04101",
  linkedin_url: "https://linkedin.com/company/marsh-tide",
  twitter_url: "",
  primary_cta_label: "Start a project",
  primary_cta_url: "/contact",
  secondary_cta_label: "Browse our work",
  secondary_cta_url: "/services",
};

type WriteOp = {
  type: "upsert";
  table: string;
  payload: Record<string, unknown>;
  options: Record<string, unknown> | undefined;
};

/**
 * Chainable fake covering the shapes this suite needs:
 * - read:  `from().select().eq().limit()` → `{ data: rows }`
 * - write: `from().upsert(payload, options)` (singleton onConflict)
 * Both resolve when awaited (thenable builder); writes are recorded.
 */
function createSupabaseMock(
  data: Record<string, unknown[]> = { site_settings: [SETTINGS_ROW] },
  options: { failRead?: boolean } = {},
) {
  const writes: WriteOp[] = [];

  const from = vi.fn((table: string) => {
    const state: {
      mode: "read" | "upsert";
      payload: Record<string, unknown> | null;
      upsertOptions: Record<string, unknown> | undefined;
    } = { mode: "read", payload: null, upsertOptions: undefined };

    function resolve() {
      if (state.mode !== "read") {
        writes.push({
          type: "upsert",
          table,
          payload: state.payload ?? {},
          options: state.upsertOptions,
        });
        return { data: null, error: null };
      }
      if (options.failRead) {
        return { data: null, error: { message: "boom" } };
      }
      return { data: data[table] ?? [], error: null };
    }

    const builder = {
      select: vi.fn(() => builder),
      order: vi.fn(() => builder),
      limit: vi.fn(() => builder),
      eq: vi.fn(() => builder),
      upsert: vi.fn(
        (
          payload: Record<string, unknown>,
          upsertOptions?: Record<string, unknown>,
        ) => {
          state.mode = "upsert";
          state.payload = payload;
          state.upsertOptions = upsertOptions;
          return builder;
        },
      ),
      then: (
        onFulfilled?: (value: unknown) => unknown,
        onRejected?: (reason: unknown) => unknown,
      ) => Promise.resolve(resolve()).then(onFulfilled, onRejected),
    };

    return builder;
  });

  return { from, writes };
}

let mockClient: ReturnType<typeof createSupabaseMock>;

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(requireAdmin).mockResolvedValue({
    id: "admin-1",
    email: "admin@example.com",
  });
  vi.mocked(assertAdmin).mockResolvedValue({
    id: "admin-1",
    email: "admin@example.com",
  });
  mockClient = createSupabaseMock();
  vi.mocked(createClient).mockResolvedValue(mockClient as never);
});

describe("admin settings page", () => {
  it("gates access and renders every field from the singleton row", async () => {
    render(await AdminSettingsPage());

    expect(vi.mocked(requireAdmin)).toHaveBeenCalledTimes(1);
    expect(
      screen.getByRole("heading", { level: 1, name: "Site settings" }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText("Company name")).toHaveValue(
      "Marsh & Tide Environmental",
    );
    expect(screen.getByLabelText("Tagline")).toHaveValue(
      "Field science. Lasting outcomes.",
    );
    expect(screen.getByLabelText("Description")).toHaveValue(
      "Coastal resilience consulting for working waterfronts and tidal systems.",
    );
    expect(screen.getByLabelText("Email")).toHaveValue(
      "hello@marshandtide.example",
    );
    expect(screen.getByLabelText("Phone")).toHaveValue("(207) 555-0142");
    expect(screen.getByLabelText("Office address")).toHaveValue(
      "9 Harbor Street, Portland, ME 04101",
    );
    expect(screen.getByLabelText("LinkedIn URL")).toHaveValue(
      "https://linkedin.com/company/marsh-tide",
    );
    expect(screen.getByLabelText("Twitter / X URL")).toHaveValue(
      "https://x.com/marshandtide",
    );
    expect(screen.getByLabelText("Primary CTA label")).toHaveValue(
      "Start a project",
    );
    expect(screen.getByLabelText("Primary CTA URL")).toHaveValue("/contact");
    expect(screen.getByLabelText("Secondary CTA label")).toHaveValue(
      "Browse our work",
    );
    expect(screen.getByLabelText("Secondary CTA URL")).toHaveValue("/services");

    expect(
      screen.getByRole("button", { name: "Save settings" }),
    ).toBeInTheDocument();
  });

  it("renders an explicit load-error notice when the query fails", async () => {
    vi.mocked(createClient).mockResolvedValue(
      createSupabaseMock({}, { failRead: true }) as never,
    );

    render(await AdminSettingsPage());

    expect(screen.getByRole("alert")).toHaveTextContent(
      /could not load the site settings/i,
    );
  });

  it("propagates the redirect when requireAdmin() fails", async () => {
    vi.mocked(requireAdmin).mockRejectedValue(
      Object.assign(new Error("NEXT_REDIRECT:/admin/login"), {
        name: "RedirectError",
      }),
    );

    await expect(AdminSettingsPage()).rejects.toThrow(
      "NEXT_REDIRECT:/admin/login",
    );
    expect(vi.mocked(createClient)).not.toHaveBeenCalled();
  });

  it("renders setup guidance instead of crashing when Supabase is unconfigured", async () => {
    vi.mocked(requireAdmin).mockRejectedValue(
      new SupabaseNotConfiguredError("test"),
    );

    render(await AdminSettingsPage());

    expect(
      screen.getByRole("heading", { level: 1, name: "Site settings" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Configuration required",
      }),
    ).toBeInTheDocument();
    expect(vi.mocked(createClient)).not.toHaveBeenCalled();
  });
});

describe("updateSiteSettings Server Action", () => {
  it("validates, maps JSONB columns, upserts the singleton, and revalidates all four paths", async () => {
    const result = await updateSiteSettings(VALID_SETTINGS_INPUT);

    expect(result.ok).toBe(true);
    expect(vi.mocked(assertAdmin)).toHaveBeenCalledTimes(1);
    expect(mockClient.writes).toHaveLength(1);
    expect(mockClient.writes[0]).toMatchObject({
      type: "upsert",
      table: "site_settings",
      options: { onConflict: "singleton_guard" },
    });
    expect(mockClient.writes[0].payload).toEqual({
      company_name: "Marsh & Tide Environmental",
      tagline: "Field science. Lasting outcomes.",
      description: "Coastal resilience consulting for working waterfronts.",
      contact_email: "hello@marshandtide.example",
      // Blank optional fields normalize to NULL / get omitted from the JSONB.
      contact_phone: null,
      office_address: "9 Harbor Street, Portland, ME 04101",
      social_links: {
        linkedin: "https://linkedin.com/company/marsh-tide",
      },
      cta_settings: {
        primaryLabel: "Start a project",
        primaryHref: "/contact",
        secondaryLabel: "Browse our work",
        secondaryHref: "/services",
      },
    });

    expect(revalidatePath).toHaveBeenCalledWith("/admin/settings");
    expect(revalidatePath).toHaveBeenCalledWith("/");
    expect(revalidatePath).toHaveBeenCalledWith("/contact");
    expect(revalidatePath).toHaveBeenCalledWith("/admin");
    expect(revalidatePath).toHaveBeenCalledTimes(4);
  });

  it("accepts a FormData payload through the same validation path", async () => {
    const formData = new FormData();
    for (const [key, value] of Object.entries(VALID_SETTINGS_INPUT)) {
      formData.set(key, value);
    }

    const result = await updateSiteSettings(formData);

    expect(result.ok).toBe(true);
    expect(mockClient.writes).toHaveLength(1);
    expect(mockClient.writes[0]).toMatchObject({
      type: "upsert",
      table: "site_settings",
    });
    expect(revalidatePath).toHaveBeenCalledTimes(4);
  });

  it("returns field errors for invalid values without touching the database", async () => {
    const result = await updateSiteSettings({
      ...VALID_SETTINGS_INPUT,
      company_name: "",
      contact_email: "not-an-email",
      primary_cta_url: "contact", // neither site path nor absolute URL
    });

    expect(result.ok).toBe(false);
    expect(result).toMatchObject({
      fieldErrors: {
        company_name: "Company name is required.",
        contact_email: "Enter a valid email address.",
        primary_cta_url: "Enter a site path (/…) or an absolute URL.",
      },
    });
    expect(vi.mocked(createClient)).not.toHaveBeenCalled();
    expect(mockClient.writes).toHaveLength(0);
  });
});

describe("SettingsForm", () => {
  it("confirms a successful save with a status notice", async () => {
    const user = userEvent.setup({ delay: null });
    render(<SettingsForm settings={SETTINGS_ROW} />);

    await user.click(screen.getByRole("button", { name: "Save settings" }));

    expect(await screen.findByText("Settings saved.")).toBeInTheDocument();
    expect(mockClient.writes).toHaveLength(1);
    expect(vi.mocked(assertAdmin)).toHaveBeenCalledTimes(1);
  });

  it("surfaces inline validation errors without touching the database", async () => {
    const user = userEvent.setup({ delay: null });
    render(<SettingsForm settings={SETTINGS_ROW} />);

    await user.clear(screen.getByLabelText("Company name"));
    await user.clear(screen.getByLabelText("Email"));
    await user.type(screen.getByLabelText("Email"), "nope");
    await user.click(screen.getByRole("button", { name: "Save settings" }));

    expect(
      await screen.findByText("Company name is required."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Enter a valid email address."),
    ).toBeInTheDocument();
    expect(vi.mocked(createClient)).not.toHaveBeenCalled();
    expect(
      screen.getByRole("button", { name: "Save settings" }),
    ).toBeInTheDocument();
  });
});
