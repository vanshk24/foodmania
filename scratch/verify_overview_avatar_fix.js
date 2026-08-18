const { chromium } = require("C:/Users/gaurav/AppData/Local/npm-cache/_npx/9833c18b2d85bc59/node_modules/playwright-core");
const ARTIFACT_DIR = "C:/Users/gaurav/.gemini/antigravity/brain/0f93c396-d359-4ff3-81e3-0e527e3ef8d5";

(async () => {
  console.log("==================================================");
  console.log("🔍 VERIFYING BUSINESS OVERVIEW AVATAR LAYOUT FIX");
  console.log("==================================================");

  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  console.log("Navigating to Business Dashboard Overview http://localhost:3001/overview...");
  await page.goto("http://localhost:3001/overview", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // Measure header avatar dimensions
  const avatarBoundingBox = await page.evaluate(() => {
    const headerAvatar = document.querySelector("header img") || document.querySelector("header div[style*='border-radius']");
    if (!headerAvatar) return null;
    const rect = headerAvatar.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height,
      top: rect.top,
      left: rect.left,
      tagName: headerAvatar.tagName,
    };
  });

  console.log("\nHeader Avatar Dimensions Measurement:");
  console.log("-------------------------------------");
  console.log(`Element: <${avatarBoundingBox?.tagName || 'UNKNOWN'}>`);
  console.log(`Measured Width:  ${avatarBoundingBox?.width}px`);
  console.log(`Measured Height: ${avatarBoundingBox?.height}px`);

  if (avatarBoundingBox && avatarBoundingBox.width <= 48 && avatarBoundingBox.height <= 48) {
    console.log("✅ AVATAR DIMENSIONS PERFECT! (BOUNDED WITHIN CONTAINER)");
  } else {
    console.error("❌ AVATAR DIMENSION MISMATCH:", avatarBoundingBox);
  }

  // Save after screenshot
  await page.screenshot({ path: `${ARTIFACT_DIR}/business_overview_after_avatar_fix.png` });
  console.log(`\nSaved screenshot to ${ARTIFACT_DIR}/business_overview_after_avatar_fix.png`);

  await browser.close();
  console.log("==================================================");
})();
