import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { ContactForm } from "@/components/forms";
import ContactPage from "@/app/(public)/contact/page";
import { submitInquiry, type ContactFormState } from "@/app/actions/contact";
import { useSearchParams } from "next/navigation";

/**
 * Contact form tests (docs/TASKS.md Task 5.1).
 *
 * The Server Action module is mocked so submissions resolve
 * deterministically without a server; `next/navigation` is mocked so
 * `useSearchParams` can simulate `?service=` pre-selection under jsdom.
 * Real component behavior (validation, honeypot, pending state, success
 * confirmation) is exercised through the actual form.
 */
vi.mock("@/app/actions/contact", () => ({
  submitInquiry: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(() => new URLSearchParams()),
}));

/** Builds a value matching Next's readonly `ReadonlyURLSearchParams`. */
type SearchParamsMock = ReturnType<typeof useSearchParams>;
function searchParams(query = ""): SearchParamsMock {
  return new URLSearchParams(query) as unknown as SearchParamsMock;
}

const SUCCESS_STATE: ContactFormState = {
  status: "success",
  message:
    "Thank you — your consultation request has been received. A consultant will reply within one business day.",
  fieldErrors: null,
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(useSearchParams).mockReturnValue(searchParams());
  vi.mocked(submitInquiry).mockResolvedValue(SUCCESS_STATE);
});

async function fillValidForm(user: UserEvent) {
  await user.type(screen.getByLabelText("Full name"), "Jordan Mercer");
  await user.type(screen.getByLabelText("Email"), "jordan@example.com");
  await user.type(screen.getByLabelText("Phone (optional)"), "207-555-0199");
  await user.type(
    screen.getByLabelText("Company / organization"),
    "Mercer Timberlands",
  );
  await user.selectOptions(screen.getByLabelText("Inquiry type"), "planning");
  await user.type(
    screen.getByLabelText("Message"),
    "We need a wetland delineation and permit strategy for a 40-acre parcel before the fall window closes.",
  );
  await user.click(screen.getByRole("checkbox", { name: /consent/i }));
}

describe("ContactForm", () => {
  it("renders every inquiry field with labels and sensible defaults", () => {
    render(<ContactForm />);

    expect(screen.getByLabelText("Full name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Phone (optional)")).toBeInTheDocument();
    expect(screen.getByLabelText("Company / organization")).toBeInTheDocument();
    expect(screen.getByLabelText("Inquiry type")).toHaveValue("general");
    expect(screen.getByLabelText("Message")).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: /consent/i }),
    ).not.toBeChecked();
    expect(
      screen.getByRole("button", { name: /send consultation request/i }),
    ).toBeEnabled();
    expect(
      screen.getByRole("heading", { name: "Consultation request" }),
    ).toBeInTheDocument();
  });

  it("includes the invisible companyWebsite honeypot field", () => {
    render(<ContactForm />);

    const honeypot = screen.getByLabelText("Company website");
    expect(honeypot).toHaveAttribute("name", "companyWebsite");
    expect(honeypot).toHaveAttribute("tabindex", "-1");
    expect(honeypot).toHaveAttribute("autocomplete", "off");
    expect(honeypot).toHaveValue("");
    expect(honeypot.closest('[aria-hidden="true"]')).not.toBeNull();
    expect(honeypot.closest("form")).not.toBeNull();
  });

  it("pre-selects the inquiry type from ?service= search params", () => {
    vi.mocked(useSearchParams).mockReturnValue(
      searchParams("?service=environmental-planning"),
    );

    render(<ContactForm />);

    expect(screen.getByLabelText("Inquiry type")).toHaveValue("planning");
  });

  it("falls back to the neutral general type for unknown service params", () => {
    vi.mocked(useSearchParams).mockReturnValue(
      searchParams("?service=not-a-real-service"),
    );

    render(<ContactForm />);

    expect(screen.getByLabelText("Inquiry type")).toHaveValue("general");
  });

  it("shows inline validation errors and skips the server call when invalid", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.click(
      screen.getByRole("button", { name: /send consultation request/i }),
    );

    expect(
      await screen.findByText("Please enter your full name."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Please enter a valid email address."),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/at least 20 characters so we can help/),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Please accept the privacy policy to continue."),
    ).toBeInTheDocument();

    const name = screen.getByLabelText("Full name");
    expect(name).toHaveAttribute("aria-invalid", "true");
    expect(name).toHaveAttribute("aria-describedby", "contact-name-error");

    expect(submitInquiry).not.toHaveBeenCalled();
  });

  it("disables the submit button while pending and confirms success", async () => {
    const user = userEvent.setup();
    let resolveAction!: (value: ContactFormState) => void;
    vi.mocked(submitInquiry).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveAction = resolve;
        }),
    );

    render(<ContactForm />);
    await fillValidForm(user);

    const button = screen.getByRole("button", {
      name: /send consultation request/i,
    });
    await user.click(button);

    await waitFor(() => expect(button).toBeDisabled());
    expect(button).toHaveTextContent(/sending/i);
    expect(button).toHaveAttribute("aria-busy", "true");

    expect(submitInquiry).toHaveBeenCalledTimes(1);
    const [prevState, formData] = vi.mocked(submitInquiry).mock.calls[0];
    expect(prevState).toEqual({
      status: "idle",
      message: null,
      fieldErrors: null,
    });
    expect(formData.get("name")).toBe("Jordan Mercer");
    expect(formData.get("email")).toBe("jordan@example.com");
    expect(formData.get("inquiryType")).toBe("planning");
    expect(formData.get("consent")).toBe("on");
    expect(formData.get("companyWebsite")).toBe("");

    await act(async () => {
      resolveAction(SUCCESS_STATE);
    });

    expect(screen.getByRole("status")).toHaveTextContent(/received/i);
    expect(
      screen.queryByRole("button", { name: /send consultation request/i }),
    ).toBeNull();
  });

  it("surfaces server-returned field errors inline", async () => {
    const user = userEvent.setup();
    vi.mocked(submitInquiry).mockResolvedValue({
      status: "error",
      message: "Please correct the highlighted fields and try again.",
      fieldErrors: { email: "This email address is already registered." },
    });

    render(<ContactForm />);
    await fillValidForm(user);
    await user.click(
      screen.getByRole("button", { name: /send consultation request/i }),
    );

    expect(
      await screen.findByText("This email address is already registered."),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });
});

describe("Contact page", () => {
  it("renders the editorial two-column layout with office details and timeline", () => {
    render(<ContactPage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /start a conversation/i,
      }),
    ).toBeInTheDocument();

    // Left column — office details mirrored from the footer.
    expect(screen.getByRole("heading", { name: "Office" })).toBeInTheDocument();
    expect(
      screen.getByText("14 Marshview Lane, Suite 300"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "inquiries@integravity.example" }),
    ).toHaveAttribute("href", "mailto:inquiries@integravity.example");
    expect(
      screen.getByRole("link", { name: "(207) 555-0148" }),
    ).toHaveAttribute("href", "tel:+12075550148");
    expect(
      screen.getByRole("heading", { name: "What to expect" }),
    ).toBeInTheDocument();

    // Right column — the form renders inside the Suspense boundary.
    expect(screen.getByLabelText("Full name")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send consultation request/i }),
    ).toBeInTheDocument();
  });
});
