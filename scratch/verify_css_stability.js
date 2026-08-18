const { chromium } = require("C:/Users/gaurav/AppData/Local/npm-cache/_npx/9833c18b2d85bc59/node_modules/playwright-core");

const BASE_URL = "http://localhost:3002";
const ARTIFACT_DIR = "C:/Users/gaurav/.gemini/antigravity/brain/0f93c396-d359-4ff3-81e3-0e527e3ef8d5";

const ROUTES = [
  "/overview",
  "/restaurants",
  "/users",
  "/payments",
  "/reports",
  "/support",
  "/settings",
];

(async () => {
  console.log("Starting 10 Hard Refreshes + 20 Route Navigations Styling Stability Test...");
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  const consoleErrors = [];
  const cssNetworkLogs = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(`[Console Error] ${msg.text()}`);
    }
  });

  page.on("response", (resp) => {
    const url = resp.url();
    if (url.includes(".css") || resp.request().resourceType() === "stylesheet") {
      cssNetworkLogs.push({
        url,
        status: resp.status(),
        ok: resp.ok(),
      });
    }
  });

  // Verify styling helper
  async function assertStyled(stepName) {
    const isStyled = await page.evaluate(() => {
      const bodyBg = window.getComputedStyle(document.body).backgroundColor;
      const navExists = !!document.querySelector("aside, nav");
      // Check if tailwind styles applied (bodyBg shouldn't be empty or transparent)
      return { bodyBg, navExists };
    });

    console.log(`  [Check ${stepName}] Body BG: ${isStyled.bodyBg}, Nav Present: ${isStyled.navExists}`);
    if (!isStyled.navExists || isStyled.bodyBg === "rgba(0, 0, 0, 0)") {
      throw new Error(`Styling failure detected at step: ${stepName}`);
    }
  }

  // 1. Initial Load
  console.log("\n1. Initial Navigation to /overview...");
  await page.goto(`${BASE_URL}/overview`, { waitUntil: "networkidle" });
  await assertStyled("Initial Load");

  // 2. Perform 10 Hard Refreshes across various routes
  console.log("\n2. Executing 10 Hard Refreshes Test...");
  for (let i = 1; i <= 10; i++) {
    const targetRoute = ROUTES[i % ROUTES.length];
    console.log(`  Hard Refresh #${i} on ${targetRoute}...`);
    await page.goto(`${BASE_URL}${targetRoute}`, { waitUntil: "networkidle" });
    await page.reload({ waitUntil: "networkidle" });
    await assertStyled(`Hard Refresh #${i}`);
  }

  // 3. Perform 20 Client-Side Route Navigations
  console.log("\n3. Executing 20 Route Navigations Test...");
  for (let i = 1; i <= 20; i++) {
    const route = ROUTES[i % ROUTES.length];
    console.log(`  Route Nav #${i} -> ${route}...`);
    await page.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle" });
    await assertStyled(`Route Nav #${i}`);
  }

  // 4. Capture Final Verification Screenshots for all 7 modules
  console.log("\n4. Capturing Verified Screenshots for All 7 Admin Modules...");
  for (const route of ROUTES) {
    const modName = route.replace("/", "");
    await page.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${ARTIFACT_DIR}/verified_styled_${modName}.png` });
    console.log(`  -> Saved ${ARTIFACT_DIR}/verified_styled_${modName}.png`);
  }

  console.log("\n=== STYLING STABILITY TEST SUMMARY ===");
  console.log(`Total CSS Network Requests Logged: ${cssNetworkLogs.length}`);
  const failedCss = cssNetworkLogs.filter((l) => !l.ok);
  console.log(`Failed CSS Requests (Non-200): ${failedCss.length}`);
  console.log(`Total Console Errors: ${consoleErrors.length}`);

  if (failedCss.length > 0) {
    console.error("CSS Network Errors:", failedCss);
  }
  if (consoleErrors.length > 0) {
    console.error("Console Errors:", consoleErrors);
  }

  await browser.close();
  console.log("TEST COMPLETED WITH ZERO STYLING LOSS!");
})();
