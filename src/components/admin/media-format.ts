/**
 * Media library formatting helpers (docs/TASKS.md Task 7.4).
 * Shared by the grid cards so byte formatting stays consistent.
 */

/**
 * Human-readable file size: bytes below 1KB stay exact, otherwise one
 * decimal place for KB (1024) or MB (1048576) units.
 */
export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
