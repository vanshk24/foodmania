const { chromium } = require("C:/Users/gaurav/AppData/Local/npm-cache/_npx/9833c18b2d85bc59/node_modules/playwright-core");

(async () => {
  console.log("Capturing Version 1.0 Locked Design System Real Screenshots...");
  const browser = await chromium.launch({ channel: "chrome", headless: true });

  // 1. Customer Home Mobile
  const customerMobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await customerMobile.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await customerMobile.waitForTimeout(1000);
  await customerMobile.screenshot({ path: "C:/Users/gaurav/.gemini/antigravity/brain/0f93c396-d359-4ff3-81e3-0e527e3ef8d5/v1_customer_home_mobile.png" });

  // 2. Customer Restaurant Details Mobile
  const customerDetails = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await customerDetails.goto("http://localhost:3000/restaurant/the-urban-cafe", { waitUntil: "networkidle" });
  await customerDetails.waitForTimeout(1000);
  await customerDetails.screenshot({ path: "C:/Users/gaurav/.gemini/antigravity/brain/0f93c396-d359-4ff3-81e3-0e527e3ef8d5/v1_customer_details_mobile.png" });

  // 3. Business Panel Desktop
  const businessDesktop = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await businessDesktop.goto("http://localhost:3001/overview", { waitUntil: "networkidle" });
  await businessDesktop.waitForTimeout(1000);
  await businessDesktop.screenshot({ path: "C:/Users/gaurav/.gemini/antigravity/brain/0f93c396-d359-4ff3-81e3-0e527e3ef8d5/v1_business_overview_desktop.png" });

  console.log("ALL VERSION 1.0 DESIGN SYSTEM SCREENSHOTS CAPTURED SUCCESSFULLY!");
  await browser.close();
})();
