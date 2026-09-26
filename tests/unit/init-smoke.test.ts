import { describe, expect, it } from "vitest";
import { contactInquirySchema, INQUIRY_TYPES } from "@/lib/validations/contact";
import { slugify, truncate, formatDate } from "@/lib/utilities";
import { SupabaseNotConfiguredError } from "@/lib/env";

/**
 * Smoke tests for the initialization phase: validation schemas, shared
 * utilities and fail-secure environment helpers. Expand coverage as
 * implementation progresses (docs/TASKS.md).
 */

const validInquiry = {
  name: "Jane Planner",
  email: "jane@example.com",
  inquiryType: "permitting",
  message:
    "We are evaluating a parcel near a designated wetland and need permitting guidance for a subdivision application.",
  consent: true,
  companyWebsite: "",
};

describe("contactInquirySchema", () => {
  it("accepts a fully valid inquiry", () => {
    const result = contactInquirySchema.safeParse(validInquiry);
    expect(result.success).toBe(true);
  });

  it("rejects messages shorter than 20 characters", () => {
    const result = contactInquirySchema.safeParse({
      ...validInquiry,
      message: "Too short",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email addresses", () => {
    const result = contactInquirySchema.safeParse({
      ...validInquiry,
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("rejects honeypot submissions (companyWebsite filled)", () => {
    const result = contactInquirySchema.safeParse({
      ...validInquiry,
      companyWebsite: "http://spam.example",
    });
    expect(result.success).toBe(false);
  });

  it("rejects when consent is not granted", () => {
    const result = contactInquirySchema.safeParse({
      ...validInquiry,
      consent: false,
    });
    expect(result.success).toBe(false);
  });

  it("only allows known inquiry types", () => {
    expect(INQUIRY_TYPES).toContain("wetland-delineation");
    const result = contactInquirySchema.safeParse({
      ...validInquiry,
      inquiryType: "unknown-type",
    });
    expect(result.success).toBe(false);
  });
});

describe("slugify", () => {
  it("produces URL-safe slugs", () => {
    expect(slugify("Wetland Delineation & Report")).toBe(
      "wetland-delineation-report",
    );
  });

  it("collapses repeated separators", () => {
    expect(slugify("A -- B___C")).toBe("a-b-c");
  });

  it("strips accents", () => {
    expect(slugify("Évaluation Environnementale")).toBe(
      "evaluation-environnementale",
    );
  });
});

describe("truncate", () => {
  it("leaves short text untouched", () => {
    expect(truncate("Short", 10)).toBe("Short");
  });

  it("truncates long text with an ellipsis", () => {
    expect(truncate("A very long piece of text", 10).endsWith("…")).toBe(true);
  });
});

describe("formatDate", () => {
  it("formats ISO dates as Month Year in UTC", () => {
    expect(formatDate("2026-03-15")).toBe("March 2026");
  });
});

describe("SupabaseNotConfiguredError", () => {
  it("produces actionable guidance", () => {
    const err = new SupabaseNotConfiguredError("unit test");
    expect(err.message).toContain(".env.local");
    expect(err.message).toContain(".env.example");
    expect(err.name).toBe("SupabaseNotConfiguredError");
  });
});
