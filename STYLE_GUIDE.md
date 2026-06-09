# Portugal Real Estate for Sale — Design System (locked)

The reference for **all future builds** of portugalrealestateforsale.com. New pages,
sections, and components must match this. When in doubt, copy an existing pattern
rather than invent a new one.

## Aesthetic in one line
Quiet editorial real-estate directory: serif display + sans body, a neutral
cream/white palette with a single terracotta accent, hairline borders, **sharp
corners (border-radius: 0)**, generous whitespace, and honest mid-page lead-capture CTAs.

## Tech
- **Astro 5, static output, zero-React.** Tailwind is installed but layout is done
  with **inline styles + the design tokens** in `src/styles/globals.css`. Interactivity
  is small vanilla-JS `<script>` blocks (re-init on `astro:page-load`).
- Self-hosted fonts via `@fontsource/prata` and `@fontsource/inter` (no Google CDN).
- Deployed on Vercel; `vercel.json` pins `framework: astro`.

## Design tokens (`src/styles/globals.css :root`)
```
--bg #ffffff   --surface #fefcfa   --cream #fdfaf6
--accent #c2622a (terracotta)   --accent-h #a8521f
--ink #1a1a1a   --secondary #5c5c5c   --muted #8a8a8a
--border #ddd8d0
--pad 5vw   --nav-h 66px
```
Always use the tokens. Never hardcode a raw hex next to a token that already exists.

## Typography
- **Headings:** Prata serif, weight 400, line-height ~1.15. Use `clamp()` for fluid sizes.
- **Body:** Inter, 14px base, line-height 1.6.
- **Section label:** `.section-label` — 11px, weight 600, letter-spacing 2px, uppercase, `--muted`.

## Buttons (`.btn` in globals.css)
Uppercase, letter-spacing, **radius 0**, padding 13px 26px. Variants:
`.btn-primary` (ink), `.btn-accent` (terracotta), `.btn-ghost` (ink outline),
`.btn-ghost-light` (for dark/image backgrounds). Reuse these — do not add new button styles.

## Icons (locked spec)
- **Inline SVG only** (no icon library — keeps it zero-dependency/static). Define in an
  `ICONS` record in the page frontmatter, render with `set:html`.
- **Hairline thin-line, Lucide-style:** `viewBox="0 0 24 24"`, `fill="none"`,
  `stroke="currentColor"`, **`stroke-width="1.25"`**, round caps/joins.
- Prefer the **simplest geometric glyph** (e.g. circle-check over a detailed shield).
- Sizes: ~22px in step rows (ink color), ~26px in feature cards (accent color).
- **Gotcha:** Astro scoped styles do NOT reach SVGs injected via `set:html`. Size them
  with `:global(svg)` inside the scoped block, e.g. `.feature-icon :global(svg){width:22px}`.

## Layout & responsive
- Sections lay out with inline `display:grid;grid-template-columns:repeat(N,1fr)` plus a
  **class hook** (`how-grid`, `listings-grid`, `regions-panel`, `value-cards`, `case-grid`,
  `faq-grid`, `guidance-grid`).
- Responsive rules live in each component's scoped `<style>` and **must use `!important`**
  to override the inline `grid-template-columns`. Breakpoints:
  - **900px** → multi-col collapses to 2-col; two-column text+image sections go single-col.
  - **560–640px** → 1-col.
- **Nav** (`Nav.astro`): desktop links hide below **760px**; a hamburger toggles a
  sticky dropdown (`.nav-mobile`). Never put `style="display:flex"` inline on the desktop
  nav — it overrides the responsive hide.
- Footer grid stacks at 640px.

## Imagery
- AI-generated (MiniMax), **hyper-realistic, natural daylight, no orange/HDR cast**,
  faithful real Portugal scenes. Optimized `.jpg` in `public/images/` (full-res PNGs are gitignored).
- Don't reuse hero-slideshow images in other sections — pick a distinct image.

## Content accuracy (keep current)
- **NHR** closed to new applicants end of 2023; replaced by **IFICI ("NHR 2.0")**. Don't
  describe NHR as currently open.
- The Golden Visa real-estate route is gone → say **"Residency & Visa Options"**, not "Golden Visa Program."
- No em dashes in copy.

## Deploy
1. `npm run build` to verify locally.
2. Commit + push to `main` (`github.com/filipelinsduarte/portugal-real-estate`).
3. `vercel --prod --yes` — **run unsandboxed**; the upload times out under the command sandbox.
4. Verify both apex and `www` of portugalrealestateforsale.com serve the new build.
