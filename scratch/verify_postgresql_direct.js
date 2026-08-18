const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

(async () => {
  console.log("==================================================");
  console.log("🗄️ EXECUTING DIRECT SQL QUERY ON POSTGRESQL (foodmania_dev)");
  console.log("==================================================");

  console.log('Query: SELECT * FROM "Order" ORDER BY "createdAt" DESC;');
  const rawOrders = await prisma.$queryRaw`SELECT id, "orderNumber", "restaurantId", "totalAmount", status, "paymentStatus", "createdAt" FROM "Order" ORDER BY "createdAt" DESC LIMIT 5;`;

  console.log("\nQueryResult (Top 5 Recent Orders in PostgreSQL):");
  console.log("--------------------------------------------------");
  console.log(JSON.stringify(rawOrders, null, 2));

  console.log('\nQuery: SELECT * FROM "OrderItem" ORDER BY "createdAt" DESC LIMIT 5;');
  const rawItems = await prisma.$queryRaw`SELECT id, "orderId", "menuItemId", quantity, price FROM "OrderItem" ORDER BY "createdAt" DESC LIMIT 5;`;

  console.log("\nQueryResult (Top 5 OrderItems in PostgreSQL):");
  console.log("--------------------------------------------------");
  console.log(JSON.stringify(rawItems, null, 2));

  await prisma.$disconnect();
  console.log("==================================================");
})();
