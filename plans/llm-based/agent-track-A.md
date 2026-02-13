# Agent Track A -- Infrastructure & Core Pages

## Overview
Track A handles project scaffolding, configuration, data layer, and all section component markup/layout. Track A must complete steps 1-4 before Track B can integrate animation systems.

## Prerequisites
- Node.js 18+ installed
- pnpm installed globally (`npm i -g pnpm`)

---

## Task A1: Project Initialization

1. From the repo root, initialize a new Next.js 15 project:
   ```bash
   pnpm create next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --turbopack
   ```
   Note: Since the repo already has files, either use a temp directory and move, or use `--force`.

2. Ensure `package.json` has these dependencies:
   ```json
   {
     "dependencies": {
       "next": "^15",
       "react": "^19",
       "react-dom": "^19",
       "zustand": "latest",
       "framer-motion": "^11",
       "gsap": "^3.14",
       "lenis": "latest",
       "@react-three/fiber": "^9",
       "@react-three/drei": "latest",
       "three": "latest"
     },
     "devDependencies": {
       "typescript": "^5",
       "@types/react": "^19",
       "@types/node": "latest",
       "@tailwindcss/postcss": "^4",
       "tailwindcss": "^4",
       "eslint": "latest",
       "eslint-config-next": "latest",
       "prettier": "latest",
       "prettier-plugin-tailwindcss": "latest"
     }
   }
   ```

3. Configure `next.config.ts`:
   ```typescript
   import type { NextConfig } from 'next';
   const nextConfig: NextConfig = {
     transpilePackages: ['three'],
     images: {
       formats: ['image/avif', 'image/webp'],
     },
   };
   export default nextConfig;
   ```

4. Configure `postcss.config.mjs` for Tailwind CSS v4:
   ```javascript
   export default {
     plugins: {
       '@tailwindcss/postcss': {},
     },
   };
   ```

5. Configure `src/app/globals.css` with Tailwind v4 CSS-first config:
   ```css
   @import "tailwindcss";

   @theme {
     --color-bg-primary: #0a0a0a;
     --color-bg-secondary: #111111;
     --color-bg-elevated: #1a1a1a;
     --color-text-primary: #fafafa;
     --color-text-secondary: #a1a1a1;
     --color-text-muted: #666666;
     --color-accent: #6366f1;
     --color-accent-hover: #818cf8;
     --color-border: #262626;
     --font-sans: 'Inter', sans-serif;
     --font-display: 'Satoshi', sans-serif;
   }
   ```

---

## Task A2: Font Setup & Root Layout

1. Create `src/app/layout.tsx`:
   - Import Inter and Satoshi fonts (use `next/font/google` for Inter, local font file for Satoshi or use `next/font/google` if available)
   - Set `<html lang="en" className="dark">` for dark mode default
   - Include metadata: title, description, Open Graph, Twitter cards
   - Wrap children in theme provider context
   - Include Lenis provider (from Track B -- leave placeholder)

2. Create `src/app/page.tsx`:
   - Import and render all section components in order:
     Hero, About, Experience, Projects, Education, Contact
   - Each section wrapped in `<section>` with `id` for scroll navigation

---

## Task A3: Data Layer Migration

1. Create `src/data/experience.ts`:
   ```typescript
   export interface ExperienceItem {
     id: number;
     company: string;
     role: string;
     period: string;
     description: string;
     details: string;
     href: string;
     logo?: string;
   }
   export const experiences: ExperienceItem[] = [
     // Migrate from list.json variant === "experience"
   ];
   ```

2. Create `src/data/projects.ts`:
   ```typescript
   export interface ProjectItem {
     id: number;
     title: string;
     subtitle: string;
     techStack: string[];
     features: string[];
     description: string;
     details: string;
     image: string;
     href?: string;
     accentColor: string;
   }
   export const projects: ProjectItem[] = [
     // Migrate from list.json variant === "project"
   ];
   ```

3. Create `src/data/education.ts`:
   ```typescript
   export interface EducationItem {
     id: number;
     institution: string;
     period: string;
     achievements: string[];
     href?: string;
   }
   export const education: EducationItem[] = [
     // Migrate from list.json variant === "education"
   ];
   ```

4. Create `src/data/personal.ts`:
   ```typescript
   export const personal = {
     name: 'Conor Douglas',
     title: 'Full Stack Engineer',
     bio: '...', // Write a professional bio
     email: 'conordouglas01@gmail.com',
     linkedin: 'https://www.linkedin.com/in/conordouglas/',
     github: 'https://github.com/VFConz',
     profileImage: '/images/profile.png',
   };
   ```

---

## Task A4: Section Components (Layout Only)

All components go in `src/components/sections/`.

### Hero.tsx
- Full viewport height (`h-screen`)
- Centered content: name (display text), title, scroll CTA
- Social link buttons (LinkedIn, GitHub)
- Placeholder for 3D canvas (Track B)
- Placeholder for kinetic text animation (Track B)

### About.tsx
- Two-column layout: profile image left, bio text right
- Stats row below: animated counters placeholder (Track B)
- Skills/technology tags

### Experience.tsx
- Vertical timeline layout
- Each item: company logo, role, period, description
- Expandable detail on click
- Staggered reveal placeholder (Track B)

### Projects.tsx
- Grid of project cards (2 columns desktop, 1 mobile)
- Each card: device mockup frame (Track B), title, subtitle, tech tags, links
- Modal or expandable detail view

### Education.tsx
- Card layout, 2 columns
- Institution name, period, achievements list
- Subtle animations placeholder (Track B)

### Contact.tsx
- Centered glass-morphism card
- Social links: LinkedIn, GitHub, Email
- Optional: contact form with name, email, message
- Animated background element placeholder (Track B)

---

## Task A5: Navigation Component

Create `src/components/Navigation.tsx`:
- Desktop: Fixed left sidebar or top bar with section links
- Active section highlighting (via Zustand scroll state)
- Mobile: Hamburger button + full-screen overlay menu (Framer Motion)
- Scroll progress indicator bar
- Theme toggle button (dark/light)

---

## Task A6: SEO & Metadata

1. Configure `src/app/layout.tsx` metadata:
   ```typescript
   export const metadata: Metadata = {
     title: 'Conor Douglas | Full Stack Engineer',
     description: 'Portfolio of Conor Douglas...',
     openGraph: { ... },
     twitter: { ... },
   };
   ```

2. Create `src/app/sitemap.ts` for dynamic sitemap generation
3. Create `src/app/robots.ts` for robots.txt
4. Add favicon and apple-touch-icon to `src/app/`

---

## Task A7: Responsive Design

- Tailwind breakpoints: sm (640), md (768), lg (1024), xl (1280), 2xl (1536)
- Mobile-first approach
- Test all components at 375px, 768px, 1024px, 1440px, 1920px
- Navigation collapses to hamburger below `lg`
- Project grid: 1 col on mobile, 2 on desktop
- Hero text scales down proportionally
- Device mockups hide on mobile, show project images directly

---

## Completion Criteria
- All pages render without errors
- All data displays correctly from TypeScript modules
- Responsive at all breakpoints
- Navigation links scroll to correct sections
- SEO metadata renders in `<head>`
- Ready for Track B to add animations
