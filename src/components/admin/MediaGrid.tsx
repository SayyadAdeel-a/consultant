"use client";

import { ImageIcon, Inbox } from "lucide-react";
import { useState } from "react";
import { deleteMediaAsset } from "@/app/actions/media";
import { buttonVariants } from "@/components/ui/button";
import type { MediaAssetView } from "@/types/cms";
import { formatFileSize } from "./media-format";
import { MediaUploadDrawer } from "./MediaUploadDrawer";

/**
 * Media library grid (docs/TASKS.md Task 7.4): thumbnail, filename,
 * formatted file size, MIME badge, alt text, and a public-URL copy
 * button per asset, plus quick delete (best-effort object removal,
 * catalog row is authoritative — see `deleteMediaAsset`). Deleted cards
 * vanish optimistically and reappear with an inline alert on failure.
 * Public URLs are built server-side via `storage.getPublicUrl`.
 */
export function MediaGrid({
  assets,
  loadError = false,
}: {
  assets: MediaAssetView[];
  loadError?: boolean;
}) {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [removedIds, setRemovedIds] = useState<Set<string>>(() => new Set());
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copyFailedId, setCopyFailedId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const visible = assets.filter((asset) => !removedIds.has(asset.id));

  function restore(id: string) {
    setRemovedIds((previous) => {
      const next = new Set(previous);
      next.delete(id);
      return next;
    });
  }

  async function handleCopy(asset: MediaAssetView) {
    setCopyFailedId(null);
    try {
      await navigator.clipboard.writeText(asset.public_url);
      setCopiedId(asset.id);
    } catch {
      setCopyFailedId(asset.id);
    }
  }

  async function handleDelete(asset: MediaAssetView) {
    setPendingId(asset.id);
    setActionError(null);
    setCopyFailedId(null);
    setRemovedIds((previous) => new Set(previous).add(asset.id)); // optimistic
    try {
      const result = await deleteMediaAsset(asset.id, asset.file_path);
      if (!result.ok) {
        restore(asset.id);
        setActionError(result.message);
      }
    } catch {
      restore(asset.id);
      setActionError(
        "Could not delete this asset — your session may have expired.",
      );
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted-foreground text-sm">
          {visible.length} {visible.length === 1 ? "asset" : "assets"} in the{" "}
          <code className="bg-muted text-muted-foreground rounded px-1 py-0.5 text-xs">
            media
          </code>{" "}
          bucket
        </p>
        <button
          type="button"
          onClick={() => setIsUploadOpen(true)}
          className={buttonVariants({ variant: "default", size: "sm" })}
        >
          Upload media
        </button>
      </div>

      {actionError ? (
        <div
          role="alert"
          className="border-destructive/40 bg-destructive/10 text-destructive mt-4 rounded-lg border px-4 py-3 text-sm"
        >
          {actionError}
        </div>
      ) : null}

      {loadError ? (
        <div
          role="alert"
          className="border-destructive/40 bg-destructive/10 text-foreground mt-4 rounded-lg border px-4 py-3 text-sm"
        >
          Could not load media assets right now. Please refresh the page — if
          the problem persists, verify the Supabase configuration.
        </div>
      ) : null}

      {!loadError && visible.length === 0 ? (
        <div className="border-border bg-muted/30 mt-4 rounded-xl border border-dashed p-10 text-center">
          <Inbox
            aria-hidden="true"
            className="text-muted-foreground/60 mx-auto size-8"
          />
          <p className="text-muted-foreground mt-3 text-sm">
            No media yet. Upload the first asset to get started.
          </p>
        </div>
      ) : null}

      {!loadError && visible.length > 0 ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((asset) => (
            <article
              key={asset.id}
              className="border-border bg-background flex flex-col overflow-hidden rounded-xl border"
            >
              <div className="bg-muted relative aspect-[4/3]">
                {asset.public_url ? (
                  /* Admin-only thumbnails of arbitrary uploads: next/image
                     would need env-dependent remotePatterns for the storage
                     host plus intrinsic dimensions the catalog doesn't store
                     (media_assets.width/height are NULL). */
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={asset.public_url}
                    alt={asset.alt_text}
                    loading="lazy"
                    className="size-full object-cover"
                  />
                ) : (
                  <ImageIcon
                    aria-hidden="true"
                    className="text-muted-foreground/60 absolute top-1/2 left-1/2 size-8 -translate-x-1/2 -translate-y-1/2"
                  />
                )}
              </div>
              <div className="flex-1 space-y-2 p-4">
                <h3
                  className="truncate text-sm font-medium"
                  title={asset.filename}
                >
                  {asset.filename}
                </h3>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="bg-muted text-foreground rounded-full px-2 py-0.5 text-xs font-medium tabular-nums">
                    {formatFileSize(asset.file_size)}
                  </span>
                  <span className="border-border text-muted-foreground rounded-full border px-2 py-0.5 font-mono text-xs">
                    {asset.mime_type}
                  </span>
                </div>
                <p className="text-muted-foreground text-xs">
                  <span className="text-foreground font-medium">Alt:</span>{" "}
                  {asset.alt_text}
                </p>
                {asset.caption ? (
                  <p className="text-muted-foreground truncate text-xs italic">
                    “{asset.caption}”
                  </p>
                ) : null}
              </div>
              <div className="border-border flex items-center justify-between gap-2 border-t p-3">
                <button
                  type="button"
                  onClick={() => void handleCopy(asset)}
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  {copiedId === asset.id ? "Copied" : "Copy URL"}
                </button>
                <button
                  type="button"
                  aria-label={`Delete ${asset.filename}`}
                  disabled={pendingId === asset.id}
                  onClick={() => void handleDelete(asset)}
                  className={buttonVariants({ variant: "ghost", size: "sm" })}
                >
                  {pendingId === asset.id ? "Deleting…" : "Delete"}
                </button>
              </div>
              {copyFailedId === asset.id ? (
                <p
                  role="alert"
                  className="border-border text-muted-foreground border-t px-4 py-2 text-xs"
                >
                  Could not copy to the clipboard — select the URL manually:{" "}
                  <span className="bg-muted text-foreground mt-1 block rounded px-1 py-0.5 font-mono break-all">
                    {asset.public_url}
                  </span>
                </p>
              ) : null}
            </article>
          ))}
        </div>
      ) : null}

      {isUploadOpen ? (
        <MediaUploadDrawer onClose={() => setIsUploadOpen(false)} />
      ) : null}
    </div>
  );
}
