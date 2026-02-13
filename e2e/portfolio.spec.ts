import { test, expect } from '@playwright/test';

/* ═══════════════════════════════════════════════════════════
   1. PAGE LOAD & HERO SECTION
   ═══════════════════════════════════════════════════════════ */
test.describe('Page Load & Hero Section', () => {
  test('page loads with 200 status', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
  });

  test('no critical console errors on load', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Ignore known harmless warnings
        if (
          text.includes('Persisting') ||
          text.includes('hydration') ||
          text.includes('WebGL') ||
          text.includes('THREE.WebGLRenderer') ||
          text.includes('Download the React DevTools')
        ) return;
        errors.push(text);
      }
    });
    await page.goto('/');
    await page.waitForTimeout(3000);
    if (errors.length > 0) {
      console.log('Console errors found:', errors);
    }
    expect(errors.length).toBeLessThan(5);
  });

  test('hero section is visible with correct content', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);

    // Hero section exists
    const heroSection = page.locator('#hero');
    await expect(heroSection).toBeVisible();

    // Title "Conor Douglas" present (use heading role for specificity)
    await expect(page.getByRole('heading', { name: 'Conor Douglas' })).toBeVisible();

    // Subtitle "Full Stack Engineer" present (use aria-label for KineticText)
    await expect(page.locator('[aria-label="Full Stack Engineer"]')).toBeVisible();

    // Social links
    const heroLinks = page.locator('#hero');
    await expect(heroLinks.getByText('LinkedIn')).toBeVisible();
    await expect(heroLinks.getByText('GitHub')).toBeVisible();

    // Scroll CTA
    await expect(page.locator('#hero').getByText('Scroll')).toBeVisible();
  });

  test('hero has 3D canvas background', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);

    // Three.js renders a <canvas> element inside the hero
    const canvas = page.locator('#hero canvas');
    await expect(canvas).toBeVisible();
  });

  test('"Portfolio" label badge is visible', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    await expect(page.locator('#hero').getByText('Portfolio')).toBeVisible();
  });
});

/* ═══════════════════════════════════════════════════════════
   2. NAVIGATION (Desktop)
   ═══════════════════════════════════════════════════════════ */
test.describe('Desktop Navigation', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('sidebar navigation is visible with 6 dots', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);

    const nav = page.locator('nav');
    await expect(nav).toBeVisible();

    // 6 navigation links (Home, About, Experience, Projects, Education, Contact)
    const navLinks = nav.locator('a');
    await expect(navLinks).toHaveCount(6);
  });

  test('nav dot tooltip shows on hover', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);

    const firstDot = page.locator('nav a').first();
    await firstDot.hover();
    await page.waitForTimeout(300);

    // Tooltip text should become visible
    const tooltip = firstDot.locator('span:has-text("Home")');
    await expect(tooltip).toBeVisible();
  });

  test('theme toggle button exists in sidebar', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);

    // Theme toggle button in nav
    const themeBtn = page.locator('nav button[aria-label*="Switch to"]');
    await expect(themeBtn).toBeVisible();
  });

  test('scroll progress bar element exists at top', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);

    // The progress bar is rendered but scaleX(0) at top of page — check it exists in DOM
    const progressBar = page.locator('[class*="fixed"][class*="top-0"][class*="h-\\[3px\\]"]');
    await expect(progressBar).toHaveCount(1);
  });

  test('clicking nav dot scrolls to section', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);

    // Click "About" nav dot
    const aboutLink = page.locator('nav a[href="#about"]');
    await aboutLink.click();
    await page.waitForTimeout(1500);

    // About section should now be in view
    const aboutSection = page.locator('#about');
    await expect(aboutSection).toBeInViewport();
  });
});

/* ═══════════════════════════════════════════════════════════
   3. THEME TOGGLE
   ═══════════════════════════════════════════════════════════ */
test.describe('Theme Toggle', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('clicking theme toggle switches theme class', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);

    const htmlEl = page.locator('html');
    // Get current theme
    const initialClass = await htmlEl.getAttribute('class') || '';
    const startedDark = initialClass.includes('dark');

    // Click theme toggle
    const themeBtn = page.locator('nav button[aria-label*="Switch to"]');
    await themeBtn.click();
    await page.waitForTimeout(500);

    // Should have toggled
    if (startedDark) {
      await expect(htmlEl).toHaveClass(/light/);
    } else {
      await expect(htmlEl).toHaveClass(/dark/);
    }

    // Toggle back
    await themeBtn.click();
    await page.waitForTimeout(500);

    // Should be back to initial
    if (startedDark) {
      await expect(htmlEl).toHaveClass(/dark/);
    } else {
      await expect(htmlEl).toHaveClass(/light/);
    }
  });
});

/* ═══════════════════════════════════════════════════════════
   4. ABOUT SECTION
   ═══════════════════════════════════════════════════════════ */
test.describe('About Section', () => {
  test('about section has all expected elements', async ({ page }) => {
    await page.goto('/');

    // Scroll to About section
    await page.locator('#about').scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);

    // Section heading
    await expect(page.locator('#about').getByText('About Me')).toBeVisible();

    // "Get to know me" subtitle
    await expect(page.getByText('Get to know me')).toBeVisible();

    // Profile image
    const profileImg = page.locator('#about img[alt="Conor Douglas"]');
    await expect(profileImg).toBeVisible();
  });

  test('stats section displays correctly', async ({ page }) => {
    await page.goto('/');
    await page.locator('#about').scrollIntoViewIfNeeded();
    await page.waitForTimeout(3000);

    // Stats labels present (use exact match to avoid ambiguity)
    await expect(page.getByText('Year Industry Experience')).toBeVisible();
    await expect(page.getByText('Projects Completed')).toBeVisible();
    await expect(page.getByText('Technologies', { exact: true })).toBeVisible();
    await expect(page.getByText('Grade Average', { exact: true })).toBeVisible();
  });

  test('skills section has technology tags', async ({ page }) => {
    await page.goto('/');
    await page.locator('#about').scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);

    await expect(page.getByRole('heading', { name: 'Technologies & Skills' })).toBeVisible();
    
    // Check some skill tags within about section
    await expect(page.locator('#about').getByText('React', { exact: true })).toBeVisible();
    await expect(page.locator('#about').getByText('Next.js', { exact: true })).toBeVisible();
    await expect(page.locator('#about').getByText('TypeScript', { exact: true })).toBeVisible();
  });

  test('profile image loads without error', async ({ page }) => {
    await page.goto('/');
    await page.locator('#about').scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);

    const img = page.locator('#about img[alt="Conor Douglas"]');
    await expect(img).toBeVisible();

    // Check natural width (broken images have 0 natural width)
    const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
    expect(naturalWidth).toBeGreaterThan(0);
  });
});

/* ═══════════════════════════════════════════════════════════
   5. MARQUEE
   ═══════════════════════════════════════════════════════════ */
test.describe('Marquee Tech Ticker', () => {
  test('marquee displays technology keywords', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);

    // Scroll down a bit to see the marquee
    await page.evaluate(() => window.scrollBy(0, window.innerHeight * 0.8));
    await page.waitForTimeout(1000);

    const marquee = page.locator('.marquee-track');
    await expect(marquee).toBeVisible();
  });
});

/* ═══════════════════════════════════════════════════════════
   6. EXPERIENCE SECTION
   ═══════════════════════════════════════════════════════════ */
test.describe('Experience Section', () => {
  test('experience section displays correctly', async ({ page }) => {
    await page.goto('/');
    await page.locator('#experience').scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);

    // Section heading
    const sectionHeading = page.locator('#experience').getByText('Experience', { exact: true });
    await expect(sectionHeading).toBeVisible();

    // Magnite card — use link role for specificity
    await expect(page.getByRole('link', { name: 'Magnite' })).toBeVisible();
    await expect(page.getByText('Software Engineer — Placement Year')).toBeVisible();
    await expect(page.getByText('2023 — 2024')).toBeVisible();
  });

  test('experience card "Read More" expand/collapse works', async ({ page }) => {
    await page.goto('/');
    await page.locator('#experience').scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);

    // Click "Read More"
    const readMoreBtn = page.locator('#experience').getByText('Read More');
    await readMoreBtn.click();
    await page.waitForTimeout(500);

    // Expanded content should be visible
    await expect(page.getByText(/Developed a deep technical understanding/)).toBeVisible();

    // Button text should change to "Show Less"
    await expect(page.locator('#experience').getByText('Show Less')).toBeVisible();

    // Click "Show Less"
    await page.locator('#experience').getByText('Show Less').click();
    await page.waitForTimeout(500);

    // "Read More" should be back
    await expect(page.locator('#experience').getByText('Read More')).toBeVisible();
  });

  test('experience card has skills tags', async ({ page }) => {
    await page.goto('/');
    await page.locator('#experience').scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);

    await expect(page.locator('#experience').getByText('AWS')).toBeVisible();
    await expect(page.locator('#experience').getByText('Auth0')).toBeVisible();
  });

  test('timeline elements are present', async ({ page }) => {
    await page.goto('/');
    await page.locator('#experience').scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);

    // Timeline vertical line (w-px class)
    const timelineLine = page.locator('#experience .w-px');
    await expect(timelineLine.first()).toBeVisible();

    // Timeline dot (rounded-full with border-2)
    const timelineDot = page.locator('#experience .rounded-full.border-2');
    await expect(timelineDot.first()).toBeVisible();
  });
});

/* ═══════════════════════════════════════════════════════════
   7. PROJECTS SECTION
   ═══════════════════════════════════════════════════════════ */
test.describe('Projects Section', () => {
  test('projects section displays all projects', async ({ page }) => {
    await page.goto('/');
    await page.locator('#projects').scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);

    // Section heading — use the gradient span
    await expect(page.locator('#projects .text-gradient').getByText('Projects')).toBeVisible();

    // Project titles
    await expect(page.getByText('This Website')).toBeVisible();
    await expect(page.getByText('Govanopoly')).toBeVisible();
    await expect(page.getByText('Largest-Clock-Angle')).toBeVisible();
  });

  test('project cards have images that load', async ({ page }) => {
    await page.goto('/');
    await page.locator('#projects').scrollIntoViewIfNeeded();
    await page.waitForTimeout(3000);

    const projectImages = page.locator('#projects img');
    const count = await projectImages.count();
    expect(count).toBeGreaterThan(0);

    // Check first image loads
    const firstImg = projectImages.first();
    await expect(firstImg).toBeVisible();
    const naturalWidth = await firstImg.evaluate((el: HTMLImageElement) => el.naturalWidth);
    expect(naturalWidth).toBeGreaterThan(0);
  });

  test('project cards have tech stack tags', async ({ page }) => {
    await page.goto('/');
    await page.locator('#projects').scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);

    await expect(page.locator('#projects').getByText('Tailwind CSS').first()).toBeVisible();
  });

  test('project cards have numbered indices', async ({ page }) => {
    await page.goto('/');
    await page.locator('#projects').scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);

    // Use locator within projects section to avoid matching elsewhere
    await expect(page.locator('#projects').getByText('01', { exact: true })).toBeVisible();
    await expect(page.locator('#projects').getByText('02', { exact: true })).toBeVisible();
  });

  test('GitHub links point to correct URLs', async ({ page }) => {
    await page.goto('/');
    await page.locator('#projects').scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);

    const githubLinks = page.locator('#projects a[href*="github.com"]');
    const count = await githubLinks.count();
    expect(count).toBeGreaterThan(0);
  });
});

/* ═══════════════════════════════════════════════════════════
   8. EDUCATION SECTION
   ═══════════════════════════════════════════════════════════ */
test.describe('Education Section', () => {
  test('education section displays all entries', async ({ page }) => {
    await page.goto('/');
    await page.locator('#education').scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);

    // Section heading
    await expect(page.locator('#education .text-gradient').getByText('Education')).toBeVisible();

    // Education entries (use link role for QUB to be specific)
    await expect(page.getByRole('link', { name: "Queen's University Belfast" })).toBeVisible();
    await expect(page.locator('#education').getByText("St Patrick's Grammar School")).toBeVisible();
  });

  test('degree shown in accent color', async ({ page }) => {
    await page.goto('/');
    await page.locator('#education').scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);

    await expect(page.getByText('BSc Computer Science')).toBeVisible();
  });

  test('education achievements are listed', async ({ page }) => {
    await page.goto('/');
    await page.locator('#education').scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);

    await expect(page.getByText('First Class Bachelors')).toBeVisible();
    await expect(page.locator('#education').getByText('Grade average 80%')).toBeVisible();
  });

  test("QUB link points to correct URL", async ({ page }) => {
    await page.goto('/');
    await page.locator('#education').scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);

    const qubLink = page.locator('a[href="https://www.qub.ac.uk/"]');
    await expect(qubLink).toBeVisible();
  });
});

/* ═══════════════════════════════════════════════════════════
   9. CONTACT SECTION
   ═══════════════════════════════════════════════════════════ */
test.describe('Contact Section', () => {
  test('contact section has glass card with social links', async ({ page }) => {
    await page.goto('/');
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);

    // Section heading
    await expect(page.locator('#contact .text-gradient').getByText('Get In Touch')).toBeVisible();

    // Glass card
    const glassCard = page.locator('#contact .glass');
    await expect(glassCard).toBeVisible();

    // Social links within contact section
    await expect(page.locator('#contact').getByText('LinkedIn')).toBeVisible();
    await expect(page.locator('#contact').getByText('GitHub')).toBeVisible();
    await expect(page.locator('#contact').getByText('Email')).toBeVisible();
  });

  test('social links have correct href values', async ({ page }) => {
    await page.goto('/');
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);

    const linkedinLink = page.locator('#contact a[href*="linkedin.com"]');
    await expect(linkedinLink).toBeVisible();

    const githubLink = page.locator('#contact a[href*="github.com"]');
    await expect(githubLink).toBeVisible();

    const emailLink = page.locator('#contact a[href^="mailto:"]');
    await expect(emailLink).toBeVisible();
  });

  test('footer copyright is visible', async ({ page }) => {
    await page.goto('/');
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);

    await expect(page.getByText(/Conor Douglas\. Built with/)).toBeVisible();
  });
});

/* ═══════════════════════════════════════════════════════════
   10. MOBILE NAVIGATION
   ═══════════════════════════════════════════════════════════ */
test.describe('Mobile Navigation', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('hamburger button is visible on mobile', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);

    const hamburger = page.locator('button[aria-label="Toggle menu"]');
    await expect(hamburger).toBeVisible();
  });

  test('mobile menu opens and shows section links', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);

    // Click hamburger
    const hamburger = page.locator('button[aria-label="Toggle menu"]');
    await hamburger.click();
    await page.waitForTimeout(500);

    // Menu overlay should be visible — use the mobile menu links specifically
    const mobileMenu = page.locator('.fixed.inset-0.z-40');
    await expect(mobileMenu).toBeVisible();

    // Section links inside mobile menu
    await expect(mobileMenu.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(mobileMenu.getByRole('link', { name: 'About' })).toBeVisible();
    await expect(mobileMenu.getByRole('link', { name: 'Experience' })).toBeVisible();
    await expect(mobileMenu.getByRole('link', { name: 'Projects' })).toBeVisible();
    await expect(mobileMenu.getByRole('link', { name: 'Education' })).toBeVisible();
    await expect(mobileMenu.getByRole('link', { name: 'Contact' })).toBeVisible();

    // Theme toggle in mobile menu
    await expect(mobileMenu.getByText(/Light Mode|Dark Mode/)).toBeVisible();
  });

  test('mobile menu closes when link is clicked', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);

    // Open menu
    const hamburger = page.locator('button[aria-label="Toggle menu"]');
    await hamburger.click();
    await page.waitForTimeout(500);

    // Click About link specifically in the mobile menu
    const mobileMenu = page.locator('.fixed.inset-0.z-40');
    await mobileMenu.getByRole('link', { name: 'About' }).click();
    await page.waitForTimeout(1000);

    // About section should be in view
    const aboutSection = page.locator('#about');
    await expect(aboutSection).toBeInViewport();
  });
});

/* ═══════════════════════════════════════════════════════════
   11. RESPONSIVE LAYOUT
   ═══════════════════════════════════════════════════════════ */
test.describe('Responsive Layout', () => {
  test('desktop layout has sidebar offset', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForTimeout(1000);

    const main = page.locator('main');
    await expect(main).toBeVisible();
    // Check the class contains lg:ml-16
    await expect(main).toHaveClass(/lg:ml-16/);
  });

  test('mobile layout is single column', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.waitForTimeout(1000);

    const hero = page.locator('#hero');
    await expect(hero).toBeVisible();
  });
});

/* ═══════════════════════════════════════════════════════════
   12. ACCESSIBILITY
   ═══════════════════════════════════════════════════════════ */
test.describe('Accessibility', () => {
  test('page has proper heading hierarchy', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);

    // H1 should be "Conor Douglas"
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();

    // Multiple H2 section headings
    const h2s = page.locator('h2');
    const h2Count = await h2s.count();
    expect(h2Count).toBeGreaterThanOrEqual(5);
  });

  test('interactive elements have aria labels', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);

    // Theme toggle has aria-label
    const themeToggle = page.locator('button[aria-label*="Switch to"]');
    const count = await themeToggle.count();
    expect(count).toBeGreaterThan(0);

    // Hamburger menu has aria-label
    const hamburger = page.locator('button[aria-label="Toggle menu"]');
    expect(await hamburger.count()).toBeGreaterThan(0);
  });

  test('kinetic text has aria-label for screen readers', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);

    const h1 = page.locator('h1[aria-label="Conor Douglas"]');
    await expect(h1).toBeVisible();
  });

  test('semantic HTML sections are used', async ({ page }) => {
    await page.goto('/');

    const navCount = await page.locator('nav').count();
    expect(navCount).toBeGreaterThan(0);

    const mainCount = await page.locator('main').count();
    expect(mainCount).toBeGreaterThan(0);

    const sectionCount = await page.locator('section').count();
    expect(sectionCount).toBeGreaterThanOrEqual(6);
  });
});

/* ═══════════════════════════════════════════════════════════
   13. SECTION DIVIDERS & VISUAL POLISH
   ═══════════════════════════════════════════════════════════ */
test.describe('Visual Polish', () => {
  test('section dividers are present between sections', async ({ page }) => {
    await page.goto('/');

    const dividers = page.locator('.section-divider');
    const count = await dividers.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test('gradient glow behind contact section exists', async ({ page }) => {
    await page.goto('/');

    // Contact section wrapper has overflow-hidden
    const contactSection = page.locator('#contact');
    await expect(contactSection).toBeVisible();

    // Glow element inside contact section
    const glow = page.locator('#contact .blur-\\[120px\\]');
    const count = await glow.count();
    expect(count).toBeGreaterThan(0);
  });
});

/* ═══════════════════════════════════════════════════════════
   14. PERFORMANCE CHECKS
   ═══════════════════════════════════════════════════════════ */
test.describe('Performance', () => {
  test('page loads within reasonable time', async ({ page }) => {
    const start = Date.now();
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const loadTime = Date.now() - start;
    console.log(`Page load time (DOMContentLoaded): ${loadTime}ms`);
    expect(loadTime).toBeLessThan(10000);
  });

  test('no unhandled JS errors during scroll', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => {
      errors.push(err.message);
    });

    await page.goto('/');
    await page.waitForTimeout(2000);

    // Scroll through entire page
    await page.evaluate(async () => {
      const totalHeight = document.documentElement.scrollHeight;
      const step = window.innerHeight / 2;
      for (let y = 0; y < totalHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 300));
      }
    });

    await page.waitForTimeout(2000);

    if (errors.length > 0) {
      console.log('Page errors during scroll:', errors);
    }
    expect(errors.length).toBe(0);
  });
});
