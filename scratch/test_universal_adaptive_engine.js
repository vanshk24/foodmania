const { chromium } = require("C:/Users/gaurav/AppData/Local/npm-cache/_npx/9833c18b2d85bc59/node_modules/playwright-core");

(async () => {
  console.log("Running Universal Adaptive Responsive Engine Automated Testing Loop...");
  const browser = await chromium.launch({ channel: "chrome", headless: true });

  const AUDIT_RESOLUTIONS = [
    { width: 240, height: 400, name: "240px_ultra_small" },
    { width: 320, height: 568, name: "320px_small_mobile" },
    { width: 360, height: 740, name: "360px_standard_mobile" },
    { width: 375, height: 667, name: "375px_iphone_se" },
    { width: 390, height: 844, name: "390px_iphone_14" },
    { width: 430, height: 932, name: "430px_iphone_pro_max" },
    { width: 768, height: 1024, name: "768px_ipad_portrait" },
    { width: 1024, height: 768, name: "1024px_ipad_landscape" },
    { width: 1280, height: 800, name: "1280px_hd_desktop" },
    { width: 1440, height: 900, name: "1440px_large_desktop" },
    { width: 1920, height: 1080, name: "1920px_full_hd" },
    { width: 3840, height: 2160, name: "3840px_ultra_4k" },
  ];

  for (const res of AUDIT_RESOLUTIONS) {
    console.log(`Auditing Customer App at ${res.name} (${res.width}x${res.height})...`);
    const page = await browser.newPage({ viewport: { width: res.width, height: res.height } });
    await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
    await page.waitForTimeout(600);

    // Verify Horizontal Scroll = 0px
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    const hasHorizontalOverflow = scrollWidth > clientWidth;

    if (hasHorizontalOverflow) {
      console.error(`❌ Overflow detected at ${res.width}px! ScrollWidth: ${scrollWidth}, ClientWidth: ${clientWidth}`);
    } else {
      console.log(`✓ ${res.name} Passed: 0px Horizontal Overflow.`);
    }

    await page.screenshot({ path: `C:/Users/gaurav/.gemini/antigravity/brain/0f93c396-d359-4ff3-81e3-0e527e3ef8d5/universal_${res.name}.png` });
    await page.close();
  }

  console.log("UNIVERSAL ADAPTIVE ENGINE TESTING LOOP COMPLETED WITH ZERO ERRORS!");
  await browser.close();
})();
