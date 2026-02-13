# Agent Track B -- Animations, 3D & Polish

## Overview
Track B handles all animation systems, 3D rendering, smooth scroll, micro-interactions, and visual polish. Track B depends on Track A completing tasks A1-A4 (project scaffold and section components exist).

## Dependency
- Track A must complete A1 (project init) and A2 (layout) before Track B starts GSAP/Lenis setup
- Track A must complete A4 (section components) before Track B adds scroll-triggered animations

---

## Task B1: GSAP + ScrollTrigger Setup

1. Create `src/lib/gsap.ts` -- GSAP plugin registration:
   ```typescript
   'use client';
   import { gsap } from 'gsap';
   import { ScrollTrigger } from 'gsap/ScrollTrigger';

   if (typeof window !== 'undefined') {
     gsap.registerPlugin(ScrollTrigger);
   }

   export { gsap, ScrollTrigger };
   ```

2. Create `src/hooks/useGsap.ts` -- Reusable GSAP animation hook:
   ```typescript
   import { useEffect, useRef } from 'react';
   import { gsap, ScrollTrigger } from '@/lib/gsap';

   export function useGsapScrollTrigger(
     animation: (el: HTMLElement, tl: gsap.core.Timeline) => void,
     deps: any[] = []
   ) {
     const ref = useRef<HTMLElement>(null);
     useEffect(() => {
       if (!ref.current) return;
       const tl = gsap.timeline({
         scrollTrigger: {
           trigger: ref.current,
           start: 'top 80%',
           end: 'bottom 20%',
           toggleActions: 'play none none reverse',
         },
       });
       animation(ref.current, tl);
       return () => { tl.kill(); ScrollTrigger.getAll().forEach(t => t.kill()); };
     }, deps);
     return ref;
   }
   ```

---

## Task B2: Lenis Smooth Scroll Integration

1. Create `src/components/SmoothScroll.tsx`:
   ```typescript
   'use client';
   import { ReactLenis } from 'lenis/react';
   import { useEffect } from 'react';
   import { gsap } from '@/lib/gsap';
   import { ScrollTrigger } from 'gsap/ScrollTrigger';

   export function SmoothScroll({ children }: { children: React.ReactNode }) {
     return (
       <ReactLenis
         root
         options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}
       >
         {children}
       </ReactLenis>
     );
   }
   ```

2. Add to `layout.tsx` wrapping `{children}`

3. Add required CSS to `globals.css`:
   ```css
   html.lenis, html.lenis body {
     height: auto;
   }
   .lenis.lenis-smooth {
     scroll-behavior: auto !important;
   }
   ```

---

## Task B3: Three.js / R3F Hero Scene

1. Create `src/components/three/HeroScene.tsx`:
   ```typescript
   'use client';
   import { Canvas } from '@react-three/fiber';
   import { Suspense } from 'react';
   import { ParticleField } from './ParticleField';

   export function HeroScene() {
     return (
       <div className="absolute inset-0 -z-10">
         <Canvas camera={{ position: [0, 0, 5], fov: 75 }} dpr={[1, 2]}>
           <Suspense fallback={null}>
             <ParticleField />
             <ambientLight intensity={0.5} />
           </Suspense>
         </Canvas>
       </div>
     );
   }
   ```

2. Create `src/components/three/ParticleField.tsx`:
   - Generate 2000-5000 particles using Points geometry
   - Animate positions with `useFrame` for gentle floating motion
   - Color: accent color with varying opacity
   - React to scroll position (spread apart as user scrolls down)
   - Performance: use BufferGeometry with Float32Array positions

---

## Task B4: Scroll-Driven Section Reveals

1. Create `src/components/animations/RevealOnScroll.tsx`:
   - Wrapper component that animates children on scroll
   - Uses GSAP ScrollTrigger
   - Default: fade up from 40px below, 0.8s duration, power3.out
   - Props: `direction` (up/down/left/right), `delay`, `stagger`

2. Apply RevealOnScroll to all section content:
   - Hero: title letters stagger in from bottom
   - About: image slides from left, text from right
   - Experience: timeline items stagger from alternating sides
   - Projects: cards stagger up
   - Education: cards fade up
   - Contact: glass card scales up

---

## Task B5: Kinetic Typography (Hero Title)

1. Create `src/components/animations/KineticText.tsx`:
   - Split text into individual characters using GSAP SplitText or manual splitting
   - Each character wrapped in `<span>` with `overflow: hidden` parent
   - GSAP timeline: staggered translateY from 100% to 0%, opacity 0 to 1
   - Stagger: 30ms per character, `power3.out` easing
   - Trigger: on page load (hero is above fold)

2. Apply to hero section:
   - Line 1: "Conor Douglas" (large display text, 80-120px)
   - Line 2: "Full Stack Engineer" (smaller, muted, delayed)

---

## Task B6: Device Mockup Component

1. Create `src/components/ui/DeviceMockup.tsx`:
   - CSS-only MacBook frame with screen area
   - CSS-only iPhone frame with screen area
   - Props: `type` ('macbook' | 'iphone'), `screenshot` (image URL)
   - MacBook: rounded corners, bezel, bottom bar
   - iPhone: notch, rounded corners, side buttons
   - Images use `next/image` for optimization

2. Integrate into Projects section:
   - Desktop: MacBook + iPhone side by side (inspired by graffico.it)
   - Mobile: Single device or plain image

---

## Task B7: Framer Motion Transitions

1. Create `src/components/animations/PageTransition.tsx`:
   - Wrap page content in `motion.div` with `AnimatePresence`
   - Entry: fade + slide up, 0.5s
   - Exit: fade + slide down, 0.3s

2. Add hover animations to interactive elements:
   - Project cards: `whileHover={{ y: -8, transition: { duration: 0.3 } }}`
   - Buttons: `whileHover={{ scale: 1.05 }}` `whileTap={{ scale: 0.95 }}`
   - Navigation links: underline slide animation

3. Mobile menu animation:
   - Overlay: slide from right, staggered link reveals
   - Use `AnimatePresence` for enter/exit

---

## Task B8: Micro-Interactions

1. **Magnetic cursor buttons** -- `src/components/ui/MagneticButton.tsx`:
   - Track mouse position relative to button center
   - Apply `gsap.quickTo` for smooth follow
   - Reset on mouse leave

2. **Scroll progress indicator** -- `src/components/ui/ScrollProgress.tsx`:
   - Fixed top bar showing scroll percentage
   - Uses `useScroll` from Framer Motion or GSAP ScrollTrigger

3. **Hover parallax on cards** -- Apply via GSAP or Framer Motion:
   - Subtle 3D tilt on mouse move
   - Image shifts slightly opposite to mouse direction

4. **Animated counters** (About section):
   - Count from 0 to target number on scroll into view
   - Use GSAP tween with ScrollTrigger

---

## Task B9: Theme System

1. Create `src/store/theme.ts` (Zustand):
   ```typescript
   import { create } from 'zustand';
   import { persist } from 'zustand/middleware';

   interface ThemeState {
     theme: 'dark' | 'light';
     toggleTheme: () => void;
   }

   export const useThemeStore = create<ThemeState>()(
     persist(
       (set) => ({
         theme: 'dark',
         toggleTheme: () => set((s) => ({
           theme: s.theme === 'dark' ? 'light' : 'dark'
         })),
       }),
       { name: 'theme-preference' }
     )
   );
   ```

2. Create `src/components/ThemeProvider.tsx`:
   - Apply `dark` or `light` class to `<html>`
   - CSS transition on background/text color changes (0.3s)
   - Sync with system preference on first load

3. Create theme toggle button component with sun/moon icon animation

---

## Task B10: Animated Statistics / Counters

1. Create `src/components/ui/AnimatedCounter.tsx`:
   - Props: `target` (number), `suffix` (e.g., '+', '%', 'k')
   - GSAP tween from 0 to target, triggered by ScrollTrigger
   - Duration: 2s, easing: power2.out
   - Display with tabular numbers font feature

2. Use in About section:
   - "X+ Projects"
   - "X Year Experience"
   - "X Technologies"

---

## Completion Criteria
- Smooth scroll works across entire page
- 3D hero scene renders at 60fps
- All sections animate on scroll entry
- Hero text animates with kinetic typography
- Device mockups display correctly
- Theme toggle works with smooth transitions
- Magnetic buttons respond to cursor
- Scroll progress indicator updates
- All animations respect `prefers-reduced-motion`
- Mobile: animations simplified, 3D scene hidden or reduced
