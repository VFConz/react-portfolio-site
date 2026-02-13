# Phase 1: RESEARCH Log

**Date**: 2026-02-13
**Executor**: Single Agent
**Status**: COMPLETE

---

## 1. Reference Site Tech Stack Analysis

### graffico.it
- **Framework**: Next.js (confirmed via `/_next/` asset paths and page source)
- **Styling**: Tailwind CSS utility classes + custom CSS
- **Images**: `next/image` optimization (`/_next/image?url=...&w=3840&q=75`)
- **Hosting**: Vercel (inferred from Next.js conventions)
- **Content**: Headless CMS (Contentful -- images served from `images.ctfassets.net`)
- **Design Patterns**:
  - Dark theme with premium serif + sans-serif type pairing
  - Horizontal scrolling portfolio showcase with device mockups (MacBook + iPhone frames)
  - Animated statistics counters with number rolling effects
  - Testimonial carousel with quote cards
  - Scroll-based section reveals with staggered element entry
  - Sticky sections with parallax scroll effects
  - Glass-morphism contact form
  - FAQ accordion with smooth expand/collapse
  - Marquee text ticker for category tags
  - Responsive: mobile hamburger nav, stacked layout on small screens

### AVA SRG (srg.ava-digital.site)
- **Framework**: Custom build (not a standard framework -- appears custom bundled)
- **Animation**: GSAP with ScrollTrigger (confirmed via Awwwards tech listing: "WebGL, ScrollTrigger")
- **3D/WebGL**: Custom WebGL shaders for background effects
- **Awards**: CSSDA Website of the Day (score 8.20/10), Awwwards Nominee (Feb 2026)
- **Design Patterns**:
  - Full-viewport hero with animated counter/number display
  - Bold oversized typography (100px+ headings)
  - Kinetic text animations triggered on scroll
  - Team member carousel with photo cards and expand/collapse interaction
  - One-page scroll-driven narrative structure
  - Dark palette (#0a0a0a base) with high-contrast white text
  - Accent colors for interactive elements
  - Student work project carousel with category filtering
  - Custom cursor interactions
  - Smooth scroll with inertia/momentum
  - Navigation overlay menu with staggered link reveals

### edwinle.com
- **Framework**: Framer (no-code/low-code platform)
- **Awards**: CSS Design Awards Special Kudos (Jan 2026, score 7.51/10)
- **Design Patterns**:
  - Clean, minimal portfolio layout
  - Case study pages with scroll-based content reveals
  - Smooth page transitions between work items
  - Professional timeline/experience section
  - Restrained, purposeful micro-interactions
  - Client/year/services metadata on case study pages
  - Muted color palette with selective accent use
  - Typography-driven hierarchy
  - Mobile-responsive with adaptive layouts

---

## 2. Technology Research

### Next.js 15 (Stable, Oct 2024)
- **React 19** support with Server Components by default
- **Turbopack** dev server (stable) -- 5x faster HMR
- **Async Request APIs**: `cookies`, `headers`, `params` now async
- **Caching changes**: `fetch` no longer cached by default
- **`next/form`** component for enhanced client-side forms
- **TypeScript `next.config.ts`** support
- **Instrumentation API** for server lifecycle hooks
- **App Router** with file-system routing, layouts, loading/error UI

### GSAP 3.14.2 (Dec 2025)
- **100% FREE** for all use cases (thanks to Webflow acquisition)
- **ScrollTrigger**: Link animations to scroll position, pin, scrub, snap
- **ScrollSmoother**: Native-scroll-based smooth scrolling
- **SplitText**: Character/word/line splitting for text animations
- **Key techniques researched**:
  - Dual-wave text animations with `quickTo` (Codrops Jan 2026)
  - 3D scroll-driven text with CSS transforms (Codrops Nov 2025)
  - Character-level staggered animations for kinetic typography
  - Middle-out sequencing for hero text reveals

### Framer Motion 11.11.4 (Latest stable)
- Rebranded as "Motion for React"
- **Layout animations**: Automatic size/position animation via `layout` prop
- **Shared element transitions**: `layoutId` for cross-component morphing
- **AnimatePresence**: Exit animations for unmounting components
- **Gesture support**: drag, tap, hover, pan
- **Scroll animations**: `useScroll`, `useTransform` hooks
- **Hardware-accelerated**: Uses CSS transforms, no React re-renders during animation

### React Three Fiber v9.5.0 (Dec 2025)
- Compatible with React 19 and Next.js 15
- Configure `transpilePackages: ['three']` in `next.config.ts`
- Particle system options: r3f-particle-system (FBO), Three.Quarks, or custom Points geometry
- Use `@react-three/drei` for helpers (OrbitControls, Stars, Float, etc.)
- Canvas renders in client component (`'use client'`)

### Tailwind CSS v4.0 (Jan 2025)
- **CSS-first configuration**: No `tailwind.config.js` -- customize in CSS
- **5x faster** full builds, 100x faster incremental
- **CSS theme variables**: All tokens as native `--tw-*` custom properties
- **Built-in imports**: No PostCSS import plugins needed
- **Container queries**: First-class support
- **3D transforms**: Utility classes for 3D
- **`@starting-style`** variant for entry animations
- **P3 color palette**: Vivid, modern color space
- First-party Vite plugin: `@tailwindcss/vite`
- For Next.js: use `@tailwindcss/postcss` plugin

### Lenis (Latest, darkroom.engineering)
- Lightweight smooth scroll library (13k+ GitHub stars)
- GSAP integration: `lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker.add`
- React wrapper: `ReactLenis` from `lenis/react`
- Respects `prefers-reduced-motion`
- Configurable damping, easing, duration
- Essential CSS: `html.lenis { height: auto; scroll-behavior: auto !important; }`

### Zustand (Latest, pmndrs)
- Lightweight state management for React
- Next.js 15 compatible with `'use client'` directive
- `persist` middleware for localStorage (theme preferences)
- No providers/context needed -- hook-based API
- TypeScript-first with generics

### pnpm
- Strict dependency resolution (no phantom dependencies)
- Faster installs via content-addressable storage
- Disk space efficient (symlinked `node_modules`)

---

## 3. Design Language Document

### Color Palette (Dark Theme Primary)
Inspired by graffico.it and AVA SRG:

| Token          | Value       | Usage                          |
|----------------|-------------|--------------------------------|
| `bg-primary`   | `#0a0a0a`  | Page background                |
| `bg-secondary` | `#111111`  | Card/section backgrounds       |
| `bg-elevated`  | `#1a1a1a`  | Hover states, elevated surfaces|
| `text-primary` | `#fafafa`  | Headings, primary text         |
| `text-secondary`| `#a1a1a1` | Body text, descriptions        |
| `text-muted`   | `#666666`  | Labels, metadata               |
| `accent`       | `#6366f1`  | Interactive elements (indigo)  |
| `accent-hover` | `#818cf8`  | Hover state for accent         |
| `border`       | `#262626`  | Subtle borders, dividers       |
| `glass`        | `rgba(255,255,255,0.05)` | Glass-morphism panels |

### Typography Scale
Inspired by AVA SRG bold typography + edwinle.com clean hierarchy:

| Level    | Size (desktop) | Weight | Font               |
|----------|----------------|--------|--------------------|
| Display  | 80-120px       | 700    | Satoshi / Inter    |
| H1       | 56-72px        | 700    | Satoshi            |
| H2       | 36-48px        | 600    | Satoshi            |
| H3       | 24-32px        | 600    | Inter              |
| Body     | 16-18px        | 400    | Inter              |
| Small    | 14px           | 400    | Inter              |
| Caption  | 12px           | 500    | Inter (uppercase)  |

### Spacing System
8px base unit: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192

### Motion Principles
1. **Purposeful**: Every animation serves navigation or comprehension
2. **Smooth**: 60fps minimum, GPU-accelerated transforms only
3. **Scroll-driven**: Key reveals tied to scroll position (GSAP ScrollTrigger)
4. **Staggered**: Group elements enter sequentially (40-80ms stagger)
5. **Easing**: `power3.out` for entrances, `power2.inOut` for transitions
6. **Duration**: 0.6-1.2s for section reveals, 0.3-0.5s for micro-interactions
7. **Reduced motion**: Respect `prefers-reduced-motion`, disable non-essential animations

### Component Patterns
- **Glass cards**: `backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl`
- **Magnetic buttons**: Cursor-following translation on hover (GSAP quickTo)
- **Device mockups**: CSS-only MacBook/iPhone frames with project screenshots
- **Kinetic text**: SplitText + staggered character animation on scroll
- **Scroll indicators**: Animated down-arrow with loop, fades on scroll

---

## 4. Content Inventory (from existing site)

### Personal Info
- **Name**: Conor Douglas
- **Title**: Full Stack Engineer
- **LinkedIn**: https://www.linkedin.com/in/conordouglas/
- **GitHub**: https://github.com/VFConz
- **Email**: conordouglas01@gmail.com
- **Profile Image**: properPic.png
- **Background Image**: background_landscape.jpg

### Experience (1 item)
- Magnite Belfast -- Software Engineer (Placement Year)

### Projects (6 items)
1. Portfolio Website (React & Node.JS)
2. Govanopoly (Java Game)
3. Largest-Clock-Angle (C++)
4. Escape the Titanic (HTML/CSS/JS)
5. School Web-Dev Portfolio (HTML/CSS/JS)
6. Minesweeper CLI Game (Kotlin)

### Education (2 items)
1. Queen's University Belfast (2021-2025)
2. St Patrick's Grammar School (2013-2020)

---

**Research phase complete. All findings documented. Proceeding to DESIGN phase.**
