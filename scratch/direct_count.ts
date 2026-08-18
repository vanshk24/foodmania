// Direct pg count — bypasses Prisma adapter, uses DIRECT_URL on port 5432
import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, "../apps/api/.env") });

import pg from "pg";

async function main() {
  const connStr = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!connStr) { console.error("No connection string found"); process.exit(1); }
  console.log("Using DIRECT_URL:", connStr.replace(/:[^@]*@/, ":[REDACTED]@"));

  const client = new pg.Client({ connectionString: connStr, ssl: { rejectUnauthorized: false } });
  await client.connect();

  const tables = [
    "User","Restaurant","RestaurantOwner","RestaurantTable",
    "MenuCategory","MenuItem","Order","OrderItem","Booking",
    "Review","Coupon","Notification","Subscription","Payment"
  ];

  const expected: Record<string,number> = {
    User:29,Restaurant:24,RestaurantOwner:22,RestaurantTable:24,
    MenuCategory:43,MenuItem:45,Order:94,OrderItem:107,Booking:51,
    Review:22,Coupon:0,Notification:423,Subscription:22,Payment:85
  };

  let total = 0;
  let allMatch = true;
  console.log(`\n${"Model".padEnd(20)} ${"Expected".padEnd(12)} ${"Actual".padEnd(12)} Status`);
  console.log("-".repeat(60));

  for (const t of tables) {
    const res = await client.query(`SELECT COUNT(*) as cnt FROM "public"."${t}"`);
    const actual = Number(res.rows[0].cnt);
    total += actual;
    const exp = expected[t];
    const match = actual === exp;
    if (!match) allMatch = false;
    console.log(`${t.padEnd(20)} ${String(exp).padEnd(12)} ${String(actual).padEnd(12)} ${match ? "MATCH" : "MISMATCH"}`);
  }
  console.log("-".repeat(60));
  console.log(`${"TOTAL".padEnd(20)} ${"991".padEnd(12)} ${String(total).padEnd(12)} ${allMatch ? "ALL MATCH" : "MISMATCH"}`);

  // Integrity checks
  console.log("\n=== INTEGRITY ===");
  const dupEmails = await client.query(`SELECT COUNT(*) as cnt FROM (SELECT email FROM "User" GROUP BY email HAVING COUNT(*)>1) sub`);
  console.log(`Duplicate emails: ${Number(dupEmails.rows[0].cnt) === 0 ? "PASS (0)" : "FAIL"}`);

  const dupSlugs = await client.query(`SELECT COUNT(*) as cnt FROM (SELECT slug FROM "Restaurant" WHERE slug IS NOT NULL GROUP BY slug HAVING COUNT(*)>1) sub`);
  console.log(`Duplicate slugs: ${Number(dupSlugs.rows[0].cnt) === 0 ? "PASS (0)" : "FAIL"}`);

  const orphanOI = await client.query(`SELECT COUNT(*) as cnt FROM "OrderItem" oi WHERE NOT EXISTS (SELECT 1 FROM "Order" o WHERE o.id = oi."orderId")`);
  console.log(`Orphan OrderItems: ${Number(orphanOI.rows[0].cnt) === 0 ? "PASS (0)" : "FAIL (" + orphanOI.rows[0].cnt + ")"}`);

  const orphanBook = await client.query(`SELECT COUNT(*) as cnt FROM "Booking" b WHERE NOT EXISTS (SELECT 1 FROM "Restaurant" r WHERE r.id = b."restaurantId")`);
  console.log(`Orphan Bookings: ${Number(orphanBook.rows[0].cnt) === 0 ? "PASS (0)" : "FAIL (" + orphanBook.rows[0].cnt + ")"}`);

  await client.end();
  console.log("\n=== DONE ===");
}
main().catch(e => { console.error("Error:", e.message); process.exit(1); });
