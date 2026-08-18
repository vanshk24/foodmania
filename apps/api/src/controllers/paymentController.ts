import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middlewares/authMiddleware.js";
import * as paymentService from "../services/paymentService.js";
import { sendSuccess, sendError } from "../utils/responseHandler.js";

export const postCreatePayment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderId, method, currency } = req.body;
    if (!orderId) {
      return sendError(res, "orderId is required", undefined, 400);
    }

    const payment = await paymentService.createPaymentRecord(
      {
        orderId,
        method,
        currency,
        userId: req.user?.userId,
      },
      req.user
    );

    return sendSuccess(res, "Payment record created (Pending Payment)", payment, 201);
  } catch (error: any) {
    if (error.statusCode) {
      return sendError(res, error.message, undefined, error.statusCode);
    }
    next(error);
  }
};

export const getPaymentById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const payment = await paymentService.getPaymentById(id, req.user);
    return sendSuccess(res, "Payment details fetched", payment);
  } catch (error: any) {
    if (error.statusCode) {
      return sendError(res, error.message, undefined, error.statusCode);
    }
    next(error);
  }
};

export const getPaymentByOrder = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderId } = req.params;
    const payment = await paymentService.getPaymentByOrderId(orderId, req.user);
    if (!payment) {
      return sendError(res, "No payment found for this order", undefined, 404);
    }
    return sendSuccess(res, "Payment details fetched for order", payment);
  } catch (error: any) {
    if (error.statusCode) {
      return sendError(res, error.message, undefined, error.statusCode);
    }
    next(error);
  }
};

export const getPaymentsList = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let { restaurantId, userId, status } = req.query as any;

    if (req.user && req.user.role !== "SUPER_ADMIN") {
      if (req.user.role === "OWNER" || req.user.role === "STAFF") {
        if (req.user.restaurantId) {
          if (restaurantId && restaurantId !== req.user.restaurantId) {
            return sendError(res, "Forbidden: You cannot access payments for another restaurant", undefined, 403);
          }
          restaurantId = req.user.restaurantId;
        }
      } else if (req.user.role === "CUSTOMER") {
        userId = req.user.userId;
      }
    }

    const payments = await paymentService.getAllPayments({
      restaurantId,
      userId,
      status,
    });

    return sendSuccess(res, "Payments list fetched", payments);
  } catch (error: any) {
    next(error);
  }
};

export const patchPaymentStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { status, gatewayOrderId, gatewayPaymentId, gatewaySignature, failureReason } = req.body;

    if (!status) {
      return sendError(res, "status is required", undefined, 400);
    }

    const updated = await paymentService.updatePaymentStatus(
      id,
      status.toUpperCase(),
      { gatewayOrderId, gatewayPaymentId, gatewaySignature, failureReason },
      req.user
    );

    return sendSuccess(res, "Payment status updated", updated);
  } catch (error: any) {
    if (error.statusCode) {
      return sendError(res, error.message, undefined, error.statusCode);
    }
    next(error);
  }
};

export const postDevConfirm = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return sendError(res, "orderId is required", undefined, 400);
    }
    if (!req.user) {
      return sendError(res, "Authentication required", undefined, 401);
    }

    const result = await paymentService.devConfirmPayment(orderId, req.user);
    return sendSuccess(
      res,
      result.alreadyConfirmed
        ? "Payment already confirmed for this order"
        : "Development payment confirmed successfully (SUCCESS & PAID)",
      result
    );
  } catch (error: any) {
    if (error.statusCode) {
      return sendError(res, error.message, undefined, error.statusCode);
    }
    next(error);
  }
};

/**
 * Stub for future Razorpay payment verification in Phase 6.2
 */
export const postVerifyStub = async (
  _req: Request,
  res: Response
) => {
  return res.status(501).json({
    status: "not_implemented",
    message: "Awaiting Phase 6.2 Razorpay integration — payment gateway verification endpoint is not yet active.",
  });
};

/**
 * Stub for future Razorpay webhook in Phase 6.2
 */
export const postWebhookStub = async (
  _req: Request,
  res: Response
) => {
  return res.status(501).json({
    status: "not_implemented",
    message: "Awaiting Phase 6.2 Razorpay integration — payment webhook listener is not yet active.",
  });
};
