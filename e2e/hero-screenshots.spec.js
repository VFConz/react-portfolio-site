const { test, expect } = require('@playwright/test');

test('capture hero section screenshots', async ({ page }) => {
  // Navigate to the page
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
  const buttons = await page.locator('button').all();
  console.log(`Found ${buttons.length} buttons on the page`);
  
  if (buttons.length > 0) {
    // Try to click the first button (likely theme toggle in sidebar)
    console.log('Clicking first button (potential theme toggle)...');
    await buttons[0].click();
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
    await buttons[0].click();
    await page.waitForTimeout(2000);
  }
  
  // Test hover effects on buttons
  console.log('\nTesting hover effects on social buttons...');
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
  
  console.log('\n✅ All screenshots completed successfully!');
});
