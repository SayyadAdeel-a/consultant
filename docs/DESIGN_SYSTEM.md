# IntegraVity — Design System & Visual Specification

## 1. Visual Philosophy: Editorial, Nature-Inspired & Authoritative

IntegraVity rejects generic SaaS UI tropes (vibrant neon gradients, purple shadows, overused pill-shaped badges, and distracting floating 3D shapes). Instead, it adopts the aesthetic of high-end architectural monographs and scientific conservation journals:

- **Quiet Confidence**: Generous negative space, disciplined typography, and structured grid alignments.
- **Natural Organic Tones**: Colors derived directly from coastal marshes, ancient forests, and geological sediment.
- **Editorial Typography**: Large, authoritative serif/display headings paired with crisp, high-legibility grotesque sans body copy.
- **Restrained Motion**: Subtle micro-interactions that communicate state without distracting from technical content.

---

## 2. Core Color Palette & Design Tokens

Design tokens are declared in `src/app/globals.css` using modern CSS variables with OKLCH equivalents for superior perceptual uniformity:

| Token Name       | Hex Code  | OKLCH Equivalent           | Semantic Purpose                                                               |
| :--------------- | :-------- | :------------------------- | :----------------------------------------------------------------------------- |
| **Forest Green** | `#153E35` | `oklch(0.332 0.049 176.3)` | Primary brand color, hero backgrounds, primary buttons, authoritative callouts |
| **Warm Ivory**   | `#F8F7F2` | `oklch(0.976 0.007 97.4)`  | Default page background, providing a warm, paper-like tactile feel             |
| **Sage**         | `#A7BBA3` | `oklch(0.77 0.04 140.5)`   | Accent borders, secondary badges, subtle highlighting, natural contrast        |
| **Charcoal**     | `#252B29` | `oklch(0.282 0.009 173.6)` | High-contrast body typography, headlines on light backgrounds, dark footer     |

### Additional Theme Tokens

- `--muted`: `oklch(0.959 0.01 131.4)` (Subtle container backgrounds, card borders)
- `--muted-foreground`: `oklch(0.555 0.036 166.1)` (Secondary metadata, captions, timestamps)
- `--border`: `oklch(0.913 0.017 137)` (Refined 1px card and section borders)
- `--card`: `oklch(1 0 0)` (Pure clean white elevated content cards)

---

## 3. Typography Hierarchy

Fonts are configured in `src/config/fonts.ts` and loaded with zero layout shift via `next/font`:

- **Heading Font (`--font-heading`)**: Refined display font with editorial character.
- **Body Font (`--font-sans`)**: Neutral, highly legible grotesque sans (Geist Sans / Inter).
- **Monospace Font (`--font-mono`)**: Technical metrics, coordinates, parcel IDs, and code blocks.

### Typography Scale & Utility Classes

- `text-display-xl`: `clamp(2.75rem, 6vw, 4.75rem)` — Hero title (line-height: 1.05, tracking: -0.02em).
- `text-display-lg`: `clamp(2.25rem, 4.5vw, 3.5rem)` — Section headings (line-height: 1.1, tracking: -0.02em).
- `text-display-md`: `clamp(1.75rem, 3vw, 2.5rem)` — Subsections and card headlines (line-height: 1.15).
- `text-eyebrow`: `0.8125rem` — Uppercase tracking tag (font-weight: 600, tracking: 0.14em).
- `body-lg`: `1.125rem` (18px) — Lead paragraphs and summaries.
- `body-base`: `1rem` (16px) — Standard editorial body copy.
- `caption`: `0.875rem` (14px) — Secondary metadata, regulatory citations, footnotes.

---

## 4. Spacing & Container Scale

IntegraVity uses standardized layout containers declared in `globals.css`:

### 4.1 `.container-editorial`

- Maximum width: `80rem` (1280px).
- Horizontal padding: `1.5rem` (24px) mobile, scaling to `2.5rem` (40px) at `1024px+`.
- Purpose: Primary wrapper for navigation, heroes, service grids, and footers.

### 4.2 `.container-prose`

- Maximum width: `44rem` (704px).
- Horizontal padding: `1.5rem`.
- Purpose: Case study narratives, service scope descriptions, and long-form compliance articles.

---

## 5. Component Guidelines & shadcn/ui

We standardize on **shadcn/ui** components located in `src/components/ui/` with the `base-nova` preset:

- **Button (`Button`)**:
  - `default`: Deep Forest Green background with Warm Ivory text.
  - `secondary`: Warm Ivory background with Charcoal text and Sage border.
  - `outline`: 1px border with subtle hover background fill.
  - `ghost`: Borderless with subtle hover background highlight.
- **Card (`Card`)**:
  - Clean 1px border in `--border`, subtle hover transition (`transition-all duration-300`).
  - No heavy drop-shadows; elevation is achieved through crisp 1px borders and contrasting background tones.
- **Inputs & Textareas**:
  - Crisp border with 2px focus ring using `--ring`. High contrast for WCAG AA compliance.

---

## 6. Motion & Animation Standards

Animations must enhance usability rather than demand attention:

1. **Duration**: Fast and natural (200ms to 400ms).
2. **Easing**: `cubic-bezier(0.16, 1, 0.3, 1)` (out-expo) for natural physical settling.
3. **Scroll Reveal**: Elements fade in with a slight vertical translation (`y: 16px -> 0px`).
4. **MANDATORY Reduced Motion Compliance**:
   - `globals.css` forces all transitions to `0.01ms` when `@media (prefers-reduced-motion: reduce)` is active.
   - All Motion components must inspect `useReducedMotion()` from `motion/react` and render static markup when requested.
