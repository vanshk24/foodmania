import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../apps/api/.env") });
dotenv.config({ path: path.join(__dirname, "../.env") });

console.log("Environment Keys Check:");
Object.keys(process.env).filter(k => k.includes("SUPABASE") || k.includes("DATABASE") || k.includes("DIRECT")).forEach(k => {
  console.log(`- ${k}: ${process.env[k] ? "[SET]" : "[UNSET]"}`);
});
