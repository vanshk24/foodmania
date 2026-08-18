import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, "../apps/api/.env") });

const dbUrl = process.env.DATABASE_URL || "";

let parsed: URL | null = null;
try {
  parsed = new URL(dbUrl);
} catch (e) {
  console.log("Could not parse DATABASE_URL");
}

console.log("DATABASE_URL check:");
console.log("- Provided:", !!dbUrl);
if (parsed) {
  console.log("- Protocol:", parsed.protocol);
  console.log("- Host:", parsed.hostname);
  console.log("- Port:", parsed.port || "5432");
  console.log("- User:", parsed.username);
  console.log("- Database:", parsed.pathname.replace("/", ""));
  console.log("- Password:", parsed.password ? "[REDACTED]" : "(none)");
}
