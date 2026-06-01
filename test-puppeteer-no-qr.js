const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('pageerror', err => {
    console.log('CRASH ERROR:', err.toString());
  });

  console.log("Navigating...");
  try {
    await page.goto('http://localhost:3009/menu/04cf5548-6fd3-4f84-a249-fe8d4ca2aff2', { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.evaluate(() => new Promise(r => setTimeout(r, 2000)));
    const content = await page.content();
    if (content.includes("Application error")) {
      console.log("Found Application error string in DOM!");
      const text = await page.evaluate(() => document.body.innerText);
      console.log("Body text:", text);
    } else {
      console.log("No application error string found.");
    }
  } catch(e) {
    console.log("Goto Error:", e.message);
  }

  await browser.close();
})();
