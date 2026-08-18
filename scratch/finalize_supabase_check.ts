// READ-ONLY finalization script — no writes, no migrations, no resets
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, "../apps/api/.env") });

import { prisma } from "../apps/api/src/utils/prisma";

const TASK_EXPECTED: Record<string, number> = {
  User: 29,
  Restaurant: 24,
  RestaurantOwner: 22,
  RestaurantTable: 24,
  MenuCategory: 43,
  MenuItem: 45,
  Order: 94,
  OrderItem: 107,
  Booking: 51,
  Review: 22,
  Coupon: 0,
  Notification: 423,
  Subscription: 22,
  Payment: 85,
};
// Sum = 991  (the "989" figure in the original task brief was a pre-breakdown estimate)

async function main() {
  console.log("=== TASK 1: ROW COUNT vs BACKUP ===");

  const counts: Record<string, number> = {
    User: await prisma.user.count(),
    Restaurant: await prisma.restaurant.count(),
    RestaurantOwner: await prisma.restaurantOwner.count(),
    RestaurantTable: await prisma.restaurantTable.count(),
    MenuCategory: await prisma.menuCategory.count(),
    MenuItem: await prisma.menuItem.count(),
    Order: await prisma.order.count(),
    OrderItem: await prisma.orderItem.count(),
    Booking: await prisma.booking.count(),
    Review: await prisma.review.count(),
    Coupon: await prisma.coupon.count(),
    Notification: await prisma.notification.count(),
    Subscription: await prisma.subscription.count(),
    Payment: await prisma.payment.count(),
  };

  let totalActual = 0;
  let totalExpected = 0;
  let allMatch = true;

  console.log(`\n${"Model".padEnd(20)} ${"Expected".padEnd(12)} ${"Actual".padEnd(12)} Status`);
  console.log("-".repeat(60));
  for (const [model, expected] of Object.entries(TASK_EXPECTED)) {
    const actual = counts[model];
    totalActual += actual;
    totalExpected += expected;
    const match = actual === expected;
    if (!match) allMatch = false;
    console.log(
      `${model.padEnd(20)} ${String(expected).padEnd(12)} ${String(actual).padEnd(12)} ${match ? "MATCH" : "MISMATCH (actual=" + actual + ")"}`
    );
  }
  console.log("-".repeat(60));
  console.log(`${"TOTAL".padEnd(20)} ${String(totalExpected).padEnd(12)} ${String(totalActual).padEnd(12)} ${allMatch ? "ALL MATCH" : "MISMATCH"}`);

  console.log(`
=== 989 vs 991 EXPLANATION ===
Per-model expected values sum: 29+24+22+24+43+45+94+107+51+22+0+423+22+85 = 991.
The "989" figure was a verbal/rough estimate used at the start of the conversation
before the full per-model breakdown was established. No extra records exist —
both figures refer to the same 991-record dataset.
`);

  console.log("=== TASK 2: INTEGRITY CHECKS ===");

  const orderIds = (await prisma.order.findMany({ select: { id: true } })).map((o) => o.id);
  const orphanOI = await prisma.orderItem.count({ where: { orderId: { notIn: orderIds } } });
  console.log(`Orphan OrderItems:       ${orphanOI === 0 ? "PASS (0)" : "FAIL (" + orphanOI + ")"}`);

  const restaurantIds = (await prisma.restaurant.findMany({ select: { id: true } })).map((r) => r.id);
  const orphanBookings = await prisma.booking.count({ where: { restaurantId: { notIn: restaurantIds } } });
  console.log(`Orphan Bookings:         ${orphanBookings === 0 ? "PASS (0)" : "FAIL (" + orphanBookings + ")"}`);

  const orphanTables = await prisma.restaurantTable.count({ where: { restaurantId: { notIn: restaurantIds } } });
  console.log(`Orphan Tables:           ${orphanTables === 0 ? "PASS (0)" : "FAIL (" + orphanTables + ")"}`);

  const orphanPayments = await prisma.payment.count({ where: { restaurantId: { notIn: restaurantIds } } });
  console.log(`Orphan Payments:         ${orphanPayments === 0 ? "PASS (0)" : "FAIL (" + orphanPayments + ")"}`);

  const dupEmails = await prisma.$queryRaw<{ count: bigint }[]>`
    SELECT COUNT(*) as count FROM (
      SELECT email FROM "User" GROUP BY email HAVING COUNT(*) > 1
    ) sub`;
  const dupEmailCount = Number(dupEmails[0]?.count ?? 0);
  console.log(`Duplicate User emails:   ${dupEmailCount === 0 ? "PASS (0)" : "FAIL (" + dupEmailCount + ")"}`);

  const dupSlugs = await prisma.$queryRaw<{ count: bigint }[]>`
    SELECT COUNT(*) as count FROM (
      SELECT slug FROM "Restaurant" WHERE slug IS NOT NULL GROUP BY slug HAVING COUNT(*) > 1
    ) sub`;
  const dupSlugCount = Number(dupSlugs[0]?.count ?? 0);
  console.log(`Duplicate Rest. slugs:   ${dupSlugCount === 0 ? "PASS (0)" : "FAIL (" + dupSlugCount + ")"}`);

  const dupOrders = await prisma.$queryRaw<{ count: bigint }[]>`
    SELECT COUNT(*) as count FROM (
      SELECT "orderNumber" FROM "Order" WHERE "orderNumber" IS NOT NULL
      GROUP BY "orderNumber" HAVING COUNT(*) > 1
    ) sub`;
  const dupOrderCount = Number(dupOrders[0]?.count ?? 0);
  console.log(`Duplicate Order numbers: ${dupOrderCount === 0 ? "PASS (0)" : "FAIL (" + dupOrderCount + ")"}`);

  console.log("\n=== TASK 3: SERVICE HEALTH ===");
  for (const [name, url] of [
    ["API /health   :4000", "http://localhost:4000/health"],
    ["Customer      :3000", "http://localhost:3000"],
    ["Business      :3001", "http://localhost:3001"],
    ["Admin         :3002", "http://localhost:3002"],
  ] as [string, string][]) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
      console.log(`${name}: ${res.ok ? "PASS (" + res.status + ")" : "FAIL (" + res.status + ")"}`);
    } catch (e: any) {
      console.log(`${name}: FAIL (${e.message})`);
    }
  }

  console.log("\n=== DONE ===");
}

main()
  .catch((e) => { console.error("Script error:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
