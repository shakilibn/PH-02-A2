import { Response } from "express";

export const sendError = (res: Response, err: any) => {
  res.status(500).json({
    success: false,
    message: err.message,
    errors: err.message,
  });
};
