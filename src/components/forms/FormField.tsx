import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";

/**
 * Label + control + inline error, wired together for screen readers
 * (`htmlFor` + `aria-describedby` via the `<id>-error` alert node).
 * Shared by the contact form, admin login, and Phase 7 CMS forms so the
 * error markup can never drift between them.
 */
export function FormField({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-destructive text-sm">
          {error}
        </p>
      ) : null}
    </div>
  );
}
