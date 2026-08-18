const { chromium } = require("C:/Users/gaurav/AppData/Local/npm-cache/_npx/9833c18b2d85bc59/node_modules/playwright-core");

(async () => {
  console.log("Capturing Functional Modals & Drawers...");
  const browser = await chromium.launch({ channel: "chrome", headless: true });

  // 1. Capture Location Modal
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
    await page.click("#location-selector");
    await page.waitForTimeout(1000);
    await page.screenshot({ path: "C:/Users/gaurav/.gemini/antigravity/brain/0f93c396-d359-4ff3-81e3-0e527e3ef8d5/real_modal_location.png" });
    await page.close();
  }

  // 2. Capture Notifications Drawer
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
    await page.click("#notifications-bell");
    await page.waitForTimeout(1000);
    await page.screenshot({ path: "C:/Users/gaurav/.gemini/antigravity/brain/0f93c396-d359-4ff3-81e3-0e527e3ef8d5/real_drawer_notifications.png" });
    await page.close();
  }

  // 3. Capture Search Filter Modal
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
    await page.click("#search-filter-button");
    await page.waitForTimeout(1000);
    await page.screenshot({ path: "C:/Users/gaurav/.gemini/antigravity/brain/0f93c396-d359-4ff3-81e3-0e527e3ef8d5/real_modal_filter.png" });
    await page.close();
  }

  console.log("ALL FUNCTIONAL MODAL SCREENSHOTS CAPTURED SUCCESSFULLY!");
  await browser.close();
})();
