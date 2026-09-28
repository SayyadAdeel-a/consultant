import "server-only";
import { caseStudies, type CaseStudyDetail } from "@/config/projects";
import { services, type ServiceDetail } from "@/config/services";
import { faqContent } from "@/lib/alderline-content";
import { allBlogPosts, type BlogPost } from "@/lib/blog-data";
import { SupabaseNotConfiguredError } from "@/lib/env";
import { createPublicClient } from "@/lib/supabase/public";
import type { SiteSettingsRecord } from "@/types/cms";

/**
 * Fail-safe public CMS reads (docs/TASKS.md Task 9.1).
 *
 * Every fetcher degrades to a `PublicRead` result instead of throwing so
 * public pages never crash:
 * - `available: false` → Supabase is unconfigured (demo mode) or the
 *   query failed; callers MUST fall back to the static configs.
 * - `available: true` with `data: null` → the read succeeded but the
 *   table has no (seeded) rows; callers apply their own fallback rules.
 *
 * Queries run through the cookie-free anon client in
 * `@/lib/supabase/public`, so public routes stay prerenderable and RLS
 * restricts results to published services, visible homepage sections,
 * and the public site-settings row.
 */

export interface PublicRead<T> {
  data: T | null;
  available: boolean;
}

/** Normalized CMS service row for public hydration. */
export interface PublicService {
  slug: string;
  title: string;
  summary: string;
  fullContent: string;
  framework: string[];
  deliverables: string[];
  pricingNote: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
}

/** Normalized CMS project (case study) row for public hydration. */
export interface PublicProject {
  slug: string;
  title: string;
  summary: string;
  challenge: string;
  solution: string;
  results: string;
  clientType: string;
  location: string;
  completedYear: number;
  isPublished: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
}

/** Sitemap source row (published CMS slugs). */
export interface CmsSitemapEntry {
  slug: string;
  lastModified: Date | null;
}

const SITE_SETTINGS_COLUMNS =
  "id, company_name, tagline, description, contact_email, contact_phone, office_address, social_links, cta_settings";

const SERVICE_COLUMNS =
  "slug, title, short_description, full_content, deliverables, regulatory_frameworks, pricing_note, meta_title, meta_description";

const PROJECT_COLUMNS =
  "slug, title, client_type, location, summary, challenge, solution, results, completed_year, is_published, meta_title, meta_description";

const SEO_ENTRY_COLUMNS = "slug, updated_at";

/**
 * Runs a public read and converts any failure into the fail-safe result.
 * `SupabaseNotConfiguredError` is expected in demo builds and stays
 * silent; genuine query failures are surfaced via `console.warn` so
 * operators can spot a broken connection without crashing the page.
 */
async function runRead<T>(query: () => Promise<T>): Promise<PublicRead<T>> {
  try {
    return { data: await query(), available: true };
  } catch (error) {
    if (!(error instanceof SupabaseNotConfiguredError)) {
      console.warn(
        "[public] CMS read failed — falling back to static config:",
        error,
      );
    }
    return { data: null, available: false };
  }
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((entry): entry is string => typeof entry === "string")
    : [];
}

function asNullableString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function toPublicService(row: Record<string, unknown>): PublicService {
  return {
    slug: String(row.slug ?? ""),
    title: String(row.title ?? ""),
    summary: String(row.short_description ?? ""),
    fullContent: String(row.full_content ?? ""),
    framework: asStringArray(row.regulatory_frameworks),
    deliverables: asStringArray(row.deliverables),
    pricingNote: asNullableString(row.pricing_note),
    metaTitle: asNullableString(row.meta_title),
    metaDescription: asNullableString(row.meta_description),
  };
}

function toPublicProject(row: Record<string, unknown>): PublicProject {
  return {
    slug: String(row.slug ?? ""),
    title: String(row.title ?? ""),
    summary: String(row.summary ?? ""),
    challenge: String(row.challenge ?? ""),
    solution: String(row.solution ?? ""),
    results: String(row.results ?? ""),
    clientType: String(row.client_type ?? ""),
    location: String(row.location ?? ""),
    completedYear: Number(row.completed_year ?? 0) || 0,
    isPublished: row.is_published === true,
    metaTitle: asNullableString(row.meta_title),
    metaDescription: asNullableString(row.meta_description),
  };
}

/** Singleton `site_settings` row, or null when unconfigured/failed. */
export function getSiteSettings(): Promise<
  PublicRead<SiteSettingsRecord | null>
> {
  return runRead(async () => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select(SITE_SETTINGS_COLUMNS)
      .eq("singleton_guard", true)
      .limit(1);
    if (error) throw new Error(error.message);
    return (data?.[0] ?? null) as SiteSettingsRecord | null;
  });
}

/**
 * Keys of the homepage sections the public visitor may see. RLS only
 * returns `is_visible = TRUE` rows and the query re-asserts the filter,
 * so a hidden section's key simply never appears. An empty or
 * unavailable read yields `[]` — callers treat that as "render
 * everything" so a fresh install (the seed creates no rows) keeps its
 * full nine-section narrative.
 */
export function getVisibleHomepageSections(): Promise<PublicRead<string[]>> {
  return runRead(async () => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("homepage_sections")
      .select("section_key, is_visible")
      .eq("is_visible", true);
    if (error) throw new Error(error.message);
    return (data ?? [])
      .map((row) =>
        String((row as { section_key?: unknown }).section_key ?? ""),
      )
      .filter(Boolean);
  });
}

/**
 * Published service rows in catalog order. Callers fall back to
 * `serviceList` when the read is unavailable *or* returns nothing
 * (fresh, unseeded database).
 */
export function getPublishedServices(): Promise<PublicRead<PublicService[]>> {
  return runRead(async () => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("services")
      .select(SERVICE_COLUMNS)
      .eq("is_published", true)
      .order("display_order");
    if (error) throw new Error(error.message);
    return (data ?? [])
      .map((row) => toPublicService(row as Record<string, unknown>))
      .filter((service) => service.slug);
  });
}

/**
 * Single published service. `available: true` with `data: null` means
 * the CMS is the authority and the slug does not resolve to a published
 * row — the detail page must `notFound()` rather than resurrect static
 * content for an unpublished service.
 */
export function getPublishedService(
  slug: string,
): Promise<PublicRead<PublicService | null>> {
  return runRead(async () => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("services")
      .select(SERVICE_COLUMNS)
      .eq("slug", slug)
      .eq("is_published", true)
      .limit(1);
    if (error) throw new Error(error.message);
    const row = data?.[0];
    return row ? toPublicService(row as Record<string, unknown>) : null;
  });
}

/**
 * Published case-study rows in catalog order. Callers fall back to
 * `caseStudyList` when the read is unavailable *or* returns nothing
 * (fresh, unseeded database).
 */
export function getPublishedProjects(): Promise<PublicRead<PublicProject[]>> {
  return runRead(async () => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("projects")
      .select(PROJECT_COLUMNS)
      .eq("is_published", true)
      .order("display_order");
    if (error) throw new Error(error.message);
    return (data ?? [])
      .map((row) => toPublicProject(row as Record<string, unknown>))
      .filter((project) => project.slug);
  });
}

/**
 * Single project row by slug in **any** publication state. The detail
 * page needs the raw row (not the published-only view) to tell an
 * unpublished case study apart from one that never existed:
 * - row exists + `is_published` → render (CMS authority);
 * - row exists + unpublished → `notFound()` (never resurrected);
 * - no row → the caller may fall back to the static template demo.
 */
export function getProjectBySlug(
  slug: string,
): Promise<PublicRead<PublicProject | null>> {
  return runRead(async () => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("projects")
      .select(PROJECT_COLUMNS)
      .eq("slug", slug)
      .limit(1);
    if (error) throw new Error(error.message);
    const row = data?.[0];
    return row ? toPublicProject(row as Record<string, unknown>) : null;
  });
}

async function getSitemapEntries(
  table: "services" | "projects",
): Promise<CmsSitemapEntry[]> {
  const read = await runRead(async () => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from(table)
      .select(SEO_ENTRY_COLUMNS)
      .eq("is_published", true)
      .order("display_order");
    if (error) throw new Error(error.message);
    return (data ?? []) as { slug: string; updated_at: string }[];
  });

  if (!read.available || !read.data) return [];
  return read.data
    .filter((row) => typeof row.slug === "string" && row.slug)
    .map((row) => ({
      slug: row.slug,
      lastModified: row.updated_at ? new Date(row.updated_at) : null,
    }));
}

/** Published service slugs for the sitemap (empty → static fallback). */
export function getSitemapServiceRoutes(): Promise<CmsSitemapEntry[]> {
  return getSitemapEntries("services");
}

/** Published case-study slugs for the sitemap (empty → no entries). */
export function getSitemapProjectRoutes(): Promise<CmsSitemapEntry[]> {
  return getSitemapEntries("projects");
}

/** Blank-line-separated paragraphs of CMS long-form content. */
function splitParagraphs(content: string): string[] {
  return content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

/**
 * Hydrates a CMS row into the `ServiceDetail` shape the public catalog
 * and detail template render:
 * - text fields come from the row;
 * - empty collection fields (framework badges, deliverable checklists)
 *   fall back to the static config for the same slug so an unseeded
 *   database never renders empty card sections;
 * - `milestones` have no CMS column and always come from static config;
 * - pricing is strictly CMS-authoritative (AGENTS.md §5.5) — a null or
 *   empty note hides the block and never resurrects static copy.
 */
export function hydrateServiceDetail(row: PublicService): ServiceDetail {
  const fallback = services[row.slug];
  const paragraphs = splitParagraphs(row.fullContent);

  return {
    slug: row.slug,
    title: row.title || fallback?.title || row.slug,
    summary: row.summary || fallback?.summary || "",
    framework:
      row.framework.length > 0 ? row.framework : (fallback?.framework ?? []),
    deliverables:
      row.deliverables.length > 0
        ? row.deliverables
        : (fallback?.deliverables ?? []),
    problemContext:
      paragraphs.length > 0 ? paragraphs : (fallback?.problemContext ?? []),
    milestones: fallback?.milestones ?? [],
    pricingNote: row.pricingNote,
  };
}

/**
 * Hydrates a CMS project row into the `CaseStudyDetail` shape the
 * `/projects/[slug]` template renders. Per-field rules mirror the
 * service catalog:
 * - text fields come from the row; empty ones fall back to the static
 *   copy for the same slug (a fresh install never renders empty
 *   narrative sections for the featured case study);
 * - `scope` has no CMS column and always comes from static config;
 * - outcome prose and the static metric grid are mutually exclusive —
 *   CMS-authored `results` never mix with the demo spotlight numbers.
 */
export function hydrateProjectDetail(row: PublicProject): CaseStudyDetail {
  const fallback = caseStudies[row.slug];
  const challenge = splitParagraphs(row.challenge);
  const solution = splitParagraphs(row.solution);
  const results = splitParagraphs(row.results);

  return {
    slug: row.slug,
    title: row.title || fallback?.title || row.slug,
    summary: row.summary || fallback?.summary || "",
    client: row.clientType || fallback?.client || "",
    location: row.location || fallback?.location || "",
    scope: fallback?.scope ?? "",
    year: row.completedYear
      ? String(row.completedYear)
      : (fallback?.year ?? ""),
    challenge: challenge.length > 0 ? challenge : (fallback?.challenge ?? []),
    solution: solution.length > 0 ? solution : (fallback?.solution ?? []),
    results,
    metrics: results.length > 0 ? [] : (fallback?.metrics ?? []),
  };
}

/**
 * Builds the visible-section lookup for the homepage. Returns `null`
 * ("render every section") when the read is unavailable or no rows are
 * seeded; otherwise a set of `section_key`s — any of the nine keys
 * missing from the set was hidden (or never published) and is skipped.
 */
export function resolveVisibleSectionKeys(
  keys: string[] | null,
): Set<string> | null {
  if (!keys || keys.length === 0) return null;
  return new Set(keys);
}

export interface PublicFaqItem {
  question: string;
  answer: string;
}

/**
 * Fail-safe FAQ items fetcher with Alderline static fallback.
 * Allows future CMS management of questions while preserving Alderline's content.
 */
export async function getFaqs(): Promise<PublicRead<PublicFaqItem[]>> {
  const read = await runRead(async () => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("faqs")
      .select("question, answer, display_order")
      .order("display_order");
    if (error) throw new Error(error.message);
    return (data ?? []) as PublicFaqItem[];
  });

  if (!read.available || !read.data || read.data.length === 0) {
    return {
      available: read.available,
      data: faqContent.items.map((i) => ({ question: i.q, answer: i.a })),
    };
  }

  return read;
}

/**
 * Fail-safe published articles fetcher with Alderline static fallback.
 * Exposes blog data for public routing and future headless article management.
 */
export async function getPublishedArticles(): Promise<PublicRead<BlogPost[]>> {
  return {
    available: true,
    data: allBlogPosts,
  };
}

