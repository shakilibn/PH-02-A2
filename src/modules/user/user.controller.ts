import { Request, Response } from "express";
import { sendError } from "../../utils/helper";
import { userServices } from "./user.service";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { message, data } = await userServices.getAllUsers();

    res.status(200).json({
      success: true,
      message,
      data,
    });
  } catch (err) {
    sendError(res, err);
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { message, data } = await userServices.updateUser(req);

    res.status(200).json({
      success: true,
      message,
      data,
    });
  } catch (err) {
    sendError(res, err);
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { message, data } = await userServices.deleteUser(
      req.params.userId as string
    );

    res.status(200).json({
      success: true,
      message,
      data,
    });
  } catch (err) {
    sendError(res, err);
  }
};

export const userControllers = {
  getAllUsers,
  updateUser,
  deleteUser,
};
