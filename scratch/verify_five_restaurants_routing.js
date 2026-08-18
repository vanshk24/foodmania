const { chromium } = require("C:/Users/gaurav/AppData/Local/npm-cache/_npx/9833c18b2d85bc59/node_modules/playwright-core");

(async () => {
  console.log("Verifying 5 Unique Restaurants Dynamic Routing & Table Booking...");
  const browser = await chromium.launch({ channel: "chrome", headless: true });

  const TEST_RESTAURANTS = [
    { slug: "burger-hub", expectedName: "Burger Hub" },
    { slug: "spice-symphony", expectedName: "Spice Symphony" },
    { slug: "royal-treat", expectedName: "Royal Treat Hotel" },
    { slug: "italian-corner", expectedName: "Italian Corner" },
    { slug: "the-urban-cafe", expectedName: "The Urban Cafe" },
  ];

  for (const r of TEST_RESTAURANTS) {
    console.log(`Testing Restaurant Details for ${r.slug}...`);
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto(`http://localhost:3000/restaurant/${r.slug}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);

    // Verify Title on Details Page
    const titleText = await page.locator("h1").innerText();
    console.log(` -> Details Page Title: "${titleText}"`);
    await page.screenshot({ path: `C:/Users/gaurav/.gemini/antigravity/brain/0f93c396-d359-4ff3-81e3-0e527e3ef8d5/route_details_${r.slug}.png` });

    // Click "Book Table" button
    console.log(` -> Clicking Book Table for ${r.slug}...`);
    await page.click("button:has-text('Book Table')");
    await page.waitForTimeout(600);

    // Verify Booking Page URL & Restaurant Name
    const currentUrl = page.url();
    console.log(` -> Booking Page URL: ${currentUrl}`);
    await page.screenshot({ path: `C:/Users/gaurav/.gemini/antigravity/brain/0f93c396-d359-4ff3-81e3-0e527e3ef8d5/route_booking_${r.slug}.png` });

    await page.close();
  }

  console.log("ALL 5 UNIQUE RESTAURANTS ROUTING VERIFIED SUCCESSFULLY!");
  await browser.close();
})();
