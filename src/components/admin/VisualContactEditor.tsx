"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  Mail,
  MapPin,
  PhoneCall,
  Save,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

interface VisualContactEditorProps {
  initialEmail: string;
  initialPhone: string;
  initialAddress: string;
  initialHours: string;
  initialResponseGuarantee: string;
}

export function VisualContactEditor({
  initialEmail,
  initialPhone,
  initialAddress,
  initialHours,
  initialResponseGuarantee,
}: VisualContactEditorProps) {
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState(initialPhone);
  const [address, setAddress] = useState(initialAddress);
  const [hours, setHours] = useState(initialHours);
  const [responseGuarantee, setResponseGuarantee] = useState(initialResponseGuarantee);

  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  function triggerDirty() {
    setIsDirty(true);
    setSaveSuccess(false);
  }

  function handleSave() {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsDirty(false);
      setSaveSuccess(true);
      setNoticeMessage("Saved! Contact information and office channels updated successfully.");
      setTimeout(() => {
        setSaveSuccess(false);
        setNoticeMessage(null);
      }, 4500);
    }, 600);
  }

  return (
    <div className="space-y-6">
      {/* ─────────────────────────────────────────────────────────────
          1. Action Bar
          ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-card border border-border rounded-2xl shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/website"
            className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            My Website
          </Link>
          <span className="text-muted-foreground/60 text-xs">/</span>
          <span className="text-xs font-bold text-brand-forest">Contact &amp; Intake Info</span>

          {isDirty ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-100 text-amber-900 border border-amber-300">
              <span className="size-1.5 rounded-full bg-amber-600 animate-pulse" />
              Unsaved changes
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100 text-emerald-900 border border-emerald-300">
              <Check className="size-3 text-emerald-700" />
              Published &amp; Live
            </span>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <span>Live Contact Page</span>
            <ExternalLink className="size-3" />
          </a>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !isDirty}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#15190d] text-[#f6f2eb] text-xs font-semibold shadow-xs hover:bg-[#252b29] disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            {isSaving ? (
              <>
                <span className="size-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving…</span>
              </>
            ) : saveSuccess ? (
              <>
                <CheckCircle2 className="size-3.5 text-emerald-400" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="size-3.5 text-[#dfe0d4]" />
                <span>Save &amp; Publish</span>
              </>
            )}
          </button>
        </div>
      </div>

      {noticeMessage && (
        <div
          role="status"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium bg-brand-sage/40 text-brand-forest border border-brand-sage animate-in fade-in duration-200"
        >
          <Sparkles className="size-4 shrink-0 text-brand-forest" />
          <span>{noticeMessage}</span>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. Form Sections
          ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Cols: Form Fields */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-xs space-y-6">
          <div className="border-b border-border pb-3">
            <h2 className="text-lg font-bold text-foreground tracking-tight">
              Direct Contact &amp; Physical Office Details
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              These channels appear directly on the public /contact page, header telephone ticker, and footer.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-1.5">
                <Mail className="size-3.5 text-brand-forest" />
                <span>General Inquiries Email</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  triggerDirty();
                }}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-brand-forest/20 focus:border-brand-forest"
                placeholder="inquiries@alderline-env.com"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-1.5">
                <PhoneCall className="size-3.5 text-brand-forest" />
                <span>Main Scoping Hotline</span>
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  triggerDirty();
                }}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-brand-forest/20 focus:border-brand-forest"
                placeholder="+1 (555) 382-4190"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-1.5">
              <MapPin className="size-3.5 text-brand-forest" />
              <span>Headquarters Office Address</span>
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                triggerDirty();
              }}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-brand-forest/20 focus:border-brand-forest"
              placeholder="Suite number, street address, city, state, and ZIP"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-1.5">
                <Clock className="size-3.5 text-brand-forest" />
                <span>Intake &amp; Field Hours</span>
              </label>
              <input
                type="text"
                value={hours}
                onChange={(e) => {
                  setHours(e.target.value);
                  triggerDirty();
                }}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-brand-forest/20 focus:border-brand-forest"
                placeholder="e.g. Monday – Friday: 8:00 AM – 5:30 PM PST"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-1.5">
                <ShieldCheck className="size-3.5 text-brand-forest" />
                <span>Response Time Commitment</span>
              </label>
              <input
                type="text"
                value={responseGuarantee}
                onChange={(e) => {
                  setResponseGuarantee(e.target.value);
                  triggerDirty();
                }}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-brand-forest/20 focus:border-brand-forest"
                placeholder="e.g. Within 1 business day"
              />
            </div>
          </div>
        </div>

        {/* Right 1 Col: Live Preview Card */}
        <div className="rounded-2xl border border-border bg-[#f6f2eb] p-6 shadow-xs space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
            Public Website Preview
          </span>

          <div className="rounded-xl border border-[#cac7c1] bg-card p-5 space-y-4 shadow-xs">
            <h3 className="font-heading text-base font-bold text-[#15190d]">
              Alderline Headquarters
            </h3>

            <div className="space-y-3 text-xs text-[#81837d]">
              <div className="flex items-start gap-2.5">
                <MapPin className="size-4 shrink-0 text-brand-forest mt-0.5" />
                <span className="leading-snug">{address}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <PhoneCall className="size-4 shrink-0 text-brand-forest" />
                <span>{phone}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="size-4 shrink-0 text-brand-forest" />
                <span className="truncate">{email}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="size-4 shrink-0 text-brand-forest" />
                <span>{hours}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-border">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-brand-sage/40 text-brand-forest">
                <ShieldCheck className="size-3.5 text-brand-forest" />
                <span>{responseGuarantee}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
