import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/config/site";
import { usePathname } from "next/navigation";

/**
 * Header & footer navigation tests.
 *
 * `next/link` is stubbed as a plain anchor and `usePathname` is mocked so
 * the client components render deterministically under jsdom while still
 * verifying real hrefs, ARIA state, and focus behavior.
 */
vi.mock("next/link", () => ({
  default: ({
    children,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement> & { children?: ReactNode }) => (
    <a {...props}>{children}</a>
  ),
}));

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/"),
}));

beforeEach(() => {
  vi.mocked(usePathname).mockReturnValue("/");
});

describe("Header", () => {
  it("renders the brand mark linking back to the homepage", () => {
    render(<Header />);

    const brand = screen.getByRole("link", {
      name: `${siteConfig.name} — home`,
    });
    expect(brand).toHaveAttribute("href", "/");
  });

  it("renders the public navigation links from site config", () => {
    render(<Header />);

    for (const item of siteConfig.navigation.public) {
      const link = screen.getByRole("link", { name: item.label });
      expect(link).toHaveAttribute("href", item.href);
    }
  });

  it("renders a prominent Request a Consultation CTA linking to /contact", () => {
    render(<Header />);

    const cta = screen.getByRole("link", {
      name: "Request a Consultation",
    });
    expect(cta).toHaveAttribute("href", "/contact");
    expect(cta.className).toContain("bg-primary");
  });

  it("marks the active page link with aria-current", () => {
    vi.mocked(usePathname).mockReturnValue("/services");

    render(<Header />);

    expect(screen.getByRole("link", { name: "Services" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("exposes the mobile toggle only below the desktop breakpoint", () => {
    render(<Header />);

    const toggle = screen.getByRole("button", { name: "Open menu" });
    expect(toggle.className).toContain("lg:hidden");
  });
});

describe("Mobile navigation", () => {
  it("opens the drawer via the toggle and closes it with Escape", async () => {
    const user = userEvent.setup();
    render(<Header />);

    const toggle = screen.getByRole("button", { name: "Open menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(toggle).toHaveAccessibleName("Close navigation");

    const dialog = screen.getByRole("dialog", { name: "Site menu" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(
      within(dialog).getByRole("link", { name: "Services" }),
    ).toHaveAttribute("href", "/services");
    expect(
      within(dialog).getByRole("link", { name: "Request a Consultation" }),
    ).toHaveAttribute("href", "/contact");

    await user.keyboard("{Escape}");
    // The drawer plays a short exit animation before unmounting.
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("moves focus into the drawer on open and back to the toggle on close", async () => {
    const user = userEvent.setup();
    render(<Header />);

    const toggle = screen.getByRole("button", { name: "Open menu" });
    await user.click(toggle);

    const dialog = screen.getByRole("dialog", { name: "Site menu" });
    const closeButton = within(dialog).getByRole("button", {
      name: "Close menu",
    });
    expect(closeButton).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(toggle).toHaveFocus();
  });

  it("traps Tab focus inside the drawer while it is open", async () => {
    const user = userEvent.setup();
    render(<Header />);

    const toggle = screen.getByRole("button", { name: "Open menu" });
    await user.click(toggle);

    const dialog = screen.getByRole("dialog", { name: "Site menu" });
    const closeButton = within(dialog).getByRole("button", {
      name: "Close menu",
    });
    const cta = within(dialog).getByRole("link", {
      name: "Request a Consultation",
    });

    // Focus order: close button -> nav links -> CTA -> wraps to close.
    for (let i = 0; i < 5; i += 1) {
      await user.tab();
    }
    expect(cta).toHaveFocus();
    await user.tab();
    expect(closeButton).toHaveFocus();

    // Shift+Tab wraps backward from the first item to the last.
    await user.tab({ shift: true });
    expect(cta).toHaveFocus();
  });

  it("closes when the blurred backdrop is clicked", async () => {
    const user = userEvent.setup();
    render(<Header />);

    const toggle = screen.getByRole("button", { name: "Open menu" });
    await user.click(toggle);
    expect(
      screen.getByRole("dialog", { name: "Site menu" }),
    ).toBeInTheDocument();

    const backdrop = document.querySelector(".backdrop-blur-sm");
    expect(backdrop).not.toBeNull();
    await user.click(backdrop as Element);

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });
});

describe("Footer", () => {
  it("shows the mandatory illustrative-content disclaimer", () => {
    render(<Footer />);

    expect(
      screen.getByText(
        "All illustrative statistics, certifications, and case studies shown are demonstrations.",
      ),
    ).toBeInTheDocument();
  });

  it("lists environmental credentials and the office address", () => {
    render(<Footer />);

    expect(
      screen.getByText(/Professional Wetland Scientist/),
    ).toBeInTheDocument();
    expect(
      screen.getByText("14 Marshview Lane, Suite 300"),
    ).toBeInTheDocument();
    expect(screen.getByText("Portland, Maine 04101")).toBeInTheDocument();
  });

  it("shows the copyright line and footer legal links", () => {
    render(<Footer />);

    expect(screen.getByRole("contentinfo")).toHaveTextContent(
      `© ${new Date().getFullYear()} ${siteConfig.name}. All rights reserved.`,
    );

    for (const item of siteConfig.navigation.footerLegal) {
      const links = screen.getAllByRole("link", { name: item.label });
      expect(links[0]).toHaveAttribute("href", item.href);
    }
  });
});
