# Phase 5: REFINE — Hero Animation Refinement Instructions

**Date**: 2026-02-13  
**Phase**: REFINEMENT  
**Executor**: Single LLM Agent  
**Input**: `plans/logs/04-reflect.md` (REFLECT phase findings)  
**Status**: COMPLETE

---

## Overview

This document provides step-by-step LLM-executable instructions to refine the hero section animations based on the REFLECT phase assessment. The work is organized into **7 tasks** ordered by impact, with each task containing exact file paths, specific code changes, and acceptance criteria.

**Priority Order:**
1. [CRITICAL] GeometricField light theme overhaul
2. [HIGH] KineticText animation upgrade
3. [HIGH] Theme transition bridge
4. [MEDIUM] NoiseMesh polish
5. [MEDIUM] Scroll CTA redesign
6. [LOW] MagneticButton enhancement
7. [LOW] Performance optimization

**Estimated effort**: 4–6 hours of focused agent work  
**Files affected**: 7 files (3 modified heavily, 4 with targeted edits)

---

## Task 1: GeometricField Light Theme Overhaul [CRITICAL]

**File**: `src/components/three/GeometricField.tsx`  
**Goal**: Transform the light theme 3D scene from "scattered decorations" to an immersive, cohesive environment that matches the dark theme's quality bar.

### Changes Required:

#### 1a. Add entrance animation (fade-in + staggered scale)
- Add a `fadeRef` (like NoiseMesh has) that ramps from 0 → 1 over ~2.5 seconds
- Each shape should scale up from 0 with a staggered delay based on its index: `delay = i * 0.06`
- Use the fade value as a multiplier on each shape's opacity and scale
- Implementation: In the `useFrame` callback, track `fadeRef.current` and per-shape `fadeProgress[i]` using elapsed time

#### 1b. Increase shape count and density
- Increase `SHAPE_COUNT_DESKTOP` from 30 → 45
- Increase `SHAPE_COUNT_MOBILE` from 18 → 25
- Tighten the spatial distribution: reduce radius spread from `1.5 + random * 7` to `1.0 + random * 5.5` on desktop
- Add a second layer of very small "dust" shapes (scale 0.08–0.15, high opacity 0.1) to fill gaps — use 20 additional tiny icosahedrons

#### 1c. Add background gradient to the canvas
- In `HeroScene.tsx`, when theme is `light`, add a subtle radial gradient mesh behind the shapes
- Use a full-viewport plane with a shader that creates a warm radial gradient: center `#faf8f4` fading to `#f0ece4` at edges
- This eliminates the "flat background" problem

#### 1d. Increase connection line visibility
- Change base line opacity from `0.10 + sin(t * 1.5) * 0.04` to `0.20 + sin(t * 1.5) * 0.06`
- Increase `MAX_LINES_DESKTOP` from 120 → 160
- Increase `LINE_CONNECT_DIST` from 4.0 → 5.0 for more connections
- Add line thickness variation: thicker lines for shapes closer to cursor

#### 1e. Increase shape base opacity
- Change wireframe base opacity from `0.3` to `0.45`
- Change solid base opacity from `0.22` to `0.35`
- Increase cursor proximity opacity boost from `0.35` to `0.45`

#### 1f. Add subtle inter-shape attraction
- When two shapes are within `LINE_CONNECT_DIST`, add a very gentle position drift toward each other (0.001 per frame, clamped)
- This should be purely visual — shapes drift slightly toward neighbors then back, creating organic "breathing" clusters
- Limit to 3 nearest neighbors per shape to avoid chaos

#### 1g. Add scroll parallax to shapes
- Import scroll position from Lenis or use `window.scrollY`
- Apply a depth-based Y offset: shapes with deeper Z values move slower (parallax factor `0.3 + z * 0.1`)
- This creates a natural depth layering effect as the user starts scrolling

### Acceptance Criteria:
- [ ] Shapes fade in with staggered animation over ~2.5s on page load
- [ ] Light theme feels immersive, not sparse — visible increase in shape density
- [ ] Connection lines are clearly visible against the cream background
- [ ] Background has subtle warmth gradient, not flat color
- [ ] Shapes subtly drift toward neighbors creating organic clusters
- [ ] Scrolling produces visible parallax depth layering
- [ ] Mobile performance remains smooth (test on throttled 4x CPU slowdown)

---

## Task 2: KineticText Animation Upgrade [HIGH]

**File**: `src/components/animations/KineticText.tsx`  
**Goal**: Elevate the text reveal from a generic bottom-slide to a distinctive, reference-site-caliber animation.

### Changes Required:

#### 2a. Multi-axis character entrance
- Replace the uniform `y: '100%'` start with a per-character random variation:
  - `y`: random between `80%` and `120%`
  - `rotationX`: random between `-40` and `0` degrees (creates a "flip in from behind" effect)
  - `scale`: starts at `0.7`, animates to `1`
- Use `gsap.set()` on each character with these randomized initial values
- Keep `opacity: 0` → `1` as-is

#### 2b. Eased stagger sequencing
- Replace the linear stagger with a "center-out" or "ends-first" stagger pattern:
  - Calculate the center index of the text
  - Characters closer to center start earlier; edges start later
  - This creates a "blooming" effect from the middle
- Implementation: Use GSAP's `stagger: { each: staggerMs/1000, from: "center" }` configuration

#### 2c. Overshoot and settle
- Add a slight overshoot to the Y animation: characters slide up past their final position by ~3%, then settle back
- Use `ease: "back.out(1.4)"` instead of `power3.out` for a subtle bounce
- This adds personality that `power3.out` lacks

#### 2d. Subtle character hover interaction (desktop only)
- Add a `mousemove` event listener on the container
- For each character, calculate distance from cursor
- Characters within 80px of cursor: apply a subtle `y` displacement (push away 2-4px) and slight `scale: 1.05`
- Use `gsap.quickTo` for each character's Y position (60fps performance)
- Gate behind `prefers-reduced-motion` check
- Skip on mobile (no persistent cursor)

#### 2e. Scroll-triggered exit animation
- Use GSAP ScrollTrigger to detect when the hero section is scrolled past (trigger: when hero bottom reaches 30% viewport)
- Animate characters: `y: '-50%'`, `opacity: 0`, `stagger: 0.02`, `ease: 'power2.in'`
- This creates a smooth departure as the user scrolls to the About section

### Acceptance Criteria:
- [ ] Characters enter with visible rotation and scale variation, not just Y-slide
- [ ] Stagger pattern creates a "center-out bloom" visual rhythm
- [ ] Text has a subtle bounce/overshoot on entry
- [ ] On desktop, characters subtly react to nearby cursor movement
- [ ] Scrolling past hero causes text to animate out smoothly
- [ ] `prefers-reduced-motion` still instant-shows all characters with no animation
- [ ] `aria-label` still present for screen reader access

---

## Task 3: Theme Transition Bridge [HIGH]

**File**: `src/components/three/HeroScene.tsx`  
**Goal**: Replace the hard-cut theme swap with a smooth cross-fade between 3D scenes.

### Changes Required:

#### 3a. Render both scenes simultaneously during transition
- Change the conditional render from `{theme === 'dark' ? <NoiseMesh /> : <GeometricField />}` to always rendering both components
- Add a `visible` prop to both NoiseMesh and GeometricField
- Each component manages its own opacity/fade based on the `visible` prop:
  - When `visible` transitions from `true` to `false`: fade opacity to 0 over 800ms
  - When `visible` transitions from `false` to `true`: fade opacity from 0 to 1 over 800ms
- After the fade-out completes (800ms), stop the render loop of the hidden scene to save GPU

#### 3b. Add transition opacity uniform to NoiseMesh
- Add a `uVisibility` uniform (0-1) to the NoiseMesh shader
- Multiply `uVisibility` into the final `gl_FragColor.a`
- In the React component, animate `uVisibility` from 1 → 0 when `visible` becomes false, and 0 → 1 when `visible` becomes true
- Use a smooth easing (cubic or sine) over 800ms

#### 3c. Add transition opacity to GeometricField
- Add a `transitionOpacity` ref that smoothly interpolates toward target (0 or 1) at 0.03 per frame
- Multiply each shape's material opacity by `transitionOpacity`
- Multiply line material opacity by `transitionOpacity`

#### 3d. Coordinate with CSS transition
- The CSS variable transition is already 0.3s
- The 3D scene cross-fade should be slightly longer (0.8s) so colors finish transitioning first, then the 3D scene completes its morph
- This layered timing creates a smooth, intentional feeling

### Acceptance Criteria:
- [ ] Toggling theme produces a smooth cross-fade between the two 3D scenes (no blank canvas flash)
- [ ] CSS colors transition first (0.3s), then 3D scene completes cross-fade (0.8s)
- [ ] After transition completes, the hidden scene's render loop is paused (no wasted GPU cycles)
- [ ] Rapidly toggling theme multiple times doesn't break the transition (interrupts gracefully)
- [ ] Mobile performance is not degraded — both scenes should NOT run simultaneously longer than the 0.8s transition

---

## Task 4: NoiseMesh Polish [MEDIUM]

**File**: `src/components/three/NoiseMesh.tsx`  
**Goal**: Small but impactful tweaks to push the already-strong dark theme from 4.3/5 to 4.8/5.

### Changes Required:

#### 4a. Increase mouse lerp speed
- Change desktop lerp from `0.06` to `0.09`
- Change mobile lerp from `0.035` to `0.05`
- This makes cursor tracking feel snappier, more responsive, closer to AVA SRG's cursor feel

#### 4b. Increase breathing amplitude
- Change breathe multiplier from `0.85 + 0.15 * sin(t * 0.3)` to `0.78 + 0.22 * sin(t * 0.25)`
- This makes the organic "breathing" motion more visible — 22% amplitude vs. current 15%
- Slightly slower frequency (0.25 vs 0.3) for a more meditative feel

#### 4c. Add subtle time-based color shift to fragment shader
- In the fragment shader, modulate `deepGold` slightly over time:
  ```glsl
  float colorShift = sin(uTime * 0.1) * 0.05;
  vec3 deepGoldAnimated = deepGold + vec3(colorShift, colorShift * 0.5, -colorShift);
  ```
- This creates a barely-perceptible warm→cool oscillation that adds life to the surface
- Use `deepGoldAnimated` in place of `deepGold` throughout the shader

#### 4d. Add scroll-triggered depth recession
- Import scroll position (use a uniform `uScrollY` passed from React)
- As the user scrolls past the hero section, push the mesh slightly deeper: `pos.z += d - uScrollY * 0.3`
- Also reduce `uFadeIn` based on scroll: `uFadeIn * (1.0 - smoothstep(0.0, 1.0, uScrollY))`
- This makes the 3D scene gently recede and fade as the user scrolls to About

#### 4e. Ripple discoverability hint
- On first load (after the 2s fade-in completes), auto-trigger one small ripple at screen center
- This teaches users that the surface is interactive
- Only trigger once per session (use a ref flag)

### Acceptance Criteria:
- [ ] Cursor interaction feels noticeably snappier
- [ ] Breathing motion is more visible (can see the surface slowly expand and contract)
- [ ] A subtle color temperature shift is perceptible over ~30 seconds
- [ ] Scrolling past hero causes the mesh to gently recede into the background
- [ ] One auto-ripple fires after the initial fade-in, hinting at interactivity
- [ ] All changes respect `prefers-reduced-motion`

---

## Task 5: Scroll CTA Redesign [MEDIUM]

**File**: `src/components/sections/Hero.tsx`  
**File**: `src/app/globals.css`  
**Goal**: Replace the near-invisible scroll indicator with a prominent, animated CTA.

### Changes Required:

#### 5a. Increase CTA size and presence
- Change "SCROLL" text from `text-[10px]` to `text-xs` (12px)
- Change line height from `h-12` (48px) to `h-16` (64px)
- Change line width from `w-[1px]` to `w-[2px]`
- Change default text color from `text-text-muted` to `text-text-secondary`

#### 5b. Redesign the animation
- Replace the single sliding bar with a **dual-element animation**:
  1. A small circle (4px) at the top of the line that bounces down and fades
  2. A gradient trail behind the circle
- New keyframes:
  ```css
  @keyframes scrollBounce {
    0%, 100% { transform: translateY(0); opacity: 1; }
    50% { transform: translateY(200%); opacity: 0.4; }
  }
  ```
- Duration: 2.5s, ease-in-out, infinite

#### 5c. Add hover expansion
- On hover, the CTA should:
  - Scale up text slightly (`scale-105`)
  - Change color to accent
  - Increase line length smoothly (use CSS transition on height)
  - Add a subtle glow/bloom effect via `box-shadow: 0 0 8px var(--color-accent)`

#### 5d. Fade out on scroll
- Add a GSAP ScrollTrigger that fades the CTA to `opacity: 0` when the user scrolls past 15% of viewport height
- Use `scrub: true` for smooth scroll-linked fade
- Pointer-events should be disabled once hidden

### Acceptance Criteria:
- [ ] Scroll CTA is clearly visible without searching for it
- [ ] Animation draws the eye downward (invites scrolling)
- [ ] Hover state provides clear feedback
- [ ] CTA fades smoothly as user begins scrolling
- [ ] Works correctly in both dark and light themes

---

## Task 6: MagneticButton Enhancement [LOW]

**File**: `src/components/ui/MagneticButton.tsx`  
**File**: `src/components/sections/Hero.tsx`  
**Goal**: Make the magnetic effect more noticeable and satisfying.

### Changes Required:

#### 6a. Increase magnetic strength
- In Hero.tsx, change `strength={0.3}` to `strength={0.45}` on both buttons
- This makes the magnetic pull more dramatic and noticeable

#### 6b. Add subtle scale on hover proximity
- When `handleMouseMove` fires, calculate normalized distance (0-1) from button center
- Apply a small scale increase via GSAP: `scale: 1 + (1 - normalizedDist) * 0.04`
- This makes the button "breathe" toward the cursor

#### 6c. Add inner content counter-motion
- Wrap the button children in a `<span>` with its own GSAP quickTo
- Move the inner content in the opposite direction at 15% of the button's displacement
- This creates a "parallax within the button" that feels premium

#### 6d. Add border glow on proximity
- When the cursor is near (within 1.5x button dimensions), add a dynamic `box-shadow` that follows the cursor angle
- Use CSS custom property set via JS: `--glow-x`, `--glow-y` → `box-shadow: var(--glow-x)px var(--glow-y)px 15px var(--color-accent)/20`

### Acceptance Criteria:
- [ ] Magnetic pull is immediately noticeable when hovering near buttons
- [ ] Button content moves slightly opposite to the button, creating depth
- [ ] Border glow follows cursor position
- [ ] All effects are smooth 60fps with no jank
- [ ] `prefers-reduced-motion` disables all magnetic effects

---

## Task 7: Performance Optimization [LOW]

**File**: `src/components/three/NoiseMesh.tsx`  
**File**: `src/components/three/GeometricField.tsx`  
**Goal**: Reduce GPU cost without visible quality loss.

### Changes Required:

#### 7a. Reduce NoiseMesh geometry resolution
- Desktop: Change from `150 × 90` to `120 × 72` segments (save ~40% vertices, no visible difference)
- Mobile: Keep `64 × 40` as-is (already optimized)

#### 7b. Add frame-rate adaptive quality for GeometricField
- Track delta time in `useFrame`
- If average frame time exceeds 20ms (below 50fps) for 30 consecutive frames:
  - Reduce `maxLines` by 30%
  - Skip every other shape in proximity calculations
- If frame time drops below 14ms (above 70fps) for 30 frames, restore full quality
- This creates an automatic quality scaling system

#### 7c. Pause hidden scene rendering
- When a 3D scene is fully hidden (after theme transition completes), set a `paused` ref to `true`
- In `useFrame`, early-return when `paused === true`
- This ensures zero GPU cost for the inactive theme's 3D scene

### Acceptance Criteria:
- [ ] NoiseMesh visually identical at 120×72 vs 150×90
- [ ] GeometricField auto-degrades on slow devices without visible pop
- [ ] Hidden theme scene consumes 0 GPU when fully transitioned
- [ ] No visible quality regression on desktop at 1440×900

---

## Execution Order & Dependencies

```
Task 1 (GeometricField overhaul) ──┐
Task 2 (KineticText upgrade)  ─────┤── Can run in parallel
Task 5 (Scroll CTA redesign)  ─────┘
                                    │
Task 3 (Theme transition bridge) ───┤── Depends on Task 1 (GeometricField needs fade support)
                                    │
Task 4 (NoiseMesh polish) ─────────┤── Independent, can run anytime
Task 6 (MagneticButton) ───────────┤── Independent, can run anytime
                                    │
Task 7 (Performance optimization) ──┘── Run last, depends on Tasks 1 & 3
```

**Parallel batch 1**: Tasks 1, 2, 5 (independent, highest impact)  
**Sequential after batch 1**: Task 3 (depends on Task 1's fade support)  
**Parallel batch 2**: Tasks 4, 6 (independent polish)  
**Final**: Task 7 (performance, depends on all code changes being stable)

---

## Testing Checklist (Post-Refinement)

Run after all tasks are complete:

1. **Visual regression**: Screenshot hero in both themes at 1440×900 and 375×812 — compare against pre-refinement baselines
2. **Animation timing**: Time the full hero load sequence — should complete within 3 seconds (fade-in + stagger)
3. **Theme toggle**: Toggle 5 times rapidly — no crashes, no blank flashes, no stuck states
4. **Scroll behavior**: Full-page scroll from hero to footer — all parallax, exit animations, and CTA fade work smoothly
5. **Performance**: Run Lighthouse on production build — Performance score should stay above 85
6. **Reduced motion**: Enable `prefers-reduced-motion: reduce` in DevTools — all animations should be disabled, all content visible
7. **Mobile**: Test on 375×812 viewport — GeometricField should have fewer shapes, no camera parallax, no character hover effects
8. **Console**: Zero runtime errors during full interaction test

---

**This refinement plan is ready for execution. Proceed with Task 1 first — it addresses the single largest quality gap identified in the REFLECT phase.**
