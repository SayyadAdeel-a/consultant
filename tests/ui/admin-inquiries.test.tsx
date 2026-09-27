import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import {
  updateInquiryNotes,
  updateInquiryStatus,
} from "@/app/actions/inquiries";
import AdminInquiriesPage from "@/app/admin/inquiries/page";
import { InquiriesTable } from "@/components/admin";
import { assertAdmin, requireAdmin } from "@/lib/auth/admin";
import { SupabaseNotConfiguredError } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { InquiryRecord } from "@/types/cms";

// The auth gate and Supabase client are mocked so the real page, table,
// drawer, and Server Actions run against scripted results. `assertAdmin`
// (used by the actions) is mocked because the real module imports
// `server-only`.
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
  usePathname: vi.fn(() => "/admin/inquiries"),
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement> & { children?: ReactNode }) => (
    <a {...props}>{children}</a>
  ),
}));

const ROWS: InquiryRecord[] = [
  {
    id: "inq-1",
    name: "Jordan Vance",
    email: "jordan@bayline.example",
    phone: "(207) 555-0101",
    company: "Bayline Development",
    inquiry_type: "permitting",
    message:
      "We need a Phase I ESA for a waterfront parcel.\nCan you share timing?",
    status: "new",
    admin_notes: null,
    created_at: "2026-09-25T14:05:00.000Z",
  },
  {
    id: "inq-2",
    name: "Priya Raman",
    email: "praman@scarborough.me.gov",
    phone: null,
    company: "Town of Scarborough",
    inquiry_type: "wetland-delineation",
    message: "Looking for wetland delineation support on a culvert project.",
    status: "reviewing",
    admin_notes: "Left a voicemail on 9/24.",
    created_at: "2026-09-24T09:30:00.000Z",
  },
  {
    id: "inq-3",
    name: "Marcus Hale",
    email: "marcus@halebuild.example",
    phone: "+1 207 555 0132",
    company: null,
    inquiry_type: "general",
    message: "Question about coastal permitting timelines.",
    status: "contacted",
    admin_notes: null,
    created_at: "2026-09-22T17:45:00.000Z",
  },
  {
    id: "inq-4",
    name: "Elena Soto",
    email: "elena@sotoecology.example",
    phone: null,
    company: "Soto Ecology",
    inquiry_type: "assessment",
    message: "Requesting a proposal for a habitat assessment.",
    status: "archived",
    admin_notes: null,
    created_at: "2026-09-18T11:20:00.000Z",
  },
];

type WriteOp = {
  table: string;
  payload: Record<string, unknown>;
  filters: Record<string, unknown>;
};

/**
 * Chainable fake covering both shapes this suite needs:
 * - list read:  `from().select(cols).order()` → `{ data: rows }`
 * - write:      `from().update(payload).eq(col, val)` → recorded op
 * Both resolve when awaited (thenable builder).
 */
function createSupabaseMock(
  rows: InquiryRecord[] = ROWS,
  options: { failRead?: boolean } = {},
) {
  const writes: WriteOp[] = [];

  const from = vi.fn((table: string) => {
    const state: {
      payload: Record<string, unknown> | null;
      filters: Record<string, unknown>;
    } = { payload: null, filters: {} };

    function resolve() {
      if (state.payload) {
        writes.push({
          table,
          payload: state.payload,
          filters: { ...state.filters },
        });
        return { count: null, data: null, error: null };
      }
      if (options.failRead) {
        return { count: null, data: null, error: { message: "boom" } };
      }
      return {
        count: null,
        data: table === "inquiries" ? rows : [],
        error: null,
      };
    }

    const builder = {
      select: vi.fn(() => builder),
      update: vi.fn((payload: Record<string, unknown>) => {
        state.payload = payload;
        return builder;
      }),
      eq: vi.fn((column: string, value: unknown) => {
        state.filters[column] = value;
        return builder;
      }),
      order: vi.fn(() => builder),
      limit: vi.fn(() => builder),
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

describe("admin inquiries page", () => {
  it("gates access and renders the inquiry list from mocked database rows", async () => {
    render(await AdminInquiriesPage());

    expect(vi.mocked(requireAdmin)).toHaveBeenCalledTimes(1);
    expect(
      screen.getByRole("heading", { level: 1, name: "Inquiries" }),
    ).toBeInTheDocument();

    // Table rows with submitter, organization, type, and status pills.
    expect(screen.getByText("Jordan Vance")).toBeInTheDocument();
    expect(screen.getByText("Priya Raman")).toBeInTheDocument();
    expect(screen.getByText("Marcus Hale")).toBeInTheDocument();
    expect(screen.getByText("Elena Soto")).toBeInTheDocument();
    expect(screen.getByText("Bayline Development")).toBeInTheDocument();
    expect(screen.getByText("Wetland Delineation")).toBeInTheDocument();
    expect(screen.getByText("—")).toBeInTheDocument(); // no organization

    // Status filter pills carry count badges.
    const group = screen.getByRole("group", {
      name: /filter inquiries by status/i,
    });
    expect(
      within(group).getByRole("button", { name: /all/i }),
    ).toHaveTextContent("4");
    expect(
      within(group).getByRole("button", { name: /^new/i }),
    ).toHaveTextContent("1");
    expect(
      within(group).getByRole("button", { name: /reviewing/i }),
    ).toHaveTextContent("1");
    expect(
      within(group).getByRole("button", { name: /contacted/i }),
    ).toHaveTextContent("1");
    expect(
      within(group).getByRole("button", { name: /archived/i }),
    ).toHaveTextContent("1");
  });

  it("renders an explicit load-error notice when the list query fails", async () => {
    vi.mocked(createClient).mockResolvedValue(
      createSupabaseMock([], { failRead: true }) as never,
    );

    render(await AdminInquiriesPage());

    expect(screen.getByRole("alert")).toHaveTextContent(
      /could not load inquiries/i,
    );
  });

  it("propagates the redirect when requireAdmin() fails", async () => {
    vi.mocked(requireAdmin).mockRejectedValue(
      Object.assign(new Error("NEXT_REDIRECT:/admin/login"), {
        name: "RedirectError",
      }),
    );

    await expect(AdminInquiriesPage()).rejects.toThrow(
      "NEXT_REDIRECT:/admin/login",
    );
    expect(vi.mocked(createClient)).not.toHaveBeenCalled();
  });

  it("renders setup guidance instead of crashing when Supabase is unconfigured", async () => {
    vi.mocked(requireAdmin).mockRejectedValue(
      new SupabaseNotConfiguredError("test"),
    );

    render(await AdminInquiriesPage());

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

describe("InquiriesTable filtering", () => {
  it("filters rows by status through the pill filters", async () => {
    const user = userEvent.setup();
    render(<InquiriesTable inquiries={ROWS} />);

    const group = screen.getByRole("group", {
      name: /filter inquiries by status/i,
    });
    await user.click(within(group).getByRole("button", { name: /^new/i }));

    expect(screen.getByText("Jordan Vance")).toBeInTheDocument();
    expect(screen.queryByText("Priya Raman")).not.toBeInTheDocument();
    expect(screen.queryByText("Marcus Hale")).not.toBeInTheDocument();
    expect(screen.queryByText("Elena Soto")).not.toBeInTheDocument();

    await user.click(within(group).getByRole("button", { name: /^all/i }));
    expect(screen.getByText("Priya Raman")).toBeInTheDocument();
    expect(screen.getByText("Elena Soto")).toBeInTheDocument();
  });

  it("filters rows by inquiry type through the dropdown", async () => {
    const user = userEvent.setup();
    render(<InquiriesTable inquiries={ROWS} />);

    await user.selectOptions(screen.getByLabelText("Type"), "assessment");

    expect(screen.getByText("Elena Soto")).toBeInTheDocument();
    expect(screen.queryByText("Jordan Vance")).not.toBeInTheDocument();
    expect(screen.queryByText("Marcus Hale")).not.toBeInTheDocument();
  });

  it("shows a clean empty state when no inquiries match the filters", async () => {
    const user = userEvent.setup();
    render(<InquiriesTable inquiries={ROWS} />);

    await user.selectOptions(screen.getByLabelText("Type"), "planning");

    expect(
      screen.getByText(/no inquiries match the selected filters/i),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /clear filters/i }));
    expect(screen.getByText("Jordan Vance")).toBeInTheDocument();
    expect(screen.queryByText(/no inquiries match/i)).not.toBeInTheDocument();
  });

  it("shows the first-use empty state when the list is empty", () => {
    render(<InquiriesTable inquiries={[]} />);

    expect(screen.getByText(/no inquiries yet/i)).toBeInTheDocument();
  });
});

describe("InquiryDetailDrawer", () => {
  it("opens with contact details, tel/mailto links, and the full message", async () => {
    const user = userEvent.setup();
    render(<InquiriesTable inquiries={ROWS} />);

    await user.click(
      screen.getByRole("button", { name: "View details for Jordan Vance" }),
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");

    expect(
      within(dialog).getByRole("link", { name: "jordan@bayline.example" }),
    ).toHaveAttribute("href", "mailto:jordan@bayline.example");
    expect(
      within(dialog).getByRole("link", { name: "(207) 555-0101" }),
    ).toHaveAttribute("href", "tel:(207) 555-0101");
    expect(within(dialog).getByText(/waterfront parcel/i)).toBeInTheDocument();
    expect(
      within(dialog).getByText(/can you share timing/i),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Status")).toHaveValue("new");

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("updates status through the Server Action with a validated write", async () => {
    const user = userEvent.setup();
    render(<InquiriesTable inquiries={ROWS} />);

    await user.click(
      screen.getByRole("button", { name: "View details for Jordan Vance" }),
    );
    await user.selectOptions(screen.getByLabelText("Status"), "contacted");

    await waitFor(() => {
      expect(vi.mocked(assertAdmin)).toHaveBeenCalledTimes(1);
      expect(revalidatePath).toHaveBeenCalledWith("/admin/inquiries");
      expect(revalidatePath).toHaveBeenCalledWith("/admin");
    });

    expect(mockClient.writes).toEqual([
      {
        table: "inquiries",
        payload: { status: "contacted" },
        filters: { id: "inq-1" },
      },
    ]);
    // The selector reflects the confirmed status.
    expect(screen.getByLabelText("Status")).toHaveValue("contacted");
  });

  it("saves internal notes through the Server Action", async () => {
    const user = userEvent.setup({ delay: null });
    render(<InquiriesTable inquiries={ROWS} />);

    await user.click(
      screen.getByRole("button", { name: "View details for Jordan Vance" }),
    );

    const notes = screen.getByLabelText(/internal notes/i);
    await user.clear(notes);
    await user.type(notes, "Proposal sent - follow up Monday.");
    await user.click(screen.getByRole("button", { name: /save notes/i }));

    await waitFor(() => {
      expect(screen.getByText(/notes saved/i)).toBeInTheDocument();
    });
    expect(mockClient.writes).toEqual([
      {
        table: "inquiries",
        payload: { admin_notes: "Proposal sent - follow up Monday." },
        filters: { id: "inq-1" },
      },
    ]);
    expect(revalidatePath).toHaveBeenCalledWith("/admin/inquiries");
    expect(revalidatePath).toHaveBeenCalledWith("/admin");
  });
});

describe("inquiry Server Actions", () => {
  it("rejects unknown statuses without touching the database", async () => {
    const result = await updateInquiryStatus(
      "inq-1",
      "published" as (typeof ROWS)[number]["status"],
    );

    expect(result).toEqual({
      ok: false,
      message: "Invalid status value.",
    });
    expect(vi.mocked(createClient)).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("propagates authorization failures from assertAdmin()", async () => {
    vi.mocked(assertAdmin).mockRejectedValue(
      new Error("Unauthorized: administrator privileges required."),
    );

    await expect(updateInquiryStatus("inq-1", "archived")).rejects.toThrow(
      /unauthorized/i,
    );
    expect(vi.mocked(createClient)).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("rejects oversized notes without touching the database", async () => {
    const result = await updateInquiryNotes("inq-1", "x".repeat(5001));

    expect(result.ok).toBe(false);
    expect(vi.mocked(createClient)).not.toHaveBeenCalled();
  });
});
