const { PrismaClient } = require("@prisma/client");

async function test(url) {
  const p = new PrismaClient({ datasources: { db: { url } } });
  try {
    await p.$connect();
    console.log("SUCCESS CONNECTED TO:", url);
    await p.$disconnect();
  } catch (e) {
    console.log("Failed:", url, e.message);
  }
}

(async () => {
  await test("postgresql://postgres:postgres@localhost:5432/foodmania_dev?schema=public");
  await test("postgresql://postgres:postgres@localhost:5433/foodmania_dev?schema=public");
  await test("postgresql://postgres:admin@localhost:5433/foodmania_dev?schema=public");
  await test("postgresql://postgres:root@localhost:5433/foodmania_dev?schema=public");
  await test("postgresql://postgres:postgres@127.0.0.1:5432/foodmania_dev?schema=public");
  await test("postgresql://postgres:postgres@127.0.0.1:5433/foodmania_dev?schema=public");
})();
