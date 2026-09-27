"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { uploadMediaAsset } from "@/app/actions/media";
import { FormField } from "@/components/forms/FormField";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MEDIA_ACCEPT, MAX_MEDIA_UPLOAD_BYTES } from "@/lib/validations/media";
import { AdminDrawer } from "./AdminDrawer";

type Notice = { kind: "error" | "success"; text: string };

/**
 * Media upload dialog (docs/TASKS.md Task 7.4). The file input is
 * restricted to JPEG/PNG/WebP/SVG up to 5MB (`accept` hint mirrors the
 * shared `mediaUploadSchema`); submission packages the file, required
 * alt text, and optional caption into FormData for the
 * `uploadMediaAsset` Server Action. Returned Zod field errors render
 * inline — the shared schema remains the enforcement point.
 */
export function MediaUploadDrawer({ onClose }: { onClose: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState("");
  const [caption, setCaption] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<Notice | null>(null);
  const [pending, setPending] = useState(false);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    setFile(event.target.files?.[0] ?? null);
    setFieldErrors((previous) => {
      if (!previous.file) return previous;
      const next = { ...previous };
      delete next.file;
      return next;
    });
  }

  function clearError(key: string) {
    setFieldErrors((previous) => {
      if (!previous[key]) return previous;
      const next = { ...previous };
      delete next[key];
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setNotice(null);
    setFieldErrors({});

    const formData = new FormData();
    if (file) formData.set("file", file);
    formData.set("alt", alt);
    formData.set("caption", caption);

    try {
      const result = await uploadMediaAsset(formData);
      if (result.ok) {
        onClose();
        return;
      }
      setFieldErrors(result.fieldErrors ?? {});
      setNotice({ kind: "error", text: result.message });
    } catch {
      setNotice({
        kind: "error",
        text: "Could not upload the file — your session may have expired.",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <AdminDrawer eyebrow="Media library" title="Upload media" onClose={onClose}>
      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {notice ? (
          <div
            role={notice.kind === "error" ? "alert" : "status"}
            className={`rounded-lg px-4 py-3 text-sm ${
              notice.kind === "error"
                ? "border-destructive/40 bg-destructive/10 text-destructive"
                : "bg-brand-sage/30 text-brand-forest"
            }`}
          >
            {notice.text}
          </div>
        ) : null}

        <FormField
          id="media-file"
          label="File"
          error={fieldErrors.file}
          hint="JPEG, PNG, WebP, or SVG — up to 5MB."
        >
          <Input
            id="media-file"
            type="file"
            accept={MEDIA_ACCEPT}
            onChange={handleFileChange}
            aria-invalid={fieldErrors.file ? true : undefined}
            aria-describedby={
              fieldErrors.file ? "media-file-error" : "media-file-hint"
            }
            className="h-auto py-2 text-sm file:mr-3"
          />
        </FormField>

        <FormField
          id="media-alt"
          label="Alt text"
          error={fieldErrors.alt}
          hint="Required for accessibility."
        >
          <Input
            id="media-alt"
            value={alt}
            onChange={(event) => {
              setAlt(event.target.value);
              clearError("alt");
            }}
            aria-invalid={fieldErrors.alt ? true : undefined}
            aria-describedby={fieldErrors.alt ? "media-alt-error" : undefined}
          />
        </FormField>

        <FormField
          id="media-caption"
          label="Caption (optional)"
          error={fieldErrors.caption}
        >
          <Textarea
            id="media-caption"
            rows={2}
            value={caption}
            onChange={(event) => {
              setCaption(event.target.value);
              clearError("caption");
            }}
            aria-invalid={fieldErrors.caption ? true : undefined}
            aria-describedby={
              fieldErrors.caption ? "media-caption-error" : undefined
            }
          />
        </FormField>

        <p className="text-muted-foreground text-xs">
          Files are stored in the Supabase Storage{" "}
          <code className="bg-muted rounded px-1 py-0.5">media</code> bucket and
          cataloged for the CMS. Maximum{" "}
          {MAX_MEDIA_UPLOAD_BYTES / (1024 * 1024)}MB per file.
        </p>

        <div className="border-border flex items-center justify-end gap-3 border-t pt-5">
          <button
            type="button"
            onClick={onClose}
            className={buttonVariants({ variant: "outline" })}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={pending}
            className={buttonVariants({ variant: "default" })}
          >
            {pending ? "Uploading…" : "Upload file"}
          </button>
        </div>
      </form>
    </AdminDrawer>
  );
}
