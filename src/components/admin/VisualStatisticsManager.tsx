"use client";

import { useState } from "react";
import { Plus, Edit3, Eye, EyeOff, Check, Trash2 } from "lucide-react";

export interface StatisticItem {
  id: string;
  value: string;
  suffix: string;
  label: string;
  description: string;
  display_order: number;
  is_visible: boolean;
}

export function VisualStatisticsManager({
  initialStatistics,
}: {
  initialStatistics: StatisticItem[];
}) {
  const [stats, setStats] = useState<StatisticItem[]>(initialStatistics);
  const [editingItem, setEditingItem] = useState<StatisticItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const [form, setForm] = useState<StatisticItem>({
    id: "",
    value: "",
    suffix: "",
    label: "",
    description: "",
    display_order: 1,
    is_visible: true,
  });

  function openCreateModal() {
    setForm({
      id: `stat-${Date.now()}`,
      value: "",
      suffix: "+",
      label: "",
      description: "",
      display_order: stats.length + 1,
      is_visible: true,
    });
    setEditingItem(null);
    setIsModalOpen(true);
  }

  function openEditModal(item: StatisticItem) {
    setForm({ ...item });
    setEditingItem(item);
    setIsModalOpen(true);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.value.trim() || !form.label.trim()) return;

    if (editingItem) {
      setStats((prev) => prev.map((s) => (s.id === form.id ? { ...form } : s)));
      setSavedNotice(`Updated metric: "${form.label}"`);
    } else {
      setStats((prev) => [...prev, { ...form }]);
      setSavedNotice(`Added metric: "${form.label}"`);
    }

    setIsModalOpen(false);
    setTimeout(() => setSavedNotice(null), 4000);
  }

  function toggleVisible(id: string) {
    setStats((prev) =>
      prev.map((s) => (s.id === id ? { ...s, is_visible: !s.is_visible } : s))
    );
  }

  function handleDelete(id: string) {
    setStats((prev) => prev.filter((s) => s.id !== id));
    setIsModalOpen(false);
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            {stats.length} impact indicators and achievement figures displayed on the homepage and about page
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-lg bg-[#15190d] px-4 py-2 text-xs font-semibold !text-white shadow-xs hover:bg-[#252B29] transition-colors"
        >
          <Plus className="size-3.5" />
          Add Metric
        </button>
      </div>

      {savedNotice ? (
        <div className="flex items-center gap-2 rounded-lg bg-brand-sage/40 border border-brand-sage/60 px-4 py-3 text-sm text-brand-forest">
          <Check className="size-4 shrink-0 text-brand-forest" />
          <span>{savedNotice} (changes active in this session)</span>
        </div>
      ) : null}

      {/* Visual Metric Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className={`group relative flex flex-col justify-between rounded-xl border bg-card p-5 shadow-xs transition-all hover:shadow-md ${
              stat.is_visible ? "border-border" : "border-dashed border-border/80 opacity-75"
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-muted-foreground">
                  Metric 0{stat.display_order}
                </span>
                <button
                  type="button"
                  onClick={() => toggleVisible(stat.id)}
                  title={stat.is_visible ? "Click to hide" : "Click to show"}
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium transition-colors ${
                    stat.is_visible
                      ? "bg-brand-sage/40 text-brand-forest hover:bg-brand-sage/60"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {stat.is_visible ? (
                    <>
                      <Eye className="size-3" />
                      <span>Visible</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="size-3" />
                      <span>Hidden</span>
                    </>
                  )}
                </button>
              </div>

              {/* Big Metric Display */}
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-heading text-3xl font-bold tracking-tight text-brand-forest">
                  {stat.value}
                </span>
                <span className="text-xl font-bold text-muted-foreground">
                  {stat.suffix}
                </span>
              </div>

              <h3 className="font-heading text-sm font-semibold text-foreground mt-2">
                {stat.label}
              </h3>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed line-clamp-3">
                {stat.description}
              </p>
            </div>

            <div className="mt-5 border-t border-border/60 pt-3 flex items-center justify-end">
              <button
                type="button"
                onClick={() => openEditModal(stat)}
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
                {editingItem ? `Edit Metric: ${editingItem.label}` : "Add Key Metric"}
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
                  <label className="block font-medium text-foreground mb-1">Value *</label>
                  <input
                    type="text"
                    required
                    value={form.value}
                    onChange={(e) => setForm({ ...form, value: e.target.value })}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs"
                    placeholder="e.g. 99.4 or 180"
                  />
                </div>
                <div>
                  <label className="block font-medium text-foreground mb-1">Suffix (unit)</label>
                  <input
                    type="text"
                    value={form.suffix}
                    onChange={(e) => setForm({ ...form, suffix: e.target.value })}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs"
                    placeholder="e.g. % or + or ac"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">Metric Label *</label>
                <input
                  type="text"
                  required
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs"
                  placeholder="e.g. Regulatory Concurrence"
                />
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">Narrative Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs"
                  placeholder="Explain what this metric demonstrates to clients..."
                />
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
                      checked={form.is_visible}
                      onChange={(e) => setForm({ ...form, is_visible: e.target.checked })}
                      className="size-4 accent-[#153E35]"
                    />
                    <span className="font-medium text-foreground">Visible on website</span>
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
                    Save Metric
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
