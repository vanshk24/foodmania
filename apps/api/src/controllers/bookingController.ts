import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middlewares/authMiddleware.js";
import * as bookingService from "../services/bookingService.js";
import { sendSuccess, sendError } from "../utils/responseHandler.js";

export const postBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const booking = await bookingService.createBooking(req.body);
    return sendSuccess(res, "Booking confirmed successfully", booking, 201);
  } catch (error) {
    next(error);
  }
};

export const getBookings = async (
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
            return sendError(res, "Forbidden: You cannot access bookings for another restaurant", undefined, 403);
          }
          restaurantId = req.user.restaurantId as any;
        }
      }
    }

    const bookings = await bookingService.getBookings(
      restaurantId as string,
      userId as string
    );
    return sendSuccess(res, "Bookings retrieved", bookings);
  } catch (error) {
    next(error);
  }
};

export const patchBookingStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!id) {
      return sendError(res, "Booking ID or Code is required", undefined, 400);
    }
    if (!status) {
      return sendError(res, "Status is required", undefined, 400);
    }
    const booking = await bookingService.updateBookingStatus(id, status, req.user);
    return sendSuccess(res, "Booking status updated", booking);
  } catch (error: any) {
    if (error.message === "Booking not found") {
      return sendError(res, "Booking not found", undefined, 404);
    }
    if (error.statusCode === 403 || error.message.startsWith("Forbidden")) {
      return sendError(res, error.message, undefined, 403);
    }
    next(error);
  }
};
