import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import pg from "pg";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const envPath = path.join(__dirname, "../apps/api/.env");
const envExists = fs.existsSync(envPath);

dotenv.config({ path: envPath, override: true });

async function verifyConnectionsOnly() {
  const dbUrl = process.env.DATABASE_URL || "";
  const directUrl = process.env.DIRECT_URL || "";

  let envStatus = envExists && !!dbUrl && !!directUrl ? "PASS" : "FAIL";
  let dbUrlStatus = "FAIL";
  let directUrlStatus = "FAIL";
  let prismaStatus = "FAIL";

  // 1. Test DATABASE_URL (Port 6543)
  if (dbUrl) {
    const pool1 = new pg.Pool({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
    try {
      await pool1.query("SELECT 1;");
      dbUrlStatus = "PASS";
    } catch (err) {
      dbUrlStatus = "FAIL";
    } finally {
      await pool1.end();
    }
  }

  // 2. Test DIRECT_URL (Port 5432)
  if (directUrl) {
    const pool2 = new pg.Pool({ connectionString: directUrl, ssl: { rejectUnauthorized: false } });
    try {
      await pool2.query("SELECT 1;");
      directUrlStatus = "PASS";
    } catch (err) {
      directUrlStatus = "FAIL";
    } finally {
      await pool2.end();
    }
  }

  // 3. Test Prisma Client connected directly to env DATABASE_URL
  if (dbUrl) {
    try {
      const poolPrisma = new pg.Pool({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
      const adapter = new PrismaPg(poolPrisma);
      const testPrisma = new PrismaClient({ adapter });

      const result: any = await testPrisma.$queryRaw`SELECT 1 as connected`;
      if (result && Array.isArray(result) && result.length > 0) {
        prismaStatus = "PASS";
      }
      await testPrisma.$disconnect();
      await poolPrisma.end();
    } catch (err) {
      prismaStatus = "FAIL";
    }
  }

  console.log(`ENV FILE: ${envStatus}`);
  console.log(`DATABASE_URL: ${dbUrlStatus}`);
  console.log(`DIRECT_URL: ${directUrlStatus}`);
  console.log(`Prisma: ${prismaStatus}`);

  if (envStatus === "PASS" && dbUrlStatus === "PASS" && directUrlStatus === "PASS" && prismaStatus === "PASS") {
    console.log("\nSUPABASE CONNECTION VERIFIED — READY FOR MIGRATION");
  }
}

verifyConnectionsOnly().catch(console.error);
