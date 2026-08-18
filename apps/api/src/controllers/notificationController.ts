import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middlewares/authMiddleware.js";
import * as notificationService from "../services/notificationService.js";
import { sendSuccess, sendError } from "../utils/responseHandler.js";

export const getNotifications = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, restaurantId, isRead } = req.query;
    const filter: notificationService.NotificationFilter = {
      userId: userId as string,
      restaurantId: restaurantId as string,
      isRead: isRead !== undefined ? isRead === "true" : undefined,
    };

    const notifications = await notificationService.getNotifications(
      filter,
      req.user as any
    );
    return sendSuccess(res, "Notifications retrieved successfully", notifications);
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (!id) {
      return sendError(res, "Notification ID is required", undefined, 400);
    }

    const updated = await notificationService.markNotificationAsRead(
      id,
      req.user as any
    );
    return sendSuccess(res, "Notification marked as read", updated);
  } catch (error: any) {
    if (error.message === "Notification not found") {
      return sendError(res, "Notification not found", undefined, 404);
    }
    if (error.statusCode === 403 || error.message.startsWith("Forbidden")) {
      return sendError(res, error.message, undefined, 403);
    }
    next(error);
  }
};
