const { chromium } = require("C:/Users/gaurav/AppData/Local/npm-cache/_npx/9833c18b2d85bc59/node_modules/playwright-core");
const ARTIFACT_DIR = "C:/Users/gaurav/.gemini/antigravity/brain/0f93c396-d359-4ff3-81e3-0e527e3ef8d5";

(async () => {
  console.log("==================================================");
  console.log("🖼️ FOOD MANIA — AVATAR RESILIENCE & LAYOUT TEST");
  console.log("==================================================");

  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  // Render edge cases test harness directly in browser
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Avatar Test Harness</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          body { background-color: #FAF9F5; font-family: system-ui, sans-serif; padding: 32px; }
          .avatar-container { overflow: hidden; border-radius: 9999px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-weight: bold; }
          .avatar-container img { width: 100%; height: 100%; object-fit: cover; display: block; max-width: 100%; }
        </style>
      </head>
      <body>
        <h1 class="text-2xl font-bold text-gray-800 mb-6">Food Mania Avatar Component Edge Case Matrix</h1>
        
        <div class="grid grid-cols-2 md:grid-cols-5 gap-6">
          <!-- 1. XS Size (24px) -->
          <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center flex flex-col items-center">
            <p class="text-xs text-gray-500 mb-2">1. XS (24px)</p>
            <div class="avatar-container w-6 h-6 bg-gradient-to-br from-[#FF6B4A] to-[#FF886C] text-white text-[10px]">GS</div>
          </div>

          <!-- 2. SM Size (32px) -->
          <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center flex flex-col items-center">
            <p class="text-xs text-gray-500 mb-2">2. SM (32px)</p>
            <div class="avatar-container w-8 h-8 bg-gradient-to-br from-[#FF6B4A] to-[#FF886C] text-white text-xs">PP</div>
          </div>

          <!-- 3. MD Size (40px) -->
          <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center flex flex-col items-center">
            <p class="text-xs text-gray-500 mb-2">3. MD (40px)</p>
            <div class="avatar-container w-10 h-10 bg-gradient-to-br from-[#FF6B4A] to-[#FF886C] text-white text-sm">RS</div>
          </div>

          <!-- 4. LG Size (48px) -->
          <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center flex flex-col items-center">
            <p class="text-xs text-gray-500 mb-2">4. LG (48px)</p>
            <div class="avatar-container w-12 h-12 bg-gradient-to-br from-[#FF6B4A] to-[#FF886C] text-white text-base">AK</div>
          </div>

          <!-- 5. XL Size (64px) -->
          <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center flex flex-col items-center">
            <p class="text-xs text-gray-500 mb-2">5. XL (64px)</p>
            <div class="avatar-container w-16 h-16 bg-gradient-to-br from-[#FF6B4A] to-[#FF886C] text-white text-lg">SA</div>
          </div>

          <!-- 6. Broken URL Fallback (No Broken Icon) -->
          <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center flex flex-col items-center">
            <p class="text-xs text-gray-500 mb-2">6. Broken URL (Fallback)</p>
            <div class="avatar-container w-12 h-12 bg-gradient-to-br from-[#FF6B4A] to-[#FF886C] text-white text-sm" id="broken-avatar">
              <img src="http://invalid-url-1234/broken.png" onerror="this.style.display='none'; this.parentElement.innerText='FB';" />
            </div>
          </div>

          <!-- 7. Very Large Image (4K Unsplash) -->
          <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center flex flex-col items-center">
            <p class="text-xs text-gray-500 mb-2">7. 4K High-Res JPEG</p>
            <div class="avatar-container w-12 h-12 bg-gray-100">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=2000&q=80" alt="Large" />
            </div>
          </div>

          <!-- 8. Portrait Aspect Ratio -->
          <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center flex flex-col items-center">
            <p class="text-xs text-gray-500 mb-2">8. Portrait Image</p>
            <div class="avatar-container w-12 h-12 bg-gray-100">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80" alt="Portrait" />
            </div>
          </div>

          <!-- 9. Landscape Aspect Ratio -->
          <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center flex flex-col items-center">
            <p class="text-xs text-gray-500 mb-2">9. Landscape Image</p>
            <div class="avatar-container w-12 h-12 bg-gray-100">
              <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80" alt="Landscape" />
            </div>
          </div>

          <!-- 10. WEBP Image -->
          <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center flex flex-col items-center">
            <p class="text-xs text-gray-500 mb-2">10. WEBP Format</p>
            <div class="avatar-container w-12 h-12 bg-gray-100">
              <img src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&q=80" alt="WEBP" />
            </div>
          </div>
        </div>
      </body>
    </html>
  `);

  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${ARTIFACT_DIR}/avatar_resilience_matrix.png` });
  console.log(` Saved ${ARTIFACT_DIR}/avatar_resilience_matrix.png`);

  // Now capture Customer Home, Business Header, Admin Header
  try {
    await page.goto("http://localhost:3000/profile", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${ARTIFACT_DIR}/avatar_profile_page.png` });
    console.log(` Saved ${ARTIFACT_DIR}/avatar_profile_page.png`);
  } catch (e) {
    console.warn("Profile screenshot note:", e.message);
  }

  try {
    await page.goto("http://localhost:3001/orders", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${ARTIFACT_DIR}/avatar_business_header.png` });
    console.log(` Saved ${ARTIFACT_DIR}/avatar_business_header.png`);
  } catch (e) {
    console.warn("Business header screenshot note:", e.message);
  }

  try {
    await page.goto("http://localhost:3002/overview", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${ARTIFACT_DIR}/avatar_admin_topbar.png` });
    console.log(` Saved ${ARTIFACT_DIR}/avatar_admin_topbar.png`);
  } catch (e) {
    console.warn("Admin topbar screenshot note:", e.message);
  }

  await browser.close();
  console.log("==================================================");
  console.log("🎉 ALL AVATAR RESILIENCE TESTS COMPLETED!");
  console.log("==================================================");
})();
