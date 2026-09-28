import Link from "next/link";
import { StatusPill } from "@/components/admin";
import { requireAdmin } from "@/lib/auth/admin";
import { buttonVariants } from "@/components/ui/button";
import { SupabaseNotConfiguredError } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { createPageMetadata } from "@/lib/seo";
import { INQUIRY_TYPE_LABELS } from "@/lib/validations/contact";
import type { InquiryStatus } from "@/lib/validations/inquiries";
import { AdminSetupPanel } from "./setup-panel";

export const metadata = createPageMetadata({
  title: "Admin Dashboard",
  description:
    "Live administrative overview for the Alderline Environmental CMS console.",
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
  status: InquiryStatus;
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
    // Pinned to UTC so server render and client hydration always agree.
    timeZone: "UTC",
  });
}

export default async function AdminDashboardPage() {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof SupabaseNotConfiguredError) {
      // Demo mode: no credentials → no session can exist; show setup
      // guidance rather than crashing the admin shell.
      return <AdminSetupPanel title="Dashboard" />;
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
    <div className="mx-auto max-w-6xl space-y-8">
      {/* ─────────────────────────────────────────────────────────────
          1. Hero Greeting & Primary Prompt
          ───────────────────────────────────────────────────────────── */}
      <div>
        <p className="text-eyebrow text-muted-foreground">Admin console</p>
        <h1 className="font-heading mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <div className="mt-4 p-6 rounded-2xl bg-brand-sage/20 border border-brand-sage flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-brand-forest tracking-tight">
              What would you like to change today?
            </h2>
            <p className="text-xs sm:text-sm text-brand-forest/80 mt-1 max-w-xl leading-relaxed">
              Choose any page or collection below to edit headlines, update photos, or review client messages.
            </p>
          </div>
          <Link
            href="/admin/content"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#15190d] text-[#f6f2eb] text-xs font-semibold shadow-xs hover:bg-[#252b29] transition-colors shrink-0"
          >
            <span>Open Visual Editor &rarr;</span>
          </Link>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. Common Task Visual Action Cards (The Core UX)
          ───────────────────────────────────────────────────────────── */}
      <section aria-label="Common website editing tasks">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: Edit Homepage */}
          <Link
            href="/admin/content"
            className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-xs hover:border-brand-forest/60 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="p-2 rounded-xl bg-brand-sage/40 text-brand-forest">
                <span className="text-lg">🏡</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-sage/30 text-brand-forest">
                Visual Editor
              </span>
            </div>
            <h3 className="text-base font-bold text-foreground group-hover:text-brand-forest transition-colors">
              Edit Homepage
            </h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed flex-1">
              Change hero headlines, intro text, and toggle sections shown on your main landing page.
            </p>
            <span className="mt-4 pt-3 border-t border-border/60 text-xs font-semibold text-brand-forest flex items-center justify-between">
              <span>Start editing</span>
              <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
            </span>
          </Link>

          {/* Card 2: Photos & Videos */}
          <Link
            href="/admin/media"
            className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-xs hover:border-brand-forest/60 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="p-2 rounded-xl bg-brand-sage/40 text-brand-forest">
                <span className="text-lg">📸</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                Media Library
              </span>
            </div>
            <h3 className="text-base font-bold text-foreground group-hover:text-brand-forest transition-colors">
              Photos &amp; Videos
            </h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed flex-1">
              Browse 50+ existing field photos, drone footage, and upload new high-resolution imagery.
            </p>
            <span className="mt-4 pt-3 border-t border-border/60 text-xs font-semibold text-brand-forest flex items-center justify-between">
              <span>Browse assets</span>
              <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
            </span>
          </Link>

          {/* Card 3: Consulting Services */}
          <Link
            href="/admin/services"
            className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-xs hover:border-brand-forest/60 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="p-2 rounded-xl bg-brand-sage/40 text-brand-forest">
                <span className="text-lg">🌿</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                Practice Areas
              </span>
            </div>
            <h3 className="text-base font-bold text-foreground group-hover:text-brand-forest transition-colors">
              Consulting Services
            </h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed flex-1">
              Edit the 4 core disciplines: wetland delineation, permitting, site assessment, and restoration.
            </p>
            <span className="mt-4 pt-3 border-t border-border/60 text-xs font-semibold text-brand-forest flex items-center justify-between">
              <span>View disciplines</span>
              <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
            </span>
          </Link>

          {/* Card 4: Edit About Page */}
          <Link
            href="/admin/about"
            className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-xs hover:border-brand-forest/60 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="p-2 rounded-xl bg-brand-sage/40 text-brand-forest">
                <span className="text-lg">ℹ️</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                Company Story
              </span>
            </div>
            <h3 className="text-base font-bold text-foreground group-hover:text-brand-forest transition-colors">
              Edit About Page
            </h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed flex-1">
              Update firm mission, the 4-photo aerial gallery, and your core environmental principles.
            </p>
            <span className="mt-4 pt-3 border-t border-border/60 text-xs font-semibold text-brand-forest flex items-center justify-between">
              <span>Edit narrative</span>
              <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
            </span>
          </Link>

          {/* Card 5: Team Profiles */}
          <Link
            href="/admin/team"
            className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-xs hover:border-brand-forest/60 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="p-2 rounded-xl bg-brand-sage/40 text-brand-forest">
                <span className="text-lg">👥</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                Leadership
              </span>
            </div>
            <h3 className="text-base font-bold text-foreground group-hover:text-brand-forest transition-colors">
              Team Profiles
            </h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed flex-1">
              Add or edit certified scientists, hydrologists, and PE leadership profiles with portraits.
            </p>
            <span className="mt-4 pt-3 border-t border-border/60 text-xs font-semibold text-brand-forest flex items-center justify-between">
              <span>View team</span>
              <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
            </span>
          </Link>

          {/* Card 6: Read Messages */}
          <Link
            href="/admin/inquiries"
            className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-xs hover:border-brand-forest/60 hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="p-2 rounded-xl bg-brand-sage/40 text-brand-forest">
                <span className="text-lg">📬</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Live Intake
              </span>
            </div>
            <h3 className="text-base font-bold text-foreground group-hover:text-brand-forest transition-colors">
              Read Client Messages
            </h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed flex-1">
              Review new project scoping requests submitted through your website&apos;s contact form.
            </p>
            <span className="mt-4 pt-3 border-t border-border/60 text-xs font-semibold text-brand-forest flex items-center justify-between">
              <span>View inbox</span>
              <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
            </span>
          </Link>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. Activity & Quick Actions (Inquiries + Fast Links)
          ───────────────────────────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-3">
        <section
          aria-labelledby="recent-inquiries-heading"
          className="border-border bg-card rounded-2xl border p-6 lg:col-span-2 shadow-xs"
        >
          <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
            <div>
              <h2
                id="recent-inquiries-heading"
                className="font-heading text-lg font-semibold text-foreground"
              >
                Recent inquiries
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Prospective client submissions awaiting review.
              </p>
            </div>
            <Link
              href="/admin/inquiries"
              className="text-foreground hover:text-brand-forest text-xs font-semibold underline-offset-4 hover:underline"
            >
              View all &rarr;
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
                    <p className="truncate text-sm font-semibold text-foreground">{item.name}</p>
                    <p className="text-muted-foreground truncate text-xs mt-0.5">
                      {[item.company ?? "", inquiryTypeLabel(item.inquiry_type)]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <time
                      dateTime={item.created_at}
                      className="text-muted-foreground text-xs font-mono"
                    >
                      {formatDate(item.created_at)}
                    </time>
                    <StatusPill status={item.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <aside className="border-border bg-card rounded-2xl border p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="font-heading text-lg font-semibold text-foreground">
              Quick actions
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Direct shortcuts for common administrative updates.
            </p>
            <div className="mt-4 flex flex-col gap-2.5">
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
          </div>
          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Need to customize logos or contact numbers? Use <Link href="/admin/settings" className="font-semibold text-brand-forest hover:underline">Settings</Link>.
            </p>
          </div>
        </aside>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. Website Overview & Metric Summary (Clean, Secondary Placement)
          ───────────────────────────────────────────────────────────── */}
      <section aria-label="Website Overview Metrics" className="pt-2">
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
            Website Overview &amp; Records
          </h2>
          <span className="text-xs text-muted-foreground">4 core collections</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <Link
              key={metric.label}
              href={metric.href}
              className="border-border bg-card group hover:border-brand-sage/70 rounded-xl border p-4 transition-colors shadow-xs"
            >
              <p className="text-muted-foreground text-xs font-medium">
                {metric.label}
              </p>
              <p className="font-heading mt-1.5 text-2xl font-bold text-foreground">
                {metric.value}
              </p>
              <p className="text-muted-foreground/80 mt-0.5 text-[11px]">
                {metric.detail}
              </p>
              <span className="text-brand-forest mt-3 block text-xs font-semibold underline-offset-4 group-hover:underline">
                Manage →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
