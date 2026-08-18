import path from "path";
import dotenv from "dotenv";
import fs from "fs";

// Reload env
dotenv.config({ path: path.join(__dirname, "../apps/api/.env"), override: true });

const dbUrl = process.env.DATABASE_URL;
const directUrl = process.env.DIRECT_URL;

console.log("Checking Environment Variables Existence:");
console.log("- DATABASE_URL exists:", !!dbUrl);
console.log("- DIRECT_URL exists  :", !!directUrl);
