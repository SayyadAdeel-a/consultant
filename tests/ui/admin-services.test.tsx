import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { upsertService } from "@/app/actions/services";
import AdminServicesPage from "@/app/admin/services/page";
import { ServicesTable } from "@/components/admin";
import { assertAdmin, requireAdmin } from "@/lib/auth/admin";
import { SupabaseNotConfiguredError } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { ServiceRecord } from "@/types/cms";

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

vi.mock("next/link", () => ({
  default: ({
    children,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement> & { children?: ReactNode }) => (
    <a {...props}>{children}</a>
  ),
}));

const SERVICE_ROWS: ServiceRecord[] = [
  {
    id: "svc-1",
    slug: "wetland-delineation",
    title: "Wetland Delineation",
    short_description: "Jurisdictional delineation and agency concurrence.",
    full_content: "Full delineation methodology narrative.",
    icon: "Waves",
    deliverables: [
      "Delineation report",
      "GIS map layers",
      "Joint permit support",
      "Concurrence tracking",
    ],
    regulatory_frameworks: ["CWA §404", "CWA §401", "1987 Corps Manual"],
    pricing_note: "Quoted per project after a records review.",
    is_published: true,
    display_order: 1,
  },
  {
    id: "svc-2",
    slug: "environmental-permitting",
    title: "Environmental Permitting",
    short_description: "Permit strategy and agency coordination.",
    full_content: "Full permitting methodology narrative.",
    icon: "FileCheck",
    deliverables: [
      "Permit matrix",
      "Application packages",
      "Comment responses",
    ],
    regulatory_frameworks: ["NEPA", "Coastal Zone Management"],
    pricing_note: null,
    is_published: false,
    display_order: 2,
  },
];

type WriteOp = {
  type: "update" | "insert";
  table: string;
  payload: Record<string, unknown>;
  filters: Record<string, unknown>;
};

/**
 * Chainable fake covering the shapes this suite needs:
 * - read:  `from().select().order()` → `{ data: rows }`
 * - write: `from().update(payload).eq()` / `from().insert(payload)`
 * Both resolve when awaited (thenable builder); writes are recorded.
 */
function createSupabaseMock(
  data: Record<string, unknown[]> = { services: SERVICE_ROWS },
  options: { failRead?: boolean } = {},
) {
  const writes: WriteOp[] = [];

  const from = vi.fn((table: string) => {
    const state: {
      mode: "read" | "update" | "insert";
      payload: Record<string, unknown> | null;
      filters: Record<string, unknown>;
    } = { mode: "read", payload: null, filters: {} };

    function resolve() {
      if (state.mode !== "read") {
        writes.push({
          type: state.mode,
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
      insert: vi.fn((payload: Record<string, unknown>) => {
        state.mode = "insert";
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

describe("admin services page", () => {
  it("gates access and renders the catalog from mocked rows", async () => {
    render(await AdminServicesPage());

    expect(vi.mocked(requireAdmin)).toHaveBeenCalledTimes(1);
    expect(
      screen.getByRole("heading", { level: 1, name: "Services & catalog" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/2 services in the catalog/)).toBeInTheDocument();

    // Row 1: title, slug, icon, deliverables count, frameworks, pricing
    // indicator, publication pill, display order.
    const row1 = screen
      .getByText("Wetland Delineation")
      .closest("tr") as HTMLElement;
    expect(within(row1).getByText("wetland-delineation")).toBeInTheDocument();
    expect(within(row1).getByText("Waves")).toBeInTheDocument();
    expect(within(row1).getByText("4")).toBeInTheDocument();
    expect(within(row1).getByText("CWA §404")).toBeInTheDocument();
    expect(within(row1).getByText("Pricing note")).toBeInTheDocument();
    expect(within(row1).getByText("Published")).toBeInTheDocument();
    expect(within(row1).getByText("1")).toBeInTheDocument();

    // Row 2: draft state, no pricing indicator (null note → plain dash).
    const row2 = screen
      .getByText("Environmental Permitting")
      .closest("tr") as HTMLElement;
    expect(within(row2).getByText("3")).toBeInTheDocument();
    expect(within(row2).getByText("NEPA")).toBeInTheDocument();
    expect(within(row2).getByText("Draft")).toBeInTheDocument();
    expect(within(row2).queryByText("Pricing note")).not.toBeInTheDocument();
    expect(within(row2).getByText("—")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "New service" }),
    ).toBeInTheDocument();
  });

  it("renders an explicit load-error notice when the query fails", async () => {
    vi.mocked(createClient).mockResolvedValue(
      createSupabaseMock({}, { failRead: true }) as never,
    );

    render(await AdminServicesPage());

    expect(screen.getByRole("alert")).toHaveTextContent(
      /could not load services/i,
    );
  });

  it("propagates the redirect when requireAdmin() fails", async () => {
    vi.mocked(requireAdmin).mockRejectedValue(
      Object.assign(new Error("NEXT_REDIRECT:/admin/login"), {
        name: "RedirectError",
      }),
    );

    await expect(AdminServicesPage()).rejects.toThrow(
      "NEXT_REDIRECT:/admin/login",
    );
    expect(vi.mocked(createClient)).not.toHaveBeenCalled();
  });

  it("renders setup guidance instead of crashing when Supabase is unconfigured", async () => {
    vi.mocked(requireAdmin).mockRejectedValue(
      new SupabaseNotConfiguredError("test"),
    );

    render(await AdminServicesPage());

    expect(
      screen.getByRole("heading", { level: 1, name: "Services" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Configuration required",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/supabase is not configured/i)).toBeInTheDocument();
    expect(vi.mocked(createClient)).not.toHaveBeenCalled();
  });
});

describe("ServicesTable pricing optionality (AGENTS.md §5.5)", () => {
  it("renders a pricing indicator only when a note exists — never the note's text", () => {
    render(<ServicesTable services={SERVICE_ROWS} />);

    const row1 = screen
      .getByText("Wetland Delineation")
      .closest("tr") as HTMLElement;
    const row2 = screen
      .getByText("Environmental Permitting")
      .closest("tr") as HTMLElement;

    expect(within(row1).getByText("Pricing note")).toBeInTheDocument();
    expect(within(row2).queryByText("Pricing note")).not.toBeInTheDocument();
    expect(within(row2).getByText("—")).toBeInTheDocument();
    // The note's body copy must never leak into the management list.
    expect(screen.queryByText(/quoted per project/i)).not.toBeInTheDocument();
  });

  it("normalizes blank pricing notes to NULL on save", async () => {
    const formData = new FormData();
    formData.set("title", "Optional Pricing Service");
    formData.set("slug", "optional-pricing-service");
    formData.set("short_description", "Short description.");
    formData.set("full_content", "Full content narrative.");
    formData.set("icon", "Leaf");
    formData.set("pricing_note", "   "); // whitespace-only → hidden

    const result = await upsertService(formData);

    expect(result.ok).toBe(true);
    expect(mockClient.writes).toHaveLength(1);
    expect(mockClient.writes[0]).toMatchObject({
      type: "insert",
      table: "services",
      payload: { pricing_note: null },
    });
    expect(revalidatePath).toHaveBeenCalledWith("/admin/services");
    expect(revalidatePath).toHaveBeenCalledWith("/services");
    expect(revalidatePath).toHaveBeenCalledWith("/admin/projects");
    expect(revalidatePath).toHaveBeenCalledWith("/");
    expect(revalidatePath).toHaveBeenCalledTimes(4);
  });
});

describe("ServicesTable publication toggle", () => {
  it("flips optimistically, writes through the Server Action, and revalidates", async () => {
    const user = userEvent.setup();
    render(<ServicesTable services={SERVICE_ROWS} />);

    const row = screen
      .getByText("Wetland Delineation")
      .closest("tr") as HTMLElement;
    expect(within(row).getByText("Published")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Unpublish Wetland Delineation" }),
    );

    // Optimistic: the pill flips before the server round-trip settles.
    expect(within(row).getByText("Draft")).toBeInTheDocument();

    await waitFor(() => {
      expect(mockClient.writes).toEqual([
        {
          type: "update",
          table: "services",
          payload: { is_published: false },
          filters: { id: "svc-1" },
        },
      ]);
    });
    expect(vi.mocked(assertAdmin)).toHaveBeenCalledTimes(1);
    expect(revalidatePath).toHaveBeenCalledTimes(4);
    expect(revalidatePath).toHaveBeenCalledWith("/admin/services");
    expect(revalidatePath).toHaveBeenCalledWith("/");
    expect(
      screen.getByRole("button", { name: "Publish Wetland Delineation" }),
    ).toBeInTheDocument();
  });
});

describe("ServiceEditorDrawer", () => {
  it("edits an existing service through the update path", async () => {
    const user = userEvent.setup({ delay: null });
    render(<ServicesTable services={SERVICE_ROWS} />);

    await user.click(
      screen.getByRole("button", { name: "Edit Environmental Permitting" }),
    );

    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByLabelText("Title")).toHaveValue(
      "Environmental Permitting",
    );
    expect(within(dialog).getByLabelText("Slug")).toHaveValue(
      "environmental-permitting",
    );
    expect(
      within(dialog).getByLabelText("Pricing note (optional)"),
    ).toHaveValue(""); // null renders as an empty, optional field

    await user.clear(within(dialog).getByLabelText("Title"));
    await user.type(
      within(dialog).getByLabelText("Title"),
      "Permitting & Compliance",
    );
    await user.click(
      within(dialog).getByRole("button", { name: "Save service" }),
    );

    await waitFor(() => {
      expect(mockClient.writes).toHaveLength(1);
    });
    expect(mockClient.writes[0]).toMatchObject({
      type: "update",
      table: "services",
      payload: { title: "Permitting & Compliance" },
      filters: { id: "svc-2" },
    });
    expect(revalidatePath).toHaveBeenCalledWith("/admin/services");
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("creates a service through the insert path with validated values", async () => {
    const user = userEvent.setup({ delay: null });
    render(<ServicesTable services={[]} />);

    expect(screen.getByText(/no services yet/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "New service" }));

    const dialog = screen.getByRole("dialog");
    await user.type(
      within(dialog).getByLabelText("Title"),
      "Habitat Assessment",
    );
    await user.type(
      within(dialog).getByLabelText("Slug"),
      "habitat-assessment",
    );
    await user.type(
      within(dialog).getByLabelText("Short description"),
      "Constraints mapping and avoidance strategy.",
    );
    await user.type(
      within(dialog).getByLabelText("Full content"),
      "Full ecological planning narrative.",
    );
    await user.type(
      within(dialog).getByLabelText("Deliverables (one per line)"),
      "Constraint map{Enter}Alternatives analysis",
    );
    await user.click(
      within(dialog).getByRole("button", { name: "Save service" }),
    );

    await waitFor(() => {
      expect(mockClient.writes).toHaveLength(1);
    });
    expect(mockClient.writes[0]).toMatchObject({
      type: "insert",
      table: "services",
      payload: {
        title: "Habitat Assessment",
        slug: "habitat-assessment",
        icon: "Trees", // default selection
        pricing_note: null, // untouched optional field
        is_published: true, // default toggle state
        display_order: 0,
        deliverables: ["Constraint map", "Alternatives analysis"],
        regulatory_frameworks: [],
      },
    });
    expect(revalidatePath).toHaveBeenCalledWith("/");
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("surfaces validation errors on required fields without touching the database", async () => {
    const user = userEvent.setup({ delay: null });
    render(<ServicesTable services={SERVICE_ROWS} />);

    await user.click(screen.getByRole("button", { name: "New service" }));
    await user.click(screen.getByRole("button", { name: "Save service" }));

    expect(await screen.findByText("Title is required.")).toBeInTheDocument();
    expect(screen.getByText("Slug is required.")).toBeInTheDocument();
    expect(
      screen.getByText("Short description is required."),
    ).toBeInTheDocument();
    expect(screen.getByText("Full content is required.")).toBeInTheDocument();

    expect(vi.mocked(assertAdmin)).toHaveBeenCalledTimes(1);
    expect(vi.mocked(createClient)).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
