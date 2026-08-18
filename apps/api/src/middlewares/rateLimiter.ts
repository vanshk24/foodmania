import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/responseHandler.js";

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const authIpMap = new Map<string, RateLimitRecord>();

/**
 * Express rate limiter middleware for sensitive authentication routes.
 * Allows up to maxRequests within windowMs per IP.
 */
export const authRateLimiter = (
  maxRequests: number = 60,
  windowMs: number = 15 * 60 * 1000
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || "unknown-ip";
    const now = Date.now();

    const record = authIpMap.get(ip);

    if (!record || now > record.resetTime) {
      authIpMap.set(ip, {
        count: 1,
        resetTime: now + windowMs,
      });
      return next();
    }

    if (record.count >= maxRequests) {
      return sendError(
        res,
        "Too many authentication attempts. Please try again later.",
        undefined,
        429
      );
    }

    record.count += 1;
    return next();
  };
};
