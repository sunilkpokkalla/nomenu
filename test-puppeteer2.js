const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => {
    if (request.url().includes('localhost')) {
      console.log('REQUEST FAILED:', request.url());
    }
  });

  console.log("Navigating...");
  try {
    const response = await page.goto('http://localhost:3000/menu/04cf5548-6fd3-4f84-a249-fe8d4ca2aff2?qr=9453b5de-2896-4868-a0dc-a4a98b6f63cd', { waitUntil: 'domcontentloaded', timeout: 5000 });
    console.log("Status Code:", response.status());
    // Wait for Next.js to run client JS
    await page.evaluate(() => new Promise(r => setTimeout(r, 2000)));
    const content = await page.content();
    if (content.includes("Application error")) {
      console.log("APP ERROR DETECTED!");
      // Grab any error text shown on screen
      const text = await page.evaluate(() => document.body.innerText);
      console.log("Body text:", text);
    } else {
      console.log("Page loaded fine. Title:", await page.title());
    }
  } catch(e) {
    console.log("Goto Error:", e.message);
  }

  await browser.close();
})();
