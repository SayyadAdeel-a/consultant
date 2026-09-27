import type { MetadataRoute } from "next";
import { serviceList } from "@/config/services";
import { getSiteUrl } from "@/lib/env";
import {
  getSitemapProjectRoutes,
  getSitemapServiceRoutes,
} from "@/lib/data/public";

/**
 * Sitemap generation (docs/TASKS.md Task 9.1).
 *
 * Static routes are listed here; published service and case-study pages
 * are appended from Supabase (anon client, `is_published = TRUE` only)
 * with `updated_at` as `lastModified`. When Supabase is unconfigured or
 * returns nothing, the static `serviceList` keeps every demo service
 * discoverable — the sitemap never fails.
 *
 * Revalidates hourly so newly published records reach crawlers without
 * a redeploy (admin edits also purge this route on service/project
 * saves via `revalidatePath`).
 */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      changeFrequency: "monthly",
      priority: 1,
      lastModified: now,
    },
    {
      url: `${base}/services`,
      changeFrequency: "monthly",
      priority: 0.9,
      lastModified: now,
    },
    {
      url: `${base}/contact`,
      changeFrequency: "yearly",
      priority: 0.7,
      lastModified: now,
    },
  ];

  // Published service pages: CMS slugs first, static catalog as fallback.
  const cmsServices = await getSitemapServiceRoutes();
  const serviceEntries = cmsServices.length
    ? cmsServices
    : serviceList.map((service) => ({
        slug: service.slug,
        lastModified: null,
      }));

  const serviceRoutes: MetadataRoute.Sitemap = serviceEntries.map(
    ({ slug, lastModified }) => ({
      url: `${base}/services/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      lastModified: lastModified ?? undefined,
    }),
  );

  // Published case studies (empty when unconfigured or unseeded).
  const projectRoutes: MetadataRoute.Sitemap = (
    await getSitemapProjectRoutes()
  ).map(({ slug, lastModified }) => ({
    url: `${base}/projects/${slug}`,
    changeFrequency: "yearly" as const,
    priority: 0.6,
    lastModified: lastModified ?? undefined,
  }));

  return [...staticRoutes, ...serviceRoutes, ...projectRoutes];
}
