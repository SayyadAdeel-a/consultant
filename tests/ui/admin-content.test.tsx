import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AdminContentPage from "@/app/admin/content/page";
import { ContentSectionsTable } from "@/components/admin";
import { assertAdmin, requireAdmin } from "@/lib/auth/admin";
import { SupabaseNotConfiguredError } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { HomepageSectionRecord } from "@/types/cms";

// The auth gate and Supabase client are mocked so the real page, table,
// editor drawer, and Server Actions run against scripted results.
// `assertAdmin` is mocked because the real module imports `server-only`.
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

const SECTION_ROWS: HomepageSectionRecord[] = [
  {
    id: "sec-1",
    section_key: "hero",
    title: "Coastal resilience, engineered",
    subtitle: "Wetlands, permitting, and field science.",
    is_visible: true,
    display_order: 1,
  },
  {
    id: "sec-2",
    section_key: "credibility",
    title: "Proof in the field",
    subtitle: null,
    is_visible: false,
    display_order: 2,
  },
  {
    id: "sec-3",
    section_key: "faq",
    title: "Common questions",
    subtitle: "What clients ask first.",
    is_visible: true,
    display_order: 3,
  },
];

type WriteOp = {
  type: "update";
  table: string;
  payload: Record<string, unknown>;
  filters: Record<string, unknown>;
};

/**
 * Chainable fake covering the shapes this suite needs:
 * - read:  `from().select().order()` → `{ data: rows }`
 * - write: `from().update(payload).eq()` → recorded
 * Both resolve when awaited (thenable builder).
 */
function createSupabaseMock(
  data: Record<string, unknown[]> = { homepage_sections: SECTION_ROWS },
  options: { failRead?: boolean } = {},
) {
  const writes: WriteOp[] = [];

  const from = vi.fn((table: string) => {
    const state: {
      mode: "read" | "update";
      payload: Record<string, unknown> | null;
      filters: Record<string, unknown>;
    } = { mode: "read", payload: null, filters: {} };

    function resolve() {
      if (state.mode !== "read") {
        writes.push({
          type: "update",
          table,
          payload: state.payload ?? {},
          filters: { ...state.filters },
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
      update: vi.fn((payload: Record<string, unknown>) => {
        state.mode = "update";
        state.payload = payload;
        return builder;
      }),
      eq: vi.fn((column: string, value: unknown) => {
        state.filters[column] = value;
        return builder;
      }),
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

describe("admin content page", () => {
  it("gates access and renders the section table from mocked rows", async () => {
    render(await AdminContentPage());

    expect(vi.mocked(requireAdmin)).toHaveBeenCalledTimes(1);
    expect(
      screen.getByRole("heading", { level: 1, name: "Homepage content" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/3 homepage sections/)).toBeInTheDocument();

    // Section key codes, headlines, visibility pills, and display order.
    expect(screen.getByText("hero")).toBeInTheDocument();
    expect(screen.getByText("credibility")).toBeInTheDocument();
    expect(screen.getByText("faq")).toBeInTheDocument();

    const row1 = screen
      .getByText("Coastal resilience, engineered")
      .closest("tr") as HTMLElement;
    expect(
      within(row1).getByText("Wetlands, permitting, and field science."),
    ).toBeInTheDocument();
    expect(within(row1).getByText("Visible")).toBeInTheDocument();
    expect(within(row1).getByText("1")).toBeInTheDocument();

    const row2 = screen
      .getByText("Proof in the field")
      .closest("tr") as HTMLElement;
    expect(within(row2).getByText("Hidden")).toBeInTheDocument();
    expect(within(row2).getByText("—")).toBeInTheDocument(); // null subtitle
    expect(within(row2).getByText("2")).toBeInTheDocument();
  });

  it("renders an explicit load-error notice when the query fails", async () => {
    vi.mocked(createClient).mockResolvedValue(
      createSupabaseMock({}, { failRead: true }) as never,
    );

    render(await AdminContentPage());

    expect(screen.getByRole("alert")).toHaveTextContent(
      /could not load homepage sections/i,
    );
  });

  it("propagates the redirect when requireAdmin() fails", async () => {
    vi.mocked(requireAdmin).mockRejectedValue(
      Object.assign(new Error("NEXT_REDIRECT:/admin/login"), {
        name: "RedirectError",
      }),
    );

    await expect(AdminContentPage()).rejects.toThrow(
      "NEXT_REDIRECT:/admin/login",
    );
    expect(vi.mocked(createClient)).not.toHaveBeenCalled();
  });

  it("renders setup guidance instead of crashing when Supabase is unconfigured", async () => {
    vi.mocked(requireAdmin).mockRejectedValue(
      new SupabaseNotConfiguredError("test"),
    );

    render(await AdminContentPage());

    expect(
      screen.getByRole("heading", { level: 1, name: "Homepage content" }),
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

describe("ContentSectionsTable visibility toggle", () => {
  it("flips optimistically, writes through the Server Action, and revalidates", async () => {
    const user = userEvent.setup({ delay: null });
    render(<ContentSectionsTable sections={SECTION_ROWS} />);

    const row = screen
      .getByText("Coastal resilience, engineered")
      .closest("tr") as HTMLElement;
    expect(within(row).getByText("Visible")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: "Hide Coastal resilience, engineered",
      }),
    );

    // Optimistic: the pill flips before the server round-trip settles.
    expect(within(row).getByText("Hidden")).toBeInTheDocument();

    await waitFor(() => {
      expect(mockClient.writes).toEqual([
        {
          type: "update",
          table: "homepage_sections",
          payload: { is_visible: false },
          filters: { id: "sec-1" },
        },
      ]);
    });
    expect(vi.mocked(assertAdmin)).toHaveBeenCalledTimes(1);
    expect(revalidatePath).toHaveBeenCalledWith("/admin/content");
    expect(revalidatePath).toHaveBeenCalledWith("/");
    expect(revalidatePath).toHaveBeenCalledTimes(2);
    expect(
      screen.getByRole("button", {
        name: "Show Coastal resilience, engineered",
      }),
    ).toBeInTheDocument();
  });
});

describe("SectionEditorDrawer", () => {
  it("edits title, subtitle, and display order through the update path", async () => {
    const user = userEvent.setup({ delay: null });
    render(<ContentSectionsTable sections={SECTION_ROWS} />);

    await user.click(
      screen.getByRole("button", { name: "Edit Common questions" }),
    );

    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByLabelText("Section title")).toHaveValue(
      "Common questions",
    );
    expect(within(dialog).getByLabelText("Subtitle (optional)")).toHaveValue(
      "What clients ask first.",
    );
    expect(within(dialog).getByLabelText("Display order")).toHaveValue(3);

    await user.clear(within(dialog).getByLabelText("Section title"));
    await user.type(
      within(dialog).getByLabelText("Section title"),
      "Frequently asked questions",
    );
    await user.clear(within(dialog).getByLabelText("Subtitle (optional)"));
    await user.click(
      within(dialog).getByRole("button", { name: "Save section" }),
    );

    await waitFor(() => {
      expect(mockClient.writes).toHaveLength(1);
    });
    expect(mockClient.writes[0]).toMatchObject({
      type: "update",
      table: "homepage_sections",
      payload: {
        title: "Frequently asked questions",
        subtitle: null, // cleared subtitle normalizes to NULL
        display_order: 3, // coerced to a number
      },
      filters: { id: "sec-3" },
    });
    expect(revalidatePath).toHaveBeenCalledWith("/admin/content");
    expect(revalidatePath).toHaveBeenCalledWith("/");
    expect(revalidatePath).toHaveBeenCalledTimes(2);
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("surfaces validation errors without touching the database", async () => {
    const user = userEvent.setup({ delay: null });
    render(<ContentSectionsTable sections={SECTION_ROWS} />);

    await user.click(
      screen.getByRole("button", { name: "Edit Common questions" }),
    );
    await user.clear(screen.getByLabelText("Section title"));
    await user.click(screen.getByRole("button", { name: "Save section" }));

    expect(
      await screen.findByText("Section title is required."),
    ).toBeInTheDocument();
    expect(vi.mocked(assertAdmin)).toHaveBeenCalledTimes(1);
    expect(vi.mocked(createClient)).not.toHaveBeenCalled();
    expect(mockClient.writes).toHaveLength(0);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
