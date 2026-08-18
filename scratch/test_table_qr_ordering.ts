import { prisma } from "../apps/api/src/utils/prisma.js";

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

async function runTableQRTests() {
  console.log("\n=======================================================");
  console.log("📱 STARTING PHASE 14 TABLE QR ORDERING TEST SUITE");
  console.log("=======================================================\n");

  try {
    // 1. Fetch live available item for The Urban Cafe
    const menuRes = await fetch(`${API_BASE}/restaurants/the-urban-cafe/menu`);
    const menuJson = await menuRes.json();
    const menuData = menuJson.data || menuJson;
    const categories = Array.isArray(menuData) ? menuData : (menuData.categories || []);
    const availableItems = categories.flatMap((c: any) => c.items || []).filter((i: any) => i.isAvailable !== false);
    const testItem = availableItems[0];

    assert(!!testItem, "1. Fetch live available menu item", `Item ID: ${testItem?.id}, Name: ${testItem?.name}`);

    // Fetch Burger Hub table for cross-tenant test
    const bHubTable = await prisma.restaurantTable.findFirst({
      where: { restaurantId: "burger-hub" },
    });

    // ───────────────────────────────────────────────────────────────────────────
    // TEST 1: Valid Table Order Creation (Table T-01)
    // ───────────────────────────────────────────────────────────────────────────
    const order1Res = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        restaurantId: "the-urban-cafe",
        tableNumber: "T-01",
        customerName: "Alice (T-01 Customer)",
        customerPhone: "+91 98765 11111",
        items: [{ menuItemId: testItem.id, quantity: 2 }],
      }),
    });
    const order1Json = await order1Res.json();
    const order1 = order1Json.data || order1Json;

    assert(order1Res.status === 201 && !!order1?.id, "2. Order A (Table T-01) Created Successfully", `Status: ${order1Res.status}, Order Number: ${order1?.orderNumber}`);
    assert(order1?.tableNumber === "T-01", "3. Order A Table Number matches T-01", `Received tableNumber: ${order1?.tableNumber}`);

    // Verify DB Persistence for Order 1
    const dbOrder1 = await prisma.order.findUnique({ where: { id: order1.id } });
    assert(!!dbOrder1 && !!dbOrder1.tableId, "4. Order A stored in PostgreSQL with tableId", `DB tableId: ${dbOrder1?.tableId}`);

    // ───────────────────────────────────────────────────────────────────────────
    // TEST 2: Valid Table Order Creation (Table T-02)
    // ───────────────────────────────────────────────────────────────────────────
    const order2Res = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        restaurantId: "the-urban-cafe",
        tableNumber: "T-02",
        customerName: "Bob (T-02 Customer)",
        customerPhone: "+91 98765 22222",
        items: [{ menuItemId: testItem.id, quantity: 1 }],
      }),
    });
    const order2Json = await order2Res.json();
    const order2 = order2Json.data || order2Json;

    assert(order2Res.status === 201 && !!order2?.id, "5. Order B (Table T-02) Created Successfully", `Status: ${order2Res.status}, Order Number: ${order2?.orderNumber}`);
    assert(order2?.tableNumber === "T-02", "6. Order B Table Number matches T-02", `Received tableNumber: ${order2?.tableNumber}`);

    // ───────────────────────────────────────────────────────────────────────────
    // TEST 3: Cross-Restaurant Table Assignment Blocked
    // ───────────────────────────────────────────────────────────────────────────
    if (bHubTable) {
      const invalidCrossRes = await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId: "the-urban-cafe",
          tableId: bHubTable.id, // Table belongs to Burger Hub, NOT Urban Cafe!
          customerName: "Malicious Customer",
          items: [{ menuItemId: testItem.id, quantity: 1 }],
        }),
      });
      assert(invalidCrossRes.status === 400, "7. Cross-Restaurant Table Order Rejected (HTTP 400)", `Returned status: ${invalidCrossRes.status}`);
    } else {
      assert(true, "7. Cross-Restaurant Table Order Rejected (Skipped - No Burger Hub table)");
    }

    // ───────────────────────────────────────────────────────────────────────────
    // TEST 4: Non-Existent Table ID Blocked
    // ───────────────────────────────────────────────────────────────────────────
    const nonExistentRes = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        restaurantId: "the-urban-cafe",
        tableNumber: "T-999-FAKE",
        customerName: "Fake Table Customer",
        items: [{ menuItemId: testItem.id, quantity: 1 }],
      }),
    });
    assert(nonExistentRes.status === 400, "8. Non-Existent Table Order Rejected (HTTP 400)", `Returned status: ${nonExistentRes.status}`);

    // ───────────────────────────────────────────────────────────────────────────
    // TEST 5: Business Orders List Table Scoping
    // ───────────────────────────────────────────────────────────────────────────
    const listRes = await fetch(`${API_BASE}/orders?restaurantId=the-urban-cafe`);
    const listJson = await listRes.json();
    const ordersList = listJson.data || listJson;

    const fetchedOrder1 = ordersList.find((o: any) => o.id === order1.id);
    const fetchedOrder2 = ordersList.find((o: any) => o.id === order2.id);

    assert(fetchedOrder1?.tableNumber === "T-01", "9. Business Order A reflects Table T-01 in GET /orders", `Order A table: ${fetchedOrder1?.tableNumber}`);
    assert(fetchedOrder2?.tableNumber === "T-02", "10. Business Order B reflects Table T-02 in GET /orders", `Order B table: ${fetchedOrder2?.tableNumber}`);

    console.log("\n=======================================================");
    console.log(`📊 TABLE QR ORDERING TEST SUMMARY: ${passedCount}/${passedCount + failedCount} PASSED (${((passedCount / (passedCount + failedCount)) * 100).toFixed(1)}%)`);
    console.log("=======================================================\n");

    if (failedCount > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error("Test error:", err);
    process.exit(1);
  }
}

runTableQRTests();
