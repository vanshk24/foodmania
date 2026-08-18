/**
 * Food Mania — Phase 6.1 Payment Foundation & Security Test Suite
 * Tests all 18 security, data integrity, tenant isolation, and visibility invariants against real PostgreSQL backend.
 */

const API_BASE = "http://localhost:4000";

let passedCount = 0;
let failedCount = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`✅ [PASS] ${testName}${detail ? ` — ${detail}` : ""}`);
    passedCount++;
  } else {
    console.error(`❌ [FAIL] ${testName}${detail ? ` — ${detail}` : ""}`);
    failedCount++;
  }
}

async function runTests() {
  console.log("\n=======================================================");
  console.log("🛡️ STARTING PHASE 6.1 PAYMENT FOUNDATION SECURITY TESTS");
  console.log("=======================================================\n");

  // Auth tokens
  // 1. Admin login
  const adminLoginRes = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@foodmania.com", password: "admin123" }),
  });
  const adminJson = await adminLoginRes.json();
  const adminToken = adminJson.data?.token || adminJson.token;

  // 2. Customer 1 (User 1) login
  const cust1Res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "gaurav@example.com", password: "password123" }),
  });
  const cust1Json = await cust1Res.json();
  const cust1Token = cust1Json.data?.token || cust1Json.token;
  const cust1User = cust1Json.data?.user || cust1Json.user;

  // 3. Restaurant A Owner (Rohit - The Urban Cafe) login
  const ownerARes = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "rohit@urbancafe.com", password: "owner123" }),
  });
  const ownerAJson = await ownerARes.json();
  const ownerAToken = ownerAJson.data?.token || ownerAJson.token;

  // Get The Urban Cafe menu to get real item IDs and prices
  const menuRes = await fetch(`${API_BASE}/restaurants/the-urban-cafe/menu`);
  const menuJson = await menuRes.json();
  const menuData = menuJson.data || menuJson;
  const categories = Array.isArray(menuData) ? menuData : (menuData.categories || []);
  const allItems = categories.flatMap((c: any) => c.items || []);
  const availableItems = allItems.filter((i: any) => i.isAvailable !== false);
  const item1 = availableItems[0] || { id: "item-103", price: 360 };
  const item2 = availableItems[1] || { id: "item-101", price: 240 };

  // Get Burger Hub menu to get an item from another restaurant
  const bMenuRes = await fetch(`${API_BASE}/restaurants/burger-hub/menu`);
  const bMenuJson = await bMenuRes.json();
  const bMenuData = bMenuJson.data || bMenuJson;
  const bCategories = Array.isArray(bMenuData) ? bMenuData : (bMenuData.categories || []);
  const bItem = (bCategories.flatMap((c: any) => c.items || []))[0] || { id: "b-item-201" };

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 1: Correct Menu Price Calculation (Server Authoritative)
  // ───────────────────────────────────────────────────────────────────────────
  const expectedTotal1 = item1.price * 2 + item2.price * 1;
  const order1Res = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cust1Token}`,
    },
    body: JSON.stringify({
      restaurantId: "the-urban-cafe",
      userId: cust1User.id,
      items: [
        { menuItemId: item1.id, quantity: 2 },
        { menuItemId: item2.id, quantity: 1 },
      ],
    }),
  });
  const order1Json = await order1Res.json();
  const order1 = order1Json.data || order1Json;
  assert(
    order1?.totalAmount === expectedTotal1,
    "1. Correct menu price calculation",
    `Expected ₹${expectedTotal1}, Got ₹${order1?.totalAmount}`
  );

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 2: Client Attempts to Manipulate totalAmount
  // ───────────────────────────────────────────────────────────────────────────
  const order2Res = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cust1Token}`,
    },
    body: JSON.stringify({
      restaurantId: "the-urban-cafe",
      totalAmount: 1, // Malicious attempt to set total to ₹1
      userId: cust1User.id,
      items: [{ menuItemId: item1.id, quantity: 1 }],
    }),
  });
  const order2Json = await order2Res.json();
  const order2 = order2Json.data || order2Json;
  assert(
    order2?.totalAmount === item1.price && order2?.totalAmount !== 1,
    "2. Client attempts to manipulate totalAmount rejected",
    `Server enforced ₹${item1.price} instead of client-submitted ₹1`
  );

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 3: Client Attempts to Manipulate Item Price
  // ───────────────────────────────────────────────────────────────────────────
  const order3Res = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cust1Token}`,
    },
    body: JSON.stringify({
      restaurantId: "the-urban-cafe",
      userId: cust1User.id,
      items: [{ menuItemId: item1.id, quantity: 1, price: 5 }], // Malicious ₹5 price
    }),
  });
  const order3Json = await order3Res.json();
  const order3 = order3Json.data || order3Json;
  assert(
    order3?.totalAmount === item1.price,
    "3. Client attempts to manipulate item price rejected",
    `Server calculated ₹${item1.price} disregarding client item price ₹5`
  );

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 4: Invalid Menu Item ID
  // ───────────────────────────────────────────────────────────────────────────
  const order4Res = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      restaurantId: "the-urban-cafe",
      items: [{ menuItemId: "invalid-item-uuid-99999", quantity: 1 }],
    }),
  });
  assert(
    order4Res.status === 404,
    "4. Invalid menu item rejected with 404",
    `Status: ${order4Res.status}`
  );

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 5: Menu Item Belonging to Another Restaurant
  // ───────────────────────────────────────────────────────────────────────────
  const order5Res = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      restaurantId: "the-urban-cafe",
      items: [{ menuItemId: bItem.id, quantity: 1 }], // Burger Hub item sent to Urban Cafe
    }),
  });
  assert(
    order5Res.status === 400,
    "5. Cross-restaurant menu item rejected with 400",
    `Status: ${order5Res.status}`
  );

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 6: Unavailable Menu Item
  // ───────────────────────────────────────────────────────────────────────────
  // Create an unavailable item
  const tempItemRes = await fetch(`${API_BASE}/restaurants/the-urban-cafe/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ownerAToken}`,
    },
    body: JSON.stringify({
      name: "Out of Stock Seasonal Tart",
      price: 350,
      categoryId: categories[0].id,
      isAvailable: false,
    }),
  });
  const tempItemJson = await tempItemRes.json();
  const unavailItem = tempItemJson.data || tempItemJson;

  const order6Res = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      restaurantId: "the-urban-cafe",
      items: [{ menuItemId: unavailItem.id, quantity: 1 }],
    }),
  });
  assert(
    order6Res.status === 400,
    "6. Unavailable menu item rejected with 400",
    `Status: ${order6Res.status}`
  );

  // Clean up temp item
  await fetch(`${API_BASE}/restaurants/items/${unavailItem.id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${ownerAToken}` },
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 7: Invalid Quantity (0 or negative)
  // ───────────────────────────────────────────────────────────────────────────
  const order7Res = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      restaurantId: "the-urban-cafe",
      items: [{ menuItemId: item1.id, quantity: 0 }],
    }),
  });
  assert(
    order7Res.status === 400,
    "7. Invalid quantity (0) rejected with 400",
    `Status: ${order7Res.status}`
  );

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 8: New Order is NOT Marked PAID Before Payment
  // ───────────────────────────────────────────────────────────────────────────
  assert(
    order1.paymentStatus === "PENDING_PAYMENT",
    "8. New order is NOT marked PAID (status is PENDING_PAYMENT)",
    `Order paymentStatus: ${order1.paymentStatus}`
  );

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 9: New Payment is NOT SUCCESS Automatically
  // ───────────────────────────────────────────────────────────────────────────
  const payment1 = order1.payment;
  assert(
    payment1 && payment1.status === "PENDING",
    "9. New Payment is NOT SUCCESS automatically (status is PENDING)",
    `Payment status: ${payment1?.status}`
  );

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 10: Payment ↔ Order Relationship
  // ───────────────────────────────────────────────────────────────────────────
  assert(
    payment1?.orderId === order1.id,
    "10. Payment ↔ Order relationship verified",
    `Payment orderId (${payment1?.orderId}) matches Order id (${order1.id})`
  );

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 11: Payment ↔ User Relationship
  // ───────────────────────────────────────────────────────────────────────────
  assert(
    payment1?.userId === cust1User.id,
    "11. Payment ↔ User relationship verified",
    `Payment userId (${payment1?.userId}) matches Customer userId (${cust1User.id})`
  );

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 12: Payment ↔ Restaurant Relationship
  // ───────────────────────────────────────────────────────────────────────────
  assert(
    payment1?.restaurantId === order1.restaurantId,
    "12. Payment ↔ Restaurant relationship verified",
    `Payment restaurantId (${payment1?.restaurantId}) matches Restaurant (${order1.restaurantId})`
  );

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 13: Payment Amount Must Match the Authoritative Order Amount
  // ───────────────────────────────────────────────────────────────────────────
  assert(
    payment1?.amount === order1.totalAmount,
    "13. Payment amount matches authoritative order amount",
    `Payment: ₹${payment1?.amount}, Order: ₹${order1.totalAmount}`
  );

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 14: Unauthorized User Cannot Access Another User's Payment
  // ───────────────────────────────────────────────────────────────────────────
  // Login customer 2
  const cust2Res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "priya@example.com", password: "password123" }),
  });
  const cust2Json = await cust2Res.json();
  const cust2Token = cust2Json.data?.token || cust2Json.token;

  const crossUserPaymentRes = await fetch(`${API_BASE}/payments/${payment1.id}`, {
    headers: { Authorization: `Bearer ${cust2Token}` },
  });
  assert(
    crossUserPaymentRes.status === 403,
    "14. Unauthorized user cannot access another user's payment (403 Forbidden)",
    `Status: ${crossUserPaymentRes.status}`
  );

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 15: Restaurant Owner Cannot Access Another Restaurant's Payment
  // ───────────────────────────────────────────────────────────────────────────
  let ownerBToken: string;
  const regOwnerBRes = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "owner_burger_security_test@example.com",
      password: "password123",
      name: "Burger Hub Owner",
      role: "OWNER",
      restaurantCode: "BURGER123",
    }),
  });
  if (regOwnerBRes.status === 201 || regOwnerBRes.status === 200) {
    const json = await regOwnerBRes.json();
    ownerBToken = json.data?.token || json.token;
  } else {
    const loginB = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "owner_burger_security_test@example.com",
        password: "password123",
        restaurantCode: "BURGER123",
      }),
    });
    const json = await loginB.json();
    ownerBToken = json.data?.token || json.token;
  }

  const crossTenantPaymentRes = await fetch(`${API_BASE}/payments/${payment1.id}`, {
    headers: { Authorization: `Bearer ${ownerBToken}` },
  });
  assert(
    crossTenantPaymentRes.status === 403,
    "15. Restaurant owner cannot access another restaurant's payment (403 Forbidden)",
    `Status: ${crossTenantPaymentRes.status}`
  );

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 16: Duplicate Payment Confirmation Idempotency Guard
  // ───────────────────────────────────────────────────────────────────────────
  // Admin updates payment to SUCCESS
  const updatePayRes1 = await fetch(`${API_BASE}/payments/${payment1.id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      status: "SUCCESS",
      gatewayPaymentId: "pay_test_12345",
    }),
  });
  const updatedPayJson1 = await updatePayRes1.json();
  const paySuccess = updatedPayJson1.data || updatedPayJson1;

  // Duplicate update attempt (idempotent)
  const updatePayRes2 = await fetch(`${API_BASE}/payments/${payment1.id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      status: "SUCCESS",
      gatewayPaymentId: "pay_test_12345",
    }),
  });

  const orderAfterPay = await (await fetch(`${API_BASE}/orders/${order1.id}`)).json();
  const orderAfterPayData = orderAfterPay.data || orderAfterPay;

  assert(
    paySuccess?.status === "SUCCESS" &&
    orderAfterPayData?.paymentStatus === "PAID" &&
    updatePayRes2.status === 200,
    "16. Duplicate payment confirmation is handled safely and idempotently",
    `Payment: ${paySuccess?.status}, Order: ${orderAfterPayData?.paymentStatus}`
  );

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 17: Business Owner Cannot Manually Mark Payment SUCCESS
  // ───────────────────────────────────────────────────────────────────────────
  // Create a new pending order
  const orderNewRes = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      restaurantId: "the-urban-cafe",
      items: [{ menuItemId: item1.id, quantity: 1 }],
    }),
  });
  const orderNew = (await orderNewRes.json()).data;
  const payNew = orderNew.payment;

  const ownerAttemptUpdate = await fetch(`${API_BASE}/payments/${payNew.id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ownerAToken}`,
    },
    body: JSON.stringify({ status: "SUCCESS" }),
  });
  assert(
    ownerAttemptUpdate.status === 403,
    "17. Business owner cannot manually force payment status to SUCCESS (403 Forbidden)",
    `Status: ${ownerAttemptUpdate.status}`
  );

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 18: Existing Order Endpoints (GET, PATCH status) Remain Fully Functional
  // ───────────────────────────────────────────────────────────────────────────
  const getOrderRes = await fetch(`${API_BASE}/orders/${order1.id}`);
  const getOrderJson = await getOrderRes.json();
  const fetchedOrder = getOrderJson.data || getOrderJson;

  const patchStatusRes = await fetch(`${API_BASE}/orders/${order1.id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ownerAToken}`,
    },
    body: JSON.stringify({ status: "ACCEPTED" }),
  });

  assert(
    getOrderRes.status === 200 &&
    fetchedOrder?.id === order1.id &&
    patchStatusRes.status === 200,
    "18. Existing order APIs (GET /orders/:id, PATCH /orders/:id/status) remain functional",
    `Fetched Order: ${fetchedOrder?.orderNumber}, Patch status: ${patchStatusRes.status}`
  );

  console.log("\n=======================================================");
  console.log(`📊 SECURITY TEST SUMMARY: ${passedCount}/18 PASSED (${((passedCount / 18) * 100).toFixed(1)}%)`);
  console.log("=======================================================\n");

  if (failedCount > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
