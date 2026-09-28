import { requireAdmin } from "@/lib/auth/admin";
import { SupabaseNotConfiguredError } from "@/lib/env";
import { createPageMetadata } from "@/lib/seo";
import { AdminSetupPanel } from "../setup-panel";
import { VisualStatisticsManager } from "@/components/admin/VisualStatisticsManager";

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
      <div>
        <p className="text-eyebrow text-muted-foreground">Website</p>
        <h1 className="font-heading text-2xl font-semibold mt-1">Key Metrics & Statistics</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage quantitative impact indicators and credibility statements displayed across the homepage and about page.
        </p>
      </div>

      <VisualStatisticsManager initialStatistics={DEMO_STATISTICS} />
    </div>
  );
}
