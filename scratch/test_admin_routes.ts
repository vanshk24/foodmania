/**
 * Food Mania — Phase 9 Super Admin Routes & Integration Verification Script
 */

const BASE_URL = "http://localhost:3002";

const routes = [
  "/login",
  "/overview",
  "/restaurants",
  "/users",
  "/subscriptions",
  "/payments",
  "/reports",
  "/settings",
  "/support",
];

async function checkAdminRoutes() {
  console.log("\n=======================================================");
  console.log("🌐 VERIFYING ALL SUPER ADMIN PORTAL ROUTES (HTTP 200)");
  console.log("=======================================================\n");

  let allPassed = true;

  for (const r of routes) {
    try {
      const res = await fetch(`${BASE_URL}${r}`);
      if (res.status === 200) {
        console.log(`✅ [PASS] ${r} -> HTTP ${res.status}`);
      } else {
        console.error(`❌ [FAIL] ${r} -> HTTP ${res.status}`);
        allPassed = false;
      }
    } catch (e: any) {
      console.error(`❌ [ERROR] ${r} -> ${e.message}`);
      allPassed = false;
    }
  }

  console.log("\n=======================================================");
  if (allPassed) {
    console.log("✨ ALL 9 SUPER ADMIN ROUTES RETURNED HTTP 200 OK!");
  } else {
    console.error("⚠️ SOME SUPER ADMIN ROUTES FAILED.");
    process.exit(1);
  }
  console.log("=======================================================\n");
}

checkAdminRoutes();
