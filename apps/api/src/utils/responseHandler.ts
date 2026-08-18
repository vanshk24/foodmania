import { Response } from "express";

export const sendSuccess = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode = 200
) => {
  return res.status(statusCode).json({
    status: "ok",
    message,
    ...(data !== undefined && { data }),
  });
};

export const sendError = (
  res: Response,
  message: string,
  error?: any,
  statusCode = 500
) => {
  return res.status(statusCode).json({
    status: "error",
    message,
    ...(error && { error }),
  });
};
