"use client";

import { useState } from "react";
import { Plus, Edit3, Eye, EyeOff, Check, Trash2, ChevronDown, ChevronUp, Search } from "lucide-react";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  is_published: boolean;
}

export function VisualFaqsManager({
  initialFaqs,
}: {
  initialFaqs: FaqItem[];
}) {
  const [faqs, setFaqs] = useState<FaqItem[]>(initialFaqs);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(initialFaqs.slice(0, 2).map((f) => f.id)));
  const [editingItem, setEditingItem] = useState<FaqItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const categories = ["All", "Field Science", "Permitting", "Engagement"];

  const [form, setForm] = useState<FaqItem>({
    id: "",
    question: "",
    answer: "",
    category: "Field Science",
    order: 1,
    is_published: true,
  });

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function openCreateModal() {
    setForm({
      id: `faq-${Date.now()}`,
      question: "",
      answer: "",
      category: selectedCategory === "All" ? "Field Science" : selectedCategory,
      order: faqs.length + 1,
      is_published: true,
    });
    setEditingItem(null);
    setIsModalOpen(true);
  }

  function openEditModal(item: FaqItem) {
    setForm({ ...item });
    setEditingItem(item);
    setIsModalOpen(true);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.question.trim() || !form.answer.trim()) return;

    if (editingItem) {
      setFaqs((prev) => prev.map((f) => (f.id === form.id ? { ...form } : f)));
      setSavedNotice(`Updated question: "${form.question.slice(0, 35)}…"`);
    } else {
      setFaqs((prev) => [...prev, { ...form }]);
      setSavedNotice(`Added question: "${form.question.slice(0, 35)}…"`);
    }

    setIsModalOpen(false);
    setTimeout(() => setSavedNotice(null), 4000);
  }

  function togglePublish(id: string) {
    setFaqs((prev) =>
      prev.map((f) => (f.id === id ? { ...f, is_published: !f.is_published } : f))
    );
  }

  function handleDelete(id: string) {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
    setIsModalOpen(false);
  }

  return (
    <div className="space-y-6">
      {/* Action / Search / Filter Header */}
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
              placeholder="Search questions…"
              className="rounded-lg border border-border bg-background pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#15190d] px-3.5 py-1.5 text-xs font-semibold !text-white shadow-xs hover:bg-[#252B29] transition-colors"
          >
            <Plus className="size-3.5" />
            <span>Add Question</span>
          </button>
        </div>
      </div>

      {savedNotice ? (
        <div className="flex items-center gap-2 rounded-lg bg-brand-sage/40 border border-brand-sage/60 px-4 py-3 text-sm text-brand-forest">
          <Check className="size-4 shrink-0 text-brand-forest" />
          <span>{savedNotice} (saved in this session)</span>
        </div>
      ) : null}

      {/* Accordion FAQ Cards List */}
      <div className="space-y-3">
        {filteredFaqs.map((faq) => {
          const isExpanded = expandedIds.has(faq.id);
          return (
            <div
              key={faq.id}
              className={`rounded-xl border bg-card transition-all shadow-xs ${
                faq.is_published ? "border-border" : "border-dashed border-border/80 opacity-75"
              }`}
            >
              <div className="flex items-center justify-between gap-3 p-4">
                <button
                  type="button"
                  onClick={() => toggleExpand(faq.id)}
                  className="flex flex-1 items-center gap-3 text-left"
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-mono text-muted-foreground">
                    0{faq.order}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-heading text-sm font-semibold text-foreground">
                      {faq.question}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-foreground">
                        {faq.category}
                      </span>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="size-4 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronDown className="size-4 text-muted-foreground shrink-0" />
                  )}
                </button>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => togglePublish(faq.id)}
                    title={faq.is_published ? "Click to unpublish" : "Click to publish"}
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium transition-colors ${
                      faq.is_published
                        ? "bg-brand-sage/40 text-brand-forest hover:bg-brand-sage/60"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {faq.is_published ? (
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

                  <button
                    type="button"
                    onClick={() => openEditModal(faq)}
                    className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted transition-colors shadow-2xs"
                  >
                    <Edit3 className="size-3" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>

              {isExpanded ? (
                <div className="border-t border-border/60 bg-muted/20 px-5 py-4 text-xs text-muted-foreground leading-relaxed">
                  <p>{faq.answer}</p>
                </div>
              ) : null}
            </div>
          );
        })}

        {filteredFaqs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-xs text-muted-foreground">
            No questions found matching your filter.
          </div>
        ) : null}
      </div>

      {/* Edit / Add Modal */}
      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="font-heading text-lg font-semibold text-foreground">
                {editingItem ? "Edit Question" : "Add Frequently Asked Question"}
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
                <label className="block font-medium text-foreground mb-1">Question *</label>
                <input
                  type="text"
                  required
                  value={form.question}
                  onChange={(e) => setForm({ ...form, question: e.target.value })}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs"
                  placeholder="e.g. What is the typical timeframe for a USACE Section 404 permit?"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block font-medium text-foreground mb-1">Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs"
                  >
                    <option value="Field Science">Field Science</option>
                    <option value="Permitting">Permitting</option>
                    <option value="Engagement">Engagement</option>
                    <option value="General">General</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-foreground mb-1">Display Order</label>
                  <input
                    type="number"
                    min={1}
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">Detailed Answer *</label>
                <textarea
                  rows={5}
                  required
                  value={form.answer}
                  onChange={(e) => setForm({ ...form, answer: e.target.value })}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs"
                  placeholder="Explain the answer thoroughly for potential clients..."
                />
              </div>

              <div className="border-t border-border/60 pt-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_published}
                    onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                    className="size-4 accent-[#153E35]"
                  />
                  <span className="font-medium text-foreground">Show in public FAQ section</span>
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
                    Delete Question
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
                    Save Question
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
