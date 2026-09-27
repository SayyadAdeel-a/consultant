import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Modern formats first (Task 9.1 / Core Web Vitals): next/image
    // negotiates AVIF, then WebP, for any media the CMS renders on
    // public pages. The template currently ships no photography, so this
    // is forward-looking configuration verified by tests/ui/sitemap-seo.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
