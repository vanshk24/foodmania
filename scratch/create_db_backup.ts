import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, "../apps/api/.env") });

import { prisma } from "../apps/api/src/utils/prisma";

const backupDir = path.join(__dirname, "../backups");
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

const dbUrl = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/foodmania_dev?schema=public";
const parsed = new URL(dbUrl);
const user = parsed.username;
const password = parsed.password;
const host = parsed.hostname;
const port = parsed.port || "5432";
const dbName = parsed.pathname.replace("/", "");

const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const sqlBackupPath = path.join(backupDir, `foodmania_dev_backup_${timestamp}.sql`);
const latestSqlPath = path.join(backupDir, `foodmania_dev_backup_latest.sql`);

console.log("=======================================================");
console.log("📦 STEP 1: FOOD MANIA DATABASE BACKUP");
console.log("=======================================================");
console.log(`Source Database: ${dbName} @ ${host}:${port}`);
console.log(`Backup Directory: ${backupDir}`);

// 1. Run pg_dump
console.log("\n1. Running pg_dump.exe...");
const env = { ...process.env, PGPASSWORD: password };
const dumpCmd = `"C:\\Program Files\\PostgreSQL\\17\\bin\\pg_dump.exe" -h ${host} -p ${port} -U ${user} -d ${dbName} -F p -f "${sqlBackupPath}"`;

try {
  execSync(dumpCmd, { env, stdio: "inherit" });
  fs.copyFileSync(sqlBackupPath, latestSqlPath);
  const stats = fs.statSync(sqlBackupPath);
  console.log(`✅ SQL Backup successful! File size: ${(stats.size / 1024).toFixed(2)} KB`);
  console.log(`   Saved to: ${sqlBackupPath}`);
} catch (e: any) {
  console.error("❌ pg_dump failed:", e.message);
  process.exit(1);
}

// 2. Export JSON backup of all Prisma models for double-safety
console.log("\n2. Creating JSON Data Export of all tables...");

async function exportJson() {
  const jsonDir = path.join(backupDir, `json_export_${timestamp}`);
  fs.mkdirSync(jsonDir, { recursive: true });

  const summary: Record<string, number> = {};

  const models: Array<[string, () => Promise<any[]>]> = [
    ["User", () => prisma.user.findMany()],
    ["Restaurant", () => prisma.restaurant.findMany()],
    ["RestaurantOwner", () => prisma.restaurantOwner.findMany()],
    ["RestaurantTable", () => prisma.restaurantTable.findMany()],
    ["MenuCategory", () => prisma.menuCategory.findMany()],
    ["MenuItem", () => prisma.menuItem.findMany()],
    ["Order", () => prisma.order.findMany()],
    ["OrderItem", () => prisma.orderItem.findMany()],
    ["Booking", () => prisma.booking.findMany()],
    ["Review", () => prisma.review.findMany()],
    ["Coupon", () => prisma.coupon.findMany()],
    ["Notification", () => prisma.notification.findMany()],
    ["Subscription", () => prisma.subscription.findMany()],
    ["Payment", () => prisma.payment.findMany()],
  ];

  for (const [modelName, fetcher] of models) {
    const data = await fetcher();
    summary[modelName] = data.length;
    fs.writeFileSync(
      path.join(jsonDir, `${modelName}.json`),
      JSON.stringify(data, null, 2)
    );
  }

  const latestJsonDir = path.join(backupDir, `json_export_latest`);
  if (!fs.existsSync(latestJsonDir)) {
    fs.mkdirSync(latestJsonDir, { recursive: true });
  }

  for (const [modelName] of models) {
    fs.copyFileSync(
      path.join(jsonDir, `${modelName}.json`),
      path.join(latestJsonDir, `${modelName}.json`)
    );
  }

  fs.writeFileSync(
    path.join(jsonDir, `_summary.json`),
    JSON.stringify(summary, null, 2)
  );
  fs.writeFileSync(
    path.join(latestJsonDir, `_summary.json`),
    JSON.stringify(summary, null, 2)
  );

  console.log("\n✅ JSON Export successful!");
  console.log("=======================================================");
  console.log("📊 DATABASE TABLE ROW SUMMARY:");
  console.log("=======================================================");
  for (const [table, count] of Object.entries(summary)) {
    console.log(`   - ${table.padEnd(20)}: ${count} rows`);
  }
  console.log("=======================================================\n");

  await prisma.$disconnect();
}

exportJson().catch((err) => {
  console.error("JSON Export Error:", err);
  process.exit(1);
});
