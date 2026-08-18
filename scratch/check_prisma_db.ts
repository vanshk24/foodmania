import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, "../apps/api/.env") });
import { prisma } from "../apps/api/src/utils/prisma";

async function checkPrismaDb() {
  try {
    const res: any = await prisma.$queryRaw`SELECT current_database(), current_user, version()`;
    console.log("Prisma query result:", res);
  } catch (e: any) {
    console.log("Prisma query error:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkPrismaDb();
