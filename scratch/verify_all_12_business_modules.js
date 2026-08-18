const { chromium } = require("C:/Users/gaurav/AppData/Local/npm-cache/_npx/9833c18b2d85bc59/node_modules/playwright-core");

(async () => {
  console.log("Auditing ALL 12 Business Panel Sidebar Modules via Playwright...");
  const browser = await chromium.launch({ channel: "chrome", headless: true });

  const MODULES = [
    { route: "overview", name: "1_dashboard" },
    { route: "orders", name: "2_orders" },
    { route: "tables", name: "3_tables" },
    { route: "menu", name: "4_menu" },
    { route: "kitchen", name: "5_kitchen" },
    { route: "reservations", name: "6_reservations" },
    { route: "customers", name: "7_customers" },
    { route: "analytics", name: "8_analytics" },
    { route: "marketing", name: "9_marketing" },
    { route: "payments", name: "10_payments" },
    { route: "staff", name: "11_staff" },
    { route: "settings", name: "12_settings" },
  ];

  for (const mod of MODULES) {
    console.log(`Auditing Business Module: ${mod.route}...`);
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(`http://localhost:3001/${mod.route}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);

    await page.screenshot({ path: `C:/Users/gaurav/.gemini/antigravity/brain/0f93c396-d359-4ff3-81e3-0e527e3ef8d5/biz_module_${mod.name}.png` });
    console.log(` -> Screenshot saved for ${mod.name}`);
    await page.close();
  }

  console.log("ALL 12 BUSINESS PANEL MODULES AUDITED SUCCESSFULLY!");
  await browser.close();
})();
