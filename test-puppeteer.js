const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));

  console.log("Navigating...");
  try {
    const response = await page.goto('http://localhost:3000/menu/04cf5548-6fd3-4f84-a249-fe8d4ca2aff2?qr=9453b5de-2896-4868-a0dc-a4a98b6f63cd', { waitUntil: 'networkidle2' });
    console.log("Status Code:", response.status());
    const content = await page.content();
    console.log("Has error?", content.includes("Application error"));
  } catch(e) {
    console.log("Goto Error:", e.message);
  }

  await browser.close();
})();
