import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import AdminProjectsPage from "@/app/admin/projects/page";
import { ProjectsTable } from "@/components/admin";
import { assertAdmin, requireAdmin } from "@/lib/auth/admin";
import { SupabaseNotConfiguredError } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { ProjectRecord, ServiceOption } from "@/types/cms";

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

const PROJECT_ROWS: ProjectRecord[] = [
  {
    id: "prj-1",
    slug: "casco-bay-marina",
    title: "Casco Bay Marina Expansion",
    client_type: "Private marina operator",
    location: "Portland, Maine",
    summary: "Habitat assessment and permitting for dock expansion.",
    challenge: "Jurisdictional waters crossed the planned pier footprint.",
    solution: "Redesigned layout with targeted avoidance and a joint permit.",
    results: "Permit issued in 9 months with no mitigation required.",
    featured_image_url: "https://images.example.com/casco.jpg",
    service_id: "svc-1",
    completed_year: 2025,
    is_featured: true,
    is_published: true,
    display_order: 1,
  },
  {
    id: "prj-2",
    slug: "scarborough-wetland-bank",
    title: "Scarborough Wetland Mitigation Bank",
    client_type: "Municipal",
    location: "Scarborough, Maine",
    summary: "Mitigation banking feasibility and establishment plan.",
    challenge: "Establishing credit viability across fragmented parcels.",
    solution: "Phased parcel assembly with hydrology restoration design.",
    results: "Bank approved with 12 acres of restored wetland credits.",
    featured_image_url: null,
    service_id: null,
    completed_year: 2024,
    is_featured: false,
    is_published: false,
    display_order: 2,
  },
];

const SERVICE_OPTIONS: ServiceOption[] = [
  { id: "svc-1", title: "Wetland Delineation", is_published: true },
  { id: "svc-2", title: "Environmental Permitting", is_published: false },
];

type WriteOp = {
  type: "update" | "insert";
  table: string;
  payload: Record<string, unknown>;
  filters: Record<string, unknown>;
};

/**
 * Chainable fake: reads resolve `{ data: rows }` per table, writes
 * (`update().eq()` / `insert()`) are recorded and resolve `{ error: null }`.
 */
function createSupabaseMock(
  data: Record<string, unknown[]> = {
    projects: PROJECT_ROWS,
    services: SERVICE_OPTIONS,
  },
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

describe("admin projects page", () => {
  it("gates access and renders case studies from mocked rows", async () => {
    render(await AdminProjectsPage());

    expect(vi.mocked(requireAdmin)).toHaveBeenCalledTimes(1);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Projects & case studies",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/2 case studies/)).toBeInTheDocument();

    const row1 = screen
      .getByText("Casco Bay Marina Expansion")
      .closest("tr") as HTMLElement;
    expect(
      within(row1).getByText("Private marina operator"),
    ).toBeInTheDocument();
    expect(within(row1).getByText("Portland, Maine")).toBeInTheDocument();
    expect(within(row1).getByText("2025")).toBeInTheDocument();
    expect(within(row1).getByText("Wetland Delineation")).toBeInTheDocument(); // associated service
    expect(within(row1).getByText("Featured")).toBeInTheDocument();
    expect(within(row1).getByText("Published")).toBeInTheDocument();

    const row2 = screen
      .getByText("Scarborough Wetland Mitigation Bank")
      .closest("tr") as HTMLElement;
    expect(within(row2).getByText("Municipal")).toBeInTheDocument();
    expect(within(row2).getByText("2024")).toBeInTheDocument();
    const row2Cells = within(row2).getAllByRole("cell");
    expect(row2Cells[4]).toHaveTextContent("—"); // no associated service
    expect(row2Cells[5]).toHaveTextContent("—"); // not featured
    expect(within(row2).queryByText("Featured")).not.toBeInTheDocument();
    expect(within(row2).getByText("Draft")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "New case study" }),
    ).toBeInTheDocument();
  });

  it("renders an explicit load-error notice when the projects query fails", async () => {
    vi.mocked(createClient).mockResolvedValue(
      createSupabaseMock({}, { failRead: true }) as never,
    );

    render(await AdminProjectsPage());

    expect(screen.getByRole("alert")).toHaveTextContent(
      /could not load case studies/i,
    );
  });

  it("propagates the redirect when requireAdmin() fails", async () => {
    vi.mocked(requireAdmin).mockRejectedValue(
      Object.assign(new Error("NEXT_REDIRECT:/admin/login"), {
        name: "RedirectError",
      }),
    );

    await expect(AdminProjectsPage()).rejects.toThrow(
      "NEXT_REDIRECT:/admin/login",
    );
    expect(vi.mocked(createClient)).not.toHaveBeenCalled();
  });

  it("renders setup guidance instead of crashing when Supabase is unconfigured", async () => {
    vi.mocked(requireAdmin).mockRejectedValue(
      new SupabaseNotConfiguredError("test"),
    );

    render(await AdminProjectsPage());

    expect(
      screen.getByRole("heading", { level: 1, name: "Case studies" }),
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

describe("ProjectsTable toggles", () => {
  it("flips publication optimistically, writes, and revalidates", async () => {
    const user = userEvent.setup();
    render(
      <ProjectsTable
        projects={PROJECT_ROWS}
        serviceOptions={SERVICE_OPTIONS}
      />,
    );

    const row = screen
      .getByText("Casco Bay Marina Expansion")
      .closest("tr") as HTMLElement;
    expect(within(row).getByText("Published")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: "Unpublish Casco Bay Marina Expansion",
      }),
    );

    // Optimistic: the pill flips before the server round-trip settles.
    expect(within(row).getByText("Draft")).toBeInTheDocument();

    await waitFor(() => {
      expect(mockClient.writes).toEqual([
        {
          type: "update",
          table: "projects",
          payload: { is_published: false },
          filters: { id: "prj-1" },
        },
      ]);
    });
    expect(vi.mocked(assertAdmin)).toHaveBeenCalledTimes(1);
    expect(revalidatePath).toHaveBeenCalledTimes(4);
    expect(revalidatePath).toHaveBeenCalledWith("/admin/projects");
    expect(revalidatePath).toHaveBeenCalledWith("/");
  });

  it("flips featured optimistically, writes, and revalidates", async () => {
    const user = userEvent.setup();
    render(
      <ProjectsTable
        projects={PROJECT_ROWS}
        serviceOptions={SERVICE_OPTIONS}
      />,
    );

    const row = screen
      .getByText("Scarborough Wetland Mitigation Bank")
      .closest("tr") as HTMLElement;
    expect(within(row).queryByText("Featured")).not.toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: "Feature Scarborough Wetland Mitigation Bank",
      }),
    );

    // Optimistic: the badge appears and the control relabels immediately.
    expect(within(row).getByText("Featured")).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "Unfeature Scarborough Wetland Mitigation Bank",
      }),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(mockClient.writes).toEqual([
        {
          type: "update",
          table: "projects",
          payload: { is_featured: true },
          filters: { id: "prj-2" },
        },
      ]);
    });
    expect(revalidatePath).toHaveBeenCalledTimes(4);
    expect(revalidatePath).toHaveBeenCalledWith("/admin/projects");
    expect(revalidatePath).toHaveBeenCalledWith("/services");
  });
});

describe("ProjectEditorDrawer", () => {
  it("creates a case study through the insert path with validated values", async () => {
    const user = userEvent.setup({ delay: null });
    render(<ProjectsTable projects={[]} serviceOptions={SERVICE_OPTIONS} />);

    expect(screen.getByText(/no case studies yet/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "New case study" }));

    const dialog = screen.getByRole("dialog");
    await user.type(
      within(dialog).getByLabelText("Title"),
      "Marsh Creek Bridge",
    );
    await user.type(
      within(dialog).getByLabelText("Slug"),
      "marsh-creek-bridge",
    );
    await user.type(
      within(dialog).getByLabelText("Client type"),
      "County public works",
    );
    await user.type(
      within(dialog).getByLabelText("Location"),
      "Kennebunk, Maine",
    );
    await user.type(within(dialog).getByLabelText("Completed year"), "2026");
    await user.type(
      within(dialog).getByLabelText("Summary"),
      "Stream crossing replacement with wetland impacts.",
    );
    await user.type(
      within(dialog).getByLabelText("Challenge"),
      "Limited culvert clearance during high flows.",
    );
    await user.type(
      within(dialog).getByLabelText("Solution"),
      "Bottomless arch span with restored stream continuity.",
    );
    await user.type(
      within(dialog).getByLabelText("Results"),
      "Permit approved in one review cycle.",
    );
    await user.selectOptions(
      within(dialog).getByLabelText("Associated service"),
      "svc-1",
    );
    await user.click(within(dialog).getByLabelText("Featured"));
    await user.click(
      within(dialog).getByRole("button", { name: "Save case study" }),
    );

    await waitFor(() => {
      expect(mockClient.writes).toHaveLength(1);
    });
    expect(mockClient.writes[0]).toMatchObject({
      type: "insert",
      table: "projects",
      payload: {
        title: "Marsh Creek Bridge",
        slug: "marsh-creek-bridge",
        client_type: "County public works",
        location: "Kennebunk, Maine",
        completed_year: 2026,
        service_id: "svc-1",
        featured_image_url: null, // empty optional field → NULL
        is_featured: true,
        is_published: true,
        display_order: 0,
      },
    });
    expect(revalidatePath).toHaveBeenCalledWith("/admin/projects");
    expect(revalidatePath).toHaveBeenCalledWith("/");
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("surfaces validation errors on required fields without touching the database", async () => {
    const user = userEvent.setup({ delay: null });
    render(
      <ProjectsTable
        projects={PROJECT_ROWS}
        serviceOptions={SERVICE_OPTIONS}
      />,
    );

    await user.click(screen.getByRole("button", { name: "New case study" }));
    await user.click(screen.getByRole("button", { name: "Save case study" }));

    expect(await screen.findByText("Title is required.")).toBeInTheDocument();
    expect(screen.getByText("Slug is required.")).toBeInTheDocument();
    expect(screen.getByText("Client type is required.")).toBeInTheDocument();
    expect(screen.getByText("Location is required.")).toBeInTheDocument();
    expect(screen.getByText("Summary is required.")).toBeInTheDocument();

    expect(vi.mocked(assertAdmin)).toHaveBeenCalledTimes(1);
    expect(vi.mocked(createClient)).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
