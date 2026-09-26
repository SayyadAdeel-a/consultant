import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";

/**
 * Verifies the shadcn/ui component pipeline (registry output + aliases +
 * Tailwind classes) compiles and renders correctly in the test environment.
 */
describe("Button (shadcn/ui)", () => {
  it("renders with default variant classes", () => {
    render(<Button>Request a consultation</Button>);
    const button = screen.getByRole("button", {
      name: "Request a consultation",
    });
    expect(button).toBeInTheDocument();
    expect(button.className).toContain("inline-flex");
  });

  it("supports the outline variant", () => {
    render(<Button variant="outline">Explore services</Button>);
    const button = screen.getByRole("button", { name: "Explore services" });
    expect(button).toBeInTheDocument();
    expect(button.className).toContain("border");
  });
});
