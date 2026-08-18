import path from "path";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config({ path: path.join(__dirname, "../apps/api/.env") });

async function diagnose() {
  const dbUrl = process.env.DATABASE_URL || "";
  const directUrl = process.env.DIRECT_URL || "";

  console.log("DB URL length:", dbUrl.length);
  console.log("Direct URL length:", directUrl.length);

  try {
    const pool1 = new pg.Pool({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
    await pool1.query("SELECT 1;");
    console.log("DATABASE_URL success!");
    await pool1.end();
  } catch (e: any) {
    console.log("DATABASE_URL error code:", e.code, "message:", e.message);
  }

  try {
    const pool2 = new pg.Pool({ connectionString: directUrl, ssl: { rejectUnauthorized: false } });
    await pool2.query("SELECT 1;");
    console.log("DIRECT_URL success!");
    await pool2.end();
  } catch (e: any) {
    console.log("DIRECT_URL error code:", e.code, "message:", e.message);
  }
}

diagnose();
