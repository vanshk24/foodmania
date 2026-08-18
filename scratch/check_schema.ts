import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, "../apps/api/.env") });
import { prisma } from "../apps/api/src/utils/prisma";

async function main() {
  // Check which schemas/tables exist in Supabase
  const rows = await prisma.$queryRaw<any[]>`
    SELECT table_schema, table_name,
      (SELECT COUNT(*) FROM information_schema.columns c
       WHERE c.table_name = t.table_name AND c.table_schema = t.table_schema) as col_count
    FROM information_schema.tables t
    WHERE table_type = 'BASE TABLE'
      AND table_schema NOT IN ('pg_catalog','information_schema')
    ORDER BY table_schema, table_name
  `;
  console.log("Tables in Supabase:");
  console.table(rows.map((r: any) => ({ schema: r.table_schema, table: r.table_name, cols: Number(r.col_count) })));

  // Direct count from public schema
  const userCount = await prisma.$queryRaw<any[]>`SELECT COUNT(*) as cnt FROM "public"."User"`;
  console.log("Direct public.User count:", userCount);

  await prisma.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
