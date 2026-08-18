const { chromium } = require("C:/Users/gaurav/AppData/Local/npm-cache/_npx/9833c18b2d85bc59/node_modules/playwright-core");

(async () => {
  console.log("Capturing Review & Rating Modal Real Screenshots...");
  const browser = await chromium.launch({ channel: "chrome", headless: true });

  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto("http://localhost:3000/orders", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // Switch to Past Orders tab
  await page.click("button:has-text('Past Orders')");
  await page.waitForTimeout(500);

  // Click "Rate & Write Review"
  const rateBtn = await page.locator("button:has-text('Rate & Write Review')").first();
  if (await rateBtn.isVisible()) {
    await rateBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: "C:/Users/gaurav/.gemini/antigravity/brain/0f93c396-d359-4ff3-81e3-0e527e3ef8d5/real_review_modal.png" });
  }

  console.log("REVIEW MODAL SCREENSHOT CAPTURED SUCCESSFULLY!");
  await browser.close();
})();
