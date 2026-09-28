"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Edit3, Check, Trash2, Search, ExternalLink } from "lucide-react";
import { MediaPickerModal } from "./MediaPickerModal";
import type { BlogPost } from "@/lib/blog-data";

export function VisualArticlesManager({
  initialArticles,
}: {
  initialArticles: BlogPost[];
}) {
  const [articles, setArticles] = useState<BlogPost[]>(initialArticles);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingItem, setEditingItem] = useState<BlogPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const categories: Array<"All" | BlogPost["category"]> = [
    "All",
    "Permitting",
    "Wetlands",
    "Restoration",
    "Site Assessment",
    "Water Resources",
  ];

  const [form, setForm] = useState<BlogPost>({
    slug: "",
    title: "",
    date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    category: "Permitting",
    readTime: "5 min read",
    image: "/assets/alderline/articles/article-hero-1.jpg",
    bannerImage: "/assets/alderline/articles/article-hero-1.jpg",
    summary: "",
    paragraphs: [],
    sections: [],
  });

  const filteredArticles = articles.filter((art) => {
    const matchesCategory = selectedCategory === "All" || art.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  function openCreateModal() {
    const defaultSlug = `article-${Date.now()}`;
    const defaultCat: BlogPost["category"] =
      selectedCategory === "All" ? "Permitting" : (selectedCategory as BlogPost["category"]);
    setForm({
      slug: defaultSlug,
      title: "",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      category: defaultCat,
      readTime: "5 min read",
      image: "/assets/alderline/articles/article-hero-1.jpg",
      bannerImage: "/assets/alderline/articles/article-hero-1.jpg",
      summary: "",
      paragraphs: [],
      sections: [],
    });
    setEditingItem(null);
    setIsModalOpen(true);
  }

  function openEditModal(item: BlogPost) {
    setForm({ ...item });
    setEditingItem(item);
    setIsModalOpen(true);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.slug.trim()) return;

    if (editingItem) {
      setArticles((prev) => prev.map((a) => (a.slug === editingItem.slug ? { ...form } : a)));
      setSavedNotice(`Updated article: "${form.title}"`);
    } else {
      setArticles((prev) => [form, ...prev]);
      setSavedNotice(`Created article: "${form.title}"`);
    }

    setIsModalOpen(false);
    setTimeout(() => setSavedNotice(null), 4000);
  }

  function handleDelete(slug: string) {
    setArticles((prev) => prev.filter((a) => a.slug !== slug));
    setIsModalOpen(false);
  }

  return (
    <div className="space-y-6">
      {/* Search & Category Filter Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-[#15190d] !text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles…"
              className="rounded-lg border border-border bg-background pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#15190d] px-3.5 py-1.5 text-xs font-semibold !text-white shadow-xs hover:bg-[#252B29] transition-colors"
          >
            <Plus className="size-3.5" />
            <span>Create Article</span>
          </button>
        </div>
      </div>

      {savedNotice ? (
        <div className="flex items-center gap-2 rounded-lg bg-brand-sage/40 border border-brand-sage/60 px-4 py-3 text-sm text-brand-forest">
          <Check className="size-4 shrink-0 text-brand-forest" />
          <span>{savedNotice} (changes active in this session)</span>
        </div>
      ) : null}

      {/* Visual Article Cards Grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredArticles.map((article) => (
          <div
            key={article.slug}
            className="group flex flex-col justify-between rounded-xl border border-border bg-card overflow-hidden shadow-xs transition-all hover:shadow-md"
          >
            <div>
              {/* Cover Image */}
              <div className="relative h-44 w-full bg-muted overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-102 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span className="rounded-md bg-[#15190d]/80 backdrop-blur-xs px-2.5 py-1 text-[11px] font-medium text-[#f6f2eb]">
                    {article.category}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="rounded-md bg-white/90 backdrop-blur-xs px-2 py-0.5 text-[10px] font-medium text-foreground">
                    {article.readTime}
                  </span>
                </div>
              </div>

              {/* Content info */}
              <div className="p-5">
                <p className="text-[11px] text-muted-foreground">{article.date}</p>
                <h3 className="font-heading text-sm font-semibold text-foreground mt-1 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-2 line-clamp-3 leading-relaxed">
                  {article.summary}
                </p>
                <div className="mt-3">
                  <code className="text-[10px] text-muted-foreground/70 font-mono">
                    /blog/{article.slug}
                  </code>
                </div>
              </div>
            </div>

            <div className="border-t border-border/60 bg-muted/20 px-5 py-3 flex items-center justify-between">
              <Link
                href={`/blog/${article.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand-forest hover:underline"
              >
                <span>Read Public</span>
                <ExternalLink className="size-3" />
              </Link>

              <button
                type="button"
                onClick={() => openEditModal(article)}
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
                {editingItem ? `Edit Article: ${editingItem.title}` : "Create New Article"}
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
                <label className="block font-medium text-foreground mb-1">Article Headline *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs"
                  placeholder="e.g. Navigating WOTUS Jurisdictional Determinations in Coastal Basins"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block font-medium text-foreground mb-1">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs font-mono"
                    placeholder="wotus-jurisdictional-determinations"
                  />
                </div>
                <div>
                  <label className="block font-medium text-foreground mb-1">Topic Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        category: e.target.value as BlogPost["category"],
                      })
                    }
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs"
                  >
                    <option value="Permitting">Permitting</option>
                    <option value="Wetlands">Wetlands</option>
                    <option value="Restoration">Restoration</option>
                    <option value="Site Assessment">Site Assessment</option>
                    <option value="Water Resources">Water Resources</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">Estimated Read Time</label>
                <input
                  type="text"
                  value={form.readTime}
                  onChange={(e) => setForm({ ...form, readTime: e.target.value })}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs"
                  placeholder="e.g. 5 min read"
                />
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">Executive Summary *</label>
                <textarea
                  rows={3}
                  required
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs"
                  placeholder="A concise synopsis of the article for cards and search snippets..."
                />
              </div>

              {/* Cover Image Picker */}
              <div>
                <label className="block font-medium text-foreground mb-1">Cover Image</label>
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-20 overflow-hidden rounded-md border border-border bg-muted shrink-0">
                    <Image
                      src={form.image || "/assets/alderline/articles/article-hero-1.jpg"}
                      alt="Cover"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <input
                    type="text"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
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

              <div className="flex items-center justify-between border-t border-border pt-4">
                {editingItem ? (
                  <button
                    type="button"
                    onClick={() => handleDelete(form.slug)}
                    className="inline-flex items-center gap-1 text-destructive hover:underline text-xs"
                  >
                    <Trash2 className="size-3.5" />
                    Delete Article
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
                    Save Article
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
          setForm((prev) => ({
            ...prev,
            image: media.url,
            bannerImage: media.url,
          }));
          setIsMediaPickerOpen(false);
        }}
        currentUrl={form.image}
      />
    </div>
  );
}
