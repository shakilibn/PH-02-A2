import express from "express";
import { vehicleControllers } from "./vehicle.controller";
import checkAuth from "../../middlewares/checkAuth";
import { Roles } from "../auth/auth.constant";

const router = express.Router();

router.post("/", checkAuth(Roles.admin), vehicleControllers.createVehicle);
router.get("/", vehicleControllers.getAllVehicles);

export const vehicleRoutes = router;
