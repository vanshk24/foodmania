const { chromium } = require("C:/Users/gaurav/AppData/Local/npm-cache/_npx/9833c18b2d85bc59/node_modules/playwright-core");

const ARTIFACT_DIR = "C:/Users/gaurav/.gemini/antigravity/brain/0f93c396-d359-4ff3-81e3-0e527e3ef8d5";

(async () => {
  console.log("Opening http://localhost:4000/health in browser...");
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  await page.goto("http://localhost:4000/health", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);

  await page.screenshot({ path: `${ARTIFACT_DIR}/api_health_browser.png` });
  console.log(`Saved screenshot to ${ARTIFACT_DIR}/api_health_browser.png`);

  const pageContent = await page.innerText("body");
  console.log("\nBrowser Body Content:");
  console.log(pageContent);

  await browser.close();
  console.log("\nAPI Health Verification Complete!");
})();
