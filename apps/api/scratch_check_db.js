const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkRecords() {
  console.log('=== USERS IN DATABASE ===');
  const users = await prisma.user.findMany();
  console.log(JSON.stringify(users, null, 2));

  console.log('\n=== RESTAURANTS IN DATABASE ===');
  const restaurants = await prisma.restaurant.findMany();
  console.log(JSON.stringify(restaurants, null, 2));

  console.log('\n=== MENU ITEMS IN DATABASE ===');
  const menuItems = await prisma.menuItem.findMany();
  console.log(JSON.stringify(menuItems, null, 2));

  console.log('\n=== ORDERS IN DATABASE ===');
  const orders = await prisma.order.findMany();
  console.log(JSON.stringify(orders, null, 2));

  await prisma.$disconnect();
}

checkRecords().catch(e => { console.error(e); prisma.$disconnect(); });
