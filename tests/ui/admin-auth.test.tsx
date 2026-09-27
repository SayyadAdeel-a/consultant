import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AdminLayout from "@/app/admin/layout";
import AdminLoginPage from "@/app/admin/login/page";
import {
  loginAdmin,
  logoutAdmin,
  type AdminLoginState,
} from "@/app/actions/auth";
import { AdminLoginForm } from "@/components/forms/AdminLoginForm";
import { getAdminUser } from "@/lib/auth/admin";
import { SupabaseNotConfiguredError } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

// `redirect()` throws a control-flow error in Next — the mock mirrors that
// so success paths assert as rejections. `useSearchParams` is needed
// because the forms barrel pulls in ContactForm.
vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    const error = new Error(`NEXT_REDIRECT:${url}`);
    error.name = "RedirectError";
    throw error;
  }),
  useSearchParams: vi.fn(() => new URLSearchParams()),
}));

// The module carries `import "server-only"` — mock it so the graph stays
// loadable in jsdom (tests only need `getAdminUser`).
vi.mock("@/lib/auth/admin", () => ({
  getAdminUser: vi.fn(),
}));

type SupabaseMock = ReturnType<typeof createSupabaseMock>;

function createSupabaseMock() {
  const profileQuery = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi
      .fn()
      .mockResolvedValue({ data: { user_id: "admin-1" }, error: null }),
  };

  return {
    auth: {
      signInWithPassword: vi.fn().mockResolvedValue({
        data: { user: { id: "admin-1", email: "admin@example.com" } },
        error: null,
      }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
    },
    from: vi.fn(() => profileQuery),
    profileQuery,
  };
}

function useSupabaseMock(supabase: SupabaseMock) {
  vi.mocked(createClient).mockResolvedValue(supabase as never);
}

function loginFormData(overrides?: { email?: string; password?: string }) {
  const formData = new FormData();
  formData.set("email", overrides?.email ?? "admin@example.com");
  formData.set("password", overrides?.password ?? "correct-horse-battery");
  return formData;
}

const IDLE: AdminLoginState = {
  status: "idle",
  message: null,
  fieldErrors: null,
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getAdminUser).mockResolvedValue(null);
  useSupabaseMock(createSupabaseMock());
});

describe("AdminLoginForm", () => {
  it("renders email/password fields and the sign-in button", () => {
    render(<AdminLoginForm />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Administrator sign-in" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Email address")).toHaveAttribute(
      "type",
      "email",
    );
    expect(screen.getByLabelText("Password")).toHaveAttribute(
      "type",
      "password",
    );
    expect(screen.getByRole("button", { name: /sign in/i })).toBeEnabled();
  });

  it("blocks invalid submissions with inline client errors before the action runs", async () => {
    const user = userEvent.setup();
    render(<AdminLoginForm />);

    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(
      screen.getByText("Please enter a valid email address."),
    ).toBeInTheDocument();
    expect(screen.getByText("Please enter your password.")).toBeInTheDocument();
    expect(screen.getByLabelText("Email address")).toHaveFocus();
    // The client gate prevented dispatch — no server round-trip happened.
    expect(vi.mocked(createClient)).not.toHaveBeenCalled();
  });

  it("surfaces server-side invalid-credentials feedback", async () => {
    const supabase = createSupabaseMock();
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: null },
      error: { message: "Invalid login credentials" },
    });
    useSupabaseMock(supabase);

    const user = userEvent.setup();
    render(<AdminLoginForm />);

    await user.type(
      screen.getByLabelText("Email address"),
      "admin@example.com",
    );
    await user.type(screen.getByLabelText("Password"), "wrong-password");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Invalid email or password.",
    );
    // Sign-in failed before the fail-secure profile lookup.
    expect(supabase.from).not.toHaveBeenCalled();
  });

  it("disables the button with a pending indicator while the action runs", async () => {
    let resolveSignIn!: (value: unknown) => void;
    const deferred = new Promise((resolve) => {
      resolveSignIn = resolve;
    });
    const supabase = createSupabaseMock();
    supabase.auth.signInWithPassword.mockReturnValue(deferred);
    useSupabaseMock(supabase);

    const user = userEvent.setup();
    render(<AdminLoginForm />);

    await user.type(
      screen.getByLabelText("Email address"),
      "admin@example.com",
    );
    await user.type(screen.getByLabelText("Password"), "correct-horse-battery");
    await user.click(screen.getByRole("button", { name: /^sign in$/i }));

    const pendingButton = screen.getByRole("button", { name: /signing in/i });
    expect(pendingButton).toBeDisabled();
    expect(pendingButton).toHaveAttribute("aria-busy", "true");

    resolveSignIn({
      data: { user: null },
      error: { message: "Invalid login credentials" },
    });

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Invalid email or password.",
    );
    expect(screen.getByRole("button", { name: /^sign in$/i })).toBeEnabled();
  });
});

describe("loginAdmin server action", () => {
  it("signs in and redirects to /admin for a verified admin", async () => {
    const supabase = createSupabaseMock();
    useSupabaseMock(supabase);

    await expect(loginAdmin(IDLE, loginFormData())).rejects.toThrow(
      "NEXT_REDIRECT:/admin",
    );

    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: "admin@example.com",
      password: "correct-horse-battery",
    });
    expect(redirect).toHaveBeenCalledWith("/admin");
  });

  it("fails secure: signs out and denies authenticated non-admins", async () => {
    const supabase = createSupabaseMock();
    supabase.profileQuery.maybeSingle.mockResolvedValue({
      data: null,
      error: null,
    });
    useSupabaseMock(supabase);

    const result = await loginAdmin(IDLE, loginFormData());

    expect(result.status).toBe("error");
    expect(result.message).toMatch(/not an administrator/i);
    expect(supabase.auth.signOut).toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("fails secure: an admin_profiles lookup error denies access", async () => {
    const supabase = createSupabaseMock();
    supabase.profileQuery.maybeSingle.mockResolvedValue({
      data: null,
      error: { message: "permission denied" },
    });
    useSupabaseMock(supabase);

    const result = await loginAdmin(IDLE, loginFormData());

    expect(result.status).toBe("error");
    expect(result.message).toMatch(/unable to verify administrator access/i);
    expect(supabase.auth.signOut).toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });
});

describe("logoutAdmin server action", () => {
  it("signs out and redirects to /admin/login", async () => {
    const supabase = createSupabaseMock();
    useSupabaseMock(supabase);

    await expect(logoutAdmin()).rejects.toThrow("NEXT_REDIRECT:/admin/login");

    expect(supabase.auth.signOut).toHaveBeenCalled();
    expect(redirect).toHaveBeenCalledWith("/admin/login");
  });
});

describe("admin login page", () => {
  it("redirects already-authenticated admins to /admin", async () => {
    vi.mocked(getAdminUser).mockResolvedValue({
      id: "admin-1",
      email: "admin@example.com",
    });

    await expect(AdminLoginPage()).rejects.toThrow("NEXT_REDIRECT:/admin");
    expect(redirect).toHaveBeenCalledWith("/admin");
  });

  it("renders the login form for signed-out visitors", async () => {
    render(await AdminLoginPage());

    expect(screen.getByLabelText("Email address")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });
});

describe("admin layout", () => {
  it("displays the admin email and a sign-out control", async () => {
    vi.mocked(getAdminUser).mockResolvedValue({
      id: "admin-1",
      email: "ops@integravity.example",
    });

    render(await AdminLayout({ children: <p>Dashboard panel</p> }));

    expect(screen.getByText("ops@integravity.example")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign out/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Dashboard panel")).toBeInTheDocument();
  });

  it("hides session controls for signed-out visitors", async () => {
    render(await AdminLayout({ children: <p>Dashboard panel</p> }));

    expect(
      screen.queryByRole("button", { name: /sign out/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Dashboard panel")).toBeInTheDocument();
  });

  it("still renders the shell when Supabase is unconfigured (fail-secure)", async () => {
    vi.mocked(getAdminUser).mockRejectedValue(
      new SupabaseNotConfiguredError("test"),
    );

    render(await AdminLayout({ children: <p>Dashboard panel</p> }));

    expect(screen.getByText("Dashboard panel")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /sign out/i }),
    ).not.toBeInTheDocument();
  });
});
