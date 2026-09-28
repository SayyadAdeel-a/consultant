import { requireAdmin } from "@/lib/auth/admin";
import { SupabaseNotConfiguredError } from "@/lib/env";
import { createPageMetadata } from "@/lib/seo";
import { AdminSetupPanel } from "../setup-panel";
import { BarChart3 } from "lucide-react";

export const metadata = createPageMetadata({
  title: "Performance Statistics",
  description: "Manage key metrics, concurrence rates, and achievement statistics.",
  path: "/admin/statistics",
  index: false,
});

export const DEMO_STATISTICS = [
  {
    id: "stat-1",
    value: "99.4",
    suffix: "%",
    label: "Regulatory Concurrence",
    description: "First-round approval rate across state and federal Section 404/401 and NEPA permit filings.",
    display_order: 1,
    is_visible: true,
  },
  {
    id: "stat-2",
    value: "180",
    suffix: "+",
    label: "Completed Reviews",
    description: "Phase I/II Environmental Site Assessments and critical areas ordinance filings delivered on schedule.",
    display_order: 2,
    is_visible: true,
  },
  {
    id: "stat-3",
    value: "14",
    suffix: "+",
    label: "Years in Practice",
    description: "Dedicated ecological engineering, wetland delineation, and environmental planning excellence.",
    display_order: 3,
    is_visible: true,
  },
  {
    id: "stat-4",
    value: "35,000",
    suffix: " ac",
    label: "Wetlands Mapped",
    description: "Field-verified jurisdictional boundaries mapped with sub-meter GNSS accuracy.",
    display_order: 4,
    is_visible: true,
  },
];

export default async function AdminStatisticsPage() {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof SupabaseNotConfiguredError) {
      return <AdminSetupPanel title="Statistics" />;
    }
    throw error;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-eyebrow text-muted-foreground">Website</p>
          <h1 className="font-heading text-2xl font-semibold mt-1">Key Metrics & Statistics</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage quantitative impact indicators and credibility statements displayed across the homepage and about page.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-forest px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#252B29] transition-colors"
        >
          <BarChart3 className="size-3.5" />
          Add Metric
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {DEMO_STATISTICS.map((stat) => (
          <div key={stat.id} className="rounded-xl border border-border bg-card p-5 shadow-xs">
            <span className="text-xs font-mono text-muted-foreground">Priority 0{stat.display_order}</span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="font-heading text-3xl font-semibold text-brand-forest">{stat.value}</span>
              <span className="text-lg font-bold text-muted-foreground">{stat.suffix}</span>
            </div>
            <p className="text-sm font-semibold text-foreground mt-1">{stat.label}</p>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{stat.description}</p>
            <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
              <span className="inline-flex items-center rounded-full bg-brand-sage/40 px-2 py-0.5 text-[10px] font-medium text-brand-forest">
                Visible
              </span>
              <button type="button" className="text-xs font-semibold text-brand-forest hover:underline">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
