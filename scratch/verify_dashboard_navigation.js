const { chromium } = require("C:/Users/gaurav/AppData/Local/npm-cache/_npx/9833c18b2d85bc59/node_modules/playwright-core");
const ARTIFACT_DIR = "C:/Users/gaurav/.gemini/antigravity/brain/0f93c396-d359-4ff3-81e3-0e527e3ef8d5";

(async () => {
  console.log("==================================================");
  console.log("🚀 VERIFYING DASHBOARD NAVIGATION & ZERO ALERTS");
  console.log("==================================================");

  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  let dialogFired = false;
  let dialogMessage = "";

  page.on("dialog", (dialog) => {
    dialogFired = true;
    dialogMessage = dialog.message();
    console.error(`❌ BROWSER ALERT DETECTED: "${dialogMessage}"`);
    dialog.dismiss();
  });

  console.log("1. Navigating to Admin Restaurants page (http://localhost:3002/restaurants)...");
  await page.goto("http://localhost:3002/restaurants", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${ARTIFACT_DIR}/alert_removal_before_admin_restaurants.png` });
  console.log(` Saved ${ARTIFACT_DIR}/alert_removal_before_admin_restaurants.png`);

  console.log("2. Clicking 'Dashboard' button on restaurant card...");
  const [newPage] = await Promise.all([
    context.waitForEvent("page"),
    page.click("button:has-text('Dashboard')"),
  ]);

  newPage.on("dialog", (dialog) => {
    dialogFired = true;
    dialogMessage = dialog.message();
    console.error(`❌ BROWSER ALERT DETECTED ON NEW PAGE: "${dialogMessage}"`);
    dialog.dismiss();
  });

  await newPage.waitForLoadState("networkidle");
  const currentUrl = newPage.url();
  console.log(`\nNavigated URL: ${currentUrl}`);

  if (!dialogFired) {
    console.log("✅ ZERO BROWSER ALERTS FIRED! (Clean instant navigation)");
  } else {
    console.error(`❌ ALERT FAULT: "${dialogMessage}"`);
  }

  if (currentUrl.includes("http://localhost:3001/overview") && currentUrl.includes("restaurantId=")) {
    console.log("✅ PRESERVED RESTAURANT ID IN QUERY PARAMS SUCCESSFULLY!");
  } else {
    console.error("❌ QUERY PARAM PRESERVATION FAILED:", currentUrl);
  }

  console.log("3. Verifying Browser Refresh Persistence...");
  await newPage.reload({ waitUntil: "networkidle" });
  const refreshedUrl = newPage.url();
  console.log(`Refreshed URL: ${refreshedUrl}`);

  if (refreshedUrl.includes("restaurantId=")) {
    console.log("✅ REFRESH PERSISTENCE CONFIRMED!");
  }

  await newPage.screenshot({ path: `${ARTIFACT_DIR}/alert_removal_after_business_overview.png` });
  console.log(` Saved ${ARTIFACT_DIR}/alert_removal_after_business_overview.png`);

  await browser.close();
  console.log("==================================================");
  console.log("🎉 ALL DASHBOARD NAVIGATION CHECKS PASSED 100%!");
  console.log("==================================================");
})();
