const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { 
    waitUntil: 'networkidle0',
    timeout: 30000 
  });
  
  // Wait for animations to load
  console.log('Waiting 4 seconds for animations to load...');
  await page.waitForTimeout(4000);
  
  // Screenshot 1: Dark theme hero
  console.log('Taking dark theme screenshot...');
  await page.screenshot({ 
    path: 'hero-dark-theme.png',
    fullPage: false
  });
  
  // Try to find and click theme toggle
  console.log('Looking for theme toggle button...');
  try {
    const themeToggle = await page.waitForSelector('[aria-label*="theme" i], [title*="theme" i], button:has(svg)', {
      timeout: 5000
    });
    
    if (themeToggle) {
      console.log('Found theme toggle, clicking...');
      await themeToggle.click();
      await page.waitForTimeout(3000);
      
      // Screenshot 2: Light theme hero
      console.log('Taking light theme screenshot...');
      await page.screenshot({ 
        path: 'hero-light-theme.png',
        fullPage: false
      });
      
      // Switch back to dark for hover test
      await themeToggle.click();
      await page.waitForTimeout(2000);
    }
  } catch (e) {
    console.log('Could not find theme toggle:', e.message);
  }
  
  // Test hover effects on buttons
  console.log('Testing hover effects on social buttons...');
  try {
    const linkedinBtn = await page.$('a[href*="linkedin"]');
    if (linkedinBtn) {
      await linkedinBtn.hover();
      await page.waitForTimeout(500);
      console.log('Taking LinkedIn hover screenshot...');
      await page.screenshot({ 
        path: 'hero-linkedin-hover.png',
        fullPage: false
      });
    }
    
    const githubBtn = await page.$('a[href*="github"]');
    if (githubBtn) {
      await githubBtn.hover();
      await page.waitForTimeout(500);
      console.log('Taking GitHub hover screenshot...');
      await page.screenshot({ 
        path: 'hero-github-hover.png',
        fullPage: false
      });
    }
  } catch (e) {
    console.log('Could not test hover effects:', e.message);
  }
  
  console.log('Screenshots saved to project root!');
  console.log('- hero-dark-theme.png');
  console.log('- hero-light-theme.png (if theme toggle found)');
  console.log('- hero-linkedin-hover.png');
  console.log('- hero-github-hover.png');
  
  await browser.close();
})();
