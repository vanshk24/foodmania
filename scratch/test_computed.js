const { chromium } = require('playwright-core');
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(2000);
  const styles = await page.evaluate(() => {
    const el = document.querySelector('#search-filter-button');
    const body = document.body;
    const cat = document.querySelector('#cat-all');
    return {
      filterBtnBg: window.getComputedStyle(el).backgroundColor,
      filterBtnRadius: window.getComputedStyle(el).borderRadius,
      bodyBg: window.getComputedStyle(body).backgroundColor,
      catAllBg: window.getComputedStyle(cat).backgroundColor,
      catAllColor: window.getComputedStyle(cat).color
    };
  });
  console.log('COMPUTED_STYLES:', JSON.stringify(styles));
  await browser.close();
})();
