import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Keep authenticated areas and admin surfaces out of search indexes.
      disallow: ["/admin", "/admin/*", "/api/*"],
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
