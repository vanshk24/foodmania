import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger.js";
import { sendError } from "../utils/responseHandler.js";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error("Unhandled Error:", err.message || err);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return sendError(res, message, undefined, statusCode);
};

export const notFoundHandler = (req: Request, res: Response) => {
  return sendError(res, `Route not found: ${req.originalUrl}`, undefined, 404);
};
