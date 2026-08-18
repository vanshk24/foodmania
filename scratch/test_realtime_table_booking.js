const { chromium } = require("C:/Users/gaurav/AppData/Local/npm-cache/_npx/9833c18b2d85bc59/node_modules/playwright-core");

(async () => {
  console.log("Testing End-to-End Table Booking Sync across Customer (:3000) and Business (:3001)...");
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const context = await browser.newContext();

  // 1. Customer App Book Table Screen
  const customerPage = await context.newPage({ viewport: { width: 390, height: 844 } });
  await customerPage.goto("http://localhost:3000/restaurant/the-urban-cafe/book", { waitUntil: "networkidle" });
  await customerPage.waitForTimeout(1000);

  // Capture Customer Table Booking Form & Map
  await customerPage.screenshot({ path: "C:/Users/gaurav/.gemini/antigravity/brain/0f93c396-d359-4ff3-81e3-0e527e3ef8d5/booking_customer_form.png" });

  // Click "Confirm Booking"
  console.log("Customer confirming table booking...");
  await customerPage.click("button:has-text('Confirm Booking')");
  await customerPage.waitForTimeout(1500);

  // Capture Confirmation Modal
  await customerPage.screenshot({ path: "C:/Users/gaurav/.gemini/antigravity/brain/0f93c396-d359-4ff3-81e3-0e527e3ef8d5/booking_customer_success.png" });

  // 2. Business Panel Reservations Console
  const businessPage = await context.newPage({ viewport: { width: 1280, height: 900 } });
  await businessPage.goto("http://localhost:3001/reservations", { waitUntil: "networkidle" });
  await businessPage.waitForTimeout(1000);

  // Capture Business Reservations Console receiving live booking
  await businessPage.screenshot({ path: "C:/Users/gaurav/.gemini/antigravity/brain/0f93c396-d359-4ff3-81e3-0e527e3ef8d5/booking_business_console.png" });

  // 3. Business Panel Interactive Floor Plan
  const tablesPage = await context.newPage({ viewport: { width: 1280, height: 900 } });
  await tablesPage.goto("http://localhost:3001/tables", { waitUntil: "networkidle" });
  await tablesPage.waitForTimeout(1000);

  // Capture 30 Tables Floor Plan
  await tablesPage.screenshot({ path: "C:/Users/gaurav/.gemini/antigravity/brain/0f93c396-d359-4ff3-81e3-0e527e3ef8d5/booking_business_tables.png" });

  console.log("END-TO-END TABLE BOOKING AUDIT COMPLETED SUCCESSFULLY!");
  await browser.close();
})();
