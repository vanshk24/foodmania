const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("=== FOOD MANIA POSTGRESQL DATABASE VERIFICATION ===");
  console.log("Connecting to foodmania_dev database...\n");

  const tables = await prisma.$queryRaw`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    ORDER BY table_name;
  `;

  console.log("Created Database Tables in 'foodmania_dev':");
  console.log("-------------------------------------------");
  tables.forEach((t, i) => {
    console.log(`${(i + 1).toString().padStart(2, " ")}. ${t.table_name}`);
  });

  console.log(`\nTotal Tables: ${tables.length}`);
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
