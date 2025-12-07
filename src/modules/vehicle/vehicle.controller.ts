import { Request, Response } from "express";
import { sendError } from "../../utils/helper";
import { vehicleServices } from "./vehicle.service";

const createVehicle = async (req: Request, res: Response) => {
  try {
    const data = await vehicleServices.createVehicle(req.body);

    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data,
    });
  } catch (err: any) {
    sendError(res, err);
  }
};

const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const { data, message } = await vehicleServices.getAllVehicles();

    res.status(200).json({
      success: true,
      message,
      data,
    });
  } catch (err: any) {
    sendError(res, err);
  }
};

const getSingleVehicle = async (req: Request, res: Response) => {
  try {
    const { data, message } = await vehicleServices.getSingleVehicle(
      req.params.vehicleId as string
    );

    res.status(200).json({
      success: true,
      message,
      data,
    });
  } catch (err: any) {
    sendError(res, err);
  }
};

const udpateVehicle = async (req: Request, res: Response) => {
  try {
    const { data, message } = await vehicleServices.updateVehicle(
      req.params.vehicleId as string,
      req.body
    );

    res.status(200).json({
      success: true,
      message,
      data,
    });
  } catch (err: any) {
    sendError(res, err);
  }
};

const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const { data, message } = await vehicleServices.deleteVehicle(
      req.params.vehicleId as string
    );

    res.status(200).json({
      success: true,
      message,
      data,
    });
  } catch (err: any) {
    sendError(res, err);
  }
};

export const vehicleControllers = {
  createVehicle,
  getAllVehicles,
  getSingleVehicle,
  udpateVehicle,
  deleteVehicle,
};
