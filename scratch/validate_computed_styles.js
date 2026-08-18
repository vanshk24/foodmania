const { chromium } = require("playwright");

(async () => {
  console.log("Starting Computed Style Inspection on http://localhost:3000...");
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage();
  
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  const computedAudit = await page.evaluate(() => {
    function getStyles(selector) {
      const el = document.querySelector(selector);
      if (!el) return null;
      const cs = window.getComputedStyle(el);
      return {
        backgroundColor: cs.backgroundColor,
        color: cs.color,
        borderRadius: cs.borderRadius,
        boxShadow: cs.boxShadow,
        display: cs.display,
        fontFamily: cs.fontFamily,
      };
    }

    return {
      body: getStyles("body"),
      header: getStyles("header"),
      filterButton: getStyles("#search-filter-button"),
      categoryAll: getStyles("#cat-all"),
      restaurantCard: getStyles("article"),
    };
  });

  console.log("COMPUTED STYLES VERIFICATION RESULT:");
  console.log(JSON.stringify(computedAudit, null, 2));

  await browser.close();
})();
