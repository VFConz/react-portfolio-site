# Visual Testing Checklist - http://localhost:3001

## Quick Visual Inspection Guide

### 🎯 Hero Section (First View)
**What you should see:**
- [ ] Full-height section with centered content
- [ ] Large "Conor Douglas" heading
- [ ] "Full Stack Engineer" subtitle below
- [ ] Two rounded buttons: "LinkedIn" and "GitHub"
- [ ] "Scroll Down" text with bouncing down arrow at bottom
- [ ] **Background:** Should see animated purple/blue particles floating
  - ❌ If you see solid black background → **3D scene not integrated**

**Console Check:** Press F12, check for errors

---

### 📝 About Section (Scroll down)
**What you should see:**
- [ ] "About Me" heading centered
- [ ] Profile photo on left (or top on mobile)
- [ ] Bio text on right
- [ ] 4 stat boxes below in a row:
  - "1+" Year Industry Experience
  - "6+" Projects Completed
  - "15+" Technologies
  - "80%" Grade Average
- [ ] **Stats:** Should count up from 0 when scrolled into view
  - ❌ If they show "1+", "6+" immediately → **Not animated**
- [ ] Skill tags (React, Next.js, TypeScript, etc.) at bottom
- [ ] Skill tags change border color on hover

---

### 💼 Experience Section
**What you should see:**
- [ ] "Experience" heading centered
- [ ] Vertical timeline line on left side
- [ ] Colored dots on timeline
- [ ] Card(s) with experience details
- [ ] "Magnite" should be clickable link (turns accent color on hover)
- [ ] Period text on right (e.g., "Jun 2024 - Aug 2024")
- [ ] Skills listed
- [ ] "Read More" button

**Test interaction:**
1. Click "Read More" → Card should expand showing more details
2. Button should change to "Show Less"
3. Click "Show Less" → Card should collapse

---

### 🚀 Projects Section
**What you should see:**
- [ ] "Projects" heading centered
- [ ] 2 columns of project cards (1 column on mobile)
- [ ] Each card should have:
  - **Top area:** Laptop mockup frame with screenshot inside
    - ❌ If you see colored box with single letter → **Mockup not implemented**
  - Project title
  - Subtitle description
  - GitHub link icon (top-right)
  - Tech stack tags (small, rounded pills)
  - Features list with bullet points
  - "Read More" button

**Test interaction:**
1. Click "Read More" on any project → Should expand
2. Hover over card → Border should change to accent color
3. Click GitHub icon → Should open in new tab

---

### 🎓 Education Section
**What you should see:**
- [ ] "Education" heading centered
- [ ] 2 cards in row (1 on mobile)
- [ ] Each card shows:
  - Institution name (clickable if link exists)
  - Period on right
  - Bullet list of achievements
- [ ] Cards have border that changes on hover

---

### 📧 Contact Section
**What you should see:**
- [ ] "Get In Touch" heading centered
- [ ] Translucent card (glass effect - slightly see-through)
- [ ] Intro text
- [ ] 3 large buttons with icons:
  - LinkedIn (with LinkedIn icon)
  - GitHub (with GitHub icon)
  - Email (with envelope icon)
- [ ] "Or send me a message" subheading
- [ ] Contact form with:
  - Name field
  - Email field
  - Message textarea
  - "Send Message" button (accent colored)

**Test interaction:**
1. Click LinkedIn → Opens LinkedIn profile
2. Click GitHub → Opens GitHub profile
3. Click Email → Opens email client
4. Fill form and click "Send Message" → **Currently does nothing**

---

### 🧭 Navigation - Desktop (Window width > 1024px)

**Left Sidebar:**
- [ ] Narrow vertical bar on left edge of screen
- [ ] 6 small dots stacked vertically
- [ ] One dot is larger and accent-colored (current section)
- [ ] Hover over dot → Tooltip appears with section name
- [ ] Click dot → Smoothly scrolls to that section
- [ ] As you scroll, active dot changes

**Top Bar:**
- [ ] Very thin line across top of page
- [ ] Accent-colored progress bar that grows as you scroll
- [ ] Should reach full width at page bottom

**Theme Toggle:**
- [ ] **Should be visible somewhere in nav (likely bottom of sidebar)**
- ❌ If you don't see sun/moon icon button → **Not integrated**

---

### 🧭 Navigation - Mobile (Window width < 1024px)

**Hamburger Menu:**
- [ ] Circular button in top-right corner
- [ ] Three horizontal lines (hamburger icon)
- [ ] Click button → Full-screen menu appears
- [ ] Menu shows all section links vertically
- [ ] Current section is highlighted in accent color
- [ ] Click section → Menu closes and scrolls to section
- [ ] Hamburger icon animates to X when open

---

### 🎨 Theme Toggle Test (If Visible)

**In Dark Mode (Default):**
- [ ] Button shows sun icon ☀️
- [ ] Background is black (#0a0a0a)
- [ ] Text is white
- [ ] Accent is indigo (#6366f1)

**Click to toggle:**
- [ ] Icon animates (sun rotates out, moon rotates in)
- [ ] Background smoothly transitions to white/light gray
- [ ] Text transitions to dark
- [ ] All cards update colors
- [ ] Theme persists (stays light)

**Click again:**
- [ ] Returns to dark theme
- [ ] Moon animates out, sun animates in

---

### ⚙️ Smooth Scrolling Test

**Using Mouse/Trackpad:**
1. Scroll down slowly → Should feel smooth and momentum-based (not jerky)
2. Scroll fast → Should have nice deceleration
3. Click section dot in nav → Should smooth scroll (not instant jump)
4. Click "Scroll Down" arrow on hero → Should smooth scroll to About

**Expected:** Lenis smooth scroll gives momentum scrolling like on mobile devices

---

### 📱 Responsive Design Test

**Resize browser window and check:**

**Mobile (< 640px):**
- [ ] Hamburger menu appears
- [ ] Sidebar navigation hidden
- [ ] Hero text smaller
- [ ] About section: image on top, text below
- [ ] Stats: 2 columns
- [ ] Projects: 1 column
- [ ] Education: 1 column
- [ ] Contact buttons: stacked vertically

**Tablet (640px - 1024px):**
- [ ] Still using hamburger menu
- [ ] Projects: 2 columns
- [ ] Education: 2 columns
- [ ] Better spacing than mobile

**Desktop (> 1024px):**
- [ ] Sidebar navigation appears on left
- [ ] Content shifts right to make room
- [ ] Full 2-column layouts
- [ ] Larger text sizes

---

## 🐛 Known Issues to Verify

### Critical Issues (Should be fixed):
1. ❌ **3D Particles Missing**
   - Look at hero background
   - Should see floating particles
   - If solid black → Bug confirmed

2. ❌ **Theme Toggle Not Accessible**
   - Look for sun/moon button
   - Check sidebar bottom, hamburger menu
   - If not found → Bug confirmed

3. ❌ **Stats Not Animating**
   - Scroll to About section
   - Watch stat numbers
   - If they show "1+", "6+" immediately (no counting) → Bug confirmed

4. ❌ **Project Mockups Missing**
   - Look at project cards
   - Should see laptop/phone frame with image inside
   - If you see colored box with letter "T", "C", etc. → Bug confirmed

### Non-Critical Issues:
5. ⚠️ **Contact Form Non-Functional**
   - Try submitting form
   - Nothing will happen (expected for now)

6. ⚠️ **No Scroll Animations**
   - As you scroll down, sections just appear
   - Should fade in or slide up (not implemented yet)

---

## 📊 Performance Check

**Open Chrome DevTools (F12) → Performance Tab**

1. Record page load
2. Scroll through entire page
3. Check:
   - [ ] Page loads in < 3 seconds
   - [ ] Scrolling maintains 60fps (green bar in performance timeline)
   - [ ] No layout shifts when images load
   - [ ] No console errors or warnings

**If particle field is rendering:**
- [ ] Check GPU usage (should be reasonable)
- [ ] On mobile, check if scrolling is still smooth

---

## ✅ Quick Pass/Fail

**PASS if:**
- ✅ Page loads without errors
- ✅ All sections display properly
- ✅ Navigation works (dots clickable, smooth scroll)
- ✅ Links open correct URLs
- ✅ Expand/collapse works on Experience and Projects
- ✅ Layout is responsive

**FAIL if:**
- ❌ Page shows error instead of content
- ❌ Sections are broken or missing
- ❌ Navigation doesn't work
- ❌ Layout breaks on mobile
- ❌ Console has critical errors

**WARNINGS if:**
- ⚠️ 3D particles not visible
- ⚠️ Theme toggle not found
- ⚠️ Stats not animating
- ⚠️ Project mockups missing

---

## 📸 Screenshot Checklist

**Take screenshots of:**
1. Hero section (full viewport)
2. About section (scrolled to show stats)
3. Experience section (one card expanded)
4. Projects section (show 2+ cards)
5. Education section
6. Contact section with form
7. Navigation sidebar (desktop)
8. Mobile menu (open state)
9. Browser console (to show any errors)

---

**After testing, report findings and we can fix any issues discovered!**
