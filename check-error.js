const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  await page.goto('http://localhost:3000/menu/2a0e164e-fe6a-4628-a492-a307d144a727');
  await new Promise(r => setTimeout(r, 2000));
  await browser.close();
})();
