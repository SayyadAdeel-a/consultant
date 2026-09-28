"use client";

import { useState } from "react";
import Image from "next/image";
import { MessageSquareQuote, Plus, Star, Edit3, Eye, EyeOff, Check, Trash2 } from "lucide-react";
import { MediaPickerModal } from "./MediaPickerModal";

export interface TestimonialItem {
  id: string;
  client_name: string;
  position: string;
  organization: string;
  testimonial: string;
  rating: number;
  portrait_url: string;
  related_project: string;
  is_featured: boolean;
  is_published: boolean;
  display_order: number;
}

export function VisualTestimonialsManager({
  initialTestimonials,
}: {
  initialTestimonials: TestimonialItem[];
}) {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(initialTestimonials);
  const [editingItem, setEditingItem] = useState<TestimonialItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState<TestimonialItem>({
    id: "",
    client_name: "",
    position: "",
    organization: "",
    testimonial: "",
    rating: 5,
    portrait_url: "/assets/alderline/about/avatar-1.jpg",
    related_project: "",
    is_featured: false,
    is_published: true,
    display_order: 1,
  });

  function openCreateModal() {
    setForm({
      id: `test-${Date.now()}`,
      client_name: "",
      position: "",
      organization: "",
      testimonial: "",
      rating: 5,
      portrait_url: "/assets/alderline/about/avatar-1.jpg",
      related_project: "",
      is_featured: false,
      is_published: true,
      display_order: testimonials.length + 1,
    });
    setEditingItem(null);
    setIsModalOpen(true);
  }

  function openEditModal(item: TestimonialItem) {
    setForm({ ...item });
    setEditingItem(item);
    setIsModalOpen(true);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.client_name.trim() || !form.testimonial.trim()) return;

    if (editingItem) {
      setTestimonials((prev) =>
        prev.map((t) => (t.id === form.id ? { ...form } : t))
      );
      setSavedNotice(`Updated review from "${form.client_name}"`);
    } else {
      setTestimonials((prev) => [...prev, { ...form }]);
      setSavedNotice(`Added review from "${form.client_name}"`);
    }

    setIsModalOpen(false);
    setTimeout(() => setSavedNotice(null), 4000);
  }

  function togglePublish(id: string) {
    setTestimonials((prev) =>
      prev.map((t) => (t.id === id ? { ...t, is_published: !t.is_published } : t))
    );
  }

  function handleDelete(id: string) {
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
    setIsModalOpen(false);
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            {testimonials.length} client {testimonials.length === 1 ? "review" : "reviews"} displayed on the homepage and project pages
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-lg bg-[#15190d] px-4 py-2 text-xs font-semibold !text-white shadow-xs hover:bg-[#252B29] transition-colors"
        >
          <Plus className="size-3.5" />
          Add Client Review
        </button>
      </div>

      {savedNotice ? (
        <div className="flex items-center gap-2 rounded-lg bg-brand-sage/40 border border-brand-sage/60 px-4 py-3 text-sm text-brand-forest">
          <Check className="size-4 shrink-0 text-brand-forest" />
          <span>{savedNotice} (changes active in this session)</span>
        </div>
      ) : null}

      {/* Visual Cards Grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((item) => (
          <div
            key={item.id}
            className={`group relative flex flex-col justify-between rounded-xl border bg-card p-5 shadow-xs transition-all hover:shadow-md ${
              item.is_published ? "border-border" : "border-dashed border-border/80 opacity-75"
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="size-3.5 fill-current" />
                  ))}
                </div>
                <div className="flex items-center gap-1.5">
                  {item.is_featured ? (
                    <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                      Featured
                    </span>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => togglePublish(item.id)}
                    title={item.is_published ? "Click to unpublish" : "Click to publish"}
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium transition-colors ${
                      item.is_published
                        ? "bg-brand-sage/40 text-brand-forest hover:bg-brand-sage/60"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {item.is_published ? (
                      <>
                        <Eye className="size-3" />
                        <span>Published</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="size-3" />
                        <span>Draft</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="relative mt-4">
                <MessageSquareQuote className="absolute -top-2 -left-1 size-6 text-brand-forest/15" />
                <p className="relative pl-6 text-xs text-foreground/90 italic leading-relaxed">
                  &ldquo;{item.testimonial}&rdquo;
                </p>
              </div>

              {item.related_project ? (
                <div className="mt-3">
                  <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                    Project: {item.related_project}
                  </span>
                </div>
              ) : null}
            </div>

            <div className="mt-5 border-t border-border/60 pt-4 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative size-10 overflow-hidden rounded-full border border-border bg-muted shrink-0">
                  <Image
                    src={item.portrait_url || "/assets/alderline/about/avatar-1.jpg"}
                    alt={item.client_name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-foreground">
                    {item.client_name}
                  </p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {item.position}
                  </p>
                  <p className="truncate text-[10px] text-muted-foreground/80">
                    {item.organization}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => openEditModal(item)}
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
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="font-heading text-lg font-semibold text-foreground">
                {editingItem ? `Edit Review: ${editingItem.client_name}` : "Add Client Review"}
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
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block font-medium text-foreground mb-1">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={form.client_name}
                    onChange={(e) => setForm({ ...form, client_name: e.target.value })}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs"
                    placeholder="e.g. Arthur Pendelton"
                  />
                </div>
                <div>
                  <label className="block font-medium text-foreground mb-1">Organization *</label>
                  <input
                    type="text"
                    required
                    value={form.organization}
                    onChange={(e) => setForm({ ...form, organization: e.target.value })}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs"
                    placeholder="e.g. Regional Transit District"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block font-medium text-foreground mb-1">Position / Title</label>
                  <input
                    type="text"
                    value={form.position}
                    onChange={(e) => setForm({ ...form, position: e.target.value })}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs"
                    placeholder="e.g. VP of Infrastructure Planning"
                  />
                </div>
                <div>
                  <label className="block font-medium text-foreground mb-1">Star Rating (1–5)</label>
                  <select
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs"
                  >
                    <option value={5}>5 Stars (★★★★★)</option>
                    <option value={4}>4 Stars (★★★★☆)</option>
                    <option value={3}>3 Stars (★★★☆☆)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">Testimonial Quote *</label>
                <textarea
                  rows={4}
                  required
                  value={form.testimonial}
                  onChange={(e) => setForm({ ...form, testimonial: e.target.value })}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs"
                  placeholder="What did the client say about working with Alderline?"
                />
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">Related Project</label>
                <input
                  type="text"
                  value={form.related_project}
                  onChange={(e) => setForm({ ...form, related_project: e.target.value })}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs"
                  placeholder="e.g. Casco Bay Coastal Wetland Restoration"
                />
              </div>

              {/* Portrait Picker */}
              <div>
                <label className="block font-medium text-foreground mb-1">Client Portrait</label>
                <div className="flex items-center gap-3">
                  <div className="relative size-12 overflow-hidden rounded-full border border-border bg-muted shrink-0">
                    <Image
                      src={form.portrait_url || "/assets/alderline/about/avatar-1.jpg"}
                      alt="Portrait"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <input
                    type="text"
                    value={form.portrait_url}
                    onChange={(e) => setForm({ ...form, portrait_url: e.target.value })}
                    className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-xs"
                    placeholder="/assets/alderline/..."
                  />
                  <button
                    type="button"
                    onClick={() => setIsMediaPickerOpen(true)}
                    className="rounded-md border border-border bg-muted/60 px-3 py-2 text-xs font-medium text-foreground hover:bg-muted"
                  >
                    Browse Library
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-6 border-t border-border/60 pt-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_published}
                    onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                    className="size-4 accent-[#153E35]"
                  />
                  <span className="font-medium text-foreground">Show on website</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                    className="size-4 accent-[#153E35]"
                  />
                  <span className="font-medium text-foreground">Featured quote</span>
                </label>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-4">
                {editingItem ? (
                  <button
                    type="button"
                    onClick={() => handleDelete(form.id)}
                    className="inline-flex items-center gap-1 text-destructive hover:underline text-xs"
                  >
                    <Trash2 className="size-3.5" />
                    Delete Review
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
                    Save Review
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
          setForm((prev) => ({ ...prev, portrait_url: media.url }));
          setIsMediaPickerOpen(false);
        }}
        currentUrl={form.portrait_url}
      />
    </div>
  );
}
