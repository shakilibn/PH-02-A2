import { Request, Response } from "express";
import { authServices } from "./auth.service";
import { sendError } from "../../utils/helper";

const createUser = async (req: Request, res: Response) => {
  try {
    const data = await authServices.createUser(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data,
    });
  } catch (err: any) {
    sendError(res, err);
  }
};

const userSignIn = async (req: Request, res: Response) => {
  try {
    const data = await authServices.userSignIn(req.body);
    res.status(201).json({
      success: true,
      message: "Login successful",
      data,
    });
  } catch (err: any) {
    sendError(res, err);
  }
};

export const authControllers = {
  createUser,
  userSignIn,
};
