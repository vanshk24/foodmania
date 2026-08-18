import path from "path";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config({ path: path.join(__dirname, "../apps/api/.env") });

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

async function testTlsOverride() {
  const dbUrl = process.env.DATABASE_URL || "";
  const directUrl = process.env.DIRECT_URL || "";

  console.log("Testing with NODE_TLS_REJECT_UNAUTHORIZED = 0...");

  const pool1 = new pg.Pool({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  try {
    const res = await pool1.query("SELECT NOW(), current_database();");
    console.log("✅ DATABASE_URL Pooler SUCCESS! Time:", res.rows[0].now, "DB:", res.rows[0].current_database);
  } catch (e: any) {
    console.log("❌ DATABASE_URL Pooler Error:", e.message);
  } finally {
    await pool1.end();
  }

  const pool2 = new pg.Pool({ connectionString: directUrl, ssl: { rejectUnauthorized: false } });
  try {
    const res = await pool2.query("SELECT NOW(), current_database();");
    console.log("✅ DIRECT_URL Direct SUCCESS! Time:", res.rows[0].now, "DB:", res.rows[0].current_database);
  } catch (e: any) {
    console.log("❌ DIRECT_URL Direct Error:", e.message);
  } finally {
    await pool2.end();
  }
}

testTlsOverride();
