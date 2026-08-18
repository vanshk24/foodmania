const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("Connecting to PostgreSQL database...");
  await prisma.$connect();
  console.log("PostgreSQL connection SUCCESSFUL!");
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("PostgreSQL Connection Failed:", err.message);
  process.exit(1);
});
