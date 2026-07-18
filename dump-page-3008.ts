import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3008/velvet-fork/tasting-menu');
  await page.waitForTimeout(5000); 
  const text = await page.evaluate(() => document.body.innerText);
  console.log("PAGE TEXT:", text);
  await browser.close();
}
main();
