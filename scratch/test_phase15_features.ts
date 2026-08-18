/**
 * Phase 15 Feature Tests
 * - Development Payment Flow (dev-confirm)
 * - Restaurant deactivation/reactivation
 * - Restaurant image update
 * - Payment visibility (admin/business)
 */

const API = "http://localhost:4000";

async function run() {
  let passed = 0;
  let failed = 0;
  const total = 16;

  const check = (label: string, condition: boolean, detail: string) => {
    if (condition) {
      console.log(`✅ [PASS] ${label} — ${detail}`);
      passed++;
    } else {
      console.log(`❌ [FAIL] ${label} — ${detail}`);
      failed++;
    }
  };

  console.log("\n=======================================================");
  console.log("🧪 PHASE 15 FEATURE TESTS");
  console.log("=======================================================\n");

  // --- Auth ---
  const adminLogin = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@foodmania.com", password: "admin123", role: "SUPER_ADMIN" }),
  }).then(r => r.json());
  const adminToken = adminLogin.data?.token || "";

  const ownerLogin = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "rohit@urbancafe.com", password: "owner123", restaurantCode: "URBAN123", role: "OWNER" }),
  }).then(r => r.json());
  const ownerToken = ownerLogin.data?.token || "";

  const custLogin = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "customer1@gmail.com", password: "customer123", role: "CUSTOMER" }),
  }).then(r => r.json());
  const custToken = custLogin.data?.token || "";

  check("1. Admin Auth", !!adminToken, `Admin token: ${adminToken ? "YES" : "NO"}`);
  check("2. Owner Auth", !!ownerToken, `Owner token: ${ownerToken ? "YES" : "NO"}`);

  // --- A: Dev Confirm Payment Flow ---
  // Create an order
  const orderRes = await fetch(`${API}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${custToken}` },
    body: JSON.stringify({
      restaurantId: "the-urban-cafe",
      paymentMethod: "UPI",
      customerName: "Test Phase15",
      customerPhone: "+91 99999 00000",
      tableNumber: "T-05",
      items: [{ menuItemId: "item-101", quantity: 2 }],
    }),
  });
  const orderJson = await orderRes.json();
  const order = orderJson.data || orderJson;
  check("3. Order Created", orderRes.status === 201, `Status: ${orderRes.status}, Order: ${order.orderNumber}`);
  check("4. Order Payment PENDING", order.paymentStatus === "PENDING_PAYMENT", `paymentStatus: ${order.paymentStatus}`);

  // Dev Confirm with valid auth
  const devConfirmRes = await fetch(`${API}/payments/dev-confirm`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${custToken}` },
    body: JSON.stringify({ orderId: order.id }),
  });
  const devConfirmJson = await devConfirmRes.json();
  const dcData = devConfirmJson.data || devConfirmJson;
  check("5. Dev Confirm SUCCESS", devConfirmRes.status === 200, `Status: ${devConfirmRes.status}`);
  check("6. Payment Status SUCCESS", dcData.payment?.status === "SUCCESS", `Payment status: ${dcData.payment?.status}`);
  check("7. Payment Method DEV_PAYMENT", dcData.payment?.method === "DEV_PAYMENT", `Payment method: ${dcData.payment?.method}`);
  check("8. Order PAID", dcData.order?.paymentStatus === "PAID", `Order paymentStatus: ${dcData.order?.paymentStatus}`);
  check("9. Server Amount Matches", Number(dcData.payment?.amount) === Number(order.totalAmount), `Payment: ₹${dcData.payment?.amount}, Order: ₹${order.totalAmount}`);

  // Idempotency: confirm again
  const devConfirmAgain = await fetch(`${API}/payments/dev-confirm`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${custToken}` },
    body: JSON.stringify({ orderId: order.id }),
  });
  const dcAgain = await devConfirmAgain.json();
  check("10. Idempotent Confirm", (dcAgain.data || dcAgain).alreadyConfirmed === true, `alreadyConfirmed: ${(dcAgain.data || dcAgain).alreadyConfirmed}`);

  // --- B: Restaurant Deactivation / Reactivation ---
  // Deactivate
  const deactivateRes = await fetch(`${API}/admin/restaurants/the-urban-cafe`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({ status: "SUSPENDED" }),
  });
  check("11. Restaurant Deactivated", deactivateRes.status === 200, `PATCH status: ${deactivateRes.status}`);

  // Customer discovery should exclude it
  const discoveryRes = await fetch(`${API}/restaurants`).then(r => r.json());
  const activeList = (discoveryRes.data || []);
  const found = activeList.find((r: any) => r.id === "the-urban-cafe");
  check("12. Excluded from Discovery", !found, `Found in public list: ${found ? "YES (WRONG!)" : "NO (Correct)"}`);

  // Reactivate
  const reactivateRes = await fetch(`${API}/admin/restaurants/the-urban-cafe`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({ status: "ACTIVE" }),
  });
  check("13. Restaurant Reactivated", reactivateRes.status === 200, `PATCH status: ${reactivateRes.status}`);

  // Now visible again
  const discoveryRes2 = await fetch(`${API}/restaurants`).then(r => r.json());
  const found2 = (discoveryRes2.data || []).find((r: any) => r.id === "the-urban-cafe");
  check("14. Visible After Reactivation", !!found2, `Found in public list: ${found2 ? "YES" : "NO"}`);

  // --- C: Restaurant Image Update ---
  const imgRes = await fetch(`${API}/admin/restaurants/the-urban-cafe`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({ imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800" }),
  });
  check("15. Image URL Updated", imgRes.status === 200, `PATCH status: ${imgRes.status}`);

  // Verify image persisted
  const restDetail = await fetch(`${API}/restaurants/the-urban-cafe`).then(r => r.json());
  const restData = restDetail.data || restDetail;
  check("16. Image Persisted", restData.imageUrl?.includes("unsplash"), `imageUrl: ${restData.imageUrl?.slice(0, 60)}...`);

  console.log(`\n=======================================================`);
  console.log(`📊 PHASE 15 FEATURE TEST SUMMARY: ${passed}/${total} PASSED (${((passed / total) * 100).toFixed(1)}%)`);
  console.log(`=======================================================\n`);
}

run().catch(console.error);
