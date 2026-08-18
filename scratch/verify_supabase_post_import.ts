import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, "../apps/api/.env") });

import { prisma } from "../apps/api/src/utils/prisma";

const backupDir = path.join(__dirname, "../backups/json_export_latest");

const expectedCounts: Record<string, number> = {
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

async function verifyPostImport() {
  console.log("=======================================================");
  console.log("🔍 SUPABASE POST-IMPORT VERIFICATION (READ-ONLY)");
  console.log("=======================================================\n");

  let allCountsMatch = true;
  let totalActual = 0;
  let totalExpected = 0;

  const countResults: Array<{ model: string; expected: number; actual: number; status: string }> = [];

  for (const [modelName, expected] of Object.entries(expectedCounts)) {
    totalExpected += expected;
    const prismaModel = (prisma as any)[modelName.charAt(0).toLowerCase() + modelName.slice(1)];
    const actual = await prismaModel.count();
    totalActual += actual;

    const match = actual === expected;
    if (!match) allCountsMatch = false;

    countResults.push({
      model: modelName,
      expected,
      actual,
      status: match ? "✅ MATCH" : "❌ MISMATCH",
    });
  }

  console.log("STEP 1: ROW COUNT VERIFICATION RESULTS:");
  console.table(countResults);
  console.log(`TOTAL RECORDS EXPECTED: ${totalExpected} | ACTUAL: ${totalActual} | ${allCountsMatch ? "✅ ALL MATCH" : "❌ MISMATCH"}\n`);

  // STEP 2: DATA INTEGRITY & BACKUP COMPARISON
  console.log("STEP 2: DATA INTEGRITY & RELATIONSHIP CHECKS:");

  const users = await prisma.user.findMany();
  const restaurants = await prisma.restaurant.findMany();
  const tables = await prisma.restaurantTable.findMany();
  const menuItems = await prisma.menuItem.findMany();
  const orders = await prisma.order.findMany();
  const orderItems = await prisma.orderItem.findMany();
  const bookings = await prisma.booking.findMany();
  const payments = await prisma.payment.findMany();

  const userIds = new Set(users.map(u => u.id));
  const restaurantIds = new Set(restaurants.map(r => r.id));
  const orderIds = new Set(orders.map(o => o.id));

  // Orphans
  const orphanOrderItems = orderItems.filter(oi => !orderIds.has(oi.orderId));
  const orphanBookings = bookings.filter(b => !restaurantIds.has(b.restaurantId));
  const orphanTables = tables.filter(t => !restaurantIds.has(t.restaurantId));
  const orphanPayments = payments.filter(p => !orderIds.has(p.orderId));

  // Duplicates
  const emails = users.map(u => u.email);
  const dupEmails = emails.filter((e, i) => emails.indexOf(e) !== i);

  const slugs = restaurants.map(r => r.slug);
  const dupSlugs = slugs.filter((s, i) => slugs.indexOf(s) !== i);

  const orderNums = orders.map(o => o.orderNumber);
  const dupOrderNums = orderNums.filter((o, i) => orderNums.indexOf(o) !== i);

  const bookingCodes = bookings.map(b => b.bookingCode);
  const dupBookingCodes = bookingCodes.filter((b, i) => bookingCodes.indexOf(b) !== i);

  // Backup ID verification
  const backupUsers = JSON.parse(fs.readFileSync(path.join(backupDir, "User.json"), "utf8"));
  const backupUserIds = new Set(backupUsers.map((u: any) => u.id));
  const userIdsPreserved = users.every(u => backupUserIds.has(u.id));

  const backupRestaurants = JSON.parse(fs.readFileSync(path.join(backupDir, "Restaurant.json"), "utf8"));
  const backupRestIds = new Set(backupRestaurants.map((r: any) => r.id));
  const restIdsPreserved = restaurants.every(r => backupRestIds.has(r.id));

  let integrityPass = true;
  if (orphanOrderItems.length > 0) integrityPass = false;
  if (orphanBookings.length > 0) integrityPass = false;
  if (orphanTables.length > 0) integrityPass = false;
  if (orphanPayments.length > 0) integrityPass = false;
  if (dupEmails.length > 0 || dupSlugs.length > 0 || dupOrderNums.length > 0 || dupBookingCodes.length > 0) integrityPass = false;
  if (!userIdsPreserved || !restIdsPreserved) integrityPass = false;

  console.log(`- Orphan OrderItems: ${orphanOrderItems.length} (Expected: 0)`);
  console.log(`- Orphan Bookings  : ${orphanBookings.length} (Expected: 0)`);
  console.log(`- Orphan Tables    : ${orphanTables.length} (Expected: 0)`);
  console.log(`- Orphan Payments  : ${orphanPayments.length} (Expected: 0)`);
  console.log(`- Duplicate Emails : ${dupEmails.length} (Expected: 0)`);
  console.log(`- Duplicate Slugs  : ${dupSlugs.length} (Expected: 0)`);
  console.log(`- Duplicate Orders : ${dupOrderNums.length} (Expected: 0)`);
  console.log(`- User IDs Match   : ${userIdsPreserved ? "YES" : "NO"}`);
  console.log(`- Rest IDs Match   : ${restIdsPreserved ? "YES" : "NO"}\n`);

  // STEP 3: MIGRATION GATE
  console.log("=======================================================");
  if (allCountsMatch && totalActual === totalExpected && integrityPass) {
    console.log("🟢 SUPABASE DATA MIGRATION VERIFIED");
  } else {
    console.log("🔴 SUPABASE MIGRATION VERIFICATION FAILED");
  }
  console.log("=======================================================\n");

  await prisma.$disconnect();
}

verifyPostImport().catch(console.error);
