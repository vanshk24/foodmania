const { chromium } = require("C:/Users/gaurav/AppData/Local/npm-cache/_npx/9833c18b2d85bc59/node_modules/playwright-core");

(async () => {
  console.log("Capturing ALL Master Mobile-First Responsive Breakpoints...");
  const browser = await chromium.launch({ channel: "chrome", headless: true });

  const BREAKPOINTS = [
    { width: 320, height: 568, name: "320px_mobile" },
    { width: 360, height: 740, name: "360px_mobile" },
    { width: 375, height: 667, name: "375px_mobile" },
    { width: 390, height: 844, name: "390px_mobile" },
    { width: 412, height: 915, name: "412px_mobile" },
    { width: 430, height: 932, name: "430px_mobile" },
    { width: 768, height: 1024, name: "768px_tablet" },
    { width: 820, height: 1180, name: "820px_tablet" },
    { width: 1024, height: 768, name: "1024px_tablet" },
    { width: 1280, height: 800, name: "1280px_desktop" },
    { width: 1366, height: 768, name: "1366px_desktop" },
    { width: 1440, height: 900, name: "1440px_desktop" },
    { width: 1600, height: 900, name: "1600px_desktop" },
  ];

  for (const bp of BREAKPOINTS) {
    console.log(`Capturing Customer App at ${bp.name} (${bp.width}x${bp.height})...`);
    const page = await browser.newPage({ viewport: { width: bp.width, height: bp.height } });
    await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    await page.screenshot({ path: `C:/Users/gaurav/.gemini/antigravity/brain/0f93c396-d359-4ff3-81e3-0e527e3ef8d5/resp_${bp.name}.png` });
    await page.close();
  }

  // Also capture Business Panel on Mobile 390px & Desktop 1280px
  console.log("Capturing Business Panel at 390px & 1280px...");
  const bizMobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await bizMobile.goto("http://localhost:3001/overview", { waitUntil: "networkidle" });
  await bizMobile.waitForTimeout(800);
  await bizMobile.screenshot({ path: "C:/Users/gaurav/.gemini/antigravity/brain/0f93c396-d359-4ff3-81e3-0e527e3ef8d5/resp_business_390px.png" });
  await bizMobile.close();

  const bizDesktop = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await bizDesktop.goto("http://localhost:3001/overview", { waitUntil: "networkidle" });
  await bizDesktop.waitForTimeout(800);
  await bizDesktop.screenshot({ path: "C:/Users/gaurav/.gemini/antigravity/brain/0f93c396-d359-4ff3-81e3-0e527e3ef8d5/resp_business_1280px.png" });
  await bizDesktop.close();

  console.log("ALL RESPONSIVE BREAKPOINT SCREENSHOTS CAPTURED SUCCESSFULLY!");
  await browser.close();
})();
