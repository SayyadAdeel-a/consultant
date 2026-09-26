import { Fraunces, Source_Sans_3 } from "next/font/google";

/**
 * Typography system (see docs/DESIGN_SYSTEM.md).
 *
 * - Heading/display typeface: Fraunces (editorial serif)
 * - Body/UI typeface: Source Sans 3 (readable humanist sans)
 *
 * Fonts are self-hosted by next/font (no runtime requests to Google) and
 * exposed as CSS variables consumed by globals.css tokens.
 */
export const headingFont = Fraunces({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  axes: ["SOFT", "WONK"],
});

export const bodyFont = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const fontVariables = `${headingFont.variable} ${bodyFont.variable}`;
