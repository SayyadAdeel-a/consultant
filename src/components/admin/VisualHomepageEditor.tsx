"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Check,
  CheckCircle2,
  ExternalLink,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Layers,
  Monitor,
  RotateCcw,
  Save,
  Smartphone,
  Sparkles,
  Table as TableIcon,
  Video,
} from "lucide-react";
import { toggleSectionVisibility, updateHomepageSection } from "@/app/actions/content";
import { MediaPickerModal } from "./MediaPickerModal";
import type { HomepageSectionRecord } from "@/types/cms";

// Section descriptive metadata for nontechnical business owners
const SECTION_METADATA: Record<
  string,
  {
    friendlyName: string;
    description: string;
    defaultMedia: string;
    mediaType: "image" | "video";
    mediaLabel: string;
  }
> = {
  hero: {
    friendlyName: "Hero & Headline Banner",
    description: "The very first impression visitors see. Displays your main headline, subtitle, and looping ambient coastal video.",
    defaultMedia: "/assets/alderline/hero/hero-poster.jpg",
    mediaType: "video",
    mediaLabel: "Hero Ambient Coastal Video",
  },
  credibility: {
    friendlyName: "Credibility & Track Record",
    description: "Demonstrates regulatory concurrence and completed reviews to establish confidence immediately.",
    defaultMedia: "/assets/alderline/about/gallery-2.jpg",
    mediaType: "image",
    mediaLabel: "Field Documentation Image",
  },
  services: {
    friendlyName: "Core Practice Areas",
    description: "Highlights your four primary consulting disciplines: wetlands, permitting, assessment, and restoration.",
    defaultMedia: "/assets/alderline/services/coastal-resilience.jpg",
    mediaType: "image",
    mediaLabel: "Practice Areas Feature Image",
  },
  industries: {
    friendlyName: "Client Sectors",
    description: "Displays the key sectors you serve: clean infrastructure, renewable energy, and coastal resilience.",
    defaultMedia: "/assets/alderline/brand/sector-mark-1.jpg",
    mediaType: "image",
    mediaLabel: "Sector Mark Emblem",
  },
  projects: {
    friendlyName: "Featured Case Study",
    description: "Spotlights a flagship project outcome, such as the Casco Bay coastal wetland restoration.",
    defaultMedia: "/assets/alderline/services/coastal-resilience.jpg",
    mediaType: "image",
    mediaLabel: "Case Study Photography",
  },
  approach: {
    friendlyName: "Phased Methodology",
    description: "Explains your defensible scientific workflow from records review to post-construction monitoring.",
    defaultMedia: "/assets/alderline/about/gallery-3.jpg",
    mediaType: "image",
    mediaLabel: "Field Inspection Photography",
  },
  team: {
    friendlyName: "Scientists & Leadership",
    description: "Introduces certified consultants, hydrologists, and PE leadership to build personal credibility.",
    defaultMedia: "/assets/alderline/team/member-1.jpg",
    mediaType: "image",
    mediaLabel: "Leadership Team Photo",
  },
  faq: {
    friendlyName: "Frequently Asked Questions",
    description: "Answers common technical, regulatory, and engagement questions before clients schedule a call.",
    defaultMedia: "/assets/alderline/about/gallery-4.jpg",
    mediaType: "image",
    mediaLabel: "Accordion Supporting Photo",
  },
  cta: {
    friendlyName: "Closing Consultation Call to Action",
    description: "The final prompt inviting site owners to request a confidential scoping consultation.",
    defaultMedia: "/assets/alderline/about/introduction.jpg",
    mediaType: "image",
    mediaLabel: "Consultation Scoping Photo",
  },
};

interface VisualHomepageEditorProps {
  initialSections: HomepageSectionRecord[];
}

export function VisualHomepageEditor({ initialSections }: VisualHomepageEditorProps) {
  const [sections, setSections] = useState<HomepageSectionRecord[]>(initialSections);
  const [selectedKey, setSelectedKey] = useState<string>("hero");
  const [activeDevice, setActiveDevice] = useState<"desktop" | "mobile">("desktop");
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [sectionMedia, setSectionMedia] = useState<Record<string, string>>({
    hero: "/assets/alderline/hero/hero-poster.jpg",
    credibility: "/assets/alderline/about/gallery-2.jpg",
    services: "/assets/alderline/services/coastal-resilience.jpg",
    industries: "/assets/alderline/brand/sector-mark-1.jpg",
    projects: "/assets/alderline/services/coastal-resilience.jpg",
    approach: "/assets/alderline/about/gallery-3.jpg",
    team: "/assets/alderline/team/member-1.jpg",
    faq: "/assets/alderline/about/gallery-4.jpg",
    cta: "/assets/alderline/about/introduction.jpg",
  });

  const [dirtyMap, setDirtyMap] = useState<Record<string, boolean>>({});
  const [saveSuccessMap, setSaveSuccessMap] = useState<Record<string, boolean>>({});
  const [isPending, startTransition] = useTransition();
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Active section currently in the editing panel
  const activeSection = sections.find((s) => s.section_key === selectedKey) || sections[0];
  const activeMeta = SECTION_METADATA[selectedKey] || {
    friendlyName: activeSection?.title || "Section",
    description: "Edit headline text and visual display for this section.",
    defaultMedia: "/assets/alderline/hero/hero-poster.jpg",
    mediaType: "image",
    mediaLabel: "Section Image",
  };

  const isCurrentSectionDirty = dirtyMap[activeSection?.id || ""] || false;
  const anyDirty = Object.values(dirtyMap).some(Boolean);

  // Update a field in the section in real-time
  function handleFieldChange(field: "title" | "subtitle", value: string) {
    if (!activeSection) return;
    setSections((prev) =>
      prev.map((s) => (s.id === activeSection.id ? { ...s, [field]: value } : s))
    );
    setDirtyMap((prev) => ({ ...prev, [activeSection.id]: true }));
    setSaveSuccessMap((prev) => ({ ...prev, [activeSection.id]: false }));
  }

  // Toggle section visibility
  function handleVisibilityToggle() {
    if (!activeSection) return;
    const nextVisibility = !activeSection.is_visible;
    setSections((prev) =>
      prev.map((s) => (s.id === activeSection.id ? { ...s, is_visible: nextVisibility } : s))
    );

    startTransition(async () => {
      try {
        const res = await toggleSectionVisibility(activeSection.id, nextVisibility);
        if (!res.ok) {
          setActionMessage(res.message);
        } else {
          setActionMessage(
            nextVisibility
              ? `"${activeMeta.friendlyName}" is now shown on the live website.`
              : `"${activeMeta.friendlyName}" is now hidden from the live website.`
          );
          setTimeout(() => setActionMessage(null), 4000);
        }
      } catch {
        setActionMessage("Could not update visibility. Please check your admin session.");
      }
    });
  }

  // Save changes to backend
  function handleSaveSection() {
    if (!activeSection) return;

    startTransition(async () => {
      setActionMessage(null);
      try {
        const res = await updateHomepageSection({
          id: activeSection.id,
          title: activeSection.title,
          subtitle: activeSection.subtitle,
          display_order: activeSection.display_order,
        });

        if (res.ok) {
          setDirtyMap((prev) => ({ ...prev, [activeSection.id]: false }));
          setSaveSuccessMap((prev) => ({ ...prev, [activeSection.id]: true }));
          setActionMessage(`Saved! Changes to "${activeMeta.friendlyName}" are now live.`);
          setTimeout(() => {
            setSaveSuccessMap((prev) => ({ ...prev, [activeSection.id]: false }));
            setActionMessage(null);
          }, 4500);
        } else {
          setActionMessage(res.message);
        }
      } catch {
        setActionMessage("Save failed. Please try again.");
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* ─────────────────────────────────────────────────────────────
          1. Top Workflow Action Bar
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
          <span className="text-xs font-bold text-brand-forest">Homepage</span>

          {/* Save Status Badge */}
          {anyDirty ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-100 text-amber-900 border border-amber-300">
              <span className="size-1.5 rounded-full bg-amber-600 animate-pulse" />
              Unsaved changes
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-100 text-emerald-900 border border-emerald-300">
              <Check className="size-3 text-emerald-700" />
              Published & Live
            </span>
          )}
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2.5">
          {/* Device Preview Toggle */}
          <div className="hidden sm:flex items-center gap-1 bg-muted p-1 rounded-lg text-xs">
            <button
              type="button"
              onClick={() => setActiveDevice("desktop")}
              className={`p-1.5 rounded-md transition-colors ${
                activeDevice === "desktop"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Desktop Preview"
            >
              <Monitor className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setActiveDevice("mobile")}
              className={`p-1.5 rounded-md transition-colors ${
                activeDevice === "mobile"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Mobile Preview"
            >
              <Smartphone className="size-4" />
            </button>
          </div>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <span>Live Website</span>
            <ExternalLink className="size-3" />
          </a>

          <button
            type="button"
            onClick={handleSaveSection}
            disabled={isPending || !isCurrentSectionDirty}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#15190d] text-[#f6f2eb] text-xs font-semibold shadow-xs hover:bg-[#252b29] disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            {isPending ? (
              <>
                <span className="size-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Publishing…</span>
              </>
            ) : saveSuccessMap[activeSection?.id || ""] ? (
              <>
                <CheckCircle2 className="size-3.5 text-emerald-400" />
                <span>Published!</span>
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

      {/* Action Notification Alert */}
      {actionMessage && (
        <div
          role="status"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium bg-brand-sage/40 text-brand-forest border border-brand-sage animate-in fade-in duration-200"
        >
          <Sparkles className="size-4 shrink-0 text-brand-forest" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. Split Desktop Layout: Live Preview (Left) + Editing Panel (Right)
          ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── LEFT: Visual Interactive Website Preview (7 cols) ── */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between px-1 text-xs text-muted-foreground">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-[#81837d]">
              Live Visual Preview (Click any section to edit)
            </span>
            <span>{sections.length} sections configured</span>
          </div>

          <div
            className={`mx-auto transition-all duration-300 ${
              activeDevice === "mobile"
                ? "max-w-sm rounded-3xl border-4 border-[#15190d] shadow-2xl p-2 bg-[#f6f2eb]"
                : "w-full"
            }`}
          >
            <div className="space-y-6 overflow-hidden rounded-2xl border border-border bg-[#f6f2eb] p-4 sm:p-6 shadow-xs">
              {sections.map((sec) => {
                const isSelected = sec.section_key === selectedKey;
                const meta = SECTION_METADATA[sec.section_key] || {
                  friendlyName: sec.title,
                  defaultMedia: "/assets/alderline/hero/hero-poster.jpg",
                };
                const currentMedia = sectionMedia[sec.section_key] || meta.defaultMedia;

                return (
                  <div
                    key={sec.id}
                    onClick={() => setSelectedKey(sec.section_key)}
                    className={`group relative rounded-xl border p-5 cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? "border-brand-forest ring-2 ring-brand-forest/30 bg-background shadow-md"
                        : "border-[#cac7c1]/60 hover:border-brand-forest/60 bg-[#f6f2eb] hover:bg-background/80"
                    } ${!sec.is_visible ? "opacity-45" : ""}`}
                  >
                    {/* Section Header Strip */}
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`size-2.5 rounded-full ${
                            isSelected
                              ? "bg-brand-forest"
                              : sec.is_visible
                              ? "bg-emerald-500"
                              : "bg-muted-foreground/40"
                          }`}
                        />
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#15190d]">
                          {meta.friendlyName}
                        </span>
                        {isSelected && (
                          <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded-full bg-brand-sage/50 text-brand-forest">
                            Active
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {!sec.is_visible && (
                          <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
                            <EyeOff className="size-3" /> Hidden on website
                          </span>
                        )}
                        <span className="text-[11px] text-muted-foreground/70 font-mono">
                          0{sec.display_order}
                        </span>
                      </div>
                    </div>

                    {/* Section Mock Presentation */}
                    <div className="space-y-3">
                      <h3 className="text-lg md:text-xl font-semibold text-[#15190d] leading-snug tracking-tight">
                        {sec.title}
                      </h3>

                      {sec.subtitle && (
                        <p className="text-xs md:text-sm text-[#81837d] leading-relaxed">
                          {sec.subtitle}
                        </p>
                      )}

                      {/* Visual Media Strip */}
                      <div className="relative aspect-16/7 w-full overflow-hidden rounded-lg border border-[#cac7c1]/50 bg-[#dfe0d4]/30 mt-3">
                        <Image
                          src={currentMedia}
                          alt={sec.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#15190d]/60 via-transparent to-transparent flex items-end p-3">
                          <span className="text-[11px] font-medium text-white/90 truncate">
                            {meta.friendlyName}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Hover Hint */}
                    <div className="mt-3 pt-2 border-t border-[#cac7c1]/40 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>Click anywhere to edit content</span>
                      <span className="font-semibold text-brand-forest group-hover:underline">
                        Edit &rarr;
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Focused Plain-English Editing Panel (5 cols) ── */}
        <div className="lg:col-span-5 sticky top-20 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
            {/* Panel Header */}
            <div className="border-b border-border pb-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-eyebrow text-muted-foreground">Edit Section</span>
                <button
                  type="button"
                  onClick={handleVisibilityToggle}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    activeSection?.is_visible
                      ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {activeSection?.is_visible ? (
                    <>
                      <Eye className="size-3.5" />
                      <span>Shown on website</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="size-3.5" />
                      <span>Hidden from website</span>
                    </>
                  )}
                </button>
              </div>

              <h2 className="text-xl font-bold text-foreground mt-2 tracking-tight">
                {activeMeta.friendlyName}
              </h2>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {activeMeta.description}
              </p>
            </div>

            {/* Quick Section Jump Navigator */}
            <div>
              <label className="block text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-2">
                Jump to another section
              </label>
              <select
                value={selectedKey}
                onChange={(e) => setSelectedKey(e.target.value)}
                className="w-full text-xs bg-muted/30 border border-border rounded-lg px-3 py-2 text-foreground font-medium focus:outline-none focus:ring-1 focus:ring-brand-forest"
              >
                {sections.map((s) => (
                  <option key={s.id} value={s.section_key}>
                    0{s.display_order} — {SECTION_METADATA[s.section_key]?.friendlyName || s.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Editable Fields Form */}
            <div className="space-y-4">
              {/* Field 1: Headline */}
              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-1.5">
                  Main Headline / Title
                </label>
                <input
                  type="text"
                  value={activeSection?.title || ""}
                  onChange={(e) => handleFieldChange("title", e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-brand-forest/20 focus:border-brand-forest transition-all"
                  placeholder="Enter section headline…"
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  Changes appear immediately in the visual preview on the left.
                </p>
              </div>

              {/* Field 2: Subtitle / Paragraph */}
              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-1.5">
                  Supporting Text / Subtitle
                </label>
                <textarea
                  rows={3}
                  value={activeSection?.subtitle || ""}
                  onChange={(e) => handleFieldChange("subtitle", e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-forest/20 focus:border-brand-forest transition-all"
                  placeholder="Enter supporting explanation or details…"
                />
              </div>

              {/* Field 3: Section Imagery / Video Media Preview */}
              <div className="pt-2 border-t border-border">
                <label className="block text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-2">
                  Section Photography / Media
                </label>
                <div className="flex items-center gap-4 p-3 rounded-xl border border-border bg-muted/20">
                  <div className="relative size-16 rounded-lg overflow-hidden border border-border bg-muted shrink-0">
                    <Image
                      src={sectionMedia[selectedKey] || activeMeta.defaultMedia}
                      alt={activeSection?.title || "Section media"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">
                      {activeMeta.mediaLabel}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                      {sectionMedia[selectedKey] || activeMeta.defaultMedia}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMediaPickerOpen(true)}
                    className="px-3 py-1.5 rounded-lg border border-border bg-background text-xs font-semibold text-brand-forest hover:bg-muted transition-colors shrink-0 shadow-xs"
                  >
                    Change Photo
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Save Action */}
            <div className="pt-4 border-t border-border flex items-center justify-between gap-3">
              <span className="text-[11px] text-muted-foreground">
                {isCurrentSectionDirty ? "● Unsaved changes" : "All changes saved"}
              </span>

              <button
                type="button"
                onClick={handleSaveSection}
                disabled={isPending || !isCurrentSectionDirty}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#15190d] text-[#f6f2eb] text-xs font-semibold shadow-xs hover:bg-[#252b29] disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                {isPending ? "Publishing…" : "Save & Publish"}
              </button>
            </div>
          </div>

          {/* Quick Help Callout */}
          <div className="rounded-xl border border-brand-sage bg-brand-sage/20 p-4 text-xs text-brand-forest leading-relaxed">
            <span className="font-semibold block mb-0.5">💡 How Visual Editing Works</span>
            Clicking any section on the left highlights it and loads its text here. Changes update live in the preview. Click &ldquo;Save &amp; Publish&rdquo; when you are ready to update the live public site.
          </div>
        </div>
      </div>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        currentUrl={sectionMedia[selectedKey]}
        onSelect={(media) => {
          setSectionMedia((prev) => ({ ...prev, [selectedKey]: media.url }));
          setDirtyMap((prev) => ({ ...prev, [activeSection?.id || ""]: true }));
          setActionMessage(`Updated image for "${activeMeta.friendlyName}". Click Save & Publish to apply.`);
        }}
        title={`Choose Media for ${activeMeta.friendlyName}`}
      />
    </div>
  );
}
