import path from "path";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config({ path: path.join(__dirname, "../apps/api/.env") });

async function testConnections() {
  console.log("=======================================================");
  console.log("⚡ SUPABASE CONNECTION TEST");
  console.log("=======================================================");

  const dbUrl = process.env.DATABASE_URL;
  const directUrl = process.env.DIRECT_URL;

  console.log("DATABASE_URL set:", !!dbUrl);
  console.log("DIRECT_URL set:", !!directUrl);

  // Test Direct URL (Port 5432)
  console.log("\n1. Testing DIRECT_URL (Port 5432)...");
  const directPool = new pg.Pool({
    connectionString: directUrl,
    ssl: { rejectUnauthorized: false },
  });

  try {
    const res = await directPool.query("SELECT NOW(), current_database(), version();");
    console.log("✅ DIRECT_URL Connection Success!");
    console.log(`   Database: ${res.rows[0].current_database}`);
    console.log(`   Server Time: ${res.rows[0].now}`);
  } catch (err: any) {
    console.error("❌ DIRECT_URL Connection Failed:", err.message);
  } finally {
    await directPool.end();
  }

  // Test Pooled URL (Port 6543)
  console.log("\n2. Testing DATABASE_URL (Port 6543)...");
  const pooledPool = new pg.Pool({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
  });

  try {
    const res = await pooledPool.query("SELECT NOW(), current_database();");
    console.log("✅ DATABASE_URL (Pooler) Connection Success!");
    console.log(`   Database: ${res.rows[0].current_database}`);
    console.log(`   Server Time: ${res.rows[0].now}`);
  } catch (err: any) {
    console.error("❌ DATABASE_URL Connection Failed:", err.message);
  } finally {
    await pooledPool.end();
  }
}

testConnections().catch(console.error);
