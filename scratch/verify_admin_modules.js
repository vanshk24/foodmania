const { chromium } = require("C:/Users/gaurav/AppData/Local/npm-cache/_npx/9833c18b2d85bc59/node_modules/playwright-core");
const path = require("path");

const ARTIFACT_DIR = "C:/Users/gaurav/.gemini/antigravity/brain/0f93c396-d359-4ff3-81e3-0e527e3ef8d5";

const MODULES = [
  { name: "restaurants", path: "/restaurants" },
  { name: "users",       path: "/users" },
  { name: "subscriptions", path: "/subscriptions" },
  { name: "payments",    path: "/payments" },
  { name: "reports",     path: "/reports" },
  { name: "support",     path: "/support" },
  { name: "settings",    path: "/settings" },
];

(async () => {
  console.log("Starting Admin Panel module screenshot verification...");
  const browser = await chromium.launch({ channel: "chrome", headless: true });

  for (const mod of MODULES) {
    // Desktop
    console.log(`Capturing ${mod.name} (desktop)...`);
    let page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(`http://localhost:3002${mod.path}`, { waitUntil: "networkidle", timeout: 15000 });
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${ARTIFACT_DIR}/admin_${mod.name}_desktop.png`, fullPage: false });
    await page.close();
    console.log(`  -> ${mod.name} desktop captured`);

    // Mobile
    console.log(`Capturing ${mod.name} (mobile)...`);
    page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto(`http://localhost:3002${mod.path}`, { waitUntil: "networkidle", timeout: 15000 });
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${ARTIFACT_DIR}/admin_${mod.name}_mobile.png`, fullPage: false });
    await page.close();
    console.log(`  -> ${mod.name} mobile captured`);
  }

  console.log("\nAll 7 Admin Panel modules verified. Closing browser.");
  await browser.close();
  console.log("DONE");
})();
