"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Check, Image as ImageIcon, Search, Upload, Video, X } from "lucide-react";
import { ALDERLINE_MEDIA_REGISTRY, type RegisteredMediaItem } from "@/lib/data/media-registry";

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (media: { url: string; alt: string; title: string }) => void;
  currentUrl?: string;
  categoryFilter?: RegisteredMediaItem["category"];
  title?: string;
}

export function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  currentUrl,
  categoryFilter,
  title = "Choose Photo or Video",
}: MediaPickerModalProps) {
  const [activeTab, setActiveTab] = useState<"library" | "upload">("library");
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryFilter || "all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<RegisteredMediaItem | null>(() => {
    return ALDERLINE_MEDIA_REGISTRY.find((m) => m.public_url === currentUrl) || null;
  });

  if (!isOpen) return null;

  const filteredMedia = ALDERLINE_MEDIA_REGISTRY.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" ||
      (selectedCategory === "photos" && item.mime_type.startsWith("image/")) ||
      (selectedCategory === "videos" && item.category === "video") ||
      item.category === selectedCategory;

    const matchesSearch =
      searchQuery === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.alt_text.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  function handleConfirm() {
    if (selectedItem) {
      onSelect({
        url: selectedItem.public_url,
        alt: selectedItem.alt_text,
        title: selectedItem.title,
      });
      onClose();
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#15190d]/60 backdrop-blur-xs"
    >
      <div className="relative w-full max-w-4xl max-h-[88vh] bg-background border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/20">
          <div>
            <h2 className="text-lg font-semibold text-foreground tracking-tight">{title}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Select an existing high-resolution asset from your site library or upload a new one.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Close dialog"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Tab Selection & Search Bar */}
        <div className="px-6 py-3 border-b border-border flex flex-wrap items-center justify-between gap-3 bg-background">
          <div className="flex items-center gap-1.5 p-1 bg-muted rounded-lg text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("library")}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeTab === "library"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Browse Library ({ALDERLINE_MEDIA_REGISTRY.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("upload")}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeTab === "upload"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Upload New
            </button>
          </div>

          {activeTab === "library" && (
            <div className="flex items-center gap-2 flex-1 max-w-sm ml-auto">
              <div className="relative w-full">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search assets by title or keyword…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-muted/40 border border-border rounded-lg text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-brand-forest"
                />
              </div>
            </div>
          )}
        </div>

        {/* Filter Badges */}
        {activeTab === "library" && (
          <div className="px-6 py-2 border-b border-border/50 flex items-center gap-1.5 overflow-x-auto text-[11px] bg-muted/10">
            {[
              { id: "all", label: "All Assets" },
              { id: "photos", label: "Photos" },
              { id: "team", label: "Team Portraits" },
              { id: "hero", label: "Hero Landscapes" },
              { id: "services", label: "Practice Areas" },
              { id: "videos", label: "Videos" },
              { id: "brand", label: "Brand Marks" },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? "bg-brand-sage/50 text-brand-forest font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "library" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredMedia.map((item) => {
                const isSelected = selectedItem?.id === item.id;
                const isCurrent = currentUrl === item.public_url;
                const isVideo = item.category === "video";

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`group relative flex flex-col rounded-xl border cursor-pointer transition-all overflow-hidden ${
                      isSelected
                        ? "border-brand-forest ring-2 ring-brand-forest/20 shadow-md bg-muted/30"
                        : "border-border hover:border-foreground/30 bg-card hover:shadow-xs"
                    }`}
                  >
                    {/* Media Thumbnail */}
                    <div className="relative aspect-4/3 w-full bg-muted/40 overflow-hidden">
                      {isVideo ? (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-brand-forest/90 text-white p-3 text-center">
                          <Video className="size-8 mb-2 opacity-80" />
                          <span className="text-[10px] font-mono uppercase tracking-wider">Looping Video</span>
                        </div>
                      ) : (
                        <Image
                          src={item.public_url}
                          alt={item.alt_text}
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}

                      {/* Selection Badge */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 size-6 rounded-full bg-brand-forest text-white flex items-center justify-center shadow-md">
                          <Check className="size-3.5 stroke-[3]" />
                        </div>
                      )}

                      {/* In Use Tag */}
                      {isCurrent && (
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider rounded bg-[#15190d]/80 text-[#f6f2eb] backdrop-blur-xs">
                          Current
                        </span>
                      )}
                    </div>

                    {/* Metadata Footer */}
                    <div className="p-2.5">
                      <p className="text-xs font-medium text-foreground truncate" title={item.title}>
                        {item.title}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-1">
                        <span className="truncate">{item.dimensions || "Image"}</span>
                        <span className="uppercase text-[9px] tracking-wider font-mono">{item.category}</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredMedia.length === 0 && (
                <div className="col-span-full py-12 text-center text-muted-foreground text-sm">
                  No assets found matching &ldquo;{searchQuery}&rdquo;.
                </div>
              )}
            </div>
          ) : (
            /* Upload New Tab */
            <div className="max-w-md mx-auto py-8 text-center space-y-4">
              <div className="border-2 border-dashed border-border rounded-2xl p-10 bg-muted/10 hover:bg-muted/20 transition-colors">
                <Upload className="size-10 text-muted-foreground/60 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-foreground">Upload from your computer</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                  Drag and drop a JPG, PNG, or WebP photo up to 5MB.
                </p>
                <label className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-brand-forest text-xs font-semibold text-white cursor-pointer hover:bg-[#252B29] transition-colors">
                  <ImageIcon className="size-3.5" />
                  Select File
                  <input type="file" accept="image/*" className="hidden" />
                </label>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Tip: High-resolution landscape photos (1600 × 900) work best for banners and case studies.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-border bg-muted/20">
          <div className="text-xs text-muted-foreground">
            {selectedItem ? (
              <span className="flex items-center gap-1.5">
                <span className="font-medium text-foreground">Selected:</span>
                <span className="truncate max-w-xs">{selectedItem.title}</span>
              </span>
            ) : (
              "Click a thumbnail above to choose it."
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!selectedItem}
              onClick={handleConfirm}
              className="px-5 py-2.5 rounded-xl bg-[#15190d] text-[#f6f2eb] text-xs font-semibold shadow-xs hover:bg-[#252b29] disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              Apply Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
