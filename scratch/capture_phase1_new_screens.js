const { chromium } = require("C:/Users/gaurav/AppData/Local/npm-cache/_npx/9833c18b2d85bc59/node_modules/playwright-core");

(async () => {
  console.log("Capturing Cart, Checkout, and Order Tracking Real Screenshots...");
  const browser = await chromium.launch({ channel: "chrome", headless: true });

  // 1. Cart Screen
  {
    console.log("Capturing Cart Screen...");
    const desktopPage = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await desktopPage.goto("http://localhost:3000/cart", { waitUntil: "networkidle" });
    await desktopPage.waitForTimeout(2000);
    await desktopPage.screenshot({ path: "C:/Users/gaurav/.gemini/antigravity/brain/0f93c396-d359-4ff3-81e3-0e527e3ef8d5/real_cart_desktop.png" });
    await desktopPage.close();

    const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await mobilePage.goto("http://localhost:3000/cart", { waitUntil: "networkidle" });
    await mobilePage.waitForTimeout(2000);
    await mobilePage.screenshot({ path: "C:/Users/gaurav/.gemini/antigravity/brain/0f93c396-d359-4ff3-81e3-0e527e3ef8d5/real_cart_mobile.png" });
    await mobilePage.close();
  }

  // 2. Checkout Screen
  {
    console.log("Capturing Checkout Screen...");
    const desktopPage = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await desktopPage.goto("http://localhost:3000/checkout", { waitUntil: "networkidle" });
    await desktopPage.waitForTimeout(2000);
    await desktopPage.screenshot({ path: "C:/Users/gaurav/.gemini/antigravity/brain/0f93c396-d359-4ff3-81e3-0e527e3ef8d5/real_checkout_desktop.png" });
    await desktopPage.close();

    const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await mobilePage.goto("http://localhost:3000/checkout", { waitUntil: "networkidle" });
    await mobilePage.waitForTimeout(2000);
    await mobilePage.screenshot({ path: "C:/Users/gaurav/.gemini/antigravity/brain/0f93c396-d359-4ff3-81e3-0e527e3ef8d5/real_checkout_mobile.png" });
    await mobilePage.close();
  }

  // 3. Order Tracking Screen
  {
    console.log("Capturing Order Tracking Screen...");
    const desktopPage = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await desktopPage.goto("http://localhost:3000/orders/FM-9082", { waitUntil: "networkidle" });
    await desktopPage.waitForTimeout(2000);
    await desktopPage.screenshot({ path: "C:/Users/gaurav/.gemini/antigravity/brain/0f93c396-d359-4ff3-81e3-0e527e3ef8d5/real_order_tracking_desktop.png" });
    await desktopPage.close();

    const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await mobilePage.goto("http://localhost:3000/orders/FM-9082", { waitUntil: "networkidle" });
    await mobilePage.waitForTimeout(2000);
    await mobilePage.screenshot({ path: "C:/Users/gaurav/.gemini/antigravity/brain/0f93c396-d359-4ff3-81e3-0e527e3ef8d5/real_order_tracking_mobile.png" });
    await mobilePage.close();
  }

  console.log("ALL PHASE 1 NEW CUSTOMER SCREENS CAPTURED SUCCESSFULLY!");
  await browser.close();
})();
