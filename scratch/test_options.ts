import pg from "pg";

const host = "aws-0-ap-southeast-1.pooler.supabase.com";
const proj = "pkcrfmafvaunmatnnueq";
const rawPass = "019711204diptiroy";

async function testOptions() {
  const userVariants = [
    `postgres.${proj}`,
    `postgres`,
  ];

  const sslConfigs: Array<[string, pg.PoolConfig["ssl"]]> = [
    ["require", { rejectUnauthorized: false }],
    ["prefer", false],
    ["true", true],
  ];

  for (const u of userVariants) {
    for (const port of [6543, 5432]) {
      for (const [label, ssl] of sslConfigs) {
        const poolConfig: pg.PoolConfig = {
          host,
          port,
          user: u,
          password: rawPass,
          database: "postgres",
          ssl,
        };

        const pool = new pg.Pool(poolConfig);
        try {
          const res = await pool.query("SELECT NOW();");
          console.log(`🎉 SUCCESS! user=${u}, port=${port}, ssl=${label} -> Time: ${res.rows[0].now}`);
        } catch (e: any) {
          // suppress repetitive log unless needed
          if (!e.message.includes("password authentication failed")) {
            console.log(`Failed user=${u}, port=${port}, ssl=${label}: ${e.message}`);
          } else {
            console.log(`Auth failed user=${u}, port=${port}, ssl=${label}`);
          }
        } finally {
          await pool.end();
        }
      }
    }
  }
}

testOptions();
