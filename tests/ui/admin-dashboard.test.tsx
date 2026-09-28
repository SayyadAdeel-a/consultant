import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import AdminDashboardPage from "@/app/admin/page";
import { AdminNav } from "@/components/admin";
import { requireAdmin } from "@/lib/auth/admin";
import { SupabaseNotConfiguredError } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { usePathname } from "next/navigation";

// The auth gate and Supabase client are mocked so the real page logic runs
// against scripted query results; `requireAdmin` can be forced to fail per
// test to prove the gate propagates redirects.
vi.mock("@/lib/auth/admin", () => ({
  requireAdmin: vi.fn(),
  getAdminUser: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    const error = new Error(`NEXT_REDIRECT:${url}`);
    error.name = "RedirectError";
    throw error;
  }),
  usePathname: vi.fn(() => "/admin"),
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement> & { children?: ReactNode }) => (
    <a {...props}>{children}</a>
  ),
}));

type RecentRow = {
  id: string;
  name: string;
  company: string | null;
  inquiry_type: string;
  status: string;
  created_at: string;
};

type DashboardPlan = {
  counts?: {
    inquiries?: { total: number; new: number };
    services?: { total: number; published: number };
    projects?: { published: number };
    mediaAssets?: number;
  };
  recentInquiries?: RecentRow[];
  failCounts?: boolean;
};

const DEFAULT_RECENT: RecentRow[] = [
  {
    id: "i1",
    name: "Jordan Vance",
    company: "Bayline Development",
    inquiry_type: "permitting",
    status: "new",
    created_at: "2026-09-25T14:05:00.000Z",
  },
  {
    id: "i2",
    name: "Priya Raman",
    company: "Town of Scarborough",
    inquiry_type: "wetland-delineation",
    status: "reviewing",
    created_at: "2026-09-24T09:30:00.000Z",
  },
  {
    id: "i3",
    name: "Marcus Hale",
    company: null,
    inquiry_type: "general",
    status: "contacted",
    created_at: "2026-09-22T17:45:00.000Z",
  },
];

/**
 * Chainable fake mirroring the query shapes the dashboard uses:
 * - count reads: `from().select(cols, { head: true })` [+ `.eq()`]
 * - list reads:  `from().select(cols).order().limit()`
 * Both resolve to `{ count | data, error }` when awaited.
 */
function createSupabaseMock(plan: DashboardPlan = {}) {
  const counts = {
    inquiries: { total: 12, new: 3, ...plan.counts?.inquiries },
    services: { total: 9, published: 6, ...plan.counts?.services },
    projects: { published: 5, ...plan.counts?.projects },
    mediaAssets: plan.counts?.mediaAssets ?? 24,
  };
  const recent = plan.recentInquiries ?? DEFAULT_RECENT;

  const from = vi.fn((table: string) => ({
    select: vi.fn((_columns: string, options?: { head?: boolean }) => {
      const filters: Record<string, unknown> = {};

      function resolve() {
        if (options?.head) {
          if (plan.failCounts) {
            return {
              count: null,
              data: null,
              error: { message: "relation does not exist" },
            };
          }
          if (table === "inquiries") {
            return {
              count:
                filters.status === "new"
                  ? counts.inquiries.new
                  : counts.inquiries.total,
              data: null,
              error: null,
            };
          }
          if (table === "services") {
            return {
              count:
                filters.is_published === true
                  ? counts.services.published
                  : counts.services.total,
              data: null,
              error: null,
            };
          }
          if (table === "projects") {
            return {
              count: counts.projects.published,
              data: null,
              error: null,
            };
          }
          if (table === "media_assets") {
            return { count: counts.mediaAssets, data: null, error: null };
          }
          return { count: 0, data: null, error: null };
        }
        return {
          count: null,
          data: table === "inquiries" ? recent : [],
          error: null,
        };
      }

      const builder = {
        eq: vi.fn((column: string, value: unknown) => {
          filters[column] = value;
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
    }),
  }));

  return { from };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(usePathname).mockReturnValue("/admin");
  vi.mocked(requireAdmin).mockResolvedValue({
    id: "admin-1",
    email: "admin@example.com",
  });
  vi.mocked(createClient).mockResolvedValue(createSupabaseMock() as never);
});

describe("admin dashboard page", () => {
  it("gates access and renders live metric counts, quick links, and recent inquiries", async () => {
    render(await AdminDashboardPage());

    expect(vi.mocked(requireAdmin)).toHaveBeenCalledTimes(1);
    expect(
      screen.getByRole("heading", { level: 1, name: "Dashboard" }),
    ).toBeInTheDocument();

    // Metric cards (mocked counts)
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("3 new awaiting review")).toBeInTheDocument();
    expect(screen.getByText("6 / 9")).toBeInTheDocument();
    expect(screen.getByText("3 drafts · 6 published")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("24")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /manage/i })).toHaveLength(4);

    // Recent inquiries preview
    expect(screen.getByText("Jordan Vance")).toBeInTheDocument();
    expect(screen.getByText(/Bayline Development/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /view all/i })).toHaveAttribute(
      "href",
      "/admin/inquiries",
    );

    // Quick actions
    expect(screen.getByRole("link", { name: "Add Service" })).toHaveAttribute(
      "href",
      "/admin/services",
    );
    expect(
      screen.getByRole("link", { name: "Review Inquiries" }),
    ).toHaveAttribute("href", "/admin/inquiries");
    expect(screen.getByRole("link", { name: "Edit Settings" })).toHaveAttribute(
      "href",
      "/admin/settings",
    );
  });

  it("shows an empty state when there are no inquiries", async () => {
    vi.mocked(createClient).mockResolvedValue(
      createSupabaseMock({ recentInquiries: [] }) as never,
    );

    render(await AdminDashboardPage());

    expect(screen.getByText(/no inquiries yet/i)).toBeInTheDocument();
  });

  it("degrades to placeholder values when metric queries fail", async () => {
    vi.mocked(createClient).mockResolvedValue(
      createSupabaseMock({ failCounts: true }) as never,
    );

    render(await AdminDashboardPage());

    expect(screen.getAllByText("—")).toHaveLength(4);
    expect(screen.getAllByText(/temporarily unavailable/i)).toHaveLength(4);
    // The page never crashes — recent inquiries still render.
    expect(screen.getByText("Jordan Vance")).toBeInTheDocument();
  });

  it("propagates the redirect when requireAdmin() fails", async () => {
    vi.mocked(requireAdmin).mockRejectedValue(
      Object.assign(new Error("NEXT_REDIRECT:/admin/login"), {
        name: "RedirectError",
      }),
    );

    await expect(AdminDashboardPage()).rejects.toThrow(
      "NEXT_REDIRECT:/admin/login",
    );
    expect(vi.mocked(createClient)).not.toHaveBeenCalled();
  });

  it("renders setup guidance instead of crashing when Supabase is unconfigured", async () => {
    vi.mocked(requireAdmin).mockRejectedValue(
      new SupabaseNotConfiguredError("test"),
    );

    render(await AdminDashboardPage());

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

describe("AdminNav", () => {
  it("highlights the active route with aria-current and the sage pill", () => {
    vi.mocked(usePathname).mockReturnValue("/admin/inquiries");

    render(<AdminNav />);

    const active = screen.getByRole("link", { name: "Inquiries" });
    expect(active).toHaveAttribute("aria-current", "page");
    expect(active).toHaveClass("bg-brand-sage/40");
    expect(active).toHaveAttribute("href", "/admin/inquiries");

    // The dashboard root must NOT highlight for nested routes.
    expect(screen.getByRole("link", { name: "Dashboard" })).not.toHaveAttribute(
      "aria-current",
    );
    expect(screen.getByRole("link", { name: "Services" })).not.toHaveAttribute(
      "aria-current",
    );
    expect(screen.getAllByRole("link")).toHaveLength(20);
  });

  it("marks Dashboard active only on the exact /admin route", () => {
    vi.mocked(usePathname).mockReturnValue("/admin");

    render(<AdminNav />);

    const dashboard = screen.getByRole("link", { name: "Dashboard" });
    expect(dashboard).toHaveAttribute("aria-current", "page");
    expect(dashboard).toHaveClass("bg-brand-sage/40");
    expect(screen.getByRole("link", { name: "Settings" })).not.toHaveAttribute(
      "aria-current",
    );
  });
});
