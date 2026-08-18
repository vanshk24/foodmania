import dotenv from "dotenv";

dotenv.config();

const defaultDevOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
];

const envCors = process.env.CORS_ORIGIN;
const parsedOrigins = envCors
  ? envCors.split(",").map((o) => o.trim()).filter(Boolean)
  : defaultDevOrigins;

export const config = {
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "4000", 10),
  apiVersion: "1.0.0",
  appName: "Food Mania Backend API",
  corsOrigins: process.env.NODE_ENV === "production" ? (envCors ? parsedOrigins : []) : parsedOrigins,
};
