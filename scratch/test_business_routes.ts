/**
 * Food Mania — Phase 8 Business Routes & Integration Verification Script
 */

const BASE_URL = "http://localhost:3001";

const routes = [
  "/login",
  "/overview",
  "/orders",
  "/kitchen",
  "/menu",
  "/tables",
  "/reservations",
  "/analytics",
  "/customers",
  "/marketing",
  "/payments",
  "/settings",
  "/staff",
];

async function checkBusinessRoutes() {
  console.log("\n=======================================================");
  console.log("🌐 VERIFYING ALL BUSINESS PORTAL ROUTES (HTTP 200)");
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
    console.log("✨ ALL 13 BUSINESS ROUTES RETURNED HTTP 200 OK!");
  } else {
    console.error("⚠️ SOME BUSINESS ROUTES FAILED.");
    process.exit(1);
  }
  console.log("=======================================================\n");
}

checkBusinessRoutes();
