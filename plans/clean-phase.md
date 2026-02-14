# CLEAN Phase – Deprecated Files and Asset Cleanup

## Context

The codebase has been upgraded from a Create React App (CRA) + React-Bootstrap stack to **Next.js 16** with TypeScript (plan.md). The current app lives entirely under `src/` (App Router, components, data) and does **not** import anything from `src_old/`. This plan identifies and removes deprecated artifacts and unused assets.

---

## 1. Remove legacy source: `src_old/`

**What it is:** Full legacy CRA app (17 files): JSX components, CSS, `index.js` (ReactDOM.createRoot), `App.jsx`, and `JSON/list.json`. The new app uses `src/data/*.ts` and `src/components/` only.

**Action:** Delete the entire `src_old/` directory.

**Rationale:** No references from `src/` or build config; safe to remove. If you want a backup first, create a git tag (e.g. `pre-clean`) or a one-time archive (e.g. `src_old_backup.zip`) before deletion.

---

## 2. Remove CRA leftover: `public/index.html`

**What it is:** CRA HTML template (`public/index.html`) with `%PUBLIC_URL%`, `<div id="root">`, and "React App" title. Next.js does not use this file; it uses `src/app/layout.tsx` and the App Router.

**Action:** Delete `public/index.html`.

**Note:** Keep `public/manifest.json` and `public/robots.txt`; they are used by Next.js. Update manifest if you later remove static icons (see Section 4).

---

## 3. Remove redundant root-level screenshot scripts

**Current state:**

| File | Purpose | Issue |
|------|----------|--------|
| `screenshot-hero.js` | Hero screenshots via Puppeteer | Uses `puppeteer` (not in package.json); broken and redundant |
| `screenshot-hero-playwright.js` | Same idea with Playwright | Duplicates `e2e/hero-screenshots.spec.js` |
| `test-screenshot.js` | Minimal Playwright open/close | No real use |

**Action:** Delete these three files. Keep the canonical Playwright tests under `e2e/` (e.g. `hero-screenshots.spec.js`, `bug-verification.spec.js`).

---

## 4. Static assets audit

**Referenced by the current app:**

- **Data-driven paths** (must exist under `public/` for Next.js):
  - `src/data/personal.ts`: `/images/profile.png`
  - `src/data/experience.ts`: `/images/magnite.jpg`
  - `src/data/projects.ts`: `/images/react.png`, `govanopoly.png`, `clockproject.png`, `window.jpg`, `Kotlin_Icon.png`
- **Manifest** (`public/manifest.json`): `favicon.ico`, `logo192.png`, `logo512.png`. The app also uses generated icons via `src/app/icon.tsx` and `apple-icon.tsx`; static icons can stay as PWA/fallback or be removed if you rely only on generated ones.

**Not referenced by current app (legacy only):**

- From old `src_old/`: `properPic.png`, `background_landscape.jpg` (Intro), and `htmlcssjs.png` (old list.json). If any of these exist under `public/` or elsewhere, they are unused and can be deleted.

**Actions:**

1. **Ensure structure:** Create `public/images/` if missing and place (or keep) only the seven assets: `profile.png`, `magnite.jpg`, `react.png`, `govanopoly.png`, `clockproject.png`, `window.jpg`, `Kotlin_Icon.png`.
2. **Remove unused images:** Delete any of `properPic.png`, `background_landscape.jpg`, `htmlcssjs.png` (or other legacy-named images) from `public/` or `public/images/` if present.
3. **Optional:** If you rely solely on Next.js generated icons, remove `favicon.ico`, `logo192.png`, `logo512.png` and update `manifest.json` to drop or adjust those entries; otherwise leave them.

---

## 5. Update project documentation

- **Lifecycle:** Add CLEAN to the phase list in plan.md (e.g. after RELEASE or as a recurring maintenance phase) and reference this plan.
- **Storage:** This CLEAN plan is stored under `plans/clean-phase.md`.

---

## Execution order (recommended)

1. (Optional) Create git tag or archive for `src_old` if you want a backup.
2. Delete `src_old/`.
3. Delete `public/index.html`.
4. Delete `screenshot-hero.js`, `screenshot-hero-playwright.js`, `test-screenshot.js`.
5. Audit `public/` and `public/images/`: add missing referenced images, remove legacy-only images (and optionally static PWA icons if using only generated ones).
6. Update plan.md with CLEAN phase and ensure this plan lives under `plans/`.

---

## Summary

| Category | Action |
|----------|--------|
| **Legacy source** | Remove `src_old/` (17 files) |
| **CRA leftover** | Remove `public/index.html` |
| **Redundant scripts** | Remove `screenshot-hero.js`, `screenshot-hero-playwright.js`, `test-screenshot.js` |
| **Assets** | Ensure `public/images/` has only app-referenced images; remove legacy-only images; optionally align manifest with Next.js icons |
| **Docs** | Add CLEAN to plan.md; store this plan under `plans/` |

No changes to active application code (`src/app/`, `src/components/`, `src/data/`) or to the e2e suite; only deletion of deprecated files and asset hygiene.
