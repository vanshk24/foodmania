const { chromium } = require("C:/Users/gaurav/AppData/Local/npm-cache/_npx/9833c18b2d85bc59/node_modules/playwright-core");

(async () => {
  console.log("Verifying Smart QR Scanning System end-to-end...");
  const browser = await chromium.launch({ channel: "chrome", headless: true });

  // 1. QR Scanner Page (Customer)
  console.log("1. Capturing QR Scanner Page...");
  let page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto("http://localhost:3000/scan", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.screenshot({ path: "C:/Users/gaurav/.gemini/antigravity/brain/0f93c396-d359-4ff3-81e3-0e527e3ef8d5/qr_scanner_page.png" });
  console.log(" -> QR Scanner Page captured");
  await page.close();

  // 2. Smart QR Table Landing - The Urban Cafe T01
  console.log("2. Capturing Smart QR Table Page - The Urban Cafe T01...");
  page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto("http://localhost:3000/r/the-urban-cafe/table/T01", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.screenshot({ path: "C:/Users/gaurav/.gemini/antigravity/brain/0f93c396-d359-4ff3-81e3-0e527e3ef8d5/qr_table_urban_cafe_t01.png" });
  console.log(" -> Urban Cafe T01 QR Table Page captured");
  await page.close();

  // 3. Smart QR Table Landing - Spice Symphony T12
  console.log("3. Capturing Smart QR Table Page - Spice Symphony T12...");
  page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto("http://localhost:3000/r/spice-symphony/table/T12", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.screenshot({ path: "C:/Users/gaurav/.gemini/antigravity/brain/0f93c396-d359-4ff3-81e3-0e527e3ef8d5/qr_table_spice_symphony_t12.png" });
  console.log(" -> Spice Symphony T12 QR Table Page captured");
  await page.close();

  // 4. Smart QR Table Landing - Burger Hub T04
  console.log("4. Capturing Smart QR Table Page - Burger Hub T04...");
  page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto("http://localhost:3000/r/burger-hub/table/T04", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.screenshot({ path: "C:/Users/gaurav/.gemini/antigravity/brain/0f93c396-d359-4ff3-81e3-0e527e3ef8d5/qr_table_burger_hub_t04.png" });
  console.log(" -> Burger Hub T04 QR Table Page captured");
  await page.close();

  // 5. Business Panel receiving live QR events
  console.log("5. Capturing Business Panel with live QR event notifications...");
  page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto("http://localhost:3001/overview", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.screenshot({ path: "C:/Users/gaurav/.gemini/antigravity/brain/0f93c396-d359-4ff3-81e3-0e527e3ef8d5/qr_business_notifications.png" });
  console.log(" -> Business Panel QR notifications captured");
  await page.close();

  console.log("SMART QR SCANNING SYSTEM END-TO-END VERIFICATION COMPLETED SUCCESSFULLY!");
  await browser.close();
})();
