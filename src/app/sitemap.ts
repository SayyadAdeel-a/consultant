import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/env";

/**
 * Sitemap generation. Static routes are listed here; when the CMS schema
 * lands (Phase 6), published service pages must be appended from the
 * database so new pages are discoverable without code changes.
 */
export default function sitemap(): MetadataRoute.Sitemap {
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

  // Phase 6+: append published service routes from Supabase here.
  const cmsRoutes: MetadataRoute.Sitemap = [];

  return [...staticRoutes, ...cmsRoutes];
}
