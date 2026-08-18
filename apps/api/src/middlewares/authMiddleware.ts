import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../services/authService.js";
import { sendError } from "../utils/responseHandler.js";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
    restaurantId?: string | null;
  };
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return sendError(res, "Access token required", undefined, 401);
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return sendError(res, "Invalid or expired access token", undefined, 403);
  }
};

export const optionalAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (token) {
    try {
      const decoded = verifyToken(token);
      req.user = decoded;
    } catch {
      // Ignore token parse error for optional auth
    }
  }
  next();
};

export const requireRoles = (...allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, "Unauthorized", undefined, 401);
    }
    if (!allowedRoles.includes(req.user.role)) {
      return sendError(res, "Forbidden: insufficient permissions", undefined, 403);
    }
    next();
  };
};
