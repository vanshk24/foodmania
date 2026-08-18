import { Request, Response, NextFunction } from "express";
import * as userService from "../services/userService.js";
import { sendSuccess, sendError } from "../utils/responseHandler.js";

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    if (!user) {
      return sendError(res, "User not found", undefined, 404);
    }
    return sendSuccess(res, "User profile fetched", user);
  } catch (error) {
    next(error);
  }
};

export const patchUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = await userService.updateUser(id, req.body);
    return sendSuccess(res, "User profile updated", user);
  } catch (error) {
    next(error);
  }
};
