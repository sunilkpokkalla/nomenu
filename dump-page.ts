import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3008/velvet-fork/menu');
  await page.waitForTimeout(5000); 
  const text = await page.evaluate(() => document.body.innerText);
  console.log("PAGE TEXT:", text);
  await page.screenshot({ path: '/Users/sunilkumar/.gemini/antigravity-ide/brain/fb5d77ee-2d0c-4d29-a02a-4fcd402c5060/playwright-screenshot.png' });
  await browser.close();
}
main();
