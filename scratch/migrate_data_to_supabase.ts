import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, "../apps/api/.env") });

import { prisma } from "../apps/api/src/utils/prisma";

const backupDir = path.join(__dirname, "../backups/json_export_latest");

const modelsInOrder = [
  "User",
  "Restaurant",
  "RestaurantOwner",
  "RestaurantTable",
  "MenuCategory",
  "MenuItem",
  "Order",
  "OrderItem",
  "Booking",
  "Review",
  "Coupon",
  "Notification",
  "Subscription",
  "Payment",
];

const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

function convertDates(obj: any): any {
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(convertDates);
  
  const newObj: any = {};
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === "string" && isoDateRegex.test(v)) {
      newObj[k] = new Date(v);
    } else if (v && typeof v === "object") {
      newObj[k] = convertDates(v);
    } else {
      newObj[k] = v;
    }
  }
  return newObj;
}

async function migrateData() {
  console.log("=======================================================");
  console.log("🚀 SUPABASE DATA MIGRATION — STEP 2");
  console.log("=======================================================");

  const expectedSummary: Record<string, number> = JSON.parse(
    fs.readFileSync(path.join(backupDir, "_summary.json"), "utf8")
  );

  for (const modelName of modelsInOrder) {
    const jsonPath = path.join(backupDir, `${modelName}.json`);
    if (!fs.existsSync(jsonPath)) continue;

    const rawData = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    const data = convertDates(rawData);

    const prismaModel = (prisma as any)[modelName.charAt(0).toLowerCase() + modelName.slice(1)];
    if (!prismaModel) continue;

    let inserted = 0;
    let skipped = 0;

    for (const item of data) {
      if (modelName === "Booking" && !item.bookingDate) {
        item.bookingDate = item.createdAt || new Date();
      }
      if (modelName === "Subscription" && !item.endDate) {
        item.endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      }

      try {
        await prismaModel.create({ data: item });
        inserted++;
      } catch (err: any) {
        if (err.code === "P2002") {
          skipped++;
        } else {
          try {
            await prismaModel.upsert({
              where: { id: item.id },
              create: item,
              update: item,
            });
            inserted++;
          } catch (e2: any) {
            console.error(`Failed ${modelName} id=${item.id}:`, e2.message);
          }
        }
      }
    }

    console.log(`   ✅ ${modelName.padEnd(18)}: ${inserted} inserted/upserted, ${skipped} skipped/existing`);
  }

  // --- Row Count & Integrity Check ---
  console.log("\n=======================================================");
  console.log("📊 POST-MIGRATION ROW COUNT VERIFICATION:");
  console.log("=======================================================");

  const supabaseCounts: Record<string, number> = {};
  let totalBackup = 0;
  let totalSupabase = 0;
  let allMatched = true;

  for (const modelName of modelsInOrder) {
    const prismaModel = (prisma as any)[modelName.charAt(0).toLowerCase() + modelName.slice(1)];
    const count = await prismaModel.count();
    const expected = expectedSummary[modelName] || 0;
    supabaseCounts[modelName] = count;
    totalBackup += expected;
    totalSupabase += count;

    if (count !== expected) allMatched = false;
    const match = count === expected ? "✅ MATCH" : "❌ MISMATCH";
    console.log(`   - ${modelName.padEnd(20)}: Backup=${expected} | Supabase=${count} | ${match}`);
  }

  console.log(`\nTOTAL RECORDS: Backup=${totalBackup} | Supabase=${totalSupabase} | ${allMatched ? "✅ ALL MATCH" : "❌ MISMATCH"}`);
  console.log("=======================================================");

  // --- Integrity Checks ---
  console.log("\n=======================================================");
  console.log("🔍 DATA INTEGRITY CHECKS:");
  console.log("=======================================================");

  const menuItems = await prisma.menuItem.findMany();
  const menuItemIds = new Set(menuItems.map(m => m.id));

  const restaurants = await prisma.restaurant.findMany();
  const restaurantIds = new Set(restaurants.map(r => r.id));

  const tables = await prisma.restaurantTable.findMany();

  // 1. Orphan OrderItems
  const orderItems = await prisma.orderItem.findMany();
  const orders = await prisma.order.findMany();
  const orderIds = new Set(orders.map(o => o.id));
  const orphanOrderItems = orderItems.filter(oi => !orderIds.has(oi.orderId));

  // 2. Orphan Bookings
  const bookings = await prisma.booking.findMany();
  const orphanBookings = bookings.filter(b => !restaurantIds.has(b.restaurantId));

  // 3. Orphan Tables
  const orphanTables = tables.filter(t => !restaurantIds.has(t.restaurantId));

  // 4. Orphan Payments
  const payments = await prisma.payment.findMany();
  const orphanPayments = payments.filter(p => !orderIds.has(p.orderId));

  // 5. Negative order totals
  const negativeOrders = orders.filter(o => o.totalAmount < 0);
  const negativePayments = payments.filter(p => p.amount < 0);

  // 6. Duplicate order numbers
  const orderNumCounts = new Map<string, number>();
  orders.forEach(o => orderNumCounts.set(o.orderNumber, (orderNumCounts.get(o.orderNumber) || 0) + 1));
  const dupOrderNums = Array.from(orderNumCounts.entries()).filter(([_, c]) => c > 1);

  // 7. Duplicate booking codes
  const bookingCodeCounts = new Map<string, number>();
  bookings.forEach(b => bookingCodeCounts.set(b.bookingCode, (bookingCodeCounts.get(b.bookingCode) || 0) + 1));
  const dupBookingCodes = Array.from(bookingCodeCounts.entries()).filter(([_, c]) => c > 1);

  console.log(`1. Orphan OrderItems     : ${orphanOrderItems.length === 0 ? "✅ 0 (PASS)" : `❌ ${orphanOrderItems.length} found`}`);
  console.log(`2. Orphan Bookings       : ${orphanBookings.length === 0 ? "✅ 0 (PASS)" : `❌ ${orphanBookings.length} found`}`);
  console.log(`3. Orphan Tables         : ${orphanTables.length === 0 ? "✅ 0 (PASS)" : `❌ ${orphanTables.length} found`}`);
  console.log(`4. Orphan Payments       : ${orphanPayments.length === 0 ? "✅ 0 (PASS)" : `❌ ${orphanPayments.length} found`}`);
  console.log(`5. Duplicate OrderNums   : ${dupOrderNums.length === 0 ? "✅ 0 (PASS)" : `❌ ${dupOrderNums.length} found`}`);
  console.log(`6. Duplicate BookingCodes: ${dupBookingCodes.length === 0 ? "✅ 0 (PASS)" : `❌ ${dupBookingCodes.length} found`}`);
  console.log(`7. Negative Order Amounts: ${negativeOrders.length === 0 ? "✅ 0 (PASS)" : `❌ ${negativeOrders.length} found`}`);
  console.log(`8. Negative Pay Amounts  : ${negativePayments.length === 0 ? "✅ 0 (PASS)" : `❌ ${negativePayments.length} found`}`);

  console.log("=======================================================\n");

  await prisma.$disconnect();
}

migrateData().catch(console.error);
