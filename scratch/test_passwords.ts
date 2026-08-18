import pg from "pg";

const host = "aws-0-ap-southeast-1.pooler.supabase.com";
const proj = "pkcrfmafvaunmatnnueq";

async function testPasswords() {
  const passwordsToTest = [
    "019711204diptiroy",
    "[019711204diptiroy]",
  ];

  for (const pass of passwordsToTest) {
    const encodedPass = encodeURIComponent(pass);
    console.log(`Testing password variant (length: ${pass.length}, startsWithBrackets: ${pass.startsWith("[")})...`);
    
    // Pooler 6543
    const poolerUrl = `postgresql://postgres.${proj}:${encodedPass}@${host}:6543/postgres?pgbouncer=true`;
    const pool1 = new pg.Pool({ connectionString: poolerUrl, ssl: { rejectUnauthorized: false } });
    try {
      const res = await pool1.query("SELECT NOW(), current_database();");
      console.log(`  ✅ SUCCESS on 6543! Time: ${res.rows[0].now}`);
    } catch (e: any) {
      console.log(`  ❌ 6543 Failed: ${e.message}`);
    } finally {
      await pool1.end();
    }

    // Direct 5432
    const directUrl = `postgresql://postgres.${proj}:${encodedPass}@${host}:5432/postgres`;
    const pool2 = new pg.Pool({ connectionString: directUrl, ssl: { rejectUnauthorized: false } });
    try {
      const res = await pool2.query("SELECT NOW(), current_database();");
      console.log(`  ✅ SUCCESS on 5432! Time: ${res.rows[0].now}`);
    } catch (e: any) {
      console.log(`  ❌ 5432 Failed: ${e.message}`);
    } finally {
      await pool2.end();
    }
  }
}

testPasswords();
