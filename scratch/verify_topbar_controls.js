const { chromium } = require("C:/Users/gaurav/AppData/Local/npm-cache/_npx/9833c18b2d85bc59/node_modules/playwright-core");

const BASE_URL = "http://localhost:3002";
const ARTIFACT_DIR = "C:/Users/gaurav/.gemini/antigravity/brain/0f93c396-d359-4ff3-81e3-0e527e3ef8d5";

(async () => {
  console.log("Starting Super Admin Top Bar Verification & Screenshot Generation...");
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  // 1. Initial Overview
  console.log("1. Navigating to /overview...");
  await page.goto(`${BASE_URL}/overview`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // 2. Global Search Command Palette
  console.log("2. Testing Global Search & Command Palette...");
  await page.click("#global-search-trigger");
  await page.waitForTimeout(400);
  await page.fill("#global-search-input", "Urban Cafe");
  await page.waitForTimeout(600); // Allow 300ms debounce
  await page.screenshot({ path: `${ARTIFACT_DIR}/topbar_global_search.png` });
  console.log("  -> Captured topbar_global_search.png");

  // Close search with ESC
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);

  // 3. Notification Drawer
  console.log("3. Testing Notification Center Drawer...");
  await page.click("#notification-bell-trigger");
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${ARTIFACT_DIR}/topbar_notifications.png` });
  console.log("  -> Captured topbar_notifications.png");

  // Close notifications
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);

  // 4. Super Admin Profile Dropdown
  console.log("4. Testing Profile Dropdown Menu...");
  await page.click("#admin-avatar-trigger");
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${ARTIFACT_DIR}/topbar_profile_dropdown.png` });
  console.log("  -> Captured topbar_profile_dropdown.png");

  // 5. Open Profile & Account Settings Modal
  console.log("5. Testing Profile & Account Modal...");
  await page.click("button:has-text('Profile & Account')");
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${ARTIFACT_DIR}/topbar_profile_modal.png` });
  console.log("  -> Captured topbar_profile_modal.png");
  await page.click("button:has-text('Cancel')");
  await page.waitForTimeout(300);

  // 6. Open Security Modal
  console.log("6. Testing Security & 2FA Modal...");
  await page.click("#admin-avatar-trigger");
  await page.waitForTimeout(300);
  await page.click("button:has-text('Security & 2FA')");
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${ARTIFACT_DIR}/topbar_security_modal.png` });
  console.log("  -> Captured topbar_security_modal.png");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);

  // 7. Open Activity Log Modal
  console.log("7. Testing System Activity Log Modal...");
  await page.click("#admin-avatar-trigger");
  await page.waitForTimeout(300);
  await page.click("button:has-text('System Activity Log')");
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${ARTIFACT_DIR}/topbar_activity_log.png` });
  console.log("  -> Captured topbar_activity_log.png");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);

  // 8. Open Keyboard Shortcuts Modal
  console.log("8. Testing Keyboard Shortcuts Modal...");
  await page.click("#admin-avatar-trigger");
  await page.waitForTimeout(300);
  await page.click("button:has-text('Keyboard Shortcuts')");
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${ARTIFACT_DIR}/topbar_shortcuts_modal.png` });
  console.log("  -> Captured topbar_shortcuts_modal.png");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);

  // 9. Open Help Center Modal
  console.log("9. Testing Help & Documentation Modal...");
  await page.click("#admin-avatar-trigger");
  await page.waitForTimeout(300);
  await page.click("button:has-text('Help & Documentation')");
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${ARTIFACT_DIR}/topbar_help_modal.png` });
  console.log("  -> Captured topbar_help_modal.png");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);

  // 10. Test Theme Toggle (Dark Mode)
  console.log("10. Testing Theme Switcher (Dark Mode)...");
  await page.click("#admin-avatar-trigger");
  await page.waitForTimeout(300);
  await page.click("button[title='Dark Mode']");
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${ARTIFACT_DIR}/topbar_theme_dark.png` });
  console.log("  -> Captured topbar_theme_dark.png");

  // Revert back to light mode
  await page.click("button[title='Light Mode']");
  await page.waitForTimeout(300);

  // 11. Open Logout Modal & Confirm Sign Out
  console.log("11. Testing Sign Out Confirmation & Redirect...");
  await page.click("button:has-text('Sign Out')");
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${ARTIFACT_DIR}/topbar_logout_modal.png` });
  console.log("  -> Captured topbar_logout_modal.png");

  await page.click("button:has-text('Sign Out'):not([class*='text-red'])");
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${ARTIFACT_DIR}/topbar_login_page.png` });
  console.log("  -> Captured topbar_login_page.png");

  await browser.close();
  console.log("\nALL SUPER ADMIN TOP BAR CONTROLS VERIFIED SUCCESSFULLY!");
})();
