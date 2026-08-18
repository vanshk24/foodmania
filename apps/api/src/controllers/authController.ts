import { Request, Response, NextFunction } from "express";
import * as authService from "../services/authService.js";
import { sendSuccess, sendError } from "../utils/responseHandler.js";
import { AuthenticatedRequest } from "../middlewares/authMiddleware.js";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await authService.registerUser(req.body);
    return sendSuccess(res, "Registration successful", result, 201);
  } catch (error: any) {
    return sendError(res, error.message || "Registration failed", undefined, 400);
  }
};

export const registerRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await authService.registerRestaurant(req.body);
    return sendSuccess(res, "Restaurant registration successful", result, 201);
  } catch (error: any) {
    return sendError(res, error.message || "Restaurant registration failed", undefined, 400);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await authService.loginUser(req.body);
    return sendSuccess(res, "Login successful", result);
  } catch (error: any) {
    return sendError(res, error.message || "Login failed", undefined, 401);
  }
};

export const getMe = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    return sendSuccess(res, "User payload retrieved", req.user);
  } catch (error: any) {
    next(error);
  }
};

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return sendError(res, "Refresh token required", undefined, 400);
    }
    const result = await authService.refreshToken(refreshToken);
    return sendSuccess(res, "Token refreshed", result);
  } catch (error: any) {
    return sendError(res, error.message || "Invalid refresh token", undefined, 401);
  }
};

