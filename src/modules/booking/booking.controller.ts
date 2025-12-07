import { Request, Response } from "express";
import { sendError } from "../../utils/helper";
import { bookingServices } from "./booking.service";

const createBooking = async (req: Request, res: Response) => {
  try {
    const { message, data } = await bookingServices.createBooking(req.body);

    res.status(200).json({
      success: true,
      message,
      data,
    });
  } catch (err) {
    sendError(res, err);
  }
};

const getAllBooking = async (req: Request, res: Response) => {
  try {
    const { message, data } = await bookingServices.getAllBooking(req);

    res.status(200).json({
      success: true,
      message,
      data,
    });
  } catch (err) {
    console.log(err);
    sendError(res, err);
  }
};

const updateBooking = async (req: Request, res: Response) => {
  try {
    const { message, data } = await bookingServices.updateBooking(req);

    res.status(200).json({
      success: true,
      message,
      data,
    });
  } catch (err) {
    console.log(err);
    sendError(res, err);
  }
};

export const bookingControllers = {
  createBooking,
  getAllBooking,
  updateBooking,
};
