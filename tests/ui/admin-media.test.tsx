import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AdminMediaPage from "@/app/admin/media/page";
import { MediaGrid } from "@/components/admin";
import { assertAdmin, requireAdmin } from "@/lib/auth/admin";
import { SupabaseNotConfiguredError } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { MediaAssetView } from "@/types/cms";

// The auth gate and Supabase client are mocked so the real page, grid,
// upload drawer, and Server Actions run against scripted results.
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

const MEDIA_ROWS: MediaAssetView[] = [
  {
    id: "media-1",
    filename: "salt-marsh-panorama.jpg",
    file_path: "a1b2-salt-marsh-panorama.jpg",
    storage_bucket: "media",
    mime_type: "image/jpeg",
    file_size: 2_621_440, // 2.5 MB
    alt_text: "Aerial view of a salt marsh at low tide",
    caption: "Marshview restoration site",
    created_at: "2026-09-20T10:00:00.000Z",
    public_url:
      "https://test.supabase.co/storage/v1/object/public/media/a1b2-salt-marsh-panorama.jpg",
  },
  {
    id: "media-2",
    filename: "logomark.svg",
    file_path: "c3d4-logomark.svg",
    storage_bucket: "media",
    mime_type: "image/svg+xml",
    file_size: 1536, // 1.5 KB
    alt_text: "IntegraVity logomark",
    caption: null,
    created_at: "2026-09-18T09:00:00.000Z",
    public_url:
      "https://test.supabase.co/storage/v1/object/public/media/c3d4-logomark.svg",
  },
];

type WriteOp = {
  type: "insert" | "delete";
  table: string;
  payload: Record<string, unknown>;
  filters: Record<string, unknown>;
};

type UploadOp = {
  bucket: string;
  path: string;
  file: File;
  options: Record<string, unknown>;
};

/**
 * Chainable fake covering the shapes this suite needs:
 * - read:    `from().select().order()` → `{ data: rows }`
 * - write:   `from().insert(payload)` / `from().delete().eq()` → recorded
 * - storage: `storage.from().upload()` / `.remove()` (async) and
 *            `.getPublicUrl()` (sync, like the real client)
 * DB builders resolve when awaited (thenable); writes are recorded.
 */
function createSupabaseMock(
  data: Record<string, unknown[]> = { media_assets: MEDIA_ROWS },
  options: { failRead?: boolean } = {},
) {
  const writes: WriteOp[] = [];
  const uploads: UploadOp[] = [];
  const removes: string[][] = [];

  const from = vi.fn((table: string) => {
    const state: {
      mode: "read" | "insert" | "delete";
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
      insert: vi.fn((payload: Record<string, unknown>) => {
        state.mode = "insert";
        state.payload = payload;
        return builder;
      }),
      delete: vi.fn(() => {
        state.mode = "delete";
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

  const storage = {
    from: vi.fn((bucket: string) => ({
      upload: vi.fn(
        async (
          path: string,
          file: File,
          uploadOptions: Record<string, unknown>,
        ) => {
          uploads.push({ bucket, path, file, options: uploadOptions });
          return { data: { path }, error: null };
        },
      ),
      remove: vi.fn(async (paths: string[]) => {
        removes.push(paths);
        return { data: paths.map((name) => ({ name })), error: null };
      }),
      getPublicUrl: vi.fn((path: string) => ({
        data: {
          publicUrl: `https://test.supabase.co/storage/v1/object/public/${bucket}/${path}`,
        },
      })),
    })),
  };

  return { from, storage, writes, uploads, removes };
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

describe("admin media page", () => {
  it("gates access and renders the grid from mocked rows with public URLs", async () => {
    render(await AdminMediaPage());

    expect(vi.mocked(requireAdmin)).toHaveBeenCalledTimes(1);
    expect(
      screen.getByRole("heading", { level: 1, name: "Media library" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/2 assets/)).toBeInTheDocument();

    // Thumbnails: alt text from the catalog, src from storage.getPublicUrl.
    const thumbnail = screen.getByAltText(
      "Aerial view of a salt marsh at low tide",
    );
    expect(thumbnail).toHaveAttribute(
      "src",
      "https://test.supabase.co/storage/v1/object/public/media/a1b2-salt-marsh-panorama.jpg",
    );

    // Filename, formatted size, MIME badge, alt line, caption, actions.
    const card = screen
      .getByRole("heading", { name: "salt-marsh-panorama.jpg" })
      .closest("article") as HTMLElement;
    expect(within(card).getByText("2.5 MB")).toBeInTheDocument();
    expect(within(card).getByText("image/jpeg")).toBeInTheDocument();
    expect(
      within(card).getByText("Aerial view of a salt marsh at low tide"),
    ).toBeInTheDocument();
    expect(
      within(card).getByText("“Marshview restoration site”"),
    ).toBeInTheDocument();
    expect(
      within(card).getByRole("button", { name: "Copy URL" }),
    ).toBeInTheDocument();
    expect(
      within(card).getByRole("button", {
        name: "Delete salt-marsh-panorama.jpg",
      }),
    ).toBeInTheDocument();

    const secondCard = screen
      .getByRole("heading", { name: "logomark.svg" })
      .closest("article") as HTMLElement;
    expect(within(secondCard).getByText("1.5 KB")).toBeInTheDocument();
    expect(within(secondCard).getByText("image/svg+xml")).toBeInTheDocument();
    expect(within(secondCard).queryByText(/“/)).not.toBeInTheDocument(); // null caption renders no quote
  });

  it("renders an explicit load-error notice when the query fails", async () => {
    vi.mocked(createClient).mockResolvedValue(
      createSupabaseMock({}, { failRead: true }) as never,
    );

    render(await AdminMediaPage());

    expect(screen.getByRole("alert")).toHaveTextContent(
      /could not load media assets/i,
    );
  });

  it("propagates the redirect when requireAdmin() fails", async () => {
    vi.mocked(requireAdmin).mockRejectedValue(
      Object.assign(new Error("NEXT_REDIRECT:/admin/login"), {
        name: "RedirectError",
      }),
    );

    await expect(AdminMediaPage()).rejects.toThrow(
      "NEXT_REDIRECT:/admin/login",
    );
    expect(vi.mocked(createClient)).not.toHaveBeenCalled();
  });

  it("renders setup guidance instead of crashing when Supabase is unconfigured", async () => {
    vi.mocked(requireAdmin).mockRejectedValue(
      new SupabaseNotConfiguredError("test"),
    );

    render(await AdminMediaPage());

    expect(
      screen.getByRole("heading", { level: 1, name: "Media library" }),
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

describe("MediaUploadDrawer / uploadMediaAsset", () => {
  async function openUploadDialog(user: ReturnType<typeof userEvent.setup>) {
    render(<MediaGrid assets={[]} />);
    await user.click(screen.getByRole("button", { name: "Upload media" }));
    return screen.getByRole("dialog");
  }

  it("uploads an image to the media bucket, records the row, and revalidates", async () => {
    const user = userEvent.setup({ delay: null });
    const file = new File(["png-bytes"], "creek-survey.png", {
      type: "image/png",
    });

    const dialog = await openUploadDialog(user);
    const input = within(dialog).getByLabelText("File");
    expect(input).toHaveAttribute(
      "accept",
      "image/jpeg,image/png,image/webp,image/svg+xml",
    );

    await user.upload(input, file);
    await user.type(
      within(dialog).getByLabelText("Alt text"),
      "Creek survey benchmark stake",
    );
    await user.type(
      within(dialog).getByLabelText("Caption (optional)"),
      "Transect C",
    );
    await user.click(
      within(dialog).getByRole("button", { name: "Upload file" }),
    );

    await waitFor(() => {
      expect(mockClient.uploads).toHaveLength(1);
    });
    expect(mockClient.uploads[0]).toMatchObject({
      bucket: "media",
      options: { contentType: "image/png", upsert: false },
    });
    expect(mockClient.uploads[0].file.name).toBe("creek-survey.png");
    expect(mockClient.uploads[0].path).toContain("creek-survey.png");

    await waitFor(() => {
      expect(mockClient.writes).toHaveLength(1);
    });
    expect(mockClient.writes[0]).toMatchObject({
      type: "insert",
      table: "media_assets",
      payload: {
        filename: "creek-survey.png",
        file_path: mockClient.uploads[0].path,
        storage_bucket: "media",
        mime_type: "image/png",
        file_size: file.size,
        alt_text: "Creek survey benchmark stake",
        caption: "Transect C",
      },
    });

    expect(vi.mocked(assertAdmin)).toHaveBeenCalledTimes(1);
    expect(revalidatePath).toHaveBeenCalledWith("/admin/media");
    expect(revalidatePath).toHaveBeenCalledWith("/admin");
    expect(revalidatePath).toHaveBeenCalledTimes(2);
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("rejects non-image files before any storage or database access", async () => {
    // `applyAccept: false` at setup bypasses the picker-side accept filter
    // so the server-side schema rejection can be exercised through the UI.
    const user = userEvent.setup({ delay: null, applyAccept: false });
    const pdf = new File(["%PDF-1.4"], "field-report.pdf", {
      type: "application/pdf",
    });

    const dialog = await openUploadDialog(user);
    await user.upload(within(dialog).getByLabelText("File"), pdf);
    await user.type(
      within(dialog).getByLabelText("Alt text"),
      "Signed field report",
    );
    await user.click(
      within(dialog).getByRole("button", { name: "Upload file" }),
    );

    expect(
      await within(dialog).findByText(
        "Only JPEG, PNG, WebP, or SVG image files are allowed.",
      ),
    ).toBeInTheDocument();
    expect(mockClient.uploads).toHaveLength(0);
    expect(mockClient.writes).toHaveLength(0);
    expect(vi.mocked(createClient)).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("rejects files larger than 5MB before any storage or database access", async () => {
    const user = userEvent.setup({ delay: null });
    const huge = new File([new Uint8Array(6 * 1024 * 1024)], "panorama.png", {
      type: "image/png",
    });

    const dialog = await openUploadDialog(user);
    await user.upload(within(dialog).getByLabelText("File"), huge);
    await user.type(within(dialog).getByLabelText("Alt text"), "Panorama");
    await user.click(
      within(dialog).getByRole("button", { name: "Upload file" }),
    );

    expect(
      await within(dialog).findByText("File must be 5MB or smaller."),
    ).toBeInTheDocument();
    expect(mockClient.uploads).toHaveLength(0);
    expect(vi.mocked(createClient)).not.toHaveBeenCalled();
  });

  it("requires alt text for accessibility before any storage access", async () => {
    const user = userEvent.setup({ delay: null });
    const file = new File(["svg-bytes"], "diagram.svg", {
      type: "image/svg+xml",
    });

    const dialog = await openUploadDialog(user);
    await user.upload(within(dialog).getByLabelText("File"), file);
    await user.click(
      within(dialog).getByRole("button", { name: "Upload file" }),
    );

    expect(
      await within(dialog).findByText("Alt text is required."),
    ).toBeInTheDocument();
    expect(mockClient.uploads).toHaveLength(0);
    expect(vi.mocked(createClient)).not.toHaveBeenCalled();
  });

  it("records the metadata gracefully in demo mode (Supabase unconfigured)", async () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    vi.mocked(createClient).mockRejectedValue(
      new SupabaseNotConfiguredError("test"),
    );

    const user = userEvent.setup({ delay: null });
    const file = new File(["png-bytes"], "creek-survey.png", {
      type: "image/png",
    });

    try {
      const dialog = await openUploadDialog(user);
      await user.upload(within(dialog).getByLabelText("File"), file);
      await user.type(
        within(dialog).getByLabelText("Alt text"),
        "Creek survey benchmark stake",
      );
      await user.click(
        within(dialog).getByRole("button", { name: "Upload file" }),
      );

      await waitFor(() => {
        expect(info).toHaveBeenCalledWith(
          "[demo] media upload recorded without storage:",
          expect.objectContaining({ filename: "creek-survey.png" }),
        );
      });
      expect(mockClient.uploads).toHaveLength(0);
      expect(mockClient.writes).toHaveLength(0);
      // Graceful success closes the drawer instead of surfacing an error.
      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    } finally {
      info.mockRestore();
    }
  });
});

describe("MediaGrid delete + copy URL", () => {
  it("removes the object and catalog row, then revalidates", async () => {
    const user = userEvent.setup({ delay: null });
    render(<MediaGrid assets={MEDIA_ROWS} />);

    await user.click(
      screen.getByRole("button", { name: "Delete salt-marsh-panorama.jpg" }),
    );

    // Optimistic: the card leaves the grid before the round-trip settles.
    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: "salt-marsh-panorama.jpg" }),
      ).not.toBeInTheDocument();
    });
    expect(screen.getByText(/1 asset in the/)).toBeInTheDocument();

    await waitFor(() => {
      expect(mockClient.removes).toEqual([["a1b2-salt-marsh-panorama.jpg"]]);
      expect(mockClient.writes).toEqual([
        {
          type: "delete",
          table: "media_assets",
          payload: {},
          filters: { id: "media-1" },
        },
      ]);
    });
    expect(vi.mocked(assertAdmin)).toHaveBeenCalledTimes(1);
    expect(revalidatePath).toHaveBeenCalledWith("/admin/media");
    expect(revalidatePath).toHaveBeenCalledWith("/admin");
    expect(revalidatePath).toHaveBeenCalledTimes(2);
    // The sibling asset survives.
    expect(
      screen.getByRole("heading", { name: "logomark.svg" }),
    ).toBeInTheDocument();
  });

  it("copies the public URL to the clipboard with inline feedback", async () => {
    const user = userEvent.setup({ delay: null });
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });

    render(<MediaGrid assets={MEDIA_ROWS} />);
    const card = screen
      .getByRole("heading", { name: "salt-marsh-panorama.jpg" })
      .closest("article") as HTMLElement;

    await user.click(within(card).getByRole("button", { name: "Copy URL" }));

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith(MEDIA_ROWS[0].public_url);
    });
    expect(
      await within(card).findByRole("button", { name: "Copied" }),
    ).toBeInTheDocument();
  });
});
