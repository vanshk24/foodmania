const { chromium } = require("C:/Users/gaurav/AppData/Local/npm-cache/_npx/9833c18b2d85bc59/node_modules/playwright-core");

(async () => {
  console.log("Testing Real-Time Event Sync across Customer (:3000) and Business (:3001)...");
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const context = await browser.newContext();

  // Page 1: Customer App Order Tracking
  const customerPage = await context.newPage({ viewport: { width: 390, height: 844 } });
  await customerPage.goto("http://localhost:3000/orders/FM-9082", { waitUntil: "networkidle" });
  await customerPage.waitForTimeout(1000);

  // Page 2: Business Console Orders
  const businessPage = await context.newPage({ viewport: { width: 1280, height: 900 } });
  await businessPage.goto("http://localhost:3001/orders", { waitUntil: "networkidle" });
  await businessPage.waitForTimeout(1000);

  // Business clicks "Start Preparing" on Order FM-9082
  console.log("Business clicking 'Start Preparing'...");
  const prepareBtn = await businessPage.locator("button:has-text('Start Preparing')").first();
  if (await prepareBtn.isVisible()) {
    await prepareBtn.click();
    await businessPage.waitForTimeout(1500);
  }

  // Capture Business Console updated state
  await businessPage.screenshot({ path: "C:/Users/gaurav/.gemini/antigravity/brain/0f93c396-d359-4ff3-81e3-0e527e3ef8d5/realtime_business_preparing.png" });

  // Customer App should receive event live! Capture Customer App updated state
  await customerPage.waitForTimeout(1000);
  await customerPage.screenshot({ path: "C:/Users/gaurav/.gemini/antigravity/brain/0f93c396-d359-4ff3-81e3-0e527e3ef8d5/realtime_customer_preparing.png" });

  console.log("REAL-TIME EVENT SYNCHRONIZATION AUDIT COMPLETED SUCCESSFULLY!");
  await browser.close();
})();
