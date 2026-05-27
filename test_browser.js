const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));
  
  console.log("Navigating to orders page...");
  try {
    await page.goto('http://localhost:3005/dashboard/orders', { waitUntil: 'networkidle2' });
  } catch (e) {
    console.log("Navigation error:", e.message);
  }
  
  await browser.close();
})();
