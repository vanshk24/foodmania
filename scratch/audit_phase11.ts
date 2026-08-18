import { prisma } from "../apps/api/src/utils/prisma.js";

async function runAudit() {
  console.log("=================================================");
  console.log("🔍 PHASE 11: AUTOMATED AUDIT & SECURITY CHECK");
  console.log("=================================================\n");

  // --- STEP 2: DATABASE INTEGRITY AUDIT ---
  console.log("--- STEP 2: DATABASE INTEGRITY AUDIT ---");
  const userCount = await prisma.user.count();
  const restCount = await prisma.restaurant.count();
  const orderCount = await prisma.order.count();
  const orderItemCount = await prisma.orderItem.count();
  const bookingCount = await prisma.booking.count();
  const paymentCount = await prisma.payment.count();
  const reviewCount = await prisma.review.count();
  const notifCount = await prisma.notification.count();

  console.log(`[DB Counts] Users: ${userCount}, Restaurants: ${restCount}, Orders: ${orderCount}, OrderItems: ${orderItemCount}, Bookings: ${bookingCount}, Payments: ${paymentCount}, Reviews: ${reviewCount}, Notifications: ${notifCount}`);

  // Check for orphan OrderItems (where orderId does not exist in Order table)
  const allOrders = await prisma.order.findMany({ select: { id: true } });
  const validOrderIds = new Set(allOrders.map(o => o.id));
  const allOrderItems = await prisma.orderItem.findMany({ select: { id: true, orderId: true } });
  const orphanItems = allOrderItems.filter(item => !validOrderIds.has(item.orderId));

  console.log(`[DB Integrity] Orphan OrderItems: ${orphanItems.length} (Expected 0)`);

  // Check for negative prices or quantities
  const invalidMenuItems = await prisma.menuItem.findMany({
    where: { price: { lt: 0 } },
  });
  console.log(`[DB Integrity] Negative Price MenuItems: ${invalidMenuItems.length} (Expected 0)`);

  const invalidOrderItems = await prisma.orderItem.findMany({
    where: { OR: [{ quantity: { lte: 0 } }, { price: { lt: 0 } }] },
  });
  console.log(`[DB Integrity] Invalid OrderItems (qty <= 0 or price < 0): ${invalidOrderItems.length} (Expected 0)`);

  const invalidOrders = await prisma.order.findMany({
    where: { totalAmount: { lt: 0 } },
  });
  console.log(`[DB Integrity] Invalid Orders (negative totals): ${invalidOrders.length} (Expected 0)`);

  // Check duplicate OrderNumbers
  const orderNumbers = await prisma.order.groupBy({
    by: ['orderNumber'],
    _count: { orderNumber: true },
    having: { orderNumber: { _count: { gt: 1 } } },
  });
  console.log(`[DB Integrity] Duplicate Order Numbers: ${orderNumbers.length} (Expected 0)`);

  // Check duplicate BookingCodes
  const bookingCodes = await prisma.booking.groupBy({
    by: ['bookingCode'],
    _count: { bookingCode: true },
    having: { bookingCode: { _count: { gt: 1 } } },
  });
  console.log(`[DB Integrity] Duplicate Booking Codes: ${bookingCodes.length} (Expected 0)`);

  console.log("\n=================================================");
  console.log("✅ DATABASE INTEGRITY CHECK COMPLETE");
  console.log("=================================================");
  await prisma.$disconnect();
}

runAudit().catch(err => {
  console.error("Audit error:", err);
  prisma.$disconnect();
  process.exit(1);
});
