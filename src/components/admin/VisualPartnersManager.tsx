"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Edit3, Eye, EyeOff, Check, Trash2, ExternalLink, Globe } from "lucide-react";
import { MediaPickerModal } from "./MediaPickerModal";

export interface PartnerItem {
  id: string;
  name: string;
  category: string;
  logo_url: string;
  website: string;
  display_order: number;
  is_published: boolean;
}

export function VisualPartnersManager({
  initialPartners,
}: {
  initialPartners: PartnerItem[];
}) {
  const [partners, setPartners] = useState<PartnerItem[]>(initialPartners);
  const [editingItem, setEditingItem] = useState<PartnerItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const [form, setForm] = useState<PartnerItem>({
    id: "",
    name: "",
    category: "",
    logo_url: "/assets/alderline/brand/sector-mark-1.jpg",
    website: "",
    display_order: 1,
    is_published: true,
  });

  function openCreateModal() {
    setForm({
      id: `partner-${Date.now()}`,
      name: "",
      category: "",
      logo_url: "/assets/alderline/brand/sector-mark-1.jpg",
      website: "",
      display_order: partners.length + 1,
      is_published: true,
    });
    setEditingItem(null);
    setIsModalOpen(true);
  }

  function openEditModal(item: PartnerItem) {
    setForm({ ...item });
    setEditingItem(item);
    setIsModalOpen(true);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;

    if (editingItem) {
      setPartners((prev) =>
        prev.map((p) => (p.id === form.id ? { ...form } : p))
      );
      setSavedNotice(`Updated logo for "${form.name}"`);
    } else {
      setPartners((prev) => [...prev, { ...form }]);
      setSavedNotice(`Added partner "${form.name}"`);
    }

    setIsModalOpen(false);
    setTimeout(() => setSavedNotice(null), 4000);
  }

  function togglePublish(id: string) {
    setPartners((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_published: !p.is_published } : p))
    );
  }

  function handleDelete(id: string) {
    setPartners((prev) => prev.filter((p) => p.id !== id));
    setIsModalOpen(false);
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            {partners.length} partner {partners.length === 1 ? "logo" : "logos"} displayed in the public marquee
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-lg bg-[#15190d] px-4 py-2 text-xs font-semibold !text-white shadow-xs hover:bg-[#252B29] transition-colors"
        >
          <Plus className="size-3.5" />
          Add Partner Logo
        </button>
      </div>

      {savedNotice ? (
        <div className="flex items-center gap-2 rounded-lg bg-brand-sage/40 border border-brand-sage/60 px-4 py-3 text-sm text-brand-forest">
          <Check className="size-4 shrink-0 text-brand-forest" />
          <span>{savedNotice} (changes active in this session)</span>
        </div>
      ) : null}

      {/* Visual Cards Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {partners.map((partner) => (
          <div
            key={partner.id}
            className={`group relative flex flex-col justify-between rounded-xl border bg-card p-5 shadow-xs transition-all hover:shadow-md ${
              partner.is_published ? "border-border" : "border-dashed border-border/80 opacity-75"
            }`}
          >
            <div>
              {/* Logo Tile */}
              <div className="relative mb-4 flex h-24 w-full items-center justify-center rounded-lg border border-border/80 bg-muted/40 p-4">
                <div className="relative h-14 w-32">
                  <Image
                    src={partner.logo_url || "/assets/alderline/brand/sector-mark-1.jpg"}
                    alt={partner.name}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-mono text-muted-foreground">
                  Order 0{partner.display_order}
                </span>
                <button
                  type="button"
                  onClick={() => togglePublish(partner.id)}
                  title={partner.is_published ? "Click to unpublish" : "Click to publish"}
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium transition-colors ${
                    partner.is_published
                      ? "bg-brand-sage/40 text-brand-forest hover:bg-brand-sage/60"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {partner.is_published ? (
                    <>
                      <Eye className="size-3" />
                      <span>Active</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="size-3" />
                      <span>Hidden</span>
                    </>
                  )}
                </button>
              </div>

              <h3 className="font-heading text-sm font-semibold text-foreground mt-2 line-clamp-1">
                {partner.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {partner.category}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
              {partner.website ? (
                <a
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-brand-forest hover:underline"
                >
                  <Globe className="size-3" />
                  <span>Website</span>
                  <ExternalLink className="size-2.5" />
                </a>
              ) : (
                <span className="text-[11px] text-muted-foreground/60">No link</span>
              )}

              <button
                type="button"
                onClick={() => openEditModal(partner)}
                className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted transition-colors shadow-2xs"
              >
                <Edit3 className="size-3" />
                <span>Edit</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Modal */}
      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="font-heading text-lg font-semibold text-foreground">
                {editingItem ? `Edit Partner: ${editingItem.name}` : "Add Partner Logo"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-foreground mb-1">Organization Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs"
                  placeholder="e.g. Cascadia Coastal Engineering Group"
                />
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">Sector Category *</label>
                <input
                  type="text"
                  required
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs"
                  placeholder="e.g. Marine Infrastructure & Coastal Defense"
                />
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">Website URL</label>
                <input
                  type="url"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs"
                  placeholder="https://example.com/partner"
                />
              </div>

              {/* Logo Picker */}
              <div>
                <label className="block font-medium text-foreground mb-1">Partner Logo Mark</label>
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-20 overflow-hidden rounded-md border border-border bg-muted/40 p-1 flex items-center justify-center shrink-0">
                    <Image
                      src={form.logo_url || "/assets/alderline/brand/sector-mark-1.jpg"}
                      alt="Logo preview"
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <input
                    type="text"
                    value={form.logo_url}
                    onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
                    className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-xs"
                    placeholder="/assets/alderline/brand/..."
                  />
                  <button
                    type="button"
                    onClick={() => setIsMediaPickerOpen(true)}
                    className="rounded-md border border-border bg-muted/60 px-3 py-2 text-xs font-medium text-foreground hover:bg-muted"
                  >
                    Library
                  </button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 border-t border-border/60 pt-3">
                <div>
                  <label className="block font-medium text-foreground mb-1">Display Order</label>
                  <input
                    type="number"
                    min={1}
                    value={form.display_order}
                    onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs"
                  />
                </div>
                <div className="flex items-center self-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.is_published}
                      onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                      className="size-4 accent-[#153E35]"
                    />
                    <span className="font-medium text-foreground">Show in marquee</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-4">
                {editingItem ? (
                  <button
                    type="button"
                    onClick={() => handleDelete(form.id)}
                    className="inline-flex items-center gap-1 text-destructive hover:underline text-xs"
                  >
                    <Trash2 className="size-3.5" />
                    Delete
                  </button>
                ) : <span />}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-[#15190d] px-4 py-1.5 text-xs font-semibold !text-white hover:bg-[#252B29]"
                  >
                    Save Partner
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={(media) => {
          setForm((prev) => ({ ...prev, logo_url: media.url }));
          setIsMediaPickerOpen(false);
        }}
        currentUrl={form.logo_url}
      />
    </div>
  );
}
