import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "./config/index.js";
import { getHealth } from "./controllers/healthController.js";
import routes from "./routes/index.js";
import { requestLogger } from "./middlewares/requestLogger.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";

const app: Express = express();

// Global Middlewares
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (
        config.corsOrigins.includes("*") ||
        config.corsOrigins.includes(origin)
      ) {
        return callback(null, true);
      }
      return callback(new Error(`CORS policy error: Origin ${origin} not allowed`));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(requestLogger);

// Direct Health Check Endpoint
app.get("/health", getHealth);

// Mount API v1 & Root Routes
app.use("/api/v1", routes);
app.use("/", routes);

// Error Handling Middlewares
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
