const { chromium } = require("C:/Users/gaurav/AppData/Local/npm-cache/_npx/9833c18b2d85bc59/node_modules/playwright-core");

(async () => {
  console.log("Capturing Desktop & Mobile Screenshots across Customer (3000), Business (3001), Admin (3002)...");
  const browser = await chromium.launch({ channel: "chrome", headless: true });

  // 1. Customer App (3000)
  {
    console.log("Capturing Customer App...");
    const desktopPage = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await desktopPage.goto("http://localhost:3000", { waitUntil: "networkidle" });
    await desktopPage.waitForTimeout(2000);
    await desktopPage.screenshot({ path: "C:/Users/gaurav/.gemini/antigravity/brain/0f93c396-d359-4ff3-81e3-0e527e3ef8d5/customer_desktop_3000.png" });
    await desktopPage.close();

    const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await mobilePage.goto("http://localhost:3000", { waitUntil: "networkidle" });
    await mobilePage.waitForTimeout(2000);
    await mobilePage.screenshot({ path: "C:/Users/gaurav/.gemini/antigravity/brain/0f93c396-d359-4ff3-81e3-0e527e3ef8d5/customer_mobile_3000.png" });
    await mobilePage.close();
  }

  // 2. Business Portal (3001)
  {
    console.log("Capturing Business Portal...");
    const desktopPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await desktopPage.goto("http://localhost:3001", { waitUntil: "networkidle" });
    await desktopPage.waitForTimeout(2000);
    await desktopPage.screenshot({ path: "C:/Users/gaurav/.gemini/antigravity/brain/0f93c396-d359-4ff3-81e3-0e527e3ef8d5/business_desktop_3001.png" });
    await desktopPage.close();

    const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await mobilePage.goto("http://localhost:3001", { waitUntil: "networkidle" });
    await mobilePage.waitForTimeout(2000);
    await mobilePage.screenshot({ path: "C:/Users/gaurav/.gemini/antigravity/brain/0f93c396-d359-4ff3-81e3-0e527e3ef8d5/business_mobile_3001.png" });
    await mobilePage.close();
  }

  // 3. Admin Panel (3002)
  {
    console.log("Capturing Admin Panel...");
    const desktopPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await desktopPage.goto("http://localhost:3002", { waitUntil: "networkidle" });
    await desktopPage.waitForTimeout(2000);
    await desktopPage.screenshot({ path: "C:/Users/gaurav/.gemini/antigravity/brain/0f93c396-d359-4ff3-81e3-0e527e3ef8d5/admin_desktop_3002.png" });
    await desktopPage.close();

    const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await mobilePage.goto("http://localhost:3002", { waitUntil: "networkidle" });
    await mobilePage.waitForTimeout(2000);
    await mobilePage.screenshot({ path: "C:/Users/gaurav/.gemini/antigravity/brain/0f93c396-d359-4ff3-81e3-0e527e3ef8d5/admin_mobile_3002.png" });
    await mobilePage.close();
  }

  console.log("ALL THREE MONOREPO APPS CAPTURED SUCCESSFULLY!");
  await browser.close();
})();
