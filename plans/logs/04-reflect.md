# Phase 4: REFLECT Log (Iteration 4)

**Date**: 2026-02-13
**Executor**: Single Agent
**Status**: COMPLETE
**Previous Refine**: `05-refine.md` (iteration 3)

---

## A. Projects Section Overhaul — Reference-Inspired Redesign

### Reference Analysis

**AVA SRG** — Full-viewport immersive project cards:
- Each project occupies near-full viewport height
- Large hero image with minimal overlay text
- Bold uppercase project title + category label
- Scroll-driven transitions between projects
- Award badges / external platform links overlaid on images

**Edwin Le** — Case-study narrative cards:
- Large featured image (full-width, 16:9)
- Clear metadata below: client name, role, year
- Structured subtitle describing scope
- Minimal text — lets images speak
- Clicking opens a dedicated case study page with narrative sections

**Common premium patterns**:
- Images are HUGE (full-width or near-full-width) — not tiny laptop mockups
- Project title typography is bold and large
- Metadata (role, year, tech) is subdued/small
- Hover reveals additional info (description, link)
- Visual hierarchy: Image first → Title → Metadata → CTA

### Current State Problems

1. **Laptop mockup is small and gimmicky** — CSS laptop frame at 70%/280px max feels like a novelty rather than showcasing the work. Reference sites use large, borderless images.
2. **Card layout is cramped** — title, subtitle, tech tags, features list, and Read More all stacked in a small `p-6` area. Information overload.
3. **No project numbering or sequencing** — Reference sites show "01", "02" etc. for editorial feel.
4. **Features list is a bulleted dump** — Not premium. Reference sites show 1-2 lines max, or hide details behind interaction.
5. **"Read More" expand/collapse is clunky** — Inline expanding text in a card is a weak pattern. Reference sites use dedicated pages or elegant overlays.
6. **No hover image reveal or transition** — Cards are static. Reference sites reveal images with clip-path, scale, or opacity transitions.
7. **accentColor per project is unused effectively** — Only used on tiny feature dots.

---

## B. Hero Subtitle Contrast & Readability

### Current State

- Hero subtitle: `text-sm font-medium uppercase tracking-[0.2em] text-text-secondary`
- `text-text-secondary` resolves to `#14213d` (navy) on white/transparent bg
- With geometric shapes floating behind and `via-transparent` in the overlay, the subtitle can become hard to read when shapes overlap

### Required Fix

- Increase subtitle weight/size for better readability
- Add a subtle text-shadow or bg-pill behind subtitle to ensure contrast over 3D shapes
- Consider `text-navy` explicitly rather than `text-text-secondary`

---

## C. Full Codebase Weak Points (Audit)

### Critical
| # | Issue | File | Impact |
|---|-------|------|--------|
| 1 | `ParticleField.tsx` still exists (dead code) | `src/components/three/ParticleField.tsx` | Confusion, bundle bloat if imported |
| 2 | `layout.tsx` hardcodes `className="light"` — ThemeProvider then overrides on client | `src/app/layout.tsx` | Flash of wrong theme on load |
| 3 | Expandable buttons lack `aria-expanded` attribute | `Projects.tsx`, `Experience.tsx` | Accessibility violation |

### High
| # | Issue | File |
|---|-------|------|
| 4 | Navigation has duplicate scroll progress bar (one in Nav, one via ScrollProgress component in layout) | `Navigation.tsx`, `layout.tsx` |
| 5 | `About.tsx` hardcodes skills and stats arrays — should be in data files | `About.tsx` |
| 6 | Several unused components: `PageTransition`, `AnimatedButton`, `NavLinkUnderline`, `HoverCard`, `ParallaxCard`, `DeviceMockup` | Various |
| 7 | `Experience.tsx` timeline dot uses `group-hover` but parent div lacks `group` class | `Experience.tsx` line 18 |
| 8 | Project image paths may not exist (e.g. `/images/react.png`) — no fallback | `projects.ts` |

### Medium
| # | Issue | File |
|---|-------|------|
| 9 | `Contact.tsx` email link missing `aria-label` | `Contact.tsx` |
| 10 | First project mentions "React-Bootstrap" in features but tech stack doesn't include it | `projects.ts` |
| 11 | `RevealOnScroll` cleanup kills ALL ScrollTriggers, not just its own | `RevealOnScroll.tsx` line 83 |
| 12 | Marquee keywords hardcoded instead of in data file | `Marquee.tsx` |

---

## D. Priority Items for REFINE Iteration 4

### Projects Overhaul (Primary)
1. Redesign project cards: large full-width images, bold title, subdued metadata
2. Add project numbering ("01", "02", etc.)
3. Replace laptop mockup with full-bleed image (edge-to-edge inside card)
4. Remove inline features list — move description to hover overlay or keep minimal
5. Replace expand/collapse with hover-reveal overlay showing description + CTA link
6. Add image hover transitions (scale + subtle clip-path or overlay reveal)
7. Staggered alternating layout (image left/right) for visual rhythm
8. Use `accentColor` as a decorative accent stripe or border on each card

### Hero Subtitle Fix
9. Increase subtitle size and add text-shadow for contrast over 3D scene

### Codebase Cleanup
10. Delete `ParticleField.tsx`
11. Remove duplicate scroll progress from Navigation (keep ScrollProgress component)
12. Add `aria-expanded` to expandable buttons
13. Fix Experience timeline `group` class
14. Move About skills/stats to data files
15. Add `aria-label` to Contact email link
16. Fix first project data (React-Bootstrap mention)
