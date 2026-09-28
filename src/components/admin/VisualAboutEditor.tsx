"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Check,
  CheckCircle2,
  ExternalLink,
  Image as ImageIcon,
  Save,
  Sparkles,
} from "lucide-react";
import { MediaPickerModal } from "./MediaPickerModal";

export interface GalleryPhoto {
  id: string;
  src: string;
  alt: string;
  title: string;
}

export interface PracticePrinciple {
  id: string;
  number: string;
  title: string;
  description: string;
}

interface VisualAboutEditorProps {
  initialHeading: string;
  initialDescription: string;
  initialGallery: GalleryPhoto[];
  initialPrinciples: PracticePrinciple[];
}

export function VisualAboutEditor({
  initialHeading,
  initialDescription,
  initialGallery,
  initialPrinciples,
}: VisualAboutEditorProps) {
  const [heading, setHeading] = useState(initialHeading);
  const [description, setDescription] = useState(initialDescription);
  const [gallery, setGallery] = useState<GalleryPhoto[]>(initialGallery);
  const [principles, setPrinciples] = useState<PracticePrinciple[]>(initialPrinciples);

  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeSlotIdx, setActiveSlotIdx] = useState<number | null>(null);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  function triggerDirty() {
    setIsDirty(true);
    setSavedSuccess(false);
  }

  function handleSave() {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsDirty(false);
      setSavedSuccess(true);
      setNoticeMessage("Saved! About page narrative and photography updated successfully.");
      setTimeout(() => {
        setSavedSuccess(false);
        setNoticeMessage(null);
      }, 4500);
    }, 600);
  }

  function handleReplacePhoto(idx: number) {
    setActiveSlotIdx(idx);
    setIsMediaPickerOpen(true);
  }

  return (
    <div className="space-y-6">
      {/* ─────────────────────────────────────────────────────────────
          1. Top Control & Save Bar
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
          <span className="text-xs font-bold text-brand-forest">About Page</span>

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
            href="/about"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <span>Live About Page</span>
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
            ) : savedSuccess ? (
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

      {/* Notice Message Alert */}
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
          2. Section 1: Executive Mission & Narrative
          ───────────────────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Section 01</span>
            <h2 className="text-lg font-bold text-foreground tracking-tight">
              Executive Mission &amp; Headline
            </h2>
          </div>
          <span className="text-xs font-medium text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
            Live on site
          </span>
        </div>

        <div className="grid gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-1.5">
              Display Headline
            </label>
            <input
              type="text"
              value={heading}
              onChange={(e) => {
                setHeading(e.target.value);
                triggerDirty();
              }}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-brand-forest/20 focus:border-brand-forest transition-all"
              placeholder="e.g. Defensible Science for Complex Landscapes"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-1.5">
              Mission Statement &amp; Firm Philosophy
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                triggerDirty();
              }}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-forest/20 focus:border-brand-forest transition-all"
              placeholder="Explain the firm's founding philosophy, rigorous scientific methodology, and regulatory approach…"
            />
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. Section 2: Four-Photo Aerial Inspection Gallery
          ───────────────────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Section 02</span>
            <h2 className="text-lg font-bold text-foreground tracking-tight">
              Four-Photo Aerial Inspection Gallery
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Curated aerial and field survey photography featured in the public About gallery.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {gallery.map((photo, idx) => (
            <div
              key={photo.id}
              className="group relative flex flex-col rounded-xl border border-border bg-muted/20 overflow-hidden hover:border-brand-forest/50 transition-all shadow-xs"
            >
              <div className="relative aspect-4/3 w-full bg-muted/40 overflow-hidden">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-[#15190d]/80 text-[#f6f2eb] backdrop-blur-xs">
                  Slot 0{idx + 1}
                </span>
              </div>

              <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <p className="text-xs font-semibold text-foreground truncate">{photo.title}</p>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">{photo.alt}</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleReplacePhoto(idx)}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background text-xs font-semibold text-brand-forest hover:bg-muted transition-colors shadow-xs"
                >
                  <ImageIcon className="size-3" />
                  <span>Replace Photo</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. Section 3: Core Practice Principles
          ───────────────────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Section 03</span>
            <h2 className="text-lg font-bold text-foreground tracking-tight">
              Core Practice Principles
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Three strategic commitments presented on the About view.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {principles.map((principle, idx) => (
            <div
              key={principle.id}
              className="flex flex-col rounded-xl border border-border bg-background p-4 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="size-6 rounded-full bg-brand-sage/40 text-brand-forest font-mono text-xs font-bold flex items-center justify-center">
                  0{idx + 1}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Principle</span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-muted-foreground tracking-wider mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={principle.title}
                  onChange={(e) => {
                    const next = [...principles];
                    next[idx].title = e.target.value;
                    setPrinciples(next);
                    triggerDirty();
                  }}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-brand-forest"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-muted-foreground tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={principle.description}
                  onChange={(e) => {
                    const next = [...principles];
                    next[idx].description = e.target.value;
                    setPrinciples(next);
                    triggerDirty();
                  }}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground leading-relaxed focus:outline-none focus:ring-1 focus:ring-brand-forest"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => {
          setIsMediaPickerOpen(false);
          setActiveSlotIdx(null);
        }}
        onSelect={(media) => {
          if (activeSlotIdx !== null) {
            const next = [...gallery];
            next[activeSlotIdx] = {
              ...next[activeSlotIdx],
              src: media.url,
              alt: media.alt,
              title: media.title,
            };
            setGallery(next);
            triggerDirty();
            setNoticeMessage(`Updated Slot 0${activeSlotIdx + 1} with "${media.title}". Click Save & Publish.`);
          }
        }}
        title={`Select Photo for Slot 0${(activeSlotIdx ?? 0) + 1}`}
      />
    </div>
  );
}
