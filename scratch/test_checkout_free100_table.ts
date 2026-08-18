import { createOrder } from "../apps/api/src/services/orderService.js";
import { prisma } from "../apps/api/src/utils/prisma.js";

async function runTest() {
  console.log("=== STARTING TARGETED CHECKOUT + FREE100 + TABLE 04 TEST ===");

  // 1. Fetch restaurant 'devil' or create fallback reference
  let restaurant = await prisma.restaurant.findFirst({
    where: { OR: [{ slug: "devil" }, { id: "devil" }] },
  });

  if (!restaurant) {
    restaurant = await prisma.restaurant.findFirst({
      where: { slug: "the-urban-cafe" },
    });
  }

  if (!restaurant) {
    console.error("No test restaurant found");
    process.exit(1);
  }

  console.log(`Target Restaurant: ${restaurant.name} (id: ${restaurant.id}, slug: ${restaurant.slug})`);

  // Ensure table exists for test restaurant
  let table = await prisma.restaurantTable.findFirst({
    where: { restaurantId: restaurant.id },
  });

  if (!table) {
    table = await prisma.restaurantTable.create({
      data: {
        restaurantId: restaurant.id,
        tableNumber: "T-04",
        capacity: 4,
        status: "AVAILABLE",
      },
    });
  }

  console.log(`Target Table: ${table.tableNumber} (id: ${table.id}, current status: ${table.status})`);

  // 2. Fetch a menu item
  let menuItem = await prisma.menuItem.findFirst({
    where: { restaurantId: restaurant.id },
  });

  if (!menuItem) {
    menuItem = await prisma.menuItem.findFirst();
  }

  if (!menuItem) {
    console.error("No menu item found for test");
    process.exit(1);
  }

  // 3. Place order with FREE100 discount & "Table 04" table param
  const orderResult = await createOrder({
    restaurantId: restaurant.slug || restaurant.id,
    tableId: "Table 04",
    customerName: "Test Customer",
    customerPhone: "+91 99999 88888",
    couponCode: "FREE100",
    paymentMethod: "FREE100_TEST",
    items: [
      { menuItemId: menuItem.id, quantity: 2 },
    ],
  });

  console.log("Order Result:", {
    orderNumber: orderResult.orderNumber,
    totalAmount: orderResult.totalAmount,
    paymentStatus: orderResult.paymentStatus,
    paymentMethod: orderResult.paymentMethod,
    tableId: orderResult.tableId,
  });

  // Verification checks
  const isZeroTotal = orderResult.totalAmount === 0;
  const isPaid = orderResult.paymentStatus === "PAID";
  const isTableLinked = orderResult.tableId === table.id;

  // Check table status in DB
  const updatedTable = await prisma.restaurantTable.findUnique({
    where: { id: table.id },
  });
  const isTableOccupied = updatedTable?.status === "OCCUPIED";

  console.log("\n=== VERIFICATION RESULTS ===");
  console.log(`1. FREE100 Zero Total (₹0): ${isZeroTotal ? "PASS" : "FAIL"}`);
  console.log(`2. Zero-Payment Status (PAID): ${isPaid ? "PASS" : "FAIL"}`);
  console.log(`3. Table 04 Context Resolution: ${isTableLinked ? "PASS" : "FAIL"}`);
  console.log(`4. Live Table Status Update (OCCUPIED): ${isTableOccupied ? "PASS" : "FAIL"}`);

  if (isZeroTotal && isPaid && isTableLinked && isTableOccupied) {
    console.log("\nSUCCESS: ALL TARGETED TESTS PASSED!");
  } else {
    console.error("\nFAILURE: ONE OR MORE CHECKS FAILED");
    process.exit(1);
  }
}

runTest()
  .catch((e) => {
    console.error("Test execution error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
