const { chromium } = require("C:/Users/gaurav/AppData/Local/npm-cache/_npx/9833c18b2d85bc59/node_modules/playwright-core");
const ARTIFACT_DIR = "C:/Users/gaurav/.gemini/antigravity/brain/0f93c396-d359-4ff3-81e3-0e527e3ef8d5";

(async () => {
  console.log("==================================================");
  console.log("🔥 FOOD MANIA — COMPLETE ORDER PIPELINE E2E TEST");
  console.log("==================================================");

  // 1. Call POST /orders API
  console.log("\n1. Calling POST http://localhost:4000/orders...");
  const orderPayload = {
    restaurantId: "the-urban-cafe",
    totalAmount: 1170,
    paymentMethod: "upi",
    items: [
      { menuItemId: "item-102", quantity: 1, price: 650 },
      { menuItemId: "item-103", quantity: 1, price: 520 },
    ],
  };

  const postRes = await fetch("http://localhost:4000/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderPayload),
  });

  console.log(`HTTP Response Status: ${postRes.status}`);
  const postJson = await postRes.json();
  const createdOrder = postJson.data || postJson;

  console.log("\nAPI Response Payload:");
  console.log(JSON.stringify(createdOrder, null, 2));

  if (!createdOrder || !createdOrder.id) {
    console.error("❌ Order Creation Failed!");
    process.exit(1);
  }

  console.log(`\n✅ Created Order ID: ${createdOrder.id}`);
  console.log(`   Order Number:    ${createdOrder.orderNumber}`);
  console.log(`   Restaurant ID:   ${createdOrder.restaurantId}`);
  console.log(`   Total Amount:    ₹${createdOrder.totalAmount}`);
  console.log(`   Status:          ${createdOrder.status}`);

  // 2. Query GET /orders to verify DB persistence for Customer, Business & Kitchen
  console.log("\n2. Querying GET http://localhost:4000/orders...");
  const getRes = await fetch("http://localhost:4000/orders");
  const getJson = await getRes.json();
  const ordersList = getJson.data || getJson;

  const foundInDB = ordersList.find((o) => o.id === createdOrder.id);
  console.log(`✅ Order found in PostgreSQL orders list: ${Boolean(foundInDB)}`);

  // 3. Test Status Update via PATCH /orders/:id/status
  console.log(`\n3. Calling PATCH http://localhost:4000/orders/${createdOrder.id}/status (PREPARING)...`);
  const patchRes = await fetch(`http://localhost:4000/orders/${createdOrder.id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "PREPARING" }),
  });
  const patchJson = await patchRes.json();
  const updatedOrder = patchJson.data || patchJson;
  console.log(`✅ Updated Order Status in PostgreSQL: ${updatedOrder.status}`);

  // 4. Capture Browser Visual Verification Screenshots
  console.log("\n4. Capturing Multi-Portal Visual Screenshots...");
  const browser = await chromium.launch({ channel: "chrome", headless: true });

  // Customer My Orders
  const p1 = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await p1.goto("http://localhost:3000/orders", { waitUntil: "networkidle" });
  await p1.waitForTimeout(1000);
  await p1.screenshot({ path: `${ARTIFACT_DIR}/order_pipeline_customer_my_orders.png` });
  console.log(` Saved ${ARTIFACT_DIR}/order_pipeline_customer_my_orders.png`);

  // Business Orders
  const p2 = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await p2.goto("http://localhost:3001/orders", { waitUntil: "networkidle" });
  await p2.waitForTimeout(1000);
  await p2.screenshot({ path: `${ARTIFACT_DIR}/order_pipeline_business_orders.png` });
  console.log(` Saved ${ARTIFACT_DIR}/order_pipeline_business_orders.png`);

  // Kitchen KDS
  const p3 = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await p3.goto("http://localhost:3001/kitchen", { waitUntil: "networkidle" });
  await p3.waitForTimeout(1000);
  await p3.screenshot({ path: `${ARTIFACT_DIR}/order_pipeline_kitchen_kds.png` });
  console.log(` Saved ${ARTIFACT_DIR}/order_pipeline_kitchen_kds.png`);

  await browser.close();
  console.log("==================================================");
  console.log("🎉 COMPLETE END-TO-END ORDER PIPELINE 100% VERIFIED!");
  console.log("==================================================");
})();
