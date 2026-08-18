import { Request, Response, NextFunction } from "express";
import * as adminService from "../services/adminService.js";
import { sendSuccess } from "../utils/responseHandler.js";

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await adminService.getAdminUsers();
    return sendSuccess(res, "Admin users list fetched", users);
  } catch (error) {
    next(error);
  }
};

export const patchUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = await adminService.updateAdminUser(id, req.body);
    return sendSuccess(res, "User updated successfully", user);
  } catch (error: any) {
    if (error.message === "User not found") {
      return res.status(404).json({ status: "error", message: "User not found" });
    }
    next(error);
  }
};

export const getRestaurants = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const restaurants = await adminService.getAdminRestaurants();
    return sendSuccess(res, "Admin restaurants list fetched", restaurants);
  } catch (error) {
    next(error);
  }
};

export const postRestaurant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const restaurant = await adminService.createRestaurant(req.body);
    return sendSuccess(res, "Restaurant created successfully", restaurant, 201);
  } catch (error) {
    next(error);
  }
};

export const patchRestaurant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const restaurant = await adminService.updateRestaurant(id, req.body);
    return sendSuccess(res, "Restaurant updated successfully", restaurant);
  } catch (error) {
    next(error);
  }
};

export const deleteRestaurant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ status: "error", message: "Restaurant ID is required" });
    }
    const result = await adminService.deleteRestaurant(id);
    return sendSuccess(res, "Restaurant deleted successfully", result);
  } catch (error: any) {
    if (error.message === "Restaurant not found") {
      return res.status(404).json({ status: "error", message: "Restaurant not found" });
    }
    next(error);
  }
};

export const getSubscriptions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subscriptions = await adminService.getAdminSubscriptions();
    return sendSuccess(res, "Subscriptions list fetched", subscriptions);
  } catch (error) {
    next(error);
  }
};

export const getAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const analytics = await adminService.getAdminAnalytics();
    return sendSuccess(res, "Analytics data fetched", analytics);
  } catch (error) {
    next(error);
  }
};
