const { chromium } = require("C:/Users/gaurav/AppData/Local/npm-cache/_npx/9833c18b2d85bc59/node_modules/playwright-core");

const BASE_URL = "http://localhost:3002";
const ARTIFACT_DIR = "C:/Users/gaurav/.gemini/antigravity/brain/0f93c396-d359-4ff3-81e3-0e527e3ef8d5";

(async () => {
  console.log("Starting Top Bar Fast Verification...");
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  // 1. Overview
  await page.goto(`${BASE_URL}/overview`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // 2. Global Search
  console.log("2. Opening Search...");
  await page.evaluate(() => {
    const btn = document.getElementById("global-search-trigger");
    if (btn) btn.click();
  });
  await page.waitForSelector("#global-search-input", { timeout: 5000 });
  await page.fill("#global-search-input", "Urban Cafe");
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${ARTIFACT_DIR}/topbar_global_search.png` });
  console.log("  -> Captured topbar_global_search.png");

  // Close search
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);

  // 3. Notification Center
  console.log("3. Opening Notifications...");
  await page.evaluate(() => {
    const btn = document.getElementById("notification-bell-trigger");
    if (btn) btn.click();
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${ARTIFACT_DIR}/topbar_notifications.png` });
  console.log("  -> Captured topbar_notifications.png");

  // Close notifications
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);

  // 4. Admin Profile Menu
  console.log("4. Opening Profile Dropdown...");
  await page.evaluate(() => {
    const btn = document.getElementById("admin-avatar-trigger");
    if (btn) btn.click();
  });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${ARTIFACT_DIR}/topbar_profile_dropdown.png` });
  console.log("  -> Captured topbar_profile_dropdown.png");

  // 5. Profile Modal
  console.log("5. Opening Profile Modal...");
  await page.click("button:has-text('Profile & Account')");
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${ARTIFACT_DIR}/topbar_profile_modal.png` });
  console.log("  -> Captured topbar_profile_modal.png");
  await page.click("button:has-text('Cancel')");
  await page.waitForTimeout(300);

  // 6. Security Modal
  console.log("6. Opening Security Modal...");
  await page.evaluate(() => document.getElementById("admin-avatar-trigger")?.click());
  await page.waitForTimeout(300);
  await page.click("button:has-text('Security & 2FA')");
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${ARTIFACT_DIR}/topbar_security_modal.png` });
  console.log("  -> Captured topbar_security_modal.png");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);

  // 7. Activity Log Modal
  console.log("7. Opening Activity Log Modal...");
  await page.evaluate(() => document.getElementById("admin-avatar-trigger")?.click());
  await page.waitForTimeout(300);
  await page.click("button:has-text('System Activity Log')");
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${ARTIFACT_DIR}/topbar_activity_log.png` });
  console.log("  -> Captured topbar_activity_log.png");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);

  // 8. Shortcuts Modal
  console.log("8. Opening Shortcuts Modal...");
  await page.evaluate(() => document.getElementById("admin-avatar-trigger")?.click());
  await page.waitForTimeout(300);
  await page.click("button:has-text('Keyboard Shortcuts')");
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${ARTIFACT_DIR}/topbar_shortcuts_modal.png` });
  console.log("  -> Captured topbar_shortcuts_modal.png");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);

  // 9. Help Modal
  console.log("9. Opening Help Modal...");
  await page.evaluate(() => document.getElementById("admin-avatar-trigger")?.click());
  await page.waitForTimeout(300);
  await page.click("button:has-text('Help & Documentation')");
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${ARTIFACT_DIR}/topbar_help_modal.png` });
  console.log("  -> Captured topbar_help_modal.png");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);

  // 10. Theme Switcher (Dark Mode)
  console.log("10. Testing Dark Theme...");
  await page.evaluate(() => document.getElementById("admin-avatar-trigger")?.click());
  await page.waitForTimeout(300);
  await page.click("button[title='Dark Mode']");
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${ARTIFACT_DIR}/topbar_theme_dark.png` });
  console.log("  -> Captured topbar_theme_dark.png");

  // Revert Theme
  await page.click("button[title='Light Mode']");
  await page.waitForTimeout(300);

  // 11. Logout & Redirect
  console.log("11. Testing Logout & Login Page Redirect...");
  await page.click("button:has-text('Sign Out')");
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${ARTIFACT_DIR}/topbar_logout_modal.png` });
  console.log("  -> Captured topbar_logout_modal.png");

  await page.click("button:has-text('Sign Out'):not([class*='text-red'])");
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${ARTIFACT_DIR}/topbar_login_page.png` });
  console.log("  -> Captured topbar_login_page.png");

  await browser.close();
  console.log("FAST TOP BAR VERIFICATION COMPLETE!");
})();
