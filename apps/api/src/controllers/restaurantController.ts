import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middlewares/authMiddleware.js";
import * as restaurantService from "../services/restaurantService.js";
import { sendSuccess, sendError } from "../utils/responseHandler.js";

export const getRestaurants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { search, city } = req.query;
    const restaurants = await restaurantService.getAllRestaurants(
      search as string,
      city as string
    );
    return sendSuccess(res, "Restaurants fetched successfully", restaurants);
  } catch (error) {
    next(error);
  }
};

export const getRestaurantById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const restaurant = await restaurantService.getRestaurantByIdOrSlug(id);
    if (!restaurant) {
      return sendError(res, "Restaurant not found", undefined, 404);
    }
    return sendSuccess(res, "Restaurant details fetched", restaurant);
  } catch (error) {
    next(error);
  }
};

export const postMenuCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const category = await restaurantService.addMenuCategory(id, name);
    return sendSuccess(res, "Category created", category, 201);
  } catch (error) {
    next(error);
  }
};

export const postMenuItem = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const item = await restaurantService.addMenuItem(
      { ...req.body, restaurantId: id },
      req.user
    );
    return sendSuccess(res, "Menu item created", item, 201);
  } catch (error: any) {
    if (error.statusCode === 403 || error.message.startsWith("Forbidden")) {
      return sendError(res, error.message, undefined, 403);
    }
    next(error);
  }
};

export const patchMenuItem = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { itemId } = req.params;
    const item = await restaurantService.updateMenuItem(itemId, req.body, req.user);
    return sendSuccess(res, "Menu item updated", item);
  } catch (error: any) {
    if (error.message === "Menu item not found") {
      return sendError(res, "Menu item not found", undefined, 404);
    }
    if (error.statusCode === 403 || error.message.startsWith("Forbidden")) {
      return sendError(res, error.message, undefined, 403);
    }
    next(error);
  }
};

export const getRestaurantMenu = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const menu = await restaurantService.getRestaurantMenu(id);
    if (!menu) {
      return sendError(res, "Restaurant not found", undefined, 404);
    }
    return sendSuccess(res, "Restaurant menu fetched", menu);
  } catch (error) {
    next(error);
  }
};

export const deleteMenuItem = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { itemId } = req.params;
    const result = await restaurantService.deleteMenuItem(itemId, req.user);
    return sendSuccess(res, "Menu item deleted successfully", result);
  } catch (error: any) {
    if (error.message === "Menu item not found") {
      return sendError(res, "Menu item not found", undefined, 404);
    }
    if (error.statusCode === 403 || error.message.startsWith("Forbidden")) {
      return sendError(res, error.message, undefined, 403);
    }
    next(error);
  }
};

export const patchTableStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { tableId } = req.params;
    const { status } = req.body;
    if (!status) {
      return sendError(res, "Status is required", undefined, 400);
    }
    const table = await restaurantService.updateTableStatus(tableId, status, req.user);
    return sendSuccess(res, "Table status updated", table);
  } catch (error: any) {
    if (error.message === "Table not found") {
      return sendError(res, "Table not found", undefined, 404);
    }
    if (error.statusCode === 403 || error.message.startsWith("Forbidden")) {
      return sendError(res, error.message, undefined, 403);
    }
    next(error);
  }
};

export const patchRestaurantProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const allowed = ["name", "cuisine", "phone", "address", "city", "imageUrl", "bannerUrl", "deliveryFee", "minOrder"];
    const updateData: Record<string, any> = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updateData[key] = req.body[key];
    }
    const { prisma } = await import("../utils/prisma.js");
    const updated = await prisma.restaurant.update({
      where: { id },
      data: updateData,
    });
    return sendSuccess(res, "Restaurant profile updated", updated);
  } catch (error: any) {
    if (error.code === "P2025") {
      return sendError(res, "Restaurant not found", undefined, 404);
    }
    next(error);
  }
};
