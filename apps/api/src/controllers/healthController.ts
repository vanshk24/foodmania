import { Request, Response } from "express";

export const getHealth = (_req: Request, res: Response) => {
  return res.status(200).json({
    status: "ok",
    message: "Food Mania Backend Running",
    version: "1.0.0",
  });
};
