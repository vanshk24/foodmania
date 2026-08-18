const { PrismaClient } = require("@prisma/client");

const passwords = [
  "postgres",
  "admin",
  "root",
  "password",
  "123456",
  "postgres123",
  "master",
  "foodmania",
  "gaurav",
  "user",
  "12345",
  "1234",
  "12345678",
  "foodmania_dev",
  "admin123",
  "root123",
  "Pass@123",
  "Password123"
];

async function checkPasswords() {
  for (const pwd of passwords) {
    const url = `postgresql://postgres:${encodeURIComponent(pwd)}@localhost:5432/postgres?schema=public`;
    const prisma = new PrismaClient({ datasources: { db: { url } } });
    try {
      await prisma.$connect();
      console.log(`FOUND WORKING POSTGRES PASSWORD: "${pwd}"`);
      await prisma.$disconnect();
      return pwd;
    } catch (e) {
      // try next
    }
  }
  console.log("None of the standard passwords matched.");
  return null;
}

checkPasswords();
