import path from "path";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config({ path: path.join(__dirname, "../apps/api/.env") });

const pass = "019711204diptiroy";
const proj = "pkcrfmafvaunmatnnueq";
const host = "aws-0-ap-southeast-1.pooler.supabase.com";

async function testUsernames() {
  const configs = [
    { label: "Direct (5432) user=postgres", url: `postgresql://postgres:${pass}@db.${proj}.supabase.co:5432/postgres` },
    { label: "Direct (5432) db.host user=postgres", url: `postgresql://postgres:${pass}@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres` },
    { label: "Pooler (6543) user=postgres.pkcrfmafvaunmatnnueq", url: `postgresql://postgres.${proj}:${pass}@${host}:6543/postgres?pgbouncer=true` },
    { label: "Pooler (6543) user=postgres", url: `postgresql://postgres:${pass}@${host}:6543/postgres?pgbouncer=true` },
    { label: "Direct db project domain", url: `postgresql://postgres:${pass}@db.${proj}.supabase.co:5432/postgres` },
  ];

  for (const cfg of configs) {
    console.log(`Testing: ${cfg.label}...`);
    const pool = new pg.Pool({ connectionString: cfg.url, ssl: { rejectUnauthorized: false } });
    try {
      const res = await pool.query("SELECT NOW();");
      console.log(`  ✅ SUCCESS! Time: ${res.rows[0].now}`);
    } catch (e: any) {
      console.log(`  ❌ Failed: ${e.message}`);
    } finally {
      await pool.end();
    }
  }
}

testUsernames();
