import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middlewares/authMiddleware.js";
import * as orderService from "../services/orderService.js";
import { sendSuccess, sendError } from "../utils/responseHandler.js";

export const postOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const order = await orderService.createOrder(req.body);
    return sendSuccess(res, "Order created successfully", order, 201);
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let { restaurantId, userId } = req.query;

    if (req.user && req.user.role !== "SUPER_ADMIN") {
      if (req.user.role === "OWNER" || req.user.role === "STAFF") {
        if (req.user.restaurantId) {
          if (restaurantId && restaurantId !== req.user.restaurantId) {
            return sendError(res, "Forbidden: You cannot access orders for another restaurant", undefined, 403);
          }
          restaurantId = req.user.restaurantId as any;
        }
      }
    }

    const orders = await orderService.getOrders(
      restaurantId as string,
      userId as string
    );
    return sendSuccess(res, "Orders list fetched", orders);
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const order = await orderService.getOrderById(id);
    if (!order) {
      return sendError(res, "Order not found", undefined, 404);
    }
    return sendSuccess(res, "Order details fetched", order);
  } catch (error) {
    next(error);
  }
};

export const patchOrderStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return sendError(res, "Status is required", undefined, 400);
    }
    const order = await orderService.updateOrderStatus(id, status, req.user);
    return sendSuccess(res, "Order status updated", order);
  } catch (error: any) {
    if (error.message === "Order not found") {
      return sendError(res, "Order not found", undefined, 404);
    }
    if (error.statusCode === 403 || error.message.startsWith("Forbidden")) {
      return sendError(res, error.message, undefined, 403);
    }
    next(error);
  }
};
