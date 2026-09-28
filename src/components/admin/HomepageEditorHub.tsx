"use client";

import React, { useState } from "react";
import { Eye, LayoutTemplate, Table } from "lucide-react";
import { VisualHomepageEditor } from "./VisualHomepageEditor";
import { ContentSectionsTable } from "./ContentSectionsTable";
import type { HomepageSectionRecord } from "@/types/cms";

interface HomepageEditorHubProps {
  sections: HomepageSectionRecord[];
  loadError?: boolean;
}

export function HomepageEditorHub({ sections, loadError = false }: HomepageEditorHubProps) {
  const [activeView, setActiveView] = useState<"visual" | "table">("visual");

  return (
    <div className="space-y-6">
      {/* View Switcher Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
            Homepage content
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Edit text, replace photography, and control what appears on your live website.
          </p>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-muted rounded-xl text-xs">
          <button
            type="button"
            onClick={() => setActiveView("visual")}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium transition-colors ${
              activeView === "visual"
                ? "bg-background text-brand-forest shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutTemplate className="size-3.5 text-brand-forest" />
            <span>Visual Editor</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-brand-sage/50 text-brand-forest">
              Recommended
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView("table")}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-medium transition-colors ${
              activeView === "table"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Table className="size-3.5" />
            <span>Table View</span>
          </button>
        </div>
      </div>

      {/* Load error banner */}
      {loadError && (
        <div
          role="alert"
          className="border-destructive/40 bg-destructive/10 text-foreground rounded-lg border px-4 py-3 text-sm"
        >
          Could not load homepage sections right now. Please refresh the page —
          if the problem persists, verify the Supabase configuration.
        </div>
      )}

      {/* Main Content Area */}
      {activeView === "visual" ? (
        <VisualHomepageEditor initialSections={sections} />
      ) : (
        <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <p className="text-xs text-muted-foreground">
              Technical database record view for developers and automated tests.
            </p>
            <button
              type="button"
              onClick={() => setActiveView("visual")}
              className="text-xs font-semibold text-brand-forest hover:underline"
            >
              &larr; Switch to Visual Editor
            </button>
          </div>
          <ContentSectionsTable sections={sections} loadError={loadError} />
        </div>
      )}
    </div>
  );
}
