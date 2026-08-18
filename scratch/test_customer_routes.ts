/**
 * Food Mania — Phase 7 Customer Routes & Integration Verification Script
 */

const BASE_URL = "http://localhost:3000";

const routes = [
  "/",
  "/login",
  "/restaurant/the-urban-cafe",
  "/restaurant/the-urban-cafe/menu",
  "/restaurant/the-urban-cafe/book",
  "/cart",
  "/checkout",
  "/orders",
  "/bookings",
  "/profile",
  "/scan",
];

async function checkRoutes() {
  console.log("\n=======================================================");
  console.log("🌐 VERIFYING ALL CUSTOMER PORTAL ROUTES (HTTP 200)");
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
    console.log("✨ ALL 11 CUSTOMER ROUTES RETURNED HTTP 200 OK!");
  } else {
    console.error("⚠️ SOME CUSTOMER ROUTES FAILED.");
    process.exit(1);
  }
  console.log("=======================================================\n");
}

checkRoutes();
