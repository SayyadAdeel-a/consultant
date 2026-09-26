/**
 * Brand fallbacks. At runtime the public site resolves branding from the
 * `site_settings` table (managed via /admin/settings); these values are the
 * compile-time defaults used when the CMS has no configured overrides.
 */
export const brand = {
  colors: {
    forestGreen: "#153E35",
    warmIvory: "#F8F7F2",
    sage: "#A7BBA3",
    charcoal: "#252B29",
  },
  assets: {
    /** Local fallback logo served from /public. CMS uploads override this. */
    logo: "/images/logo.svg",
    icon: "/images/icons/favicon.ico",
  },
} as const;
