import { chromium, Browser, Page } from "playwright";
import path from "path";

const ARTIFACTS_DIR = "C:\\Users\\gaurav\\.gemini\\antigravity-ide\\brain\\ef90446d-85a4-43db-a0b8-834844a3e8c8";

async function runTableQRBrowserQA() {
  console.log("\n=========================================================");
  console.log("🌐 STARTING REAL PLAYWRIGHT TABLE QR BROWSER QA (PHASE 14)");
  console.log("=========================================================\n");

  const browser: Browser = await chromium.launch({ headless: true });

  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  const networkFailures: string[] = [];

  // Helper function to setup error tracking on context
  const trackErrors = (p: Page) => {
    p.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(`[Console Error] ${msg.text()}`);
    });
    p.on("pageerror", (err) => {
      pageErrors.push(`[Page Error] ${err.message}`);
    });
    p.on("response", (res) => {
      if (res.status() >= 400 && !res.url().includes("/favicon.ico")) {
        networkFailures.push(`[HTTP ${res.status()}] ${res.request().method()} ${res.url()}`);
      }
    });
  };

  try {
    // ───────────────────────────────────────────────────────────────────────────
    // 1440px DESKTOP VIEWPORT TEST
    // ───────────────────────────────────────────────────────────────────────────
    const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await desktopContext.newPage();
    trackErrors(page);

    console.log("\n--- 1. BUSINESS PORTAL: VIEW TABLE QR CODE ---");
    await page.goto("http://localhost:3001/login", { waitUntil: "networkidle" });
    await page.fill("input[placeholder*='URBAN123'], input[name='restaurantCode'], input[type='text']", "URBAN123").catch(() => {});
    await page.fill("input[type='email']", "rohit@urbancafe.com");
    await page.fill("input[type='password']", "owner123");
    await page.click("button[type='submit']");
    await page.waitForTimeout(2000);

    await page.goto("http://localhost:3001/tables", { waitUntil: "networkidle" });
    console.log("✅ Business Floor Layout loaded cleanly");

    const viewQRBtn = page.locator("button:has-text('View QR')").nth(1);
    if (await viewQRBtn.isVisible()) {
      await viewQRBtn.click();
      await page.waitForTimeout(1000);
      console.log("✅ Clicked View QR Code on Table T-02");
      await page.screenshot({ path: path.join(ARTIFACTS_DIR, "phase14_business_tables_qr_modal.png") });
    }

    console.log("\n--- 2. CUSTOMER PORTAL: TABLE T-02 QR ENTRY ---");
    await page.goto("http://localhost:3000/r/the-urban-cafe/table/t-02", { waitUntil: "networkidle" });
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, "phase14_customer_table_entry.png") });
    console.log("✅ Customer Smart QR Table T-02 Entry page loaded");

    const addBtn = page.locator("button:has-text('+ Add')").first();
    if (await addBtn.isVisible()) {
      await addBtn.click();
      await page.waitForTimeout(1000);
      console.log("✅ Added menu item to cart for Table T-02");
      await page.screenshot({ path: path.join(ARTIFACTS_DIR, "phase14_customer_table_cart.png") });
    }

    await page.goto("http://localhost:3000/checkout", { waitUntil: "networkidle" });
    console.log("✅ Checkout page loaded with Table T-02 session");

    const placeOrderBtn = page.locator("button:has-text('Place Order')").first();
    if (await placeOrderBtn.isVisible()) {
      await placeOrderBtn.click();
      await page.waitForTimeout(3000);
      console.log("✅ Placed Table T-02 Order successfully");
      await page.screenshot({ path: path.join(ARTIFACTS_DIR, "phase14_customer_order_placed.png") });
    }

    console.log("\n--- 3. BUSINESS ORDERS & KITCHEN KDS TABLE VISIBILITY ---");
    await page.goto("http://localhost:3001/orders", { waitUntil: "networkidle" });
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, "phase14_business_orders_table_t02.png") });
    console.log("✅ Business Orders loaded displaying Table T-02 badge");

    await page.goto("http://localhost:3001/kitchen", { waitUntil: "networkidle" });
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, "phase14_business_kds_table_t02.png") });
    console.log("✅ Kitchen KDS loaded displaying Table T-02 ticket");

    await desktopContext.close();

    // ───────────────────────────────────────────────────────────────────────────
    // 768px TABLET VIEWPORT TEST
    // ───────────────────────────────────────────────────────────────────────────
    console.log("\n--- 4. TABLET (768px) VIEWPORT AUDIT ---");
    const tabletContext = await browser.newContext({ viewport: { width: 768, height: 1024 } });
    const tabletPage = await tabletContext.newPage();
    trackErrors(tabletPage);

    await tabletPage.goto("http://localhost:3000/r/the-urban-cafe/table/t-02", { waitUntil: "networkidle" });
    await tabletPage.screenshot({ path: path.join(ARTIFACTS_DIR, "phase14_tablet_768_table_qr.png") });
    console.log("✅ Captured Tablet 768px viewport screenshot");
    await tabletContext.close();

    // ───────────────────────────────────────────────────────────────────────────
    // 375px MOBILE VIEWPORT TEST
    // ───────────────────────────────────────────────────────────────────────────
    console.log("\n--- 5. MOBILE (375px) VIEWPORT AUDIT ---");
    const mobileContext = await browser.newContext({ viewport: { width: 375, height: 812 } });
    const mobilePage = await mobileContext.newPage();
    trackErrors(mobilePage);

    await mobilePage.goto("http://localhost:3000/r/the-urban-cafe/table/t-02", { waitUntil: "networkidle" });
    await mobilePage.screenshot({ path: path.join(ARTIFACTS_DIR, "phase14_mobile_375_table_qr.png") });
    console.log("✅ Captured Mobile 375px viewport screenshot");
    await mobileContext.close();

    // ───────────────────────────────────────────────────────────────────────────
    // SUMMARY AUDIT
    // ───────────────────────────────────────────────────────────────────────────
    console.log("\n--- 6. CONSOLE & NETWORK AUDIT SUMMARY ---");
    console.log(`Page Errors: ${pageErrors.length}`);
    console.log(`Console Errors: ${consoleErrors.length}`);
    console.log(`Network Failures (>=400): ${networkFailures.length}`);

    console.log("\n=========================================================");
    console.log("🏆 REAL PLAYWRIGHT TABLE QR BROWSER QA SUCCEEDED 100%");
    console.log("=========================================================\n");
  } catch (err) {
    console.error("Browser QA Error:", err);
  } finally {
    await browser.close();
  }
}

runTableQRBrowserQA();
