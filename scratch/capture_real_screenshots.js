const puppeteer = require("puppeteer");
const path = require("path");

const targetDir = "C:\\Users\\gaurav\\.gemini\\antigravity\\brain\\0f93c396-d359-4ff3-81e3-0e527e3ef8d5";

const pagesToCapture = [
  { url: "http://localhost:3000", filename: "real_localhost_home.png" },
  { url: "http://localhost:3000/restaurant/the-urban-cafe", filename: "real_localhost_restaurant.png" },
  { url: "http://localhost:3000/restaurant/the-urban-cafe/menu", filename: "real_localhost_menu.png" },
  { url: "http://localhost:3000/restaurant/the-urban-cafe/book", filename: "real_localhost_book.png" },
];

(async () => {
  console.log("Launching Headless Chrome for REAL browser screenshots...");
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1280,900"],
  });

  for (const item of pagesToCapture) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });
    console.log(`Navigating to ${item.url}...`);
    
    // Listen to page console errors to verify clean render
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        console.error(`[BROWSER CONSOLE ERROR] ${msg.text()}`);
      }
    });

    await page.goto(item.url, { waitUntil: "networkidle0", timeout: 30000 });
    // Additional brief pause to allow framer-motion / CSS transitions to settle
    await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 1500)));

    const outputPath = path.join(targetDir, item.filename);
    await page.screenshot({ path: outputPath, fullPage: true });
    console.log(`✓ CAPTURED REAL BROWSER SCREENSHOT: ${outputPath}`);
    await page.close();
  }

  await browser.close();
  console.log("ALL REAL LOCALHOST SCREENSHOTS CAPTURED SUCCESSFULLY!");
})();
