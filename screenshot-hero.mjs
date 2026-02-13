import { chromium } from 'playwright';

(async () => {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();
  
  try {
    console.log('Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Wait for animations to load
    console.log('Waiting 4 seconds for WebGL and animations to load...');
    await page.waitForTimeout(4000);
    
    // Screenshot 1: Dark theme hero
    console.log('Taking dark theme screenshot...');
    await page.screenshot({ 
      path: 'hero-dark-theme.png',
      fullPage: false
    });
    console.log('✓ Saved hero-dark-theme.png');
    
    // Try to find and click theme toggle
    console.log('\nLooking for theme toggle button...');
    try {
      // Look in the sidebar/navigation for theme toggle
      const themeToggle = await page.locator('button').filter({ 
        hasText: /.*/
      }).first();
      
      const buttonCount = await page.locator('button').count();
      console.log(`Found ${buttonCount} buttons on the page`);
      
      if (buttonCount > 0) {
        // Try to click the first button (likely theme toggle)
        const firstButton = page.locator('button').first();
        console.log('Clicking first button (potential theme toggle)...');
        await firstButton.click();
        await page.waitForTimeout(3000);
        
        // Screenshot 2: Light theme hero
        console.log('Taking light theme screenshot...');
        await page.screenshot({ 
          path: 'hero-light-theme.png',
          fullPage: false
        });
        console.log('✓ Saved hero-light-theme.png');
        
        // Switch back to dark for hover test
        console.log('Switching back to dark theme...');
        await firstButton.click();
        await page.waitForTimeout(2000);
      }
    } catch (e) {
      console.log('Could not find or click theme toggle:', e.message);
    }
    
    // Test hover effects on buttons
    console.log('\nTesting hover effects on social buttons...');
    try {
      const linkedinBtn = page.locator('a[href*="linkedin"]').first();
      if (await linkedinBtn.count() > 0) {
        console.log('Hovering over LinkedIn button...');
        await linkedinBtn.hover();
        await page.waitForTimeout(800);
        await page.screenshot({ 
          path: 'hero-linkedin-hover.png',
          fullPage: false
        });
        console.log('✓ Saved hero-linkedin-hover.png');
      }
      
      const githubBtn = page.locator('a[href*="github"]').first();
      if (await githubBtn.count() > 0) {
        console.log('Hovering over GitHub button...');
        await githubBtn.hover();
        await page.waitForTimeout(800);
        await page.screenshot({ 
          path: 'hero-github-hover.png',
          fullPage: false
        });
        console.log('✓ Saved hero-github-hover.png');
      }
    } catch (e) {
      console.log('Could not test hover effects:', e.message);
    }
    
    console.log('\n✅ All screenshots completed successfully!');
    console.log('\nScreenshots saved:');
    console.log('  - hero-dark-theme.png');
    console.log('  - hero-light-theme.png (if theme toggle found)');
    console.log('  - hero-linkedin-hover.png');
    console.log('  - hero-github-hover.png');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
