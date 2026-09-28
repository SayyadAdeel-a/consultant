import { Fraunces, Source_Sans_3, Inter } from "next/font/google";

/**
 * Typography system (see docs/DESIGN_SYSTEM.md).
 *
 * - Alderline Primary Typeface: Inter (sans)
 * - Heading/display typeface: Fraunces (editorial serif)
 * - Body/UI fallback: Source Sans 3 (humanist sans)
 */
export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

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

export const fontVariables = `${inter.variable} ${headingFont.variable} ${bodyFont.variable}`;
