const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Intercept and print all JS errors!
  page.on('pageerror', err => {
    console.log('CRASH ERROR:', err.toString());
  });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('CONSOLE ERROR:', msg.text());
    }
  });

  console.log("Navigating...");
  try {
    await page.goto('http://localhost:3009/menu/04cf5548-6fd3-4f84-a249-fe8d4ca2aff2?qr=9453b5de-2896-4868-a0dc-a4a98b6f63cd', { waitUntil: 'domcontentloaded', timeout: 15000 });
    // Wait for a bit
    await page.evaluate(() => new Promise(r => setTimeout(r, 3000)));
    const content = await page.content();
    if (content.includes("Application error")) {
      console.log("Found Application error string in DOM!");
    } else {
      console.log("No application error string found.");
    }
  } catch(e) {
    console.log("Goto Error:", e.message);
  }

  await browser.close();
})();
