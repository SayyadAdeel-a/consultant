import { z } from "zod";
import { cmsIdSchema } from "./cms";

/**
 * Media library validation (docs/TASKS.md Task 7.4), shared by the
 * upload drawer (client constants) and the `uploadMediaAsset` /
 * `deleteMediaAsset` Server Actions.
 *
 * Upload rule: images only (JPEG, PNG, WebP, SVG), max 5MB per the
 * Task 7.4 specification; alt text is required for accessibility and
 * the caption is optional.
 *
 * Client-safe: imports only Zod.
 */

export const MEDIA_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
] as const;

/** `accept` attribute for the upload input — mirrors MEDIA_MIME_TYPES. */
export const MEDIA_ACCEPT = MEDIA_MIME_TYPES.join(",");

/** 5MB hard limit (docs/TASKS.md Task 7.4). */
export const MAX_MEDIA_UPLOAD_BYTES = 5 * 1024 * 1024;

export const mediaUploadSchema = z.object({
  file: z
    .file("An image file is required.")
    .refine(
      (file) => (MEDIA_MIME_TYPES as readonly string[]).includes(file.type),
      "Only JPEG, PNG, WebP, or SVG image files are allowed.",
    )
    .refine(
      (file) => file.size <= MAX_MEDIA_UPLOAD_BYTES,
      "File must be 5MB or smaller.",
    )
    .refine((file) => file.size > 0, "The selected file is empty."),
  alt: z
    .string()
    .trim()
    .min(1, "Alt text is required.")
    .max(300, "Alt text is too long."),
  caption: z
    .string()
    .trim()
    .max(500, "Caption is too long.")
    .optional()
    .transform((value) => (value ? value : null)),
});

/** What callers pass to `uploadMediaAsset` (FormData contents). */
export type MediaUploadInput = z.input<typeof mediaUploadSchema>;

/** Delete arguments — both the catalog row and the storage object. */
export const mediaDeleteSchema = z.object({
  id: cmsIdSchema,
  file_path: z
    .string()
    .trim()
    .min(1, "Invalid file path.")
    .max(400, "Invalid file path.")
    .refine((value) => !value.includes(".."), "Invalid file path."),
});
