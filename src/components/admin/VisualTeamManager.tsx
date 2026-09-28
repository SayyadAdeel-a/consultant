"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Briefcase,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Plus,
  Search,
  Sparkles,
  Trash2,
  User,
  Users,
  X,
} from "lucide-react";
import { MediaPickerModal } from "./MediaPickerModal";

export interface TeamMemberItem {
  id: string;
  name: string;
  role: string;
  discipline: string;
  image: string;
  bio: string;
  credentials?: string;
  linkedin_url?: string;
  is_published: boolean;
  display_order: number;
}

interface VisualTeamManagerProps {
  initialMembers: TeamMemberItem[];
}

export function VisualTeamManager({ initialMembers }: VisualTeamManagerProps) {
  const [members, setMembers] = useState<TeamMemberItem[]>(initialMembers);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingMember, setEditingMember] = useState<TeamMemberItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  // New member draft form state
  const [newMember, setNewMember] = useState<Partial<TeamMemberItem>>({
    name: "",
    role: "",
    discipline: "Ecological Assessment & Permitting",
    image: "/assets/alderline/team/member-1.jpg",
    bio: "",
    credentials: "",
    linkedin_url: "",
    is_published: true,
    display_order: members.length + 1,
  });

  const filteredMembers = members.filter((m) => {
    const query = searchQuery.toLowerCase();
    return (
      m.name.toLowerCase().includes(query) ||
      m.role.toLowerCase().includes(query) ||
      m.discipline.toLowerCase().includes(query)
    );
  });

  function showNotice(msg: string) {
    setNoticeMessage(msg);
    setTimeout(() => setNoticeMessage(null), 4000);
  }

  function handleTogglePublished(id: string) {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const next = !m.is_published;
          showNotice(next ? `${m.name} is now published on the website.` : `${m.name} is now hidden.`);
          return { ...m, is_published: next };
        }
        return m;
      })
    );
  }

  function handleSaveEdit() {
    if (!editingMember) return;
    setMembers((prev) =>
      prev.map((m) => (m.id === editingMember.id ? editingMember : m))
    );
    showNotice(`Updated details for ${editingMember.name}.`);
    setEditingMember(null);
  }

  function handleCreateMember() {
    if (!newMember.name || !newMember.role) {
      showNotice("Please enter at least a name and role for the new team member.");
      return;
    }
    const created: TeamMemberItem = {
      id: `team-${Date.now()}`,
      name: newMember.name,
      role: newMember.role,
      discipline: newMember.discipline || "Environmental Science",
      image: newMember.image || "/assets/alderline/team/member-1.jpg",
      bio: newMember.bio || "Environmental specialist contributing to Alderline site assessments and project reviews.",
      credentials: newMember.credentials || "",
      linkedin_url: newMember.linkedin_url || "",
      is_published: true,
      display_order: members.length + 1,
    };
    setMembers((prev) => [...prev, created]);
    showNotice(`Added ${created.name} to the team.`);
    setIsCreating(false);
    setNewMember({
      name: "",
      role: "",
      discipline: "Ecological Assessment & Permitting",
      image: "/assets/alderline/team/member-1.jpg",
      bio: "",
      credentials: "",
      linkedin_url: "",
      is_published: true,
      display_order: members.length + 2,
    });
  }

  function handleDeleteMember(id: string, name: string) {
    if (confirm(`Are you sure you want to remove ${name} from the website?`)) {
      setMembers((prev) => prev.filter((m) => m.id !== id));
      showNotice(`Removed ${name}.`);
    }
  }

  return (
    <div className="space-y-6">
      {/* ─────────────────────────────────────────────────────────────
          1. Header & Controls
          ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-card border border-border rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/content-hub"
              className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              Content Library
            </Link>
            <span className="text-muted-foreground/60 text-xs">/</span>
            <span className="text-xs font-bold text-brand-forest">Team Members</span>
          </div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground mt-1">
            Team Members
          </h1>
          <p className="text-muted-foreground text-xs mt-0.5">
            Manage certified scientists, engineers, and technical leadership displayed across your website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Live Count Pill */}
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-brand-sage/40 text-brand-forest border border-brand-sage">
            <Users className="size-3.5 text-brand-forest" />
            <span>{members.filter((m) => m.is_published).length} Published</span>
          </span>

          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#15190d] text-[#f6f2eb] text-xs font-semibold shadow-xs hover:bg-[#252b29] transition-colors"
          >
            <Plus className="size-4 text-[#dfe0d4]" />
            <span>Add Team Member</span>
          </button>
        </div>
      </div>

      {/* Notice Alert */}
      {noticeMessage && (
        <div
          role="status"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium bg-brand-sage/40 text-brand-forest border border-brand-sage animate-in fade-in duration-200"
        >
          <Sparkles className="size-4 shrink-0 text-brand-forest" />
          <span>{noticeMessage}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, role, or discipline…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-brand-forest shadow-xs"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Showing {filteredMembers.length} of {members.length} members
        </p>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. Visual Responsive Grid of Team Cards
          ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            className={`group flex flex-col rounded-2xl border bg-card overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 ${
              member.is_published
                ? "border-border hover:border-brand-forest/60"
                : "border-border/60 opacity-60 bg-muted/20"
            }`}
          >
            {/* Card Portrait & Status Header */}
            <div className="relative aspect-4/3 w-full bg-muted/40 overflow-hidden">
              <Image
                src={member.image}
                alt={member.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-103 transition-transform duration-500"
              />

              {/* Status Badge */}
              <div className="absolute top-3 left-3">
                {member.is_published ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#15190d]/80 text-[#f6f2eb] backdrop-blur-xs">
                    <span className="size-1.5 rounded-full bg-emerald-400" />
                    Live on site
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-muted/90 text-muted-foreground backdrop-blur-xs">
                    <EyeOff className="size-3" />
                    Hidden
                  </span>
                )}
              </div>

              {/* Discipline Pill */}
              <div className="absolute bottom-3 left-3 right-3">
                <span className="inline-block text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-md bg-[#f6f2eb]/90 text-[#15190d] backdrop-blur-xs truncate max-w-full">
                  {member.discipline}
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h2 className="text-base font-bold text-foreground group-hover:text-brand-forest transition-colors">
                  {member.name}
                </h2>
                <p className="text-xs font-medium text-brand-forest/80 mt-0.5">
                  {member.role}
                </p>
                <p className="text-xs text-muted-foreground mt-2 line-clamp-3 leading-relaxed">
                  {member.bio}
                </p>
              </div>

              {/* Card Action Buttons */}
              <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleTogglePublished(member.id)}
                    className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-xs"
                    title={member.is_published ? "Hide from website" : "Show on website"}
                  >
                    {member.is_published ? <Eye className="size-3.5 text-emerald-600" /> : <EyeOff className="size-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteMember(member.id, member.name)}
                    className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors text-xs"
                    title="Remove team member"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setEditingMember(member)}
                  className="px-4 py-2 rounded-xl bg-[#15190d] text-[#f6f2eb] text-xs font-semibold shadow-xs hover:bg-[#252b29] transition-colors"
                >
                  Edit Profile &rarr;
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="py-16 text-center rounded-2xl border border-dashed border-border bg-card p-8">
          <User className="size-10 text-muted-foreground/40 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-foreground">No team members found</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Try adjusting your search query, or click &ldquo;Add Team Member&rdquo; to create a new profile.
          </p>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. Focused Edit Modal Drawer
          ───────────────────────────────────────────────────────────── */}
      {editingMember && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Edit ${editingMember.name}`}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#15190d]/60 backdrop-blur-xs"
        >
          <div className="relative w-full max-w-lg bg-background border border-border rounded-2xl shadow-2xl p-6 overflow-y-auto max-h-[90vh] space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-lg font-bold text-foreground tracking-tight">
                  Edit Team Member
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Update photo, name, role, and bio.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingMember(null)}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Photo Preview & Change Action */}
            <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-muted/20">
              <div className="relative size-20 rounded-full overflow-hidden border-2 border-border shadow-xs shrink-0">
                <Image
                  src={editingMember.image}
                  alt={editingMember.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-foreground block">
                  Portrait Photo
                </span>
                <p className="text-[11px] text-muted-foreground">
                  Square aspect ratio (800 × 800) recommended.
                </p>
                <button
                  type="button"
                  onClick={() => setIsMediaPickerOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-border bg-background text-xs font-semibold text-brand-forest hover:bg-muted transition-colors shadow-xs mt-1"
                >
                  <ImageIcon className="size-3" />
                  Choose from Library
                </button>
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-1">
                  Full Name & Honors
                </label>
                <input
                  type="text"
                  value={editingMember.name}
                  onChange={(e) =>
                    setEditingMember({ ...editingMember, name: e.target.value })
                  }
                  className="w-full text-xs bg-background border border-border rounded-xl px-3.5 py-2.5 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-brand-forest/20 focus:border-brand-forest"
                  placeholder="e.g. Dr. Evelyn Reed, PWS"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-1">
                  Job Title / Organizational Role
                </label>
                <input
                  type="text"
                  value={editingMember.role}
                  onChange={(e) =>
                    setEditingMember({ ...editingMember, role: e.target.value })
                  }
                  className="w-full text-xs bg-background border border-border rounded-xl px-3.5 py-2.5 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-brand-forest/20 focus:border-brand-forest"
                  placeholder="e.g. Principal Ecological Consultant"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-1">
                  Practice Area / Discipline
                </label>
                <input
                  type="text"
                  value={editingMember.discipline}
                  onChange={(e) =>
                    setEditingMember({
                      ...editingMember,
                      discipline: e.target.value,
                    })
                  }
                  className="w-full text-xs bg-background border border-border rounded-xl px-3.5 py-2.5 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-brand-forest/20 focus:border-brand-forest"
                  placeholder="e.g. Ecological Assessment & Permitting"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-1">
                  Biography / Practice Summary
                </label>
                <textarea
                  rows={4}
                  value={editingMember.bio}
                  onChange={(e) =>
                    setEditingMember({ ...editingMember, bio: e.target.value })
                  }
                  className="w-full text-xs bg-background border border-border rounded-xl px-3.5 py-2.5 text-foreground leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-forest/20 focus:border-brand-forest"
                  placeholder="Summarize their field credentials, years of experience, and regulatory focus…"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/10">
                <span className="text-xs font-semibold text-foreground">
                  Show on live website
                </span>
                <input
                  type="checkbox"
                  checked={editingMember.is_published}
                  onChange={(e) =>
                    setEditingMember({
                      ...editingMember,
                      is_published: e.target.checked,
                    })
                  }
                  className="size-4 accent-brand-forest rounded"
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => setEditingMember(null)}
                className="px-4 py-2 rounded-xl border border-border text-xs font-medium text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-5 py-2.5 rounded-xl bg-[#15190d] text-[#f6f2eb] text-xs font-semibold shadow-xs hover:bg-[#252b29] transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          4. Create New Team Member Modal
          ───────────────────────────────────────────────────────────── */}
      {isCreating && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Add New Team Member"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#15190d]/60 backdrop-blur-xs"
        >
          <div className="relative w-full max-w-lg bg-background border border-border rounded-2xl shadow-2xl p-6 overflow-y-auto max-h-[90vh] space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-lg font-bold text-foreground tracking-tight">
                  Add New Team Member
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Introduce a new environmental scientist, PE, or consultant.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-muted/20">
              <div className="relative size-16 rounded-full overflow-hidden border border-border shadow-xs shrink-0">
                <Image
                  src={newMember.image || "/assets/alderline/team/member-1.jpg"}
                  alt="New team member"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-foreground block">
                  Portrait Photo
                </span>
                <button
                  type="button"
                  onClick={() => setIsMediaPickerOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-border bg-background text-xs font-semibold text-brand-forest hover:bg-muted transition-colors shadow-xs mt-1"
                >
                  <ImageIcon className="size-3" />
                  Choose from Library
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-1">
                  Full Name & Honors *
                </label>
                <input
                  type="text"
                  value={newMember.name || ""}
                  onChange={(e) =>
                    setNewMember({ ...newMember, name: e.target.value })
                  }
                  className="w-full text-xs bg-background border border-border rounded-xl px-3.5 py-2.5 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-brand-forest/20 focus:border-brand-forest"
                  placeholder="e.g. Dr. Jordan Vance, PWS"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-1">
                  Job Title / Organizational Role *
                </label>
                <input
                  type="text"
                  value={newMember.role || ""}
                  onChange={(e) =>
                    setNewMember({ ...newMember, role: e.target.value })
                  }
                  className="w-full text-xs bg-background border border-border rounded-xl px-3.5 py-2.5 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-brand-forest/20 focus:border-brand-forest"
                  placeholder="e.g. Senior Watershed Scientist"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-1">
                  Practice Area / Discipline
                </label>
                <input
                  type="text"
                  value={newMember.discipline || ""}
                  onChange={(e) =>
                    setNewMember({ ...newMember, discipline: e.target.value })
                  }
                  className="w-full text-xs bg-background border border-border rounded-xl px-3.5 py-2.5 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-brand-forest/20 focus:border-brand-forest"
                  placeholder="e.g. Wetland Science & Hydrology"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-1">
                  Biography / Practice Summary
                </label>
                <textarea
                  rows={3}
                  value={newMember.bio || ""}
                  onChange={(e) =>
                    setNewMember({ ...newMember, bio: e.target.value })
                  }
                  className="w-full text-xs bg-background border border-border rounded-xl px-3.5 py-2.5 text-foreground leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-forest/20 focus:border-brand-forest"
                  placeholder="Summarize their field expertise and regulatory certifications…"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 rounded-xl border border-border text-xs font-medium text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateMember}
                className="px-5 py-2 rounded-xl bg-brand-forest text-xs font-semibold text-white shadow-xs hover:bg-[#252B29]"
              >
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media Picker Modal for Team Member Photo */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        categoryFilter="team"
        onSelect={(media) => {
          if (editingMember) {
            setEditingMember({ ...editingMember, image: media.url });
          } else if (isCreating) {
            setNewMember({ ...newMember, image: media.url });
          }
        }}
        title="Select Team Portrait"
      />
    </div>
  );
}
