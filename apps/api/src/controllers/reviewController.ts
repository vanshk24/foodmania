import { Request, Response, NextFunction } from "express";
import * as reviewService from "../services/reviewService.js";
import { sendSuccess, sendError } from "../utils/responseHandler.js";

export const postReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const review = await reviewService.createReview(req.body);
    return sendSuccess(res, "Review submitted successfully", review, 201);
  } catch (error) {
    next(error);
  }
};

export const getReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { restaurantId } = req.query;
    if (!restaurantId) {
      return sendError(res, "restaurantId query param is required", undefined, 400);
    }
    const reviews = await reviewService.getReviews(restaurantId as string);
    return sendSuccess(res, "Reviews retrieved", reviews);
  } catch (error) {
    next(error);
  }
};
