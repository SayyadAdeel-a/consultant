"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  updateInquiryNotes,
  updateInquiryStatus,
} from "@/app/actions/inquiries";
import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { InquiryRecord } from "@/types/cms";
import {
  INQUIRY_STATUSES,
  type InquiryStatus,
} from "@/lib/validations/inquiries";
import { StatusPill, statusLabel } from "./StatusPill";
import { formatReceivedDate, inquiryTypeLabel } from "./inquiry-format";

/**
 * Detail inspection drawer for a single confidential inquiry
 * (docs/TASKS.md Task 7.2). Renders full contact details (mailto / tel
 * links), the complete message with line breaks preserved, a one-click
 * status selector, and the internal notes editor — both wired to the
 * `updateInquiryStatus` / `updateInquiryNotes` Server Actions.
 *
 * Accessibility: role="dialog" + aria-modal, focuses the panel on open,
 * Escape closes, Tab is trapped inside the drawer, backdrop click closes.
 */

type Notice = { kind: "error" | "success"; text: string };

export function InquiryDetailDrawer({
  inquiry,
  onClose,
}: {
  inquiry: InquiryRecord;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [statusDraft, setStatusDraft] = useState<InquiryStatus>(inquiry.status);
  const [notesDraft, setNotesDraft] = useState(inquiry.admin_notes ?? "");
  const [pending, setPending] = useState<"status" | "notes" | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);

  useEffect(() => {
    dialogRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusables = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), select:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || active === dialog)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || active === dialog)) {
        event.preventDefault();
        first.focus();
      } else if (active instanceof Node && !dialog.contains(active)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  async function handleStatusChange(next: InquiryStatus) {
    if (next === statusDraft) return;
    const previous = statusDraft;
    setStatusDraft(next);
    setPending("status");
    setNotice(null);
    try {
      const result = await updateInquiryStatus(inquiry.id, next);
      if (!result.ok) {
        setStatusDraft(previous);
        setNotice({ kind: "error", text: result.message });
      } else {
        setNotice({
          kind: "success",
          text: `Status updated to “${statusLabel(next)}”.`,
        });
      }
    } catch {
      setStatusDraft(previous);
      setNotice({
        kind: "error",
        text: "Could not update the status — your session may have expired.",
      });
    } finally {
      setPending(null);
    }
  }

  async function handleNotesSave() {
    setPending("notes");
    setNotice(null);
    try {
      const result = await updateInquiryNotes(inquiry.id, notesDraft);
      if (!result.ok) {
        setNotice({ kind: "error", text: result.message });
      } else {
        setNotice({ kind: "success", text: "Notes saved." });
      }
    } catch {
      setNotice({
        kind: "error",
        text: "Could not save notes — your session may have expired.",
      });
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        aria-hidden="true"
        onClick={onClose}
        className="bg-brand-charcoal/40 absolute inset-0"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="inquiry-drawer-title"
        tabIndex={-1}
        className="border-border bg-background relative h-full w-full max-w-xl overflow-y-auto border-l p-6 shadow-2xl focus:outline-none sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-eyebrow text-muted-foreground">Inquiry</p>
            <h2
              id="inquiry-drawer-title"
              className="font-heading mt-1 text-xl font-semibold"
            >
              {inquiry.name}
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              {inquiry.company ?? inquiryTypeLabel(inquiry.inquiry_type)}
            </p>
          </div>
          <button
            type="button"
            aria-label="Close inquiry details"
            onClick={onClose}
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>

        {notice ? (
          <div
            role={notice.kind === "error" ? "alert" : "status"}
            className={`mt-4 rounded-lg px-4 py-3 text-sm ${
              notice.kind === "error"
                ? "border-destructive/40 bg-destructive/10"
                : "bg-brand-sage/30 text-brand-forest"
            }`}
          >
            {notice.text}
          </div>
        ) : null}

        <dl className="mt-6 space-y-3 text-sm">
          <div>
            <dt className="text-muted-foreground">Email</dt>
            <dd>
              <a
                href={`mailto:${inquiry.email}`}
                className="text-brand-forest underline underline-offset-2"
              >
                {inquiry.email}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Phone</dt>
            <dd>
              {inquiry.phone ? (
                <a
                  href={`tel:${inquiry.phone}`}
                  className="text-brand-forest underline underline-offset-2"
                >
                  {inquiry.phone}
                </a>
              ) : (
                "—"
              )}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Organization</dt>
            <dd>{inquiry.company ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Inquiry type</dt>
            <dd>{inquiryTypeLabel(inquiry.inquiry_type)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Received</dt>
            <dd>
              <time dateTime={inquiry.created_at}>
                {formatReceivedDate(inquiry.created_at)}
              </time>
            </dd>
          </div>
        </dl>

        <div className="border-border mt-6 border-t pt-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="inquiry-status">Status</Label>
              <StatusPill status={statusDraft} />
            </div>
            <select
              id="inquiry-status"
              value={statusDraft}
              disabled={pending === "status"}
              onChange={(event) =>
                void handleStatusChange(event.target.value as InquiryStatus)
              }
              className="border-border bg-background focus-visible:ring-ring/50 h-9 rounded-md border px-2 text-sm focus-visible:ring-3 focus-visible:outline-none disabled:opacity-60"
            >
              {INQUIRY_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {statusLabel(status)}
                </option>
              ))}
            </select>
          </div>
          {pending === "status" ? (
            <p className="text-muted-foreground mt-2 text-xs">Saving…</p>
          ) : null}
        </div>

        <div className="border-border mt-6 border-t pt-5">
          <h3 className="text-foreground text-sm font-semibold">Message</h3>
          <p className="text-foreground/90 mt-2 text-sm leading-relaxed whitespace-pre-wrap">
            {inquiry.message}
          </p>
        </div>

        <div className="border-border mt-6 border-t pt-5">
          <Label htmlFor="inquiry-notes">Internal notes</Label>
          <p className="text-muted-foreground mt-1 text-xs">
            Consultant follow-up log — never shown to the client.
          </p>
          <Textarea
            id="inquiry-notes"
            rows={4}
            value={notesDraft}
            disabled={pending === "notes"}
            onChange={(event) => setNotesDraft(event.target.value)}
            placeholder="Log calls, next steps, or context for the team…"
            className="mt-2"
          />
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-muted-foreground text-xs">
              {notesDraft.length}/5000
            </span>
            <button
              type="button"
              onClick={() => void handleNotesSave()}
              disabled={pending === "notes"}
              className={buttonVariants({ variant: "default", size: "sm" })}
            >
              {pending === "notes" ? "Saving…" : "Save notes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
