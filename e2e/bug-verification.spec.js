const { test, expect } = require('@playwright/test');

test('Bug verification tests', async ({ page }) => {
  console.log('\n========================================');
  console.log('STARTING BUG VERIFICATION TESTS');
  console.log('========================================\n');
  
  // Navigate to the page
  console.log('1. Navigating to http://localhost:3001...');
  await page.goto('http://localhost:3001', { 
    waitUntil: 'networkidle',
    timeout: 30000 
  });
  
  // Wait for animations to load
  console.log('2. Waiting 5 seconds for WebGL and animations to fully load...');
  await page.waitForTimeout(5000);
  
  // Take initial screenshot
  console.log('3. Taking initial screenshot...');
  await page.screenshot({ 
    path: 'test-results/01-initial-load.png',
    fullPage: false
  });
  console.log('   ✓ Saved: test-results/01-initial-load.png\n');
  
  // ============================================
  // BUG 1: Test KineticText hover (no jitter)
  // ============================================
  console.log('========================================');
  console.log('BUG 1: Testing KineticText Hover Effect');
  console.log('========================================');
  
  const heading = page.locator('h1').filter({ hasText: 'Conor Douglas' });
  
  if (await heading.count() > 0) {
    console.log('4. Found "Conor Douglas" heading');
    
    // Get the bounding box
    const box = await heading.boundingBox();
    
    if (box) {
      console.log('5. Hovering over the heading...');
      
      // Hover at the start of the text
      await page.mouse.move(box.x + 50, box.y + box.height / 2);
      await page.waitForTimeout(300);
      
      // Take screenshot during hover (left side)
      await page.screenshot({ 
        path: 'test-results/02-hover-left.png',
        fullPage: false
      });
      console.log('   ✓ Saved: test-results/02-hover-left.png');
      
      // Slowly move across the text (simulating user hover)
      console.log('6. Moving mouse across text to test smoothness...');
      for (let i = 0; i < 5; i++) {
        const x = box.x + (box.width * (i + 1) / 6);
        await page.mouse.move(x, box.y + box.height / 2, { steps: 10 });
        await page.waitForTimeout(100);
      }
      
      // Take screenshot during hover (right side)
      await page.screenshot({ 
        path: 'test-results/03-hover-right.png',
        fullPage: false
      });
      console.log('   ✓ Saved: test-results/03-hover-right.png');
      
      // Move mouse away
      await page.mouse.move(0, 0);
      await page.waitForTimeout(500);
      
      console.log('   ✅ BUG 1 TEST COMPLETE: Visual inspection required');
      console.log('      - Check if characters lift smoothly on hover');
      console.log('      - Verify no jitter or competing animations\n');
    }
  } else {
    console.log('   ❌ Could not find "Conor Douglas" heading\n');
  }
  
  // ============================================
  // BUG 2: Test Scroll CTA functionality
  // ============================================
  console.log('========================================');
  console.log('BUG 2: Testing Scroll CTA Button');
  console.log('========================================');
  
  // Scroll back to top first
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  
  const scrollCTA = page.locator('a[href="#about"]').first();
  
  if (await scrollCTA.count() > 0) {
    console.log('7. Found Scroll CTA button');
    
    // Get initial scroll position
    const initialScroll = await page.evaluate(() => window.scrollY);
    console.log(`   Initial scroll position: ${initialScroll}px`);
    
    // Click the scroll CTA
    console.log('8. Clicking Scroll CTA...');
    await scrollCTA.click();
    
    // Wait for smooth scroll to complete
    await page.waitForTimeout(2000);
    
    // Get final scroll position
    const finalScroll = await page.evaluate(() => window.scrollY);
    console.log(`   Final scroll position: ${finalScroll}px`);
    
    // Take screenshot after scroll
    await page.screenshot({ 
      path: 'test-results/04-after-scroll.png',
      fullPage: false
    });
    console.log('   ✓ Saved: test-results/04-after-scroll.png');
    
    if (finalScroll > initialScroll + 100) {
      console.log('   ✅ BUG 2 TEST PASSED: Page scrolled successfully');
      console.log(`      - Scrolled ${finalScroll - initialScroll}px down\n`);
    } else {
      console.log('   ❌ BUG 2 TEST FAILED: Page did not scroll\n');
    }
  } else {
    console.log('   ❌ Could not find Scroll CTA button\n');
  }
  
  // ============================================
  // ADDITIONAL: Test Theme Toggle
  // ============================================
  console.log('========================================');
  console.log('ADDITIONAL: Testing Theme Toggle');
  console.log('========================================');
  
  // Scroll back to top
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1000);
  
  // Look for theme toggle button
  const themeToggle = page.locator('button').first();
  
  if (await themeToggle.count() > 0) {
    console.log('9. Found theme toggle button');
    
    // Take screenshot of dark theme
    await page.screenshot({ 
      path: 'test-results/05-dark-theme.png',
      fullPage: false
    });
    console.log('   ✓ Saved: test-results/05-dark-theme.png (initial theme)');
    
    // Click to switch theme
    console.log('10. Clicking theme toggle...');
    await themeToggle.click();
    await page.waitForTimeout(2000);
    
    // Take screenshot of light theme
    await page.screenshot({ 
      path: 'test-results/06-light-theme.png',
      fullPage: false
    });
    console.log('   ✓ Saved: test-results/06-light-theme.png');
    
    // Switch back to dark
    console.log('11. Switching back to dark theme...');
    await themeToggle.click();
    await page.waitForTimeout(2000);
    
    await page.screenshot({ 
      path: 'test-results/07-dark-theme-again.png',
      fullPage: false
    });
    console.log('   ✓ Saved: test-results/07-dark-theme-again.png');
    
    console.log('   ✅ THEME TOGGLE TEST COMPLETE\n');
  }
  
  // ============================================
  // ADDITIONAL: Test MagneticButton hover
  // ============================================
  console.log('========================================');
  console.log('ADDITIONAL: Testing MagneticButton');
  console.log('========================================');
  
  const linkedinBtn = page.locator('a[href*="linkedin"]').first();
  const githubBtn = page.locator('a[href*="github"]').first();
  
  if (await linkedinBtn.count() > 0) {
    console.log('12. Testing LinkedIn button magnetic effect...');
    await linkedinBtn.hover();
    await page.waitForTimeout(800);
    
    await page.screenshot({ 
      path: 'test-results/08-linkedin-hover.png',
      fullPage: false
    });
    console.log('   ✓ Saved: test-results/08-linkedin-hover.png');
  }
  
  if (await githubBtn.count() > 0) {
    console.log('13. Testing GitHub button magnetic effect...');
    await githubBtn.hover();
    await page.waitForTimeout(800);
    
    await page.screenshot({ 
      path: 'test-results/09-github-hover.png',
      fullPage: false
    });
    console.log('   ✓ Saved: test-results/09-github-hover.png');
  }
  
  console.log('   ✅ MAGNETIC BUTTON TEST COMPLETE\n');
  
  console.log('========================================');
  console.log('ALL TESTS COMPLETE');
  console.log('========================================');
  console.log('Screenshots saved to test-results/ directory');
  console.log('Review screenshots for visual verification\n');
});
