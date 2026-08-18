import app from "./app.js";
import { config } from "./config/index.js";
import { logger } from "./utils/logger.js";

const PORT = config.port;

const server = app.listen(PORT, () => {
  logger.info(`==================================================`);
  logger.info(`🍔 ${config.appName} RUNNING`);
  logger.info(`📡 Server Address: http://localhost:${PORT}`);
  logger.info(`🏥 Health Check:    http://localhost:${PORT}/health`);
  logger.info(`⚙️  Environment:     ${config.env}`);
  logger.info(`==================================================`);
});

// Graceful Shutdown
const gracefulShutdown = (signal: string) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    logger.info("HTTP server closed. Process terminated.");
    process.exit(0);
  });
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
