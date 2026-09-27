import Link from "next/link";
import { requireAdmin } from "@/lib/auth/admin";
import { buttonVariants } from "@/components/ui/button";
import { SupabaseNotConfiguredError } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { createPageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { INQUIRY_TYPE_LABELS } from "@/lib/validations/contact";
import { AdminConfigNotice } from "./config-notice";

export const metadata = createPageMetadata({
  title: "Admin Dashboard",
  description:
    "Live administrative overview for the IntegraVity admin console.",
  path: "/admin",
  index: false,
});

/**
 * Live administrative dashboard (docs/TASKS.md Task 7.1).
 *
 * - Gated with `requireAdmin()` — unauthorized visitors are redirected to
 *   /admin/login before any data is touched.
 * - Demo mode (Supabase unconfigured): the gate throws
 *   `SupabaseNotConfiguredError`, caught here to render setup guidance
 *   instead of an unhandled exception.
 * - Counts run through the anon client with the admin's session, so RLS
 *   (`is_admin()` policies) still governs every row; individual query
 *   failures degrade to "—" rather than breaking the page.
 */

type RecentInquiry = {
  id: string;
  name: string;
  company: string | null;
  inquiry_type: string;
  status: string;
  created_at: string;
};

type DashboardData = {
  inquiriesTotal: number | null;
  inquiriesNew: number | null;
  servicesTotal: number | null;
  servicesPublished: number | null;
  projectsPublished: number | null;
  mediaTotal: number | null;
  recentInquiries: RecentInquiry[];
};

type SupabaseServer = Awaited<ReturnType<typeof createClient>>;

const STATUS_STYLES: Record<string, string> = {
  new: "bg-brand-sage/40 text-brand-forest",
  reviewing: "bg-amber-100 text-amber-800",
  contacted: "bg-emerald-100 text-emerald-800",
  archived: "bg-muted text-muted-foreground",
};

async function fetchCount(
  supabase: SupabaseServer,
  table: string,
  filter?: { column: string; value: string | boolean },
): Promise<number | null> {
  try {
    const query = supabase
      .from(table)
      .select("id", { count: "exact", head: true });
    const { count, error } = filter
      ? await query.eq(filter.column, filter.value)
      : await query;
    if (error) throw new Error(error.message);
    return count ?? 0;
  } catch (error) {
    // Fail soft: metrics are advisory — a missing table or policy must
    // never take the dashboard down.
    console.error(`[admin] count query failed for "${table}":`, error);
    return null;
  }
}

async function fetchRecentInquiries(
  supabase: SupabaseServer,
): Promise<RecentInquiry[]> {
  try {
    const { data, error } = await supabase
      .from("inquiries")
      .select("id, name, company, inquiry_type, status, created_at")
      .order("created_at", { ascending: false })
      .limit(3);
    if (error) throw new Error(error.message);
    return (data ?? []) as RecentInquiry[];
  } catch (error) {
    console.error("[admin] recent inquiries query failed:", error);
    return [];
  }
}

function formatMetric(value: number | null): string {
  return value === null ? "—" : String(value);
}

function inquiryTypeLabel(type: string): string {
  return (
    INQUIRY_TYPE_LABELS[type as keyof typeof INQUIRY_TYPE_LABELS] ??
    "General inquiry"
  );
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function DashboardUnavailable() {
  return (
    <div className="mx-auto max-w-5xl">
      <p className="text-eyebrow text-muted-foreground">Admin console</p>
      <h1 className="font-heading mt-2 text-2xl font-semibold">Dashboard</h1>
      <div className="border-border bg-card mt-6 rounded-xl border p-6">
        <h2 className="font-heading text-lg font-semibold">
          Configuration required
        </h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Live dashboard metrics require a configured Supabase project.
          Administrative features fail secure until credentials are added.
        </p>
        <div className="mt-4">
          <AdminConfigNotice />
        </div>
      </div>
    </div>
  );
}

export default async function AdminDashboardPage() {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof SupabaseNotConfiguredError) {
      // Demo mode: no credentials → no session can exist; show setup
      // guidance rather than crashing the admin shell.
      return <DashboardUnavailable />;
    }
    // Unauthorized redirects and unexpected errors must propagate.
    throw error;
  }

  const supabase = await createClient();

  const [
    inquiriesTotal,
    inquiriesNew,
    servicesTotal,
    servicesPublished,
    projectsPublished,
    mediaTotal,
    recentInquiries,
  ] = await Promise.all([
    fetchCount(supabase, "inquiries"),
    fetchCount(supabase, "inquiries", { column: "status", value: "new" }),
    fetchCount(supabase, "services"),
    fetchCount(supabase, "services", { column: "is_published", value: true }),
    fetchCount(supabase, "projects", { column: "is_published", value: true }),
    fetchCount(supabase, "media_assets"),
    fetchRecentInquiries(supabase),
  ]);

  const data: DashboardData = {
    inquiriesTotal,
    inquiriesNew,
    servicesTotal,
    servicesPublished,
    projectsPublished,
    mediaTotal,
    recentInquiries,
  };

  const drafts =
    data.servicesTotal !== null && data.servicesPublished !== null
      ? data.servicesTotal - data.servicesPublished
      : null;

  const metrics: Array<{
    label: string;
    href: string;
    value: string;
    detail: string;
  }> = [
    {
      label: "Inquiries",
      href: "/admin/inquiries",
      value: formatMetric(data.inquiriesTotal),
      detail:
        data.inquiriesTotal === null
          ? "Temporarily unavailable"
          : `${data.inquiriesNew ?? 0} new awaiting review`,
    },
    {
      label: "Services",
      href: "/admin/services",
      value:
        data.servicesTotal === null || data.servicesPublished === null
          ? "—"
          : `${data.servicesPublished} / ${data.servicesTotal}`,
      detail:
        drafts === null || data.servicesPublished === null
          ? "Temporarily unavailable"
          : `${drafts} draft${drafts === 1 ? "" : "s"} · ${data.servicesPublished} published`,
    },
    {
      label: "Case studies",
      href: "/admin/projects",
      value: formatMetric(data.projectsPublished),
      detail:
        data.projectsPublished === null
          ? "Temporarily unavailable"
          : "published case studies",
    },
    {
      label: "Media assets",
      href: "/admin/media",
      value: formatMetric(data.mediaTotal),
      detail:
        data.mediaTotal === null
          ? "Temporarily unavailable"
          : "files catalogued",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <p className="text-eyebrow text-muted-foreground">Admin console</p>
      <h1 className="font-heading mt-2 text-2xl font-semibold">Dashboard</h1>
      <p className="text-muted-foreground mt-1 text-sm">
        Live overview of inquiries, services, case studies, and media.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Link
            key={metric.label}
            href={metric.href}
            className="border-border bg-card group hover:border-brand-sage/70 rounded-xl border p-5 transition-colors"
          >
            <p className="text-muted-foreground text-sm font-medium">
              {metric.label}
            </p>
            <p className="font-heading mt-2 text-3xl font-semibold">
              {metric.value}
            </p>
            <p className="text-muted-foreground/80 mt-1 text-xs">
              {metric.detail}
            </p>
            <span className="text-brand-forest mt-4 block text-xs font-semibold underline-offset-4 group-hover:underline">
              Manage →
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section
          aria-labelledby="recent-inquiries-heading"
          className="border-border bg-card rounded-xl border p-6 lg:col-span-2"
        >
          <div className="flex items-center justify-between gap-4">
            <h2
              id="recent-inquiries-heading"
              className="font-heading text-lg font-semibold"
            >
              Recent inquiries
            </h2>
            <Link
              href="/admin/inquiries"
              className="text-foreground hover:text-brand-forest text-sm font-medium underline-offset-4 hover:underline"
            >
              View all
            </Link>
          </div>

          {data.recentInquiries.length === 0 ? (
            <p className="text-muted-foreground mt-4 text-sm">
              No inquiries yet — new submissions from the contact form will
              appear here.
            </p>
          ) : (
            <ul className="divide-border mt-2 divide-y">
              {data.recentInquiries.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{item.name}</p>
                    <p className="text-muted-foreground truncate text-xs">
                      {[item.company ?? "", inquiryTypeLabel(item.inquiry_type)]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <time
                      dateTime={item.created_at}
                      className="text-muted-foreground text-xs"
                    >
                      {formatDate(item.created_at)}
                    </time>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-semibold",
                        STATUS_STYLES[item.status] ?? STATUS_STYLES.new,
                      )}
                    >
                      {item.status.charAt(0).toUpperCase() +
                        item.status.slice(1)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <aside className="border-border bg-card rounded-xl border p-6">
          <h2 className="font-heading text-lg font-semibold">Quick actions</h2>
          <div className="mt-4 flex flex-col gap-3">
            <Link
              href="/admin/services"
              className={buttonVariants({
                variant: "default",
                className: "w-full justify-start",
              })}
            >
              Add Service
            </Link>
            <Link
              href="/admin/inquiries"
              className={buttonVariants({
                variant: "outline",
                className: "w-full justify-start",
              })}
            >
              Review Inquiries
            </Link>
            <Link
              href="/admin/settings"
              className={buttonVariants({
                variant: "outline",
                className: "w-full justify-start",
              })}
            >
              Edit Settings
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
